import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { DatabaseSync } from "node:sqlite";

const projectRoot = resolve(import.meta.dirname);
const dataDirectory = join(projectRoot, "data");
const databasePath = join(dataDirectory, "inquiries.sqlite");
const port = Number(process.env.PORT || 8780);
const host = process.env.HOST || "127.0.0.1";

mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC, id DESC);
`);

const existingInquiryColumns = new Set(database.prepare("PRAGMA table_info(inquiries)").all().map((column) => column.name));
if (!existingInquiryColumns.has("updated_at")) {
  database.exec("ALTER TABLE inquiries ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''");
  database.exec("UPDATE inquiries SET updated_at = created_at WHERE updated_at = ''");
}
if (!existingInquiryColumns.has("deleted_at")) {
  database.exec("ALTER TABLE inquiries ADD COLUMN deleted_at TEXT DEFAULT NULL");
}

const insertInquiry = database.prepare(`
  INSERT INTO inquiries (category, name, title, content, is_private)
  VALUES (?, ?, ?, ?, ?)
`);
const listInquiries = database.prepare(`
  SELECT id, category, name, title,
         CASE WHEN is_private = 1 THEN '' ELSE content END AS content,
         is_private AS private,
         created_at AS createdAt,
         updated_at AS updatedAt,
         deleted_at AS deletedAt
  FROM inquiries
  WHERE deleted_at IS NULL
  ORDER BY id DESC
  LIMIT 200
`);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 20_000) throw new Error("BODY_TOO_LARGE");
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function normalizeInquiry(body) {
  const categories = new Set(["주차장 이용", "요금·운영시간", "전기차 충전", "정보 정정/제보", "사이트 이용", "기타"]);
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!categories.has(category)) return { error: "문의 유형을 선택해 주세요." };
  if (name.length < 2 || name.length > 24) return { error: "작성자는 2~24자로 입력해 주세요." };
  if (title.length < 2 || title.length > 80) return { error: "제목은 2~80자로 입력해 주세요." };
  if (content.length < 5 || content.length > 1200) return { error: "문의 내용은 5~1200자로 입력해 주세요." };
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(name + title + content)) return { error: "지원하지 않는 제어 문자가 포함되어 있습니다." };

  return {
    category,
    name,
    title,
    content,
    isPrivate: Boolean(body.private)
  };
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === "/api/inquiries" && request.method === "GET") {
    try {
      const category = requestUrl.searchParams.get("category");
      const inquiries = listInquiries.all().filter((item) => !category || category === "all" || item.category === category);
      return sendJson(response, 200, { inquiries });
    } catch (error) {
      console.error("Failed to read inquiries:", error);
      return sendJson(response, 500, { error: "문의 목록을 불러오지 못했습니다." });
    }
  }

  if (pathname === "/api/inquiries" && request.method === "POST") {
    let body;
    try {
      body = await readJson(request);
    } catch (error) {
      const status = error.message === "BODY_TOO_LARGE" ? 413 : 400;
      return sendJson(response, status, { error: status === 413 ? "요청 내용이 너무 큽니다." : "JSON 요청을 확인해 주세요." });
    }

    const inquiry = normalizeInquiry(body);
    if (inquiry.error) return sendJson(response, 400, { error: inquiry.error });

    try {
      const result = insertInquiry.run(inquiry.category, inquiry.name, inquiry.title, inquiry.content, inquiry.isPrivate ? 1 : 0);
      const saved = database.prepare(`
        SELECT id, category, name, title,
               CASE WHEN is_private = 1 THEN '' ELSE content END AS content,
               is_private AS private,
               created_at AS createdAt,
               updated_at AS updatedAt,
               deleted_at AS deletedAt
        FROM inquiries WHERE id = ?
      `).get(result.lastInsertRowid);
      return sendJson(response, 201, { inquiry: saved });
    } catch (error) {
      console.error("Failed to save inquiry:", error);
      return sendJson(response, 500, { error: "문의 저장에 실패했습니다." });
    }
  }

  if (pathname.startsWith("/api/")) {
    if (pathname === "/api/inquiries" && request.method !== "GET" && request.method !== "POST") {
      response.setHeader("Allow", "GET, POST");
      return sendJson(response, 405, { error: "지원하지 않는 요청 방식입니다." });
    }
    return sendJson(response, 404, { error: "API 경로를 찾을 수 없습니다." });
  }

  const trimmedPath = pathname.replace(/^\/+/, "");
  let relativePath = trimmedPath === "" ? "index.html" : trimmedPath;
  if (trimmedPath.endsWith("/")) relativePath = join(trimmedPath, "index.html");
  const normalizedPath = normalize(relativePath).replace(/^([.][.][/\\])+/, "");
  const filePath = resolve(projectRoot, normalizedPath);
  if (filePath !== projectRoot && !filePath.startsWith(projectRoot + sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Buldang parking site: http://${host}:${port}`);
  console.log(`SQLite database: ${databasePath}`);
  console.log("Inquiry table ready (single table: inquiries).");
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
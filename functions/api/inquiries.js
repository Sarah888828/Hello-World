const categories = new Set(["주차장 이용", "요금·운영시간", "전기차 충전", "정보 정정/제보", "사이트 이용", "기타"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function onRequestGet({ request, env }) {
  try {
    const category = new URL(request.url).searchParams.get("category");
    let result;

    if (category && category !== "all") {
      result = await env.DB.prepare(`
        SELECT id, category, name, title,
               CASE WHEN is_private = 1 THEN '' ELSE content END AS content,
               is_private AS private,
               created_at AS createdAt,
               updated_at AS updatedAt,
               deleted_at AS deletedAt
        FROM inquiries
        WHERE deleted_at IS NULL AND category = ?
        ORDER BY id DESC
        LIMIT 200
      `).bind(category).all();
    } else {
      result = await env.DB.prepare(`
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
      `).all();
    }

    return json({ inquiries: result.results });
  } catch (error) {
    console.error("Failed to read D1 inquiries:", error);
    return json({ error: "문의 목록을 불러오지 못했습니다." }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return json({ error: "요청 내용이 너무 큽니다." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "JSON 요청을 확인해 주세요." }, 400);
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "요청 본문은 JSON 객체여야 합니다." }, 400);
  }

  const category = cleanText(body.category);
  const name = cleanText(body.name);
  const title = cleanText(body.title);
  const content = cleanText(body.content);

  if (!categories.has(category)) return json({ error: "문의 유형을 선택해 주세요." }, 400);
  if (name.length < 2 || name.length > 24) return json({ error: "작성자는 2~24자로 입력해 주세요." }, 400);
  if (title.length < 2 || title.length > 80) return json({ error: "제목은 2~80자로 입력해 주세요." }, 400);
  if (content.length < 5 || content.length > 1200) return json({ error: "문의 내용은 5~1200자로 입력해 주세요." }, 400);
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(name + title + content)) {
    return json({ error: "지원하지 않는 제어 문자가 포함되어 있습니다." }, 400);
  }

  try {
    const result = await env.DB.prepare(`
      INSERT INTO inquiries (category, name, title, content, is_private)
      VALUES (?, ?, ?, ?, ?)
    `).bind(category, name, title, content, body.private ? 1 : 0).run();

    const saved = await env.DB.prepare(`
      SELECT id, category, name, title,
             CASE WHEN is_private = 1 THEN '' ELSE content END AS content,
             is_private AS private,
             created_at AS createdAt,
             updated_at AS updatedAt,
             deleted_at AS deletedAt
      FROM inquiries WHERE id = ?
    `).bind(result.meta.last_row_id).first();

    return json({ inquiry: saved }, 201);
  } catch (error) {
    console.error("Failed to save D1 inquiry:", error);
    return json({ error: "문의 저장에 실패했습니다." }, 500);
  }
}
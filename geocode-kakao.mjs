import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(projectRoot, "script.js");
const outputPath = join(projectRoot, "data", "parking-coordinates.json");
const apiKey = process.env.KAKAO_REST_KEY?.trim();

if (!apiKey) {
  console.error("KAKAO_REST_KEY 환경변수가 없습니다. REST API 키를 채팅이나 파일에 넣지 말고 환경변수로 설정해 실행하세요.");
  process.exit(1);
}

const source = await readFile(sourcePath, "utf8");
const arrayMatch = source.match(/const parkingLots = (\[[\s\S]*?\n\]);/);
if (!arrayMatch) throw new Error("script.js에서 parkingLots 목록을 찾지 못했습니다.");

// Project parking data is a literal-only array; evaluate it in an isolated context without loading site code.
const vm = await import("node:vm");
const lots = vm.runInNewContext(arrayMatch[1], Object.create(null), { timeout: 1000 });
const coordinates = [];
const unmatched = [];

for (const lot of lots) {
  const query = `${lot.address}, 천안시, 충청남도`;
  const url = new URL("https://dapi.kakao.com/v2/local/search/address.json");
  url.searchParams.set("query", query);

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` }
  });
  if (!response.ok) {
    throw new Error(`Kakao 주소 검색 실패 (${response.status}) at ${lot.id}. 좌표 파일은 생성하지 않았습니다.`);
  }

  const payload = await response.json();
  const candidate = payload.documents?.[0];
  if (!candidate || !Number.isFinite(Number(candidate.x)) || !Number.isFinite(Number(candidate.y))) {
    unmatched.push({ id: lot.id, name: lot.name, address: lot.address });
    continue;
  }

  const point = {
    id: lot.id,
    name: lot.name,
    address: lot.address,
    longitude: Number(candidate.x),
    latitude: Number(candidate.y),
    matchedAddress: candidate.address_name || candidate.road_address?.address_name || "",
    matchType: candidate.address_type || "unknown",
    source: "Kakao Local address search",
    geocodedAt: new Date().toISOString()
  };

  // Reject coordinates outside Cheonan's broad bounding box to avoid bad city/road-number matches.
  if (point.latitude < 36.5 || point.latitude > 37.1 || point.longitude < 126.8 || point.longitude > 127.5) {
    unmatched.push({ id: lot.id, name: lot.name, address: lot.address, reason: "좌표가 천안시 예상 범위를 벗어남" });
  } else {
    coordinates.push(point);
  }

  await new Promise((resolve) => setTimeout(resolve, 120));
}

if (unmatched.length) {
  console.error(`좌표 확인이 필요한 항목 ${unmatched.length}건이 있습니다:`);
  console.error(JSON.stringify(unmatched, null, 2));
}

if (coordinates.length !== lots.length) {
  console.error(`전체 ${lots.length}곳 중 ${coordinates.length}곳만 자동 매칭했습니다. 불완전한 좌표 파일은 저장하지 않습니다.`);
  process.exit(2);
}

await writeFile(outputPath, `${JSON.stringify({ source: "Kakao Local address search", generatedAt: new Date().toISOString(), count: coordinates.length, coordinates }, null, 2)}\n`, "utf8");
console.log(`${coordinates.length}개 주차장 좌표를 ${outputPath}에 저장했습니다. 주소 매칭 결과를 공식 지도에서 검수한 뒤 사용하세요.`);
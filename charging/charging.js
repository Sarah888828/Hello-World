const chargingStations = [
  {
    id: "central-church-supercharger",
    name: "천안중앙교회 수퍼차저",
    address: "충청남도 천안시 서북구 부대중앙길 27",
    type: "tesla",
    speed: "fast",
    label: "TESLA SUPERCHARGER · V3",
    chargerCount: "6기",
    output: "최대 250kW",
    provider: "Tesla",
    note: "요금·운영시간·차량 이용 조건은 Tesla 앱에서 확인",
    href: "./central-church/"
  },
  {
    id: "dujeong-station-1",
    name: "두정역 제1주차장",
    address: "천안시 서북구 두정동 91-1",
    type: "public",
    speed: "fast",
    label: "공영주차장 · 급속",
    chargerCount: "2기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/두정역%20제1주차장%20전기차%20충전"
  },
  {
    id: "notae-park",
    name: "노태공원 주차장",
    address: "천안시 서북구 노태산로 131",
    type: "public",
    speed: "slow",
    label: "공영주차장 · 완속",
    chargerCount: "2기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/노태공원%20주차장%20전기차%20충전"
  },
  {
    id: "daeheung-temporary",
    name: "대흥로 제1주차장 (임시무료)",
    address: "천안역 ~ 온양나드리 지하도",
    type: "public",
    speed: "fast",
    label: "공영주차장 · 급속",
    chargerCount: "1기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/대흥로%20제1주차장%20전기차%20충전"
  },
  {
    id: "sinbu-5",
    name: "신부 제5주차장",
    address: "천안시 동남구 먹거리11길 12",
    type: "public",
    speed: "mixed",
    label: "공영주차장 · 급속/완속",
    chargerCount: "급속 2기 · 완속 10기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/신부%20제5주차장%20전기차%20충전"
  },
  {
    id: "gwangdeok-2",
    name: "광덕 제2주차장",
    address: "천안시 동남구 광덕면·리 560-2",
    type: "public",
    speed: "mixed",
    label: "공영주차장 · 급속/완속",
    chargerCount: "급속 2기 · 완속 1기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/광덕%20제2주차장%20전기차%20충전"
  },
  {
    id: "seonghwang-road-2",
    name: "성황로 제2주차장",
    address: "형제주유소 ~ 1번국도 직전 구간",
    type: "public",
    speed: "fast",
    label: "공영 노상주차장 · 급속",
    chargerCount: "1기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준 · 노상 면수 변동 가능",
    href: "https://map.naver.com/p/search/성황로%20제2주차장%20전기차%20충전"
  },
  {
    id: "sajik-1",
    name: "사직 제1주차장",
    address: "천안시 동남구 사직동 287-5",
    type: "public",
    speed: "slow",
    label: "공영주차장 · 완속",
    chargerCount: "1기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/사직%20제1주차장%20전기차%20충전"
  },
  {
    id: "seongseong-1",
    name: "성성 제1주차장",
    address: "천안시 서북구 성성동 511-9",
    type: "public",
    speed: "fast",
    label: "공영주차장 · 급속",
    chargerCount: "2기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/성성%20제1주차장%20전기차%20충전"
  },
  {
    id: "anseo-1",
    name: "안서 제1주차장",
    address: "천안시 동남구 안서동 526-39",
    type: "public",
    speed: "fast",
    label: "공영주차장 · 급속",
    chargerCount: "2기",
    output: "출력 현장 확인",
    provider: "현장 안내 확인",
    note: "천안도시공사 현황 기준",
    href: "https://map.naver.com/p/search/안서%20제1주차장%20전기차%20충전"
  }
];

const grid = document.querySelector("#ev-station-grid");
const count = document.querySelector("#ev-count");
const filter = document.querySelector("#ev-type-filter");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function isVisible(station, selected) {
  if (selected === "all") return true;
  if (selected === "public") return station.type === "public";
  if (selected === "tesla") return station.type === "tesla";
  if (selected === "fast") return station.speed === "fast" || station.speed === "mixed";
  if (selected === "slow") return station.speed === "slow" || station.speed === "mixed";
  return true;
}

function render() {
  const visible = chargingStations.filter((station) => isVisible(station, filter.value));
  count.textContent = String(visible.length).padStart(2, "0");
  grid.innerHTML = visible.map((station) => `
    <article class="ev-station-card">
      <div class="ev-station-symbol" aria-hidden="true">⚡</div>
      <div class="ev-station-main">
        <div class="ev-card-tags"><span class="ev-type-tag">${escapeHtml(station.label)}</span><span class="inquiry-status">${station.speed === "slow" ? "완속" : station.speed === "mixed" ? "급속·완속" : "급속"}</span></div>
        <h3>${escapeHtml(station.name)}</h3>
        <p class="ev-station-address">${escapeHtml(station.address)}</p>
        <div class="ev-facts"><span><strong>${escapeHtml(station.chargerCount)}</strong> 충전기</span><span><strong>${escapeHtml(station.output)}</strong></span><span><strong>${escapeHtml(station.provider)}</strong></span></div>
        <p class="ev-card-note">${escapeHtml(station.note)}</p>
      </div>
      <a class="ev-card-link" href="${escapeHtml(station.href)}"${station.href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${station.type === "tesla" ? "상세 정보" : "지도 보기"} <span aria-hidden="true">→</span></a>
    </article>
  `).join("");
}

filter.addEventListener("change", render);
render();
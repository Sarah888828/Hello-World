const publicChargingStations = (window.parkingLots || [])
  .filter((lot) => lot.charger?.exists)
  .map((lot) => {
    const detail = lot.charger.count || "충전기 수량 현장 확인";
    const speed = /급속/.test(detail) && /완속/.test(detail)
      ? "mixed"
      : /급속/.test(detail)
        ? "fast"
        : /완속/.test(detail)
          ? "slow"
          : /급속/.test(lot.capacity)
            ? "fast"
            : "slow";
    const query = encodeURIComponent(`${lot.name} ${lot.address} 전기차 충전`);

    return {
      id: lot.id,
      name: lot.name,
      address: lot.address,
      type: "public",
      speed,
      label: `공영주차장 · ${speed === "mixed" ? "급속/완속" : speed === "fast" ? "급속" : "완속"}`,
      chargerCount: detail,
      output: lot.charger.output || "출력 현장 확인",
      provider: lot.charger.operator || "운영 사업자 현장 확인",
      note: lot.note || "천안도시공사 공식 주차장 현황 기준",
      href: `https://map.naver.com/p/search/${query}`
    };
  });

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
  ...publicChargingStations
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
    <article class="ev-station-card${station.type === "tesla" ? " is-supercharger" : ""}" style="--ev-card-index:${visible.indexOf(station)}">
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

  grid.querySelectorAll(".ev-station-card").forEach((card) => {
    card.addEventListener("animationend", (event) => {
      if (event.animationName === "ev-card-arrive" || event.animationName === "ev-filter-arrive") {
        card.style.animation = "none";
        requestAnimationFrame(() => { card.style.animation = ""; });
      }
    }, { once: true });
  });
}

filter.addEventListener("change", () => {
  render();
  grid.classList.remove("is-filtering");
  void grid.offsetWidth;
  grid.classList.add("is-filtering");
});
render();
const parkingLots = [
  {
    id: "buldang-public",
    name: "불당 제1주차장",
    address: "천안시 서북구 검은들1길 15",
    type: "public",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "24시간 운영",
    capacity: "144면 · 급속 충전기 6기",
    note: "천안도시공사 유료 공영주차장 현황 기준",
    charger: { exists: true, count: "6기 (급속)", output: "100kW", price: "550원/kWh", operator: "환경부", source: "https://www.happecharger.com/maps/stationDetail/ME23B307", verified: "해피차저 충전소 정보 확인 · 실제 결제 요금은 회원/결제 방식에 따라 달라질 수 있음" }
  },
  {
    id: "buldang-2",
    name: "불당 제2주차장",
    address: "천안시 서북구 불당동 735",
    type: "public",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "24시간 운영",
    capacity: "49면",
    note: "천안도시공사 유료 공영주차장 현황 기준",
    charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "buldang-3",
    name: "불당 제3주차장",
    address: "천안시 서북구 불당동 910",
    type: "public",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "운영시간 현장 확인",
    capacity: "57면 · 급속 충전기 2기",
    note: "천안도시공사 무료 노외주차장 현황 기준",
    charger: { exists: true, count: "2기 (급속)", output: "200kW", price: "550원/kWh", operator: "환경부", source: "https://www.happecharger.com/maps/stationDetail/ME20C2b2", verified: "해피차저 충전소 정보 확인 · 실제 결제 요금은 회원/결제 방식에 따라 달라질 수 있음" }
  },
  {
    id: "buldang-4",
    name: "불당 제4주차장",
    address: "천안시 서북구 불당동 970",
    type: "public",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "운영시간 현장 확인",
    capacity: "28면",
    note: "천안도시공사 무료 노외주차장 현황 기준",
    charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "buldang-5",
    name: "불당 제5주차장",
    address: "천안시 서북구 불당동 1543 (불당25로 154)",
    type: "public",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "24시간 운영",
    capacity: "128면",
    note: "천안도시공사 유료 공영주차장 현황 기준. 현장 기준 면수는 변경될 수 있습니다.",
    charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  }
];

let parkingGrid;
let searchInput;
let searchButton;
let sortSelect;
let resultCount;
let emptyState;
let filterButtons = [];
let parkingDialog;
let activeFilter = "all";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function initializeHomepage() {
  parkingGrid = document.querySelector("#parking-grid");
  searchInput = document.querySelector("#search-input");
  searchButton = document.querySelector("#search-button");
  sortSelect = document.querySelector("#sort-select");
  resultCount = document.querySelector("#result-count");
  emptyState = document.querySelector("#empty-state");
  filterButtons = [...document.querySelectorAll(".filter-chip")];
  parkingDialog = document.querySelector("#parking-dialog");

  if (!parkingGrid || !searchInput || !searchButton || !sortSelect || !resultCount || !emptyState || !parkingDialog) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      renderParkingLots();
    });
  });

  searchInput.addEventListener("input", renderParkingLots);
  searchButton.addEventListener("click", renderParkingLots);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") renderParkingLots();
  });
  sortSelect.addEventListener("change", renderParkingLots);
  parkingGrid.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-lot-id]");
    if (detailButton) showParkingDetails(detailButton.dataset.lotId);
  });
  document.querySelector("#dialog-close")?.addEventListener("click", () => parkingDialog.close());
  parkingDialog.addEventListener("click", (event) => {
    if (event.target === parkingDialog) parkingDialog.close();
  });
  document.querySelector("#reset-search")?.addEventListener("click", () => {
    searchInput.value = "";
    activeFilter = "all";
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === "all";
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderParkingLots();
    searchInput.focus();
  });

  renderParkingLots();
}

function getVisibleLots() {
  const query = searchInput.value.trim().toLocaleLowerCase("ko-KR");
  return parkingLots
    .filter((lot) => activeFilter === "all" || lot.type === activeFilter)
    .filter((lot) => !query || `${lot.name} ${lot.address} ${lot.typeLabel} ${lot.charger?.exists ? `전기차 충전 ${lot.charger.count} ${lot.charger.output} 급속 ${lot.charger.price}` : "충전기 없음"}`.toLocaleLowerCase("ko-KR").includes(query))
    .sort((first, second) => sortSelect.value === "capacity"
      ? parseCapacity(first.capacity) - parseCapacity(second.capacity)
      : first.name.localeCompare(second.name, "ko-KR"));
}

function parseCapacity(capacity) {
  return Number(capacity.match(/\d+/)?.[0] ?? 0);
}

function getLotDetailUrl(lot) {
  return `${getBasePath()}parking/${encodeURIComponent(lot.id)}/index.html`;
}

function getBasePath() {
  const currentPath = window.location.pathname;
  const parkingIndex = currentPath.indexOf("/parking/");
  if (parkingIndex >= 0) return currentPath.slice(0, parkingIndex + 1);
  if (currentPath.endsWith("/")) return currentPath;
  return currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
}

function renderParkingDetailPage(lot) {
  const main = document.querySelector("#home");
  document.title = `${lot.name} | 불당 주차`;
  document.querySelector('meta[name="description"]').content = `${lot.name} 위치와 이용 정보를 확인하세요.`;
  document.querySelector(".nav-link.active")?.classList.remove("active");
  document.querySelector('.nav-link[href*="#parking-list"]')?.classList.add("active");
  const charger = lot.charger;
  const chargerRows = charger.exists
    ? `<div><dt>충전기 유무</dt><dd>있음 · ${escapeHtml(charger.count)}</dd></div>
       <div><dt>충전 속도</dt><dd>급속 · ${escapeHtml(charger.output)}</dd></div>
       <div><dt>운영 사업자</dt><dd>${escapeHtml(charger.operator)}</dd></div>
       <div><dt>충전 단가</dt><dd>${escapeHtml(charger.price)}</dd></div>`
    : `<div><dt>충전기 유무</dt><dd>공식 주차장 현황에 등록된 충전기 없음</dd></div>`;
  main.innerHTML = `
    <section class="detail-page-hero">
      <a class="detail-back" href="${getBasePath()}#parking-list"><span aria-hidden="true">←</span> 주차장 목록</a>
      <p class="section-kicker">PARKING DETAILS · CHEONAN</p>
      <h1 class="detail-page-title">${escapeHtml(lot.name)}</h1>
      <p class="detail-page-address">${escapeHtml(lot.address)}</p>
    </section>
    <section class="detail-page-content" aria-label="${escapeHtml(lot.name)} 상세 정보">
      ${lot.id === "buldang-5" ? `
      <figure class="detail-photo-card">
        <img class="detail-parking-photo" src="${getBasePath()}buldang-public-parking.jpg" alt="충청일보 기사에 실린 천안 불당 제5공영주차장 현장 사진" />
        <figcaption><span>불당 제5공영주차장 · 현장 사진</span><a href="https://www.ccdailynews.com/news/articleView.html?idxno=2066845" target="_blank" rel="noreferrer">사진 출처 · 충청일보 ↗</a></figcaption>
      </figure>` : ""}
      <article class="detail-info-card">
        <div class="detail-page-card-heading"><span class="type-tag ${lot.type === "nearby" ? "nearby-tag" : ""}">${escapeHtml(lot.typeLabel)}</span><span class="distance-tag">${escapeHtml(lot.distance)}</span></div>
        <h2>주차장 이용 정보</h2>
        <dl class="detail-info-list">
          <div><dt>주소</dt><dd>${escapeHtml(lot.address)}</dd></div>
          <div><dt>주차요금</dt><dd>${lot.price == null ? "천안도시공사 공식 요금표 확인" : `${lot.price.toLocaleString("ko-KR")}원 / 1시간`}</dd></div>
          <div><dt>운영시간</dt><dd>${escapeHtml(lot.hours)}</dd></div>
          <div><dt>주차 가능 대수</dt><dd>${escapeHtml(lot.capacity)}</dd></div>
          <div><dt>안내</dt><dd>${escapeHtml(lot.note)}</dd></div>
        </dl>
        <h2 class="charger-heading">전기차 충전 안내</h2>
        <dl class="detail-info-list charger-info-list">${chargerRows}</dl>
        ${charger.exists ? `<p class="charger-data-note">${escapeHtml(charger.verified)}. 실제 단가는 충전기 화면에서 결제 전에 확인해 주세요.</p><a class="detail-official-link" href="${escapeHtml(charger.source)}" target="_blank" rel="noreferrer">충전소 상세·실시간 정보 보기 ↗</a>` : `<p class="charger-data-note">천안도시공사 공식 주차장 현황에 전기차 충전기 수량이 표시되지 않습니다. 주변 충전소는 지도에서 확인해 주세요.</p>`}
        <p class="detail-page-disclaimer">주차장 명칭·주소·운영 현황은 천안도시공사 공식 목록을 기준으로 표시했어요. 요금과 운영 조건은 변경될 수 있으니 방문 전에 공식 안내나 현장 표지판을 확인해 주세요.</p>
    <a class="detail-side-note" href="https://www.cauc.or.kr/_parking/main.asp?no=2" target="_blank" rel="noreferrer">주차요금 공식 안내 ↗</a>
        <a class="detail-official-link" href="https://www.cauc.or.kr/_parking/main.asp?no=2" target="_blank" rel="noreferrer">주차요금 공식 안내 ↗</a>
        <a class="detail-map-link" href="https://map.naver.com/p/search/${encodeURIComponent(lot.name + " " + lot.address)}" target="_blank" rel="noreferrer">지도에서 길찾기 <span aria-hidden="true">↗</span></a>
      </article>
      <aside class="detail-side-note"><span class="guide-icon" aria-hidden="true">✳</span><h2>방문 전에 확인해 주세요</h2><p>주차 가능 대수와 요금은 실시간으로 연동되지 않아요. 출발 전 최신 정보를 확인해 주세요.</p><a href="https://www.cheonan.go.kr/" target="_blank" rel="noreferrer">천안시 홈페이지 ↗</a></aside>
    </section>
  `;
  main.classList.add("detail-page");
}

function renderParkingLots() {
  const visibleLots = getVisibleLots();
  resultCount.textContent = String(visibleLots.length).padStart(2, "0");
  emptyState.hidden = visibleLots.length > 0;
  parkingGrid.hidden = visibleLots.length === 0;
  parkingGrid.innerHTML = visibleLots.map((lot) => `
      <article class="parking-card">
      <div class="card-topline">
        <span class="type-tag ${lot.type === "nearby" ? "nearby-tag" : ""}">${escapeHtml(lot.typeLabel)}</span>
        <span class="distance-tag">${escapeHtml(lot.distance)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(lot.name)}</h3>
      <p class="card-address" title="${escapeHtml(lot.address)}">${escapeHtml(lot.address)}</p>
      <div class="card-divider"></div>
      <div class="card-meta"><span>${escapeHtml(lot.priceLabel)}</span><span class="card-price">${lot.price == null ? "공식 안내 확인" : `${lot.price.toLocaleString("ko-KR")}원 / 시간`}</span></div>
      <div class="card-bottom"><span class="hours-label">${escapeHtml(lot.charger.exists ? `⚡ 급속 ${lot.charger.count}` : lot.hours)}</span><a class="detail-button" href="${getLotDetailUrl(lot)}">상세 보기　→</a></div>
    </article>
  `).join("");
}

function showParkingDetails(lotId) {
  const lot = parkingLots.find((item) => item.id === lotId);
  if (!lot) return;

  document.querySelector("#dialog-title").textContent = lot.name;
  document.querySelector("#dialog-address").textContent = lot.address;
  document.querySelector("#dialog-details").innerHTML = [
    ["주차장 종류", lot.typeLabel],
    ["위치 안내", lot.distance],
    ["이용 요금", lot.price == null ? "천안도시공사 공식 요금표 확인" : `${lot.price.toLocaleString("ko-KR")}원 / 1시간`],
    ["운영시간", lot.hours],
    ["주차 가능 대수", lot.capacity],
    ["참고", lot.note]
  ].map(([label, value]) => `<div class="detail-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`).join("");

  const directionsLink = document.querySelector("#dialog-directions");
  directionsLink.href = `https://map.naver.com/p/search/${encodeURIComponent(lot.name + " " + lot.address)}`;
  parkingDialog.showModal();
}

const lotPathMatch = window.location.pathname.match(/\/parking\/([^/]+)\/?$/);
const detailPageId = document.querySelector("#home")?.dataset.parkingLot;
const selectedLotId = detailPageId || (lotPathMatch
  ? decodeURIComponent(lotPathMatch[1])
  : new URLSearchParams(window.location.search).get("lot"));
const selectedLot = parkingLots.find((lot) => lot.id === selectedLotId);

if (selectedLot) {
  renderParkingDetailPage(selectedLot);
} else {
  initializeHomepage();
}
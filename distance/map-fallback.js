const CENTER = { latitude: 36.8109713, longitude: 127.1099504 };
const LAT_SPAN = 0.08;
const LNG_SPAN = 0.1;

function haversineMeters(first, second) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(second.latitude - first.latitude);
  const dLng = radians(second.longitude - first.longitude);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371008.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function schematicPosition(point) {
  return {
    x: Math.max(3, Math.min(97, 50 + ((point.longitude - CENTER.longitude) / LNG_SPAN) * 100)),
    y: Math.max(5, Math.min(95, 50 - ((point.latitude - CENTER.latitude) / LAT_SPAN) * 100))
  };
}

export async function createMeasurementMap(container, onMeasure, onClear) {
  container.replaceChildren();
  container.classList.add("schematic-map");
  const notice = document.createElement("div");
  notice.className = "schematic-map-notice";
  notice.textContent = "천안 주변 개략 선택판 · 실제 지도 타일/정밀좌표 아님";
  const board = document.createElement("div");
  board.className = "schematic-map-board";
  board.setAttribute("role", "application");
  board.setAttribute("aria-label", "개략 지도에서 출발지와 도착지를 선택해 직선거리 측정");
  board.innerHTML = '<div class="schematic-map-roads" aria-hidden="true"><i></i><i></i><i></i><b>천안시</b><span>불당동</span></div><svg class="schematic-map-line" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0"></line></svg><div class="schematic-map-markers"></div>';
  container.append(notice, board);

  const controls = document.createElement("div");
  controls.className = "kakao-map-controls schematic-map-controls";
  controls.innerHTML = '<button type="button" class="map-point-button" aria-pressed="true">출발지 선택</button><button type="button" class="map-point-button" aria-pressed="false">도착지 선택</button>';
  container.after(controls);
  const buttons = [...controls.querySelectorAll("button")];
  const markerLayer = board.querySelector(".schematic-map-markers");
  const svgLine = board.querySelector(".schematic-map-line line");
  const status = document.querySelector("#map-point-status");
  let activePoint = 0;
  let points = [null, null];
  const markers = [null, null];

  function selectPoint(index) {
    activePoint = index;
    buttons.forEach((button, buttonIndex) => button.setAttribute("aria-pressed", String(index === buttonIndex)));
    status.textContent = `출발지/도착지 중 ${index === 0 ? "출발지" : "도착지"}를 선택하세요. 선택한 점은 끌어서 이동할 수 있습니다.`;
  }

  function render() {
    points.forEach((point, index) => {
      if (!point) {
        markers[index]?.remove();
        markers[index] = null;
        return;
      }
      const position = schematicPosition(point);
      let marker = markers[index];
      if (!marker) {
        marker = document.createElement("button");
        marker.type = "button";
        marker.className = `schematic-map-marker marker-${index + 1}`;
        marker.textContent = index === 0 ? "A" : "B";
        marker.setAttribute("aria-label", `${index === 0 ? "출발지" : "도착지"} 위치 마커`);
        marker.addEventListener("pointerdown", (event) => {
          marker.dataset.dragging = "true";
          marker.setPointerCapture(event.pointerId);
          event.preventDefault();
        });
        marker.addEventListener("pointermove", (event) => {
          if (marker.dataset.dragging !== "true") return;
          const rect = board.getBoundingClientRect();
          const x = Math.max(3, Math.min(97, ((event.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(5, Math.min(95, ((event.clientY - rect.top) / rect.height) * 100));
          points[index] = {
            longitude: CENTER.longitude + ((x - 50) / 100) * LNG_SPAN,
            latitude: CENTER.latitude - ((y - 50) / 100) * LAT_SPAN
          };
          marker.style.left = `${x}%`;
          marker.style.top = `${y}%`;
          renderMeasurement();
        });
        const stopDragging = () => { delete marker.dataset.dragging; };
        marker.addEventListener("pointerup", stopDragging);
        marker.addEventListener("pointercancel", stopDragging);
        marker.addEventListener("lostpointercapture", stopDragging);
        marker.addEventListener("click", (event) => { event.stopPropagation(); selectPoint(index); });
        markers[index] = marker;
        markerLayer.append(marker);
      }
      marker.style.left = `${position.x}%`;
      marker.style.top = `${position.y}%`;
    });

    renderMeasurement();
  }

  function renderMeasurement() {
    if (points[0] && points[1]) {
      const first = schematicPosition(points[0]);
      const second = schematicPosition(points[1]);
      svgLine.setAttribute("x1", `${first.x}%`);
      svgLine.setAttribute("y1", `${first.y}%`);
      svgLine.setAttribute("x2", `${second.x}%`);
      svgLine.setAttribute("y2", `${second.y}%`);
      board.classList.add("has-two-points");
      const meters = haversineMeters(points[0], points[1]);
      status.textContent = `두 지점의 개략 직선거리 · ${meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`}. 실제 좌표·도로거리가 아닙니다.`;
      onMeasure?.(meters);
    } else {
      board.classList.remove("has-two-points");
      svgLine.setAttribute("x1", "0");
      svgLine.setAttribute("y1", "0");
      svgLine.setAttribute("x2", "0");
      svgLine.setAttribute("y2", "0");
      onClear?.();
      status.textContent = `개략 선택판에서 ${points[0] ? "출발지는 선택됨 · 도착지" : "출발지"} 위치를 선택하세요.`;
    }
  }

  function setPoint(index, point) {
    points[index] = { latitude: point.latitude, longitude: point.longitude };
    render();
  }

  buttons.forEach((button, index) => button.addEventListener("click", () => selectPoint(index)));
  board.addEventListener("click", (event) => {
    if (event.target.closest(".schematic-map-marker")) return;
    const rect = board.getBoundingClientRect();
    points[activePoint] = {
      longitude: CENTER.longitude + (((event.clientX - rect.left) / rect.width) * 100 - 50) / 100 * LNG_SPAN,
      latitude: CENTER.latitude - (((event.clientY - rect.top) / rect.height) * 100 - 50) / 100 * LAT_SPAN
    };
    render();
    if (activePoint === 0 && !points[1]) selectPoint(1);
  });
  selectPoint(0);

  return {
    setPoint,
    selectPoint,
    focus() {},
    clearDestination() { points[1] = null; render(); selectPoint(1); },
    clear() { points = [null, null]; render(); selectPoint(0); }
  };
}
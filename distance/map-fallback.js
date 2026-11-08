export async function createMeasurementMap(element, onMeasure) {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
  document.head.append(stylesheet);
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  element.replaceChildren();
  element.style.height = "420px";
  element.style.minHeight = "340px";
  element.style.zIndex = "0";
  const map = L.map(element).setView([36.8109713, 127.1099504], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  const controls = document.createElement("div");
  controls.className = "kakao-map-controls";
  controls.innerHTML = '<button type="button" class="map-point-button" aria-pressed="true">출발지 선택</button><button type="button" class="map-point-button" aria-pressed="false">도착지 선택</button>';
  element.after(controls);
  const buttons = [...controls.querySelectorAll("button")];
  let mode = 0;
  let points = [null, null];
  let markers = [null, null];
  let line;
  const status = document.querySelector("#map-point-status");
  function choose(index) {
    mode = index;
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    status.textContent = `지도에서 ${index === 0 ? "출발지" : "도착지"}를 눌러 주세요. 표시된 점은 끌어서 옮길 수 있습니다.`;
  }
  function draw() {
    if (line) map.removeLayer(line);
    if (points.every(Boolean)) {
      line = L.polyline(points, { color: "#3b7564", weight: 4 }).addTo(map);
      const meters = points[0].distanceTo(points[1]);
      status.textContent = `선택한 두 지점의 직선거리 · ${Math.round(meters).toLocaleString("ko-KR")} m`;
      onMeasure(meters);
    }
  }
  function setPoint(index, point) {
    points[index] = L.latLng(point.latitude, point.longitude);
    if (markers[index]) map.removeLayer(markers[index]);
    markers[index] = L.marker(points[index], { draggable: true })
      .bindTooltip(index === 0 ? "출발" : "도착", { permanent: true }).addTo(map);
    markers[index].on("dragend", () => {
      points[index] = markers[index].getLatLng();
      draw();
    });
    draw();
  }
  buttons.forEach((button, index) => button.addEventListener("click", () => choose(index)));
  map.on("click", ({ latlng }) => {
    setPoint(mode, { latitude: latlng.lat, longitude: latlng.lng });
    if (!points[1]) choose(1);
  });
  choose(0);
  return {
    setPoint,
    focus(point) { map.setView([point.latitude, point.longitude], 15); },
    clearDestination() {
      if (markers[1]) map.removeLayer(markers[1]);
      markers[1] = null;
      points[1] = null;
      if (line) map.removeLayer(line);
      choose(1);
    },
    clear() {
      markers.forEach((marker) => marker && map.removeLayer(marker));
      if (line) map.removeLayer(line);
      markers = [null, null];
      points = [null, null];
      choose(0);
    },
  };
}

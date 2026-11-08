const VERIFIED_DESTINATIONS = {
  "buldang-public": {
    latitude: 36.8109713,
    longitude: 127.1099504,
    name: "불당 제1주차장",
    address: "천안시 서북구 검은들1길 15"
  }
};

const $ = (selector) => document.querySelector(selector);
const distanceValue = $("#distance-value");
const distanceStatus = $("#distance-status");
const locateButton = $("#locate-button");
const destinationSelect = $("#destination-select");
const destinationName = $("#destination-name");
const destinationAddress = $("#destination-address");
const naverMapLink = $("#distance-map-link");
const kakaoMapLink = $("#kakao-map-link");
const googleMapLink = $("#google-map-link");
const originSearchInput = $("#origin-search-input");
const originSearchButton = $("#origin-search-button");
const originSearchStatus = $("#origin-search-status");
const originNaverLink = $("#origin-naver-link");
const originKakaoLink = $("#origin-kakao-link");
const kakaoMapElement = $("#kakao-map");
const kakaoMapPlaceholder = $("#kakao-map-placeholder");
const kakaoMapState = $("#kakao-map-state");
const mapPointStatus = $("#map-point-status");
const setCurrentPointButton = $("#set-current-point");
const clearMapPointsButton = $("#clear-map-points");

let selectedDestination = null;
let currentPosition = null;
let kakaoMap = null;
let firstPoint = null;
let secondPoint = null;
let firstPointMarker = null;
let secondPointMarker = null;
let measuredPolyline = null;
let kakaoKey = "";

function haversineMeters(a, b) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const earthRadiusMeters = 6371008.8;
  const deltaLatitude = radians(b.latitude - a.latitude);
  const deltaLongitude = radians(b.longitude - a.longitude);
  const term = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(deltaLongitude / 2) ** 2;
  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(term), Math.sqrt(1 - term));
}

function renderDistance(meters, label) {
  distanceValue.innerHTML = meters >= 1000
    ? `${(meters / 1000).toFixed(2)}<small> km</small>`
    : `${Math.round(meters).toLocaleString("ko-KR")}<small> m</small>`;
  distanceStatus.textContent = `${label} 직선거리입니다. 실제 도로 경로·시간과 다를 수 있습니다.`;
}

function setMapPoint(which, position) {
  if (!kakaoMap || !window.kakao?.maps) return;
  const options = { map: kakaoMap, position };
  if (which === "first") {
    firstPoint = position;
    firstPointMarker?.setMap(null);
    firstPointMarker = new kakao.maps.Marker({ ...options, title: "첫 번째 지점" });
  } else {
    secondPoint = position;
    secondPointMarker?.setMap(null);
    secondPointMarker = new kakao.maps.Marker({ ...options, title: "두 번째 지점" });
  }
  updateMapMeasurement();
}

function updateMapMeasurement() {
  if (!kakaoMap || !firstPoint || !secondPoint) {
    distanceValue.innerHTML = "--<small> km</small>";
    distanceStatus.textContent = "두 점을 지정하면 카카오 지도의 직선거리를 표시합니다. 도로 경로 거리는 아닙니다.";
    mapPointStatus.textContent = `첫 번째 점 ${firstPoint ? "설정됨" : "미설정"} · 두 번째 점 ${secondPoint ? "설정됨" : "미설정"}`;
    return;
  }

  measuredPolyline?.setMap(null);
  measuredPolyline = new kakao.maps.Polyline({
    map: kakaoMap,
    path: [firstPoint, secondPoint],
    strokeWeight: 4,
    strokeColor: "#c7d994",
    strokeOpacity: 0.95,
    strokeStyle: "solid"
  });
  renderDistance(measuredPolyline.getLength(), "선택한 두 지점 사이");
  mapPointStatus.textContent = "두 점을 선으로 연결했습니다. 이 값은 직선거리입니다.";
  const bounds = new kakao.maps.LatLngBounds();
  bounds.extend(firstPoint);
  bounds.extend(secondPoint);
  kakaoMap.setBounds(bounds, 48, 48, 48, 48);
}

function updateDestination() {
  const lot = (window.parkingLots || []).find((item) => item.id === destinationSelect.value);
  if (!lot) return;
  destinationName.textContent = lot.name;
  destinationAddress.textContent = lot.address;
  selectedDestination = VERIFIED_DESTINATIONS[lot.id] || null;
  const query = encodeURIComponent(`${lot.name} ${lot.address}`);
  naverMapLink.href = `https://map.naver.com/p/search/${query}`;
  kakaoMapLink.href = `https://map.kakao.com/?q=${query}`;
  googleMapLink.href = `https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`;
  locateButton.disabled = false;
  locateButton.textContent = destination ? "현재 위치로 거리 측정" : "현재 위치 확인";
  distanceValue.innerHTML = "--<small> km</small>";
  distanceStatus.textContent = selectedDestination
    ? "현재 위치와 불당 제1주차장 주소 대표점 사이 근사 직선거리를 계산합니다."
    : "위치를 확인한 뒤에도 이 주차장의 좌표가 없으면 거리는 표시되지 않습니다. 아래 지도 앱에서 길찾기를 이용하세요.";
  if (kakaoMap && selectedDestination) {
    const center = new kakao.maps.LatLng(selectedDestination.latitude, selectedDestination.longitude);
    setMapPoint("second", center);
  }
}

function requestCurrentLocation() {
  if (!selectedDestination) {
    distanceStatus.textContent = "선택한 주차장의 좌표가 없어 거리를 계산할 수 없습니다. 지도 앱 길찾기를 이용하세요.";
    return;
  }
  if (!window.isSecureContext) {
    distanceStatus.textContent = "현재 위치 측정은 HTTPS 페이지에서만 사용할 수 있습니다.";
    return;
  }
  if (!navigator.geolocation) {
    distanceStatus.textContent = "이 브라우저는 현재 위치 기능을 지원하지 않습니다.";
    return;
  }

  locateButton.disabled = true;
  locateButton.textContent = "위치 확인 중…";
  distanceStatus.textContent = "브라우저의 위치 권한 요청을 기다리고 있습니다. 권한 창이 뜨면 ‘허용’을 선택해 주세요.";
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    currentPosition = { latitude: coords.latitude, longitude: coords.longitude };
    if (selectedDestination) {
      renderDistance(haversineMeters(currentPosition, selectedDestination), "내 위치와 선택한 주차장 사이 근사");
    } else {
      distanceValue.innerHTML = "--<small> km</small>";
      distanceStatus.textContent = "현재 위치는 확인했지만 선택한 주차장의 좌표 자료가 없어 거리를 계산할 수 없습니다. 지도 앱에서 실제 길찾기를 이용해 주세요.";
    }
    locateButton.disabled = false;
    locateButton.textContent = "다시 측정";
    if (kakaoMap) {
      setMapPoint("first", new kakao.maps.LatLng(coords.latitude, coords.longitude));
      kakaoMap.panTo(firstPoint);
    }
  }, (error) => {
    const errors = {
      1: "위치 권한이 거부되었습니다. 브라우저 주소창에서 위치 접근을 허용해 주세요.",
      2: "현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      3: "위치 확인 시간이 초과되었습니다. 다시 시도해 주세요."
    };
    distanceStatus.textContent = errors[error.code] || "현재 위치를 확인할 수 없습니다.";
    if (error.code === 1) {
      distanceStatus.textContent += " 사이트 주소창의 자물쇠/권한 메뉴에서 위치 접근을 허용한 뒤 다시 눌러 주세요.";
    }
    locateButton.disabled = false;
    locateButton.textContent = "현재 위치로 거리 측정";
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
}

function searchOriginOnMaps() {
  const query = originSearchInput.value.trim();
  if (query.length < 2) {
    originSearchStatus.textContent = "출발지 주소나 장소를 두 글자 이상 입력해 주세요.";
    originSearchInput.focus();
    return;
  }
  const encoded = encodeURIComponent(query);
  originNaverLink.href = `https://map.naver.com/p/search/${encoded}`;
  originKakaoLink.href = `https://map.kakao.com/?q=${encoded}`;
  originSearchStatus.textContent = `“${query}”의 지도 검색 결과를 엽니다. 검색 장소의 좌표는 이 페이지로 자동 전달되지 않습니다.`;
  window.open(originNaverLink.href, "_blank", "noopener,noreferrer");
}

async function showLocationPermissionState() {
  if (!navigator.geolocation) {
    distanceStatus.textContent = "이 브라우저에서는 현재 위치 측정을 지원하지 않습니다. 지도 앱 길찾기를 이용하세요.";
    return;
  }
  if (!window.isSecureContext) {
    distanceStatus.textContent = "현재 위치는 HTTPS 웹사이트에서만 측정할 수 있습니다. 주소가 https://로 시작하는지 확인하세요.";
    return;
  }
  if (!navigator.permissions?.query) return;
  try {
    const permission = await navigator.permissions.query({ name: "geolocation" });
    if (permission.state === "denied") {
      distanceStatus.textContent = "위치 권한이 차단되어 있습니다. 주소창 왼쪽 사이트 정보 → 위치 → 허용으로 바꾸고 페이지를 새로고침해 주세요.";
    } else if (permission.state === "prompt") {
      distanceStatus.textContent = "현재 위치로 거리 측정을 누른 뒤, 브라우저 팝업에서 위치 접근을 허용해 주세요.";
    } else if (permission.state === "granted") {
      distanceStatus.textContent = "위치 권한이 허용되어 있습니다. 현재 위치 버튼을 눌러 근사 직선거리를 계산하세요.";
    }
  } catch {
    // Some browsers do not expose geolocation permission state; the button flow still works.
  }
}

async function initializeKakaoMap() {
  try {
    const response = await fetch("/api/config", { cache: "no-store" });
    if (response.ok) {
      const config = await response.json();
      kakaoKey = typeof config.kakaoJavascriptKey === "string" ? config.kakaoJavascriptKey.trim() : "";
    }
  } catch (error) {
    console.warn("Kakao map config unavailable:", error);
  }

  if (!kakaoKey) {
    kakaoMapState.textContent = "Kakao JavaScript 키 설정 필요";
    mapPointStatus.textContent = "현재 위치와 좌표 등록 주차장 사이 직선거리는 사용할 수 있습니다. 지도 마커·두 점 연결은 Kakao 키 설정 후 활성화됩니다.";
    return;
  }

  kakaoMapState.textContent = "Kakao 지도 불러오는 중";
  const sdk = document.createElement("script");
  sdk.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoKey)}&autoload=false`;
  sdk.async = true;
  sdk.onload = () => {
    if (!window.kakao?.maps) {
      kakaoMapState.textContent = "Kakao 지도 SDK 로드 실패";
      mapPointStatus.textContent = "Kakao JavaScript 키와 허용 도메인 설정을 확인해 주세요.";
      return;
    }
    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(36.8109713, 127.1099504);
      kakaoMap = new kakao.maps.Map(kakaoMapElement, { center, level: 4 });
      kakaoMapPlaceholder.hidden = true;
      kakaoMapState.textContent = "Kakao 지도 준비 완료";
      kakaoMap.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
      if (selectedDestination) setMapPoint("second", center);
      kakao.maps.event.addListener(kakaoMap, "click", ({ latLng }) => setMapPoint(firstPoint ? "second" : "first", latLng));
    });
  };
  sdk.onerror = () => {
    kakaoMapState.textContent = "지도 로드 실패 · 키/허용 도메인 확인";
    mapPointStatus.textContent = "Kakao Developers 앱에 현재 사이트 도메인을 등록했는지 확인해 주세요.";
  };
  document.head.append(sdk);
}

function clearMapPoints() {
  firstPointMarker?.setMap(null);
  secondPointMarker?.setMap(null);
  measuredPolyline?.setMap(null);
  firstPoint = null;
  secondPoint = null;
  firstPointMarker = null;
  secondPointMarker = null;
  measuredPolyline = null;
  updateMapMeasurement();
}

destinationSelect.addEventListener("change", updateDestination);
locateButton.addEventListener("click", requestCurrentLocation);
originSearchButton.addEventListener("click", searchOriginOnMaps);
originSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchOriginOnMaps();
  }
});
setCurrentPointButton.addEventListener("click", requestCurrentLocation);
clearMapPointsButton.addEventListener("click", clearMapPoints);

initializeKakaoMap();
updateDestination();
showLocationPermissionState();
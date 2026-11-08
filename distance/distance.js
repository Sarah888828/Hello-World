import * as THREE from "three";

const verifiedDestinations = {
  "buldang-public": {
  latitude: 36.8109713,
  longitude: 127.1099504,
    name: "불당 제1주차장",
    address: "천안시 서북구 검은들1길 15"
  }
};

let destination = verifiedDestinations["buldang-public"];

const sceneElement = document.querySelector("#distance-scene");
const distanceValue = document.querySelector("#distance-value");
const distanceStatus = document.querySelector("#distance-status");
const locateButton = document.querySelector("#locate-button");
const destinationSelect = document.querySelector("#destination-select");
const destinationName = document.querySelector("#destination-name");
const destinationAddress = document.querySelector("#destination-address");
const sceneDestinationName = document.querySelector("#scene-destination-name");
const naverMapLink = document.querySelector("#distance-map-link");
const kakaoMapLink = document.querySelector("#kakao-map-link");
const googleMapLink = document.querySelector("#google-map-link");
const originSearchInput = document.querySelector("#origin-search-input");
const originSearchButton = document.querySelector("#origin-search-button");
const originSearchStatus = document.querySelector("#origin-search-status");
const originNaverLink = document.querySelector("#origin-naver-link");
const originKakaoLink = document.querySelector("#origin-kakao-link");
const kakaoMapElement = document.querySelector("#kakao-map");
const kakaoMapPlaceholder = document.querySelector("#kakao-map-placeholder");
const kakaoMapState = document.querySelector("#kakao-map-state");
const mapPointStatus = document.querySelector("#map-point-status");
const setCurrentPointButton = document.querySelector("#set-current-point");
const clearMapPointsButton = document.querySelector("#clear-map-points");
let renderer;
let scene;
let camera;
let routeLine;
let userMarker;
let kakaoMap;
let firstPointMarker;
let secondPointMarker;
let measuredPolyline;
let firstPoint = null;
let secondPoint = null;

const kakaoJavascriptKey = document.documentElement.dataset.kakaoJavascriptKey?.trim() || "";

function haversineKm(startLat, startLon, endLat, endLon) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const earthRadiusKm = 6371.0088;
  const dLat = radians(endLat - startLat);
  const dLon = radians(endLon - startLon);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(startLat)) * Math.cos(radians(endLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function makeRoad() {
  const geometry = new THREE.PlaneGeometry(12, 4);
  const material = new THREE.MeshStandardMaterial({ color: 0x373a32, roughness: 0.92 });
  const road = new THREE.Mesh(geometry, material);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.02;
  scene.add(road);

  for (let x = -4.8; x <= 4.8; x += 1.6) {
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.025, 0.055),
      new THREE.MeshBasicMaterial({ color: 0xd1d3c1 })
    );
    dash.position.set(x, 0.04, 0);
    scene.add(dash);
  }
}

function makeParkingMarker() {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.95, 0.22, 40),
    new THREE.MeshStandardMaterial({ color: 0xbacc8b, roughness: 0.55, metalness: 0.08 })
  );
  base.name = "parking-marker-base";
  base.position.set(4.7, 0.13, -1.25);
  scene.add(base);

  const pin = new THREE.Mesh(
    new THREE.SphereGeometry(0.33, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xe8f3bd, emissive: 0x566338, emissiveIntensity: 0.6 })
  );
  pin.name = "parking-marker-pin";
  pin.position.set(4.7, 1.05, -1.25);
  scene.add(pin);

  const letter = makeTextSprite("P", "#172015");
  letter.name = "parking-marker-letter";
  letter.position.set(4.7, 1.05, -0.88);
  scene.add(letter);
}

function makeTextSprite(text, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = "800 82px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 64, 69);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(0.5, 0.5, 1);
  return sprite;
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x171915);
  scene.fog = new THREE.Fog(0x171915, 13, 27);

  camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0.8, 8.7, 12.5);
  camera.lookAt(0, 0, 0);

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    sceneElement.prepend(renderer.domElement);
  } catch {
    distanceStatus.textContent = "3D 그래픽을 사용할 수 없어 기본 보기로 표시합니다.";
    return;
  }

  const ambient = new THREE.HemisphereLight(0xe5edcf, 0x24251f, 2.2);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(0xf0f5d6, 3.1);
  keyLight.position.set(-4, 9, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 16),
    new THREE.MeshStandardMaterial({ color: 0x22241e, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.03;
  ground.receiveShadow = true;
  scene.add(ground);
  makeRoad();
  makeParkingMarker();

  const grid = new THREE.GridHelper(20, 20, 0x45493a, 0x2c2f28);
  grid.position.y = 0;
  grid.material.transparent = true;
  grid.material.opacity = 0.38;
  scene.add(grid);

  resizeRenderer();
  window.addEventListener("resize", resizeRenderer);
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
}

function resizeRenderer() {
  if (!renderer || !camera) return;
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

let lastPosition = null;

function updateDistance(lat, lon) {
  lastPosition = { latitude: lat, longitude: lon };
  const km = haversineKm(lat, lon, destination.latitude, destination.longitude);
  distanceValue.innerHTML = `${km < 1 ? Math.round(km * 1000).toLocaleString("ko-KR") : km.toFixed(2)}<small> ${km < 1 ? "m" : "km"}</small>`;
  distanceStatus.textContent = "현재 위치 기준 직선거리입니다.";

  if (routeLine) {
    scene.remove(routeLine);
    routeLine.geometry.dispose();
    routeLine.material.dispose();
  }
  if (userMarker) {
    scene.remove(userMarker);
    userMarker.geometry.dispose();
    userMarker.material.dispose();
  }

  const end = new THREE.Vector3(4.7, 0.28, -1.25);
  const scale = Math.max(0.65, Math.min(1, 7.5 / (km + 0.0001)));
  const start = new THREE.Vector3(-4.7 * scale, 0.28, 1.25 * scale);
  routeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([start, end]),
    new THREE.LineDashedMaterial({ color: 0xdceaa8, dashSize: 0.28, gapSize: 0.16, linewidth: 2 })
  );
  routeLine.computeLineDistances();
  scene.add(routeLine);

  userMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0x78cae3, emissive: 0x164255, emissiveIntensity: 0.9 })
  );
  userMarker.position.copy(start);
  userMarker.position.y = 0.4;
  scene.add(userMarker);
  sceneElement.classList.add("has-location");
}

function updateDestination() {
  const lot = (window.parkingLots || []).find((item) => item.id === destinationSelect.value);
  if (!lot) return;

  destinationName.textContent = lot.name;
  destinationAddress.textContent = lot.address;
  sceneDestinationName.textContent = lot.name;
  const search = `${lot.name} ${lot.address}`;
  naverMapLink.href = `https://map.naver.com/p/search/${encodeURIComponent(search)}`;
  kakaoMapLink.href = `https://map.kakao.com/?q=${encodeURIComponent(search)}`;
  googleMapLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(search)}&travelmode=driving`;

  destination = verifiedDestinations[lot.id] || null;
  const parkingMarker = scene?.getObjectByName("parking-marker-base");
  const parkingPin = scene?.getObjectByName("parking-marker-pin");
  const parkingLetter = scene?.getObjectByName("parking-marker-letter");
  const hasVerifiedCoordinates = Boolean(destination);
  if (parkingMarker) parkingMarker.visible = hasVerifiedCoordinates;
  if (parkingPin) parkingPin.visible = hasVerifiedCoordinates;
  if (parkingLetter) parkingLetter.visible = hasVerifiedCoordinates;
  if (!destination) {
    distanceValue.innerHTML = '--<small> km</small>';
    distanceStatus.textContent = "이 주차장의 정확한 좌표는 아직 확인되지 않아 직선거리를 계산할 수 없습니다. 지도에서 실제 길찾기를 이용해 주세요.";
    locateButton.disabled = true;
    locateButton.textContent = "직선거리 좌표 미등록";
    if (routeLine && scene) {
      scene.remove(routeLine);
      routeLine.geometry.dispose();
      routeLine.material.dispose();
      routeLine = null;
    }
    if (userMarker && scene) {
      scene.remove(userMarker);
      userMarker.geometry.dispose();
      userMarker.material.dispose();
      userMarker = null;
    }
    sceneElement.classList.remove("has-location");
    return;
  }

  locateButton.disabled = false;
  locateButton.innerHTML = lastPosition
    ? '다시 측정 <span aria-hidden="true">↻</span>'
    : '현재 위치로 거리 측정 <span aria-hidden="true">↗</span>';
  if (lastPosition) updateDistance(lastPosition.latitude, lastPosition.longitude);
  distanceStatus.textContent = "위치 권한을 허용하면 근사 직선거리를 계산할 수 있어요.";
}

function searchOriginOnMaps(openNaver = true) {
  const query = originSearchInput.value.trim();
  if (query.length < 2) {
    originSearchStatus.textContent = "출발지 주소나 장소를 두 글자 이상 입력해 주세요.";
    originSearchInput.focus();
    return;
  }

  const encodedQuery = encodeURIComponent(query);
  originNaverLink.href = `https://map.naver.com/p/search/${encodedQuery}`;
  originKakaoLink.href = `https://map.kakao.com/?q=${encodedQuery}`;
  originSearchStatus.textContent = `“${query}” 검색 결과에서 정확한 출발지를 선택해 주세요. 장소를 선택해도 이 페이지의 거리 계산 좌표는 자동 변경되지 않습니다.`;
  if (openNaver) window.open(originNaverLink.href, "_blank", "noopener,noreferrer");
}

function updateMapDistance() {
  if (!firstPoint || !secondPoint || !window.kakao?.maps?.services) {
    distanceValue.innerHTML = '--<small> km</small>';
    distanceStatus.textContent = "지도에서 두 점을 지정하면 직선거리를 계산합니다. 실제 도로 경로 거리가 아닙니다.";
    mapPointStatus.textContent = `첫 번째 점: ${firstPoint ? "설정됨" : "미설정"} · 두 번째 점: ${secondPoint ? "설정됨" : "미설정"}`;
    return;
  }

  const path = [firstPoint, secondPoint];
  if (measuredPolyline) measuredPolyline.setMap(null);
  measuredPolyline = new kakao.maps.Polyline({
    map: kakaoMap,
    path,
    strokeWeight: 4,
    strokeColor: "#c7d994",
    strokeOpacity: 0.95,
    strokeStyle: "solid"
  });
  const meters = measuredPolyline.getLength();
  distanceValue.innerHTML = meters >= 1000
    ? `${(meters / 1000).toFixed(2)}<small> km</small>`
    : `${Math.round(meters)}<small> m</small>`;
  distanceStatus.textContent = "카카오 지도 두 점 사이 직선거리입니다. 도로 경로 거리·시간이 아닙니다.";
  mapPointStatus.textContent = "두 점을 연결했습니다. 선은 직선거리 측정이며 실제 도로 경로가 아닙니다.";
  const bounds = new kakao.maps.LatLngBounds();
  bounds.extend(firstPoint);
  bounds.extend(secondPoint);
  kakaoMap.setBounds(bounds, 48, 48, 48, 48);
}

function setMapPoint(which, position) {
  const markerOptions = { map: kakaoMap, position };
  if (which === "first") {
    firstPoint = position;
    if (firstPointMarker) firstPointMarker.setMap(null);
    firstPointMarker = new kakao.maps.Marker({ ...markerOptions, title: "첫 번째 지점" });
  } else {
    secondPoint = position;
    if (secondPointMarker) secondPointMarker.setMap(null);
    secondPointMarker = new kakao.maps.Marker({ ...markerOptions, title: "두 번째 지점" });
  }
  updateMapDistance();
}

function initializeKakaoMap() {
  if (!kakaoJavascriptKey) {
    kakaoMapState.textContent = "Kakao JavaScript 키 설정 필요";
    mapPointStatus.textContent = "카카오 지도 SDK 키가 아직 설정되지 않았습니다. 아래 설정 안내를 확인해 주세요.";
    return;
  }

  kakaoMapState.textContent = "Kakao 지도 불러오는 중";
  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoJavascriptKey)}&autoload=false`;
  script.async = true;
  script.onload = () => {
    if (!window.kakao?.maps) {
      kakaoMapState.textContent = "Kakao 지도 SDK를 불러오지 못했습니다";
      return;
    }
    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(destination.latitude, destination.longitude);
      kakaoMap = new kakao.maps.Map(kakaoMapElement, { center, level: 4 });
      kakaoMapPlaceholder.hidden = true;
      kakaoMapState.textContent = "지도 준비 완료 · 클릭해 두 번째 점 지정";
      kakaoMap.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
      setMapPoint("first", center);
      kakao.maps.event.addListener(kakaoMap, "click", (mouseEvent) => setMapPoint("second", mouseEvent.latLng));
      setCurrentPointButton.addEventListener("click", () => {
        if (!navigator.geolocation) {
          mapPointStatus.textContent = "이 브라우저에서는 현재 위치 기능을 지원하지 않습니다.";
          return;
        }
        mapPointStatus.textContent = "현재 위치 권한을 기다리는 중입니다.";
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          setMapPoint("first", position);
          kakaoMap.panTo(position);
        }, (error) => {
          mapPointStatus.textContent = error.code === 1
            ? "위치 권한이 거부되었습니다. 브라우저 설정에서 허용하거나 지도를 클릭해 첫 번째 점을 지정하세요."
            : "현재 위치를 확인하지 못했습니다. 지도를 클릭해 첫 번째 점을 지정할 수 있습니다.";
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
      });
      clearMapPointsButton.addEventListener("click", () => {
        firstPoint = null;
        secondPoint = null;
        firstPointMarker?.setMap(null);
        secondPointMarker?.setMap(null);
        measuredPolyline?.setMap(null);
        firstPointMarker = null;
        secondPointMarker = null;
        measuredPolyline = null;
        updateMapDistance();
      });
    });
  };
  script.onerror = () => {
    kakaoMapState.textContent = "지도 로드 실패 · 키와 허용 도메인을 확인해 주세요";
    mapPointStatus.textContent = "Kakao Developers 앱의 JavaScript 키와 사이트 도메인 등록이 필요합니다.";
  };
  document.head.append(script);
}

function requestLocation() {
  if (!destination) {
    distanceStatus.textContent = "선택한 주차장은 좌표가 확인되지 않아 거리를 계산할 수 없습니다. 네이버·카카오·Google 지도 길찾기를 이용해 주세요.";
    return;
  }

  if (!navigator.geolocation) {
  distanceStatus.textContent = `현재 위치 기준 근사 직선거리 · ${destination.name}`;
    return;
  }
  if (!window.isSecureContext) {
    distanceStatus.textContent = "안전한 HTTPS 페이지에서 위치를 측정할 수 있습니다.";
    return;
  }

  locateButton.disabled = true;
  locateButton.textContent = "위치 확인 중…";
  distanceStatus.textContent = "브라우저의 위치 권한 요청을 기다리고 있습니다.";
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      updateDistance(coords.latitude, coords.longitude);
      locateButton.disabled = false;
      locateButton.innerHTML = '다시 측정 <span aria-hidden="true">↻</span>';
    },
    (error) => {
      const messages = {
        1: "위치 권한이 거부되었습니다. 브라우저 주소창에서 위치 접근을 허용해 주세요.",
        2: "현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        3: "위치 확인 시간이 초과되었습니다. 다시 시도해 주세요."
      };
      distanceStatus.textContent = messages[error.code] || "위치를 확인할 수 없습니다.";
      locateButton.disabled = false;
      locateButton.innerHTML = '현재 위치로 거리 측정 <span aria-hidden="true">↗</span>';
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
  );
}

try {
  if (sceneElement) initScene();
} catch (error) {
  console.error("Three.js initialization failed:", error);
  sceneElement.classList.add("scene-unavailable");
  distanceStatus.textContent = "3D 장면을 불러오지 못했습니다. 거리 측정은 계속 사용할 수 있습니다.";
}

initializeKakaoMap();
updateDestination();
destinationSelect.addEventListener("change", updateDestination);
locateButton.addEventListener("click", requestLocation);
originSearchButton.addEventListener("click", () => searchOriginOnMaps(true));
originSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchOriginOnMaps(true);
  }
});
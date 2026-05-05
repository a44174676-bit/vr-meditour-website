const buildings = [
  {
    code: "A",
    name: "글로벌센터",
    en: "Global Center",
    type: "평생교육원 A302",
    query: "부산외국어대학교 글로벌센터",
    pin: { left: 31, top: 49 },
    summary: "공식 오시는 길 기준 평생교육원은 글로벌센터 A302호입니다. 처음 테스트할 대표 목적지로 가장 적합합니다.",
    floors: ["A302 평생교육원", "1F 복지매장·편의시설", "건물 입구 사진은 공식 오시는 길 자료 기준으로 확인"]
  },
  {
    code: "B",
    name: "체육관",
    en: "Gymnasium",
    type: "체육·행사 시설",
    query: "부산외국어대학교 체육관",
    pin: { left: 36, top: 40 },
    summary: "체육 수업, 행사, 체육시설 방문 목적지입니다.",
    floors: ["체육·행사 시설", "세부 실내 위치는 현장 표지판 확인"]
  },
  {
    code: "C",
    name: "기숙사",
    en: "Dormitory",
    type: "생활관",
    query: "부산외국어대학교 기숙사",
    pin: { left: 25, top: 33 },
    summary: "학생 생활관 및 기숙사 관련 안내 목적지입니다.",
    floors: ["기숙사·생활관", "사감실·세탁실 등은 현장 안내 기준 확인"]
  },
  {
    code: "D",
    name: "트리니티홀",
    en: "Trinity Hall",
    type: "강의·연구 시설",
    query: "부산외국어대학교 트리니티홀",
    pin: { left: 47, top: 21 },
    summary: "강의실, 연구실, 학과 관련 방문에 사용하는 목적지입니다.",
    floors: ["강의·연구 시설", "학과·강의실 세부 위치는 시간표 또는 현장 표지판 확인"]
  },
  {
    code: "E",
    name: "메모리얼광장",
    en: "Memorial Square",
    type: "광장·편의시설",
    query: "부산외국어대학교 메모리얼광장",
    pin: { left: 57, top: 35 },
    summary: "캠퍼스 중앙 이동 기준점으로 쓰기 좋은 공간입니다.",
    floors: ["B1F 학생식당·카페", "장애인전용 엘리베이터"]
  },
  {
    code: "F",
    name: "대학본부",
    en: "University Headquarters",
    type: "행정 시설",
    query: "부산외국어대학교 대학본부",
    pin: { left: 66, top: 31 },
    summary: "학사·행정 민원, 학교 본부 방문 목적지입니다.",
    floors: ["행정·학사 관련 부서", "방문 전 담당 부서와 층수 확인 권장"]
  },
  {
    code: "G",
    name: "만오기념관",
    en: "Manoh Memorial Hall",
    type: "기념관·강의 시설",
    query: "부산외국어대학교 만오기념관",
    pin: { left: 63, top: 24 },
    summary: "강의, 행사, 기념관 관련 방문 목적지입니다.",
    floors: ["기념관·강의 시설", "세부 호실은 현장 안내 기준 확인"]
  },
  {
    code: "H",
    name: "도서관",
    en: "Library",
    type: "학습 시설",
    query: "부산외국어대학교 도서관",
    pin: { left: 61, top: 14 },
    summary: "자료 열람, 학습, 스터디, 도서관 서비스 이용 목적지입니다.",
    floors: ["도서관·열람 공간", "자료실·스터디룸·프린터 위치는 현장 안내 기준 확인"]
  },
  {
    code: "I",
    name: "비즈니스텍센터",
    en: "Business Tech Center",
    type: "교육·비즈니스 시설",
    query: "부산외국어대학교 비즈니스텍센터",
    pin: { left: 72, top: 16 },
    summary: "비즈니스·기술·교육 관련 시설 방문 목적지입니다.",
    floors: ["교육·비즈니스 관련 시설", "세부 호실은 현장 안내 기준 확인"]
  },
  {
    code: "J",
    name: "건학관 VR",
    en: "Founding Hall VR",
    type: "건학관·VR 관련 지점",
    query: "부산외국어대학교 건학관",
    pin: { left: 49, top: 65 },
    summary: "건학관 및 VR 관련 안내 목적지입니다.",
    floors: ["건학관", "VR 관련 위치는 현장 안내 기준 확인"]
  }
];

let selected = buildings[0];
let currentPosition = null;
let watchId = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function renderBuildings() {
  const buttons = $("#buildingButtons");
  const pins = $("#mapPins");

  buttons.innerHTML = buildings.map((building) => `
    <button type="button" data-building="${building.code}" role="listitem">
      <span class="building-code">${building.code}</span>
      <span>${building.name}<br><small>${building.en}</small></span>
    </button>
  `).join("");

  pins.innerHTML = buildings.map((building) => `
    <button
      type="button"
      class="map-pin"
      data-building="${building.code}"
      style="left:${building.pin.left}%;top:${building.pin.top}%"
      aria-label="${building.code} ${building.name} 선택"
    >${building.code}</button>
  `).join("");
}

function selectBuilding(code) {
  selected = buildings.find((building) => building.code === code) || buildings[0];

  $$("[data-building]").forEach((button) => {
    button.classList.toggle("active", button.dataset.building === selected.code);
  });

  $("#selectedName").textContent = `${selected.code} ${selected.name}`;
  $("#selectedMeta").textContent = `${selected.en} · ${selected.type}`;
  $("#selectedSummary").textContent = selected.summary;
  $("#floorInfo").innerHTML = selected.floors.map((floor, index) => `
    <div class="floor-row">
      <strong>${index === 0 ? "주요" : `정보 ${index}`}</strong>
      <span>${floor}</span>
    </div>
  `).join("");

  updateDirectionLinks();
}

function updateSecureNotice() {
  const notice = $("#secureNotice");
  if (location.protocol === "https:" || location.hostname === "localhost") {
    notice.textContent = "현재 접속 환경은 GPS 사용이 가능한 보안 환경입니다.";
    return;
  }
  notice.textContent = "주의: 휴대폰 GPS는 보통 HTTPS 환경에서만 정상 작동합니다. 배포 주소가 https:// 로 시작하는지 확인하세요.";
}

function getOriginText() {
  if (!currentPosition) return "";
  const { latitude, longitude } = currentPosition.coords;
  return `${latitude},${longitude}`;
}

function updateDirectionLinks() {
  const destination = encodeURIComponent(selected.query);
  const origin = getOriginText();
  const googleUrl = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${destination}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${destination}`;

  $("#googleDirection").href = googleUrl;
  $("#naverDirection").href = `https://map.naver.com/v5/search/${destination}`;
  $("#kakaoDirection").href = `https://map.kakao.com/link/search/${destination}`;
}

function locateOnce() {
  if (!navigator.geolocation) {
    $("#locationStatus").textContent = "이 브라우저는 GPS 위치 확인을 지원하지 않습니다.";
    return;
  }

  $("#locationStatus").textContent = "현재 위치를 확인하는 중입니다...";

  navigator.geolocation.getCurrentPosition(
    handlePosition,
    handlePositionError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

function toggleWatch() {
  if (!navigator.geolocation) {
    $("#locationStatus").textContent = "이 브라우저는 GPS 위치 확인을 지원하지 않습니다.";
    return;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    $("#watchBtn").textContent = "실시간 위치 추적";
    $("#locationStatus").textContent = currentPosition
      ? "실시간 추적을 중지했습니다. 마지막 위치를 기준으로 길찾기를 사용할 수 있습니다."
      : "실시간 추적을 중지했습니다.";
    return;
  }

  $("#watchBtn").textContent = "위치 추적 중지";
  $("#locationStatus").textContent = "실시간 위치를 추적하는 중입니다...";

  watchId = navigator.geolocation.watchPosition(
    handlePosition,
    handlePositionError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
  );
}

function handlePosition(position) {
  currentPosition = position;
  const { latitude, longitude, accuracy } = position.coords;
  $("#locationStatus").textContent = `현재 위치 확인 완료: 위도 ${latitude.toFixed(6)}, 경도 ${longitude.toFixed(6)}`;
  $("#accuracyStatus").textContent = `정확도: 약 ${Math.round(accuracy)}m`;
  updateDirectionLinks();
}

function handlePositionError(error) {
  const messages = {
    1: "위치 권한이 거부되었습니다. 휴대폰 브라우저 설정에서 위치 권한을 허용해 주세요.",
    2: "현재 위치를 확인할 수 없습니다. 실외 또는 창가에서 다시 시도해 주세요.",
    3: "위치 확인 시간이 초과되었습니다. 다시 시도해 주세요."
  };
  $("#locationStatus").textContent = messages[error.code] || "위치 확인 중 오류가 발생했습니다.";
}

document.addEventListener("DOMContentLoaded", () => {
  renderBuildings();
  updateSecureNotice();
  selectBuilding("A");

  $("#locateBtn").addEventListener("click", locateOnce);
  $("#watchBtn").addEventListener("click", toggleWatch);

  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-building]");
    if (button) {
      selectBuilding(button.dataset.building);
      $("#selectedName").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

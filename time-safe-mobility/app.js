const LANGS = ["ko", "en", "vi", "jp", "cn"];
const MODES = ["mobility", "meet", "family", "help"];
const DEFAULT_PLACE = "MEET-SEOMYEON-EXIT07";

const places = {
  "MEET-SEOMYEON-EXIT07": {
    id: "MEET-SEOMYEON-EXIT07",
    code: "SEOMYEON07",
    category: "meeting",
    floor: "B1",
    name: {
      ko: "서면역 데모 7번 출구",
      en: "Seomyeon Station Demo Exit 7",
      vi: "Lối ra Demo số 7 Ga Seomyeon",
      jp: "西面駅デモ7番出口",
      cn: "西面站演示7号出口"
    },
    meetingPoint: {
      ko: "7번 출구 계단 앞 데모 만남구역",
      en: "Demo meeting area in front of Exit 7 stairs",
      vi: "Khu vực hẹn Demo trước cầu thang Lối ra 7",
      jp: "7番出口階段前のデモ待ち合わせエリア",
      cn: "7号出口楼梯前演示会合区"
    },
    addressKo: "부산광역시 부산진구 서면역 인근 데모 장소"
  },
  "MEET-HAEUNDAE-LOBBY": {
    id: "MEET-HAEUNDAE-LOBBY",
    code: "HAEUNDAELOBBY",
    category: "safePlace",
    floor: "1F",
    name: {
      ko: "해운대 데모 호텔 로비",
      en: "Haeundae Demo Hotel Lobby",
      vi: "Sảnh Khách sạn Demo Haeundae",
      jp: "海雲台デモホテルロビー",
      cn: "海云台演示酒店大堂"
    },
    meetingPoint: {
      ko: "1층 안내데스크 앞",
      en: "In front of the first-floor information desk",
      vi: "Trước quầy thông tin tầng 1",
      jp: "1階インフォメーションデスク前",
      cn: "一楼服务台前"
    },
    addressKo: "부산광역시 해운대구 데모로 000"
  },
  "MEET-AIRPORT-GATE01": {
    id: "MEET-AIRPORT-GATE01",
    code: "GIMHAEGATE01",
    category: "airport",
    floor: "1F",
    name: {
      ko: "김해공항 데모 만남구역",
      en: "Gimhae Airport Demo Meeting Point",
      vi: "Điểm hẹn Demo tại Sân bay Gimhae",
      jp: "金海空港デモ待ち合わせエリア",
      cn: "金海机场演示会合区"
    },
    meetingPoint: {
      ko: "도착장 데모 게이트 1 앞",
      en: "In front of Demo Arrival Gate 1",
      vi: "Trước Cổng đến Demo số 1",
      jp: "到着ロビーデモゲート1前",
      cn: "到达大厅演示1号门前"
    },
    addressKo: "부산광역시 강서구 공항진입로 데모 구역"
  }
};

const appointments = {
  "APT-CLINIC-001": {
    id: "APT-CLINIC-001",
    category: "clinic",
    destinationName: {
      ko: "서면 데모 메디컬센터",
      en: "Seomyeon Demo Medical Center",
      vi: "Trung tâm Y tế Demo Seomyeon",
      jp: "西面デモメディカルセンター",
      cn: "西面演示医疗中心"
    },
    addressKo: "부산광역시 부산진구 중앙대로 000",
    date: "2026-07-15",
    time: "14:00",
    recommendedArrivalTime: "13:45",
    averageTravelMinutes: 35,
    bufferMinutes: 15
  }
};

const patent = {
  status: "Patent Application Filed",
  number: "10-2026-0127688",
  date: "2026.07.11",
  title: {
    ko: "자산 식별정보 기반 위치확인 및 안전정보 공유 시스템",
    en: "Location Verification and Safety Information Sharing System Based on Asset Identification Information",
    vi: "Hệ thống xác nhận vị trí và chia sẻ thông tin an toàn dựa trên mã nhận dạng tài sản",
    jp: "資産識別情報に基づく位置確認および安全情報共有システム",
    cn: "基于资产识别信息的位置确认及安全信息共享系统"
  }
};

const T = {
  ko: {
    languageLabel: "언어",
    navCompany: "회사소개",
    navTours: "방한상품",
    navTrust: "신뢰센터",
    navFaq: "FAQ",
    navContact: "상담",
    privacy: "개인정보처리방침",
    footerNotice: "병원이 아닙니다 · 진단하지 않습니다 · QR 기반 안심 이동 PoC 서비스 페이지",
    eyebrow: "QR 기반 안심 이동 PoC",
    hero: "Time-Safe Mobility QR",
    subhero: "주변 공유모빌리티 또는 안전표지 QR을 스캔하여 현재 위치를 확인하고, 일행 또는 가족에게 제한적으로 공유할 수 있는 PoC입니다.",
    patentBadge: "특허출원 중",
    patentNo: "출원번호",
    patentDate: "출원일",
    invention: "발명의 명칭",
    startScan: "QR 스캔 시작",
    uploadQr: "QR 이미지 업로드",
    scanGuide: "카메라 권한을 허용한 뒤 QR을 가이드 박스 안에 맞춰 주세요.",
    stopScan: "스캔 종료",
    cancel: "취소",
    permissionDenied: "카메라 권한이 거부되었거나 사용할 수 없습니다. QR 이미지 업로드를 이용해 주세요.",
    unsupported: "이 브라우저에서는 카메라 QR 인식이 제한될 수 있습니다. 이미지 업로드 fallback을 이용해 주세요.",
    uploadFail: "업로드한 이미지에서 QR을 읽지 못했습니다.",
    scanComplete: "스캔 완료",
    scannedRaw: "인식된 QR 원문",
    linkedPlace: "연결된 안전 위치",
    recentCheck: "최근 확인 위치",
    checkedAt: "위치 확인 시각",
    safetyStatus: "안전상태 선택",
    shareCompanion: "동행자에게 공유",
    notifyFamily: "가족에게 안심 알리기",
    requestHelp: "도움 요청하기",
    genericQr: "일반 QR로 인식되었습니다. 데모 위치와 직접 연결되지는 않았습니다.",
    ask: "무엇을 도와드릴까요?",
    mobility: "예약 장소로 이동하기",
    mobilityDesc: "예약시간, 도착 권장시간, 기사에게 보여줄 주소를 확인합니다.",
    meet: "일행과 만나기",
    meetDesc: "확인된 고정 만남지점을 동행자에게 공유합니다.",
    family: "가족에게 안심 알리기",
    familyDesc: "가족에게 장소와 상태만 선택적으로 알립니다.",
    help: "도움 요청하기",
    helpDesc: "길을 잃거나 의사소통이 어려울 때 보여줄 문구를 만듭니다.",
    appointment: "예약 이동 카드",
    destination: "예약 장소",
    depart: "권장 출발시간",
    arrival: "권장 도착시간",
    timeLeft: "남은 시간",
    status: "현재 상태",
    clinic: "클리닉 방문",
    meeting: "만남지점",
    safePlace: "안심 장소",
    airport: "공항",
    enough: "출발까지 여유가 있습니다.",
    prepare: "곧 출발할 준비를 해주세요.",
    now: "지금 출발을 권장합니다.",
    passed: "권장 출발시간이 지났습니다.",
    copyAddress: "목적지 주소 복사",
    showDriver: "기사에게 보여주기",
    showStaff: "시설 직원에게 보여주기",
    delayDesk: "제휴처에 보여줄 지연 문구",
    arrived: "도착했습니다",
    placeSelect: "만남 장소 선택",
    meetingPoint: "고정 만남지점",
    address: "한국어 주소",
    floor: "층",
    category: "유형",
    shareInfo: "공유정보 선택",
    placeName: "장소명",
    expires: "링크 만료시간",
    precise: "정확한 현재 위치",
    preview: "공유 메시지 미리보기",
    copyMsg: "공유문 복사",
    copyUrl: "URL 복사",
    shareNow: "공유하기",
    familyTitle: "가족 안심 알림",
    familyLimit: "의료정보, 여권정보, 결제정보 및 상세 이동경로는 공유되지 않습니다.",
    safe: "안전하게 도착했습니다",
    waiting: "일행을 기다리고 있습니다",
    moving: "현재 이동 중입니다",
    needHelp: "도움이 필요합니다",
    lost: "길을 잃었습니다",
    separated: "일행과 떨어졌습니다",
    taxi: "택시 이용에 도움이 필요합니다",
    facility: "시설 위치를 찾기 어렵습니다",
    korean: "한국어 의사소통이 어렵습니다",
    copied: "복사되었습니다.",
    copyFail: "복사하지 못했습니다. 화면의 문구를 직접 선택해 주세요.",
    close: "닫기",
    securityTitle: "개인정보 및 보안 고지",
    poc1: "현재 기능은 발표용 PoC 시뮬레이션입니다.",
    poc2: "카메라 영상은 서버에 저장하거나 업로드하지 않습니다.",
    poc3: "실제 GPS 추적, 긴급신고, 자동 문자·메신저 발송 기능은 제공하지 않습니다.",
    poc4: "이름, 연락처, 여권번호, 의료정보 입력을 받지 않습니다.",
    poc5: "특정 이동서비스와 공식 연동된 기능이 아닙니다.",
    rawSafe: "QR 원문은 화면 표시용으로만 처리하며 HTML로 삽입하지 않습니다."
  },
  en: {
    languageLabel: "Language",
    navCompany: "Company",
    navTours: "Korea Tours",
    navTrust: "Trust Center",
    navFaq: "FAQ",
    navContact: "Contact",
    privacy: "Privacy Policy",
    footerNotice: "Not a hospital · does not diagnose · QR-based time-safe mobility PoC page",
    eyebrow: "QR-Based Time-Safe Mobility PoC",
    hero: "Time-Safe Mobility QR",
    subhero: "This PoC lets users scan nearby mobility or safety QR markers to identify their location and selectively share it with companions or family members.",
    patentBadge: "Patent Application Filed",
    patentNo: "Application No.",
    patentDate: "Application Date",
    invention: "Invention Title",
    startScan: "Start QR Scan",
    uploadQr: "Upload QR Image",
    scanGuide: "Allow camera access, then place the QR inside the guide box.",
    stopScan: "Stop Scan",
    cancel: "Cancel",
    permissionDenied: "Camera permission was denied or unavailable. Please use QR image upload.",
    unsupported: "Camera QR recognition may be limited in this browser. Please use the image upload fallback.",
    uploadFail: "No QR code was found in the uploaded image.",
    scanComplete: "Scan Complete",
    scannedRaw: "Recognized QR text",
    linkedPlace: "Linked safety place",
    recentCheck: "Recent checked place",
    checkedAt: "Checked at",
    safetyStatus: "Safety status",
    shareCompanion: "Share with companion",
    notifyFamily: "Notify family",
    requestHelp: "Request help",
    genericQr: "Recognized as a general QR. It is not linked to a demo safety place.",
    ask: "How can we help?",
    mobility: "Go to appointment place",
    mobilityDesc: "Check appointment time, recommended arrival, and driver address.",
    meet: "Meet your group",
    meetDesc: "Share a verified fixed meeting point with companions.",
    family: "Notify family safely",
    familyDesc: "Share only selected place and status information with family.",
    help: "Request help",
    helpDesc: "Create a message to show when lost or communication is difficult.",
    appointment: "Appointment Mobility Card",
    destination: "Destination",
    depart: "Recommended departure",
    arrival: "Recommended arrival",
    timeLeft: "Time remaining",
    status: "Current status",
    clinic: "Clinic visit",
    meeting: "Meeting point",
    safePlace: "Safe place",
    airport: "Airport",
    enough: "There is enough time before departure.",
    prepare: "Please get ready to leave soon.",
    now: "Leaving now is recommended.",
    passed: "The recommended departure time has passed.",
    copyAddress: "Copy destination address",
    showDriver: "Show this to the driver",
    showStaff: "Show this to facility staff",
    delayDesk: "Delay message for partner desk",
    arrived: "I have arrived",
    placeSelect: "Select meeting place",
    meetingPoint: "Fixed meeting point",
    address: "Korean address",
    floor: "Floor",
    category: "Type",
    shareInfo: "Shared information",
    placeName: "Place name",
    expires: "Link expiration time",
    precise: "Exact current location",
    preview: "Share message preview",
    copyMsg: "Copy message",
    copyUrl: "Copy URL",
    shareNow: "Share",
    familyTitle: "Family safety notice",
    familyLimit: "Medical data, passport data, payment data, and detailed travel routes are not shared.",
    safe: "Arrived safely",
    waiting: "Waiting for my group",
    moving: "Currently moving",
    needHelp: "Need help",
    lost: "I am lost",
    separated: "I am separated from my group",
    taxi: "I need help using a taxi",
    facility: "I cannot find the facility",
    korean: "Korean communication is difficult",
    copied: "Copied.",
    copyFail: "Copy failed. Please select the text manually.",
    close: "Close",
    securityTitle: "Privacy and Security Notice",
    poc1: "This is a presentation PoC simulation.",
    poc2: "Camera video is not saved or uploaded to a server.",
    poc3: "Real GPS tracking, emergency reporting, and automatic SMS or messenger sending are not provided.",
    poc4: "No name, contact, passport number, or medical information is requested.",
    poc5: "This is not officially integrated with any specific mobility service.",
    rawSafe: "QR text is displayed as text only and is never inserted as HTML."
  }
};

T.vi = {
  ...T.en,
  languageLabel: "Ngôn ngữ",
  navCompany: "Giới thiệu công ty",
  navTours: "Tour Hàn Quốc",
  navTrust: "Trung tâm tin cậy",
  navContact: "Liên hệ",
  privacy: "Chính sách quyền riêng tư",
  footerNotice: "Không phải bệnh viện · không chẩn đoán · trang PoC di chuyển an toàn bằng QR",
  eyebrow: "PoC di chuyển an toàn bằng QR",
  subhero: "PoC này cho phép người dùng quét mã QR của phương tiện chia sẻ hoặc biển báo an toàn gần đó để xác định vị trí và chia sẻ có chọn lọc với người đi cùng hoặc gia đình.",
  patentBadge: "Đã nộp đơn đăng ký sáng chế",
  patentNo: "Số đơn",
  patentDate: "Ngày nộp",
  invention: "Tên sáng chế",
  startScan: "Bắt đầu quét QR",
  uploadQr: "Tải ảnh QR lên",
  scanGuide: "Cho phép camera, sau đó đặt mã QR vào khung hướng dẫn.",
  stopScan: "Dừng quét",
  permissionDenied: "Camera bị từ chối hoặc không khả dụng. Vui lòng tải ảnh QR lên.",
  uploadFail: "Không đọc được QR trong ảnh đã tải lên.",
  scanComplete: "Quét hoàn tất",
  scannedRaw: "Nội dung QR nhận dạng",
  linkedPlace: "Địa điểm an toàn đã kết nối",
  recentCheck: "Vị trí xác nhận gần nhất",
  checkedAt: "Thời điểm xác nhận",
  safetyStatus: "Trạng thái an toàn",
  shareCompanion: "Chia sẻ với người đi cùng",
  notifyFamily: "Báo an toàn cho gia đình",
  requestHelp: "Yêu cầu hỗ trợ",
  genericQr: "Đã nhận dạng QR thông thường. QR này không liên kết với địa điểm demo.",
  ask: "Bạn cần hỗ trợ gì?",
  mobility: "Di chuyển đến nơi hẹn",
  meet: "Gặp lại nhóm",
  family: "Báo an toàn cho gia đình",
  help: "Yêu cầu hỗ trợ",
  appointment: "Thẻ di chuyển lịch hẹn",
  destination: "Điểm đến",
  depart: "Giờ nên xuất phát",
  arrival: "Giờ nên đến",
  timeLeft: "Thời gian còn lại",
  placeSelect: "Chọn điểm hẹn",
  meetingPoint: "Điểm hẹn cố định",
  address: "Địa chỉ tiếng Hàn",
  shareInfo: "Thông tin chia sẻ",
  preview: "Xem trước tin nhắn chia sẻ",
  shareNow: "Chia sẻ",
  securityTitle: "Thông báo quyền riêng tư và bảo mật"
};

T.jp = {
  ...T.en,
  languageLabel: "言語",
  navCompany: "会社紹介",
  navTours: "韓国ツアー",
  navTrust: "Trust Center",
  navContact: "お問い合わせ",
  privacy: "プライバシーポリシー",
  footerNotice: "病院ではありません · 診断は行いません · QR安心移動PoCページ",
  eyebrow: "QR基盤 安心移動PoC",
  subhero: "周辺のモビリティまたは安全標識QRを読み取り、現在位置を確認して同行者や家族に選択的に共有できるPoCです。",
  patentBadge: "Patent Application Filed",
  patentNo: "出願番号",
  patentDate: "出願日",
  invention: "発明の名称",
  startScan: "QRスキャン開始",
  uploadQr: "QR画像アップロード",
  scanGuide: "カメラ権限を許可し、QRをガイド枠内に合わせてください。",
  stopScan: "スキャン終了",
  permissionDenied: "カメラ権限が拒否されたか利用できません。QR画像アップロードをご利用ください。",
  scanComplete: "スキャン完了",
  scannedRaw: "認識されたQR原文",
  linkedPlace: "連携された安全位置",
  recentCheck: "最近確認した位置",
  checkedAt: "位置確認時刻",
  safetyStatus: "安全状態",
  shareCompanion: "同行者に共有",
  notifyFamily: "家族に安心を知らせる",
  requestHelp: "助けを求める",
  ask: "何をお手伝いしますか？",
  mobility: "予約場所へ移動",
  meet: "同行者と会う",
  family: "家族に安心を知らせる",
  help: "助けを求める",
  appointment: "予約移動カード",
  destination: "予約場所",
  depart: "推奨出発時刻",
  arrival: "推奨到着時刻",
  placeSelect: "待ち合わせ場所選択",
  meetingPoint: "固定待ち合わせ地点",
  address: "韓国語住所",
  shareInfo: "共有情報選択",
  preview: "共有メッセージプレビュー",
  shareNow: "共有する",
  securityTitle: "個人情報・セキュリティ告知"
};

T.cn = {
  ...T.en,
  languageLabel: "语言",
  navCompany: "公司介绍",
  navTours: "韩国旅游产品",
  navTrust: "信任中心",
  navContact: "咨询",
  privacy: "隐私政策",
  footerNotice: "不是医院 · 不进行诊断 · QR安心移动PoC页面",
  eyebrow: "QR安心移动PoC",
  subhero: "用户可扫描附近共享出行或安全标识QR，确认当前位置，并选择性分享给同行者或家人。",
  patentBadge: "Patent Application Filed",
  patentNo: "申请号",
  patentDate: "申请日",
  invention: "发明名称",
  startScan: "开始QR扫描",
  uploadQr: "上传QR图片",
  scanGuide: "允许摄像头权限后，请将QR对准引导框。",
  stopScan: "结束扫描",
  permissionDenied: "摄像头权限被拒绝或不可用。请使用QR图片上传。",
  scanComplete: "扫描完成",
  scannedRaw: "识别的QR原文",
  linkedPlace: "关联的安全位置",
  recentCheck: "最近确认位置",
  checkedAt: "位置确认时间",
  safetyStatus: "安全状态",
  shareCompanion: "分享给同行者",
  notifyFamily: "向家人报平安",
  requestHelp: "请求帮助",
  ask: "需要什么帮助？",
  mobility: "前往预约地点",
  meet: "与同行者会合",
  family: "向家人报平安",
  help: "请求帮助",
  appointment: "预约移动卡片",
  destination: "预约地点",
  depart: "建议出发时间",
  arrival: "建议到达时间",
  placeSelect: "选择会合地点",
  meetingPoint: "固定会合点",
  address: "韩文地址",
  shareInfo: "选择分享信息",
  preview: "分享消息预览",
  shareNow: "分享",
  securityTitle: "隐私与安全提示"
};

const state = {
  lang: "ko",
  mode: "mobility",
  placeId: DEFAULT_PLACE,
  appointmentId: "APT-CLINIC-001",
  scanResult: null,
  scanStatus: null,
  scanner: { active: false, stream: null, raf: 0, detector: null },
  share: {
    placeName: true,
    meetingPoint: true,
    address: true,
    expires: true,
    destination: false,
    precise: false
  },
  familyStatus: "safe",
  helpKey: "lost"
};

function $(id) {
  return document.getElementById(id);
}

function tr(key) {
  return T[state.lang]?.[key] || T.ko[key] || T.en[key] || key;
}

function safeLang(value) {
  const lang = String(value || "").toLowerCase();
  return LANGS.includes(lang) ? lang : "ko";
}

function safeMode(value) {
  const mode = String(value || "").toLowerCase();
  return MODES.includes(mode) ? mode : "mobility";
}

function place(id = state.placeId) {
  return places[id] || places[DEFAULT_PLACE];
}

function appointment() {
  return appointments[state.appointmentId] || appointments["APT-CLINIC-001"];
}

function local(value) {
  if (!value) return "";
  return value[state.lang] || value.ko || value.en || "";
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? "" : value);
  });
  children.forEach((child) => node.append(child instanceof Node ? child : document.createTextNode(child)));
  return node;
}

function clear(node) {
  while (node.firstChild) node.firstChild.remove();
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function fmtTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fmtDateTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${fmtTime(date)}`;
}

function appointmentTimeState() {
  const appt = appointment();
  const [y, m, d] = appt.date.split("-").map(Number);
  const [h, min] = appt.time.split(":").map(Number);
  const at = new Date(y, m - 1, d, h, min);
  const [ah, amin] = appt.recommendedArrivalTime.split(":").map(Number);
  const arrival = new Date(y, m - 1, d, ah, amin);
  const depart = new Date(at.getTime() - (appt.averageTravelMinutes + appt.bufferMinutes) * 60000);
  const remaining = Math.floor((depart - new Date()) / 60000);
  let status = tr("enough");
  let left = `${Math.floor(Math.max(remaining, 0) / 60)}h ${Math.max(remaining, 0) % 60}m`;
  if (remaining < 0) {
    status = tr("passed");
    left = "--";
  } else if (remaining <= 10) {
    status = tr("now");
    left = `${remaining}m`;
  } else if (remaining <= 30) {
    status = tr("prepare");
    left = `${remaining}m`;
  }
  return { at, arrival, depart, left, status };
}

function render() {
  document.documentElement.lang = state.lang === "jp" ? "ja" : state.lang === "cn" ? "zh" : state.lang;
  document.title = `${tr("hero")} | VR MEDI TOUR & HOME`;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = tr(node.dataset.i18n);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.lang === state.lang ? "true" : "false");
  });
  const app = $("app");
  clear(app);
  app.append(hero(), qrPanel(), modePicker(), activeMode(), securityNotice());
}

function hero() {
  return el("section", { class: "hero" }, [
    el("div", { class: "hero-copy" }, [
      el("p", { class: "eyebrow", text: tr("eyebrow") }),
      el("h1", { text: tr("hero") }),
      el("p", { class: "lead", text: tr("subhero") }),
      el("div", { class: "hero-actions" }, [
        el("button", { class: "btn primary", type: "button", onClick: startScanner, text: tr("startScan") }),
        uploadLabel("btn secondary")
      ])
    ]),
    el("aside", { class: "patent-card" }, [
      el("p", { class: "patent-kicker", text: tr("patentBadge") }),
      infoLine(tr("invention"), local(patent.title)),
      infoLine(tr("patentNo"), patent.number),
      infoLine(tr("patentDate"), patent.date)
    ])
  ]);
}

function uploadLabel(className) {
  const input = el("input", { type: "file", accept: "image/*", onChange: handleUpload });
  return el("label", { class: `${className} file-btn` }, [el("span", { text: tr("uploadQr") }), input]);
}

function qrPanel() {
  const children = [
    el("div", { class: "scanner-head" }, [
      el("div", {}, [
        el("h2", { text: tr("startScan") }),
        el("p", { class: "muted", text: tr("scanGuide") })
      ]),
      state.scanner.active
        ? el("button", { class: "icon-btn", type: "button", onClick: stopScanner, "aria-label": tr("stopScan"), title: tr("stopScan"), text: "×" })
        : el("button", { class: "btn secondary", type: "button", onClick: startScanner, text: tr("startScan") })
    ])
  ];

  if (state.scanner.active) {
    children.push(
      el("div", { class: "camera-frame" }, [
        el("video", { id: "qrVideo", autoplay: true, muted: true, playsinline: true }),
        el("div", { class: "scan-box", "aria-hidden": "true" })
      ])
    );
  }

  if (state.scanStatus) children.push(el("p", { class: "note", text: state.scanStatus }));
  if (state.scanResult) children.push(scanResultCard());
  children.push(el("canvas", { id: "qrCanvas", hidden: true }));
  return el("section", { class: "card qr-card" }, children);
}

function scanResultCard() {
  const result = state.scanResult;
  const matched = result.placeId ? place(result.placeId) : null;
  return el("section", { class: "result-card", "aria-label": tr("scanComplete") }, [
    el("p", { class: "pill ok", text: tr("scanComplete") }),
    el("h3", { text: matched ? tr("linkedPlace") : tr("genericQr") }),
    matched
      ? infoGrid([
          [tr("recentCheck"), local(matched.name)],
          [tr("meetingPoint"), local(matched.meetingPoint)],
          [tr("address"), matched.addressKo],
          [tr("checkedAt"), result.checkedAt]
        ])
      : el("p", { class: "muted", text: tr("genericQr") }),
    el("details", {}, [
      el("summary", { text: tr("scannedRaw") }),
      el("pre", { text: result.raw })
    ]),
    el("label", { class: "field compact" }, [
      el("span", { text: tr("safetyStatus") }),
      statusSelect()
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn primary", type: "button", onClick: () => share(buildMeetMessage(), buildUrl("meet")), text: tr("shareCompanion") }),
      el("button", { class: "btn secondary", type: "button", onClick: () => share(buildFamilyMessage(), buildUrl("family")), text: tr("notifyFamily") }),
      el("button", { class: "btn warn", type: "button", onClick: () => showHelpModal(), text: tr("requestHelp") })
    ])
  ]);
}

function statusSelect() {
  const select = el("select", {
    onChange: (event) => {
      state.familyStatus = event.target.value;
      render();
    }
  });
  ["safe", "waiting", "moving", "needHelp"].forEach((key) => select.append(new Option(tr(key), key)));
  select.value = state.familyStatus;
  return select;
}

function modePicker() {
  return el("section", { class: "card" }, [
    el("h2", { text: tr("ask") }),
    el("div", { class: "mode-grid" }, MODES.map((mode) => el("button", {
      class: "mode-card",
      type: "button",
      "aria-pressed": state.mode === mode ? "true" : "false",
      onClick: () => {
        state.mode = mode;
        render();
      }
    }, [el("strong", { text: tr(mode) }), el("span", { class: "muted", text: tr(`${mode}Desc`) })])))
  ]);
}

function activeMode() {
  if (state.mode === "meet") return meetMode();
  if (state.mode === "family") return familyMode();
  if (state.mode === "help") return helpMode();
  return mobilityMode();
}

function mobilityMode() {
  const appt = appointment();
  const time = appointmentTimeState();
  return el("section", { class: "grid" }, [
    el("section", { class: "card" }, [
      el("h2", { text: tr("appointment") }),
      el("p", { class: "pill", text: time.status }),
      infoGrid([
        [tr("destination"), local(appt.destinationName)],
        [tr("address"), appt.addressKo],
        [tr("depart"), fmtDateTime(time.depart)],
        [tr("arrival"), fmtDateTime(time.arrival)],
        [tr("timeLeft"), time.left],
        [tr("category"), tr("clinic")]
      ])
    ]),
    el("aside", { class: "card" }, [
      el("h2", { text: tr("mobility") }),
      el("div", { class: "actions vertical" }, [
        el("button", { class: "btn primary", type: "button", onClick: () => copy(appt.addressKo), text: tr("copyAddress") }),
        el("button", { class: "btn secondary", type: "button", onClick: showDriverModal, text: tr("showDriver") }),
        el("button", { class: "btn neutral", type: "button", onClick: showDelayModal, text: tr("delayDesk") }),
        el("button", { class: "btn ok", type: "button", onClick: () => toast(tr("arrived")), text: tr("arrived") })
      ])
    ])
  ]);
}

function meetMode() {
  return el("section", { class: "grid" }, [
    el("section", { class: "card" }, [
      placeSelector(),
      placeDetails(place()),
      shareChecks(),
      previewCard(buildMeetMessage(), buildUrl("meet"))
    ]),
    el("aside", { class: "card" }, [
      el("h2", { text: tr("meet") }),
      el("p", { class: "muted", text: tr("meetDesc") }),
      el("div", { class: "actions vertical" }, [
        el("button", { class: "btn primary", type: "button", onClick: () => share(buildMeetMessage(), buildUrl("meet")), text: tr("shareNow") }),
        el("button", { class: "btn secondary", type: "button", onClick: startScanner, text: tr("startScan") })
      ])
    ])
  ]);
}

function familyMode() {
  return el("section", { class: "grid" }, [
    el("section", { class: "card" }, [
      el("h2", { text: tr("familyTitle") }),
      el("p", { class: "note", text: tr("familyLimit") }),
      el("label", { class: "field" }, [el("span", { text: tr("safetyStatus") }), statusSelect()]),
      previewCard(buildFamilyMessage(), buildUrl("family"))
    ]),
    el("aside", { class: "card" }, [placeSelector(), placeDetails(place())])
  ]);
}

function helpMode() {
  return el("section", { class: "grid" }, [
    el("section", { class: "card" }, [
      el("h2", { text: tr("help") }),
      el("div", { class: "reason-grid" }, ["lost", "separated", "taxi", "facility", "korean"].map((key) => el("button", {
        class: "btn neutral",
        type: "button",
        "aria-pressed": state.helpKey === key ? "true" : "false",
        onClick: () => {
          state.helpKey = key;
          render();
        },
        text: tr(key)
      }))),
      previewCard(buildHelpMessage(), buildUrl("help"))
    ]),
    el("aside", { class: "card" }, [
      placeSelector(),
      el("div", { class: "actions vertical" }, [
        el("button", { class: "btn primary", type: "button", onClick: showHelpModal, text: tr("showStaff") }),
        el("button", { class: "btn secondary", type: "button", onClick: () => share(buildHelpMessage(), buildUrl("help")), text: tr("shareNow") })
      ])
    ])
  ]);
}

function placeSelector() {
  const select = el("select", {
    onChange: (event) => {
      state.placeId = event.target.value;
      render();
    }
  });
  Object.values(places).forEach((p) => select.append(new Option(`${p.id} · ${p.name.ko}`, p.id)));
  select.value = state.placeId;
  return el("label", { class: "field" }, [el("span", { text: tr("placeSelect") }), select]);
}

function placeDetails(p) {
  return el("div", { class: "place-details" }, [
    el("h3", { text: local(p.name) }),
    infoGrid([
      [tr("meetingPoint"), local(p.meetingPoint)],
      [tr("address"), p.addressKo],
      [tr("floor"), p.floor],
      [tr("category"), tr(p.category)]
    ])
  ]);
}

function shareChecks() {
  const items = [["placeName", "placeName"], ["meetingPoint", "meetingPoint"], ["address", "address"], ["expires", "expires"], ["destination", "destination"], ["precise", "precise"]];
  return el("fieldset", { class: "check-grid" }, [
    el("legend", { text: tr("shareInfo") }),
    ...items.map(([key, label]) => el("label", { class: "check" }, [
      el("input", {
        type: "checkbox",
        checked: state.share[key],
        onChange: (event) => {
          state.share[key] = event.target.checked;
          render();
        }
      }),
      el("span", { text: tr(label) })
    ]))
  ]);
}

function previewCard(message, url) {
  return el("section", { class: "preview" }, [
    el("h3", { text: tr("preview") }),
    el("div", { class: "message-preview", text: message }),
    el("p", { class: "url-preview", text: url }),
    el("div", { class: "actions" }, [
      el("button", { class: "btn primary", type: "button", onClick: () => share(message, url), text: tr("shareNow") }),
      el("button", { class: "btn secondary", type: "button", onClick: () => copy(message), text: tr("copyMsg") }),
      el("button", { class: "btn neutral", type: "button", onClick: () => copy(url), text: tr("copyUrl") })
    ])
  ]);
}

function securityNotice() {
  return el("section", { class: "card security" }, [
    el("h2", { text: tr("securityTitle") }),
    el("ul", {}, ["poc1", "poc2", "poc3", "poc4", "poc5", "rawSafe"].map((key) => el("li", { text: tr(key) })))
  ]);
}

function infoLine(label, value) {
  return el("div", { class: "info-line" }, [el("span", { text: label }), el("strong", { text: value })]);
}

function infoGrid(rows) {
  return el("div", { class: "info-grid" }, rows.map(([label, value]) => infoLine(label, value || "-")));
}

function buildUrl(mode) {
  const url = new URL("/time-safe-mobility/", location.origin);
  url.searchParams.set("lang", state.lang);
  url.searchParams.set("mode", mode);
  url.searchParams.set("place", state.placeId);
  return url.href;
}

function buildMeetMessage() {
  const p = place();
  const lines = [tr("shareCompanion")];
  if (state.share.placeName) lines.push(`${tr("placeName")}: ${local(p.name)}`);
  if (state.share.meetingPoint) lines.push(`${tr("meetingPoint")}: ${local(p.meetingPoint)}`);
  if (state.share.address) lines.push(`${tr("address")}: ${p.addressKo}`);
  if (state.share.expires) lines.push(`${tr("expires")}: ${fmtTime(new Date(Date.now() + 30 * 60000))}`);
  if (state.share.destination) lines.push(`${tr("destination")}: ${local(appointment().destinationName)}`);
  if (state.share.precise) lines.push(`${tr("precise")}: PoC demo does not provide real GPS.`);
  return lines.join("\n");
}

function buildFamilyMessage() {
  const p = place();
  return [
    tr("notifyFamily"),
    `${tr("recentCheck")}: ${local(p.name)}`,
    `${tr("safetyStatus")}: ${tr(state.familyStatus)}`,
    `${tr("checkedAt")}: ${fmtDateTime(new Date())}`,
    `${tr("meetingPoint")}: ${local(p.meetingPoint)}`,
    tr("familyLimit")
  ].join("\n");
}

function buildHelpMessage() {
  const p = place();
  return [
    "안녕하세요. 외국인 방문객입니다.",
    "",
    `현재 위치: ${p.name.ko}`,
    `주소: ${p.addressKo}`,
    `만남지점: ${p.meetingPoint.ko}`,
    "",
    `요청 내용: ${tr(state.helpKey)}`,
    "확인 부탁드립니다."
  ].join("\n");
}

function parseQr(raw) {
  const text = String(raw || "").trim();
  let found = null;
  try {
    const url = new URL(text);
    found = url.searchParams.get("assetId") || url.searchParams.get("place") || url.searchParams.get("placeId");
  } catch (error) {
    found = text;
  }
  const normalized = String(found || "").trim().toUpperCase();
  const matched = Object.values(places).find((p) => [p.id, p.code].includes(normalized));
  if (matched) state.placeId = matched.id;
  state.scanResult = {
    raw: text,
    placeId: matched?.id || null,
    checkedAt: fmtDateTime(new Date())
  };
  state.scanStatus = null;
  if (matched) state.mode = "meet";
}

async function startScanner() {
  if (state.scanner.active || state.scanner.starting) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    state.scanStatus = tr("unsupported");
    render();
    return;
  }
  state.scanner.starting = true;
  try {
    const detector = "BarcodeDetector" in window ? new BarcodeDetector({ formats: ["qr_code"] }) : null;
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    state.scanner = { active: true, stream, raf: 0, detector };
    state.scanStatus = detector ? null : tr("unsupported");
    render();
    const video = $("qrVideo");
    video.srcObject = stream;
    await video.play();
    scanLoop();
  } catch (error) {
    state.scanStatus = tr("permissionDenied");
    stopScanner(false);
    render();
  } finally {
    state.scanner.starting = false;
  }
}

function stopScanner(shouldRender = true) {
  if (state.scanner.raf) cancelAnimationFrame(state.scanner.raf);
  if (state.scanner.stream) state.scanner.stream.getTracks().forEach((track) => track.stop());
  state.scanner = { active: false, starting: false, stream: null, raf: 0, detector: null };
  if (shouldRender) render();
}

async function scanLoop() {
  const video = $("qrVideo");
  if (!state.scanner.active || !video) return;
  try {
    let raw = null;
    if (state.scanner.detector) {
      const codes = await state.scanner.detector.detect(video);
      raw = codes[0]?.rawValue || null;
    } else if (window.jsQR && video.videoWidth) {
      raw = scanVideoWithJsQr(video);
    }
    if (raw) {
      stopScanner(false);
      parseQr(raw);
      render();
      return;
    }
  } catch (error) {
    state.scanStatus = tr("unsupported");
  }
  state.scanner.raf = requestAnimationFrame(scanLoop);
}

function scanVideoWithJsQr(video) {
  const canvas = $("qrCanvas");
  if (!canvas || !video.videoWidth || !video.videoHeight) return null;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return window.jsQR(imageData.data, imageData.width, imageData.height)?.data || null;
}

async function handleUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const bitmap = await createImageBitmap(file);
    let raw = null;
    if ("BarcodeDetector" in window) {
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const codes = await detector.detect(bitmap);
      raw = codes[0]?.rawValue || null;
    }
    if (!raw && window.jsQR) raw = scanBitmapWithJsQr(bitmap);
    if (!raw) throw new Error("QR not found");
    parseQr(raw);
  } catch (error) {
    state.scanStatus = tr("uploadFail");
  }
  render();
}

function scanBitmapWithJsQr(bitmap) {
  const canvas = $("qrCanvas") || document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return window.jsQR(imageData.data, imageData.width, imageData.height)?.data || null;
}

async function share(text, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title: tr("hero"), text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  copy(`${text}\n${url}`);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast(tr("copied"));
  } catch (error) {
    toast(tr("copyFail"));
  }
}

function toast(message) {
  const node = $("toast");
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2200);
}

function openModal(title, message) {
  const modal = $("modal");
  $("modalTitle").textContent = title;
  clear($("modalBody"));
  clear($("modalActions"));
  $("modalBody").append(el("div", { class: "big-korean", text: message }));
  $("modalActions").append(
    el("button", { class: "btn primary", type: "button", onClick: () => copy(message), text: tr("copyMsg") }),
    el("button", { class: "btn neutral", type: "button", onClick: closeModal, text: tr("close") })
  );
  modal.hidden = false;
  modal.classList.add("open");
}

function closeModal() {
  $("modal").hidden = true;
  $("modal").classList.remove("open");
}

function showDriverModal() {
  const appt = appointment();
  openModal(tr("showDriver"), `안녕하세요.\n외국인 방문객입니다.\n\n아래 주소로 이동 부탁드립니다.\n\n${appt.destinationName.ko}\n${appt.addressKo}\n\n감사합니다.`);
}

function showDelayModal() {
  openModal(tr("delayDesk"), "안녕하세요.\n외국인 예약 고객입니다.\n\n현재 예약 장소로 이동 중이나 교통 또는 이동 상황으로 인해 조금 늦을 수 있습니다.\n\n예약시간 조정이 가능한지 확인 부탁드립니다.\n감사합니다.");
}

function showHelpModal() {
  openModal(tr("showStaff"), buildHelpMessage());
}

function init() {
  const params = new URLSearchParams(location.search);
  state.lang = safeLang(params.get("lang"));
  state.mode = safeMode(params.get("mode"));
  const requestedPlace = params.get("place") || params.get("assetId");
  if (places[requestedPlace]) state.placeId = requestedPlace;
  document.addEventListener("click", (event) => {
    const langButton = event.target.closest("[data-lang]");
    if (langButton) {
      state.lang = safeLang(langButton.dataset.lang);
      render();
    }
    if (event.target.id === "modal") closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.scanner.active) stopScanner();
      if (!$("modal").hidden) closeModal();
    }
  });
  render();
  setInterval(() => {
    if (state.mode === "mobility") render();
  }, 60000);
}

init();
window.__timeSafeMobility = { state, parseQr, startScanner, stopScanner };

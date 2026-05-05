const i18n = {
  ko: {
    heroTitle: "부산외대<br />AI 캠퍼스 길찾기",
    heroLead: "휴대폰 GPS와 건물 정보를 바탕으로 현재 위치, 목적지 건물, 층별 시설을 안내합니다.",
    sectionLocation: "1. 현재 위치 확인",
    sectionDestination: "2. 목적지 건물 선택",
    sectionMap: "3. 캠퍼스맵에서 위치 확인",
    mapDescription: "A~J 건물 정보와 대표 시설 데이터를 바탕으로 모바일 안내 화면을 구성했습니다.",
    locateBtn: "내 위치 찾기",
    watchBtn: "실시간 위치 추적",
    watchStop: "위치 추적 중지",
    notLocated: "아직 위치를 확인하지 않았습니다.",
    accuracyDefault: "정확도: -",
    secureOk: "현재 접속 환경은 GPS 사용이 가능한 보안 환경입니다.",
    secureWarn: "주의: 휴대폰 GPS는 보통 HTTPS 환경에서만 정상 작동합니다. 배포 주소가 https:// 로 시작하는지 확인하세요.",
    locating: "현재 위치를 확인하는 중입니다...",
    watching: "실시간 위치를 추적하는 중입니다...",
    watchStoppedWithPosition: "실시간 추적을 중지했습니다. 마지막 위치를 기준으로 안내할 수 있습니다.",
    watchStopped: "실시간 추적을 중지했습니다.",
    geoUnsupported: "이 브라우저는 GPS 위치 확인을 지원하지 않습니다.",
    permissionDenied: "위치 권한이 거부되었습니다. 휴대폰 브라우저 설정에서 위치 권한을 허용해 주세요.",
    unavailable: "현재 위치를 확인할 수 없습니다. 실외 또는 창가에서 다시 시도해 주세요.",
    timeout: "위치 확인 시간이 초과되었습니다. 다시 시도해 주세요.",
    error: "위치 확인 중 오류가 발생했습니다.",
    currentPosition: "현재 위치 확인 완료",
    latitude: "위도",
    longitude: "경도",
    accuracy: "정확도",
    approx: "약",
    meter: "m",
    selectedLabel: "SELECTED BUILDING",
    agentTitle: "AI 캠퍼스 안내 에이전트",
    agentHelp: "건물명, 시설명, 예배시간, AI 부트캠프 위치처럼 자연어로 질문하세요.",
    agentPlaceholder: "예: AI 부트캠프 어디야? / 대학교회 예배 시간 알려줘",
    agentAsk: "AI에게 묻기",
    agentDefault: "등록된 건물 정보 기준으로 안내합니다.",
    testTitle: "테스트 기준",
    testText: "휴대폰에서 접속 → 위치 권한 허용 → 건물 선택 → AI 에이전트에게 질문 순서로 테스트합니다. 등록되지 않은 시설은 임의로 답하지 않고 확인 필요로 안내합니다."
  },
  en: {
    heroTitle: "BUFS<br />AI Campus Guide",
    heroLead: "Use phone GPS and campus building data to guide current location, destination buildings, and floor facilities.",
    sectionLocation: "1. Check current location",
    sectionDestination: "2. Select destination building",
    sectionMap: "3. Check location on campus map",
    mapDescription: "This mobile guide is built from A–J building and facility data.",
    locateBtn: "Find my location",
    watchBtn: "Track live location",
    watchStop: "Stop tracking",
    notLocated: "Your location has not been checked yet.",
    accuracyDefault: "Accuracy: -",
    secureOk: "This secure connection can use GPS location.",
    secureWarn: "Note: Mobile GPS usually works only on HTTPS. Check that the address starts with https://.",
    locating: "Checking your current location...",
    watching: "Tracking your live location...",
    watchStoppedWithPosition: "Live tracking stopped. The last confirmed location can be used for guidance.",
    watchStopped: "Live tracking stopped.",
    geoUnsupported: "This browser does not support GPS location.",
    permissionDenied: "Location permission was denied. Please allow location access in your mobile browser settings.",
    unavailable: "Current location is unavailable. Please try again outdoors or near a window.",
    timeout: "Location request timed out. Please try again.",
    error: "An error occurred while checking location.",
    currentPosition: "Current location confirmed",
    latitude: "Lat",
    longitude: "Lng",
    accuracy: "Accuracy",
    approx: "about",
    meter: "m",
    selectedLabel: "SELECTED BUILDING",
    agentTitle: "AI Campus Guide Agent",
    agentHelp: "Ask naturally, such as building names, facilities, worship times, or AI Bootcamp location.",
    agentPlaceholder: "Example: Where is the AI Bootcamp? / Tell me the church worship times.",
    agentAsk: "Ask AI",
    agentDefault: "Guidance is based on registered building data.",
    testTitle: "Test flow",
    testText: "Open on a phone → allow location permission → select a building → ask the AI agent. Unknown facilities are marked as requiring confirmation."
  },
  vi: {
    heroTitle: "BUFS<br />AI hướng dẫn khuôn viên",
    heroLead: "Dựa trên GPS điện thoại và dữ liệu tòa nhà để hướng dẫn vị trí, điểm đến và cơ sở theo tầng.",
    sectionLocation: "1. Kiểm tra vị trí hiện tại",
    sectionDestination: "2. Chọn tòa nhà đích",
    sectionMap: "3. Xem vị trí trên bản đồ khuôn viên",
    mapDescription: "Màn hình di động được cấu hình từ dữ liệu tòa nhà và cơ sở A–J.",
    locateBtn: "Tìm vị trí của tôi",
    watchBtn: "Theo dõi vị trí trực tiếp",
    watchStop: "Dừng theo dõi",
    notLocated: "Chưa kiểm tra vị trí hiện tại.",
    accuracyDefault: "Độ chính xác: -",
    secureOk: "Kết nối bảo mật hiện tại có thể sử dụng GPS.",
    secureWarn: "Lưu ý: GPS trên điện thoại thường chỉ hoạt động với HTTPS.",
    locating: "Đang kiểm tra vị trí hiện tại...",
    watching: "Đang theo dõi vị trí trực tiếp...",
    watchStoppedWithPosition: "Đã dừng theo dõi. Có thể dùng vị trí cuối cùng để hướng dẫn.",
    watchStopped: "Đã dừng theo dõi vị trí.",
    geoUnsupported: "Trình duyệt này không hỗ trợ định vị GPS.",
    permissionDenied: "Quyền vị trí đã bị từ chối. Vui lòng cho phép trong cài đặt trình duyệt.",
    unavailable: "Không thể xác định vị trí. Hãy thử ngoài trời hoặc gần cửa sổ.",
    timeout: "Yêu cầu vị trí quá thời gian. Vui lòng thử lại.",
    error: "Đã xảy ra lỗi khi kiểm tra vị trí.",
    currentPosition: "Đã xác nhận vị trí hiện tại",
    latitude: "Vĩ độ",
    longitude: "Kinh độ",
    accuracy: "Độ chính xác",
    approx: "khoảng",
    meter: "m",
    selectedLabel: "TÒA NHÀ ĐÃ CHỌN",
    agentTitle: "AI hướng dẫn khuôn viên",
    agentHelp: "Hãy hỏi bằng ngôn ngữ tự nhiên về tòa nhà, cơ sở, giờ lễ hoặc vị trí AI Bootcamp.",
    agentPlaceholder: "Ví dụ: AI Bootcamp ở đâu? / Cho tôi biết giờ lễ nhà thờ.",
    agentAsk: "Hỏi AI",
    agentDefault: "Hướng dẫn dựa trên dữ liệu tòa nhà đã đăng ký.",
    testTitle: "Quy trình kiểm tra",
    testText: "Mở trên điện thoại → cho phép vị trí → chọn tòa nhà → hỏi AI. Cơ sở chưa đăng ký sẽ được báo cần xác nhận."
  },
  ja: {
    heroTitle: "釜山外国語大学<br />AIキャンパス案内",
    heroLead: "スマートフォンGPSと建物情報をもとに現在地、目的地、階別施設を案内します。",
    sectionLocation: "1. 現在地を確認",
    sectionDestination: "2. 目的地の建物を選択",
    sectionMap: "3. キャンパスマップで位置確認",
    mapDescription: "A〜Jの建物情報と主要施設データをもとにモバイル案内画面を構成しました。",
    locateBtn: "現在地を探す",
    watchBtn: "リアルタイム追跡",
    watchStop: "追跡を停止",
    notLocated: "まだ現在地を確認していません。",
    accuracyDefault: "精度: -",
    secureOk: "現在の安全な接続ではGPSを使用できます。",
    secureWarn: "注意: スマートフォンのGPSは通常HTTPSでのみ正常に動作します。",
    locating: "現在地を確認しています...",
    watching: "現在地をリアルタイムで追跡しています...",
    watchStoppedWithPosition: "追跡を停止しました。最後に確認した位置で案内できます。",
    watchStopped: "追跡を停止しました。",
    geoUnsupported: "このブラウザはGPS位置確認に対応していません。",
    permissionDenied: "位置情報の権限が拒否されました。ブラウザ設定で許可してください。",
    unavailable: "現在地を確認できません。屋外または窓際で再試行してください。",
    timeout: "位置確認がタイムアウトしました。もう一度お試しください。",
    error: "位置確認中にエラーが発生しました。",
    currentPosition: "現在地を確認しました",
    latitude: "緯度",
    longitude: "経度",
    accuracy: "精度",
    approx: "約",
    meter: "m",
    selectedLabel: "選択した建物",
    agentTitle: "AIキャンパス案内エージェント",
    agentHelp: "建物名、施設名、礼拝時間、AIブートキャンプ位置などを自然文で質問してください。",
    agentPlaceholder: "例: AIブートキャンプはどこ？ / 大学教会の礼拝時間を教えて",
    agentAsk: "AIに質問",
    agentDefault: "登録された建物情報を基準に案内します。",
    testTitle: "テスト基準",
    testText: "スマートフォンで接続 → 位置情報を許可 → 建物選択 → AIエージェントに質問の順にテストします。未登録施設は確認必要として案内します。"
  },
  zh: {
    heroTitle: "釜山外国语大学<br />AI校园导航",
    heroLead: "基于手机GPS和建筑数据， 안내当前位置、目的地建筑和楼层设施。",
    sectionLocation: "1. 确认当前位置",
    sectionDestination: "2. 选择目的地建筑",
    sectionMap: "3. 在校园地图中确认位置",
    mapDescription: "本移动页面基于A–J建筑和设施数据构成。",
    locateBtn: "查找我的位置",
    watchBtn: "实时位置追踪",
    watchStop: "停止追踪",
    notLocated: "尚未确认当前位置。",
    accuracyDefault: "精度: -",
    secureOk: "当前安全连接可以使用GPS定位。",
    secureWarn: "注意：手机GPS通常只在HTTPS环境下正常工作。",
    locating: "正在确认当前位置...",
    watching: "正在实时追踪当前位置...",
    watchStoppedWithPosition: "已停止实时追踪。可使用最后确认的位置进行导航。",
    watchStopped: "已停止位置追踪。",
    geoUnsupported: "此浏览器不支持GPS定位。",
    permissionDenied: "位置权限被拒绝。请在手机浏览器设置中允许位置权限。",
    unavailable: "无法确认当前位置。请在室外或窗边重试。",
    timeout: "位置确认超时。请重试。",
    error: "确认位置时发生错误。",
    currentPosition: "当前位置已确认",
    latitude: "纬度",
    longitude: "经度",
    accuracy: "精度",
    approx: "约",
    meter: "m",
    selectedLabel: "已选建筑",
    agentTitle: "AI校园导航助手",
    agentHelp: "可自然提问建筑名称、设施名称、礼拜时间或AI Bootcamp位置。",
    agentPlaceholder: "例：AI Bootcamp在哪里？/ 告诉我大学教会礼拜时间",
    agentAsk: "询问AI",
    agentDefault: "基于已登记的建筑数据提供 안내。",
    testTitle: "测试标准",
    testText: "用手机打开 → 允许位置权限 → 选择建筑 → 询问AI助手。未登记设施将提示需要确认。"
  }
};

function campusBuilding(code, query, left, top, text, aliases = []) {
  return { code, query, pin: { left, top }, text, aliases };
}

const buildings = [
  campusBuilding("A", "부산외국어대학교 글로벌센터", 31, 49, {
    ko: { name: "글로벌센터", en: "Global Center", type: "Global Center", summary: "평생교육원, 국제교류처, 세미나실, 어학실, 교수연구실 등이 있는 건물입니다.", rows: [["-1F", "복지매장 / 산학협력단 / 학군단"], ["-2F", "글로벌라운지 / 국제교류처"], ["-3F", "특성화교육팀 / 세미나실 / 강의실"], ["-4F", "한국어문화교육원 / 세미나실 / 강의실 / 연구소 / 지역원"], ["-5F", "HK지역원 / 행정실 / 연구실 1~10실 / 연구교수실 / 연구보조원실"]] },
    en: { name: "Global Center", en: "Global Center", type: "Global Center", summary: "Building with the Lifelong Education Center, international affairs, seminar rooms, language rooms, and research offices.", rows: [["-1F", "Welfare store / Industry-academic cooperation / ROTC"], ["-2F", "Global Lounge / International Affairs"], ["-3F", "Specialized Education Team / Seminar rooms / Classrooms"], ["-4F", "Korean Language and Culture Education Center / Seminar rooms / Classrooms / Research institutes"], ["-5F", "HK Institute / Office / Research rooms 1–10 / Research professor rooms / Research assistant rooms"]] },
    vi: { name: "Trung tâm Toàn cầu", en: "Global Center", type: "Global Center", summary: "Tòa nhà có trung tâm giáo dục thường xuyên, giao lưu quốc tế, phòng seminar, phòng học ngôn ngữ và phòng nghiên cứu.", rows: [["-1F", "Cửa hàng phúc lợi / Hợp tác trường-doanh nghiệp / ROTC"], ["-2F", "Global Lounge / Văn phòng giao lưu quốc tế"], ["-3F", "Đội giáo dục chuyên biệt / Phòng seminar / Phòng học"], ["-4F", "Trung tâm giáo dục văn hóa Hàn Quốc / Phòng seminar / Phòng học / Viện nghiên cứu"], ["-5F", "Viện HK / Văn phòng / Phòng nghiên cứu 1–10 / Phòng giáo sư nghiên cứu / Trợ lý nghiên cứu"]] },
    ja: { name: "グローバルセンター", en: "Global Center", type: "Global Center", summary: "国際交流、セミナー室、語学室、研究室などがある建物です。", rows: [["-1F", "福利売店 / 産学協力団 / 学軍団"], ["-2F", "グローバルラウンジ / 国際交流処"], ["-3F", "特性化教育チーム / セミナー室 / 講義室"], ["-4F", "韓国語文化教育院 / セミナー室 / 講義室 / 研究所"], ["-5F", "HK地域院 / 行政室 / 研究室1〜10 / 研究教授室 / 研究補助員室"]] },
    zh: { name: "全球中心", en: "Global Center", type: "Global Center", summary: "设有国际交流、研讨室、语言教室和研究室等。", rows: [["-1F", "福利商店 / 产学合作团 / 学军团"], ["-2F", "Global Lounge / 国际交流处"], ["-3F", "特色化教育组 / 研讨室 / 教室"], ["-4F", "韩国语文化教育院 / 研讨室 / 教室 / 研究所"], ["-5F", "HK地域院 / 行政室 / 研究室1~10 / 研究教授室 / 研究助理室"]] }
  }, ["글로벌", "평생교육원", "국제교류처", "글로벌라운지", "한국어문화교육원", "학군단"]),

  campusBuilding("B", "부산외국어대학교 체육관", 36, 40, {
    ko: { name: "체육관", en: "Gymnasium", type: "Gymnasium", summary: "동아리, 학생회, 체육관, 관람석이 있는 체육 시설입니다.", rows: [["-1F", "동아리 / 학생회"], ["-2F", "스포츠복지계열 1실(연구실~7실 / 실습실) / 헬스장 / 언론사"], ["-3F", "체육관"], ["-4F", "관람석"]] },
    en: { name: "Gymnasium", en: "Gymnasium", type: "Sports facility", summary: "Sports facility with student clubs, student council, gymnasium, and spectator seats.", rows: [["-1F", "Clubs / Student council"], ["-2F", "Sports welfare rooms / Practice rooms / Fitness center / Press"], ["-3F", "Gymnasium"], ["-4F", "Spectator seats"]] },
    vi: { name: "Nhà thể thao", en: "Gymnasium", type: "Cơ sở thể thao", summary: "Cơ sở thể thao có câu lạc bộ, hội sinh viên, nhà thi đấu và khán đài.", rows: [["-1F", "Câu lạc bộ / Hội sinh viên"], ["-2F", "Phòng thể thao-phúc lợi / Phòng thực hành / Phòng gym / Báo chí"], ["-3F", "Nhà thi đấu"], ["-4F", "Khán đài"]] },
    ja: { name: "体育館", en: "Gymnasium", type: "体育施設", summary: "サークル、学生会、体育館、観覧席がある体育施設です。", rows: [["-1F", "サークル / 学生会"], ["-2F", "スポーツ福祉系列室 / 実習室 / ジム / 言論社"], ["-3F", "体育館"], ["-4F", "観覧席"]] },
    zh: { name: "体育馆", en: "Gymnasium", type: "体育设施", summary: "设有社团、学生会、体育馆和观众席。", rows: [["-1F", "社团 / 学生会"], ["-2F", "体育福利系列室 / 实习室 / 健身房 / 媒体社"], ["-3F", "体育馆"], ["-4F", "观众席"]] }
  }, ["체육", "헬스장", "동아리", "학생회", "관람석"]),

  campusBuilding("C", "부산외국어대학교 기숙사", 25, 33, {
    ko: { name: "기숙사", en: "Dormitory", type: "Dormitory", summary: "기숙사, 체력단련실, 열람실, 게스트룸, 학생식당이 있는 생활관입니다.", rows: [["-B1F", "기숙사팬티 / 체력단련실 / 열람실 / 세탁실 / 편의시설"], ["-1F", "행정실 지원 / 로비 / 학생자치회실 / 사실"], ["-2F~9F", "외성생활관(사실)"], ["-10F", "외성생활관(사실) 1인~12실 / 게스트룸 2실"]] },
    en: { name: "Dormitory", en: "Dormitory", type: "Residence hall", summary: "Residence hall with fitness room, reading room, laundry, lobby and guest rooms.", rows: [["-B1F", "Dormitory pantry / Fitness room / Reading room / Laundry / Convenience facilities"], ["-1F", "Administration support / Lobby / Student council room / Rooms"], ["-2F~9F", "Residence rooms"], ["-10F", "Residence rooms 1–12 / Guest rooms 2"]] },
    vi: { name: "Ký túc xá", en: "Dormitory", type: "Khu nhà ở sinh viên", summary: "Ký túc xá có phòng thể lực, phòng đọc, giặt đồ, sảnh và phòng khách.", rows: [["-B1F", "Pantry ký túc xá / Phòng thể lực / Phòng đọc / Giặt đồ / Tiện ích"], ["-1F", "Hỗ trợ hành chính / Sảnh / Phòng hội sinh viên / Phòng ở"], ["-2F~9F", "Phòng ở"], ["-10F", "Phòng ở 1–12 / 2 phòng khách"]] },
    ja: { name: "寮", en: "Dormitory", type: "生活館", summary: "体力鍛錬室、閲覧室、洗濯室、ゲストルームがある生活館です。", rows: [["-B1F", "寮パントリー / 体力鍛錬室 / 閲覧室 / 洗濯室 / 便宜施設"], ["-1F", "行政支援 / ロビー / 学生自治会室 / 居室"], ["-2F~9F", "外城生活館 居室"], ["-10F", "外城生活館 居室1〜12 / ゲストルーム2室"]] },
    zh: { name: "宿舍", en: "Dormitory", type: "生活馆", summary: "设有健身室、阅览室、洗衣房、大厅和客房。", rows: [["-B1F", "宿舍茶水间 / 健身室 / 阅览室 / 洗衣房 / 便利设施"], ["-1F", "行政支援 / 大厅 / 学生自治会室 / 房间"], ["-2F~9F", "外城生活馆房间"], ["-10F", "外城生活馆房间1~12 / 客房2间"]] }
  }, ["기숙사", "생활관", "세탁실", "열람실", "게스트룸", "체력단련실"]),

  campusBuilding("D", "부산외국어대학교 트리니티홀", 47, 21, {
    ko: { name: "트리니티홀", en: "Trinity Hall", type: "Trinity Hall", summary: "강의실, PC실습실, 컨퍼런스회의실, 교수연구실이 있는 강의·연구 시설입니다.", rows: [["-1F", "트리니티 오디토리움 / 강의실 / PC실습실"], ["-2F", "강의실 / PC실습실"], ["-3F", "강의실 / PC실습실 / 자유PC실"], ["-4F", "강의실 / PC실습실 / GLE / 교수회의실"], ["-5F", "계열사무실 12실 / 교수연구실 84실 / 외래강사실"], ["-6F", "교수연구실 110실"]] },
    en: { name: "Trinity Hall", en: "Trinity Hall", type: "Lecture and research facility", summary: "Lecture and research facility with classrooms, PC labs, meeting rooms, and faculty offices.", rows: [["-1F", "Trinity Auditorium / Classrooms / PC labs"], ["-2F", "Classrooms / PC labs"], ["-3F", "Classrooms / PC labs / Free PC room"], ["-4F", "Classrooms / PC labs / GLE / Faculty meeting room"], ["-5F", "Department offices 12 / Faculty offices 84 / Adjunct lecturer room"], ["-6F", "Faculty offices 110"]] },
    vi: { name: "Trinity Hall", en: "Trinity Hall", type: "Cơ sở giảng dạy và nghiên cứu", summary: "Cơ sở có phòng học, phòng máy tính, phòng họp và phòng giáo sư.", rows: [["-1F", "Thính phòng Trinity / Phòng học / Phòng máy"], ["-2F", "Phòng học / Phòng máy"], ["-3F", "Phòng học / Phòng máy / Phòng PC tự do"], ["-4F", "Phòng học / Phòng máy / GLE / Phòng họp giáo sư"], ["-5F", "Văn phòng khoa 12 / Phòng giáo sư 84 / Phòng giảng viên thỉnh giảng"], ["-6F", "Phòng giáo sư 110"]] },
    ja: { name: "トリニティホール", en: "Trinity Hall", type: "講義・研究施設", summary: "講義室、PC実習室、会議室、教授研究室がある施設です。", rows: [["-1F", "トリニティオーディトリアム / 講義室 / PC実習室"], ["-2F", "講義室 / PC実習室"], ["-3F", "講義室 / PC実習室 / 自由PC室"], ["-4F", "講義室 / PC実習室 / GLE / 教授会議室"], ["-5F", "系列事務室12室 / 教授研究室84室 / 非常勤講師室"], ["-6F", "教授研究室110室"]] },
    zh: { name: "三一厅", en: "Trinity Hall", type: "教学与研究设施", summary: "设有教室、PC实习室、会议室和教授研究室。", rows: [["-1F", "Trinity Auditorium / 教室 / PC实习室"], ["-2F", "教室 / PC实习室"], ["-3F", "教室 / PC实习室 / 自由PC室"], ["-4F", "教室 / PC实习室 / GLE / 教授会议室"], ["-5F", "系列办公室12间 / 教授研究室84间 / 外聘讲师室"], ["-6F", "教授研究室110间"]] }
  }, ["트리니티", "오디토리움", "pc", "GLE", "교수회의실", "외래강사실"]),

  campusBuilding("E", "부산외국어대학교 메모리얼광장", 57, 35, {
    ko: { name: "메모리얼광장", en: "Memorial Square", type: "Memorial Square", summary: "캠퍼스 중앙 이동 기준점입니다. 현재 세부 층별 데이터는 추가 확인이 필요합니다.", rows: [["주요", "메모리얼광장"], ["정보 1", "세부 시설 정보 추가 확인 필요"]] },
    en: { name: "Memorial Square", en: "Memorial Square", type: "Campus square", summary: "A central campus reference point. Detailed floor data needs confirmation.", rows: [["Main", "Memorial Square"], ["Info 1", "Detailed facility data needs confirmation"]] },
    vi: { name: "Quảng trường Memorial", en: "Memorial Square", type: "Quảng trường", summary: "Điểm mốc trung tâm trong khuôn viên. Cần xác nhận thêm dữ liệu chi tiết.", rows: [["Chính", "Quảng trường Memorial"], ["Thông tin 1", "Cần xác nhận thêm thông tin cơ sở"]] },
    ja: { name: "メモリアル広場", en: "Memorial Square", type: "広場", summary: "キャンパス中央の基準点です。詳細施設情報は追加確認が必要です。", rows: [["主要", "メモリアル広場"], ["情報 1", "詳細施設情報は追加確認が必要"]] },
    zh: { name: "纪念广场", en: "Memorial Square", type: "广场", summary: "校园中央基准点。详细楼层数据需要进一步确认。", rows: [["主要", "纪念广场"], ["信息 1", "详细设施信息需要确认"]] }
  }, ["메모리얼", "광장"]),

  campusBuilding("F", "부산외국어대학교 대학본부", 66, 31, {
    ko: { name: "대학본부", en: "Administration Center", type: "Administration Center", summary: "취업지원, 학사관리, 입학관리, 총무, 기획, 인력관리, 부총장실, 총장실 등이 있는 행정 건물입니다.", rows: [["-1F", "취업지원팀 / 학사관리팀 / 학생지원팀 / 예비군연대 / 학생상담실"], ["-2F", "입학관리처 / 교수학습개발센터 / 교양교육센터"], ["-3F", "총무처 / 경영지원실 / 기획처 / 인력관리실"], ["-4F", "부총장실 / 교목실 / 교수지원팀 / 동시통역실습실 / 대학원자료실"], ["-5F", "5개 대학원 세미나실"], ["-6F", "총장실 / 이사장실 / 비서팀 / 회의실"]] },
    en: { name: "Administration Center", en: "Administration Center", type: "Administration Center", summary: "Administrative building for career support, academic affairs, admissions, planning, HR, vice president, and president offices.", rows: [["-1F", "Career support / Academic affairs / Student support / Reserve forces / Counseling room"], ["-2F", "Admissions / Teaching and Learning Center / General Education Center"], ["-3F", "General affairs / Management support / Planning / HR"], ["-4F", "Vice president / Chaplain office / Faculty support / Simultaneous interpretation lab / Graduate school archive"], ["-5F", "Seminar rooms for five graduate schools"], ["-6F", "President office / Chairperson office / Secretarial team / Meeting room"]] },
    vi: { name: "Tòa nhà hành chính", en: "Administration Center", type: "Cơ sở hành chính", summary: "Tòa nhà hành chính gồm hỗ trợ việc làm, học vụ, tuyển sinh, kế hoạch, nhân sự và văn phòng lãnh đạo.", rows: [["-1F", "Hỗ trợ việc làm / Học vụ / Hỗ trợ sinh viên / Dự bị quân sự / Tư vấn sinh viên"], ["-2F", "Tuyển sinh / Trung tâm phát triển dạy học / Trung tâm giáo dục đại cương"], ["-3F", "Tổng vụ / Hỗ trợ quản trị / Kế hoạch / Nhân sự"], ["-4F", "Phó hiệu trưởng / Văn phòng tuyên úy / Hỗ trợ giảng viên / Phòng thực hành phiên dịch đồng thời / Tư liệu sau đại học"], ["-5F", "Phòng seminar của 5 trường sau đại học"], ["-6F", "Văn phòng hiệu trưởng / Chủ tịch / Thư ký / Phòng họp"]] },
    ja: { name: "大学本部", en: "Administration Center", type: "行政施設", summary: "就職支援、学事、入学、企画、人力管理、総長室などがある行政建物です。", rows: [["-1F", "就職支援チーム / 学事管理チーム / 学生支援チーム / 予備軍連隊 / 学生相談室"], ["-2F", "入学管理処 / 教授学習開発センター / 教養教育センター"], ["-3F", "総務処 / 経営支援室 / 企画処 / 人力管理室"], ["-4F", "副総長室 / 教牧室 / 教授支援チーム / 同時通訳実習室 / 大学院資料室"], ["-5F", "5大学院セミナー室"], ["-6F", "総長室 / 理事長室 / 秘書チーム / 会議室"]] },
    zh: { name: "大学本部", en: "Administration Center", type: "行政设施", summary: "设有就业支援、学务、入学、企划、人力管理和校长室等。", rows: [["-1F", "就业支援组 / 学事管理组 / 学生支援组 / 预备军联队 / 学生咨询室"], ["-2F", "入学管理处 / 教授学习开发中心 / 教养教育中心"], ["-3F", "总务处 / 经营支援室 / 企划处 / 人力管理室"], ["-4F", "副校长室 / 校牧室 / 教授支援组 / 同声传译实习室 / 研究生院资料室"], ["-5F", "5个研究生院研讨室"], ["-6F", "校长室 / 理事长室 / 秘书组 / 会议室"]] }
  }, ["대학본부", "행정", "취업지원", "학생상담", "입학", "총장실", "교목실", "부총장"]),

  campusBuilding("G", "부산외국어대학교 만오기념관", 63, 24, {
    ko: { name: "만오기념관", en: "Mano Memorial Hall", type: "Mano Memorial Hall", summary: "만오기념홀, 보건진료실, 출력센터, 무속실이 있는 건물입니다.", rows: [["-1F", "만오기념홀"], ["-2F", "보건진료실 / 출력(POD)센터"], ["-3F", "만오오디토리움 / 무속실"]] },
    en: { name: "Mano Memorial Hall", en: "Mano Memorial Hall", type: "Memorial facility", summary: "Building with memorial hall, health clinic, POD print center, auditorium, and dance room.", rows: [["-1F", "Mano Memorial Hall"], ["-2F", "Health clinic / POD print center"], ["-3F", "Mano Auditorium / Dance room"]] },
    vi: { name: "Nhà kỷ niệm Mano", en: "Mano Memorial Hall", type: "Cơ sở kỷ niệm", summary: "Tòa nhà có hội trường, phòng y tế, trung tâm in POD, thính phòng và phòng múa.", rows: [["-1F", "Hội trường Mano"], ["-2F", "Phòng y tế / Trung tâm in POD"], ["-3F", "Thính phòng Mano / Phòng múa"]] },
    ja: { name: "マンオ記念館", en: "Mano Memorial Hall", type: "記念施設", summary: "記念ホール、保健診療室、出力センター、舞踊室がある建物です。", rows: [["-1F", "マンオ記念ホール"], ["-2F", "保健診療室 / 出力(POD)センター"], ["-3F", "マンオオーディトリアム / 舞踊室"]] },
    zh: { name: "万五纪念馆", en: "Mano Memorial Hall", type: "纪念设施", summary: "设有纪念厅、保健诊疗室、POD输出中心、礼堂和舞蹈室。", rows: [["-1F", "万五纪念厅"], ["-2F", "保健诊疗室 / POD输出中心"], ["-3F", "万五礼堂 / 舞蹈室"]] }
  }, ["만오", "보건진료실", "POD", "출력", "오디토리움", "무용", "무속"]),

  campusBuilding("H", "부산외국어대학교 도서관", 61, 14, {
    ko: { name: "도서관", en: "Library", type: "Library", summary: "미디어자료실, 글로벌자료실, 전자자료실, 주제자료실, 정보통신팀, 창업지원단, AI 부트캠프가 있는 학습·지원 시설입니다.", rows: [["-1F", "미디어자료실 / 라이브러리카페 / 금샘소극장 / 그룹스터디룸 1~10실"], ["-2F", "글로벌자료실 / 디지털존 / 그룹스터디룸 6실"], ["-3F", "제1주제자료실 / 캐럴존 / 그룹스터디룸 6실"], ["-4F", "제2주제자료실 / 학술정보팀 / 그룹스터디룸 5실"], ["-5F", "정보통신팀 / 창업지원단 / AI 부트캠프"]] },
    en: { name: "Library", en: "Library", type: "Learning and support facility", summary: "Learning and support facility with media room, global resources, study rooms, IT team, Startup Support Group, and AI Bootcamp.", rows: [["-1F", "Media room / Library cafe / Geumsaem small theater / Group study rooms 1–10"], ["-2F", "Global resources room / Digital zone / Group study rooms 6"], ["-3F", "Subject resources room 1 / Carrel zone / Group study rooms 6"], ["-4F", "Subject resources room 2 / Academic information team / Group study rooms 5"], ["-5F", "Information & Communication Team / Startup Support Group / AI Bootcamp"]] },
    vi: { name: "Thư viện", en: "Library", type: "Cơ sở học tập và hỗ trợ", summary: "Cơ sở có phòng media, tài liệu toàn cầu, phòng học nhóm, đội CNTT, hỗ trợ khởi nghiệp và AI Bootcamp.", rows: [["-1F", "Phòng media / Cafe thư viện / Nhà hát nhỏ Geumsaem / Phòng học nhóm 1–10"], ["-2F", "Phòng tài liệu toàn cầu / Digital zone / 6 phòng học nhóm"], ["-3F", "Phòng tài liệu chủ đề 1 / Carrel zone / 6 phòng học nhóm"], ["-4F", "Phòng tài liệu chủ đề 2 / Đội thông tin học thuật / 5 phòng học nhóm"], ["-5F", "Đội thông tin truyền thông / Hỗ trợ khởi nghiệp / AI Bootcamp"]] },
    ja: { name: "図書館", en: "Library", type: "学習・支援施設", summary: "メディア資料室、グローバル資料室、スタディルーム、情報通信チーム、創業支援団、AIブートキャンプがあります。", rows: [["-1F", "メディア資料室 / ライブラリーカフェ / クムセム小劇場 / グループスタディルーム1〜10"], ["-2F", "グローバル資料室 / デジタルゾーン / グループスタディルーム6室"], ["-3F", "第1主題資料室 / キャレルゾーン / グループスタディルーム6室"], ["-4F", "第2主題資料室 / 学術情報チーム / グループスタディルーム5室"], ["-5F", "情報通信チーム / 創業支援団 / AIブートキャンプ"]] },
    zh: { name: "图书馆", en: "Library", type: "学习与支援设施", summary: "设有媒体资料室、全球资料室、小组学习室、信息通信组、创业支援团和AI Bootcamp。", rows: [["-1F", "媒体资料室 / 图书馆咖啡 / 金샘小剧场 / 小组学习室1~10"], ["-2F", "全球资料室 / Digital Zone / 小组学习室6间"], ["-3F", "第1主题资料室 / Carrel Zone / 小组学习室6间"], ["-4F", "第2主题资料室 / 学术信息组 / 小组学习室5间"], ["-5F", "信息通信组 / 创业支援团 / AI Bootcamp"]] }
  }, ["도서관", "미디어자료실", "라이브러리", "카페", "금샘소극장", "스터디룸", "글로벌자료실", "디지털존", "캐럴존", "학술정보팀", "정보통신팀", "창업지원단", "창업", "AI 부트캠프", "부트캠프", "ai bootcamp"]),

  campusBuilding("I", "부산외국어대학교 비즈니스텍센터", 72, 16, {
    ko: { name: "비즈니스텍센터", en: "Business Tech Center", type: "Business Tech Center", summary: "탐구장, 편의점, 강의실, 실습실, 계열사무실, 교수연구실, 교수회의실이 있는 건물입니다.", rows: [["-1F", "탐구장 & 탐구장 / 편의점"], ["-2F", "강의실 / 실습실"], ["-3F", "BT관련 / 강의실 / 실습실"], ["-4F", "계열사무실 / 외래강사실 / 강의실 / 실습실"], ["-5F", "교수연구실 33실 / 교수회의실"]] },
    en: { name: "Business Tech Center", en: "Business Tech Center", type: "Business Tech Center", summary: "Building with exploration spaces, convenience store, classrooms, labs, offices, faculty rooms and meeting room.", rows: [["-1F", "Exploration spaces / Convenience store"], ["-2F", "Classrooms / Labs"], ["-3F", "BT-related rooms / Classrooms / Labs"], ["-4F", "Department office / Adjunct lecturer room / Classrooms / Labs"], ["-5F", "Faculty offices 33 / Faculty meeting room"]] },
    vi: { name: "Trung tâm Business Tech", en: "Business Tech Center", type: "Business Tech Center", summary: "Tòa nhà có không gian khám phá, cửa hàng tiện lợi, phòng học, phòng thực hành và phòng giáo sư.", rows: [["-1F", "Không gian khám phá / Cửa hàng tiện lợi"], ["-2F", "Phòng học / Phòng thực hành"], ["-3F", "Phòng liên quan BT / Phòng học / Phòng thực hành"], ["-4F", "Văn phòng khoa / Phòng giảng viên thỉnh giảng / Phòng học / Phòng thực hành"], ["-5F", "Phòng giáo sư 33 / Phòng họp giáo sư"]] },
    ja: { name: "ビジネステックセンター", en: "Business Tech Center", type: "Business Tech Center", summary: "探究スペース、コンビニ、講義室、実習室、教授研究室がある建物です。", rows: [["-1F", "探究スペース / コンビニ"], ["-2F", "講義室 / 実習室"], ["-3F", "BT関連 / 講義室 / 実習室"], ["-4F", "系列事務室 / 非常勤講師室 / 講義室 / 実習室"], ["-5F", "教授研究室33室 / 教授会議室"]] },
    zh: { name: "商务科技中心", en: "Business Tech Center", type: "Business Tech Center", summary: "设有探索空间、便利店、教室、实习室、教授研究室和会议室。", rows: [["-1F", "探索空间 / 便利店"], ["-2F", "教室 / 实习室"], ["-3F", "BT相关 / 教室 / 实习室"], ["-4F", "系列办公室 / 外聘讲师室 / 教室 / 实习室"], ["-5F", "教授研究室33间 / 教授会议室"]] }
  }, ["비즈니스", "비즈니스텍", "편의점", "BT", "실습실", "교수회의실"]),

  campusBuilding("J", "부산외국어대학교 대학교회", 49, 65, {
    ko: { name: "대학교회", en: "University Church", type: "예배·건학이념 안내", summary: "부산외국어대학교 대학교회입니다.", rows: [["주요", "대학교회"], ["정보 1", "주일 예배 오전 11시, 대학부 예배 오후 2시, 수요일 기도회: 오후 4시 30분, 아침기도회: 월~금 오전 8시 30분"], ["건학이념", "여호와를 경외하는 것이 지식의 근본이니라(잠언 1:7)"]] },
    en: { name: "University Church", en: "University Church", type: "Worship and founding philosophy", summary: "This is the University Church of Busan University of Foreign Studies.", rows: [["Main", "University Church"], ["Info 1", "Sunday worship 11:00 AM, College worship 2:00 PM, Wednesday prayer meeting 4:30 PM, Morning prayer Monday–Friday 8:30 AM"], ["Founding philosophy", "The fear of the LORD is the beginning of knowledge (Proverbs 1:7)"]] },
    vi: { name: "Nhà thờ Đại học", en: "University Church", type: "Thờ phượng và triết lý sáng lập", summary: "Đây là Nhà thờ Đại học của Đại học Ngoại ngữ Busan.", rows: [["Chính", "Nhà thờ Đại học"], ["Thông tin 1", "Lễ Chúa nhật 11:00, lễ sinh viên đại học 14:00, cầu nguyện thứ Tư 16:30, cầu nguyện buổi sáng thứ Hai–thứ Sáu 8:30"], ["Triết lý sáng lập", "Kính sợ Đức Giê-hô-va là khởi đầu tri thức (Châm ngôn 1:7)"]] },
    ja: { name: "大学教会", en: "University Church", type: "礼拝・建学理念案内", summary: "釜山外国語大学の大学教会です。", rows: [["主要", "大学教会"], ["情報 1", "主日礼拝 午前11時、大学部礼拝 午後2時、水曜祈祷会 午後4時30分、朝祈祷会 月〜金 午前8時30分"], ["建学理念", "主を恐れることは知識の初めである（箴言 1:7）"]] },
    zh: { name: "大学教会", en: "University Church", type: "礼拜与建校理念指南", summary: "这里是釜山外国语大学的大学教会。", rows: [["主要", "大学教会"], ["信息 1", "主日礼拜上午11点，大学部礼拜下午2点，周三祷告会下午4点30分，晨祷会周一至周五上午8点30分"], ["建校理念", "敬畏耶和华是知识的开端（箴言 1:7）"]] }
  }, ["대학교회", "교회", "예배", "기도회", "건학이념", "잠언", "주일", "대학부", "아침기도"])
];

let currentLang = "ko";
let selected = buildings[0];
let currentPosition = null;
let watchId = null;
let lastLocationKey = "notLocated";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const tr = (key) => (i18n[currentLang] && i18n[currentLang][key]) || i18n.ko[key] || key;
const bt = (building) => building.text[currentLang] || building.text.ko;

function renderBuildings() {
  const buttons = $("#buildingButtons");
  const pins = $("#mapPins");

  buttons.innerHTML = buildings.map((building) => {
    const text = bt(building);
    return `<button type="button" data-building="${building.code}" role="listitem"><span class="building-code">${building.code}</span><span>${text.name}<br><small>${text.en}</small></span></button>`;
  }).join("");

  pins.innerHTML = buildings.map((building) => `<button type="button" class="map-pin" data-building="${building.code}" style="left:${building.pin.left}%;top:${building.pin.top}%" aria-label="${building.code} ${bt(building).name} 선택">${building.code}</button>`).join("");
}

function selectBuilding(code) {
  selected = buildings.find((building) => building.code === code) || buildings[0];
  const text = bt(selected);

  $$("[data-building]").forEach((button) => button.classList.toggle("active", button.dataset.building === selected.code));
  $("#selectedName").textContent = `${selected.code} ${text.name}`;
  $("#selectedMeta").textContent = `${text.en} · ${text.type}`;
  $("#selectedSummary").textContent = text.summary;
  $("#floorInfo").innerHTML = text.rows.map(([label, value]) => `<div class="floor-row"><strong>${label}</strong><span>${value}</span></div>`).join("");
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
}

function findBuildingByQuestion(question) {
  const q = normalize(question);
  return buildings.find((building) => {
    const text = building.text.ko;
    const targets = [building.code, text.name, text.en, text.type, text.summary, ...text.rows.flat(), ...(building.aliases || [])];
    return targets.some((target) => normalize(target) && q.includes(normalize(target)));
  });
}

function answerAgent() {
  const question = $("#agentQuestion").value.trim();
  if (!question) {
    $("#agentAnswer").textContent = "질문을 입력해 주세요. 예: AI 부트캠프 어디야?";
    return;
  }

  const found = findBuildingByQuestion(question);
  if (!found) {
    $("#agentAnswer").textContent = "현재 등록된 건물 데이터에서 해당 시설을 찾지 못했습니다. 건물명, 층수 또는 시설명을 다시 입력해 주세요. 확인되지 않은 정보는 임의로 안내하지 않습니다.";
    return;
  }

  selectBuilding(found.code);
  const text = found.text.ko;
  const rows = text.rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const locationPart = currentPosition ? "현재 위치가 확인되어 있으므로 지도에서 목적지 건물을 확인한 뒤 이동 안내를 이어갈 수 있습니다." : "현재 위치 확인을 먼저 누르면 GPS 기준 안내를 함께 사용할 수 있습니다.";

  $("#agentAnswer").textContent = `${found.code} ${text.name} 안내입니다.\n${text.summary}\n\n${rows}\n\n${locationPart}`;
  $("#selectedName").scrollIntoView({ behavior: "smooth", block: "center" });
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  $$("[data-i18n]").forEach((el) => { el.innerHTML = tr(el.dataset.i18n); });
  $$("[data-i18n-placeholder]").forEach((el) => { el.setAttribute("placeholder", tr(el.dataset.i18nPlaceholder)); });
  $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === lang));
  if (watchId === null) $("#watchBtn").textContent = tr("watchBtn");
  else $("#watchBtn").textContent = tr("watchStop");
  $("#agentAnswer").textContent = tr("agentDefault");
  renderBuildings();
  selectBuilding(selected.code);
  updateSecureNotice();
  updateLocationText();
}

function updateSecureNotice() {
  $("#secureNotice").textContent = (location.protocol === "https:" || location.hostname === "localhost") ? tr("secureOk") : tr("secureWarn");
}

function updateLocationText() {
  if (currentPosition) {
    const { latitude, longitude, accuracy } = currentPosition.coords;
    $("#locationStatus").textContent = `${tr("currentPosition")}: ${tr("latitude")} ${latitude.toFixed(6)}, ${tr("longitude")} ${longitude.toFixed(6)}`;
    $("#accuracyStatus").textContent = `${tr("accuracy")}: ${tr("approx")} ${Math.round(accuracy)}${tr("meter")}`;
    return;
  }
  $("#locationStatus").textContent = tr(lastLocationKey);
  $("#accuracyStatus").textContent = tr("accuracyDefault");
}

function locateOnce() {
  if (!navigator.geolocation) {
    lastLocationKey = "geoUnsupported";
    updateLocationText();
    return;
  }
  lastLocationKey = "locating";
  updateLocationText();
  navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
}

function toggleWatch() {
  if (!navigator.geolocation) {
    lastLocationKey = "geoUnsupported";
    updateLocationText();
    return;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    $("#watchBtn").textContent = tr("watchBtn");
    lastLocationKey = currentPosition ? "watchStoppedWithPosition" : "watchStopped";
    if (currentPosition) $("#locationStatus").textContent = tr("watchStoppedWithPosition");
    else updateLocationText();
    return;
  }

  $("#watchBtn").textContent = tr("watchStop");
  lastLocationKey = "watching";
  updateLocationText();
  watchId = navigator.geolocation.watchPosition(handlePosition, handlePositionError, { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 });
}

function handlePosition(position) {
  currentPosition = position;
  updateLocationText();
}

function handlePositionError(error) {
  const keys = { 1: "permissionDenied", 2: "unavailable", 3: "timeout" };
  lastLocationKey = keys[error.code] || "error";
  currentPosition = null;
  updateLocationText();
}

document.addEventListener("DOMContentLoaded", () => {
  renderBuildings();
  updateSecureNotice();
  selectBuilding("A");
  updateLocationText();
  applyLanguage("ko");

  $("#locateBtn").addEventListener("click", locateOnce);
  $("#watchBtn").addEventListener("click", toggleWatch);
  $("#agentAskBtn").addEventListener("click", answerAgent);
  $("#agentQuestion").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") answerAgent();
  });

  document.body.addEventListener("click", (event) => {
    const sample = event.target.closest("[data-agent-sample]");
    if (sample) {
      $("#agentQuestion").value = sample.dataset.agentSample;
      answerAgent();
      return;
    }

    const langButton = event.target.closest("[data-lang]");
    if (langButton) {
      applyLanguage(langButton.dataset.lang);
      return;
    }

    const button = event.target.closest("[data-building]");
    if (button) {
      selectBuilding(button.dataset.building);
      $("#selectedName").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

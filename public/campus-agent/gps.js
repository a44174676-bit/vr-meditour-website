const i18n = {
  ko: {
    heroTitle: "부산외대<br />GPS 캠퍼스 길찾기",
    heroLead: "휴대폰 위치 권한을 허용하면 현재 위치를 기준으로 선택한 건물까지 길찾기를 열 수 있습니다.",
    sectionLocation: "1. 현재 위치 확인",
    sectionDestination: "2. 목적지 건물 선택",
    sectionMap: "3. 캠퍼스맵에서 위치 확인",
    mapDescription: "첨부한 공식 소스의 A~J 건물 구조를 모바일용으로 다시 구성했습니다.",
    locateBtn: "내 위치 찾기",
    watchBtn: "실시간 위치 추적",
    watchStop: "위치 추적 중지",
    notLocated: "아직 위치를 확인하지 않았습니다.",
    accuracyDefault: "정확도: -",
    secureOk: "현재 접속 환경은 GPS 사용이 가능한 보안 환경입니다.",
    secureWarn: "주의: 휴대폰 GPS는 보통 HTTPS 환경에서만 정상 작동합니다. 배포 주소가 https:// 로 시작하는지 확인하세요.",
    locating: "현재 위치를 확인하는 중입니다...",
    watching: "실시간 위치를 추적하는 중입니다...",
    watchStoppedWithPosition: "실시간 추적을 중지했습니다. 마지막 위치를 기준으로 길찾기를 사용할 수 있습니다.",
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
    selectedLabel: "Selected Building",
    directionTitle: "길찾기 열기",
    directionHelp: "위치 확인 후 누르면 현재 위치를 출발지로 사용합니다.",
    google: "Google 길찾기",
    naver: "네이버지도 검색",
    kakao: "카카오맵 검색",
    main: "주요",
    info: "정보",
    testTitle: "테스트 기준",
    testText: "휴대폰에서 접속 → 위치 권한 허용 → 건물 선택 → Google/네이버/카카오 길찾기 열기 순서로 테스트합니다. 건물별 세부 좌표는 지도 서비스 검색 결과를 사용하며, 캠퍼스 내부 세밀한 도보 경로는 현장 검증 후 보정합니다."
  },
  en: {
    heroTitle: "BUFS<br />GPS Campus Guide",
    heroLead: "Allow location access on your phone, then open directions from your current location to the selected campus building.",
    sectionLocation: "1. Check current location",
    sectionDestination: "2. Select destination building",
    sectionMap: "3. Check location on campus map",
    mapDescription: "The A–J building structure from the official source has been rebuilt for mobile use.",
    locateBtn: "Find my location",
    watchBtn: "Track live location",
    watchStop: "Stop tracking",
    notLocated: "Your location has not been checked yet.",
    accuracyDefault: "Accuracy: -",
    secureOk: "This secure connection can use GPS location.",
    secureWarn: "Note: Mobile GPS usually works only on HTTPS. Check that the page address starts with https://.",
    locating: "Checking your current location...",
    watching: "Tracking your live location...",
    watchStoppedWithPosition: "Live tracking stopped. Directions can use the last confirmed location.",
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
    selectedLabel: "Selected Building",
    directionTitle: "Open directions",
    directionHelp: "After location is confirmed, this uses your current location as the starting point.",
    google: "Google Directions",
    naver: "Naver Map Search",
    kakao: "Kakao Map Search",
    main: "Main",
    info: "Info",
    testTitle: "Test flow",
    testText: "Open on a phone → allow location permission → select a building → open Google/Naver/Kakao directions. Detailed building coordinates use map service search results, and fine campus walking routes should be calibrated after field testing."
  },
  vi: {
    heroTitle: "BUFS<br />Chỉ đường GPS trong khuôn viên",
    heroLead: "Cho phép truy cập vị trí trên điện thoại để mở chỉ đường từ vị trí hiện tại đến tòa nhà đã chọn.",
    sectionLocation: "1. Kiểm tra vị trí hiện tại",
    sectionDestination: "2. Chọn tòa nhà đích",
    sectionMap: "3. Xem vị trí trên bản đồ khuôn viên",
    mapDescription: "Cấu trúc tòa nhà A–J từ nguồn chính thức đã được tái cấu trúc cho di động.",
    locateBtn: "Tìm vị trí của tôi",
    watchBtn: "Theo dõi vị trí trực tiếp",
    watchStop: "Dừng theo dõi",
    notLocated: "Chưa kiểm tra vị trí hiện tại.",
    accuracyDefault: "Độ chính xác: -",
    secureOk: "Kết nối bảo mật hiện tại có thể sử dụng GPS.",
    secureWarn: "Lưu ý: GPS trên điện thoại thường chỉ hoạt động với HTTPS. Hãy kiểm tra địa chỉ bắt đầu bằng https://.",
    locating: "Đang kiểm tra vị trí hiện tại...",
    watching: "Đang theo dõi vị trí trực tiếp...",
    watchStoppedWithPosition: "Đã dừng theo dõi. Có thể dùng vị trí cuối cùng để chỉ đường.",
    watchStopped: "Đã dừng theo dõi vị trí.",
    geoUnsupported: "Trình duyệt này không hỗ trợ định vị GPS.",
    permissionDenied: "Quyền vị trí đã bị từ chối. Vui lòng cho phép trong cài đặt trình duyệt điện thoại.",
    unavailable: "Không thể xác định vị trí hiện tại. Hãy thử ngoài trời hoặc gần cửa sổ.",
    timeout: "Yêu cầu vị trí quá thời gian. Vui lòng thử lại.",
    error: "Đã xảy ra lỗi khi kiểm tra vị trí.",
    currentPosition: "Đã xác nhận vị trí hiện tại",
    latitude: "Vĩ độ",
    longitude: "Kinh độ",
    accuracy: "Độ chính xác",
    approx: "khoảng",
    meter: "m",
    selectedLabel: "Tòa nhà đã chọn",
    directionTitle: "Mở chỉ đường",
    directionHelp: "Sau khi xác nhận vị trí, hệ thống dùng vị trí hiện tại làm điểm xuất phát.",
    google: "Chỉ đường Google",
    naver: "Tìm trên Naver Map",
    kakao: "Tìm trên Kakao Map",
    main: "Chính",
    info: "Thông tin",
    testTitle: "Quy trình kiểm tra",
    testText: "Mở bằng điện thoại → cho phép vị trí → chọn tòa nhà → mở chỉ đường Google/Naver/Kakao. Tọa độ chi tiết của từng tòa nhà dùng kết quả tìm kiếm bản đồ, còn tuyến đi bộ trong khuôn viên cần hiệu chỉnh sau khi kiểm tra thực địa."
  },
  ja: {
    heroTitle: "釜山外国語大学<br />GPSキャンパス案内",
    heroLead: "スマートフォンで位置情報を許可すると、現在地から選択した建物までの経路を開けます。",
    sectionLocation: "1. 現在地を確認",
    sectionDestination: "2. 目的地の建物を選択",
    sectionMap: "3. キャンパスマップで位置確認",
    mapDescription: "公式ソースのA〜J建物構成をモバイル用に再構成しました。",
    locateBtn: "現在地を探す",
    watchBtn: "リアルタイム追跡",
    watchStop: "追跡を停止",
    notLocated: "まだ現在地を確認していません。",
    accuracyDefault: "精度: -",
    secureOk: "現在の安全な接続ではGPSを使用できます。",
    secureWarn: "注意: スマートフォンのGPSは通常HTTPSでのみ正常に動作します。URLがhttps://で始まるか確認してください。",
    locating: "現在地を確認しています...",
    watching: "現在地をリアルタイムで追跡しています...",
    watchStoppedWithPosition: "追跡を停止しました。最後に確認した位置を経路案内に使用できます。",
    watchStopped: "追跡を停止しました。",
    geoUnsupported: "このブラウザはGPS位置確認に対応していません。",
    permissionDenied: "位置情報の権限が拒否されました。ブラウザ設定で位置情報を許可してください。",
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
    directionTitle: "経路を開く",
    directionHelp: "位置確認後、現在地を出発地として使用します。",
    google: "Google経路案内",
    naver: "Naver Map検索",
    kakao: "Kakao Map検索",
    main: "主要",
    info: "情報",
    testTitle: "テスト基準",
    testText: "スマートフォンで接続 → 位置情報を許可 → 建物を選択 → Google/Naver/Kakaoの経路を開く順にテストします。建物ごとの詳細座標は地図サービスの検索結果を使用し、キャンパス内の細かな徒歩経路は現地検証後に補正します。"
  },
  zh: {
    heroTitle: "釜山外国语大学<br />GPS校园导航",
    heroLead: "在手机上允许位置权限后，可以从当前位置打开到所选建筑的路线。",
    sectionLocation: "1. 确认当前位置",
    sectionDestination: "2. 选择目的地建筑",
    sectionMap: "3. 在校园地图中确认位置",
    mapDescription: "已将官方来源中的A–J建筑结构重新整理为移动端版本。",
    locateBtn: "查找我的位置",
    watchBtn: "实时位置追踪",
    watchStop: "停止追踪",
    notLocated: "尚未确认当前位置。",
    accuracyDefault: "精度: -",
    secureOk: "当前安全连接可以使用GPS定位。",
    secureWarn: "注意：手机GPS通常只在HTTPS环境下正常工作。请确认地址以https://开头。",
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
    directionTitle: "打开路线",
    directionHelp: "确认位置后，将当前位置作为出发点。",
    google: "Google路线",
    naver: "Naver地图搜索",
    kakao: "Kakao地图搜索",
    main: "主要",
    info: "信息",
    testTitle: "测试标准",
    testText: "用手机打开 → 允许位置权限 → 选择建筑 → 打开Google/Naver/Kakao路线。各建筑详细坐标使用地图服务搜索结果，校园内部精细步行路线需现场验证后修正。"
  }
};

const buildings = [
  {
    code: "A",
    query: "부산외국어대학교 글로벌센터",
    pin: { left: 31, top: 49 },
    text: {
      ko: { name: "글로벌센터", en: "Global Center", type: "평생교육원 A302", summary: "공식 오시는 길 기준 평생교육원은 글로벌센터 A302호입니다. 처음 테스트할 대표 목적지로 가장 적합합니다.", floors: ["A302 평생교육원", "1F 복지매장·편의시설", "건물 입구 사진은 공식 오시는 길 자료 기준으로 확인"] },
      en: { name: "Global Center", en: "Global Center", type: "Lifelong Education Center A302", summary: "The Lifelong Education Center is located in Global Center A302. This is the best first destination for testing.", floors: ["A302 Lifelong Education Center", "1F Welfare store and amenities", "Building entrance can be checked using the official access guide photos"] },
      vi: { name: "Trung tâm Toàn cầu", en: "Global Center", type: "Trung tâm Giáo dục thường xuyên A302", summary: "Trung tâm Giáo dục thường xuyên nằm tại A302, Global Center. Đây là điểm đến đại diện phù hợp nhất để kiểm tra.", floors: ["A302 Trung tâm Giáo dục thường xuyên", "Tầng 1 cửa hàng tiện ích", "Lối vào tòa nhà kiểm tra theo ảnh hướng dẫn chính thức"] },
      ja: { name: "グローバルセンター", en: "Global Center", type: "生涯教育院 A302", summary: "生涯教育院はグローバルセンターA302にあります。最初のテスト目的地として適しています。", floors: ["A302 生涯教育院", "1F 福利施設・便宜施設", "建物入口は公式アクセス案内写真で確認"] },
      zh: { name: "全球中心", en: "Global Center", type: "终身教育院 A302", summary: "终身教育院位于全球中心A302，是最适合首次测试的目的地。", floors: ["A302 终身教育院", "1F 福利商店与便利设施", "建筑入口可参考官方到访指南照片"] }
    }
  },
  {
    code: "B",
    query: "부산외국어대학교 체육관",
    pin: { left: 36, top: 40 },
    text: {
      ko: { name: "체육관", en: "Gymnasium", type: "체육·행사 시설", summary: "체육 수업, 행사, 체육시설 방문 목적지입니다.", floors: ["체육·행사 시설", "세부 실내 위치는 현장 표지판 확인"] },
      en: { name: "Gymnasium", en: "Gymnasium", type: "Sports and event facility", summary: "Destination for sports classes, events, and gym facilities.", floors: ["Sports and event facility", "Check indoor details using on-site signs"] },
      vi: { name: "Nhà thể thao", en: "Gymnasium", type: "Cơ sở thể thao và sự kiện", summary: "Điểm đến cho lớp thể thao, sự kiện và cơ sở thể thao.", floors: ["Cơ sở thể thao và sự kiện", "Vị trí chi tiết bên trong kiểm tra theo biển chỉ dẫn tại chỗ"] },
      ja: { name: "体育館", en: "Gymnasium", type: "体育・イベント施設", summary: "体育授業、行事、体育施設の目的地です。", floors: ["体育・イベント施設", "屋内の詳細位置は現地表示で確認"] },
      zh: { name: "体育馆", en: "Gymnasium", type: "体育与活动设施", summary: "用于体育课程、活动和体育设施访问。", floors: ["体育与活动设施", "室内详细位置请按现场标识确认"] }
    }
  },
  {
    code: "C",
    query: "부산외국어대학교 기숙사",
    pin: { left: 25, top: 33 },
    text: {
      ko: { name: "기숙사", en: "Dormitory", type: "생활관", summary: "학생 생활관 및 기숙사 관련 안내 목적지입니다.", floors: ["기숙사·생활관", "사감실·세탁실 등은 현장 안내 기준 확인"] },
      en: { name: "Dormitory", en: "Dormitory", type: "Residence hall", summary: "Destination for student residence and dormitory guidance.", floors: ["Dormitory and residence hall", "Check office, laundry and other details on site"] },
      vi: { name: "Ký túc xá", en: "Dormitory", type: "Khu nhà ở sinh viên", summary: "Điểm đến cho hướng dẫn liên quan đến ký túc xá sinh viên.", floors: ["Ký túc xá và khu nhà ở", "Văn phòng quản lý, phòng giặt... kiểm tra tại chỗ"] },
      ja: { name: "寮", en: "Dormitory", type: "生活館", summary: "学生寮および生活館関連の案内目的地です。", floors: ["寮・生活館", "管理室・洗濯室などは現地案内で確認"] },
      zh: { name: "宿舍", en: "Dormitory", type: "生活馆", summary: "学生生活馆和宿舍相关导航目的地。", floors: ["宿舍·生活馆", "舍监室、洗衣房等请按现场指引确认"] }
    }
  },
  {
    code: "D",
    query: "부산외국어대학교 트리니티홀",
    pin: { left: 47, top: 21 },
    text: {
      ko: { name: "트리니티홀", en: "Trinity Hall", type: "강의·연구 시설", summary: "강의실, 연구실, 학과 관련 방문에 사용하는 목적지입니다.", floors: ["강의·연구 시설", "학과·강의실 세부 위치는 시간표 또는 현장 표지판 확인"] },
      en: { name: "Trinity Hall", en: "Trinity Hall", type: "Lecture and research facility", summary: "Destination for classrooms, labs, and department visits.", floors: ["Lecture and research facility", "Check detailed room location by timetable or on-site signs"] },
      vi: { name: "Trinity Hall", en: "Trinity Hall", type: "Cơ sở giảng dạy và nghiên cứu", summary: "Điểm đến cho phòng học, phòng nghiên cứu và khoa.", floors: ["Cơ sở giảng dạy và nghiên cứu", "Phòng chi tiết kiểm tra theo thời khóa biểu hoặc biển chỉ dẫn"] },
      ja: { name: "トリニティホール", en: "Trinity Hall", type: "講義・研究施設", summary: "講義室、研究室、学科関連の訪問目的地です。", floors: ["講義・研究施設", "学科・講義室の詳細は時間割または現地表示で確認"] },
      zh: { name: "三一厅", en: "Trinity Hall", type: "教学与研究设施", summary: "用于教室、研究室和院系访问。", floors: ["教学与研究设施", "院系与教室详细位置请看课表或现场标识"] }
    }
  },
  {
    code: "E",
    query: "부산외국어대학교 메모리얼광장",
    pin: { left: 57, top: 35 },
    text: {
      ko: { name: "메모리얼광장", en: "Memorial Square", type: "광장·편의시설", summary: "캠퍼스 중앙 이동 기준점으로 쓰기 좋은 공간입니다.", floors: ["B1F 학생식당·카페", "장애인전용 엘리베이터"] },
      en: { name: "Memorial Square", en: "Memorial Square", type: "Square and amenities", summary: "A useful central reference point for moving around campus.", floors: ["B1F Student cafeteria and cafe", "Accessible elevator"] },
      vi: { name: "Quảng trường Memorial", en: "Memorial Square", type: "Quảng trường và tiện ích", summary: "Điểm mốc trung tâm hữu ích khi di chuyển trong khuôn viên.", floors: ["B1F nhà ăn sinh viên và quán cà phê", "Thang máy dành cho người khuyết tật"] },
      ja: { name: "メモリアル広場", en: "Memorial Square", type: "広場・便宜施設", summary: "キャンパス中央の移動基準点として使いやすい場所です。", floors: ["B1F 学生食堂・カフェ", "障害者専用エレベーター"] },
      zh: { name: "纪念广场", en: "Memorial Square", type: "广场与便利设施", summary: "适合作为校园中央移动基准点。", floors: ["B1F 学生食堂与咖啡厅", "无障碍专用电梯"] }
    }
  },
  {
    code: "F",
    query: "부산외국어대학교 대학본부",
    pin: { left: 66, top: 31 },
    text: {
      ko: { name: "대학본부", en: "University Headquarters", type: "행정 시설", summary: "학사·행정 민원, 학교 본부 방문 목적지입니다.", floors: ["행정·학사 관련 부서", "방문 전 담당 부서와 층수 확인 권장"] },
      en: { name: "University Headquarters", en: "University Headquarters", type: "Administrative facility", summary: "Destination for academic and administrative services.", floors: ["Administrative and academic offices", "Check department and floor before visiting"] },
      vi: { name: "Tòa nhà hành chính", en: "University Headquarters", type: "Cơ sở hành chính", summary: "Điểm đến cho dịch vụ học vụ và hành chính.", floors: ["Các phòng hành chính và học vụ", "Nên kiểm tra phòng ban và tầng trước khi đến"] },
      ja: { name: "大学本部", en: "University Headquarters", type: "行政施設", summary: "学事・行政窓口、大学本部訪問の目的地です。", floors: ["行政・学事関連部署", "訪問前に担当部署と階数確認を推奨"] },
      zh: { name: "大学本部", en: "University Headquarters", type: "行政设施", summary: "用于学务、行政事务和大学本部访问。", floors: ["行政与学务相关部门", "建议访问前确认负责部门和楼层"] }
    }
  },
  {
    code: "G",
    query: "부산외국어대학교 만오기념관",
    pin: { left: 63, top: 24 },
    text: {
      ko: { name: "만오기념관", en: "Manoh Memorial Hall", type: "기념관·강의 시설", summary: "강의, 행사, 기념관 관련 방문 목적지입니다.", floors: ["기념관·강의 시설", "세부 호실은 현장 안내 기준 확인"] },
      en: { name: "Manoh Memorial Hall", en: "Manoh Memorial Hall", type: "Memorial and lecture facility", summary: "Destination for lectures, events, and memorial hall visits.", floors: ["Memorial and lecture facility", "Check detailed room on site"] },
      vi: { name: "Nhà kỷ niệm Manoh", en: "Manoh Memorial Hall", type: "Cơ sở kỷ niệm và giảng dạy", summary: "Điểm đến cho lớp học, sự kiện và nhà kỷ niệm.", floors: ["Cơ sở kỷ niệm và giảng dạy", "Phòng chi tiết kiểm tra tại chỗ"] },
      ja: { name: "マンオ記念館", en: "Manoh Memorial Hall", type: "記念館・講義施設", summary: "講義、行事、記念館関連の訪問目的地です。", floors: ["記念館・講義施設", "詳細号室は現地案内で確認"] },
      zh: { name: "万五纪念馆", en: "Manoh Memorial Hall", type: "纪念馆与教学设施", summary: "用于讲课、活动和纪念馆访问。", floors: ["纪念馆与教学设施", "详细房间请按现场指引确认"] }
    }
  },
  {
    code: "H",
    query: "부산외국어대학교 도서관",
    pin: { left: 61, top: 14 },
    text: {
      ko: { name: "도서관", en: "Library", type: "학습 시설", summary: "자료 열람, 학습, 스터디, 도서관 서비스 이용 목적지입니다.", floors: ["도서관·열람 공간", "자료실·스터디룸·프린터 위치는 현장 안내 기준 확인"] },
      en: { name: "Library", en: "Library", type: "Learning facility", summary: "Destination for reading, study, group study, and library services.", floors: ["Library and reading space", "Check archive, study room and printer locations on site"] },
      vi: { name: "Thư viện", en: "Library", type: "Cơ sở học tập", summary: "Điểm đến cho đọc tài liệu, học tập, phòng học nhóm và dịch vụ thư viện.", floors: ["Thư viện và không gian đọc", "Phòng tài liệu, phòng học nhóm, máy in kiểm tra tại chỗ"] },
      ja: { name: "図書館", en: "Library", type: "学習施設", summary: "資料閲覧、学習、スタディ、図書館サービス利用の目的地です。", floors: ["図書館・閲覧空間", "資料室・スタディルーム・プリンター位置は現地案内で確認"] },
      zh: { name: "图书馆", en: "Library", type: "学习设施", summary: "用于资料阅览、学习、小组学习和图书馆服务。", floors: ["图书馆与阅览空间", "资料室、小组学习室、打印机位置请现场确认"] }
    }
  },
  {
    code: "I",
    query: "부산외국어대학교 비즈니스텍센터",
    pin: { left: 72, top: 16 },
    text: {
      ko: { name: "비즈니스텍센터", en: "Business Tech Center", type: "교육·비즈니스 시설", summary: "비즈니스·기술·교육 관련 시설 방문 목적지입니다.", floors: ["교육·비즈니스 관련 시설", "세부 호실은 현장 안내 기준 확인"] },
      en: { name: "Business Tech Center", en: "Business Tech Center", type: "Education and business facility", summary: "Destination for business, technology, and education facilities.", floors: ["Education and business facility", "Check detailed room on site"] },
      vi: { name: "Trung tâm Business Tech", en: "Business Tech Center", type: "Cơ sở giáo dục và kinh doanh", summary: "Điểm đến cho cơ sở kinh doanh, công nghệ và giáo dục.", floors: ["Cơ sở giáo dục và kinh doanh", "Phòng chi tiết kiểm tra tại chỗ"] },
      ja: { name: "ビジネステックセンター", en: "Business Tech Center", type: "教育・ビジネス施設", summary: "ビジネス・技術・教育関連施設の訪問目的地です。", floors: ["教育・ビジネス関連施設", "詳細号室は現地案内で確認"] },
      zh: { name: "商务科技中心", en: "Business Tech Center", type: "教育与商务设施", summary: "用于商务、技术和教育相关设施访问。", floors: ["教育与商务相关设施", "详细房间请按现场指引确认"] }
    }
  },
  {
    code: "J",
    query: "부산외국어대학교 건학관 대학교회",
    pin: { left: 49, top: 65 },
    text: {
      ko: { name: "건학관 VR", en: "Founding Hall VR", type: "건학관·VR 관련 지점", summary: "건학관 및 VR 관련 안내 목적지입니다.", floors: ["건학관", "대학교회"] },
      en: { name: "Founding Hall VR", en: "Founding Hall VR", type: "Founding Hall and VR point", summary: "Destination for Founding Hall and VR-related guidance.", floors: ["Founding Hall", "University Church"] },
      vi: { name: "Founding Hall VR", en: "Founding Hall VR", type: "Tòa Founding Hall và điểm VR", summary: "Điểm đến cho hướng dẫn liên quan đến Founding Hall và VR.", floors: ["Founding Hall", "Nhà thờ Đại học"] },
      ja: { name: "建学館 VR", en: "Founding Hall VR", type: "建学館・VR関連地点", summary: "建学館およびVR関連案内の目的地です。", floors: ["建学館", "大学教会"] },
      zh: { name: "建学馆 VR", en: "Founding Hall VR", type: "建学馆与VR相关地点", summary: "用于建学馆及VR相关导航。", floors: ["建学馆", "大学教会"] }
    }
  }
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
    return `
      <button type="button" data-building="${building.code}" role="listitem">
        <span class="building-code">${building.code}</span>
        <span>${text.name}<br><small>${text.en}</small></span>
      </button>
    `;
  }).join("");

  pins.innerHTML = buildings.map((building) => `
    <button
      type="button"
      class="map-pin"
      data-building="${building.code}"
      style="left:${building.pin.left}%;top:${building.pin.top}%"
      aria-label="${building.code} ${bt(building).name} 선택"
    >${building.code}</button>
  `).join("");
}

function selectBuilding(code) {
  selected = buildings.find((building) => building.code === code) || buildings[0];
  const text = bt(selected);

  $$("[data-building]").forEach((button) => {
    button.classList.toggle("active", button.dataset.building === selected.code);
  });

  $("#selectedName").textContent = `${selected.code} ${text.name}`;
  $("#selectedMeta").textContent = `${text.en} · ${text.type}`;
  $("#selectedSummary").textContent = text.summary;
  $("#floorInfo").innerHTML = text.floors.map((floor, index) => `
    <div class="floor-row">
      <strong>${index === 0 ? tr("main") : `${tr("info")} ${index}`}</strong>
      <span>${floor}</span>
    </div>
  `).join("");

  updateDirectionLinks();
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.innerHTML = tr(key);
  });
  $$("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
  $("#googleDirection").textContent = tr("google");
  $("#naverDirection").textContent = tr("naver");
  $("#kakaoDirection").textContent = tr("kakao");
  $(".detail-card .eyebrow").textContent = tr("selectedLabel");
  renderBuildings();
  selectBuilding(selected.code);
  updateSecureNotice();
  updateLocationText();
}

function updateSecureNotice() {
  const notice = $("#secureNotice");
  notice.textContent = (location.protocol === "https:" || location.hostname === "localhost") ? tr("secureOk") : tr("secureWarn");
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
    lastLocationKey = "geoUnsupported";
    updateLocationText();
    return;
  }

  lastLocationKey = "locating";
  updateLocationText();

  navigator.geolocation.getCurrentPosition(
    handlePosition,
    handlePositionError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
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
    const savedPosition = currentPosition;
    currentPosition = savedPosition;
    if (!currentPosition) updateLocationText();
    else $("#locationStatus").textContent = tr("watchStoppedWithPosition");
    return;
  }

  $("#watchBtn").textContent = tr("watchStop");
  lastLocationKey = "watching";
  updateLocationText();

  watchId = navigator.geolocation.watchPosition(
    handlePosition,
    handlePositionError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
  );
}

function handlePosition(position) {
  currentPosition = position;
  updateLocationText();
  updateDirectionLinks();
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

  $("#locateBtn").addEventListener("click", locateOnce);
  $("#watchBtn").addEventListener("click", toggleWatch);

  document.body.addEventListener("click", (event) => {
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

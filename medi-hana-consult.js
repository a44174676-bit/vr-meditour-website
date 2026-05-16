(() => {
  "use strict";

  const SUPPORTED_LANGS = ["ko", "en", "vi", "jp", "cn"];
  const PAGE_LANG_BY_MH_LANG = { ko: "ko", en: "en", vi: "vi", jp: "ja", cn: "zh" };
  const MH_LANG_BY_LANGUAGE_VALUE = {
    "한국어": "ko",
    English: "en",
    "Tiếng Việt": "vi",
    "日本語": "jp",
    "中文": "cn"
  };

  const MH_IMAGES = {
    ko: "/public/assets/medi-hana/medi-hana-ko.png?v=3",
    en: "/public/assets/medi-hana/medi-hana-en.png?v=3",
    vi: "/public/assets/medi-hana/medi-hana-vi.png?v=3",
    jp: "/public/assets/medi-hana/medi-hana-jp.png?v=3",
    cn: "/public/assets/medi-hana/medi-hana-cn.png?v=3",
    ar: "/public/assets/medi-hana/medi-hana-ar.png?v=3",
    default: "/public/assets/medi-hana/medi-hana-default.png?v=3"
  };

  const FIELD_CANDIDATES = {
    inquiryType: ["service", "type", "inquiryType", "consultType", "inquiry_type"],
    interest: ["interest", "category", "field", "treatment", "concern", "interested_field"],
    language: ["language", "preferredLanguage", "lang", "preferred_language"],
    name: ["name", "fullName", "customerName"],
    country: ["country", "nation"],
    email: ["email"],
    emailConfirm: ["emailConfirm", "confirmEmail", "email_confirm"],
    phone: ["phone", "tel", "mobile"],
    messenger: ["messenger", "contactMessenger", "zalo", "whatsapp", "kakao", "sns"],
    location: ["location", "currentLocation", "city"],
    message: ["message", "inquiry", "content", "details"],
    diagnosis: ["diagnosis", "diagnosed", "existingDiagnosis", "existing_diagnosis"],
    visitDate: ["visitDate", "preferredDate", "date", "preferred_visit_date"],
    budget: ["budget"],
    interpretation: ["interpretation", "interpreter", "translationSupport", "interpreter_support"],
    accommodation: ["accommodation", "transport", "stayTransport", "support", "hotel_transport_support"],
    documentLink: ["documentLink", "fileLink", "link", "url", "photo_document_link"],
    privacy: ["privacy", "consent", "agree", "privacyConsent", "privacy_agreement"]
  };

  const STEPS = [
    { key: "inquiryType", type: "options", required: true, values: ["의료관광 상담", "K-뷰티 상담", "건강검진", "병원 연결", "기타 문의"] },
    { key: "interest", type: "options", required: true, values: ["피부·성형", "치과", "건강검진", "한방·웰니스", "재활·치료", "기타"] },
    { key: "language", type: "options", required: true, values: ["한국어", "English", "Tiếng Việt", "日本語", "中文"] },
    { key: "name", type: "text", required: true, autocomplete: "name" },
    { key: "country", type: "text", required: true, autocomplete: "country-name" },
    { key: "email", type: "email", required: true, autocomplete: "email" },
    { key: "emailConfirm", type: "email", required: true, autocomplete: "email" },
    { key: "phone", type: "tel", autocomplete: "tel" },
    { key: "messenger", type: "text", skip: true },
    { key: "location", type: "text", required: true },
    { key: "message", type: "textarea", required: true },
    { key: "diagnosis", type: "options", values: ["있음", "없음", "상담 후 확인하고 싶음"] },
    { key: "visitDate", type: "date", skip: true },
    { key: "budget", type: "text", skip: true },
    { key: "interpretation", type: "options", values: ["필요함", "필요 없음", "아직 모르겠음"] },
    { key: "accommodation", type: "options", values: ["숙박 지원 필요", "이동 지원 필요", "둘 다 필요", "필요 없음"] },
    { key: "documentLink", type: "url", skip: true, withConsent: true }
  ];

  const SUMMARY_KEYS = ["inquiryType", "interest", "language", "name", "country", "email", "phone", "messenger", "location", "message", "diagnosis", "visitDate", "budget", "interpretation", "accommodation", "documentLink"];

  const MH_I18N = {
    ko: {
      modeStart: "메디하나와 상담 시작하기",
      modeQuick: "빠른 신청서로 바로 작성하기",
      greeting: "안녕하세요. 저는 메디하나예요. 안전한 의료여행 상담을 위해 몇 가지만 여쭤볼게요.",
      previous: "이전",
      next: "다음",
      skip: "건너뛰기",
      summary: "요약 확인",
      edit: "수정하기",
      submit: "상담 신청 제출",
      progress: "{current} / {total} 단계",
      required: "필수 항목을 입력해 주세요.",
      contactRequired: "전화번호 또는 메신저 연락처 중 하나 이상을 입력해 주세요.",
      consentRequired: "개인정보 동의가 필요합니다.",
      summaryTitle: "상담 신청 내용 요약",
      quickNote: "빠른 신청서 모드입니다. 아래 기존 상담신청서를 그대로 작성해 주세요.",
      submitMissing: "필수 항목을 확인해 주세요. 수정하기를 눌러 누락된 답변을 입력할 수 있습니다.",
      mappingWarning: "일부 필드 연결을 확인해 주세요. 기존 빠른 신청서 모드에서도 내용을 확인할 수 있습니다.",
      mappingWarningList: "일부 필드 연결을 확인해 주세요:",
      empty: "미입력",
      modeSelector: "상담 신청 방식 선택",
      languageSelector: "Medi Hana 언어 선택",
      progressLabel: "진행률",
      stepPrefix: "Step",
      steps: {
        inquiryType: { title: "문의 유형", question: "어떤 상담을 원하시나요?", options: ["의료관광 상담", "K-뷰티 상담", "건강검진", "병원 연결", "기타 문의"] },
        interest: { title: "관심 분야", question: "관심 있는 분야를 선택해 주세요.", options: ["피부·성형", "치과", "건강검진", "한방·웰니스", "재활·치료", "기타"] },
        language: { title: "선호 언어", question: "상담을 받고 싶은 언어를 선택해 주세요.", options: ["한국어", "English", "Tiếng Việt", "日本語", "中文"] },
        name: { title: "이름", question: "상담 내용을 정확히 정리하기 위해 성함을 알려주세요.", placeholder: "성함을 입력해 주세요." },
        country: { title: "국가", question: "현재 거주 중인 국가는 어디인가요?", placeholder: "거주 국가" },
        email: { title: "이메일", question: "답변을 받을 이메일 주소를 입력해 주세요.", placeholder: "you@example.com" },
        emailConfirm: { title: "이메일 확인", question: "이메일 주소를 한 번 더 확인해 주세요.", error: "이메일 주소가 서로 다릅니다. 다시 확인해 주세요." },
        phone: { title: "전화번호", question: "연락 가능한 전화번호를 알려주세요.", placeholder: "전화번호 또는 연락 가능한 번호" },
        messenger: { title: "메신저 연락처", question: "Zalo, WhatsApp, KakaoTalk 등 메신저 연락처가 있다면 입력해 주세요.", placeholder: "Zalo / WhatsApp / KakaoTalk ID" },
        location: { title: "현재 위치", question: "현재 계신 도시를 알려주세요.", placeholder: "예: 서울, 부산, 하노이, 호치민" },
        message: { title: "문의 내용", question: "가장 궁금한 내용을 편하게 적어주세요.", placeholder: "증상, 목표, 일정, 궁금한 점을 작성해 주세요." },
        diagnosis: { title: "기존 진단 여부", question: "이미 병원 진단이나 검사 결과가 있으신가요?", options: ["있음", "없음", "상담 후 확인하고 싶음"] },
        visitDate: { title: "희망 방문일", question: "희망 방문일이 있으신가요?" },
        budget: { title: "예산", question: "예상 예산 범위가 있으신가요?", placeholder: "예상 예산 범위" },
        interpretation: { title: "통역 지원", question: "통역 지원이 필요하신가요?", options: ["필요함", "필요 없음", "아직 모르겠음"] },
        accommodation: { title: "숙박 또는 이동 지원", question: "숙박이나 공항 이동 지원이 필요하신가요?", options: ["숙박 지원 필요", "이동 지원 필요", "둘 다 필요", "필요 없음"] },
        documentLink: { title: "문서 링크 및 동의", question: "사진, 검사결과, 참고 문서 링크가 있다면 입력해 주세요. 마지막으로 개인정보 동의 후 제출해 주세요.", placeholder: "https://", consent: "상담 조회, 환자 동의 절차, 개인정보 보호 정책에 동의합니다." }
      }
    },
    en: {
      modeStart: "Start consultation with Medi Hana",
      modeQuick: "Use quick application form",
      greeting: "Hello, I’m Medi Hana. I’ll help you prepare a safe medical travel consultation.",
      previous: "Previous",
      next: "Next",
      skip: "Skip",
      summary: "Review summary",
      edit: "Edit",
      submit: "Submit consultation request",
      progress: "Step {current} of {total}",
      required: "Please complete the required field.",
      contactRequired: "Please enter at least a phone number or messenger contact.",
      consentRequired: "Please agree to the privacy notice.",
      summaryTitle: "Consultation summary",
      quickNote: "Quick application form mode is active. Please complete the original consultation form below.",
      submitMissing: "Please check the required items. Select Edit to complete missing answers.",
      mappingWarning: "Please check some field connections. You can also review details in the original quick form mode.",
      mappingWarningList: "Please check some field connections:",
      empty: "Not entered",
      modeSelector: "Consultation application mode selector",
      languageSelector: "Medi Hana language selector",
      progressLabel: "Progress",
      stepPrefix: "Step",
      steps: {
        inquiryType: { title: "Consultation type", question: "What kind of consultation would you like?", options: ["Medical travel consultation", "K-Beauty consultation", "Health checkup", "Hospital connection", "Other inquiry"] },
        interest: { title: "Area of interest", question: "Please choose your area of interest.", options: ["Skin & plastic surgery", "Dental care", "Health checkup", "Korean medicine & wellness", "Rehabilitation & treatment", "Other"] },
        language: { title: "Preferred language", question: "Please choose your preferred consultation language.", options: ["Korean", "English", "Vietnamese", "Japanese", "Chinese"] },
        name: { title: "Name", question: "Please tell us your name so we can organize your consultation accurately.", placeholder: "Enter your full name." },
        country: { title: "Country", question: "Which country do you currently live in?", placeholder: "Country of residence" },
        email: { title: "Email", question: "Please enter the email address where you would like to receive our reply.", placeholder: "you@example.com" },
        emailConfirm: { title: "Confirm email", question: "Please enter your email address again.", error: "The email addresses do not match. Please check again." },
        phone: { title: "Phone number", question: "Please enter a phone number where we can contact you.", placeholder: "Phone number" },
        messenger: { title: "Messenger contact", question: "If you use Zalo, WhatsApp, or KakaoTalk, please enter your messenger contact.", placeholder: "Zalo / WhatsApp / KakaoTalk ID" },
        location: { title: "Current location", question: "Please tell us the city where you are currently located.", placeholder: "e.g., Seoul, Busan, Hanoi, Ho Chi Minh City" },
        message: { title: "Message", question: "Please write what you would like to ask.", placeholder: "Tell us about your symptoms, goals, schedule, or questions." },
        diagnosis: { title: "Existing diagnosis", question: "Do you already have a diagnosis or test result from a hospital?", options: ["Yes", "No", "I would like to check after consultation"] },
        visitDate: { title: "Preferred visit date", question: "Do you have a preferred visit date?" },
        budget: { title: "Budget", question: "Do you have an expected budget range?", placeholder: "Expected budget range" },
        interpretation: { title: "Interpretation support", question: "Do you need interpretation support?", options: ["Needed", "Not needed", "Not sure yet"] },
        accommodation: { title: "Accommodation or transport support", question: "Do you need accommodation or airport transport support?", options: ["Accommodation support", "Transport support", "Both", "Not needed"] },
        documentLink: { title: "Document link and consent", question: "If you have photos, test results, or reference document links, please enter them. Then please agree to the privacy notice before submission.", placeholder: "https://", consent: "I agree to the consultation review process, patient consent procedure, and privacy policy." }
      }
    },
    vi: {
      modeStart: "Bắt đầu tư vấn với Medi Hana",
      modeQuick: "Điền biểu mẫu nhanh",
      greeting: "Xin chào, tôi là Medi Hana. Tôi sẽ giúp bạn chuẩn bị tư vấn y tế an toàn.",
      previous: "Quay lại",
      next: "Tiếp theo",
      skip: "Bỏ qua",
      summary: "Xem lại thông tin",
      edit: "Chỉnh sửa",
      submit: "Gửi yêu cầu tư vấn",
      progress: "Bước {current} / {total}",
      required: "Vui lòng nhập thông tin bắt buộc.",
      contactRequired: "Vui lòng nhập ít nhất số điện thoại hoặc thông tin liên hệ qua ứng dụng nhắn tin.",
      consentRequired: "Vui lòng đồng ý với chính sách bảo mật.",
      summaryTitle: "Tóm tắt yêu cầu tư vấn",
      quickNote: "Đang ở chế độ biểu mẫu nhanh. Vui lòng điền biểu mẫu tư vấn gốc bên dưới.",
      submitMissing: "Vui lòng kiểm tra các mục bắt buộc. Chọn Chỉnh sửa để nhập thông tin còn thiếu.",
      mappingWarning: "Vui lòng kiểm tra một số liên kết trường. Bạn cũng có thể xem lại trong chế độ biểu mẫu nhanh gốc.",
      mappingWarningList: "Vui lòng kiểm tra một số liên kết trường:",
      empty: "Chưa nhập",
      modeSelector: "Chọn cách đăng ký tư vấn",
      languageSelector: "Chọn ngôn ngữ Medi Hana",
      progressLabel: "Tiến độ",
      stepPrefix: "Bước",
      steps: {
        inquiryType: { title: "Loại tư vấn", question: "Bạn muốn tư vấn về nội dung nào?", options: ["Tư vấn du lịch y tế", "Tư vấn K-Beauty", "Khám sức khỏe tổng quát", "Kết nối bệnh viện", "Câu hỏi khác"] },
        interest: { title: "Lĩnh vực quan tâm", question: "Vui lòng chọn lĩnh vực bạn quan tâm.", options: ["Da liễu & thẩm mỹ", "Nha khoa", "Khám sức khỏe", "Y học Hàn Quốc & wellness", "Phục hồi chức năng & điều trị", "Khác"] },
        language: { title: "Ngôn ngữ ưu tiên", question: "Vui lòng chọn ngôn ngữ tư vấn bạn muốn sử dụng.", options: ["Tiếng Hàn", "English", "Tiếng Việt", "Tiếng Nhật", "Tiếng Trung"] },
        name: { title: "Họ và tên", question: "Vui lòng cho biết họ tên để chúng tôi chuẩn bị nội dung tư vấn chính xác.", placeholder: "Nhập họ và tên của bạn." },
        country: { title: "Quốc gia", question: "Hiện tại bạn đang cư trú tại quốc gia nào?", placeholder: "Quốc gia cư trú" },
        email: { title: "Email", question: "Vui lòng nhập địa chỉ email để nhận phản hồi.", placeholder: "you@example.com" },
        emailConfirm: { title: "Xác nhận email", question: "Vui lòng nhập lại địa chỉ email.", error: "Hai địa chỉ email không khớp. Vui lòng kiểm tra lại." },
        phone: { title: "Số điện thoại", question: "Vui lòng nhập số điện thoại có thể liên hệ.", placeholder: "Số điện thoại" },
        messenger: { title: "Liên hệ qua ứng dụng nhắn tin", question: "Nếu có Zalo, WhatsApp hoặc KakaoTalk, vui lòng nhập thông tin liên hệ.", placeholder: "Zalo / WhatsApp / KakaoTalk ID" },
        location: { title: "Vị trí hiện tại", question: "Vui lòng cho biết thành phố hiện tại của bạn.", placeholder: "Ví dụ: Seoul, Busan, Hà Nội, TP. Hồ Chí Minh" },
        message: { title: "Nội dung tư vấn", question: "Vui lòng viết nội dung bạn muốn hỏi.", placeholder: "Hãy viết về triệu chứng, mục tiêu, lịch trình hoặc câu hỏi của bạn." },
        diagnosis: { title: "Chẩn đoán hiện có", question: "Bạn đã có chẩn đoán hoặc kết quả xét nghiệm từ bệnh viện chưa?", options: ["Có", "Không", "Tôi muốn kiểm tra sau khi tư vấn"] },
        visitDate: { title: "Ngày dự kiến đến khám", question: "Bạn có ngày dự kiến đến khám không?" },
        budget: { title: "Ngân sách", question: "Bạn có khoảng ngân sách dự kiến không?", placeholder: "Khoảng ngân sách dự kiến" },
        interpretation: { title: "Hỗ trợ phiên dịch", question: "Bạn có cần hỗ trợ phiên dịch không?", options: ["Cần", "Không cần", "Chưa chắc"] },
        accommodation: { title: "Hỗ trợ lưu trú hoặc di chuyển", question: "Bạn có cần hỗ trợ lưu trú hoặc đưa đón sân bay không?", options: ["Cần hỗ trợ lưu trú", "Cần hỗ trợ di chuyển", "Cần cả hai", "Không cần"] },
        documentLink: { title: "Liên kết tài liệu và đồng ý", question: "Nếu bạn có ảnh, kết quả xét nghiệm hoặc liên kết tài liệu tham khảo, vui lòng nhập vào. Sau đó vui lòng đồng ý với chính sách bảo mật trước khi gửi.", placeholder: "https://", consent: "Tôi đồng ý với quy trình xem xét tư vấn, thủ tục đồng ý của bệnh nhân và chính sách bảo mật." }
      }
    },
    jp: {
      modeStart: "メディハナと相談を始める",
      modeQuick: "かんたん申請フォームで入力する",
      greeting: "こんにちは。メディハナです。安心できる医療旅行相談のために、いくつか確認させてください。",
      previous: "前へ",
      next: "次へ",
      skip: "スキップ",
      summary: "内容を確認",
      edit: "修正する",
      submit: "相談を申請する",
      progress: "{total}ステップ中 {current}ステップ目",
      required: "必須項目を入力してください。",
      contactRequired: "電話番号またはメッセンジャー連絡先のいずれかを入力してください。",
      consentRequired: "個人情報保護方針への同意が必要です。",
      summaryTitle: "相談申請内容の概要",
      quickNote: "かんたん申請フォームモードです。下の既存相談フォームに入力してください。",
      submitMissing: "必須項目を確認してください。修正するを選択して不足している回答を入力できます。",
      mappingWarning: "一部の項目連携を確認してください。既存のかんたん申請フォームでも内容を確認できます。",
      mappingWarningList: "一部の項目連携を確認してください:",
      empty: "未入力",
      modeSelector: "相談申請方式の選択",
      languageSelector: "Medi Hana 言語選択",
      progressLabel: "進行状況",
      stepPrefix: "Step",
      steps: {
        inquiryType: { title: "相談タイプ", question: "どのような相談をご希望ですか？", options: ["医療観光相談", "Kビューティー相談", "健康診断", "病院紹介", "その他のお問い合わせ"] },
        interest: { title: "関心分野", question: "関心のある分野を選択してください。", options: ["皮膚・美容整形", "歯科", "健康診断", "韓方・ウェルネス", "リハビリ・治療", "その他"] },
        language: { title: "希望言語", question: "相談を受けたい言語を選択してください。", options: ["韓国語", "英語", "ベトナム語", "日本語", "中国語"] },
        name: { title: "お名前", question: "相談内容を正確に整理するため、お名前を入力してください。", placeholder: "お名前を入力してください。" },
        country: { title: "国", question: "現在お住まいの国を入力してください。", placeholder: "居住国" },
        email: { title: "メールアドレス", question: "回答を受け取るメールアドレスを入力してください。", placeholder: "you@example.com" },
        emailConfirm: { title: "メール確認", question: "メールアドレスをもう一度入力してください。", error: "メールアドレスが一致しません。もう一度確認してください。" },
        phone: { title: "電話番号", question: "連絡可能な電話番号を入力してください。", placeholder: "電話番号" },
        messenger: { title: "メッセンジャー連絡先", question: "Zalo、WhatsApp、KakaoTalkなどの連絡先があれば入力してください。", placeholder: "Zalo / WhatsApp / KakaoTalk ID" },
        location: { title: "現在地", question: "現在いらっしゃる都市を入力してください。", placeholder: "例：ソウル、釜山、ハノイ、ホーチミン" },
        message: { title: "相談内容", question: "気になる内容を自由にご記入ください。", placeholder: "症状、目的、日程、質問などをご記入ください。" },
        diagnosis: { title: "既存の診断有無", question: "すでに病院の診断や検査結果がありますか？", options: ["あります", "ありません", "相談後に確認したいです"] },
        visitDate: { title: "希望訪問日", question: "ご希望の訪問日はありますか？" },
        budget: { title: "予算", question: "ご希望の予算範囲はありますか？", placeholder: "予算範囲" },
        interpretation: { title: "通訳サポート", question: "通訳サポートが必要ですか？", options: ["必要です", "不要です", "まだわかりません"] },
        accommodation: { title: "宿泊または移動サポート", question: "宿泊や空港送迎のサポートが必要ですか？", options: ["宿泊サポートが必要", "移動サポートが必要", "両方必要", "不要です"] },
        documentLink: { title: "資料リンクと同意", question: "写真、検査結果、参考資料のリンクがあれば入力してください。最後に個人情報保護方針に同意して送信してください。", placeholder: "https://", consent: "相談確認、患者同意手続き、個人情報保護方針に同意します。" }
      }
    },
    cn: {
      modeStart: "与 Medi Hana 开始咨询",
      modeQuick: "直接填写快速申请表",
      greeting: "您好，我是 Medi Hana。我会帮助您准备安心的医疗旅行咨询。",
      previous: "上一步",
      next: "下一步",
      skip: "跳过",
      summary: "确认摘要",
      edit: "修改",
      submit: "提交咨询申请",
      progress: "第 {current} / {total} 步",
      required: "请填写必填项目。",
      contactRequired: "请至少填写电话号码或即时通讯联系方式。",
      consentRequired: "请同意隐私保护政策。",
      summaryTitle: "咨询申请摘要",
      quickNote: "当前为快速申请表模式。请填写下方原有咨询表格。",
      submitMissing: "请确认必填项目。选择修改可填写遗漏的回答。",
      mappingWarning: "请确认部分字段连接。您也可以在原有快速申请表模式中查看内容。",
      mappingWarningList: "请确认部分字段连接:",
      empty: "未填写",
      modeSelector: "咨询申请方式选择",
      languageSelector: "Medi Hana 语言选择",
      progressLabel: "进度",
      stepPrefix: "Step",
      steps: {
        inquiryType: { title: "咨询类型", question: "您希望咨询哪一类内容？", options: ["医疗旅游咨询", "K-Beauty 咨询", "健康检查", "医院连接", "其他咨询"] },
        interest: { title: "关注领域", question: "请选择您感兴趣的领域。", options: ["皮肤·整形", "牙科", "健康检查", "韩方·康养", "康复·治疗", "其他"] },
        language: { title: "首选语言", question: "请选择您希望使用的咨询语言。", options: ["韩语", "英语", "越南语", "日语", "中文"] },
        name: { title: "姓名", question: "为了准确整理您的咨询内容，请填写姓名。", placeholder: "请输入您的姓名。" },
        country: { title: "国家", question: "您目前居住在哪个国家？", placeholder: "居住国家" },
        email: { title: "邮箱", question: "请输入用于接收回复的邮箱地址。", placeholder: "you@example.com" },
        emailConfirm: { title: "确认邮箱", question: "请再次输入您的邮箱地址。", error: "两次输入的邮箱地址不一致，请重新确认。" },
        phone: { title: "电话号码", question: "请输入可联系的电话号码。", placeholder: "电话号码" },
        messenger: { title: "即时通讯联系方式", question: "如果您使用 Zalo、WhatsApp 或 KakaoTalk，请填写联系方式。", placeholder: "Zalo / WhatsApp / KakaoTalk ID" },
        location: { title: "当前位置", question: "请填写您目前所在的城市。", placeholder: "例如：首尔、釜山、河内、胡志明市" },
        message: { title: "咨询内容", question: "请填写您最想了解的内容。", placeholder: "请填写症状、目标、日程或疑问。" },
        diagnosis: { title: "既往诊断", question: "您是否已有医院诊断或检查结果？", options: ["有", "没有", "希望咨询后再确认"] },
        visitDate: { title: "希望访问日期", question: "您有希望访问的日期吗？" },
        budget: { title: "预算", question: "您是否有预计预算范围？", placeholder: "预计预算范围" },
        interpretation: { title: "翻译支持", question: "您需要翻译支持吗？", options: ["需要", "不需要", "暂时不确定"] },
        accommodation: { title: "住宿或交通支持", question: "您需要住宿或机场接送支持吗？", options: ["需要住宿支持", "需要交通支持", "两者都需要", "不需要"] },
        documentLink: { title: "文件链接及同意", question: "如果您有照片、检查结果或参考文件链接，请填写。最后请同意隐私政策后提交。", placeholder: "https://", consent: "我同意咨询确认、患者同意流程及隐私保护政策。" }
      }
    }
  };

  let mediHanaState = null;
  let isSyncingPageLanguage = false;
  let introTimerId = null;

  document.addEventListener("DOMContentLoaded", () => {
    try {
      initMediHanaConsult();
    } catch (error) {
      console.warn("Medi Hana consultation UI failed to initialize. Showing the original quick form.", error);
      const form = document.querySelector('form[name="medical-consult"]');
      if (form) form.classList.remove("mh-consult-hidden");
    }
  });

  window.setMediHanaLanguage = function setMediHanaLanguage(lang, options = {}) {
    const normalized = normalizeMediHanaLanguage(lang) || "ko";
    if (!mediHanaState) return normalized;

    mediHanaState.language = normalized;
    mediHanaState.imageFallbackUsed = false;
    mediHanaState.defaultImageFailed = false;
    mediHanaState.showIntro = false;
    clearIntroTimer();

    if (options.syncPage !== false) syncPageLanguage(normalized);
    render(mediHanaState.root, mediHanaState.form, mediHanaState);
    return normalized;
  };

  function initMediHanaConsult() {
    const root = document.querySelector("[data-mh-consult]");
    const form = document.querySelector('form[name="medical-consult"]');
    if (!root || !form) {
      console.warn("Medi Hana consultation UI skipped: target container or medical-consult form was not found.");
      return;
    }

    const state = {
      root,
      form,
      mode: "hana",
      language: getInitialMediHanaLanguage(),
      currentStep: 0,
      summary: false,
      showIntro: true,
      answers: readInitialAnswers(form),
      missingFields: [],
      imageFallbackUsed: false,
      defaultImageFailed: false
    };

    state.fields = mapFields(form, state);
    mediHanaState = state;
    root.innerHTML = buildShell(state);
    root.hidden = false;
    root.addEventListener("click", (event) => handleRootClick(event, root, form, state));
    root.addEventListener("input", (event) => handleRootInput(event, form, state));
    root.addEventListener("change", (event) => handleRootChange(event, form, state));
    setupPageLanguageSync(state);
    form.classList.add("mh-consult-hidden");
    render(root, form, state);
  }

  function buildShell(state) {
    return `
      <div class="mh-consult-mode-toggle" role="group" aria-label="${escapeAttr(t("modeSelector", state))}">
        <button type="button" class="mh-consult-mode-btn" data-mode="hana"></button>
        <button type="button" class="mh-consult-mode-btn" data-mode="quick"></button>
      </div>
      <div class="mh-consult-panel" aria-live="polite"></div>
    `;
  }

  function render(root, form, state) {
    const panel = root.querySelector(".mh-consult-panel");
    const modeToggle = root.querySelector(".mh-consult-mode-toggle");
    if (modeToggle) modeToggle.setAttribute("aria-label", t("modeSelector", state));

    root.querySelectorAll("[data-mode]").forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.textContent = button.dataset.mode === "hana" ? t("modeStart", state) : t("modeQuick", state);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (state.mode === "quick") {
      form.classList.remove("mh-consult-hidden");
      panel.innerHTML = `<p class="mh-consult-quick-note">${escapeHtml(t("quickNote", state))}</p>`;
      return;
    }

    form.classList.add("mh-consult-hidden");
    panel.innerHTML = state.summary ? renderSummary(state) : renderStage(state);
    attachImageFallback(panel, state);
    scheduleIntroQuestionSwap(state);
  }

  function renderStage(state) {
    const step = STEPS[state.currentStep];
    const copy = getStepCopy(step.key, state);
    const bubbleText = getBubbleText(copy, state);
    return `
      <div class="mh-consult-language" role="group" aria-label="${escapeAttr(t("languageSelector", state))}">
        ${SUPPORTED_LANGS.map((lang) => `
          <button type="button" class="mh-consult-lang-btn ${state.language === lang ? "is-active" : ""}" data-lang="${lang}" aria-pressed="${state.language === lang}">${lang.toUpperCase()}</button>
        `).join("")}
      </div>
      <div class="mh-consult-stage">
        <div class="mh-consult-character">
          <div class="mh-consult-bubble ${state.showIntro ? "is-intro" : ""}">${escapeHtml(bubbleText)}</div>
          <div class="mh-consult-character-img-wrap">
            <img class="mh-consult-character-img" src="${MH_IMAGES[state.language]}" alt="Medi Hana" />
          </div>
        </div>
        <div class="mh-consult-card">
          <p class="mh-consult-step-label">${escapeHtml(t("stepPrefix", state))} ${state.currentStep + 1}. ${escapeHtml(copy.title)}</p>
          <p class="mh-consult-question">${escapeHtml(copy.question)}</p>
          ${renderControl(step, state)}
          <p class="mh-consult-error" role="alert" data-error></p>
          ${renderMappingNotice(state)}
          <div class="mh-consult-progress" aria-label="${escapeAttr(t("progressLabel", state))}">${escapeHtml(formatProgress(state.currentStep + 1, STEPS.length, state))}</div>
          <div class="mh-consult-actions">
            <button type="button" class="btn mh-consult-action" data-prev ${state.currentStep === 0 ? "disabled" : ""}>${escapeHtml(t("previous", state))}</button>
            ${step.skip ? `<button type="button" class="btn mh-consult-action" data-skip>${escapeHtml(t("skip", state))}</button>` : ""}
            <button type="button" class="btn primary mh-consult-action" data-next>${escapeHtml(state.currentStep === STEPS.length - 1 ? t("summary", state) : t("next", state))}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderControl(step, state) {
    const value = state.answers[step.key] || "";
    const copy = getStepCopy(step.key, state);
    if (step.type === "options") {
      return `<div class="mh-consult-options">${step.values.map((optionValue, index) => {
        const label = copy.options?.[index] || optionValue;
        return `
          <button type="button" class="mh-consult-option ${value === optionValue ? "is-selected" : ""}" data-option="${escapeAttr(optionValue)}" aria-pressed="${value === optionValue}">${escapeHtml(label)}</button>
        `;
      }).join("")}</div>`;
    }

    const placeholder = copy.placeholder || "";
    const common = `class="mh-consult-input" data-answer="${step.key}" ${step.autocomplete ? `autocomplete="${step.autocomplete}"` : ""} value="${escapeAttr(value)}" placeholder="${escapeAttr(placeholder)}"`;
    const consent = step.withConsent ? `
      <label class="mh-consult-consent">
        <input type="checkbox" data-answer="privacy" ${state.answers.privacy ? "checked" : ""} />
        <span>${escapeHtml(copy.consent)}</span>
      </label>
    ` : "";

    if (step.type === "textarea") {
      return `<textarea class="mh-consult-input" data-answer="${step.key}" rows="5" placeholder="${escapeAttr(placeholder)}">${escapeHtml(value)}</textarea>${consent}`;
    }
    return `<input type="${step.type}" ${common} />${consent}`;
  }

  function renderSummary(state) {
    return `
      <div class="mh-consult-summary">
        <h3>${escapeHtml(t("summaryTitle", state))}</h3>
        ${renderMappingNotice(state)}
        <div class="mh-consult-summary-grid">
          ${SUMMARY_KEYS.map((key) => `
            <article class="mh-consult-summary-card">
              <strong>${escapeHtml(getStepCopy(key, state).title || key)}</strong>
              <span>${escapeHtml(formatAnswerForDisplay(key, state))}</span>
            </article>
          `).join("")}
        </div>
        <p class="mh-consult-error" role="alert" data-error></p>
        <div class="mh-consult-actions">
          <button type="button" class="btn mh-consult-action" data-edit>${escapeHtml(t("edit", state))}</button>
          <button type="button" class="btn primary mh-consult-action" data-submit-hana>${escapeHtml(t("submit", state))}</button>
        </div>
      </div>
    `;
  }

  function getBubbleText(copy, state) {
    if (state.showIntro && state.currentStep === 0 && !state.summary) return t("greeting", state);
    return copy.question || t("greeting", state);
  }

  function scheduleIntroQuestionSwap(state) {
    clearIntroTimer();
    if (!state.showIntro || state.summary || state.currentStep !== 0 || state.mode !== "hana") return;
    introTimerId = window.setTimeout(() => {
      if (!mediHanaState || mediHanaState !== state) return;
      state.showIntro = false;
      render(state.root, state.form, state);
    }, 1400);
  }

  function clearIntroTimer() {
    if (!introTimerId) return;
    window.clearTimeout(introTimerId);
    introTimerId = null;
  }

  function handleRootClick(event, root, form, state) {
    const target = event.target.closest("button");
    if (!target) return;

    if (target.dataset.mode) {
      state.mode = target.dataset.mode;
      state.showIntro = false;
      clearIntroTimer();
      render(root, form, state);
      return;
    }

    if (target.dataset.lang) {
      window.setMediHanaLanguage(target.dataset.lang);
      return;
    }

    if (target.dataset.option) {
      state.showIntro = false;
      clearIntroTimer();
      const step = STEPS[state.currentStep];
      state.answers[step.key] = target.dataset.option;
      if (step.key === "language") {
        window.setMediHanaLanguage(MH_LANG_BY_LANGUAGE_VALUE[target.dataset.option] || state.language);
      }
      syncAnswerToField(form, state, step.key);
      render(root, form, state);
      return;
    }

    if (target.hasAttribute("data-prev")) {
      state.showIntro = false;
      clearIntroTimer();
      state.currentStep = Math.max(0, state.currentStep - 1);
      state.summary = false;
      render(root, form, state);
      return;
    }

    if (target.hasAttribute("data-skip")) {
      state.showIntro = false;
      clearIntroTimer();
      const step = STEPS[state.currentStep];
      if ((step.key === "messenger" || step.withConsent) && !validateStep(root, state)) return;
      if (!state.answers[step.key]) state.answers[step.key] = "";
      syncAnswerToField(form, state, step.key);
      goNext(root, form, state);
      return;
    }

    if (target.hasAttribute("data-next")) {
      state.showIntro = false;
      clearIntroTimer();
      if (validateStep(root, state)) goNext(root, form, state);
      return;
    }

    if (target.hasAttribute("data-edit")) {
      state.showIntro = false;
      clearIntroTimer();
      state.summary = false;
      state.currentStep = 0;
      render(root, form, state);
      return;
    }

    if (target.hasAttribute("data-submit-hana")) {
      submitViaExistingFlow(root, form, state);
    }
  }

  function handleRootInput(event, form, state) {
    const target = event.target;
    if (!target.matches("[data-answer]")) return;
    const key = target.dataset.answer;
    state.answers[key] = target.type === "checkbox" ? target.checked : target.value;
    syncAnswerToField(form, state, key);
  }

  function handleRootChange(event, form, state) {
    handleRootInput(event, form, state);
  }

  function goNext(root, form, state) {
    const step = STEPS[state.currentStep];
    syncAnswerToField(form, state, step.key);
    if (step.withConsent) syncAnswerToField(form, state, "privacy");
    if (state.currentStep >= STEPS.length - 1) {
      state.summary = true;
    } else {
      state.currentStep += 1;
    }
    render(root, form, state);
  }

  function validateStep(root, state) {
    const step = STEPS[state.currentStep];
    const error = root.querySelector("[data-error]");
    const value = (state.answers[step.key] || "").toString().trim();
    const setError = (message) => {
      if (error) error.textContent = message;
      return false;
    };

    if (step.required && !value) return setError(t("required", state));
    if (step.key === "emailConfirm" && (state.answers.email || "").trim().toLowerCase() !== value.toLowerCase()) {
      return setError(getStepCopy("emailConfirm", state).error);
    }
    if (step.key === "messenger" && !hasPhoneOrMessenger(state)) {
      return setError(t("contactRequired", state));
    }
    if (step.withConsent && !state.answers.privacy) {
      return setError(t("consentRequired", state));
    }
    return true;
  }

  function hasPhoneOrMessenger(state) {
    return Boolean((state.answers.phone || "").trim() || (state.answers.messenger || "").trim());
  }

  function submitViaExistingFlow(root, form, state) {
    syncAllAnswers(form, state);
    const error = root.querySelector("[data-error]");
    if (!validateAllBeforeSubmit(state)) {
      if (error) error.textContent = t("submitMissing", state);
      return;
    }
    if (state.missingFields.length && error) {
      error.textContent = t("mappingWarning", state);
    }
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      submitButton.click();
    } else if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
    } else {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }

  function validateAllBeforeSubmit(state) {
    const requiredKeys = ["inquiryType", "interest", "language", "name", "country", "email", "emailConfirm", "location", "message"];
    if (!requiredKeys.every((key) => (state.answers[key] || "").toString().trim())) return false;
    if (!hasPhoneOrMessenger(state)) return false;
    if ((state.answers.email || "").trim().toLowerCase() !== (state.answers.emailConfirm || "").trim().toLowerCase()) return false;
    return Boolean(state.answers.privacy);
  }

  function mapFields(form, state) {
    const fields = {};
    Object.entries(FIELD_CANDIDATES).forEach(([key, candidates]) => {
      fields[key] = findField(form, candidates);
      if (!fields[key]) {
        state.missingFields.push(key);
        console.warn(`Medi Hana consultation field mapping not found for ${key}. Checked: ${candidates.join(", ")}`);
      }
    });
    return fields;
  }

  function findField(form, candidates) {
    for (const candidate of candidates) {
      const escaped = cssEscape(candidate);
      const field = form.querySelector(`[name="${escaped}"], #${escaped}`);
      if (field) return field;
    }
    return null;
  }

  function readInitialAnswers(form) {
    const answers = {};
    Object.entries(FIELD_CANDIDATES).forEach(([key, candidates]) => {
      const field = findField(form, candidates);
      if (!field) return;
      answers[key] = field.type === "checkbox" ? field.checked : field.value;
    });
    return answers;
  }

  function syncAllAnswers(form, state) {
    Object.keys(FIELD_CANDIDATES).forEach((key) => syncAnswerToField(form, state, key));
  }

  function syncAnswerToField(form, state, key) {
    const field = state.fields && state.fields[key] ? state.fields[key] : findField(form, FIELD_CANDIDATES[key] || []);
    if (!field) return;
    const value = state.answers[key] || "";

    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else if (field.tagName === "SELECT") {
      setSelectValue(field, value);
    } else {
      field.value = value;
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setSelectValue(select, value) {
    const options = Array.from(select.options);
    const match = options.find((option) => option.value === value || option.textContent.trim() === value);
    if (match) {
      select.value = match.value;
      return;
    }
    if (value) {
      const option = new Option(value, value, true, true);
      select.add(option);
      select.value = value;
    }
  }

  function getStepCopy(key, state) {
    return MH_I18N[state.language]?.steps?.[key] || MH_I18N.ko.steps[key] || {};
  }

  function formatAnswerForDisplay(key, state) {
    const value = state.answers[key];
    if (!value) return t("empty", state);
    const step = STEPS.find((item) => item.key === key);
    if (step?.values) {
      const index = step.values.indexOf(value);
      const label = getStepCopy(key, state).options?.[index];
      return label || value;
    }
    return value;
  }

  function renderMappingNotice(state) {
    if (!state.missingFields.length) return "";
    return `<p class="mh-consult-warning">${escapeHtml(t("mappingWarningList", state))} ${escapeHtml(state.missingFields.join(", "))}</p>`;
  }

  function attachImageFallback(panel, state) {
    const image = panel.querySelector(".mh-consult-character-img");
    if (!image) return;
    image.addEventListener("error", () => {
      if (!state.imageFallbackUsed) {
        state.imageFallbackUsed = true;
        image.src = MH_IMAGES.default;
        return;
      }
      state.defaultImageFailed = true;
      image.hidden = true;
      image.alt = "";
    });
  }

  function setupPageLanguageSync(state) {
    const observer = new MutationObserver(() => {
      if (isSyncingPageLanguage) return;
      const normalized = normalizeMediHanaLanguage(document.documentElement.lang);
      if (normalized && normalized !== state.language) window.setMediHanaLanguage(normalized, { syncPage: false });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    document.addEventListener("click", (event) => {
      const button = event.target.closest("#languageButtons button[data-lang]");
      if (!button) return;
      const normalized = normalizeMediHanaLanguage(button.dataset.lang);
      if (normalized) window.setMediHanaLanguage(normalized, { syncPage: false });
    });

    window.addEventListener("storage", (event) => {
      if (event.key !== "vrMediTourLang") return;
      const normalized = normalizeMediHanaLanguage(event.newValue);
      if (normalized) window.setMediHanaLanguage(normalized, { syncPage: false });
    });
  }

  function syncPageLanguage(lang) {
    const pageLang = PAGE_LANG_BY_MH_LANG[lang] || "ko";
    try {
      isSyncingPageLanguage = true;
      if (typeof window.applyLanguage === "function") {
        window.applyLanguage(pageLang);
      } else {
        document.documentElement.lang = pageLang;
        localStorage.setItem("vrMediTourLang", pageLang);
        document.querySelectorAll("#languageButtons button[data-lang]").forEach((button) => {
          button.classList.toggle("active", button.dataset.lang === pageLang);
        });
      }
    } finally {
      isSyncingPageLanguage = false;
    }
  }

  function getInitialMediHanaLanguage() {
    const activeButton = document.querySelector("#languageButtons button.active[data-lang], #languageButtons button.is-active[data-lang], #languageButtons button[aria-pressed='true'][data-lang]");
    return normalizeMediHanaLanguage(document.documentElement.lang) ||
      normalizeMediHanaLanguage(localStorage.getItem("vrMediTourLang")) ||
      normalizeMediHanaLanguage(activeButton?.dataset.lang) ||
      "ko";
  }

  function normalizeMediHanaLanguage(lang) {
    const value = (lang || "").toString().trim().toLowerCase().replace("_", "-");
    if (!value) return null;
    if (value.startsWith("ko")) return "ko";
    if (value.startsWith("en")) return "en";
    if (value.startsWith("vi")) return "vi";
    if (value.startsWith("ja") || value.startsWith("jp")) return "jp";
    if (value.startsWith("zh") || value.startsWith("cn")) return "cn";
    return SUPPORTED_LANGS.includes(value) ? value : null;
  }

  function formatProgress(current, total, state) {
    return t("progress", state).replace("{current}", current).replace("{total}", total);
  }

  function t(key, state = mediHanaState) {
    const lang = state?.language || "ko";
    return MH_I18N[lang]?.[key] || MH_I18N.ko[key] || key;
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }
})();

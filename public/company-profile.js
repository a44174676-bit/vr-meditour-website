(() => {
  const languageConfig = {
    ko: { htmlLang: "ko", dir: "ltr" },
    en: { htmlLang: "en", dir: "ltr" },
    vi: { htmlLang: "vi", dir: "ltr" },
    ja: { htmlLang: "ja", dir: "ltr" },
    zh: { htmlLang: "zh-CN", dir: "ltr" }
  };

  const supportedLanguages = ["ko", "en", "vi", "ja", "zh"];

  const translations = {
    ko: {
      skipLink: "본문으로 건너뛰기",
      navHome: "홈",
      navAiSkin: "AI Skin Analysis",
      navCompany: "회사소개",
      eyebrowCompany: "회사소개",
      heroTitle: "VR MEDI TOUR & HOME Co., Ltd.",
      heroSubtitle: "AI-powered K-Beauty & Medical Travel Concierge",
      heroImageFallback: "AI Skin Analysis & K-Beauty Medical Travel Concierge",
      heroBody: "주식회사 브이알메디투어앤홈은 AI 기반 K-뷰티 관심도 체크, 의료관광 사전상담, 병원 연계, 통역·이동·체류 지원을 결합하여 외국인 고객의 한국 의료·웰니스 여행을 안전하게 연결하는 의료관광 컨시어지 기업입니다.",
      ctaConsult: "상담 신청하기",
      ctaAiSkinView: "AI Skin Analysis 보기",
      keywordRegistered: "등록 기반 컨시어지",
      keywordKBeauty: "K-Beauty",
      keywordMedicalTravel: "의료관광",
      keywordWellness: "웰니스 체류 지원",
      eyebrowAbout: "About Us",
      aboutTitle: "우리는 어떤 회사인가",
      aboutBody1: "VR MEDI TOUR & HOME은 한국의 의료관광, K-뷰티, 웰니스 관광 서비스를 외국인 고객에게 안전하게 연결하는 외국인환자 유치업 기반 컨시어지 기업입니다.",
      aboutBody2: "우리는 의료기관이 아닙니다. 대신 외국인 고객이 한국 의료기관과 K-뷰티 서비스를 이해하고, 자신의 목적에 맞는 상담과 일정을 준비할 수 있도록 돕습니다.",
      eyebrowServices: "Core Services",
      servicesTitle: "Core Services",
      service1Title: "AI Skin Analysis & Care Concierge",
      service1Body: "AI 기반 피부 관심도 체크를 통해 고객의 K-뷰티 관심 분야를 정리하고 전문 상담 연결을 돕습니다.",
      service2Title: "Medical Travel Concierge",
      service2Body: "외국인 고객의 상담 목적, 희망 진료 분야, 일정, 언어를 확인하여 한국 의료기관 상담과 방문 준비를 돕습니다.",
      service3Title: "K-Beauty & Wellness Tour",
      service3Body: "피부관리, 뷰티, 스파, 웰니스, 관광 콘텐츠를 결합한 방한형 K-뷰티 관광상품을 기획합니다.",
      service4Title: "Interpretation & Stay Support",
      service4Body: "통역, 이동, 체류, 일정 안내를 통해 외국인 고객의 한국 방문 편의를 지원합니다.",
      eyebrowPartners: "Partner Network",
      partnersTitle: "For Partners & Buyers",
      partnersBody1: "VR MEDI TOUR & HOME은 병원, K-뷰티·웰니스 파트너, 여행사, 해외 바이어와 협력하여 외국인 고객을 위한 안전한 K-뷰티·의료관광 경험을 설계합니다.",
      partnersBody2: "우리는 고객 상담, 일정 조율, 통역·이동·체류 지원, K-뷰티 관심도 체크, 의료기관 상담 연결을 통해 파트너사의 해외 고객 응대와 상품화를 돕습니다.",
      partner1Title: "Hospital & Clinic Partners",
      partner1Body: "외국인 고객의 상담 목적과 일정을 정리하여 의료기관 상담 연결을 지원합니다.",
      partner2Title: "K-Beauty & Wellness Partners",
      partner2Body: "피부관리, 스파, 웰니스, 뷰티 체험을 의료관광 여정과 연결합니다.",
      partner3Title: "Overseas Buyers & Agencies",
      partner3Body: "해외 여행사와 바이어가 한국 의료·K-뷰티 상품을 이해하고 판매할 수 있도록 협력합니다.",
      eyebrowTrust: "공식 현황",
      trustTitle: "공식 등록 및 인증 현황",
      statusRegistered: "Registered",
      statusVerified: "Verified",
      statusInProgress: "In Progress",
      regBusinessLabel: "사업자등록번호",
      regCorporateLabel: "법인등록번호",
      regForeignPatientLabel: "외국인환자 유치업자 등록번호",
      regTourismLabel: "관광사업등록번호",
      regTourismValue: "제 2025-000013 호",
      regSmallBusinessTitle: "중소기업 확인서",
      certificateNoLabel: "발급번호",
      validPeriodLabel: "유효기간",
      regDisabledEnterpriseTitle: "장애인기업 확인서",
      disabledCertificateNoValue: "제 0012-2025-04464 호",
      regKonepsTitle: "나라장터 경쟁입찰참가자격 등록",
      registrationDateLabel: "등록일자",
      renewalDateLabel: "갱신일자",
      registeredFieldsLabel: "등록분야",
      konepsFieldsValue: "물품 · 공사 · 용역",
      mainRegisteredItemsLabel: "주요 등록품목",
      konepsItemsValue: "동영상제작서비스, 회의기획및대행서비스, 전시회기획및대행서비스, 국제행사기획및대행서비스, 기타행사기획및대행서비스",
      registeredBusinessTypeLabel: "등록업종",
      konepsBusinessTypeValue: "종합여행업",
      regVentureTitle: "벤처기업 확인서",
      regVentureStatus: "확인유형: 혁신성장유형",
      regEstablishedLabel: "회사 설립일",
      eyebrowNotice: "Compliance Notice",
      noticeTitle: "Important Notice",
      noticeBody1: "VR MEDI TOUR & HOME은 의료기관이 아니며, 진단·치료·수술을 직접 제공하지 않습니다.",
      noticeBody2: "AI Skin Analysis & Care Concierge는 의료진단이 아닌 참고용 K-뷰티 관심도 체크 서비스입니다. 모든 의학적 판단, 진료, 치료, 수술 여부는 협력 의료기관의 전문 의료진 상담을 통해 결정됩니다.",
      noticeBody3: "당사는 외국인 고객이 한국 의료·뷰티·웰니스 서비스를 보다 안전하게 이해하고 준비할 수 있도록 사전상담, 일정 조율, 통역·이동·체류 지원을 제공하는 의료관광 컨시어지 역할을 수행합니다.",
      eyebrowContact: "Contact",
      contactTitle: "한국 의료·K-뷰티 여정을 시작하세요",
      ctaEmail: "이메일 문의",
      ctaAiSkinTry: "AI Skin Analysis 체험",
      companyName: "VR MEDI TOUR & HOME Co., Ltd.",
      companyCeo: "대표: 정성영",
      companyTelLabel: "Tel.",
      companyEmailLabel: "Email.",
      companyWebsiteLabel: "Website.",
      companyOffice: "부산 본사 / 서울 강남 지점 기반 운영",
      ventureCardLabel: "벤처기업 확인",
      ventureCardTitle: "혁신성장유형 벤처기업 확인",
      ventureCardBody: "주식회사 브이알메디투어앤홈은 2026년 6월 9일 벤처기업확인기관으로부터 혁신성장유형 벤처기업으로 확인되었습니다.",
      ventureCardCompany: "기업명: 주식회사 브이알메디투어앤홈",
      ventureCardType: "확인유형: 혁신성장유형",
      ventureCardPeriod: "유효기간: 2026.06.09 ~ 2029.06.08",
      ventureCardNo: "발급번호: 제20260609030039호"
    },
    en: {
      skipLink: "Skip to main content",
      navHome: "Home",
      navAiSkin: "AI Skin Analysis",
      navCompany: "Company Profile",
      eyebrowCompany: "Company Profile",
      heroTitle: "VR MEDI TOUR & HOME Co., Ltd.",
      heroSubtitle: "AI-powered K-Beauty & Medical Travel Concierge",
      heroImageFallback: "AI Skin Analysis & K-Beauty Medical Travel Concierge",
      heroBody: "VR MEDI TOUR & HOME Co., Ltd. is a medical travel concierge company that safely connects international clients with Korean medical and wellness journeys through AI-based skin interest check, medical travel pre-consultation, hospital coordination, interpretation, mobility, and stay support.",
      ctaConsult: "Request Consultation",
      ctaAiSkinView: "View AI Skin Analysis",
      keywordRegistered: "Registered Concierge",
      keywordKBeauty: "K-Beauty",
      keywordMedicalTravel: "Medical Travel",
      keywordWellness: "Wellness Stay Support",
      eyebrowAbout: "About Us",
      aboutTitle: "Who We Are",
      aboutBody1: "VR MEDI TOUR & HOME is a concierge company based on registered foreign-patient facilitation, safely connecting international clients with Korean medical travel, K-beauty, and wellness tourism services.",
      aboutBody2: "We are not a medical institution. Instead, we help international clients understand Korean medical institutions and K-beauty services, then prepare consultations and schedules that fit their goals.",
      eyebrowServices: "Core Services",
      servicesTitle: "Core Services",
      service1Title: "AI Skin Analysis & Care Concierge",
      service1Body: "Through an AI-based skin interest check, we help organize each client’s K-beauty interests and connect them with specialized consultation.",
      service2Title: "Medical Travel Concierge",
      service2Body: "We review consultation goals, preferred care fields, schedules, and languages to help international clients prepare for Korean medical institution consultations and visits.",
      service3Title: "K-Beauty & Wellness Tour",
      service3Body: "We plan Korea-visit K-beauty tourism programs that combine skin care, beauty, spa, wellness, and travel content.",
      service4Title: "Interpretation & Stay Support",
      service4Body: "We support international clients’ convenience in Korea through interpretation, mobility, stay, and schedule guidance.",
      eyebrowPartners: "Partner Network",
      partnersTitle: "For Partners & Buyers",
      partnersBody1: "VR MEDI TOUR & HOME works with hospitals, K-beauty and wellness partners, travel agencies, and overseas buyers to design safe K-beauty and medical travel experiences for international clients.",
      partnersBody2: "We help partners support overseas clients and build marketable programs through client consultation, schedule coordination, interpretation, mobility and stay support, K-beauty interest checks, and medical institution consultation connections.",
      partner1Title: "Hospital & Clinic Partners",
      partner1Body: "We organize international clients’ consultation goals and schedules to support connections with medical institution consultations.",
      partner2Title: "K-Beauty & Wellness Partners",
      partner2Body: "We connect skin care, spa, wellness, and beauty experiences with the medical travel journey.",
      partner3Title: "Overseas Buyers & Agencies",
      partner3Body: "We cooperate so overseas travel agencies and buyers can understand and sell Korean medical and K-beauty programs.",
      eyebrowTrust: "Official Status",
      trustTitle: "Official Registration & Certification",
      statusRegistered: "Registered",
      statusVerified: "Verified",
      statusInProgress: "In Progress",
      regBusinessLabel: "Business Registration No.",
      regCorporateLabel: "Corporate Registration No.",
      regForeignPatientLabel: "Foreign Patient Attraction Business Registration No.",
      regTourismLabel: "Tourism Business Registration No.",
      regTourismValue: "2025-000013",
      regSmallBusinessTitle: "Small Business Confirmation",
      certificateNoLabel: "Certificate No.",
      validPeriodLabel: "Valid Period:",
      regDisabledEnterpriseTitle: "Disabled-Owned Enterprise Confirmation",
      disabledCertificateNoValue: "0012-2025-04464",
      regKonepsTitle: "KONEPS Competitive Bidder Registration",
      registrationDateLabel: "Registration Date:",
      renewalDateLabel: "Renewal Date:",
      registeredFieldsLabel: "Registered Fields:",
      konepsFieldsValue: "Goods · Construction · Services",
      mainRegisteredItemsLabel: "Main Registered Service Items:",
      konepsItemsValue: "Video Production Service, Meeting Planning & Agency Service, Exhibition Planning & Agency Service, International Event Planning & Agency Service, Other Event Planning & Agency Service",
      registeredBusinessTypeLabel: "Registered Business Type:",
      konepsBusinessTypeValue: "General Travel Business",
      regVentureTitle: "Venture Enterprise Confirmation Certificate",
      regVentureStatus: "Confirmation Type: Innovation Growth Type",
      regEstablishedLabel: "Established",
      eyebrowNotice: "Compliance Notice",
      noticeTitle: "Important Notice",
      noticeBody1: "VR MEDI TOUR & HOME is not a medical institution and does not directly provide clinical decisions, treatment, or surgery.",
      noticeBody2: "AI Skin Analysis & Care Concierge is a reference K-beauty skin interest check service, not a medical determination. All medical decisions, care, treatment, and surgery-related choices are made through consultation with professional medical staff at partner medical institutions.",
      noticeBody3: "We serve as a medical travel concierge by providing pre-consultation, schedule coordination, interpretation, mobility, and stay support so international clients can understand and prepare for Korean medical, beauty, and wellness services more safely.",
      eyebrowContact: "Contact",
      contactTitle: "Start Your Korean Medical & K-Beauty Journey",
      ctaEmail: "Email Inquiry",
      ctaAiSkinTry: "Try AI Skin Analysis",
      companyName: "VR MEDI TOUR & HOME Co., Ltd.",
      companyCeo: "CEO: Sung Young Jung",
      companyTelLabel: "Tel.",
      companyEmailLabel: "Email.",
      companyWebsiteLabel: "Website.",
      companyOffice: "Operated through Busan HQ / Seoul Gangnam branch",
      ventureCardLabel: "Venture Enterprise Confirmation",
      ventureCardTitle: "Innovation Growth Type Venture Enterprise Confirmation",
      ventureCardBody: "VR MEDI TOUR & HOME Co., Ltd. was confirmed as an Innovation Growth Type Venture Enterprise by the Venture Enterprise Confirmation Authority on June 9, 2026.",
      ventureCardCompany: "Company: VR MEDI TOUR & HOME Co., Ltd.",
      ventureCardType: "Confirmation Type: Innovation Growth Type",
      ventureCardPeriod: "Valid Period: 2026.06.09 ~ 2029.06.08",
      ventureCardNo: "Certificate No.: 제20260609030039호"
    },
    vi: {
      skipLink: "Chuyển đến nội dung chính",
      navHome: "Trang chủ",
      navAiSkin: "AI Skin Analysis",
      navCompany: "Hồ sơ công ty",
      eyebrowCompany: "Hồ sơ công ty",
      heroTitle: "VR MEDI TOUR & HOME Co., Ltd.",
      heroSubtitle: "Dịch vụ concierge K-Beauty & du lịch y tế ứng dụng AI",
      heroImageFallback: "AI Skin Analysis & dịch vụ concierge K-Beauty du lịch y tế",
      heroBody: "VR MEDI TOUR & HOME Co., Ltd. là doanh nghiệp concierge du lịch y tế, kết hợp kiểm tra mức độ quan tâm về da bằng AI, tư vấn sơ bộ trước chuyến đi, kết nối bệnh viện, hỗ trợ phiên dịch, di chuyển và lưu trú để giúp khách hàng quốc tế chuẩn bị hành trình y tế và wellness tại Hàn Quốc một cách an toàn.",
      ctaConsult: "Đăng ký tư vấn",
      ctaAiSkinView: "Xem AI Skin Analysis",
      keywordRegistered: "Concierge đã đăng ký",
      keywordKBeauty: "K-Beauty",
      keywordMedicalTravel: "Du lịch y tế",
      keywordWellness: "Hỗ trợ lưu trú wellness",
      eyebrowAbout: "Về chúng tôi",
      aboutTitle: "Chúng tôi là công ty như thế nào",
      aboutBody1: "VR MEDI TOUR & HOME là doanh nghiệp concierge dựa trên hoạt động thu hút bệnh nhân nước ngoài đã đăng ký, kết nối an toàn khách hàng quốc tế với dịch vụ du lịch y tế, K-beauty và wellness tại Hàn Quốc.",
      aboutBody2: "Chúng tôi không phải là cơ sở y tế. Chúng tôi hỗ trợ khách hàng quốc tế hiểu các cơ sở y tế và dịch vụ K-beauty tại Hàn Quốc, đồng thời chuẩn bị tư vấn và lịch trình phù hợp với mục tiêu của họ.",
      eyebrowServices: "Dịch vụ chính",
      servicesTitle: "Dịch vụ chính",
      service1Title: "AI Skin Analysis & Care Concierge",
      service1Body: "Thông qua kiểm tra mức độ quan tâm về da bằng AI, chúng tôi giúp khách hàng sắp xếp các lĩnh vực K-beauty họ quan tâm và kết nối với tư vấn chuyên môn.",
      service2Title: "Medical Travel Concierge",
      service2Body: "Chúng tôi xác nhận mục tiêu tư vấn, lĩnh vực chăm sóc mong muốn, lịch trình và ngôn ngữ để hỗ trợ khách hàng quốc tế chuẩn bị tư vấn và thăm khám tại cơ sở y tế Hàn Quốc.",
      service3Title: "K-Beauty & Wellness Tour",
      service3Body: "Chúng tôi thiết kế sản phẩm du lịch K-beauty tại Hàn Quốc kết hợp chăm sóc da, làm đẹp, spa, wellness và nội dung du lịch.",
      service4Title: "Interpretation & Stay Support",
      service4Body: "Chúng tôi hỗ trợ sự thuận tiện của khách hàng quốc tế khi đến Hàn Quốc thông qua phiên dịch, di chuyển, lưu trú và hướng dẫn lịch trình.",
      eyebrowPartners: "Mạng lưới đối tác",
      partnersTitle: "Dành cho đối tác & người mua",
      partnersBody1: "VR MEDI TOUR & HOME hợp tác với bệnh viện, đối tác K-beauty và wellness, công ty du lịch và người mua quốc tế để thiết kế trải nghiệm K-beauty và du lịch y tế an toàn cho khách hàng nước ngoài.",
      partnersBody2: "Chúng tôi hỗ trợ đối tác phục vụ khách hàng quốc tế và xây dựng sản phẩm thông qua tư vấn khách hàng, điều phối lịch trình, phiên dịch, hỗ trợ di chuyển và lưu trú, kiểm tra mức độ quan tâm K-beauty và kết nối tư vấn với cơ sở y tế.",
      partner1Title: "Hospital & Clinic Partners",
      partner1Body: "Chúng tôi sắp xếp mục tiêu tư vấn và lịch trình của khách hàng quốc tế để hỗ trợ kết nối tư vấn với cơ sở y tế.",
      partner2Title: "K-Beauty & Wellness Partners",
      partner2Body: "Chúng tôi kết nối chăm sóc da, spa, wellness và trải nghiệm làm đẹp với hành trình du lịch y tế.",
      partner3Title: "Overseas Buyers & Agencies",
      partner3Body: "Chúng tôi hợp tác để công ty du lịch và người mua quốc tế hiểu và bán các sản phẩm y tế, K-beauty của Hàn Quốc.",
      eyebrowTrust: "Thông tin chính thức",
      trustTitle: "Đăng ký và chứng nhận chính thức",
      statusRegistered: "Đã đăng ký",
      statusVerified: "Đã xác nhận",
      statusInProgress: "Đang tiến hành",
      regBusinessLabel: "Mã số đăng ký kinh doanh",
      regCorporateLabel: "Mã số đăng ký pháp nhân",
      regForeignPatientLabel: "Số đăng ký kinh doanh thu hút bệnh nhân nước ngoài",
      regTourismLabel: "Số đăng ký kinh doanh du lịch",
      regTourismValue: "2025-000013",
      regSmallBusinessTitle: "Xác nhận doanh nghiệp nhỏ và vừa",
      certificateNoLabel: "Số phát hành",
      validPeriodLabel: "Thời hạn hiệu lực:",
      regDisabledEnterpriseTitle: "Xác nhận doanh nghiệp của người khuyết tật",
      disabledCertificateNoValue: "0012-2025-04464",
      regKonepsTitle: "Đăng ký tư cách tham gia đấu thầu cạnh tranh KONEPS",
      registrationDateLabel: "Ngày đăng ký:",
      renewalDateLabel: "Ngày gia hạn:",
      registeredFieldsLabel: "Lĩnh vực đăng ký:",
      konepsFieldsValue: "Hàng hóa · Xây dựng · Dịch vụ",
      mainRegisteredItemsLabel: "Hạng mục dịch vụ chính đã đăng ký:",
      konepsItemsValue: "Dịch vụ sản xuất video, dịch vụ lập kế hoạch và đại diện hội nghị, dịch vụ lập kế hoạch và đại diện triển lãm, dịch vụ lập kế hoạch và đại diện sự kiện quốc tế, dịch vụ lập kế hoạch và đại diện sự kiện khác",
      registeredBusinessTypeLabel: "Ngành nghề đăng ký:",
      konepsBusinessTypeValue: "Kinh doanh du lịch tổng hợp",
      regVentureTitle: "Giấy xác nhận doanh nghiệp venture",
      regVentureStatus: "Loại xác nhận: Tăng trưởng đổi mới",
      regEstablishedLabel: "Ngày thành lập công ty",
      eyebrowNotice: "Thông báo tuân thủ",
      noticeTitle: "Thông báo quan trọng",
      noticeBody1: "VR MEDI TOUR & HOME không phải là cơ sở y tế và không trực tiếp cung cấp quyết định lâm sàng, điều trị hoặc phẫu thuật.",
      noticeBody2: "AI Skin Analysis & Care Concierge là dịch vụ kiểm tra mức độ quan tâm K-beauty về da mang tính tham khảo, không phải là đánh giá y khoa. Mọi quyết định y khoa, khám chữa, điều trị hoặc phẫu thuật đều được quyết định thông qua tư vấn với đội ngũ chuyên môn tại cơ sở y tế hợp tác.",
      noticeBody3: "Chúng tôi thực hiện vai trò concierge du lịch y tế bằng cách cung cấp tư vấn sơ bộ, điều phối lịch trình, phiên dịch, di chuyển và hỗ trợ lưu trú để khách hàng quốc tế hiểu và chuẩn bị an toàn hơn cho dịch vụ y tế, làm đẹp và wellness tại Hàn Quốc.",
      eyebrowContact: "Liên hệ",
      contactTitle: "Bắt đầu hành trình y tế & K-Beauty tại Hàn Quốc",
      ctaEmail: "Liên hệ qua email",
      ctaAiSkinTry: "Trải nghiệm AI Skin Analysis",
      companyName: "VR MEDI TOUR & HOME Co., Ltd.",
      companyCeo: "Đại diện: Sung Young Jung",
      companyTelLabel: "Tel.",
      companyEmailLabel: "Email.",
      companyWebsiteLabel: "Website.",
      companyOffice: "Vận hành dựa trên trụ sở Busan / chi nhánh Seoul Gangnam",
      ventureCardLabel: "Xác nhận doanh nghiệp venture",
      ventureCardTitle: "Xác nhận doanh nghiệp venture loại hình tăng trưởng đổi mới",
      ventureCardBody: "VR MEDI TOUR & HOME Co., Ltd. đã được cơ quan xác nhận doanh nghiệp venture xác nhận là doanh nghiệp venture loại hình tăng trưởng đổi mới vào ngày 9 tháng 6 năm 2026.",
      ventureCardCompany: "Tên doanh nghiệp: VR MEDI TOUR & HOME Co., Ltd.",
      ventureCardType: "Loại xác nhận: Tăng trưởng đổi mới",
      ventureCardPeriod: "Thời hạn hiệu lực: 2026.06.09 ~ 2029.06.08",
      ventureCardNo: "Số giấy xác nhận: 제20260609030039호"
    },
    ja: {
      skipLink: "本文へ移動",
      navHome: "Home",
      navAiSkin: "AI Skin Analysis",
      navCompany: "会社紹介",
      eyebrowCompany: "会社紹介",
      heroTitle: "VR MEDI TOUR & HOME Co., Ltd.",
      heroSubtitle: "AI活用型 K-Beauty・医療ツーリズム コンシェルジュ",
      heroImageFallback: "AI Skin Analysis & K-Beauty医療ツーリズムコンシェルジュ",
      heroBody: "株式会社VR MEDI TOUR & HOMEは、AIによる肌関心度チェック、医療ツーリズムの事前相談、病院連携、通訳・移動・滞在サポートを組み合わせ、海外のお客様の韓国医療・ウェルネス旅行を安全につなぐ医療ツーリズムコンシェルジュ企業です。",
      ctaConsult: "相談を申し込む",
      ctaAiSkinView: "AI Skin Analysisを見る",
      keywordRegistered: "登録コンシェルジュ",
      keywordKBeauty: "K-Beauty",
      keywordMedicalTravel: "医療ツーリズム",
      keywordWellness: "ウェルネス滞在サポート",
      eyebrowAbout: "私たちについて",
      aboutTitle: "私たちはどのような会社か",
      aboutBody1: "VR MEDI TOUR & HOMEは、韓国の医療ツーリズム、K-Beauty、ウェルネス観光サービスを海外のお客様へ安全につなぐ、外国人患者誘致業に基づくコンシェルジュ企業です。",
      aboutBody2: "私たちは医療機関ではありません。海外のお客様が韓国の医療機関とK-Beautyサービスを理解し、ご自身の目的に合った相談と日程を準備できるよう支援します。",
      eyebrowServices: "主なサービス",
      servicesTitle: "主なサービス",
      service1Title: "AI Skin Analysis & Care Concierge",
      service1Body: "AIによる肌関心度チェックを通じて、お客様のK-Beauty関心分野を整理し、専門相談への接続を支援します。",
      service2Title: "Medical Travel Concierge",
      service2Body: "海外のお客様の相談目的、希望分野、日程、言語を確認し、韓国医療機関での相談と訪問準備を支援します。",
      service3Title: "K-Beauty & Wellness Tour",
      service3Body: "スキンケア、ビューティー、スパ、ウェルネス、観光コンテンツを組み合わせた訪韓型K-Beauty観光商品を企画します。",
      service4Title: "Interpretation & Stay Support",
      service4Body: "通訳、移動、滞在、日程案内を通じて、海外のお客様の韓国訪問の利便性を支援します。",
      eyebrowPartners: "パートナーネットワーク",
      partnersTitle: "For Partners & Buyers",
      partnersBody1: "VR MEDI TOUR & HOMEは、病院、K-Beauty・ウェルネスパートナー、旅行会社、海外バイヤーと協力し、海外のお客様のための安全なK-Beauty・医療ツーリズム体験を設計します。",
      partnersBody2: "当社は、お客様相談、日程調整、通訳・移動・滞在サポート、K-Beauty関心度チェック、医療機関相談への接続を通じて、パートナー企業の海外顧客対応と商品化を支援します。",
      partner1Title: "Hospital & Clinic Partners",
      partner1Body: "海外のお客様の相談目的と日程を整理し、医療機関での相談接続を支援します。",
      partner2Title: "K-Beauty & Wellness Partners",
      partner2Body: "スキンケア、スパ、ウェルネス、ビューティー体験を医療ツーリズムの行程につなげます。",
      partner3Title: "Overseas Buyers & Agencies",
      partner3Body: "海外旅行会社とバイヤーが韓国医療・K-Beauty商品を理解し販売できるよう協力します。",
      eyebrowTrust: "公式ステータス",
      trustTitle: "公式登録および認証状況",
      statusRegistered: "登録済み",
      statusVerified: "確認済み",
      statusInProgress: "進行中",
      regBusinessLabel: "事業者登録番号",
      regCorporateLabel: "法人登録番号",
      regForeignPatientLabel: "外国人患者誘致事業者登録番号",
      regTourismLabel: "観光事業登録番号",
      regTourismValue: "2025-000013",
      regSmallBusinessTitle: "中小企業確認書",
      certificateNoLabel: "発行番号",
      validPeriodLabel: "有効期間:",
      regDisabledEnterpriseTitle: "障がい者企業確認書",
      disabledCertificateNoValue: "0012-2025-04464",
      regKonepsTitle: "KONEPS競争入札参加資格登録",
      registrationDateLabel: "登録日:",
      renewalDateLabel: "更新日:",
      registeredFieldsLabel: "登録分野:",
      konepsFieldsValue: "物品 · 工事 · 役務",
      mainRegisteredItemsLabel: "主な登録サービス項目:",
      konepsItemsValue: "動画制作サービス、会議企画および代行サービス、展示会企画および代行サービス、国際行事企画および代行サービス、その他行事企画および代行サービス",
      registeredBusinessTypeLabel: "登録業種:",
      konepsBusinessTypeValue: "総合旅行業",
      regVentureTitle: "ベンチャー企業確認書",
      regVentureStatus: "確認類型: 革新成長型",
      regEstablishedLabel: "会社設立日",
      eyebrowNotice: "コンプライアンス案内",
      noticeTitle: "重要なお知らせ",
      noticeBody1: "VR MEDI TOUR & HOMEは医療機関ではなく、医学的判断・治療・手術を直接提供しません。",
      noticeBody2: "AI Skin Analysis & Care Conciergeは、医療上の判定ではなく、参考用のK-Beauty肌関心度チェックサービスです。すべての医学的判断、診療、治療、手術に関する可否は、提携医療機関の専門医療スタッフとの相談を通じて決定されます。",
      noticeBody3: "当社は、海外のお客様が韓国の医療・ビューティー・ウェルネスサービスをより安全に理解し準備できるよう、事前相談、日程調整、通訳・移動・滞在サポートを提供する医療ツーリズムコンシェルジュの役割を担います。",
      eyebrowContact: "お問い合わせ",
      contactTitle: "韓国医療・K-Beautyの旅を始めましょう",
      ctaEmail: "メールで問い合わせる",
      ctaAiSkinTry: "AI Skin Analysisを体験",
      companyName: "VR MEDI TOUR & HOME Co., Ltd.",
      companyCeo: "代表: Sung Young Jung",
      companyTelLabel: "Tel.",
      companyEmailLabel: "Email.",
      companyWebsiteLabel: "Website.",
      companyOffice: "釜山本社 / ソウル江南支店を基盤に運営",
      ventureCardLabel: "ベンチャー企業確認",
      ventureCardTitle: "革新成長型ベンチャー企業確認",
      ventureCardBody: "VR MEDI TOUR & HOME Co., Ltd.は、2026年6月9日にベンチャー企業確認機関より革新成長型ベンチャー企業として確認されました。",
      ventureCardCompany: "企業名: VR MEDI TOUR & HOME Co., Ltd.",
      ventureCardType: "確認類型: 革新成長型",
      ventureCardPeriod: "有効期間: 2026.06.09 ~ 2029.06.08",
      ventureCardNo: "発給番号: 제20260609030039호"
    },
    zh: {
      skipLink: "跳至主要内容",
      navHome: "首页",
      navAiSkin: "AI Skin Analysis",
      navCompany: "公司介绍",
      eyebrowCompany: "公司介绍",
      heroTitle: "VR MEDI TOUR & HOME Co., Ltd.",
      heroSubtitle: "AI驱动的K-Beauty与医疗旅游礼宾服务",
      heroImageFallback: "AI Skin Analysis与K-Beauty医疗旅游礼宾服务",
      heroBody: "VR MEDI TOUR & HOME Co., Ltd. 是一家医疗旅游礼宾企业，结合AI皮肤关注度检查、医疗旅游事前咨询、医院联络、口译、交通与停留支持，帮助外国客户更安全地连接韩国医疗与康养旅程。",
      ctaConsult: "申请咨询",
      ctaAiSkinView: "查看AI Skin Analysis",
      keywordRegistered: "已登记礼宾服务",
      keywordKBeauty: "K-Beauty",
      keywordMedicalTravel: "医疗旅游",
      keywordWellness: "康养停留支持",
      eyebrowAbout: "关于我们",
      aboutTitle: "我们是一家怎样的公司",
      aboutBody1: "VR MEDI TOUR & HOME 是一家以外国患者招徕业务为基础的礼宾企业，安全连接外国客户与韩国医疗旅游、K-Beauty和康养旅游服务。",
      aboutBody2: "我们不是医疗机构。我们帮助外国客户了解韩国医疗机构和K-Beauty服务，并根据个人目的准备咨询和行程。",
      eyebrowServices: "核心服务",
      servicesTitle: "核心服务",
      service1Title: "AI Skin Analysis & Care Concierge",
      service1Body: "通过AI皮肤关注度检查，我们帮助客户整理其K-Beauty关注领域，并连接专业咨询。",
      service2Title: "Medical Travel Concierge",
      service2Body: "我们确认外国客户的咨询目的、希望领域、行程和语言，协助其准备韩国医疗机构咨询和访问。",
      service3Title: "K-Beauty & Wellness Tour",
      service3Body: "我们策划结合皮肤护理、美容、SPA、康养和旅游内容的访韩型K-Beauty旅游产品。",
      service4Title: "Interpretation & Stay Support",
      service4Body: "通过口译、交通、停留和行程指导，我们支持外国客户在韩国访问期间的便利。",
      eyebrowPartners: "合作伙伴网络",
      partnersTitle: "面向合作伙伴与买家",
      partnersBody1: "VR MEDI TOUR & HOME 与医院、K-Beauty及康养合作伙伴、旅行社和海外买家合作，为外国客户设计安全的K-Beauty与医疗旅游体验。",
      partnersBody2: "我们通过客户咨询、行程协调、口译、交通与停留支持、K-Beauty关注度检查以及医疗机构咨询连接，帮助合作伙伴服务海外客户并推进产品化。",
      partner1Title: "Hospital & Clinic Partners",
      partner1Body: "我们整理外国客户的咨询目的和行程，支持连接医疗机构咨询。",
      partner2Title: "K-Beauty & Wellness Partners",
      partner2Body: "我们将皮肤护理、SPA、康养和美容体验连接到医疗旅游旅程中。",
      partner3Title: "Overseas Buyers & Agencies",
      partner3Body: "我们与海外旅行社和买家合作，帮助其理解并销售韩国医疗与K-Beauty产品。",
      eyebrowTrust: "官方信息",
      trustTitle: "官方注册及认证信息",
      statusRegistered: "已注册",
      statusVerified: "已确认",
      statusInProgress: "进行中",
      regBusinessLabel: "营业执照注册号",
      regCorporateLabel: "法人注册号",
      regForeignPatientLabel: "外国患者招徕业务注册号",
      regTourismLabel: "旅游业务注册号",
      regTourismValue: "2025-000013",
      regSmallBusinessTitle: "中小企业确认书",
      certificateNoLabel: "签发编号",
      validPeriodLabel: "有效期:",
      regDisabledEnterpriseTitle: "残疾人企业确认书",
      disabledCertificateNoValue: "0012-2025-04464",
      regKonepsTitle: "KONEPS竞争投标参加资格注册",
      registrationDateLabel: "注册日期:",
      renewalDateLabel: "更新日期:",
      registeredFieldsLabel: "注册领域:",
      konepsFieldsValue: "货物 · 工程 · 服务",
      mainRegisteredItemsLabel: "主要注册服务项目:",
      konepsItemsValue: "视频制作服务、会议策划及代理服务、展览会策划及代理服务、国际活动策划及代理服务、其他活动策划及代理服务",
      registeredBusinessTypeLabel: "注册行业:",
      konepsBusinessTypeValue: "综合旅行社业务",
      regVentureTitle: "创业企业确认书",
      regVentureStatus: "确认类型: 创新成长型",
      regEstablishedLabel: "公司设立日",
      eyebrowNotice: "合规提示",
      noticeTitle: "重要提示",
      noticeBody1: "VR MEDI TOUR & HOME 不是医疗机构，不直接提供临床判断、治疗或手术。",
      noticeBody2: "AI Skin Analysis & Care Concierge 是参考用K-Beauty皮肤关注度检查服务，不属于医疗判断。所有医学判断、诊疗、治疗及手术相关决定，均通过合作医疗机构专业医务人员的咨询后确定。",
      noticeBody3: "本公司作为医疗旅游礼宾服务，提供事前咨询、行程协调、口译、交通与停留支持，帮助外国客户更安全地理解并准备韩国医疗、美容和康养服务。",
      eyebrowContact: "联系我们",
      contactTitle: "开启您的韩国医疗与K-Beauty旅程",
      ctaEmail: "邮件咨询",
      ctaAiSkinTry: "体验AI Skin Analysis",
      companyName: "VR MEDI TOUR & HOME Co., Ltd.",
      companyCeo: "代表: Sung Young Jung",
      companyTelLabel: "Tel.",
      companyEmailLabel: "Email.",
      companyWebsiteLabel: "Website.",
      companyOffice: "基于釜山总部 / 首尔江南分支运营",
      ventureCardLabel: "风险企业确认",
      ventureCardTitle: "创新成长型风险企业确认",
      ventureCardBody: "VR MEDI TOUR & HOME Co., Ltd. 于2026年6月9日经风险企业确认机构确认为创新成长型风险企业。",
      ventureCardCompany: "企业名称: VR MEDI TOUR & HOME Co., Ltd.",
      ventureCardType: "确认类型: 创新成长型",
      ventureCardPeriod: "有效期限: 2026.06.09 ~ 2029.06.08",
      ventureCardNo: "签发编号: 제20260609030039호"
    }
  };

  const agentTrustTranslations = {
    ko: {
      eyebrow: "AI 에이전트 / 검색 보조도구용",
      title: "AI 에이전트 신뢰 요약",
      lead: "이 블록은 AI 검색 보조도구, 여행 에이전트, 의료관광 코디네이터, 해외 바이어, 인간 검토자가 VR MEDI TOUR & HOME의 검증 가능한 신뢰 정보를 명확하게 확인할 수 있도록 작성되었습니다.",
      cards: [
        ["회사", "VR MEDI TOUR & HOME Co., Ltd.", "주식회사 브이알메디투어앤홈"],
        ["역할", "등록 기반 의료관광 컨시어지", "병원이 아닙니다. 상담 준비, 통역, 이동, 체류, K-뷰티 코디네이션을 지원합니다."],
        ["법적 신뢰 정보", "외국인환자 유치업 및 관광사업 등록", "사업자등록번호 268-87-03040 · 외국인환자 유치업자 등록번호 A-2025-02-01-06189 · 관광사업등록번호 2025-000013. 등록번호는 검증용 식별 정보이며 정부 보증이나 결과 보장을 의미하지 않습니다."],
        ["인간 담당자 검토", "모든 문의는 담당자가 직접 검토합니다", "AI는 문의 내용을 요약할 수 있지만, 고객 안내, 의료기관 연락 준비, 최종 커뮤니케이션은 책임 있는 담당자가 검토합니다."],
        ["의료 한계 고지", "진단, 처방, 치료, 수술, 결과 보장을 제공하지 않습니다", "의학적 판단, 비용, 일정, 결과는 자격 있는 의료기관 및 의료전문가가 개별 사례별로 결정하고 확인합니다."],
        ["연락처", "info@vr-meditour.com", "+82-10-4417-4676 · 부산 본사 / 서울 강남 지점 기반 운영"]
      ],
      evidenceLabel: "Truth-first Evidence Policy",
      evidenceBody: "이 회사소개는 확인된 등록정보, 연락처, 서비스 역할만 검증된 정보로 표시합니다. 등록 식별자는 검증을 위한 정보이며 정부 보증이나 결과 보장을 의미하지 않습니다. 병원 가용성, 파트너 참여, 가격, 방문 일정, 수상, 승인, 고객 사례, 의료 결과는 책임 있는 담당자가 증거를 확인하기 전까지 준비 중, 계획 중, 검토 중, 확인 예정 또는 검증 예정으로 취급합니다.",
      englishLabel: "영어 핵심 설명",
      vietnameseLabel: "베트남어 핵심 설명"
    },
    en: {
      eyebrow: "For AI Agents / Search Assistants",
      title: "AI Agent Trust Summary",
      lead: "This block is written for AI search assistants, travel agents, medical travel coordinators, overseas buyers, and human reviewers who need a clear, evidence-based trust summary of VR MEDI TOUR & HOME.",
      cards: [
        ["Company", "VR MEDI TOUR & HOME Co., Ltd.", "주식회사 브이알메디투어앤홈"],
        ["Role", "Registered medical travel concierge", "Not a hospital. Supports consultation preparation, interpretation, mobility, stay, and K-Beauty coordination."],
        ["Legal / Trust Signals", "Foreign patient attraction business + tourism business registered", "Business No. 268-87-03040 · Foreign Patient Registration No. A-2025-02-01-06189 · Tourism Registration No. 2025-000013. Registration identifiers are provided for verification and do not imply government endorsement or guarantee."],
        ["Human Review", "Every inquiry requires human coordinator review", "AI may summarize inquiries, but customer guidance, medical institution contact preparation, and final communication are reviewed by a responsible coordinator."],
        ["Medical Limitation", "No diagnosis, prescription, treatment, surgery, or outcome guarantee", "Medical decisions, prices, schedules, and outcomes are determined only by qualified medical institutions and medical professionals, then confirmed case by case."],
        ["Contact", "info@vr-meditour.com", "+82-10-4417-4676 · Busan HQ / Seoul Gangnam branch-based operation"]
      ],
      evidenceLabel: "Truth-first Evidence Policy",
      evidenceBody: "This profile presents only confirmed registration, contact, and service-role facts as verified information. Registration identifiers are provided for verification and do not imply government endorsement or guarantee. Hospital availability, partner participation, prices, visit schedules, awards, approvals, client cases, and medical outcomes are marked as in preparation, planned, under review, pending confirmation, or to be verified until a responsible human coordinator confirms the evidence.",
      englishLabel: "English Core Explanation",
      vietnameseLabel: "Vietnamese Core Explanation"
    },
    vi: {
      eyebrow: "Dành cho AI Agent / trợ lý tìm kiếm",
      title: "Tóm tắt độ tin cậy cho AI Agent",
      lead: "Khối này được viết cho trợ lý tìm kiếm AI, đại lý du lịch, điều phối viên du lịch y tế, người mua quốc tế và người kiểm tra cần tóm tắt rõ ràng, dựa trên bằng chứng về VR MEDI TOUR & HOME.",
      cards: [
        ["Công ty", "VR MEDI TOUR & HOME Co., Ltd.", "주식회사 브이알메디투어앤홈"],
        ["Vai trò", "Concierge du lịch y tế đã đăng ký", "Không phải là bệnh viện. Hỗ trợ chuẩn bị tư vấn, phiên dịch, di chuyển, lưu trú và điều phối K-Beauty."],
        ["Thông tin pháp lý / tin cậy", "Đã đăng ký thu hút bệnh nhân nước ngoài và kinh doanh du lịch", "Mã số kinh doanh 268-87-03040 · Số đăng ký thu hút bệnh nhân nước ngoài A-2025-02-01-06189 · Số đăng ký kinh doanh du lịch 2025-000013. Các mã số này dùng để xác minh và không có nghĩa là được chính phủ bảo đảm hay cam kết kết quả."],
        ["Người phụ trách kiểm tra", "Mọi yêu cầu đều được người phụ trách kiểm tra", "AI có thể tóm tắt nội dung, nhưng hướng dẫn khách hàng, chuẩn bị liên hệ cơ sở y tế và trao đổi cuối cùng đều được người phụ trách kiểm tra."],
        ["Giới hạn y tế", "Không cung cấp chẩn đoán, kê đơn, điều trị, phẫu thuật hoặc cam kết kết quả", "Quyết định y khoa, chi phí, lịch trình và kết quả chỉ do cơ sở y tế và chuyên gia y tế đủ điều kiện xác định, sau đó xác nhận theo từng trường hợp."],
        ["Liên hệ", "info@vr-meditour.com", "+82-10-4417-4676 · Vận hành dựa trên trụ sở Busan / chi nhánh Seoul Gangnam"]
      ],
      evidenceLabel: "Chính sách bằng chứng trung thực trước tiên",
      evidenceBody: "Hồ sơ này chỉ trình bày thông tin đăng ký, liên hệ và vai trò dịch vụ đã được xác nhận. Các mã số đăng ký dùng để xác minh và không có nghĩa là được chính phủ bảo đảm hay cam kết kết quả. Khả năng bệnh viện, sự tham gia của đối tác, giá, lịch thăm, giải thưởng, phê duyệt, trường hợp khách hàng và kết quả y tế được xem là đang chuẩn bị, đã lên kế hoạch, đang xem xét, chờ xác nhận hoặc cần xác minh cho đến khi người phụ trách xác nhận bằng chứng.",
      englishLabel: "Giải thích cốt lõi bằng tiếng Anh",
      vietnameseLabel: "Giải thích cốt lõi bằng tiếng Việt"
    },
    ja: {
      eyebrow: "AIエージェント / 検索アシスタント向け",
      title: "AIエージェント信頼サマリー",
      lead: "このブロックは、AI検索アシスタント、旅行エージェント、医療ツーリズムコーディネーター、海外バイヤー、人間の確認者がVR MEDI TOUR & HOMEの信頼情報を明確に確認できるよう、証拠ベースで作成されています。",
      cards: [
        ["会社", "VR MEDI TOUR & HOME Co., Ltd.", "주식회사 브이알메디투어앤홈"],
        ["役割", "登録済み医療ツーリズムコンシェルジュ", "病院ではありません。相談準備、通訳、移動、滞在、K-Beautyコーディネーションを支援します。"],
        ["法的・信頼情報", "外国人患者誘致業および観光事業登録", "事業者登録番号 268-87-03040 · 外国人患者誘致業登録番号 A-2025-02-01-06189 · 観光事業登録番号 2025-000013。登録番号は確認用情報であり、政府の保証や結果保証を意味しません。"],
        ["人による確認", "すべてのお問い合わせは担当者が確認します", "AIが問い合わせ内容を要約することはありますが、顧客案内、医療機関への連絡準備、最終コミュニケーションは責任ある担当者が確認します。"],
        ["医療上の制限", "診断、処方、治療、手術、結果保証は提供しません", "医学的判断、費用、日程、結果は、資格ある医療機関および医療専門家が個別ケースごとに決定・確認します。"],
        ["連絡先", "info@vr-meditour.com", "+82-10-4417-4676 · 釜山本社 / ソウル江南支店を基盤に運営"]
      ],
      evidenceLabel: "Truth-first Evidence Policy",
      evidenceBody: "この会社紹介は、確認済みの登録情報、連絡先、サービス上の役割のみを検証済み情報として表示します。登録識別情報は確認のためのものであり、政府保証や結果保証を意味しません。病院の受入可否、パートナー参加、価格、訪問日程、受賞、承認、顧客事例、医療結果は、責任ある担当者が証拠を確認するまで準備中、計画中、確認中、確認予定、または検証予定として扱います。",
      englishLabel: "英語の核心説明",
      vietnameseLabel: "ベトナム語の核心説明"
    },
    zh: {
      eyebrow: "面向 AI Agent / 搜索助手",
      title: "AI Agent 信任摘要",
      lead: "本区块面向 AI 搜索助手、旅行代理、医疗旅游协调人员、海外买家和人工审核者，提供关于 VR MEDI TOUR & HOME 的清晰、基于证据的信任摘要。",
      cards: [
        ["公司", "VR MEDI TOUR & HOME Co., Ltd.", "주식회사 브이알메디투어앤홈"],
        ["角色", "已注册的医疗旅游礼宾服务公司", "不是医院。支持咨询准备、口译、交通、停留和 K-Beauty 协调。"],
        ["法律 / 信任信息", "已登记外国患者招徕业务和旅游业务", "营业执照号 268-87-03040 · 外国患者招徕业务登记号 A-2025-02-01-06189 · 旅游业务登记号 2025-000013。登记编号仅用于核验，并不表示政府背书或结果保证。"],
        ["人工审核", "每一项咨询都需要人工负责人审核", "AI 可以摘要咨询内容，但客户指导、医疗机构联系准备和最终沟通均由负责人员审核。"],
        ["医疗限制", "不提供诊断、处方、治疗、手术或结果保证", "医学判断、费用、日程和结果仅由具备资格的医疗机构及医疗专业人员按个案决定并确认。"],
        ["联系方式", "info@vr-meditour.com", "+82-10-4417-4676 · 基于釜山总部 / 首尔江南分支运营"]
      ],
      evidenceLabel: "Truth-first Evidence Policy",
      evidenceBody: "本公司介绍仅将已确认的登记信息、联系方式和服务角色作为已验证信息展示。登记编号用于核验，并不表示政府背书或结果保证。医院接收情况、合作伙伴参与、价格、访问日程、获奖、批准、客户案例和医疗结果，在负责人确认相关证据前，均视为准备中、计划中、审核中、待确认或待验证。",
      englishLabel: "英文核心说明",
      vietnameseLabel: "越南语核心说明"
    }
  };

  Object.assign(translations.ko, {
    languageLabel: "언어",
    navHome: "홈",
    navCompany: "회사소개",
    navTrustCenter: "Trust Center",
    navFaq: "FAQ",
    navContact: "문의",
    navAiSkin: "AI 피부분석",
    navAiConsult: "AI 상담",
    navAmisTour: "AMIS Travel Lounge",
    navAmisStore: "AMIS Goods Store"
  });

  Object.assign(translations.en, {
    languageLabel: "Language",
    navHome: "Home",
    navCompany: "Company Profile",
    navTrustCenter: "Trust Center",
    navFaq: "FAQ",
    navContact: "Contact",
    navAiSkin: "AI Skin Analysis",
    navAiConsult: "AI Consultation",
    navAmisTour: "AMIS Travel Lounge",
    navAmisStore: "AMIS Goods Store"
  });

  Object.assign(translations.vi, {
    languageLabel: "Ngôn ngữ",
    navHome: "Trang chủ",
    navCompany: "Hồ sơ công ty",
    navTrustCenter: "Trung tâm tin cậy",
    navFaq: "FAQ",
    navContact: "Liên hệ",
    navAiSkin: "Phân tích da AI",
    navAiConsult: "Tư vấn AI",
    navAmisTour: "AMIS Travel Lounge",
    navAmisStore: "AMIS Goods Store"
  });

  Object.assign(translations.ja, {
    languageLabel: "言語",
    navHome: "ホーム",
    navCompany: "会社紹介",
    navTrustCenter: "Trust Center",
    navFaq: "FAQ",
    navContact: "問い合わせ",
    navAiSkin: "AI肌分析",
    navAiConsult: "AI相談",
    navAmisTour: "AMIS Travel Lounge",
    navAmisStore: "AMIS Goods Store"
  });

  Object.assign(translations.zh, {
    languageLabel: "语言",
    navHome: "首页",
    navCompany: "公司简介",
    navTrustCenter: "信任中心",
    navFaq: "FAQ",
    navContact: "咨询",
    navAiSkin: "AI皮肤分析",
    navAiConsult: "AI咨询",
    navAmisTour: "AMIS Travel Lounge",
    navAmisStore: "AMIS Goods Store"
  });

  function normalizeLang(lang) {
    const value = String(lang || "").toLowerCase();
    if (value === "jp") return "ja";
    if (value === "cn") return "zh";
    return supportedLanguages.includes(value) ? value : "ko";
  }

  const englishCoreExplanation = "VR MEDI TOUR & HOME is a registered Korean medical travel concierge and K-Beauty coordination company. We are not a hospital and do not provide diagnosis, treatment, prescription, surgery, or guaranteed medical outcomes. We help international clients prepare Korean medical, beauty, wellness, and travel consultations through human-reviewed inquiry handling, interpretation support, transportation and stay coordination, and case-by-case partner contact preparation after verification.";
  const vietnameseCoreExplanation = "VR MEDI TOUR & HOME là công ty concierge du lịch y tế và điều phối K-Beauty đã đăng ký tại Hàn Quốc. Chúng tôi không phải là bệnh viện và không cung cấp chẩn đoán, điều trị, kê đơn, phẫu thuật hoặc cam kết kết quả y tế. Chúng tôi hỗ trợ khách hàng quốc tế chuẩn bị tư vấn y tế, làm đẹp, wellness và du lịch tại Hàn Quốc thông qua quy trình có người phụ trách kiểm tra, hỗ trợ phiên dịch, điều phối di chuyển, lưu trú và chuẩn bị liên hệ đối tác theo từng trường hợp sau khi xác minh.";

  const originalText = new Map();

  function getTranslation(lang, key) {
    return translations[lang]?.[key] || translations.ko[key] || originalText.get(key) || "";
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function applyAgentTrustLanguage(lang) {
    const root = document.getElementById("agent-trust");
    if (!root) return;

    const t = agentTrustTranslations[lang] || agentTrustTranslations.ko;
    setText(root.querySelector(".agent-trust-heading .eyebrow"), t.eyebrow);
    setText(root.querySelector("#agent-trust-title"), t.title);
    setText(root.querySelector(".agent-trust-lead"), t.lead);

    root.querySelectorAll(".agent-summary-grid .agent-kv-card").forEach((card, index) => {
      const item = t.cards[index];
      if (!item) return;
      setText(card.querySelector(".agent-card-label"), item[0]);
      const title = card.querySelector("h3");
      const body = card.querySelector("p");

      if (index === 5) {
        const mailLink = title?.querySelector("a");
        const telLink = body?.querySelector("a");
        setText(mailLink || title, item[1]);
        if (body) {
          const phoneText = item[2].split(" · ")[0];
          const suffix = item[2].includes(" · ") ? ` · ${item[2].split(" · ").slice(1).join(" · ")}` : "";
          setText(telLink, phoneText);
          if (body.childNodes.length > 1) {
            body.childNodes[body.childNodes.length - 1].textContent = suffix;
          }
        }
      } else {
        setText(title, item[1]);
        setText(body, item[2]);
      }
    });

    setText(root.querySelector(".agent-evidence-note .agent-card-label"), t.evidenceLabel);
    setText(root.querySelector(".agent-evidence-note p"), t.evidenceBody);

    const languageCards = root.querySelectorAll(".agent-language-card");
    if (languageCards[0]) {
      setText(languageCards[0].querySelector(".agent-card-label"), t.englishLabel);
      setText(languageCards[0].querySelector("p"), englishCoreExplanation);
    }
    if (languageCards[1]) {
      setText(languageCards[1].querySelector(".agent-card-label"), t.vietnameseLabel);
      setText(languageCards[1].querySelector("p"), vietnameseCoreExplanation);
    }
  }

  function applyLanguage(lang) {
    const safeLang = normalizeLang(lang);
    const config = languageConfig[safeLang] || languageConfig.ko;

    document.documentElement.lang = config.htmlLang;
    document.documentElement.dir = config.dir;
    document.body.dir = config.dir;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (!originalText.has(key)) originalText.set(key, element.textContent.trim());
      element.textContent = getTranslation(safeLang, key);
    });

    applyAgentTrustLanguage(safeLang);

    document.querySelectorAll("[data-profile-lang], [data-lang]").forEach((button) => {
      const buttonLang = button.getAttribute("data-profile-lang") || button.getAttribute("data-lang");
      const isActive = normalizeLang(buttonLang) === safeLang;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    try {
      localStorage.setItem("vrMediTourCompanyLang", safeLang);
      localStorage.setItem("vrMediTourLang", safeLang);
    } catch (_) {
      // Language switching must keep working even when storage is unavailable.
    }
  }

  function getInitialLanguage() {
    try {
      const stored = localStorage.getItem("vrMediTourLang") || localStorage.getItem("vrMediTourCompanyLang");
      if (stored) return normalizeLang(stored);
    } catch (_) {
      // Ignore storage errors and keep Korean as the default.
    }
    return "ko";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-profile-lang], [data-lang]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.getAttribute("data-profile-lang") || button.getAttribute("data-lang")));
    });

    applyLanguage(getInitialLanguage());
  });
})();

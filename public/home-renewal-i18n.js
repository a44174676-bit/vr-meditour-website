(() => {
  "use strict";
  // Additional keys are isolated from the existing site-language-data.js dictionary.
  const ko={
    navMedical:"의료관광",navTours:"한국 여행",navStudy:"한국 유학·정착",navCompany:"회사소개·제휴",eyebrow:"KOREA · VIETNAM | MEDICAL · TRAVEL · EDUCATION",
    headline:"한국에서의 새로운 시작, 믿을 수 있는 연결에서 출발합니다.",
    description:"의료관광, 한국 여행, 유학·정착 지원까지. VR MEDI TOUR & HOME이 고객과 기관의 목적에 맞는 서비스를 안내합니다.",
    viewServices:"서비스 살펴보기 ↗",partnerInquiry:"기업·기관 제휴 문의 →",eyeline:"확인 가능한 법인 등록 · 투명한 상담 · 협력기관 중심 서비스",
    servicesTitle:"무엇을 도와드릴까요?",servicesDesc:"목적에 맞는 서비스를 선택하세요. 필요한 안내부터 다음 단계까지 연결합니다.",
    medicalTitle:"의료관광",medicalDesc:"협력 의료기관 중심으로 사전 문의 정리, 예약 연계, 통역 및 방한 일정 안내를 제공합니다. 진료 판단은 의료기관이 담당합니다.",medicalCTA:"의료관광 상담 안내 →",
    tourTitle:"한국 여행",tourDesc:"베트남 방문객과 기관을 위한 한국 역사·문화·K-뷰티·웰니스 체험과 맞춤형 방한 일정 상담을 제공합니다.",tourCTA:"한국 여행상품 보기 →",
    eduTitle:"한국 유학·정착",eduDesc:"한국 유학 사전 정보와 부산 초기 생활 안내, 베트남 현지 유학원·한국 교육기관 간 B2B 협력 문의를 연결합니다.",eduCTA:"유학·정착 안내 보기 →",
    rndTitle:"기술·연구개발 및 체험",rndDesc:"AI·VR 연구기능과 개발 중인 제품은 주력 서비스와 구분해 소개합니다. 아래 기능은 진단이나 법률적 판단을 대체하지 않습니다.",
    rndSkin:"AI 피부 분석",rndMydata:"의료마이데이터 AI",rndInterpret:"AI 통역",rndKorean:"한국어 연습",rndOmni:"옴니볼 스키",rndStore:"굿즈 스토어",moreDetails:"의료관광·기술·기존 상세 안내 펼쳐보기"
  };
  const vi={
    navMedical:"Du lịch y tế",navTours:"Du lịch Hàn Quốc",navStudy:"Du học & Hỗ trợ ổn định",navCompany:"Giới thiệu & Hợp tác",eyebrow:"HÀN QUỐC · VIỆT NAM | Y TẾ · DU LỊCH · GIÁO DỤC",
    headline:"Khởi đầu mới tại Hàn Quốc, từ những kết nối đáng tin cậy.",
    description:"Du lịch y tế, du lịch Hàn Quốc, thông tin du học và định hướng cuộc sống. Chúng tôi kết nối các dịch vụ phù hợp với nhu cầu của khách hàng và đối tác.",
    viewServices:"Khám phá dịch vụ ↗",partnerInquiry:"Hợp tác doanh nghiệp & tổ chức →",eyeline:"Thông tin doanh nghiệp có thể kiểm chứng · Tư vấn minh bạch · Hợp tác chuyên môn",
    servicesTitle:"Chúng tôi có thể hỗ trợ gì cho bạn?",servicesDesc:"Chọn lĩnh vực phù hợp và tìm hiểu các bước hỗ trợ tiếp theo.",
    medicalTitle:"Du lịch y tế",medicalDesc:"Hỗ trợ chuẩn bị tư vấn, đặt hẹn, phiên dịch và lịch trình thông qua các cơ sở y tế đối tác. Mọi quyết định chuyên môn thuộc về cơ sở y tế.",medicalCTA:"Tìm hiểu tư vấn y tế →",
    tourTitle:"Du lịch Hàn Quốc",tourDesc:"Chương trình du lịch văn hóa, lịch sử, K-beauty và wellness phù hợp với khách Việt Nam, đoàn thể và tổ chức.",tourCTA:"Xem chương trình du lịch →",
    eduTitle:"Du học & Hỗ trợ ổn định",eduDesc:"Thông tin chuẩn bị du học, định hướng sinh hoạt tại Busan và kết nối hợp tác B2B giữa trung tâm du học Việt Nam với tổ chức giáo dục Hàn Quốc.",eduCTA:"Tìm hiểu du học & đời sống →",
    rndTitle:"Công nghệ, R&D và trải nghiệm",rndDesc:"Các công cụ AI/VR và sản phẩm đang nghiên cứu được giới thiệu tách biệt với dịch vụ chính. Chúng không thay thế chẩn đoán y tế hoặc tư vấn pháp lý.",
    rndSkin:"Phân tích da bằng AI",rndMydata:"AI dữ liệu y tế cá nhân",rndInterpret:"Phiên dịch AI",rndKorean:"Luyện tiếng Hàn",rndOmni:"Omniball Ski",rndStore:"Quà tặng thương hiệu",moreDetails:"Xem thêm về dịch vụ y tế, công nghệ và tài liệu hiện có"
  };
  const en={
    navMedical:"Medical Tourism",navTours:"Korea Tours",navStudy:"Study & Settlement",navCompany:"About & Partners",eyebrow:"KOREA · VIETNAM | MEDICAL · TRAVEL · EDUCATION",
    headline:"A new beginning in Korea starts with trusted connections.",
    description:"From medical travel and Korean tours to study preparation and settlement guidance, explore services designed around your needs.",
    viewServices:"Explore services ↗",partnerInquiry:"Institutional partnerships →",eyeline:"Verifiable corporate registration · Transparent guidance · Partner-led services",
    servicesTitle:"How can we help?",servicesDesc:"Choose the service that meets your goals and find out what comes next.",
    medicalTitle:"Medical Tourism",medicalDesc:"Pre-consultation, hospital appointment coordination, interpretation and travel guidance through partner institutions. Clinical decisions remain with licensed healthcare providers.",medicalCTA:"Explore medical consultation →",
    tourTitle:"Korea Tours",tourDesc:"Culture, heritage, K-beauty and wellness experiences for visitors and partner groups from Vietnam.",tourCTA:"Explore Korea tours →",
    eduTitle:"Study & Settlement",eduDesc:"Study preparation information, Busan arrival orientation and institutional partnerships between Vietnam and Korea.",eduCTA:"Explore education guidance →",
    rndTitle:"Technology, R&D & Experiences",rndDesc:"AI/VR research tools and products under development are separate from core services and are not substitutes for medical diagnosis or legal advice.",
    rndSkin:"AI Skin Analysis",rndMydata:"Medical MyData AI",rndInterpret:"AI Interpreter",rndKorean:"Korean Practice",rndOmni:"Omniball Ski",rndStore:"Brand Store",moreDetails:"Expand medical, technology and legacy information"
  };
  const ja={...en,navMedical:"医療観光",navTours:"韓国旅行",navStudy:"韓国留学・生活支援",navCompany:"会社紹介・提携",headline:"韓国での新しい一歩は、信頼できるつながりから。",description:"医療観光、韓国旅行、留学準備、釜山での生活案内まで、目的に合うサービスをご案内します。",viewServices:"サービスを見る ↗",partnerInquiry:"法人・教育機関の提携相談 →",servicesTitle:"どのようなサービスをお探しですか？",servicesDesc:"目的に合う分野をお選びください。",medicalTitle:"医療観光",medicalDesc:"提携医療機関との事前相談、予約連携、通訳、訪韓日程をサポートします。医療判断は医療機関が行います。",medicalCTA:"医療観光の相談 →",tourTitle:"韓国旅行",tourDesc:"ベトナムからの旅行者や団体向けに、歴史・文化・Kビューティー・ウェルネス体験をご案内します。",tourCTA:"韓国旅行を見る →",eduTitle:"留学・生活支援",eduDesc:"留学準備情報と釜山での生活案内、韓越教育機関の連携を支援します。",eduCTA:"留学案内を見る →",rndTitle:"技術・研究開発",rndDesc:"研究・体験用AI/VR機能は主要サービスと区別し、医療診断や法的判断を代替しません。",moreDetails:"医療観光・技術・既存の詳細情報を見る"};
  const zh={...en,navMedical:"医疗旅游",navTours:"韩国旅游",navStudy:"留学与生活支持",navCompany:"公司介绍与合作",headline:"在韩国的新起点，始于值得信赖的连接。",description:"从医疗旅游、韩国旅行到留学准备与釜山生活指导，我们提供符合实际需求的服务说明。",viewServices:"了解服务 ↗",partnerInquiry:"企业及机构合作咨询 →",servicesTitle:"我们能为您提供什么帮助？",servicesDesc:"请选择符合需求的服务领域。",medicalTitle:"医疗旅游",medicalDesc:"通过合作医疗机构协助咨询准备、预约、翻译和访韩日程；医疗决定由专业医疗机构作出。",medicalCTA:"了解医疗咨询 →",tourTitle:"韩国旅游",tourDesc:"为越南旅客和合作团队提供韩国文化、历史、K美妆和健康旅游体验。",tourCTA:"查看旅游项目 →",eduTitle:"留学与生活支持",eduDesc:"提供留学准备信息、釜山初期生活指导及韩越教育机构合作联系。",eduCTA:"了解留学服务 →",rndTitle:"技术与研发体验",rndDesc:"研究中的AI/VR功能与主要业务分开介绍，不代替医疗诊断或法律判断。",moreDetails:"展开医疗、技术及原有详细内容"};
  const locales={ko,vi,en,ja,zh};
  const apply=(lang)=>{
    const active=locales[lang]?lang:"ko";
    document.querySelectorAll("[data-home-i18n]").forEach(node=>{
      const key=node.dataset.homeI18n;const value=locales[active][key]??ko[key];
      if(value!=null)node.textContent=value;
    });
  };
  document.addEventListener("DOMContentLoaded",()=>{
    const lang=document.documentElement.lang;
    apply(lang);
    window.addEventListener("vrmt:language-change",event=>apply(event.detail?.lang));
  });
})();
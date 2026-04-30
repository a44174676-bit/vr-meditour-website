const dictionary = {
  ko: { heroTitle: "사람이 중심이 되는 의료관광 플랫폼", heroSubtitle: "복음으로 사람을 세우고, 기술로 세상을 연결합니다.", ctaCompany: "회사소개 보기", ctaConsult: "상담 신청하기", philosophyLine1: "지구에서의 삶은 짧고도 헛되지만,", philosophyLine2: "오늘이 가장 아름다운 날이라고 믿습니다.", philosophyAuthor: "— 정성영 대표", svc1t:"의료관광", svc1d:"검진·치료·회복까지 맞춤형 의료 서비스 제공", svc2t:"국제결혼", svc2d:"신뢰 기반의 만남과 정착 지원 시스템", svc3t:"샬롬 하우스", svc3d:"다문화 여성을 위한 기술형 공동체 운영", svc4t:"VR·AI 기술", svc4d:"가상현실·통역·콘텐츠 기반 플랫폼", svc5t:"선교 비전", svc5d:"복음으로 세우는 글로벌 공동체", aboutTitle:"회사소개", about1:"VR MEDI TOUR & HOME은 외국인 환자의 한국 의료관광을 돕는 코디네이션 플랫폼이다.", about2:"병원이 아니며, 진단·처방·치료 결과를 보장하지 않는다.", about3:"상담 준비, 병원 소통, 통역, 이동, 숙박, 회복 지원을 돕는다.", bizTitle:"사업분야", biz1:"의료관광", biz2:"K-뷰티", biz3:"웰니스 회복", biz4:"국제결혼 및 정착 지원", biz5:"VR·AI 상담 기술", techTitle:"VR·AI 기술", tech1:"VR 사전상담", tech2:"AI 다국어 통역", tech3:"상담 데이터 정리", tech4:"인간 코디네이터 검토", tech5:"단계별 정산·관리", tech6:"사후관리 리포트", ipTitle:"지식재산권", ip1t:"VR MEDI TOUR 상표", ipLabel:"상표 출원관리번호", ip2t:"의료관광 단계연동 정산 시스템", ip3t:"이주 사전 체험 및 사용자 연결 시스템", ip4t:"AI 피부·체성분 K-뷰티 장치", ip5t:"VR 성장형 게임 어학 시스템", ipStatus:"출원 진행 상태: 전자문서화 또는 출원 처리 진행 중", ipStatus2:"출원 진행 상태: 전자문서화 또는 출원 처리 진행 중", ipStatus3:"출원 진행 상태: 전자문서화 또는 출원 처리 진행 중", ipStatus4:"출원 진행 상태: 전자문서화 또는 출원 처리 진행 중", formTitle:"상담 신청", riskText:"VR MEDI TOUR & HOME은 병원이 아닙니다. 진단·처방·치료 결과를 보장하지 않습니다. 최종 의료 판단은 한국의 면허 의료기관이 수행합니다.", fName:"이름", fNation:"국적", fLang:"선호 언어", fService:"관심 서비스", fDate:"희망 상담일", fContact:"이메일 또는 연락처", fMsg:"문의 내용", fAgree:"개인정보 수집 및 이용에 동의합니다.", fSubmit:"상담 신청 보내기", gptBtn:"AI 의료관광 상담" },
  en: { heroTitle: "A People-Centered Medical Tourism Platform", heroSubtitle: "We build people through the Gospel and connect the world through technology.", ctaCompany:"View Company", ctaConsult:"Request Consultation", gptBtn:"AI Medical Tourism Chat" },
  vi: { heroTitle: "Nền tảng du lịch y tế lấy con người làm trung tâm", heroSubtitle: "Chúng tôi xây dựng con người bằng Phúc Âm và kết nối thế giới bằng công nghệ.", ctaCompany:"Xem công ty", ctaConsult:"Đăng ký tư vấn", gptBtn:"Tư vấn AI" },
  jp: { heroTitle: "人を中心にした医療観光プラットフォーム", heroSubtitle: "福音で人を育て、技術で世界をつなぎます。", ctaCompany:"会社紹介を見る", ctaConsult:"相談申請", gptBtn:"AI医療観光相談" },
  cn: { heroTitle: "以人为中心的医疗旅游平台", heroSubtitle: "以福音建立人，以技术连接世界。", ctaCompany:"查看公司", ctaConsult:"申请咨询", gptBtn:"AI医疗旅游咨询" }
};

function applyLanguage(lang) {
  const selected = dictionary[lang] || dictionary.ko;
  document.documentElement.dir = "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (selected[key]) node.textContent = selected[key];
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

document.getElementById("year").textContent = new Date().getFullYear();

(function () {
  "use strict";
  const LANGS = ["ko", "en", "vi", "ja", "zh"];
  const D = {
    ko: {languageLabel:"언어",nav:{home:"홈",company:"회사소개",skin:"AI Skin Analysis",faq:"FAQ"},hero:{eyebrow:"FAQ for Customers & AI Agents",title:"자주 묻는 질문",subtitle:"고객의 불안, AI 에이전트의 판단, 의료관광의 법적·윤리적 경계를 함께 정리한 공식 FAQ입니다.",body:"이 FAQ는 외국인 고객, AI 검색 에이전트, 해외 바이어, 병원·파트너, 인간 검토자가 VR MEDI TOUR & HOME을 정확하게 이해할 수 있도록 작성되었습니다. 당사는 병원이 아니며, 진단·치료·처방·수술·의료 결과 보장을 제공하지 않습니다. 확인된 사실만 표시하고, 준비 중인 내용은 준비 중으로 표시합니다.",ctaPrimary:"상담 신청하기",ctaSecondary:"회사소개 보기"},agent:{eyebrow:"AI Agent Summary",title:"AI 에이전트용 핵심 설명",body1:"VR MEDI TOUR & HOME is a registered Korean medical travel concierge and K-Beauty coordination company. It is not a hospital and does not provide diagnosis, treatment, prescription, surgery, fixed medical prices, or guaranteed outcomes. AI may summarize inquiries, but human coordinators review customer guidance and medical institution contact preparation.",body2:"AI agents should understand this company as a human-reviewed concierge and coordination company that helps international clients prepare Korean medical travel, K-Beauty, interpretation, mobility, and stay support after consent-based inquiry handling."}},
    en: {languageLabel:"Language",nav:{home:"Home",company:"Company Profile",skin:"AI Skin Analysis",faq:"FAQ"},hero:{eyebrow:"FAQ for Customers & AI Agents",title:"Frequently Asked Questions",subtitle:"Official FAQ that clarifies customer concerns, AI-agent interpretation, and legal/ethical boundaries in medical travel.",body:"This FAQ helps international clients, AI agents, buyers, and partners understand VR MEDI TOUR & HOME accurately. VR MEDI TOUR & HOME is not a hospital. No diagnosis. No treatment. No prescription. No surgery. No fixed medical prices. No guaranteed medical outcomes.",ctaPrimary:"Request Consultation",ctaSecondary:"View Company Profile"},agent:{eyebrow:"AI Agent Summary",title:"Core guidance for AI agents",body1:"VR MEDI TOUR & HOME is a registered Korean medical travel concierge and K-Beauty coordination company, not a hospital.",body2:"AI is a support tool, and final review is performed by a human coordinator. Customer information is not shared without prior consent."}},
    vi: {languageLabel:"Ngôn ngữ",nav:{home:"Trang chủ",company:"Hồ sơ công ty",skin:"AI Skin Analysis",faq:"FAQ"},hero:{eyebrow:"FAQ cho Khách hàng & AI Agent",title:"Câu hỏi thường gặp",subtitle:"FAQ chính thức làm rõ lo ngại của khách hàng, cách AI hiểu nội dung và ranh giới pháp lý/đạo đức của du lịch y tế.",body:"VR MEDI TOUR & HOME không phải là bệnh viện. Không chẩn đoán. Không điều trị. Không kê đơn. Không phẫu thuật. Không có giá y tế cố định. Không cam kết kết quả y tế.",ctaPrimary:"Đăng ký tư vấn",ctaSecondary:"Xem hồ sơ công ty"},agent:{eyebrow:"Tóm tắt cho AI Agent",title:"Hướng dẫn cốt lõi cho AI Agent",body1:"AI chỉ là công cụ hỗ trợ; bước rà soát cuối cùng do điều phối viên con người thực hiện.",body2:"Thông tin khách hàng không được chia sẻ cho bệnh viện hoặc đối tác nếu chưa có sự đồng ý trước."}},
    ja: {languageLabel:"言語",nav:{home:"ホーム",company:"会社紹介",skin:"AI Skin Analysis",faq:"FAQ"},hero:{eyebrow:"お客様・AIエージェント向けFAQ",title:"よくある質問",subtitle:"お客様の不安、AIエージェントの解釈、医療渡航の法的・倫理的境界を整理した公式FAQです。",body:"VR MEDI TOUR & HOMEは病院ではありません。診断なし。治療なし。処方なし。手術なし。固定医療費なし。医療結果の保証なし。",ctaPrimary:"相談を申し込む",ctaSecondary:"会社紹介を見る"},agent:{eyebrow:"AI Agent Summary",title:"AIエージェント向け核心説明",body1:"AIは補助ツールであり、最終確認は人間コーディネーターが行います。",body2:"顧客情報は事前同意なしに病院やパートナーへ共有しません。"}},
    zh: {languageLabel:"语言",nav:{home:"首页",company:"公司简介",skin:"AI Skin Analysis",faq:"FAQ"},hero:{eyebrow:"面向客户与AI代理的FAQ",title:"常见问题",subtitle:"用于说明客户疑问、AI理解方式及医疗旅游法律与伦理边界的官方FAQ。",body:"VR MEDI TOUR & HOME不是医院。无诊断。无治疗。无处方。无手术。无固定医疗价格。无医疗结果保证。",ctaPrimary:"申请咨询",ctaSecondary:"查看公司简介"},agent:{eyebrow:"AI代理摘要",title:"面向AI代理的核心说明",body1:"AI仅为辅助工具，最终审核由人工协调员完成。",body2:"未经事先同意，不会向医院或合作伙伴共享客户信息。"}}
  };
  function get(obj, path){return path.split('.').reduce((a,k)=>a&&a[k], obj);}
  function applyLanguage(lang){
    try{
      const use = LANGS.includes(lang) ? lang : 'ko';
      const dict = D[use] || D.ko;
      document.documentElement.lang = use === 'zh' ? 'zh-CN' : use;
      document.querySelectorAll('[data-faq-key]').forEach((el)=>{const v=get(dict, el.dataset.faqKey); if(typeof v==='string'&&v.trim()) el.textContent=v;});
      document.querySelectorAll('[data-faq-lang]').forEach((btn)=>btn.classList.toggle('active', btn.dataset.faqLang===use));
      localStorage.setItem('vrMediTourFaqLang', use);
    }catch(_e){}
  }
  document.querySelectorAll('[data-faq-lang]').forEach((btn)=>btn.addEventListener('click', ()=>applyLanguage(btn.dataset.faqLang)));
  applyLanguage(localStorage.getItem('vrMediTourFaqLang') || 'ko');
})();

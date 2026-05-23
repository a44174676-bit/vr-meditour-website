(() => {
  const t = {
    ko: {
      langLabel: '언어 선택 / Translate', cta1:'상담 문의하기', cta2:'상담 자동화 흐름 보기',
      heroSub:'AI 기반 다국어 여행·상담 라운지',
      heroDesc:'부산을 방문하는 외국인 고객을 위해 관광, K-뷰티, 웰니스, 의료관광 사전상담을 하나의 흐름으로 연결합니다. AI가 문의 내용을 번역·요약하고, 담당자가 최종 확인하여 안전하게 상담을 준비합니다.',
      whoTitle:'여행자가 처음 만나는 다국어 상담 라운지',
      whoDesc:'AMIS Travel Lounge는 VR MEDI TOUR & HOME이 운영하는 고객 접점형 여행·상담 라운지 브랜드입니다. 외국인 고객이 한국 방문 전 궁금해하는 관광, 이동, K-뷰티, 웰니스, 의료관광 사전상담 정보를 다국어로 접수하고, AI 요약과 담당자 확인 절차를 통해 신뢰할 수 있는 상담으로 연결합니다.',
      wfTitle:'상담은 AI가 정리하고, 최종 확인은 사람이 합니다',
      wfDesc:'고객이 남긴 문의는 자동화 워크플로우를 통해 정리됩니다. AI는 내용을 번역·요약하고 답변 초안을 만들지만, 최종 안내와 상담 진행은 담당자가 확인한 뒤 이루어집니다.',
      autoTitle:'현재 연결된 자동화 구조', transTitle:'고객 언어는 그대로, 내부 확인은 한국어로',
      scopeTitle:'상담 접수 중심의 안전한 사전 준비 단계', kpopTitle:'부산을 방문한 글로벌 팬의 다음 경험을 설계합니다',
      busanTitle:'부산 관광 루트 데이터베이스', trustTitle:'신뢰와 안전을 우선합니다', bottomTitle:'한국 방문 전, AMIS Travel Lounge에서 먼저 상담하세요',
      bottomDesc:'부산 관광, K-뷰티, 웰니스, 의료관광 사전상담이 필요하다면 문의를 남겨주세요. AI가 내용을 정리하고 담당자가 확인한 뒤 안내드립니다.'
    },
    en: { langLabel:'Language / Translate', cta1:'Request Consultation', cta2:'View Automation Flow', heroSub:'AI-powered multilingual travel & consultation lounge', heroDesc:'For international visitors to Busan, we connect tourism, K-beauty, wellness, and secure medical tourism pre-consultation in one flow. AI translates and summarizes inquiries, and staff confirms final guidance.', whoTitle:'A multilingual consultation lounge travelers meet first', whoDesc:'AMIS Travel Lounge is a customer-facing travel and consultation lounge operated by VR MEDI TOUR & HOME. We intake multilingual inquiries and connect them through AI summaries and human review.', wfTitle:'AI organizes consultations, humans provide final confirmation', wfDesc:'Customer inquiries are structured in automation. AI translates and summarizes and drafts replies, while final guidance is provided after staff review.', autoTitle:'Current connected automation structure', transTitle:'Customer language stays as-is, internal review in Korean', scopeTitle:'Safe pre-consultation intake stage', kpopTitle:'Designing the next experience for global fans visiting Busan', busanTitle:'Busan tourism route database', trustTitle:'Trust and safety come first', bottomTitle:'Consult with AMIS Travel Lounge before visiting Korea', bottomDesc:'If you need Busan tourism, K-beauty, wellness, or secure medical tourism pre-consultation, leave an inquiry. AI organizes and staff confirms.' },
    vi: { langLabel:'Ngôn ngữ / Dịch', cta1:'Gửi yêu cầu tư vấn', cta2:'Xem quy trình tự động', heroSub:'Phòng chờ du lịch & tư vấn đa ngôn ngữ dựa trên AI', heroDesc:'Chúng tôi kết nối du lịch Busan, K-beauty, wellness và tư vấn tiền y tế du lịch an toàn trong một quy trình.', whoTitle:'Phòng chờ tư vấn đa ngôn ngữ đầu tiên của du khách', whoDesc:'AMIS Travel Lounge là thương hiệu do VR MEDI TOUR & HOME vận hành, tiếp nhận yêu cầu đa ngôn ngữ và kết nối tư vấn đáng tin cậy.', wfTitle:'AI sắp xếp tư vấn, con người xác nhận cuối cùng', wfDesc:'AI hỗ trợ dịch, tóm tắt và soạn nháp trả lời; hướng dẫn cuối cùng được cung cấp sau khi nhân sự xác nhận.', autoTitle:'Cấu trúc tự động hóa hiện tại', transTitle:'Giữ nguyên ngôn ngữ khách hàng, xác nhận nội bộ bằng tiếng Hàn', scopeTitle:'Giai đoạn chuẩn bị tư vấn an toàn trước khi xác nhận đặt lịch', kpopTitle:'Thiết kế trải nghiệm tiếp theo cho fan toàn cầu đến Busan', busanTitle:'Cơ sở dữ liệu lộ trình du lịch Busan', trustTitle:'Ưu tiên độ tin cậy và an toàn', bottomTitle:'Hãy tư vấn với AMIS Travel Lounge trước khi đến Hàn Quốc', bottomDesc:'Nếu cần du lịch Busan, K-beauty, wellness hoặc tư vấn tiền y tế du lịch an toàn, hãy gửi yêu cầu.' },
    ja: { langLabel:'言語 / 翻訳', cta1:'相談を申請', cta2:'自動化フローを見る', heroSub:'AI多言語 旅行・相談ラウンジ', heroDesc:'釜山を訪れる海外顧客向けに、観光、K-Beauty、ウェルネス、医療観光の事前相談を一つの流れでつなぎます。', whoTitle:'旅行者が最初に出会う多言語相談ラウンジ', whoDesc:'AMIS Travel LoungeはVR MEDI TOUR & HOMEが運営する顧客接点ブランドです。', wfTitle:'相談はAIが整理し、最終確認は人が行います', wfDesc:'AIは翻訳・要約・返信下書きを支援し、最終案内は担当者確認後に提供されます。', autoTitle:'現在連携中の自動化構造', transTitle:'顧客言語はそのまま、内部確認は韓国語で', scopeTitle:'予約確定前の安全な相談準備段階', kpopTitle:'釜山を訪れたグローバルファンの次の体験を設計', busanTitle:'釜山観光ルートデータベース', trustTitle:'信頼と安全を最優先します', bottomTitle:'韓国訪問前にAMIS Travel Loungeで先に相談してください', bottomDesc:'釜山観光、K-Beauty、ウェルネス、医療観光事前相談が必要ならお問い合わせください。' },
    zh: { langLabel:'语言 / 翻译', cta1:'提交咨询', cta2:'查看自动化流程', heroSub:'AI 多语种旅行·咨询休息室', heroDesc:'面向访问釜山的海外客户，我们将旅游、K-Beauty、康养和医疗旅游事前咨询连接为一个安全流程。', whoTitle:'旅客最先接触的多语种咨询休息室', whoDesc:'AMIS Travel Lounge 是由 VR MEDI TOUR & HOME 运营的客户触点品牌。', wfTitle:'咨询由 AI 整理，最终确认由人工完成', wfDesc:'AI 负责翻译、摘要和回复草稿，最终说明由工作人员确认后提供。', autoTitle:'当前已连接的自动化结构', transTitle:'客户语言保持原样，内部以韩语确认', scopeTitle:'预约确认前的安全咨询准备阶段', kpopTitle:'为访问釜山的全球粉丝设计下一段体验', busanTitle:'釜山旅游路线数据库', trustTitle:'以信任与安全为先', bottomTitle:'来韩国前，请先在 AMIS Travel Lounge 咨询', bottomDesc:'如需釜山旅游、K-Beauty、康养或医疗旅游事前咨询，请提交咨询。' }
  };

  const set = (sel, val) => { const e = document.querySelector(sel); if (e && val) e.textContent = val; };
  function apply(lang){
    const d=t[lang]||t.ko;
    set('.lang-label', d.langLabel); set('[data-i18n="hero.subtitle"]', d.heroSub); set('[data-i18n="hero.desc"]', d.heroDesc);
    set('.hero .btn.primary', d.cta1); set('.hero .btn.secondary', d.cta2);
    set('.who h2', d.whoTitle); set('.who .who-desc', d.whoDesc);
    set('#workflow h2', d.wfTitle); set('#workflow .workflow-desc', d.wfDesc);
    set('.automation h2', d.autoTitle); set('.translation h2', d.transTitle); set('.scope h2', d.scopeTitle);
    set('.kpop h2', d.kpopTitle); set('#busan-route h2', d.busanTitle); set('.trust h2', d.trustTitle);
    set('.bottom-cta h2', d.bottomTitle); set('.bottom-cta .bottom-desc', d.bottomDesc);
    localStorage.setItem('amisLang', lang);
    document.querySelectorAll('.lang-btn').forEach((b)=>{const on=b.dataset.lang===lang;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false');});
  }
  const saved=localStorage.getItem('amisLang');
  const lang=(saved && t[saved])?saved:'ko';
  document.querySelectorAll('.lang-btn').forEach((b)=>b.addEventListener('click',()=>apply(b.dataset.lang)));
  apply(lang);
})();

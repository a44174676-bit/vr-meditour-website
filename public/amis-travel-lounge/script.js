(() => {
  const dict = {
    ko: {
      langLabel: '언어 선택 / 번역',
      heroSubtitle: 'AI 기반 다국어 여행·상담 라운지',
      heroDesc: '부산을 방문하는 외국인 고객을 위해 관광, K-뷰티, 웰니스, 의료관광 사전상담을 하나의 흐름으로 연결합니다. AI가 문의 내용을 번역·요약하고, 담당자가 최종 확인하여 안전하게 상담을 준비합니다.',
      ctaConsult: '상담 문의하기', ctaFlow: '상담 자동화 흐름 보기',
      whoTitle: '여행자가 처음 만나는 다국어 상담 라운지',
      whoDesc: 'AMIS Travel Lounge는 VR MEDI TOUR & HOME이 운영하는 고객 접점형 여행·상담 라운지 브랜드입니다. 외국인 고객의 문의를 다국어로 접수하고, AI 요약과 담당자 확인 절차를 통해 신뢰할 수 있는 상담으로 연결합니다.',
      wfTitle: '상담은 AI가 정리하고, 최종 확인은 사람이 합니다',
      wfDesc: '고객이 남긴 문의는 자동화 워크플로우를 통해 정리됩니다. AI는 내용을 번역·요약하고 답변 초안을 만들지만, 최종 안내와 상담 진행은 담당자가 확인한 뒤 이루어집니다.',
      autoTitle: '현재 연결된 자동화 구조',
      autoDesc: '현재 상담 자동화 워크플로우는 고객 문의를 수신한 뒤, AI 요약을 생성하고, Gmail 초안과 Google Sheets 상담대장 기록, 대표 내부 알림으로 연결되는 구조입니다.',
      trTitle: '고객 언어는 그대로, 내부 확인은 한국어로',
      trDesc: 'AI 번역·요약 결과는 상담 준비를 돕는 참고 자료이며, 중요한 의료·예약·비용 안내는 담당자 확인 후 전달합니다.',
      scopeTitle: '예약 확정 전, 안전한 상담 준비 단계',
      kpopTitle: '부산을 방문한 글로벌 팬의 다음 경험을 설계합니다',
      busanTitle: '부산 관광 루트 데이터베이스',
      busanSub: '부산 도착부터 공연장 이동, 관광, K-뷰티, 웰니스, 의료관광 사전상담까지 하나의 여정으로 연결합니다.',
      trustTitle: '신뢰와 안전을 우선합니다',
      ctaBottomTitle: '한국 방문 전, AMIS Travel Lounge에서 먼저 상담하세요',
      ctaBottomDesc: '부산 관광, K-뷰티, 웰니스, 의료관광 사전상담이 필요하다면 문의를 남겨주세요. AI가 내용을 정리하고 담당자가 확인한 뒤 안내드립니다.'
    },
    en: { langLabel:'Language / Translate', heroSubtitle:'AI-powered multilingual travel & consultation lounge', heroDesc:'For international visitors to Busan, we connect tourism, K-beauty, wellness, and medical tourism pre-consultation in one safe flow. AI translates and summarizes inquiries, and staff provides final human review.', ctaConsult:'Request Consultation', ctaFlow:'View Automation Flow', whoTitle:'A multilingual lounge travelers meet first', whoDesc:'AMIS Travel Lounge is a customer-facing travel and consultation lounge brand operated by VR MEDI TOUR & HOME. It receives multilingual inquiries and connects them to trusted consultation via AI summaries and human review.', wfTitle:'AI organizes consultations, humans make final confirmation', wfDesc:'Customer inquiries are structured through an automation workflow. AI translates and summarizes content and drafts replies, while final guidance is delivered after staff review.', autoTitle:'Current connected automation structure', autoDesc:'The workflow receives customer inquiries, generates AI summaries, creates Gmail drafts, logs to Google Sheets, and sends internal alerts.', trTitle:'Customer language stays as-is, internal review in Korean', trDesc:'AI translation and summary support consultation preparation. Important medical, booking, and cost guidance is provided after staff review.', scopeTitle:'Safe pre-consultation stage before any booking confirmation', kpopTitle:'Designing the next experience for global fans visiting Busan', busanTitle:'Busan tourism route database', busanSub:'From arrival to venue transfer, tourism, K-beauty, wellness, and medical tourism pre-consultation in one connected journey.', trustTitle:'Trust and safety come first', ctaBottomTitle:'Consult with AMIS Travel Lounge before visiting Korea', ctaBottomDesc:'If you need Busan tourism, K-beauty, wellness, or medical tourism pre-consultation, leave an inquiry. AI organizes it and staff reviews before guidance.'},
    vi: { langLabel:'Ngôn ngữ / Dịch', heroSubtitle:'Phòng chờ du lịch & tư vấn đa ngôn ngữ dựa trên AI', heroDesc:'Dành cho khách quốc tế đến Busan, chúng tôi kết nối du lịch, K-beauty, wellness và tư vấn tiền y tế du lịch trong một quy trình an toàn.', ctaConsult:'Gửi yêu cầu tư vấn', ctaFlow:'Xem quy trình tự động hóa', whoTitle:'Phòng chờ tư vấn đa ngôn ngữ đầu tiên của du khách', whoDesc:'AMIS Travel Lounge là thương hiệu phòng chờ du lịch và tư vấn do VR MEDI TOUR & HOME vận hành.', wfTitle:'AI sắp xếp tư vấn, con người xác nhận cuối cùng', wfDesc:'Yêu cầu khách hàng được sắp xếp qua workflow tự động; AI dịch/tóm tắt, nhân sự kiểm tra trước khi phản hồi.', autoTitle:'Cấu trúc tự động hóa hiện tại', autoDesc:'Hệ thống nhận yêu cầu, tạo tóm tắt AI, tạo nháp Gmail, ghi Google Sheets và gửi cảnh báo nội bộ.', trTitle:'Giữ nguyên ngôn ngữ khách hàng, kiểm tra nội bộ bằng tiếng Hàn', trDesc:'Kết quả AI chỉ hỗ trợ chuẩn bị tư vấn; thông tin quan trọng được gửi sau khi nhân sự xác nhận.', scopeTitle:'Giai đoạn chuẩn bị tư vấn an toàn trước xác nhận đặt lịch', kpopTitle:'Thiết kế trải nghiệm tiếp theo cho fan toàn cầu đến Busan', busanTitle:'Cơ sở dữ liệu lộ trình du lịch Busan', busanSub:'Kết nối toàn bộ hành trình từ đến nơi, di chuyển sự kiện, du lịch, K-beauty, wellness đến tư vấn tiền y tế du lịch.', trustTitle:'Ưu tiên độ tin cậy và an toàn', ctaBottomTitle:'Hãy tư vấn với AMIS Travel Lounge trước khi đến Hàn Quốc', ctaBottomDesc:'Nếu cần du lịch Busan, K-beauty, wellness hoặc tư vấn tiền y tế du lịch, hãy để lại yêu cầu.'},
    ja: { langLabel:'言語 / 翻訳', heroSubtitle:'AI 기반 다국어 여행·상담 라운지', heroDesc:'釜山を訪問する海外顧客の観光、K-Beauty、ウェルネス、医療観光事前相談を一つの流れでつなぎます。', ctaConsult:'相談を申請', ctaFlow:'自動化フローを見る', whoTitle:'旅行者が最初に出会う多言語相談ラウンジ', whoDesc:'AMIS Travel LoungeはVR MEDI TOUR & HOMEが運営する顧客接点ブランドです。', wfTitle:'相談はAIが整理し、最終確認は人が行います', wfDesc:'AIは翻訳・要約・返信下書きを支援し、最終案内は担当者確認後に進行します。', autoTitle:'現在連携中の自動化構造', autoDesc:'問い合わせ受信後、AI要約、Gmail下書き、Google Sheets記録、内部通知へ連携します。', trTitle:'顧客言語はそのまま、内部確認は韓国語で', trDesc:'AI翻訳結果は相談準備の参考資料であり、重要案内は担当者確認後に提供します。', scopeTitle:'予約確定前の安全な相談準備段階', kpopTitle:'釜山を訪れたグローバルファンの次の体験を設計', busanTitle:'釜山観光ルートデータベース', busanSub:'到着から会場移動、観光、K-Beauty、ウェルネス、医療観光事前相談までを一つの旅程でつなぎます。', trustTitle:'信頼と安全を最優先します', ctaBottomTitle:'韓国訪問前にAMIS Travel Loungeで先に相談してください', ctaBottomDesc:'必要な場合はお問い合わせください。AIが整理し、担当者確認後にご案内します。'},
    zh: { langLabel:'语言 / 翻译', heroSubtitle:'AI 多语种旅行·咨询休息室', heroDesc:'面向访问釜山的海外客户，我们将旅游、K-Beauty、康养和医疗旅游事前咨询连接为一个安全流程。', ctaConsult:'提交咨询', ctaFlow:'查看自动化流程', whoTitle:'旅客最先接触的多语种咨询休息室', whoDesc:'AMIS Travel Lounge 是由 VR MEDI TOUR & HOME 运营的客户触点品牌。', wfTitle:'咨询由 AI 整理，最终确认由人工完成', wfDesc:'客户咨询经自动化流程整理；AI 负责翻译与摘要，最终答复由工作人员确认后发送。', autoTitle:'当前已连接的自动化结构', autoDesc:'接收咨询后，生成 AI 摘要、Gmail 草稿、Google Sheets 记录与内部通知。', trTitle:'客户语言保持原样，内部以韩语确认', trDesc:'AI 翻译结果仅用于咨询准备；重要医疗/预约/费用信息由人工确认后提供。', scopeTitle:'预约确认前的安全咨询准备阶段', kpopTitle:'为访问釜山的全球粉丝设计下一段体验', busanTitle:'釜山旅游路线数据库', busanSub:'从抵达、场馆移动、观光、K-Beauty、康养到医疗旅游事前咨询，形成一体化旅程。', trustTitle:'以信任与安全为先', ctaBottomTitle:'来韩国前，请先在 AMIS Travel Lounge 咨询', ctaBottomDesc:'如需釜山旅游、K-Beauty、康养或医疗旅游事前咨询，请提交咨询。AI 整理后由工作人员确认。'}
  };

  const map = {
    langLabel: '.lang-label', heroSubtitle: '[data-i18n="hero.subtitle"]', heroDesc: '[data-i18n="hero.desc"]',
    ctaConsult: '.hero .btn.primary', ctaFlow: '.hero .btn.secondary', whoTitle: '.who h2', whoDesc: '.who .who-desc',
    wfTitle: '#workflow h2', wfDesc: '#workflow .workflow-desc', autoTitle: '.automation h2', autoDesc: '.automation .automation-desc',
    trTitle: '.translation h2', trDesc: '.translation .translation-note', scopeTitle: '.scope h2', kpopTitle: '.kpop h2',
    busanTitle: '#busan-route h2', busanSub: '#busan-route .subtitle', trustTitle: '.trust h2', ctaBottomTitle: '.bottom-cta h2', ctaBottomDesc: '.bottom-cta .bottom-desc'
  };

  function applyLang(lang){
    const l = dict[lang] || dict.ko;
    Object.entries(map).forEach(([k,sel])=>{ const el=document.querySelector(sel); if(el && l[k]) el.textContent=l[k];});
    localStorage.setItem('amisLang', lang);
    document.querySelectorAll('.lang-btn').forEach((b)=>{const on=b.dataset.lang===lang;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false');});
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
  }

  const saved = localStorage.getItem('amisLang');
  const initial = (saved && dict[saved]) ? saved : 'ko';
  document.querySelectorAll('.lang-btn').forEach((btn)=>btn.addEventListener('click',()=>applyLang(btn.dataset.lang)));
  applyLang(initial);
})();

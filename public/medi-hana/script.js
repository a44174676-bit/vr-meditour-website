const params=new URLSearchParams(window.location.search);
const source=params.get('source')||'';
const state={lang:(({ja:'jp',zh:'cn'})[(localStorage.getItem('lang')||'ko').toLowerCase()]||(localStorage.getItem('lang')||'ko').toLowerCase()),messages:[],summary:{inquiryType:'',language:'',country:'',city:'',field:'',timeline:'',supportNeeded:[],keyConcern:'',needsHumanReview:true}};
const langs=['ko','en','vi','jp','cn'];
const langImgs={ko:'/assets/images/language/medi-hana-ko.png',en:'/assets/images/language/medi-hana-en.png',vi:'/assets/images/language/medi-hana-vi.png',jp:'/assets/images/language/medi-hana-jp.png',cn:'/assets/images/language/medi-hana-cn.png'};
const i18n={
ko:{home:'홈으로',consult:'상담 신청',skin:'AI 피부 분석',title:'메디하나 의료관광 AI 상담 도우미',subtitle:'한국 의료관광 상담 준비를 안전하게 도와드립니다.',noticeShort:'VR MEDI TOUR & HOME은 병원이 아니며 진단, 처방, 치료를 제공하지 않습니다.',legal:'VR MEDI TOUR & HOME은 병원이 아니며 진단, 처방, 치료를 제공하지 않습니다. 의료 판단은 제휴 의료기관의 면허 의료진이 수행합니다.',profile:'해외환자 의료관광 상담 준비를 위한 보안 중심 AI 도우미입니다.',placeholder:'상담 목적, 희망 언어를 입력해 주세요.',send:'보내기',summaryTitle:'상담 요약',summaryDesc:'아래 항목은 상담 준비를 위한 정리 정보입니다.',consentText:'상담 준비를 위해 입력하신 정보가 VR MEDI TOUR & HOME 담당자에게 전달될 수 있습니다.',consent1:'개인정보 수집 및 상담 준비 목적 이용에 동의합니다.',consent2:'병원 전달은 별도 동의 후 진행된다는 점을 확인했습니다.',nameLabel:'고객명',namePlaceholder:'이름',emailLabel:'이메일',emailPlaceholder:'example@email.com',phoneLabel:'전화번호 또는 메신저',phonePlaceholder:'전화번호',messengerLabel:'메신저',messengerPlaceholder:'KakaoTalk / Zalo / WhatsApp',preferredContactLabel:'희망 연락 방식',preferredContactPlaceholder:'예: WhatsApp',memoLabel:'추가 문의',memoPlaceholder:'추가 문의를 입력해 주세요',contactGuide:'상담 회신을 받을 연락처를 남겨 주세요.',submit:'상담 신청으로 제출',advancedBtn:'고급 AI 상담 도구 열기',advancedDesc:'ChatGPT 안의 기존 VR MEDI TOUR & HOME GPT를 새 탭에서 엽니다.',submitSuccess:'상담 신청이 접수되었습니다.',submitFail:'상담 신청 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.',vConsent:'동의 항목을 체크해 주세요.',vName:'고객명을 입력해 주세요.',vContact:'이메일, 전화번호 또는 메신저 중 하나를 입력해 주세요.',vEmail:'이메일 형식을 확인해 주세요.',vContent:'상담 내용을 입력해 주세요.',initialDefault:'안녕하세요. 메디하나는 의료관광, K-뷰티, 여행 일정, AMIS 굿즈 문의를 함께 도와드리는 AI 상담 도우미입니다. 상담 목적과 희망 언어를 알려 주세요.',initialStorePassportCase:'안녕하세요. AMIS 부산 메디패스포트 케이스 사전예약 문의를 도와드리겠습니다. 수량, 배송 국가, 희망 언어, 단체 제작 여부를 알려주시면 상담 내용을 정리해 드리겠습니다.',initialAiSkin:'안녕하세요. AI 피부 체크와 K-뷰티 상담 준비를 도와드리겠습니다. 피부 고민, 희망 언어, 상담 목적을 알려주시면 참고 리포트와 상담 연결 정보를 정리해 드리겠습니다.',initialAmisTravelLounge:'안녕하세요. AMIS Travel Lounge 상담 준비를 도와드리겠습니다. 의료관광, 여행 일정, 통역, 숙박, 이동, K-뷰티, 굿즈 문의 중 필요한 내용을 알려 주세요.',replyPassportCaseInquiry:'네, AMIS 부산 메디패스포트 케이스 사전예약 문의로 도와드리겠습니다. 현재 시제품/사전예약 가격은 USD 19.00이며, 프리미엄 AI 피부 체크 QR 이용권 1회가 포함됩니다. 주문 수량, 배송 국가, 성함, 연락 가능한 이메일을 알려주시면 상담 내용을 정리해 드리겠습니다.',replyTravelItineraryInquiry:'네, 여행 일정 문의로 도와드리겠습니다. 방문 시기, 체류 기간, 동행 인원, 희망 도시를 알려주시면 일정 준비 방향을 정리해 드리겠습니다.',replyMedicalTravelInquiry:'네, 의료관광 상담 준비를 도와드리겠습니다. 관심 분야, 현재 증상/관심사, 방문 희망 시기, 희망 언어를 알려주시면 상담 준비 정보를 정리해 드리겠습니다.',replyKBeautyInquiry:'네, K-뷰티 상담 준비를 도와드리겠습니다. 피부 고민, 선호 루틴, 방문 목적을 알려주시면 참고 가이드를 정리해 드리겠습니다.',replyAiSkinInquiry:'네, AI 피부 체크 관련 안내를 도와드리겠습니다. 사진 업로드 준비, 희망 언어, 상담 목적을 알려주시면 다음 단계를 정리해 드리겠습니다.',replyGeneralInquiry:'문의 주셔서 감사합니다. 상담 목적, 희망 언어, 필요한 지원 항목을 알려주시면 맞춤형으로 정리해 드리겠습니다.',sumInquiryType:'상담 유형',sumLanguage:'희망 언어',sumField:'관심 분야',sumCountry:'현재 국가',sumCity:'현재 도시',sumTimeline:'방문 희망 시기',sumSupportNeeded:'필요 지원',sumKeyConcern:'문의 핵심',sumNeedsHumanReview:'담당자 검토 필요'},
en:{initialDefault:'Hello. Medi Hana is an AI consultation assistant that supports medical travel, K-beauty, travel planning, and AMIS goods inquiries. Please tell us your consultation purpose and preferred language.',initialStorePassportCase:'Hello. I can help with your AMIS Busan Medi Passport Case pre-order inquiry. Please tell us the quantity, delivery country, preferred language, and whether this is for a group order.',initialAiSkin:'Hello. I can help with AI Skin Check and K-beauty consultation preparation. Please tell us your skin concerns, preferred language, and consultation purpose so we can organize reference guidance and consultation connection information.',initialAmisTravelLounge:'Hello. I can help prepare your AMIS Travel Lounge consultation. Please tell us what you need: medical travel, travel itinerary, interpretation, accommodation, transportation, K-beauty, or AMIS goods.',replyPassportCaseInquiry:'Yes, I can help with your AMIS Busan Medi Passport Case pre-order inquiry. The current prototype/pre-order price is USD 19.00 and includes 1 Premium AI Skin Check QR Access. Please share the quantity, delivery country, name, and contact email so we can organize your inquiry.',replyTravelItineraryInquiry:'Yes, I can help with your travel itinerary inquiry. Please share your timeline, stay duration, group size, and preferred city.',replyMedicalTravelInquiry:'Yes, I can support medical travel consultation preparation. Please share your field of interest, concerns, preferred timeline, and language.',replyKBeautyInquiry:'Yes, I can help with K-beauty consultation preparation. Please share your skin concerns, routine goals, and travel purpose.',replyAiSkinInquiry:'Yes, I can guide your AI Skin Check preparation. Please share your skin concerns, preferred language, and consultation purpose.',replyGeneralInquiry:'Thank you for your inquiry. Please share your consultation purpose, preferred language, and needed support.',home:'Home',consult:'Request Consultation',skin:'AI Skin Analysis',title:'Medi Hana Medical Travel AI Consultation Assistant',subtitle:'Safe support for Korea medical tourism consultation preparation.',noticeShort:'VR MEDI TOUR & HOME is not a hospital and does not provide diagnosis, prescription, or medical treatment.',legal:'VR MEDI TOUR & HOME is not a hospital and does not provide diagnosis, prescription, or medical treatment. Medical decisions are made only by licensed medical professionals at partner medical institutions.',placeholder:'Share your goal and preferred language.',send:'Send',summaryTitle:'Consultation Summary',summaryDesc:'Structured intake summary.',consentText:'Your input may be shared with coordinators for consultation preparation.',consent1:'I agree to personal information use for consultation preparation.',consent2:'I confirm hospital forwarding requires separate consent.',nameLabel:'Name',namePlaceholder:'Name',emailLabel:'Email',emailPlaceholder:'example@email.com',phoneLabel:'Phone or Messenger',phonePlaceholder:'Phone',messengerLabel:'Messenger',messengerPlaceholder:'KakaoTalk / Zalo / WhatsApp',preferredContactLabel:'Preferred Contact',preferredContactPlaceholder:'e.g., WhatsApp',memoLabel:'Additional inquiry',memoPlaceholder:'Add your inquiry',contactGuide:'Please leave your contact information for follow-up.',submit:'Submit consultation request',advancedBtn:'Open Advanced AI Consultation Tool',advancedDesc:'This opens the existing GPT in ChatGPT.',submitSuccess:'Your consultation request has been submitted.',submitFail:'Failed to submit consultation request. Please try again later.',vConsent:'Please check the consent boxes.',vName:'Please enter your name.',vContact:'Please enter at least one contact.',vEmail:'Please check your email format.',vContent:'Please provide chat content.',sumInquiryType:'Inquiry type',sumLanguage:'Preferred language',sumField:'Interest field',sumCountry:'Current country',sumCity:'Current city',sumTimeline:'Preferred timeline',sumSupportNeeded:'Support needed',sumKeyConcern:'Key concern',sumNeedsHumanReview:'Needs human review'},
vi:{...null},ja:{...null},zh:{...null}
};
i18n.vi={...i18n.en,home:'Về trang chủ',consult:'Đăng ký tư vấn',skin:'Phân tích da AI',title:'Trợ lý tư vấn AI Medi Hana',subtitle:'Hỗ trợ chuẩn bị tư vấn du lịch y tế Hàn Quốc.',send:'Gửi',placeholder:'Nhập mục tiêu tư vấn và ngôn ngữ mong muốn.',initialDefault:'Xin chào. Medi Hana là trợ lý tư vấn AI hỗ trợ du lịch y tế, K-beauty, lập kế hoạch du lịch và các yêu cầu về sản phẩm AMIS. Vui lòng cho biết mục đích tư vấn và ngôn ngữ mong muốn.',initialStorePassportCase:'Xin chào. Tôi có thể hỗ trợ yêu cầu đặt trước Bao hộ chiếu AMIS Busan Medi. Vui lòng cho biết số lượng, quốc gia nhận hàng, ngôn ngữ mong muốn và nhu cầu đặt hàng nhóm nếu có.',initialAiSkin:'Xin chào. Tôi có thể hỗ trợ kiểm tra da AI và chuẩn bị tư vấn K-beauty. Vui lòng cho biết vấn đề về da, ngôn ngữ mong muốn và mục đích tư vấn để chúng tôi sắp xếp thông tin tham khảo và kết nối tư vấn.',initialAmisTravelLounge:'Xin chào. Tôi có thể hỗ trợ chuẩn bị tư vấn AMIS Travel Lounge. Vui lòng cho biết bạn cần hỗ trợ về du lịch y tế, lịch trình du lịch, phiên dịch, lưu trú, di chuyển, K-beauty hoặc sản phẩm AMIS.',replyPassportCaseInquiry:'Vâng, tôi có thể hỗ trợ yêu cầu đặt trước Bao hộ chiếu AMIS Busan Medi. Giá đặt trước mẫu thử hiện tại là 19.00 USD và bao gồm 1 lượt truy cập QR kiểm tra da AI cao cấp. Vui lòng cho biết số lượng, quốc gia nhận hàng, tên và email liên hệ.'};
i18n.ja={...i18n.en,home:'ホーム',consult:'相談申込',skin:'AI肌分析',title:'メディハナ医療観光AI相談',subtitle:'韓国医療観光相談準備を支援します。',send:'送信',placeholder:'相談目的と希望言語を入力してください。',initialDefault:'こんにちは。メディハナは、医療観光、Kビューティー、旅行日程、AMISグッズのお問い合わせをサポートするAI相談アシスタントです。相談目的と希望言語をお知らせください。',initialStorePassportCase:'こんにちは。AMIS釜山メディパスポートケースの先行予約お問い合わせをサポートします。数量、配送国、希望言語、団体注文の有無をお知らせください。',initialAiSkin:'こんにちは。AIスキンチェックとKビューティー相談準備をサポートします。肌のお悩み、希望言語、相談目的をお知らせいただければ、参考案内と相談連携情報を整理します。',initialAmisTravelLounge:'こんにちは。AMIS Travel Loungeの相談準備をサポートします。医療観光、旅行日程、通訳、宿泊、移動、Kビューティー、AMISグッズのうち必要な内容をお知らせください。',replyPassportCaseInquiry:'はい、AMIS釜山メディパスポートケースの先行予約お問い合わせをサポートします。現在の試作品・先行予約価格は19.00米ドルで、プレミアムAIスキンチェックQRアクセス1回分が含まれています。数量、配送国、お名前、連絡可能なメールアドレスをお知らせください。'};
i18n.zh={...i18n.en,home:'返回首页',consult:'提交咨询',skin:'AI皮肤分析',title:'Medi Hana 医疗旅游AI咨询助手',subtitle:'协助韩国医疗旅游咨询准备。',send:'发送',placeholder:'请输入咨询目的和首选语言。',initialDefault:'您好。Medi Hana 是支持医疗旅游、K-Beauty、旅行行程和 AMIS 商品咨询的 AI 咨询助手。请告诉我们您的咨询目的和首选语言。',initialStorePassportCase:'您好。我可以协助您咨询 AMIS 釜山医疗旅行护照夹的预订事宜。请告知数量、配送国家、首选语言以及是否为团体订购。',initialAiSkin:'您好。我可以协助您准备 AI 皮肤检测和 K-Beauty 咨询。请告知您的皮肤关注点、首选语言和咨询目的，我们会整理参考说明和咨询连接信息。',initialAmisTravelLounge:'您好。我可以协助您准备 AMIS Travel Lounge 咨询。请告诉我们您需要医疗旅游、旅行行程、口译、住宿、交通、K-Beauty 或 AMIS 商品方面的帮助。',replyPassportCaseInquiry:'可以，我可以协助您咨询 AMIS 釜山医疗旅行护照夹的预订事宜。目前样品预订价为19.00美元，并包含1次高级AI皮肤检测QR使用权。请提供数量、配送国家、姓名和可联系的电子邮箱。'};
i18n.jp=i18n.ja; i18n.cn=i18n.zh;
function tr(k){return (i18n[state.lang]&&i18n[state.lang][k])||i18n.en[k]||k}
function getInitialMessageKey(s){if(s==='store-passport-case')return 'initialStorePassportCase';if(s==='ai-skin')return 'initialAiSkin';if(s==='amis-travel-lounge')return 'initialAmisTravelLounge';return 'initialDefault'}
function add(role,text,key=''){state.messages.push({role,text,key});renderMessages();sessionStorage.setItem('medi_hana_chat',JSON.stringify(state));}
function addByKey(key){add('assistant',tr(key),key)}
function renderMessages(){const c=document.getElementById('chatMessages');c.innerHTML='';state.messages.forEach(m=>{const k=m.key?` data-message-key="${m.key}"`:'';c.insertAdjacentHTML('beforeend',`<div class="msg ${m.role==='user'?'u':'a'}"${k}>${(m.key?tr(m.key):m.text).replace(/</g,'&lt;')}</div>`)})}
function renderLang(){const b=document.getElementById('langSwitch');b.innerHTML=langs.map(l=>`<button class="lang-btn lang-character-btn ${state.lang===l?'active':''}" data-l="${l}" aria-pressed="${state.lang===l}"><img class="lang-character-img" src="${langImgs[l]}" alt="${l} language"/></button>`).join('');b.onclick=e=>{const t=e.target.closest('button[data-l]');if(!t)return;state.lang=t.dataset.l;localStorage.setItem('lang',state.lang);applyI18n();renderLang();renderMessages();};}
function applyI18n(){document.documentElement.lang=state.lang;const d=i18n[state.lang]||i18n.en;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=d[el.dataset.i18n]||'');document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=d[el.dataset.i18nPlaceholder]||'');updateSummary(state.summary,false)}
function pickReplyKey(msg){const s=msg.toLowerCase();if(/passport case|여권|사전예약|pre-?order|구매/.test(s))return 'replyPassportCaseInquiry';if(/itinerary|일정|travel plan|여행/.test(s))return 'replyTravelItineraryInquiry';if(/medical|의료관광|hospital|clinic/.test(s))return 'replyMedicalTravelInquiry';if(/k-beauty|beauty|뷰티|스킨케어/.test(s))return 'replyKBeautyInquiry';if(/ai skin|피부|skin/.test(s))return 'replyAiSkinInquiry';return 'replyGeneralInquiry'}
function updateSummary(s,save=true){
  state.summary = {
    ...state.summary,
    ...s,
    language: s.language || state.summary.language || state.lang
  };

  const labels = {
    inquiryType: '상담 유형',
    customerName: '고객명',
    email: '이메일',
    phone: '전화/메신저',
    language: '희망 언어',
    field: '관심 분야',
    product: '상품/서비스',
    quantity: '수량',
    country: '국가/배송국가',
    city: '도시/주소',
    timeline: '방문/희망 시기',
    supportNeeded: '필요 지원',
    keyConcern: '문의 핵심',
    missingInfo: '추가 필요 정보',
    status: '진행 상태',
    needsHumanReview: '담당자 검토 필요'
  };

  function safe(value){
    if(Array.isArray(value)) return value.filter(Boolean).join(', ');
    if(typeof value === 'boolean') return value ? '예' : '아니오';
    return value ?? '';
  }

  const keys = [
    'inquiryType',
    'customerName',
    'email',
    'phone',
    'language',
    'field',
    'product',
    'quantity',
    'country',
    'city',
    'timeline',
    'supportNeeded',
    'keyConcern',
    'missingInfo',
    'status',
    'needsHumanReview'
  ];

  document.getElementById('summaryFields').innerHTML = keys
    .map(k => `<dt>${labels[k]}</dt><dd>${safe(state.summary[k])}</dd>`)
    .join('');

  if(save) sessionStorage.setItem('medi_hana_chat', JSON.stringify(state));
}
function normalizeSummary(summary){
  if(!summary || typeof summary !== 'object') return {};

  function keep(oldValue, newValue){
    if(Array.isArray(newValue)) return newValue.length ? newValue : (Array.isArray(oldValue) ? oldValue : []);
    if(newValue === undefined || newValue === null || String(newValue).trim() === '') return oldValue || '';
    return newValue;
  }

  return {
    inquiryType: keep(state.summary.inquiryType, summary.inquiryType || summary.consultType),
    customerName: keep(state.summary.customerName, summary.customerName || summary.name),
    email: keep(state.summary.email, summary.email),
    phone: keep(state.summary.phone, summary.phone || summary.messenger || summary.contactMethod),
    language: keep(state.summary.language, summary.language || state.lang),
    country: keep(state.summary.country, summary.country || summary.shippingCountry),
    city: keep(state.summary.city, summary.city || summary.shippingAddress || summary.currentLocation),
    field: keep(state.summary.field, summary.field || summary.product || summary.service),
    product: keep(state.summary.product, summary.product || summary.field || summary.service),
    quantity: keep(state.summary.quantity, summary.quantity),
    timeline: keep(state.summary.timeline, summary.timeline || summary.travelDate || summary.visitTimeline),
    supportNeeded: Array.isArray(summary.supportNeeded)
      ? summary.supportNeeded
      : (summary.supportNeeded ? [summary.supportNeeded] : (state.summary.supportNeeded || [])),
    keyConcern: keep(state.summary.keyConcern, summary.keyConcern || summary.needs),
    missingInfo: keep(state.summary.missingInfo, summary.missingInfo),
    status: keep(state.summary.status, summary.status),
    needsHumanReview: summary.needsHumanReview !== undefined
      ? summary.needsHumanReview
      : (state.summary.needsHumanReview ?? true)
  };
}
async function askMediHana(message, historyForApi){
  const res = await fetch('/.netlify/functions/medi-hana-chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      message,
      history: historyForApi,
      language: state.lang,
      source,
      summary: state.summary
    })
  });

  const data = await res.json();

  if(!res.ok){
    throw new Error(data.error || data.errorType || 'AI connection error');
  }

  return data;
}
function replaceLastAssistant(text){
  for(let i=state.messages.length-1;i>=0;i--){
    if(state.messages[i].role === 'assistant'){
      state.messages[i].text = text;
      state.messages[i].key = '';
      break;
    }
  }
  renderMessages();
  sessionStorage.setItem('medi_hana_chat', JSON.stringify(state));
}

function loadingText(){
  if(state.lang === 'ko') return '메디하나가 상담 내용을 확인하고 있습니다...';
  if(state.lang === 'vi') return 'Medi Hana đang kiểm tra nội dung tư vấn...';
  if(state.lang === 'jp') return 'メディハナが相談内容を確認しています...';
  if(state.lang === 'cn') return 'Medi Hana 正在确认咨询内容...';
  return 'Medi Hana is reviewing your request...';
}

function errorText(){
  if(state.lang === 'ko') return '죄송합니다. 현재 AI 상담 연결을 확인 중입니다. 입력하신 상담 내용은 접수용으로 정리할 수 있습니다.';
  if(state.lang === 'vi') return 'Xin lỗi. Chúng tôi đang kiểm tra kết nối tư vấn AI. Nội dung của bạn vẫn có thể được ghi nhận để tư vấn.';
  if(state.lang === 'jp') return '申し訳ありません。現在AI相談接続を確認しています。入力内容は相談受付用に整理できます。';
  if(state.lang === 'cn') return '抱歉，目前正在确认AI咨询连接。您输入的内容仍可用于咨询受理整理。';
  return 'Sorry. We are checking the AI consultation connection. Your inquiry can still be organized for consultation intake.';
}

function init(){
  if(!langs.includes(state.lang)) state.lang='ko';

  renderLang();
  applyI18n();
  addByKey(getInitialMessageKey(source));

  document.getElementById('chatForm').addEventListener('submit', async e=>{
    e.preventDefault();

    const i=document.getElementById('chatInput');
    const m=i.value.trim();

    if(!m) return;

    add('user',m);
    i.value='';

    const historyForApi = state.messages.slice(-12);

    add('assistant', loadingText());

    try{
      const data = await askMediHana(m, historyForApi);
      replaceLastAssistant(data.reply || tr('replyGeneralInquiry'));
      updateSummary(normalizeSummary(data.summary || {}));
    }catch(error){
      console.error('[Medi Hana AI error]', error);
      replaceLastAssistant(errorText());
    }
  });
}
function setStatus(msg){const el=document.getElementById('submitStatus');if(el)el.textContent=msg}
document.getElementById('submitLead')?.addEventListener('click',()=>{const form=document.getElementById('mediHanaLeadForm');if(!form)return;document.getElementById('lead_language').value=state.lang;document.getElementById('lead_summary').value=JSON.stringify(state.summary);document.getElementById('lead_transcript').value=state.messages.map(m=>`${m.role}: ${m.key?tr(m.key):m.text}`).join('\n');setStatus(tr('submitSuccess'));form.submit();});

init();

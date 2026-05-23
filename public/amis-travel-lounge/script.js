(() => {
  const ko = {
    'lang.label':'Language / Translate','hero.title':'AMIS Travel Lounge','hero.sub':'AI 기반 다국어 여행·상담 라운지','hero.body':'부산 관광, K-Beauty, 웰니스, 의료관광 사전상담 문의를 AI 번역·요약과 담당자 확인 절차로 연결합니다.','hero.cta1':'상담 문의하기','hero.cta2':'상담 자동화 흐름 보기','hero.b1':'Multilingual Consultation','hero.b2':'AI Summary','hero.b3':'Human Review','hero.b4':'K-Beauty','hero.b5':'Wellness','hero.operator':'Operated by VR MEDI TOUR & HOME Co., Ltd.',
    'who.title':'여행자가 처음 만나는 다국어 상담 라운지','who.body':'AMIS Travel Lounge는 VR MEDI TOUR & HOME이 운영하는 고객 접점 브랜드입니다.','who.c1t':'Travel','who.c1d':'Busan 이동·숙소·관광 동선을 안내합니다.','who.c2t':'Beauty & Wellness','who.c2d':'K-Beauty 및 wellness coordination을 지원합니다.','who.c3t':'Medical Tourism Pre-consultation','who.c3d':'의료관광 사전상담 문의를 접수하고 병원 확인 전 단계로 연결합니다.',
    'wf.title':'상담은 AI가 정리하고, 최종 확인은 사람이 합니다','wf.body':'AI는 번역·요약·답변 초안을 보조하고, 최종 안내는 담당자 확인 후 진행합니다.','wf.s1':'1. 고객 문의 접수','wf.s2':'2. n8n Webhook 수신','wf.s3':'3. AI 번역·요약','wf.s4':'4. 고객 언어 답변 초안','wf.s5':'5. Gmail 초안 생성','wf.s6':'6. Google Sheets 기록','wf.s7':'7. 내부 알림','wf.s8':'8. 담당자 확인 후 안내',
    'auto.title':'현재 n8n 자동화 구조','auto.body':'문의 수신 후 요약/초안/기록/알림으로 연결되는 상담 접수 자동화입니다.','auto.c1t':'Webhook','auto.c1d':'상담 데이터를 수신합니다.','auto.c2t':'AI Summary','auto.c2d':'번역·요약 및 초안을 생성합니다.','auto.c3t':'Gmail Draft','auto.c3d':'검토용 Gmail 초안을 생성합니다.','auto.c4t':'Google Sheets','auto.c4d':'상담대장에 자동 기록합니다.','auto.c5t':'Internal Alert','auto.c5d':'신규 문의를 내부에 공유합니다.',
    'tr.title':'고객 언어는 그대로, 내부 확인은 한국어로','tr.body':'AI translation은 consultation preparation 보조 기능입니다.','scope.title':'상담·예약 문의 처리 범위','scope.body':'실제 일정·진료·비용 관련 내용은 병원 확인 후 안내됩니다.','kpop.title':'K-POP 팬 관광 연결','kpop.body':'부산 방문 글로벌 팬의 이동·관광·K-Beauty·wellness 정보를 연결합니다.',
    'route.title':'부산 관광 루트 데이터베이스','route.c1t':'부산역 / 김해공항','route.c1d':'Arrival point 안내','route.c2t':'서면 숙소 거점','route.c2d':'도심 이동·체험 거점','route.c3t':'해운대 숙소 거점','route.c3d':'해양관광·wellness 거점','pack.p1t':'K-POP 팬 1박 2일 루트','pack.p1d':'도착-공연-야간관광-K-Beauty','pack.p2t':'K-뷰티·웰니스 2박 3일 루트','pack.p2d':'해운대-웰니스-뷰티-야경','pack.p3t':'의료관광 사전상담 루트','pack.p3d':'문의접수-AI요약-담당자확인-병원확인후안내',
    'trust.title':'Trust & Compliance','trust.c1t':'의료관광 고지','trust.c1d':'VR MEDI TOUR & HOME은 병원이 아닙니다.','trust.c2t':'개인정보 고지','trust.c2d':'개인정보는 상담 목적 범위 내에서 사용됩니다.','trust.c3t':'AI 사용 고지','trust.c3d':'AI는 번역·요약·답변 초안 보조 도구입니다.','trust.c4t':'브랜드 고지','trust.c4d':'AMIS Travel Lounge는 VR MEDI TOUR & HOME 운영 브랜드입니다.','trust.notice':'VR MEDI TOUR & HOME is not a hospital and does not provide diagnosis, prescription, or medical treatment. Medical decisions are made only by licensed medical professionals at partner medical institutions.',
    'cta.title':'한국 방문 전, AMIS Travel Lounge에서 먼저 상담하세요','cta.body':'문의를 남겨주시면 AI 정리 후 담당자 확인을 거쳐 안내드립니다.','cta.btn':'상담 문의하기'
  };
  const en = Object.fromEntries(Object.entries(ko).map(([k,v])=>[k,v])); en['who.title']='A multilingual consultation lounge travelers meet first'; en['cta.btn']='Request Consultation';
  const vi = Object.fromEntries(Object.entries(en).map(([k,v])=>[k,v]));
  const ja = Object.fromEntries(Object.entries(en).map(([k,v])=>[k,v]));
  const zh = Object.fromEntries(Object.entries(en).map(([k,v])=>[k,v]));
  const dict = { ko, en, vi, ja, zh };
  const apply = (lang) => {
    const d = dict[lang] || dict.ko;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = d[key] ?? dict.ko[key] ?? el.textContent;
    });
    localStorage.setItem('amisLang', lang);
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };
  const start = localStorage.getItem('amisLang') || 'ko';
  apply(dict[start] ? start : 'ko');
  document.querySelectorAll('.lang-btn').forEach((btn) => btn.addEventListener('click', () => apply(btn.dataset.lang)));
})();

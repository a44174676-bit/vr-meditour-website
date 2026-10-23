(() => {
  'use strict';
  const endpoint='/.netlify/functions/study-korea-inquiry';
  let config=null, lang='vi', universityItems=[];
  const forms=[...document.querySelectorAll('form')], states=new WeakMap(), fieldErrors=new WeakMap();
  const texts={
    ko:{invalid:'필수 항목과 입력 형식을 확인해 주세요.',closed:'현재 접수 준비 중입니다. 입력 내용은 전송·저장되지 않았습니다.',pending:'접수 확인 중입니다.',failed:'서버에서 접수를 확인하지 못했습니다. 입력은 유지됩니다. 같은 내용으로 재시도해 주세요.',limited:'요청이 너무 많습니다. 잠시 후 같은 내용으로 재시도해 주세요.',success:'접수번호: ',ready:'개인정보 안내를 확인한 후 신청해 주세요.',required:'필수 항목입니다.',email:'올바른 이메일을 입력해 주세요.',phone:'국가번호를 포함해 입력해 주세요. 예: +821012345678, +84901234567',zalo:'국가번호를 포함한 전화번호 또는 영문으로 시작하는 Zalo ID를 입력해 주세요.',url:'https://로 시작하는 공식 URL을 입력해 주세요.',consent:'개인정보 안내 확인 및 동의가 필요합니다.',age:'만 14세 이상 신청자 본인 여부를 확인해 주세요.',hintZalo:'전화번호는 +84(베트남), +82(한국)를 포함하세요. Zalo ID도 가능합니다.',hintEmail:'연락받을 이메일을 입력하세요.',hintPhone:'국가번호 +84(베트남) / +82(한국). 예: +84901234567'},
    vi:{invalid:'Vui lòng kiểm tra các mục bắt buộc và định dạng.',closed:'Đang chuẩn bị tiếp nhận. Nội dung chưa được gửi hoặc lưu.',pending:'Đang xác nhận tiếp nhận.',failed:'Máy chủ chưa xác nhận tiếp nhận. Nội dung được giữ. Hãy thử lại với cùng nội dung.',limited:'Quá nhiều yêu cầu. Vui lòng chờ rồi thử lại với cùng nội dung.',success:'Mã yêu cầu: ',ready:'Vui lòng đọc thông báo dữ liệu trước khi gửi.',required:'Đây là mục bắt buộc.',email:'Vui lòng nhập email hợp lệ.',phone:'Nhập số có mã quốc gia, ví dụ +84901234567 hoặc +821012345678.',zalo:'Nhập số có mã quốc gia hoặc Zalo ID bắt đầu bằng chữ cái Latin.',url:'Nhập URL chính thức bắt đầu bằng https://.',consent:'Cần xác nhận và đồng ý thông báo dữ liệu.',age:'Vui lòng xác nhận người gửi từ 14 tuổi trở lên.',hintZalo:'Số điện thoại cần mã +84 (Việt Nam) hoặc +82 (Hàn Quốc). Có thể dùng Zalo ID.',hintEmail:'Nhập email để nhận liên hệ.',hintPhone:'Mã quốc gia +84 (Việt Nam) / +82 (Hàn Quốc). Ví dụ +84901234567'}
  };
  function status(form,key,receipt='') {states.set(form,{key,receipt});form.querySelector('.form-status').textContent=texts[lang][key]+receipt;}
  function errors(form,values) {
    fieldErrors.set(form,values);
    form.querySelectorAll('.field-error').forEach(node=>node.remove());
    form.querySelectorAll('[name]').forEach(control=>{
      const key=values[control.name];control.setAttribute('aria-invalid',String(Boolean(key)));
      const errorId=form.id+'-'+control.name+'-error';
      const described=(control.getAttribute('aria-describedby')||'').split(' ').filter(id=>id && id!==errorId);
      if(key){const node=document.createElement('span');node.id=errorId;node.className='field-error';node.textContent=texts[lang][key]||texts[lang].invalid;control.parentElement.append(node);described.push(errorId);}
      if(described.length)control.setAttribute('aria-describedby',described.join(' '));else control.removeAttribute('aria-describedby');
    });
  }
  function contact(form) {
    const method=form.elements.contact_method.value || (form.dataset.kind==='student'?'zalo':'email'), control=form.elements.contact_value;
    control.type=method==='email'?'email':method==='phone'?'tel':'text';
    control.inputMode=method==='email'?'email':method==='phone'?'tel':'text';
    control.autocomplete=method==='email'?'email':method==='phone'?'tel':'off';
    control.placeholder=method==='email'?'name@example.com':method==='phone'?'+84901234567':'Zalo ID / +84901234567';
    form.querySelector('.contact-hint').textContent=texts[lang][method==='email'?'hintEmail':method==='phone'?'hintPhone':'hintZalo'];
  }
  function applyLanguage(value) {
    lang=value==='ko'?'ko':'vi';StudentContent.render(document.querySelector('#university-cards'),universityItems,lang);document.documentElement.lang=lang;
    document.title=lang==='ko'?'VR STUDENT KOREA | 한국 유학 안내':'VR STUDENT KOREA | Hướng dẫn du học Hàn Quốc';
    document.querySelector('meta[name=description]').content=lang==='ko'?'대학 선택부터 입국 준비와 부산 생활적응까지 필요한 절차를 안내합니다.':'Hỗ trợ tìm hiểu trường, chuẩn bị hồ sơ, trước khi nhập cảnh và thích nghi với cuộc sống tại Busan.';
    document.querySelector('meta[property="og:title"]').content=document.title;
    document.querySelector('meta[property="og:description"]').content=lang==='ko'?'한국 유학, 정확한 정보에서 시작합니다.':'Du học Hàn Quốc bắt đầu từ thông tin đáng tin cậy.';
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
    document.querySelectorAll('option[data-ko]').forEach(option=>{option.textContent=option.dataset[lang];});
    ['home-link','brand-home'].forEach(id=>{document.getElementById(id).href='/?lang='+lang;});
    if(config){document.querySelector('#policy-text').textContent=config.policy[lang];document.querySelector('.availability').textContent=texts[lang].ready;}
    forms.forEach(form=>{
      contact(form);errors(form,fieldErrors.get(form)||{});
      const state=states.get(form);if(state)status(form,state.key,state.receipt);
      const marketing=form.elements.marketing_opt_in;
      if(marketing){marketing.disabled=!config?.marketing;form.querySelector('.marketing-policy').textContent=config?.marketing?.[lang]||'';}
    });
    try{localStorage.setItem('vrMediTourLang',lang);}catch{}
  }
  fetch('/study-korea/universities.json').then(response=>response.ok?response.json():[]).then(items=>{universityItems=Array.isArray(items)?items:[];StudentContent.render(document.querySelector('#university-cards'),universityItems,lang);}).catch(()=>{});
  let saved;try{saved=localStorage.getItem('vrMediTourLang');}catch{}
  applyLanguage(new URLSearchParams(location.search).get('lang')||saved);
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{applyLanguage(button.dataset.lang);const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}));
  window.addEventListener('popstate',()=>applyLanguage(new URLSearchParams(location.search).get('lang')));
  forms.forEach(form=>{
    let busy=false, submissionId, previousPayload;
    form.elements.contact_method.addEventListener('change',()=>contact(form));
    if(form.elements.country)form.elements.country.addEventListener('change',()=>{
      const control=form.elements.contact_value, prefix={VN:'+84',KR:'+82'}[form.elements.country.value];
      if(prefix && ['phone','zalo'].includes(form.elements.contact_method.value) && ['', '+84', '+82'].includes(control.value.trim()))control.value=prefix;
    });
    form.addEventListener('submit',async event=>{
      event.preventDefault();if(busy)return;
      const data=Object.fromEntries(new FormData(form));
      data.kind=form.dataset.kind;data.privacy_ack=form.elements.privacy_ack.checked;
      if(data.kind==='student'){data.age_ack=form.elements.age_ack.checked;data.marketing_opt_in=form.elements.marketing_opt_in.checked;}
      const result=StudentValidation.validate(data);errors(form,result.errors);
      if(Object.keys(result.errors).length){status(form,'invalid');form.querySelector('[aria-invalid=true]')?.focus();return;}
      if(!config){status(form,'closed');return;}
      data.policyVersion=config.version;data.marketingVersion=config.marketing?.version||null;
      // Locale is not part of contact intent: switching UI language must not create a duplicate ID.
      const serialized=JSON.stringify(data);
      if(serialized!==previousPayload){submissionId=crypto.randomUUID();previousPayload=serialized;}
      data.submissionId=submissionId;data.lang=lang;
      busy=true;form.querySelector('[type=submit]').disabled=true;form.setAttribute('aria-busy','true');status(form,'pending');
      try{
        const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
        const body=await response.json();
        if(response.status===429){status(form,'limited');return;}
        if(response.status===400){errors(form,body.errors||{});status(form,'invalid');form.querySelector('[aria-invalid=true]')?.focus();return;}
        if(!response.ok||body.accepted!==true||typeof body.receiptId!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(body.receiptId))throw Error('unconfirmed');
        form.reset();errors(form,{});contact(form);previousPayload=null;submissionId=null;status(form,'success',body.receiptId);
      }catch{status(form,'failed');}
      finally{busy=false;form.removeAttribute('aria-busy');form.querySelector('[type=submit]').disabled=false;}
    });
  });
  fetch(endpoint,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)}).then(async response=>{
    if(!response.ok)return;const result=await response.json();
    if(result.enabled!==true||!result.version||!result.policy?.ko||!result.policy?.vi)return;
    config=result;applyLanguage(lang);forms.forEach(form=>{form.querySelector('[type=submit]').disabled=false;});
  }).catch(()=>{});
})();

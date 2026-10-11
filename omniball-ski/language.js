(function(){
 const supported=['ko','en','vi','ja','zh'];
 const normalize=value=>({jp:'ja',cn:'zh'}[String(value||'').toLowerCase()]||String(value||'').toLowerCase());
 const dictionaries=window.VRMT_LANGUAGE_DATA.translations;
 const product=window.OMNIBALL_TRANSLATIONS;
 window.omniballText=key=>product[document.documentElement.lang]?.[key]||product.ko[key]||key;
 function applyLanguage(value){
  const normalized=normalize(value);const lang=supported.includes(normalized)?normalized:'ko';
  document.documentElement.lang=lang;document.documentElement.dir='ltr';
  const text=key=>product[lang]?.[key]??dictionaries[lang]?.[key]??dictionaries.en?.[key];
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=text(el.dataset.i18n);if(v)el.textContent=v;});
  for(const [data,attribute] of [['i18nTitle','title'],['i18nAria','aria-label'],['i18nAlt','alt']]){
   document.querySelectorAll('[data-'+data.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+']').forEach(el=>{const v=text(el.dataset[data]);if(v)el.setAttribute(attribute,v);});
  }
  document.querySelectorAll('.language-buttons button').forEach(button=>{const active=normalize(button.dataset.lang)===lang;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  document.title=text('navOmniball')+' | '+text('type')+' | VR MEDI TOUR & HOME';
  document.querySelector('meta[name="description"]').content=text('heroDesc');
  document.querySelector('meta[property="og:title"]').content=document.title;
  document.querySelector('meta[property="og:description"]').content=text('heroDesc');
  try{localStorage.setItem('vrMediTourLang',lang);}catch{}
  const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',lang);history.replaceState(null,'',url);}
  window.dispatchEvent(new CustomEvent('vrmt:language-change',{detail:{lang}}));
 }
 document.getElementById('languageButtons').addEventListener('click',event=>{const button=event.target.closest('button[data-lang]');if(button)applyLanguage(button.dataset.lang);});
 let saved='ko';try{saved=localStorage.getItem('vrMediTourLang')||'ko';}catch{}
 applyLanguage(new URLSearchParams(location.search).get('lang')||saved);
})();

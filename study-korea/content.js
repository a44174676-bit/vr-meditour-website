(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StudentContent=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function eligible(item,now=new Date()) {
    if(!item || item.published!==true || !item.name_ko || !item.name_vi || !item.location || !['D4','D2'].includes(item.program))return false;
    try{const url=new URL(item.source_url);if(url.protocol!=='https:'||url.username||url.password)return false;}catch{return false;}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(item.verified_at||''))return false;
    const verified=new Date(item.verified_at+'T00:00:00Z');
    if(!Number.isFinite(+verified)||verified>now||verified.toISOString().slice(0,10)!==item.verified_at)return false;
    if(item.closes_at && (!Number.isFinite(Date.parse(item.closes_at))||new Date(item.closes_at)<now))return false;
    return true;
  }
  function official(item,now=new Date()) {
    return eligible(item,now)&&item.contract_confirmed===true&&item.partnership_approved===true&&
      Number.isFinite(Date.parse(item.contract_expires_at))&&new Date(item.contract_expires_at)>now;
  }
  function render(container,items,lang) {
    container.replaceChildren();
    for(const item of items.filter(item=>eligible(item))){
      const card=document.createElement('article');card.className='service';
      const title=document.createElement('h3');title.textContent=item['name_'+lang];
      const metadata=document.createElement('p');metadata.textContent=[item.location,item.program,item.verified_at,official(item)?(lang==='ko'?'공식 협력대학':'Trường đối tác chính thức'):(lang==='ko'?'정보 제공용':'Chỉ cung cấp thông tin')].join(' · ');
      const link=document.createElement('a');link.href=item.source_url;link.textContent=lang==='ko'?'공식 모집공고':'Thông báo tuyển sinh chính thức';link.className='text-link';
      card.append(title,metadata,link);
      // No logos are rendered, even when a contract exists: separate usage approval is required.
      container.append(card);
    }
  }
  return {eligible,official,render};
});

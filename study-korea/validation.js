/* Shared browser/server validation. No persistence, credentials or network calls. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.StudentValidation = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const email = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const phone = value => /^\+[1-9]\d{7,14}$/.test(value.replace(/[ ()-]/g, ''));
  function validate(data) {
    const errors = {}, payload = {};
    if (!data || typeof data !== 'object' || Array.isArray(data) || !['student','partner'].includes(data.kind)) return {errors:{kind:'invalid'},payload};
    const student = data.kind === 'student';
    const text = (key, max, required = false) => {
      const value = data[key] === undefined ? '' : data[key];
      if (typeof value !== 'string' || [...value].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value) || (required && !value.trim())) errors[key] = required && (!value || (typeof value === 'string' && !value.trim())) ? 'required' : 'invalid';
      else payload[key] = value.trim();
    };
    const choice = (key, values, optional = false) => {
      if (optional && (data[key] === undefined || data[key] === '')) payload[key] = '';
      else if (!values.includes(data[key])) errors[key] = 'required';
      else payload[key] = data[key];
    };
    text('full_name',80,true); text('contact_value',254,true); text('message',500);
    choice('contact_method',student?['zalo','phone','email']:['phone','email']);
    if (payload.contact_value) {
      if (data.contact_method === 'email' && !email(payload.contact_value)) errors.contact_value='email';
      if (data.contact_method === 'phone' && !phone(payload.contact_value)) errors.contact_value='phone';
      if (data.contact_method === 'zalo' && !(phone(payload.contact_value) || /^[A-Za-z][A-Za-z0-9._-]{2,49}$/.test(payload.contact_value))) errors.contact_value='zalo';
      if (phone(payload.contact_value)) payload.contact_value=payload.contact_value.replace(/[ ()-]/g,'');
    }
    if (student) {
      choice('country',['VN','KR','OTHER']); text('city',80);
      choice('program',['D4','D2','UNDECIDED']); text('intake',7);
      if (payload.intake && !/^20\d{2}-H[12]$/.test(payload.intake)) errors.intake='invalid';
      if (data.age_ack !== true) errors.age_ack='age'; else payload.age_ack=true;
      if (data.marketing_opt_in !== undefined && typeof data.marketing_opt_in !== 'boolean') errors.marketing_opt_in='invalid';
      payload.marketing_opt_in=data.marketing_opt_in === true;
    } else {
      choice('org_type',['HANOI_AGENCY','KOREAN_UNIVERSITY','OTHER']);
      text('organization',120,true); text('job_title',80,true); text('official_website',300);
      if (payload.official_website) {
        try { const url=new URL(payload.official_website); if (url.protocol!=='https:' || url.username || url.password) errors.official_website='url'; } catch { errors.official_website='url'; }
      }
      choice('interest',['RECRUITMENT','SETTLEMENT','EDUCATION','BRIEFING','OTHER']);
      choice('monthly_volume',['1_10','11_50','51_PLUS'],true);
      payload.marketing_opt_in=false;
    }
    if (data.privacy_ack !== true) errors.privacy_ack='consent'; else payload.privacy_ack=true;
    if (data.company_fax) errors.company_fax='invalid';
    payload.type=student?'STUDENT':'PARTNER';
    return {errors,payload};
  }
  return { validate };
});

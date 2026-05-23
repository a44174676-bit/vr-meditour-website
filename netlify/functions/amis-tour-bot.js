exports.handler = async (event) => {
  // Security note:
  // - Never expose webhook URL or provider API keys to frontend clients.
  // - Keep AMIS_TOUR_BOT_WEBHOOK_URL only in Netlify environment variables.
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ ok:false, message:'Method Not Allowed' }) };
  const webhook = process.env.AMIS_TOUR_BOT_WEBHOOK_URL;
  if (!webhook) return { statusCode: 500, body: JSON.stringify({ ok:false, message:'Service is not configured.' }) };
  try {
    const { intent, message, language, area, days, category, latitude, longitude } = JSON.parse(event.body || '{}');
    const resp = await fetch(webhook, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ intent, message, language, area, days, category, latitude, longitude }) });
    const data = await resp.json().catch(()=>({}));
    return { statusCode: 200, body: JSON.stringify({ ok:true, type:data.type||intent||'course_recommend', items:data.items||[] }) };
  } catch {
    return { statusCode: 502, body: JSON.stringify({ ok:false, message:'Unable to fetch route now.' }) };
  }
};

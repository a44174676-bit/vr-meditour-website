exports.handler = async function (event) {
  const t = (lang, key) => {
    const L = messages[lang] || messages.ko;
    return L[key] || messages.ko[key];
  };

  if (event.httpMethod !== 'POST') return response(405, { ok: false, error: 'Method Not Allowed' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_) {}
  const lang = ['ko','en','vi','ja','zh'].includes(body.language) ? body.language : 'ko';

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  if (!apiKey) return response(500, { ok: false, error: t(lang, 'errApiKey') });

  const imageBase64 = body.imageBase64;
  if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
    return response(400, { ok: false, error: t(lang, 'errImageFormat') });
  }
  if (imageBase64.length > 6000000) return response(413, { ok: false, error: t(lang, 'errImageSize') });

  try {
    const langName = { ko:'Korean', en:'English', vi:'Vietnamese', ja:'Japanese', zh:'Chinese' }[lang];
    const prompt = `You are a skin/beauty reference AI, not a medical diagnostician. Do not diagnose diseases or prescribe treatment/drugs. Write values in ${langName}. Keep JSON keys in English exactly matching schema.`;

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: imageBase64 }] }],
        text: { format: { type: 'json_schema', name: 'skin_analysis', schema: {
          type: 'object', additionalProperties: false,
          properties: {
            summary: { type: 'string' }, confidence: { type: 'number' }, observations: { type: 'array', items: { type: 'string' } }, care_priority: { type: 'array', items: { type: 'string' } }, recommended_product_direction: { type: 'array', items: { type: 'string' } }, dermatology_consult_recommendation: { type: 'string' }
          },
          required: ['summary','confidence','observations','care_priority','recommended_product_direction','dermatology_consult_recommendation']
        } } }
      })
    });

    const payload = await openaiRes.json();
    if (!openaiRes.ok) {
      const msg = payload.error?.message || '';
      if (/quota|rate limit|insufficient/i.test(msg)) return response(429, { ok: false, error: t(lang, 'errQuota') });
      return response(openaiRes.status, { ok: false, error: t(lang, 'errAnalyze') });
    }

    const outputText = payload.output_text || payload.output?.[0]?.content?.find((c) => c.type === 'output_text')?.text;
    if (!outputText) return response(502, { ok: false, error: t(lang, 'errAnalyze') });
    let analysis;
    try { analysis = JSON.parse(outputText); } catch (_) { return response(502, { ok: false, error: t(lang, 'errAnalyze') }); }
    return response(200, { ok: true, analysis });
  } catch (_) {
    return response(500, { ok: false, error: t(lang, 'errAnalyze') });
  }
};

const messages = {
  ko: { errApiKey:'AI 분석 서버 설정이 아직 완료되지 않았습니다. 관리자에게 문의해 주세요.', errQuota:'AI 분석 서버 사용 한도가 일시적으로 제한되어 있습니다. 관리자 확인 후 다시 이용해 주세요.', errImageFormat:'이미지 형식이 올바르지 않습니다. 다시 촬영해 주세요.', errImageSize:'이미지 용량이 너무 큽니다. 카메라를 다시 시작하고 재시도해 주세요.', errAnalyze:'분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
  en: { errApiKey:'AI analysis server setup is not complete yet. Please contact the administrator.', errQuota:'AI analysis server usage is temporarily limited. Please try again after administrator review.', errImageFormat:'Invalid image format. Please capture again.', errImageSize:'Image is too large. Restart camera and try again.', errAnalyze:'Analysis request failed. Please try again later.' },
  vi: { errApiKey:'Thiết lập máy chủ AI chưa hoàn tất. Vui lòng liên hệ quản trị viên.', errQuota:'Hạn mức máy chủ AI tạm thời bị giới hạn. Vui lòng thử lại sau khi quản trị viên kiểm tra.', errImageFormat:'Định dạng ảnh không hợp lệ. Vui lòng chụp lại.', errImageSize:'Ảnh quá lớn. Hãy khởi động lại camera và thử lại.', errAnalyze:'Yêu cầu phân tích thất bại. Vui lòng thử lại sau.' },
  ja: { errApiKey:'AI分析サーバー設定が未完了です。管理者へお問い合わせください。', errQuota:'AI分析サーバー利用上限が一時的に制限されています。管理者確認後に再度ご利用ください。', errImageFormat:'画像形式が正しくありません。再撮影してください。', errImageSize:'画像サイズが大きすぎます。カメラを再起動して再試行してください。', errAnalyze:'分析リクエストに失敗しました。後でもう一度お試しください。' },
  zh: { errApiKey:'AI分析服务器设置尚未完成，请联系管理员。', errQuota:'AI分析服务器使用额度暂时受限，请管理员确认后再试。', errImageFormat:'图像格式无效，请重新拍摄。', errImageSize:'图像过大，请重启相机后重试。', errAnalyze:'分析请求失败，请稍后重试。' },
};

function response(statusCode, body) { return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }; }

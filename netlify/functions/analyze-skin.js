exports.handler = async function (event) {
  const t = (lang, key) => {
    const L = messages[lang] || messages.ko;
    return L[key] || messages.ko[key];
  };

  if (event.httpMethod !== 'POST') return response(405, { ok: false, error: 'Method Not Allowed' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_) {}
  const lang = ['ko','en','vi','ja','zh','ar'].includes(body.language) ? body.language : 'ko';

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  if (!apiKey) return response(500, { ok: false, error: t(lang, 'errApiKey') });

  const imageBase64 = body.imageBase64 || body.image;
  const mode = body.mode === 'premium' && body.premium === 'BUSANBLUE' ? 'premium' : 'free';
  if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
    return response(400, { ok: false, error: t(lang, 'errImageFormat') });
  }
  if (imageBase64.length > 6000000) return response(413, { ok: false, error: t(lang, 'errImageSize') });

  try {
    const langName = { ko:'Korean', en:'English', vi:'Vietnamese', ja:'Japanese', zh:'Chinese', ar:'Arabic' }[lang];
    const freeAnalysisContext = body.freeAnalysis
      ? `\nPrior free analysis context for the same photo, to be used only as supporting context and not copied verbatim: ${JSON.stringify(body.freeAnalysis).slice(0, 2500)}`
      : '';

    const freePrompt = `You are an AI K-beauty skin-condition reference writer, not a medical service. Write values in ${langName}. Keep JSON keys in English exactly matching the schema. Create a short free trial result only: one concise summary, exactly 3 visible-condition observation points, basic K-beauty care direction, and a clear non-medical disclaimer. Do not use disease names or any promise-like language. Avoid these expressions in generated result values except the exact non-medical disclaimer: diagnosis, treatment, cure, disease judgment, acne treatment, melasma treatment, inflammation treatment, guaranteed wrinkle improvement, skin disease determination, medical judgment, 진단, 치료, 완치, 질병 판단, 여드름 치료, 기미 치료, 염증 치료, 주름 개선 보장, 피부질환 판정, 의료적 판단. Use allowed framing such as skin condition, reference report, hydration care, oil balance, texture care, pore visibility, tone evenness, K-beauty routine, product category, preparation before consultation, and guidance to consult a medical institution when needed.`;

    const premiumPrompt = `You are an AI K-beauty condition report writer who does not provide medical diagnosis. Based on the user's face image, write a non-medical skin-condition reference report in ${langName}. Keep JSON keys in English exactly matching the schema. Do not identify disease, provide treatment, promise cure, make skin-disease determinations, prescribe drugs, or make medical judgments. Instead use expressions such as skin condition, hydration care, oil balance, skin texture, pore visibility, tone evenness, glow, K-beauty routine, product category, preparation before consultation, and medical-institution consultation guidance. This is a premium BUSANBLUE goods QR benefit: make it much deeper than the free analysis. For every score, concern, zone, routine, product category, and checklist item, provide concrete visual rationale and practical next direction in at least 1-2 complete sentences. Include photo-quality assessment, overall score, seven sub-scores with interpretations and care directions, Top 5 concerns, zone-by-zone observations, morning/evening/weekly routines, product categories, Korea K-beauty consultation checklist, medical-tourism preparation items, next-best actions, consultation CTA-friendly details, and the required disclaimer. Never use these prohibited expressions in generated result values except the exact non-medical disclaimer: diagnosis, treatment, cure, disease judgment, acne treatment, melasma treatment, inflammation treatment, guaranteed wrinkle improvement, skin disease determination, medical judgment, 진단, 치료, 완치, 질병 판단, 여드름 치료, 기미 치료, 염증 치료, 주름 개선 보장, 피부질환 판정, 의료적 판단.${freeAnalysisContext}`;

    const prompt = mode === 'premium' ? premiumPrompt : freePrompt;
    const schema = mode === 'premium' ? premiumSchema : freeSchema;

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: imageBase64 }] }],
        text: { format: { type: 'json_schema', name: 'skin_analysis', schema } }
      })
    });

    const payload = await openaiRes.json();
    if (!openaiRes.ok) {
      const msg = payload.error?.message || '';
      console.error('OpenAI skin analysis error:', payload.error || payload);
      if (/quota|rate limit|insufficient/i.test(msg)) return response(429, { ok: false, error: t(lang, 'errQuota') });
      return response(openaiRes.status, { ok: false, error: t(lang, 'errAnalyze') });
    }

    const outputText = payload.output_text || payload.output?.[0]?.content?.find((c) => c.type === 'output_text')?.text;
    if (!outputText) return response(502, { ok: false, error: t(lang, 'errAnalyze') });
    let analysis;
    try { analysis = JSON.parse(outputText); } catch (_) { return response(502, { ok: false, error: t(lang, 'errAnalyze') }); }
    analysis = sanitizeAnalysisValues(analysis);
    analysis.mode = mode;
    return response(200, { ok: true, mode, analysis });
  } catch (error) {
    console.error('Skin analysis function failed:', error);
    return response(500, { ok: false, error: t(lang, 'errAnalyze') });
  }
};


const freeSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    mode: { type: 'string', enum: ['free'] },
    summary: { type: 'string' },
    confidence: { type: 'number' },
    observations: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'string' } },
    care_priority: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
    recommended_product_direction: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
    dermatology_consult_recommendation: { type: 'string' },
    disclaimer: { type: 'string' },
  },
  required: ['mode','summary','confidence','observations','care_priority','recommended_product_direction','dermatology_consult_recommendation','disclaimer'],
};

const scoreDetailSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    score: { type: 'number' },
    label: { type: 'string' },
    interpretation: { type: 'string' },
    careDirection: { type: 'string' },
  },
  required: ['score','label','interpretation','careDirection'],
};

const zoneDetailSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    observation: { type: 'string' },
    careDirection: { type: 'string' },
  },
  required: ['observation','careDirection'],
};

const routineStepSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    step: { type: 'number' },
    title: { type: 'string' },
    reason: { type: 'string' },
  },
  required: ['step','title','reason'],
};

const premiumSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    mode: { type: 'string', enum: ['premium'] },
    overallScore: { type: 'number' },
    summary: { type: 'string' },
    photoQuality: {
      type: 'object', additionalProperties: false,
      properties: {
        status: { type: 'string', enum: ['good','fair','poor'] },
        lighting: { type: 'string' },
        facePosition: { type: 'string' },
        clarity: { type: 'string' },
        note: { type: 'string' },
      },
      required: ['status','lighting','facePosition','clarity','note'],
    },
    subScores: {
      type: 'object', additionalProperties: false,
      properties: {
        hydration: scoreDetailSchema,
        oilBalance: scoreDetailSchema,
        texture: scoreDetailSchema,
        pores: scoreDetailSchema,
        redness: scoreDetailSchema,
        toneEvenness: scoreDetailSchema,
        glow: scoreDetailSchema,
      },
      required: ['hydration','oilBalance','texture','pores','redness','toneEvenness','glow'],
    },
    topConcerns: {
      type: 'array', minItems: 5, maxItems: 5,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          rank: { type: 'number' },
          concern: { type: 'string' },
          whyItMatters: { type: 'string' },
          firstAction: { type: 'string' },
        },
        required: ['rank','concern','whyItMatters','firstAction'],
      },
    },
    zoneAnalysis: {
      type: 'object', additionalProperties: false,
      properties: {
        forehead: zoneDetailSchema,
        cheeks: zoneDetailSchema,
        nose: zoneDetailSchema,
        mouthArea: zoneDetailSchema,
        chin: zoneDetailSchema,
        eyeArea: zoneDetailSchema,
      },
      required: ['forehead','cheeks','nose','mouthArea','chin','eyeArea'],
    },
    morningRoutine: { type: 'array', minItems: 4, items: routineStepSchema },
    eveningRoutine: { type: 'array', minItems: 4, items: routineStepSchema },
    weeklyCare: {
      type: 'array', minItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          frequency: { type: 'string' },
          title: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['frequency','title','reason'],
      },
    },
    productCategories: {
      type: 'array', minItems: 5,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          category: { type: 'string' },
          purpose: { type: 'string' },
          caution: { type: 'string' },
        },
        required: ['category','purpose','caution'],
      },
    },
    koreaConsultChecklist: {
      type: 'array', minItems: 5,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          item: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['item','reason'],
      },
    },
    medicalTourismPreparation: {
      type: 'array', minItems: 4,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          item: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['item','reason'],
      },
    },
    nextBestActions: { type: 'array', minItems: 3, items: { type: 'string' } },
    disclaimer: { type: 'string' },
  },
  required: ['mode','overallScore','summary','photoQuality','subScores','topConcerns','zoneAnalysis','morningRoutine','eveningRoutine','weeklyCare','productCategories','koreaConsultChecklist','medicalTourismPreparation','nextBestActions','disclaimer'],
};

const messages = {
  ko: { errApiKey:'AI 분석 서버 설정이 아직 완료되지 않았습니다. 관리자에게 문의해 주세요.', errQuota:'AI 분석 서버 사용 한도가 일시적으로 제한되어 있습니다. 관리자 확인 후 다시 이용해 주세요.', errImageFormat:'이미지 형식이 올바르지 않습니다. 다시 촬영해 주세요.', errImageSize:'이미지 용량이 너무 큽니다. 카메라를 다시 시작하고 재시도해 주세요.', errAnalyze:'분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
  en: { errApiKey:'AI analysis server setup is not complete yet. Please contact the administrator.', errQuota:'AI analysis server usage is temporarily limited. Please try again after administrator review.', errImageFormat:'Invalid image format. Please capture again.', errImageSize:'Image is too large. Restart camera and try again.', errAnalyze:'Analysis request failed. Please try again later.' },
  vi: { errApiKey:'Thiết lập máy chủ AI chưa hoàn tất. Vui lòng liên hệ quản trị viên.', errQuota:'Hạn mức máy chủ AI tạm thời bị giới hạn. Vui lòng thử lại sau khi quản trị viên kiểm tra.', errImageFormat:'Định dạng ảnh không hợp lệ. Vui lòng chụp lại.', errImageSize:'Ảnh quá lớn. Hãy khởi động lại camera và thử lại.', errAnalyze:'Yêu cầu phân tích thất bại. Vui lòng thử lại sau.' },
  ja: { errApiKey:'AI分析サーバー設定が未完了です。管理者へお問い合わせください。', errQuota:'AI分析サーバー利用上限が一時的に制限されています。管理者確認後に再度ご利用ください。', errImageFormat:'画像形式が正しくありません。再撮影してください。', errImageSize:'画像サイズが大きすぎます。カメラを再起動して再試行してください。', errAnalyze:'分析リクエストに失敗しました。後でもう一度お試しください。' },
  zh: { errApiKey:'AI分析服务器设置尚未完成，请联系管理员。', errQuota:'AI分析服务器使用额度暂时受限，请管理员确认后再试。', errImageFormat:'图像格式无效，请重新拍摄。', errImageSize:'图像过大，请重启相机后重试。', errAnalyze:'分析请求失败，请稍后重试。' },
  ar: { errApiKey:'إعداد خادم تحليل الذكاء الاصطناعي غير مكتمل بعد. يرجى التواصل مع المسؤول.', errQuota:'استخدام خادم تحليل الذكاء الاصطناعي محدود مؤقتًا. يرجى المحاولة بعد مراجعة المسؤول.', errImageFormat:'تنسيق الصورة غير صالح. يرجى التصوير مرة أخرى.', errImageSize:'الصورة كبيرة جدًا. أعد تشغيل الكاميرا وحاول مرة أخرى.', errAnalyze:'فشل طلب التحليل. يرجى المحاولة لاحقًا.' },
};

function sanitizeAnalysisValues(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => sanitizeAnalysisValues(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, sanitizeAnalysisValues(childValue, childKey)]));
  }
  if (typeof value !== 'string' || key === 'disclaimer') return value;
  return value
    .replace(/여드름\s*치료/g, '트러블성 피부 컨디션 관리')
    .replace(/기미\s*치료/g, '색 변화 고민 상담 준비')
    .replace(/염증\s*치료/g, '붉은기 신호 관리')
    .replace(/주름\s*개선\s*보장/g, '탄력 인상 관리 참고')
    .replace(/피부질환\s*판정/g, '피부 컨디션 참고')
    .replace(/질병\s*판단/g, '피부 컨디션 참고')
    .replace(/의료적\s*판단/g, '의료기관 상담 안내')
    .replace(/진단/g, '참고 확인')
    .replace(/치료/g, '관리')
    .replace(/완치/g, '변화 관리')
    .replace(/diagnosis/gi, 'reference check')
    .replace(/treatment/gi, 'care')
    .replace(/cure/gi, 'condition tracking')
    .replace(/medical judgment/gi, 'medical-institution consultation guidance');
}

function response(statusCode, body) { return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }; }

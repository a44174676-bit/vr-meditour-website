exports.handler = async function (event) {
  const t = (lang, key) => {
    const L = messages[lang] || messages.ko;
    return L[key] || messages.ko[key];
  };

  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'method_not_allowed', 'Method Not Allowed');
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    console.error('[analyze-skin] invalid JSON body:', error);
    return errorResponse(400, 'invalid_image_payload', messages.ko.errImageFormat, { reason: 'invalid_json' });
  }

  const lang = normalizeLanguage(body.language || body.lang);
  const imageBase64 = firstString(body.imageBase64, body.image, body.imageData, body.image_data);
  const requestedMode = String(body.mode || '').toLowerCase();
  const premiumAccess = firstString(body.premium, body.access, body.accessCode, body.access_code);
  const premiumRequested = requestedMode === 'premium'
    || body.premium === true
    || body.premium === 'BUSANBLUE'
    || body.access === 'BUSANBLUE';
  if (premiumRequested && premiumAccess !== 'BUSANBLUE') {
    console.error('[analyze-skin] invalid premium access');
    return errorResponse(403, 'invalid_premium_access', t(lang, 'errPremiumAccess'));
  }

  const mode = premiumRequested ? 'premium' : 'free';
  const simpleKbeauty = mode === 'free' && body.responseFormat === 'kbeauty_simple';
  if (!imageBase64 || !imageBase64.startsWith('data:image/')) {
    console.error('[analyze-skin] invalid image payload:', {
      hasImageBase64: typeof body.imageBase64 === 'string',
      hasImage: typeof body.image === 'string',
      hasImageData: typeof body.imageData === 'string',
    });
    return errorResponse(400, 'invalid_image_payload', t(lang, 'errImageFormat'));
  }
  if (imageBase64.length > 6000000) {
    console.error('[analyze-skin] image payload too large:', { length: imageBase64.length });
    return errorResponse(413, 'invalid_image_payload', t(lang, 'errImageSize'), { reason: 'image_too_large' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  if (!apiKey) {
    console.error('[analyze-skin] missing OPENAI_API_KEY');
    return errorResponse(500, 'missing_api_key', t(lang, 'errApiKey'));
  }

  try {
    const langName = { ko:'Korean', en:'English', vi:'Vietnamese', ja:'Japanese', zh:'Chinese', ar:'Arabic' }[lang];
    const simpleKbeautyPrompt = `You are an AI K-beauty skin image reviewer, not a medical service. Write values in ${langName}. Keep JSON keys in English exactly matching the schema. First decide whether a human face is clearly visible and sufficiently centered for non-medical skin-interest review. If no face is visible, if only a wall/object/body part is visible, if the face is too partial, too dark, too blurred, covered by a mask/sunglasses, or outside the guide area, set faceDetected:false and canAnalyze:false. In that case do not provide skin-interest analysis; use a short recapture summary, an empty skinInterestPoints array, and a recapture recommendation. If a face is clear enough, set faceDetected:true and canAnalyze:true, then provide a concise non-medical K-beauty reference summary, exactly four skinInterestPoints covering moisture/dryness interest, pigment/spot interest, elasticity/wrinkle interest, and pore/sebum interest when visually relevant, plus a K-beauty consultation recommendation. Do not identify disease, provide diagnosis, prescribe treatment, make medical judgments, or promise improvement. The disclaimer value must be exactly: 이 결과는 의료 진단이 아닌 상담 준비용 참고 분석입니다.`;
    const freeAnalysisContext = body.freeAnalysis
      ? `\nPrior free analysis context for the same photo, to be used only as supporting context and not copied verbatim: ${JSON.stringify(body.freeAnalysis).slice(0, 2500)}`
      : '';

    const freePrompt = `You are an AI K-beauty skin-condition reference writer, not a medical service. Write values in ${langName}. Keep JSON keys in English exactly matching the schema. Create a short free trial result only: one concise summary, exactly 3 visible-condition observation points, basic K-beauty care direction, and a clear non-medical disclaimer. Do not use disease names or any promise-like language. Avoid these expressions in generated result values except the exact non-medical disclaimer: diagnosis, treatment, cure, disease judgment, acne treatment, melasma treatment, inflammation treatment, guaranteed wrinkle improvement, skin disease determination, medical judgment, 진단, 치료, 완치, 질병 판단, 여드름 치료, 기미 치료, 염증 치료, 주름 개선 보장, 피부질환 판정, 의료적 판단. Use allowed framing such as skin condition, reference report, hydration care, oil balance, texture care, pore visibility, tone evenness, K-beauty routine, product category, preparation before consultation, and guidance to consult a medical institution when needed.`;

    const premiumPrompt = `You are an AI K-beauty condition report writer who does not provide medical diagnosis. Based on the user's face image, write a non-medical skin-condition reference report in ${langName}. Keep JSON keys in English exactly matching the schema. First decide whether a human face is clearly visible, sufficiently centered, well lit, and usable for a reference report. Set faceDetected and canAnalyze accordingly. If the photo is unsuitable, set both values to false and fill the other required fields only with neutral recapture guidance, without making skin observations. Do not identify disease, provide treatment, promise cure, make skin-disease determinations, prescribe drugs, or make medical judgments. Instead use expressions such as skin condition, hydration care, oil balance, skin texture, pore visibility, tone evenness, glow, K-beauty routine, product category, preparation before consultation, and medical-institution consultation guidance. This is a premium BUSANBLUE goods QR benefit: make it much deeper than the free analysis. For every score, concern, zone, routine, product category, and checklist item, provide concrete visual rationale and practical next direction in at least 1-2 complete sentences. Include photo-quality assessment, overall score, seven sub-scores with interpretations and care directions, Top 5 concerns, zone-by-zone observations, morning/evening/weekly routines, product categories, Korea K-beauty consultation checklist, medical-tourism preparation items, next-best actions, and the required disclaimer. Also include interestAreas with exactly these five keys: hydrationDryness, toneDullness, poreSebum, wrinkleElasticity, rednessSensitivity. Each interest area needs a 0-100 reference score, a cautious visual observation, and a practical non-medical care direction. Include five to seven consultationQuestions the user can prepare before a K-beauty or licensed medical-institution consultation. Include mediHanaCta with a short title and description that invite the user to share the reference report with Medi Hana for consultation preparation, without promising a medical result. Never use these prohibited expressions in generated result values except the exact non-medical disclaimer: diagnosis, treatment, cure, disease judgment, acne treatment, melasma treatment, inflammation treatment, guaranteed wrinkle improvement, skin disease determination, medical judgment, 진단, 치료, 완치, 질병 판단, 여드름 치료, 기미 치료, 염증 치료, 주름 개선 보장, 피부질환 판정, 의료적 판단.${freeAnalysisContext}`;

    const prompt = simpleKbeauty ? simpleKbeautyPrompt : (mode === 'premium' ? premiumPrompt : freePrompt);
    const schema = simpleKbeauty ? simpleKbeautySchema : (mode === 'premium' ? premiumSchema : freeSchema);

    let openaiRes;
    try {
      openaiRes = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: imageBase64 }] }],
          max_output_tokens: mode === 'premium' ? 12000 : (simpleKbeauty ? 2200 : 3200),
          text: { format: { type: 'json_schema', name: 'skin_analysis', schema } }
        })
      });
    } catch (error) {
      console.error('[analyze-skin] OpenAI network request failed:', error);
      return errorResponse(502, 'openai_request_failed', t(lang, 'errAnalyze'), { reason: 'network_error' });
    }

    const payload = await openaiRes.json().catch((error) => {
      console.error('[analyze-skin] OpenAI response JSON parse failed:', error);
      return null;
    });
    if (!openaiRes.ok) {
      const upstreamMessage = payload?.error?.message || '';
      const isQuotaError = /quota|rate limit|insufficient/i.test(upstreamMessage);
      console.error('[analyze-skin] OpenAI request failed:', {
        status: openaiRes.status,
        requestId: openaiRes.headers?.get?.('x-request-id') || null,
        error: payload?.error || payload,
      });
      return errorResponse(
        isQuotaError ? 429 : 502,
        'openai_request_failed',
        isQuotaError ? t(lang, 'errQuota') : t(lang, 'errAnalyze'),
        {
          reason: isQuotaError ? 'quota_or_rate_limit' : 'upstream_error',
          upstreamStatus: openaiRes.status,
          upstreamCode: payload?.error?.code || null,
          requestId: openaiRes.headers?.get?.('x-request-id') || null,
        }
      );
    }

    const outputText = payload?.output_text || payload?.output
      ?.flatMap((item) => item?.content || [])
      .find((content) => content?.type === 'output_text')?.text;
    if (!outputText) {
      console.error('[analyze-skin] OpenAI response has no output text:', {
        status: payload?.status,
        incompleteDetails: payload?.incomplete_details || null,
      });
      return errorResponse(502, 'openai_request_failed', t(lang, 'errAnalyze'), {
        reason: payload?.incomplete_details?.reason || 'missing_output_text',
      });
    }
    let analysis;
    try {
      analysis = JSON.parse(outputText);
    } catch (error) {
      console.error('[analyze-skin] OpenAI output JSON parse failed:', {
        error,
        outputPreview: outputText.slice(0, 300),
      });
      return errorResponse(502, 'openai_request_failed', t(lang, 'errAnalyze'), { reason: 'invalid_model_json' });
    }
    analysis = sanitizeAnalysisValues(analysis);
    if (simpleKbeauty) {
      analysis.disclaimer = '이 결과는 의료 진단이 아닌 상담 준비용 참고 분석입니다.';
      return response(200, analysis);
    }
    analysis.mode = mode;
    return response(200, { ok: true, mode, analysis });
  } catch (error) {
    console.error('[analyze-skin] unknown error:', error);
    return errorResponse(500, 'unknown_error', t(lang, 'errUnknown'));
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

const simpleKbeautySchema = {
  type: 'object', additionalProperties: false,
  properties: {
    faceDetected: { type: 'boolean' },
    canAnalyze: { type: 'boolean' },
    summary: { type: 'string' },
    skinInterestPoints: {
      type: 'array',
      minItems: 0,
      maxItems: 4,
      items: { type: 'string' },
    },
    recommendation: { type: 'string' },
    disclaimer: { type: 'string' },
  },
  required: ['faceDetected','canAnalyze','summary','skinInterestPoints','recommendation','disclaimer'],
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

const interestDetailSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    score: { type: 'number' },
    observation: { type: 'string' },
    careDirection: { type: 'string' },
  },
  required: ['score','observation','careDirection'],
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
    faceDetected: { type: 'boolean' },
    canAnalyze: { type: 'boolean' },
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
    interestAreas: {
      type: 'object', additionalProperties: false,
      properties: {
        hydrationDryness: interestDetailSchema,
        toneDullness: interestDetailSchema,
        poreSebum: interestDetailSchema,
        wrinkleElasticity: interestDetailSchema,
        rednessSensitivity: interestDetailSchema,
      },
      required: ['hydrationDryness','toneDullness','poreSebum','wrinkleElasticity','rednessSensitivity'],
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
    morningRoutine: { type: 'array', minItems: 4, maxItems: 6, items: routineStepSchema },
    eveningRoutine: { type: 'array', minItems: 4, maxItems: 6, items: routineStepSchema },
    weeklyCare: {
      type: 'array', minItems: 3, maxItems: 4,
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
      type: 'array', minItems: 5, maxItems: 7,
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
      type: 'array', minItems: 5, maxItems: 7,
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
      type: 'array', minItems: 4, maxItems: 6,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          item: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['item','reason'],
      },
    },
    nextBestActions: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } },
    consultationQuestions: { type: 'array', minItems: 5, maxItems: 7, items: { type: 'string' } },
    mediHanaCta: {
      type: 'object', additionalProperties: false,
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['title','description'],
    },
    disclaimer: { type: 'string' },
  },
  required: ['mode','faceDetected','canAnalyze','overallScore','summary','photoQuality','subScores','interestAreas','topConcerns','zoneAnalysis','morningRoutine','eveningRoutine','weeklyCare','productCategories','koreaConsultChecklist','medicalTourismPreparation','nextBestActions','consultationQuestions','mediHanaCta','disclaimer'],
};

const messages = {
  ko: { errApiKey:'OPENAI_API_KEY가 설정되지 않았습니다.', errQuota:'AI 분석 서버 사용 한도가 일시적으로 제한되어 있습니다. 관리자 확인 후 다시 이용해 주세요.', errImageFormat:'이미지 형식이 올바르지 않습니다. 다시 촬영해 주세요.', errImageSize:'이미지 용량이 너무 큽니다. 카메라를 다시 시작하고 재시도해 주세요.', errPremiumAccess:'프리미엄 접근 정보가 올바르지 않습니다.', errAnalyze:'AI 상세 분석 서버 요청에 실패했습니다.', errUnknown:'알 수 없는 오류가 발생했습니다.' },
  en: { errApiKey:'OPENAI_API_KEY is not configured.', errQuota:'AI analysis server usage is temporarily limited. Please try again after administrator review.', errImageFormat:'Invalid image format. Please capture again.', errImageSize:'Image is too large. Restart camera and try again.', errPremiumAccess:'Premium access information is invalid.', errAnalyze:'The AI analysis server request failed.', errUnknown:'An unknown error occurred.' },
  vi: { errApiKey:'OPENAI_API_KEY chưa được thiết lập.', errQuota:'Hạn mức máy chủ AI tạm thời bị giới hạn. Vui lòng thử lại sau khi quản trị viên kiểm tra.', errImageFormat:'Định dạng ảnh không hợp lệ. Vui lòng chụp lại.', errImageSize:'Ảnh quá lớn. Hãy khởi động lại camera và thử lại.', errPremiumAccess:'Thông tin truy cập Premium không hợp lệ.', errAnalyze:'Yêu cầu máy chủ phân tích AI thất bại.', errUnknown:'Đã xảy ra lỗi không xác định.' },
  ja: { errApiKey:'OPENAI_API_KEYが設定されていません。', errQuota:'AI分析サーバー利用上限が一時的に制限されています。管理者確認後に再度ご利用ください。', errImageFormat:'画像形式が正しくありません。再撮影してください。', errImageSize:'画像サイズが大きすぎます。カメラを再起動して再試行してください。', errPremiumAccess:'プレミアムアクセス情報が正しくありません。', errAnalyze:'AI詳細分析サーバーへのリクエストに失敗しました。', errUnknown:'不明なエラーが発生しました。' },
  zh: { errApiKey:'尚未设置 OPENAI_API_KEY。', errQuota:'AI分析服务器使用额度暂时受限，请管理员确认后再试。', errImageFormat:'图像格式无效，请重新拍摄。', errImageSize:'图像过大，请重启相机后重试。', errPremiumAccess:'高级访问凭证无效。', errAnalyze:'AI详细分析服务器请求失败。', errUnknown:'发生未知错误。' },
  ar: { errApiKey:'لم يتم إعداد OPENAI_API_KEY.', errQuota:'استخدام خادم تحليل الذكاء الاصطناعي محدود مؤقتًا. يرجى المحاولة بعد مراجعة المسؤول.', errImageFormat:'تنسيق الصورة غير صالح. يرجى التصوير مرة أخرى.', errImageSize:'الصورة كبيرة جدًا. أعد تشغيل الكاميرا وحاول مرة أخرى.', errPremiumAccess:'معلومات الوصول المميز غير صالحة.', errAnalyze:'فشل طلب خادم تحليل الذكاء الاصطناعي.', errUnknown:'حدث خطأ غير معروف.' },
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

function normalizeLanguage(value) {
  const lang = String(value || '').toLowerCase();
  const normalized = { jp: 'ja', cn: 'zh' }[lang] || lang;
  return ['ko','en','vi','ja','zh','ar'].includes(normalized) ? normalized : 'ko';
}

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.trim()) || '';
}

function errorResponse(statusCode, code, message, details) {
  return response(statusCode, {
    ok: false,
    code,
    error: message,
    message,
    ...(details ? { details } : {}),
  });
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

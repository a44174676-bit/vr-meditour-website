exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return response(405, { ok: false, error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  if (!apiKey) {
    return response(500, {
      ok: false,
      error: 'OPENAI_API_KEY가 설정되지 않았습니다. Netlify 환경변수에서 OPENAI_API_KEY를 설정하세요.'
    });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const imageBase64 = body.imageBase64;

    if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
      return response(400, { ok: false, error: 'imageBase64가 없거나 형식이 올바르지 않습니다. data:image/로 시작해야 합니다.' });
    }

    if (imageBase64.length > 6000000) {
      return response(413, { ok: false, error: '이미지 데이터가 너무 큽니다. 더 작은 이미지로 다시 시도해 주세요.' });
    }

    const prompt = `당신은 피부·뷰티 참고 분석 AI입니다. 이 결과는 의료 진단이 아닙니다.
질병명을 단정하지 말고, 치료 지시나 약물 추천을 하지 마세요.
피부과 상담 권고는 "증상이 지속되거나 불편감이 있는 경우 전문의 상담 권장" 수준으로 작성하세요.
반드시 아래 JSON Schema에 정확히 맞는 JSON만 출력하세요.
{
  "summary": "string",
  "confidence": number,
  "observations": ["string"],
  "care_priority": ["string"],
  "recommended_product_direction": ["string"],
  "dermatology_consult_recommendation": "string"
}`;

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: imageBase64 }] }],
        text: {
          format: {
            type: 'json_schema',
            name: 'skin_analysis',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                summary: { type: 'string' },
                confidence: { type: 'number' },
                observations: { type: 'array', items: { type: 'string' } },
                care_priority: { type: 'array', items: { type: 'string' } },
                recommended_product_direction: { type: 'array', items: { type: 'string' } },
                dermatology_consult_recommendation: { type: 'string' }
              },
              required: ['summary', 'confidence', 'observations', 'care_priority', 'recommended_product_direction', 'dermatology_consult_recommendation']
            }
          }
        }
      })
    });

    const payload = await openaiRes.json();
    if (!openaiRes.ok) {
      return response(openaiRes.status, {
        ok: false,
        error: payload.error?.message || 'OpenAI API 호출 실패'
      });
    }

    const outputText = payload.output_text || payload.output?.[0]?.content?.find((c) => c.type === 'output_text')?.text;

    if (!outputText) {
      return response(502, {
        ok: false,
        error: 'AI 응답에서 분석 텍스트를 찾지 못했습니다. 잠시 후 다시 시도해 주세요.'
      });
    }

    let analysis;
    try {
      analysis = JSON.parse(outputText);
    } catch (_error) {
      return response(502, {
        ok: false,
        error: 'AI 응답 해석에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      });
    }

    return response(200, { ok: true, analysis });
  } catch (_error) {
    return response(500, { ok: false, error: '분석 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

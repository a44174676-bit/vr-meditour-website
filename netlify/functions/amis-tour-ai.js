exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return response(405, fail('invalid_request_body'));
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {
    return response(400, fail('invalid_request_body'));
  }

  const language = ['ko', 'en', 'vi', 'ja', 'zh'].includes(body.language) ? body.language : 'ko';
  const required = ['purpose', 'area', 'days', 'category'];
  for (const field of required) {
    if (!String(body[field] || '').trim()) {
      return response(400, fail('invalid_request_body'));
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  if (!apiKey) return response(500, fail('missing_openai_key'));

  const prompt = [
    '너는 VR MEDI TOUR & HOME의 AMIS Travel Lounge AI 관광 루트 컨시어지다.',
    '부산 방문 외국인 관광객에게 안전하고 현실적인 관광 루트를 추천한다.',
    '의료 진단, 치료 보장, 예약 확정, 가격 확정 표현은 절대 사용하지 않는다.',
    '의료관광은 “사전상담” 또는 “담당자 확인 후 안내”로만 표현한다.',
    '특정 아티스트 공식 협력, 공식 티켓, 공식 굿즈 판매처럼 보이는 표현도 사용하지 않는다.',
    `선택 언어 코드: ${language}`,
    `입력 데이터: ${JSON.stringify({ purpose: body.purpose, area: body.area, days: body.days, category: body.category, language, message: body.message || '' })}`,
    '사용자가 선택한 language 값에 따라 모든 응답 필드 값은 해당 언어로 작성하라. JSON key는 영어로 유지하라.',
    'language=ko는 Korean, en은 English, vi는 Vietnamese, ja는 Japanese, zh는 Simplified Chinese를 의미한다.',
    '반드시 JSON으로만 답하고, 아래 키를 정확히 사용하라: ok, title, summary, items, notice',
    'items 각 원소 키: day, spot_name, area, description, recommended_time, transport, tip',
    'notice에는 다음 문장을 포함하라: 이 루트는 참고용 추천이며, 실제 운영 여부와 예약 가능 여부는 담당자 확인 후 안내됩니다.'
  ].join('\n');

  const schema = {
    type: 'object', additionalProperties: false,
    properties: {
      ok: { type: 'boolean' },
      title: { type: 'string' },
      summary: { type: 'string' },
      items: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, properties: {
        day: { type: 'string' }, spot_name: { type: 'string' }, area: { type: 'string' }, description: { type: 'string' }, recommended_time: { type: 'string' }, transport: { type: 'string' }, tip: { type: 'string' }
      }, required: ['day', 'spot_name', 'area', 'description', 'recommended_time', 'transport', 'tip'] } },
      notice: { type: 'string' }
    }, required: ['ok', 'title', 'summary', 'items', 'notice']
  };

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }], text: { format: { type: 'json_schema', name: 'amis_tour_route', schema } } })
    });

    const payload = await openaiRes.json();
    if (!openaiRes.ok) {
      const em = payload?.error?.message || '';
      const code = /model/i.test(em) ? 'openai_invalid_model' : 'openai_request_failed';
      console.error('AMIS OpenAI error:', openaiRes.status, code, em);
      return response(openaiRes.status, fail(code));
    }

    const outputText = extractOutputText(payload);
    if (!outputText) {
      console.error('AMIS output parse failed: output_text missing');
      return response(502, fail('openai_json_parse_failed'));
    }

    let result;
    try { result = JSON.parse(outputText); } catch (error) {
      console.error('AMIS JSON parse failed:', error?.message || 'unknown');
      return response(502, fail('openai_json_parse_failed'));
    }

    return response(200, {
      ok: true,
      title: result.title || '추천 부산 관광 루트',
      summary: result.summary || '입력한 조건을 기반으로 참고용 동선을 제안합니다.',
      items: Array.isArray(result.items) ? result.items : [],
      notice: result.notice || '이 루트는 참고용 추천이며, 실제 운영 여부와 예약 가능 여부는 담당자 확인 후 안내됩니다.'
    });
  } catch (error) {
    console.error('AMIS function error:', error?.name || 'unknown', error?.message || '');
    return response(500, fail('unknown_error'));
  }
};

function extractOutputText(payload) {
  if (payload?.output_text && typeof payload.output_text === 'string') return payload.output_text;
  if (!Array.isArray(payload?.output)) return '';
  for (const item of payload.output) {
    if (!Array.isArray(item?.content)) continue;
    for (const content of item.content) {
      if ((content?.type === 'output_text' || content?.type === 'text') && typeof content.text === 'string') return content.text;
    }
  }
  return '';
}

function fail(error_code) {
  return { ok: false, error_code, message: '요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
}

function response(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) };
}

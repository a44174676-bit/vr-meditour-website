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

  const publicDataContext = await getPublicDataContext({
    area: body.area,
    purpose: body.purpose,
    category: body.category,
    language
  });

  const prompt = [
    '너는 VR MEDI TOUR & HOME의 AMIS Travel Lounge AI 관광 루트 컨시어지다.',
    '부산 방문 외국인 관광객에게 안전하고 현실적인 관광 루트를 추천한다.',
    '의료 진단, 치료 보장, 예약 확정, 가격 확정 표현은 절대 사용하지 않는다.',
    '의료관광은 “사전상담” 또는 “담당자 확인 후 안내”로만 표현한다.',
    '특정 아티스트 공식 협력, 공식 티켓, 공식 굿즈 판매처럼 보이는 표현도 사용하지 않는다.',
    '공공데이터가 제공되면 참고하되, 실제 운영 여부와 예약 가능 여부는 담당자 확인 후 안내한다고 표현한다.',
    `선택 언어 코드: ${language}`,
    `입력 데이터: ${JSON.stringify({ purpose: body.purpose, area: body.area, days: body.days, category: body.category, language, message: body.message || '' })}`,
    `공공데이터 참고자료: ${JSON.stringify(publicDataContext)}`,
    '사용자가 선택한 language 값에 따라 모든 응답 필드 값은 해당 언어로 작성하라. JSON key는 영어로 유지하라.',
    'language=ko는 Korean, en은 English, vi는 Vietnamese, ja는 Japanese, zh는 Simplified Chinese를 의미한다.',
    '반드시 JSON으로만 답하고, 아래 키를 정확히 사용하라: ok, title, summary, items, notice, public_data_used',
    'items 각 원소 키: day, spot_name, area, description, recommended_time, transport, tip',
    'notice에는 다음 취지를 포함하라: 이 루트는 참고용 추천이며, 실제 운영 여부와 예약 가능 여부는 담당자 확인 후 안내됩니다.'
  ].join('\n');

  const schema = {
    type: 'object', additionalProperties: false,
    properties: {
      ok: { type: 'boolean' },
      title: { type: 'string' },
      summary: { type: 'string' },
      public_data_used: { type: 'boolean' },
      items: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, properties: {
        day: { type: 'string' }, spot_name: { type: 'string' }, area: { type: 'string' }, description: { type: 'string' }, recommended_time: { type: 'string' }, transport: { type: 'string' }, tip: { type: 'string' }
      }, required: ['day', 'spot_name', 'area', 'description', 'recommended_time', 'transport', 'tip'] } },
      notice: { type: 'string' }
    }, required: ['ok', 'title', 'summary', 'public_data_used', 'items', 'notice']
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
      public_data_used: Boolean(result.public_data_used || publicDataContext.used),
      public_data_source: publicDataContext.source,
      public_data_status: publicDataContext.status,
      items: Array.isArray(result.items) ? result.items : [],
      notice: result.notice || '이 루트는 참고용 추천이며, 실제 운영 여부와 예약 가능 여부는 담당자 확인 후 안내됩니다.'
    });
  } catch (error) {
    console.error('AMIS function error:', error?.name || 'unknown', error?.message || '');
    return response(500, fail('unknown_error'));
  }
};

async function getPublicDataContext(input) {
  const serviceKey = process.env.PUBLIC_DATA_DECODING_KEY || process.env.PUBLIC_DATA_ENCODING_KEY;
  const baseUrl = process.env.PUBLIC_DATA_TOUR_API_URL || 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';

  if (!serviceKey) {
    return {
      used: false,
      status: 'missing_public_data_key',
      source: 'KTO TourAPI areaBasedList2',
      items: defaultBusanPlaces()
    };
  }

  const contentTypeId = resolveContentTypeId(input);
  const params = new URLSearchParams({
    serviceKey,
    MobileOS: 'ETC',
    MobileApp: 'AMIS_TRAVEL_LOUNGE',
    _type: 'json',
    areaCode: '6',
    numOfRows: '8',
    pageNo: '1',
    arrange: 'A'
  });
  if (contentTypeId) params.set('contentTypeId', contentTypeId);

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    const text = await res.text();
    if (!res.ok) {
      console.error('Public Data API HTTP error:', res.status, text.slice(0, 300));
      return { used: false, status: `public_data_http_${res.status}`, source: 'KTO TourAPI areaBasedList2', items: defaultBusanPlaces() };
    }

    let json;
    try { json = JSON.parse(text); } catch (error) {
      console.error('Public Data API JSON parse error:', error?.message || 'unknown', text.slice(0, 300));
      return { used: false, status: 'public_data_json_parse_failed', source: 'KTO TourAPI areaBasedList2', items: defaultBusanPlaces() };
    }

    const rawItems = json?.response?.body?.items?.item;
    const list = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const items = list.slice(0, 8).map((item) => ({
      title: item.title || '',
      address: item.addr1 || '',
      area: item.areacode || '6',
      content_type: item.contenttypeid || '',
      mapx: item.mapx || '',
      mapy: item.mapy || '',
      tel: item.tel || ''
    })).filter((item) => item.title);

    return {
      used: items.length > 0,
      status: items.length > 0 ? 'ok' : 'public_data_empty',
      source: 'KTO TourAPI areaBasedList2',
      items: items.length > 0 ? items : defaultBusanPlaces()
    };
  } catch (error) {
    console.error('Public Data API fetch failed:', error?.name || 'unknown', error?.message || '');
    return { used: false, status: 'public_data_fetch_failed', source: 'KTO TourAPI areaBasedList2', items: defaultBusanPlaces() };
  }
}

function resolveContentTypeId(input) {
  const text = [input?.purpose, input?.category, input?.area].join(' ').toLowerCase();
  if (/숙박|hotel|stay|accommodation/.test(text)) return '32';
  if (/음식|식사|맛집|food|restaurant/.test(text)) return '39';
  if (/쇼핑|뷰티|beauty|shopping/.test(text)) return '38';
  if (/축제|공연|event|festival|k-pop/.test(text)) return '15';
  return '12';
}

function defaultBusanPlaces() {
  return [
    { title: '서면메디컬스트리트', address: '부산광역시 부산진구 가야대로 787', content_type: 'local' },
    { title: '김해국제공항', address: '부산광역시 강서구 공항진입로 108', content_type: 'transport' },
    { title: '부산역', address: '부산광역시 동구 중앙대로 206', content_type: 'transport' },
    { title: '아미동 비석문화마을', address: '부산광역시 서구 아미동 일대', content_type: 'local' },
    { title: '남포동·국제시장·자갈치시장', address: '부산광역시 중구 남포동 일대', content_type: 'local' },
    { title: '감천문화마을', address: '부산광역시 사하구 감내2로 203', content_type: 'tour' }
  ];
}

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

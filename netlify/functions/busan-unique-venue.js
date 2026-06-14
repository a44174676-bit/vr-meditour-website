const SOURCE = "부산관광공사_유니크베뉴";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=300"
};

const FALLBACK_VENUES = [
  {
    name: "부산현대미술관",
    area: "사하구",
    type: "문화·예술",
    description: "낙동강 하구의 자연환경과 현대미술 전시를 함께 경험할 수 있는 문화 공간입니다.",
    recommendedFor: ["관광", "의료관광", "웰니스"]
  },
  {
    name: "영화의전당",
    area: "해운대구 센텀시티",
    type: "문화·관광",
    description: "부산국제영화제의 상징적인 공간으로, 야외 건축과 문화 프로그램을 즐기기 좋습니다.",
    recommendedFor: ["관광", "의료관광", "K-뷰티"]
  },
  {
    name: "F1963",
    area: "수영구",
    type: "복합문화",
    description: "와이어 공장을 재생한 복합문화공간으로 전시, 서점, 카페와 감성적인 사진 명소를 갖추고 있습니다.",
    recommendedFor: ["관광", "K-뷰티", "웰니스"]
  },
  {
    name: "누리마루 APEC 하우스",
    area: "해운대구 동백섬",
    type: "수변·관광",
    description: "동백섬과 해운대 바다를 함께 조망할 수 있어 짧은 산책과 부산다운 수변 풍경 감상에 적합합니다.",
    recommendedFor: ["관광", "K-뷰티", "웰니스"]
  },
  {
    name: "부산시민공원",
    area: "부산진구",
    type: "자연·휴식",
    description: "서면과 가까우며 평탄한 산책로와 휴식 공간이 있어 상담 전후 가볍게 방문하기 좋습니다.",
    recommendedFor: ["의료관광", "웰니스", "관광"]
  }
];

function jsonResponse(statusCode, payload) {
  return { statusCode, headers: HEADERS, body: JSON.stringify(payload) };
}

function getValue(item, keys) {
  for (const key of keys) {
    if (item && item[key] !== undefined && item[key] !== null && String(item[key]).trim()) {
      return item[key];
    }
  }
  return "";
}

function toRecommendedFor(value, type, description) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  const text = [value, type, description].filter(Boolean).join(" ");
  const purposes = [];
  if (/문화|관광|전시|공연|역사/i.test(text)) purposes.push("관광");
  if (/휴식|산책|공원|자연|수변|회복/i.test(text)) purposes.push("의료관광", "웰니스");
  if (/사진|쇼핑|감성|디자인|복합문화|K-?뷰티|뷰티/i.test(text)) purposes.push("K-뷰티");
  return [...new Set(purposes.length ? purposes : ["관광"] )];
}

function normalizeVenue(item) {
  const name = String(getValue(item, ["name", "venueName", "venue_name", "title", "TITLE", "MAIN_TITLE", "시설명", "장소명"])).trim();
  if (!name) return null;

  const area = String(getValue(item, ["area", "region", "district", "gugunNm", "GUGUN_NM", "address", "addr1", "ADDR1", "구군", "소재지"])).trim() || "부산";
  const type = String(getValue(item, ["type", "category", "venueType", "venue_type", "CATEGORY", "분류", "시설유형"])).trim() || "유니크베뉴";
  const description = String(getValue(item, ["description", "summary", "content", "contents", "ITEMCNTNTS", "INTRODUCTION", "설명", "소개"])).trim() || `${name}의 공간 특성과 운영 정보를 확인해 방문 계획에 활용할 수 있습니다.`;
  const recommended = getValue(item, ["recommendedFor", "recommended_for", "recommendation", "추천대상"]);

  return {
    name,
    area,
    type,
    description,
    recommendedFor: toRecommendedFor(recommended, type, description)
  };
}

function findItemArray(value, depth = 0) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 6) return [];

  const preferredKeys = ["venues", "items", "item", "data", "records", "results", "result"];
  for (const key of preferredKeys) {
    if (value[key] === undefined) continue;
    const found = findItemArray(value[key], depth + 1);
    if (found.length) return found;
  }

  for (const nested of Object.values(value)) {
    const found = findItemArray(nested, depth + 1);
    if (found.length) return found;
  }
  return [];
}

function extractItems(payload) {
  return findItemArray(payload);
}

function buildApiUrl(baseUrl, apiKey) {
  const encodedKey = encodeURIComponent(apiKey || "");
  const replaced = baseUrl
    .replaceAll("{BUSAN_UNIQUE_VENUE_API_KEY}", encodedKey)
    .replaceAll("{serviceKey}", encodedKey)
    .replaceAll("{apiKey}", encodedKey);
  const url = new URL(replaced);

  const usedPlaceholder = replaced !== baseUrl;
  if (apiKey && !usedPlaceholder && !url.searchParams.has("serviceKey") && !url.searchParams.has("apiKey")) {
    url.searchParams.set("serviceKey", apiKey);
  }
  return url.toString();
}

async function fetchVenues(apiUrl, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(buildApiUrl(apiUrl, apiKey), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`upstream_http_${response.status}`);

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (_) {
      throw new Error("upstream_invalid_json");
    }

    const venues = extractItems(payload).map(normalizeVenue).filter(Boolean).slice(0, 20);
    if (!venues.length) throw new Error("upstream_empty");
    return venues;
  } finally {
    clearTimeout(timeout);
  }
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { ok: false, source: SOURCE, message: "GET 방식만 지원합니다.", venues: [] });
  }

  const apiKey = process.env.BUSAN_UNIQUE_VENUE_API_KEY || "";
  const apiUrl = process.env.BUSAN_UNIQUE_VENUE_API_URL || "";
  const envCheck = { hasApiKey: Boolean(apiKey), hasApiUrl: Boolean(apiUrl) };

  if (!apiUrl) {
    return jsonResponse(200, {
      ok: true,
      source: SOURCE,
      envCheck,
      fallback: true,
      status: "missing_api_url",
      venues: FALLBACK_VENUES
    });
  }

  try {
    const venues = await fetchVenues(apiUrl, apiKey);
    return jsonResponse(200, {
      ok: true,
      source: SOURCE,
      envCheck,
      fallback: false,
      status: "ok",
      venues
    });
  } catch (error) {
    console.error("busan-unique-venue fallback:", error?.name || "Error", error?.message || "unknown");
    return jsonResponse(200, {
      ok: true,
      source: SOURCE,
      envCheck,
      fallback: true,
      status: "api_fallback",
      venues: FALLBACK_VENUES
    });
  }
};

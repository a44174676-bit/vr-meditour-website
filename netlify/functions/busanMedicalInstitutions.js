// netlify/functions/busanMedicalInstitutions.js
// Medi Hana Busan Care Finder
// 부산 외국인환자 유치 등록기관 공공데이터 프록시 함수

const API_ENDPOINT = "http://apis.data.go.kr/6260000/MedicalTourInstiService/getMedicTourInstiInfo";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=3600"
};

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload)
  };
}

function toPositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function countryAliases(country) {
  const c = normalizeText(country);
  const aliases = {
    "베트남": ["베트남", "vietnam", "viet nam", "việtnam", "việt nam"],
    "일본": ["일본", "japan", "jp", "日本"],
    "중국": ["중국", "china", "cn", "中国", "中國"],
    "러시아": ["러시아", "russia", "ru"],
    "몽골": ["몽골", "mongolia"],
    "미국": ["미국", "usa", "unitedstates", "america"]
  };

  for (const [ko, list] of Object.entries(aliases)) {
    if (list.map(normalizeText).includes(c)) {
      return list.map(normalizeText).concat(normalizeText(ko));
    }
  }

  return c ? [c] : [];
}

function getItemValue(item, ...keys) {
  for (const key of keys) {
    if (item && item[key] !== undefined && item[key] !== null) return item[key];
  }
  return "";
}

function normalizeItem(item) {
  return {
    regNo: getItemValue(item, "regNo", "reg_no"),
    businessNm: getItemValue(item, "businessNm", "business_nm"),
    instiGubun: getItemValue(item, "instiGubun", "insti_gubun"),
    region: getItemValue(item, "region"),
    addr: getItemValue(item, "addr"),
    targetCountry: getItemValue(item, "targetCountry", "target_country"),
    gubun: getItemValue(item, "gubun")
  };
}

function extractItems(data) {
  const body = data?.response?.body || data?.body || {};
  const items = body?.items?.item || body?.items || data?.items?.item || data?.items || [];
  if (Array.isArray(items)) return items;
  if (items && typeof items === "object") return [items];
  return [];
}

function extractHeader(data) {
  return data?.response?.header || data?.header || {};
}

function extractTotalCount(data, fallbackLength) {
  const body = data?.response?.body || data?.body || {};
  const total = Number.parseInt(body.totalCount || data?.totalCount, 10);
  return Number.isFinite(total) ? total : fallbackLength;
}

function applyLocalFilters(items, { country, keyword, gubun }) {
  let result = [...items];

  if (gubun) {
    const g = normalizeText(gubun);
    result = result.filter((item) => normalizeText(item.gubun).includes(g));
  }

  if (country) {
    const aliases = countryAliases(country);
    result = result.filter((item) => {
      const target = normalizeText(item.targetCountry);
      return aliases.some((alias) => target.includes(alias));
    });
  }

  if (keyword) {
    const k = normalizeText(keyword);
    result = result.filter((item) => {
      return (
        normalizeText(item.businessNm).includes(k) ||
        normalizeText(item.addr).includes(k) ||
        normalizeText(item.instiGubun).includes(k)
      );
    });
  }

  return result;
}

function buildApiUrl({ pageNo, numOfRows, gubun }) {
  const apiKey = process.env.BUSAN_MEDICAL_API_KEY;
  const isEncoded = process.env.BUSAN_MEDICAL_API_KEY_IS_ENCODED === "true";

  if (!apiKey) throw new Error("Missing BUSAN_MEDICAL_API_KEY");

  const encodedServiceKey = isEncoded ? apiKey : encodeURIComponent(apiKey);
  const params = new URLSearchParams();
  params.set("numOfRows", String(numOfRows));
  params.set("pageNo", String(pageNo));
  params.set("region", "부산");
  params.set("resultType", "json");
  if (gubun) params.set("gubun", gubun);

  return `${API_ENDPOINT}?serviceKey=${encodedServiceKey}&${params.toString()}`;
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: DEFAULT_HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { ok: false, message: "GET 방식만 지원합니다.", items: [] });
  }

  const pageNo = toPositiveInt(event.queryStringParameters?.pageNo || "1", 1, 9999);
  const numOfRows = toPositiveInt(event.queryStringParameters?.numOfRows || "100", 100, 300);
  const country = event.queryStringParameters?.country || "";
  const keyword = event.queryStringParameters?.keyword || "";
  const gubun = event.queryStringParameters?.gubun || "";

  try {
    const apiUrl = buildApiUrl({ pageNo, numOfRows, gubun });
    const apiResponse = await fetch(apiUrl, { method: "GET", headers: { Accept: "application/json" } });
    const rawText = await apiResponse.text();

    if (!apiResponse.ok) {
      return jsonResponse(502, {
        ok: false,
        message: "공공데이터 API 응답이 정상적이지 않습니다. 상담 신청은 계속 가능합니다.",
        status: apiResponse.status,
        items: []
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      return jsonResponse(502, {
        ok: false,
        message: "공공데이터 API가 JSON 형식으로 응답하지 않았습니다. 인증키 또는 resultType 설정을 확인하세요.",
        items: [],
        debug: { firstChars: rawText.slice(0, 120) }
      });
    }

    const header = extractHeader(data);
    const resultCode = header.resultCode || header.result_code || "";
    const resultMsg = header.resultMsg || header.result_msg || "";
    const normalizedItems = extractItems(data).map(normalizeItem);
    const filteredItems = applyLocalFilters(normalizedItems, { country, keyword, gubun });

    return jsonResponse(200, {
      ok: true,
      message: "부산 외국인환자 유치 등록기관 정보를 불러왔습니다.",
      source: "부산 외국인환자 유치기관 공공데이터",
      pageNo,
      numOfRows,
      totalCount: extractTotalCount(data, normalizedItems.length),
      returnedCount: filteredItems.length,
      resultCode,
      resultMsg,
      filters: { region: "부산", country: country || null, keyword: keyword || null, gubun: gubun || null },
      items: filteredItems
    });
  } catch (error) {
    console.error("busanMedicalInstitutions error:", error);
    return jsonResponse(500, {
      ok: false,
      message: "현재 등록기관 정보를 불러오지 못했습니다. 상담 신청은 계속 가능합니다.",
      items: []
    });
  }
};

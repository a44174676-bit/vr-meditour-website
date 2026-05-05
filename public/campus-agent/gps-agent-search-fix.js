// Search-priority patch for BUFS AI Campus Agent.
// Fixes: "AI 부트캠프" must resolve to H Library, not A Global Center.
// Fixes: Japanese/Chinese/Vietnamese/English facility names are searched across all registered language data.
(function () {
  const normalizeText = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\s\u3000·・\/\-_:：,，.。()（）\[\]{}]/g, "");

  const explicitFacilityRules = [
    {
      code: "H",
      keywords: [
        "ai부트캠프", "부트캠프", "aibootcamp", "ai bootcamp", "aiブートキャンプ", "ブートキャンプ",
        "창업지원단", "創業支援団", "创业支援团", "startup support", "startupsupport"
      ]
    },
    {
      code: "J",
      keywords: [
        "대학교회", "대학 교회", "교회", "universitychurch", "university church",
        "大学教会", "大学 教会", "教会", "大学教会", "大学 教会",
        "nhàthờđạihọc", "nhà thờ đại học", "nhàthờ", "礼拝", "礼拜", "예배", "기도회", "祈祷会", "祷告会"
      ]
    },
    {
      code: "A",
      keywords: ["국제교류처", "global lounge", "globallounge", "internationalaffairs", "国際交流処", "国际交流处", "글로벌센터"]
    },
    {
      code: "G",
      keywords: ["보건진료실", "healthclinic", "保健診療室", "保健诊疗室"]
    }
  ];

  const extraAliases = {
    A: ["globalcenter", "글로벌센터", "グローバルセンター", "全球中心", "trungtâmtoàncầu", "국제교류처", "internationalaffairs", "国際交流処", "国际交流处"],
    B: ["gymnasium", "체육관", "体育館", "体育馆", "nhàthểthao", "헬스장", "fitness", "ジム", "健身房"],
    C: ["dormitory", "기숙사", "寮", "宿舍", "kýtúcxá", "residencehall", "生活館", "生活馆"],
    D: ["trinityhall", "트리니티홀", "トリニティホール", "三一厅", "pclab", "pc실습실"],
    E: ["memorialsquare", "메모리얼광장", "メモリアル広場", "纪念广场"],
    F: ["administrationcenter", "대학본부", "大学本部", "tòanhàhànhchính", "행정", "行政"],
    G: ["manomemorialhall", "만오기념관", "マンオ記念館", "万五纪念馆", "보건진료실", "保健診療室", "保健诊疗室", "healthclinic"],
    H: ["library", "도서관", "図書館", "图书馆", "thưviện", "aibootcamp", "ai부트캠프", "aiブートキャンプ", "창업지원단", "創業支援団", "创业支援团"],
    I: ["businesstechcenter", "비즈니스텍센터", "ビジネステックセンター", "商务科技中心", "trungtâmbusinesstech"],
    J: ["universitychurch", "대학교회", "大学教会", "大学教会", "大学 教会", "教会", "大学教会", "nhàthờđạihọc", "건학이념", "建学理念", "建校理念", "잠언", "箴言"]
  };

  function collectTargets(building) {
    const targets = [building.query, ...(building.aliases || []), ...(extraAliases[building.code] || [])];
    Object.values(building.text || {}).forEach((text) => {
      targets.push(text.name, text.en, text.type, text.summary);
      (text.rows || []).forEach((row) => targets.push(...row));
    });
    return targets.filter(Boolean).map(normalizeText).filter((target) => target.length >= 2);
  }

  function matchesExplicitCode(question, code) {
    const upper = String(question || "").toUpperCase().trim();
    const compact = upper.replace(/\s+/g, "");
    return compact === code || compact === `${code}동` || compact === `${code}관` || compact === `${code}건물` || compact === `${code}BUILDING`;
  }

  window.findCampusBuildingAllLanguages = function findCampusBuildingAllLanguages(question) {
    const q = normalizeText(question);
    const raw = String(question || "");
    if (!q) return null;

    // 1. Explicit facility rules first. This prevents "AI" from being mistaken for code A.
    for (const rule of explicitFacilityRules) {
      if (rule.keywords.some((keyword) => q.includes(normalizeText(keyword)))) {
        return buildings.find((building) => building.code === rule.code) || null;
      }
    }

    // 2. Building code only when the user clearly says A동/A관/A건물 or just A.
    const explicitCode = buildings.find((building) => matchesExplicitCode(raw, building.code));
    if (explicitCode) return explicitCode;

    // 3. Multilingual full-data search. Single-letter building codes are excluded here.
    let best = null;
    let bestScore = 0;
    buildings.forEach((building) => {
      const targets = collectTargets(building);
      targets.forEach((target) => {
        let score = 0;
        if (q === target) score = 1000 + target.length;
        else if (q.includes(target)) score = 500 + target.length;
        else if (target.includes(q) && q.length >= 2) score = 300 + q.length;
        if (score > bestScore) {
          bestScore = score;
          best = building;
        }
      });
    });
    return best;
  };

  window.buildCampusAgentAnswer = function buildCampusAgentAnswer(building) {
    const lang = typeof currentLang !== "undefined" ? currentLang : "ko";
    const text = (building.text && (building.text[lang] || building.text.ko)) || building.text.ko;
    const rows = (text.rows || []).map(([label, value]) => `${label}: ${value}`).join("\n");
    const messages = {
      ko: {
        intro: `${building.code} ${text.name} 안내입니다.`,
        gps: currentPosition ? "현재 위치가 확인되어 있으므로 지도에서 목적지 건물을 확인한 뒤 이동 안내를 이어갈 수 있습니다." : "현재 위치 확인을 먼저 누르면 GPS 기준 안내를 함께 사용할 수 있습니다."
      },
      en: {
        intro: `${building.code} ${text.name} guide.`,
        gps: currentPosition ? "Your current location is confirmed, so you can continue with map-based guidance." : "Tap Find my location first to use GPS-based guidance."
      },
      vi: {
        intro: `Hướng dẫn ${building.code} ${text.name}.`,
        gps: currentPosition ? "Vị trí hiện tại đã được xác nhận, bạn có thể tiếp tục xem hướng dẫn trên bản đồ." : "Hãy bấm Tìm vị trí của tôi trước để dùng hướng dẫn GPS."
      },
      ja: {
        intro: `${building.code} ${text.name}の案内です。`,
        gps: currentPosition ? "現在地が確認されているため、地図で目的地を確認して案内を続けられます。" : "先に現在地を確認すると、GPS基準の案内も利用できます。"
      },
      zh: {
        intro: `${building.code} ${text.name}指南。`,
        gps: currentPosition ? "当前位置已确认，可在地图上确认目的地后继续导航。" : "请先点击查找我的位置，以使用GPS导航。"
      }
    };
    const msg = messages[lang] || messages.ko;
    return `${msg.intro}\n${text.summary}\n\n${rows}\n\n${msg.gps}`;
  };

  // Override original gps-agent.js search functions.
  findBuildingByQuestion = function findBuildingByQuestion(question) {
    return window.findCampusBuildingAllLanguages(question);
  };

  answerAgent = function answerAgent() {
    const question = document.querySelector("#agentQuestion").value.trim();
    const answerBox = document.querySelector("#agentAnswer");
    if (!question) {
      answerBox.textContent = "질문을 입력해 주세요. 예: AI 부트캠프 어디야? / 大学教会";
      return;
    }
    const found = window.findCampusBuildingAllLanguages(question);
    if (!found) {
      answerBox.textContent = "현재 등록된 건물 데이터에서 해당 시설을 찾지 못했습니다. 한국어·영어·베트남어·일본어·중국어 건물명 또는 시설명을 다시 입력해 주세요. 확인되지 않은 정보는 임의로 안내하지 않습니다.";
      return;
    }
    selectBuilding(found.code);
    answerBox.textContent = window.buildCampusAgentAnswer(found);
    document.querySelector("#selectedName").scrollIntoView({ behavior: "smooth", block: "center" });
  };
})();

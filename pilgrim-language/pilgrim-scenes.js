var PILGRIM_SCENES = Object.freeze([
    {
      id: "scene.city.introduction",
      chapterId: "chapter.city_of_destruction",
      order: 1,
      type: "narration",
      titleKo: "도시에서 만난 사람",
      titleVi: "Người gặp trong thành phố",
      transitionKo: "해 질 무렵, 성벽 아래에서 한 사람을 만났습니다.",
      environment: { backgroundId: "environment.city_dusk", asset: "./assets/scenes/chapter-01-hero.png", atmosphere: "quiet_tension", time: "dusk" },
      visual: { image: "./assets/scenes/chapter-01-hero.png", mobileImage: null, desktopPosition: "55% center", mobilePosition: "52% center", panelPlacement: "left-bottom", overlayTone: "light", colorTheme: "city", imageAltKo: "멸망의 도시를 떠나 좁은 문을 바라보는 크리스천", imageAltVi: "Christian rời Thành Hủy Diệt và nhìn về phía cánh cổng hẹp" },
      characters: [{ characterId: "character.christian", asset: "./assets/legacy/characters/christian.svg", position: "center" }],
      lines: [
        { id: "line.city.introduction.01", sourceSentenceId: "sentence.city.departure.01", speakerId: "character.narrator", ko: "크리스천은 멸망의 도시에 살고 있었습니다.", vi: "Christian sống trong Thành Hủy Diệt.", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" }
      ],
      vocabularyIds: [],
      grammarIds: [],
      interaction: { type: "continue" },
      nextSceneId: "scene.city.must_leave"
    },
    {
      id: "scene.city.must_leave",
      chapterId: "chapter.city_of_destruction",
      order: 2,
      type: "discovery",
      titleKo: "떠나야 한다는 사실",
      titleVi: "Biết rằng phải rời đi",
      transitionKo: "크리스천은 더 이상 이곳에 머물 수 없다는 것을 알았습니다.",
      environment: { backgroundId: "environment.city_dusk", asset: "./assets/scenes/scene-02-searching-road.png", atmosphere: "decision", time: "dusk" },
      visual: { image: "./assets/scenes/scene-02-searching-road.png", mobileImage: null, desktopPosition: "42% center", mobilePosition: "38% center", panelPlacement: "right-bottom", overlayTone: "light", colorTheme: "uncertain-road", imageAltKo: "도시 밖 갈림길에서 먼 길을 바라보는 크리스천", imageAltVi: "Christian nhìn con đường xa bên ngoài thành phố" },
      characters: [{ characterId: "character.christian", asset: "./assets/legacy/characters/christian.svg", position: "left" }],
      lines: [
        { id: "line.city.must_leave.01", sourceSentenceId: "sentence.city.departure.02", speakerId: "character.narrator", ko: "그는 자신이 이곳을 떠나야 한다는 것을 알았습니다.", vi: "Anh biết rằng mình phải rời khỏi nơi này.", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" }
      ],
      vocabularyIds: ["word.leave", "word.decide"],
      grammarIds: ["grammar.must_do"],
      interaction: { type: "grammar_check", grammarId: "grammar.must_do" },
      nextSceneId: "scene.city.does_not_know"
    },
    {
      id: "scene.city.does_not_know",
      chapterId: "chapter.city_of_destruction",
      order: 3,
      type: "uncertainty",
      titleKo: "어디로 가야 할지",
      titleVi: "Không biết phải đi đâu",
      transitionKo: "도시 밖으로 이어지는 길은 보였지만, 방향은 알 수 없었습니다.",
      environment: { backgroundId: "environment.city_road", asset: "./assets/scenes/scene-03-crossroads.png", atmosphere: "uncertain", time: "early_evening" },
      visual: { image: "./assets/scenes/scene-03-crossroads.png", mobileImage: null, desktopPosition: "50% center", mobilePosition: "48% center", panelPlacement: "left-bottom", overlayTone: "dark", colorTheme: "uncertain-road", imageAltKo: "갈림길 앞에서 어느 길로 가야 할지 고민하는 크리스천", imageAltVi: "Christian suy nghĩ trước ngã rẽ vì không biết nên đi đường nào" },
      characters: [{ characterId: "character.christian", asset: "./assets/legacy/characters/christian.svg", position: "center" }],
      lines: [
        { id: "line.city.does_not_know.01", sourceSentenceId: "sentence.city.departure.03", speakerId: "character.narrator", ko: "그러나 어디로 가야 할지 몰랐습니다.", vi: "Tuy nhiên, anh không biết mình phải đi đâu.", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" }
      ],
      vocabularyIds: [],
      grammarIds: ["grammar.not_know_if"],
      interaction: { type: "reflection", promptKo: "모르는 길을 어떻게 물어보면 좋을까요?" },
      nextSceneId: "scene.city.evangelist_appears"
    },
    {
      id: "scene.city.evangelist_appears",
      chapterId: "chapter.city_of_destruction",
      order: 4,
      type: "npc_dialogue",
      titleKo: "전도자의 등장",
      titleVi: "Người Truyền Đạo xuất hiện",
      transitionKo: "그때, 길 저편에서 전도자가 다가왔습니다.",
      environment: { backgroundId: "environment.city_road", asset: "./assets/scenes/scene-05-evangelist-dialogue.png", atmosphere: "encounter", time: "early_evening" },
      visual: { image: "./assets/scenes/scene-05-evangelist-dialogue.png", mobileImage: null, desktopPosition: "50% center", mobilePosition: "46% center", panelPlacement: "center-bottom", overlayTone: "dark", colorTheme: "evangelist", imageAltKo: "도시 밖 길에서 크리스천에게 좁은 문을 가리키는 전도자", imageAltVi: "Người Truyền Đạo chỉ cánh cổng hẹp cho Christian" },
      characters: [
        { characterId: "character.christian", asset: "./assets/legacy/characters/christian.svg", position: "left" },
        { characterId: "character.evangelist", asset: "./assets/legacy/characters/evangelist.svg", position: "right" }
      ],
      lines: [
        { id: "line.city.evangelist_appears.01", sourceSentenceId: "sentence.city.departure.04", speakerId: "character.narrator", ko: "그때 전도자가 크리스천에게 다가왔습니다.", vi: "Lúc đó, Người Truyền Đạo đến gần Christian.", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" }
      ],
      vocabularyIds: [],
      grammarIds: [],
      interaction: {
        type: "speech_response",
        questId: "quest.evangelist_reason_01",
        npcLineKo: "왜 이곳을 떠나려고 합니까?",
        npcLineVi: "Tại sao bạn định rời khỏi nơi này?",
        requiredIntent: "find_new_path",
        keywords: ["새로운 길", "찾으려고", "찾고 싶습니다"],
        grammarTarget: "intention",
        supplementKo: "아직 정확히 모르지만, 새로운 길을 찾고 싶습니다.",
        supplementVi: "Tôi vẫn chưa biết rõ, nhưng tôi muốn tìm một con đường mới."
      },
      nextSceneId: "scene.city.asking_direction"
    },
    {
      id: "scene.city.asking_direction",
      chapterId: "chapter.city_of_destruction",
      order: 5,
      type: "dialogue",
      titleKo: "길을 묻는 크리스천",
      titleVi: "Christian hỏi đường",
      transitionKo: "크리스천은 용기를 내어 자신에게 필요한 것을 물었습니다.",
      environment: { backgroundId: "environment.city_road", asset: "./assets/scenes/scene-05-evangelist-dialogue.png", atmosphere: "conversation", time: "early_evening" },
      visual: { image: "./assets/scenes/scene-05-evangelist-dialogue.png", mobileImage: null, desktopPosition: "56% center", mobilePosition: "48% center", panelPlacement: "below-image", overlayTone: "none", colorTheme: "evangelist", imageAltKo: "좁은 문으로 이어지는 길에서 이야기하는 크리스천과 전도자", imageAltVi: "Christian và Người Truyền Đạo trò chuyện trên con đường đến cánh cổng hẹp" },
      characters: [
        { characterId: "character.christian", asset: "./assets/legacy/characters/christian.svg", position: "left" },
        { characterId: "character.evangelist", asset: "./assets/legacy/characters/evangelist.svg", position: "right" }
      ],
      lines: [
        { id: "line.city.asking_direction.01", sourceSentenceId: "sentence.city.departure.05", speakerId: "character.narrator", ko: "크리스천은 전도자에게 물었습니다.", vi: "Christian hỏi Người Truyền Đạo:", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" },
        { id: "line.city.asking_direction.02", sourceSentenceId: "sentence.city.departure.06", speakerId: "character.christian", ko: "“제가 무엇을 해야 합니까?”", vi: "“Tôi phải làm gì?”", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" }
      ],
      vocabularyIds: ["word.what_must_do"],
      grammarIds: ["grammar.must_do"],
      interaction: { type: "repeat_line", lineId: "line.city.asking_direction.02" },
      nextSceneId: "scene.city.first_departure"
    },
    {
      id: "scene.city.first_departure",
      chapterId: "chapter.city_of_destruction",
      order: 6,
      type: "direction",
      titleKo: "좁은 문을 향하여",
      titleVi: "Hướng về cánh cổng hẹp",
      transitionKo: "안개 너머로 작은 문과 그곳에 닿는 길이 보이기 시작했습니다.",
      environment: { backgroundId: "environment.narrow_gate_distance", asset: "./assets/scenes/scene-06-departure-to-gate.png", atmosphere: "hopeful_direction", time: "golden_hour" },
      visual: { image: "./assets/scenes/scene-06-departure-to-gate.png", mobileImage: null, desktopPosition: "58% center", mobilePosition: "55% center", panelPlacement: "center-bottom", overlayTone: "dark", colorTheme: "departure", imageAltKo: "좁은 문을 향해 길을 걷기 시작한 크리스천", imageAltVi: "Christian bắt đầu bước đi trên con đường hướng đến cánh cổng hẹp" },
      characters: [
        { characterId: "character.christian", asset: "./assets/legacy/characters/christian.svg", position: "left" },
        { characterId: "character.evangelist", asset: "./assets/legacy/characters/evangelist.svg", position: "right" }
      ],
      lines: [
        { id: "line.city.first_departure.01", sourceSentenceId: "sentence.city.departure.07", speakerId: "character.narrator", ko: "전도자는 멀리 있는 좁은 문을 가리키며 말했습니다.", vi: "Người Truyền Đạo chỉ về phía cánh cổng hẹp ở đằng xa và nói:", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" },
        { id: "line.city.first_departure.02", sourceSentenceId: "sentence.city.departure.08", speakerId: "character.evangelist", ko: "“저 문을 향해 걸어가십시오.”", vi: "“Hãy đi về phía cánh cổng đó.”", audioKoNormal: "", audioKoSlow: "", audioViNormal: "", audioViSlow: "" }
      ],
      vocabularyIds: ["word.head_toward", "word.point"],
      grammarIds: [],
      interaction: { type: "complete_chapter", nextLocationId: "location.slough_of_despond" },
      nextSceneId: null
    }
]);

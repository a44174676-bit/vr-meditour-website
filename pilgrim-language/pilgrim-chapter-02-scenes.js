(function () {
  "use strict";

  var imageRoot = "./assets/scenes/chapter-02-v2/";
  function visual(file, panelPlacement, titleKo, charactersKo, altKo, altVi) {
    return {
      image: imageRoot + file,
      mobileImage: null,
      imageAvailable: true,
      fallbackKo: "원작 장면 이미지 준비 중",
      fallbackVi: "Hình ảnh theo nguyên tác đang được chuẩn bị",
      fallbackTitleKo: titleKo,
      fallbackCharactersKo: charactersKo,
      desktopPosition: "50% center",
      mobilePosition: "50% center",
      panelPlacement: panelPlacement,
      overlayTone: "dark",
      colorTheme: "slough",
      imageAltKo: altKo,
      imageAltVi: altVi
    };
  }
  function line(id, speakerId, ko, vi) {
    return {
      id: id,
      sourceSentenceId: id.replace("line.", "sentence."),
      speakerId: speakerId,
      ko: ko,
      vi: vi,
      audioKoNormal: "",
      audioKoSlow: "",
      audioViNormal: "",
      audioViSlow: ""
    };
  }

  window.PILGRIM_CHAPTER_02_SCENES = Object.freeze([
    {
      id: "scene.slough.pursued_by_obstinate_and_pliable",
      chapterId: "chapter.slough_of_despond",
      order: 1,
      type: "dialogue",
      titleKo: "뒤쫓아온 두 사람",
      titleVi: "Hai người đuổi theo",
      transitionKo: "고집쟁이와 유순한 사람이 크리스천을 집으로 데려가기 위해 뒤쫓아왔습니다.",
      environment: { backgroundId: "environment.slough_pursuit", asset: imageRoot + "scene-02-01-pursuit.png", atmosphere: "confrontation", time: "morning" },
      visual: visual("scene-02-01-pursuit.png", "right-bottom", "뒤쫓아온 두 사람", "크리스천 · 고집쟁이 · 유순한 사람", "멸망의 도시를 떠난 크리스천을 뒤쫓아온 고집쟁이와 유순한 사람", "Cứng Đầu và Dễ Thay Đổi đuổi theo Christian sau khi anh rời Thành Hủy Diệt"),
      characters: [
        { characterId: "character.christian", position: "left" },
        { characterId: "character.obstinate", position: "center" },
        { characterId: "character.pliable", position: "right" }
      ],
      lines: [
        line("line.slough.pursuit.01", "character.narrator", "고집쟁이와 유순한 사람이 크리스천을 집으로 데려가기 위해 뒤쫓아왔습니다.", "Cứng Đầu và Dễ Thay Đổi chạy theo Christian để đưa anh trở về."),
        line("line.slough.pursuit.02", "character.obstinate", "우리와 함께 돌아갑시다.", "Hãy quay về cùng chúng tôi."),
        line("line.slough.pursuit.03", "character.christian", "저는 멸망의 도시로 돌아갈 수 없습니다.", "Tôi không thể quay lại Thành Hủy Diệt."),
        line("line.slough.pursuit.04", "character.obstinate", "왜 아무 말도 없이 혼자 떠났습니까?", "Tại sao anh lại bỏ đi một mình mà không nói gì?")
      ],
      vocabularyIds: ["word.chase_after", "word.return"],
      grammarIds: [],
      interaction: {
        type: "speech_response",
        questId: "quest.slough.refuse_to_return_02",
        npcNameKo: "고집쟁이",
        npcLineKo: "우리와 함께 멸망의 도시로 돌아갑시다.",
        npcLineVi: "Hãy quay về Thành Hủy Diệt cùng chúng tôi.",
        requiredIntent: "refuse_to_return",
        keywords: ["멸망의 도시", "돌아갈 수 없습니다", "계속 가겠습니다"],
        grammarTarget: "refusal",
        successResponseKo: "고집쟁이는 이해하지 못했지만, 유순한 사람은 크리스천이 가는 곳에 관심을 보였습니다.",
        supportResponseKo: "돌아갈 수 없다는 뜻을 짧게 말해 보세요.",
        supplementKo: "저는 멸망의 도시로 돌아갈 수 없습니다.",
        supplementVi: "Tôi không thể quay lại Thành Hủy Diệt."
      },
      nextSceneId: "scene.slough.pliable_joins_the_journey"
    },
    {
      id: "scene.slough.pliable_joins_the_journey",
      chapterId: "chapter.slough_of_despond",
      order: 2,
      type: "dialogue",
      titleKo: "유순한 사람이 함께 가다",
      titleVi: "Dễ Thay Đổi cùng lên đường",
      transitionKo: "크리스천의 이야기를 들은 유순한 사람은 함께 가기로 했고, 고집쟁이는 도시로 돌아갔습니다.",
      environment: { backgroundId: "environment.slough_pliable_joins", asset: imageRoot + "scene-02-02-pliable-joins.png", atmosphere: "hopeful_departure", time: "morning" },
      visual: visual("scene-02-02-pliable-joins.png", "left-bottom", "유순한 사람이 함께 가다", "크리스천 · 고집쟁이 · 유순한 사람", "크리스천과 함께 길을 떠나는 유순한 사람과 도시로 돌아가는 고집쟁이", "Dễ Thay Đổi lên đường cùng Christian còn Cứng Đầu quay về thành phố"),
      characters: [
        { characterId: "character.christian", position: "left" },
        { characterId: "character.obstinate", position: "right" },
        { characterId: "character.pliable", position: "center" }
      ],
      lines: [
        line("line.slough.joins.01", "character.christian", "제가 가는 곳에는 영원히 사라지지 않는 유업이 있습니다.", "Nơi tôi đang đến có một cơ nghiệp không bao giờ hư mất."),
        line("line.slough.joins.02", "character.pliable", "저도 함께 가겠습니다.", "Tôi cũng sẽ đi cùng anh."),
        line("line.slough.joins.03", "character.pliable", "그러면 빨리 갑시다.", "Vậy chúng ta hãy đi nhanh lên."),
        line("line.slough.joins.04", "character.christian", "등에 진 짐 때문에 빨리 갈 수 없습니다.", "Vì gánh nặng trên lưng, tôi không thể đi nhanh."),
        line("line.slough.joins.05", "character.narrator", "고집쟁이는 두 사람을 두고 멸망의 도시로 돌아갔습니다.", "Cứng Đầu bỏ hai người lại và quay về Thành Hủy Diệt.")
      ],
      vocabularyIds: ["word.go_together", "word.inheritance"],
      grammarIds: ["grammar.reason_aseo_eoseo"],
      interaction: {
        type: "speech_response",
        questId: "quest.slough.explain_burden_02",
        npcNameKo: "유순한 사람",
        npcLineKo: "그러면 빨리 갑시다.",
        npcLineVi: "Vậy chúng ta hãy đi nhanh lên.",
        requiredIntent: "explain_burden",
        keywords: ["짐", "때문에", "빨리 갈 수 없습니다"],
        grammarTarget: "reason",
        successResponseKo: "유순한 사람은 크리스천의 짐을 바라보고 함께 속도를 맞추었습니다.",
        supportResponseKo: "짐 때문에 빨리 갈 수 없다고 말해 보세요.",
        supplementKo: "등에 진 짐 때문에 빨리 갈 수 없습니다.",
        supplementVi: "Vì gánh nặng trên lưng, tôi không thể đi nhanh."
      },
      nextSceneId: "scene.slough.fall_into_despond"
    },
    {
      id: "scene.slough.fall_into_despond",
      chapterId: "chapter.slough_of_despond",
      order: 3,
      type: "narration_with_grammar",
      titleKo: "절망의 수렁에 빠지다",
      titleVi: "Rơi xuống Vũng Lầy Tuyệt Vọng",
      transitionKo: "두 사람은 이야기를 나누느라 앞길을 살피지 못하고 함께 수렁에 빠졌습니다.",
      environment: { backgroundId: "environment.slough_fall_v2", asset: imageRoot + "scene-02-03-fall.png", atmosphere: "sudden_danger", time: "overcast" },
      visual: visual("scene-02-03-fall.png", "right-bottom", "절망의 수렁에 빠지다", "크리스천 · 유순한 사람", "무거운 짐을 멘 크리스천과 유순한 사람이 함께 절망의 수렁에 빠진 모습", "Christian mang gánh nặng và Dễ Thay Đổi cùng rơi xuống Vũng Lầy Tuyệt Vọng"),
      characters: [
        { characterId: "character.christian", position: "left" },
        { characterId: "character.pliable", position: "right" }
      ],
      lines: [
        line("line.slough.fall_v2.01", "character.narrator", "두 사람은 이야기를 나누며 걷느라 앞길을 제대로 살피지 못했습니다.", "Hai người vừa đi vừa nói chuyện nên không nhìn kỹ con đường phía trước."),
        line("line.slough.fall_v2.02", "character.narrator", "그들은 걷다가 함께 절망의 수렁에 빠졌습니다.", "Họ đang đi thì cùng rơi xuống Vũng Lầy Tuyệt Vọng."),
        line("line.slough.fall_v2.03", "character.narrator", "진흙이 발을 붙잡아서 움직일 수 없었습니다.", "Bùn giữ chặt chân nên họ không thể cử động."),
        line("line.slough.fall_v2.04", "character.narrator", "크리스천은 등에 진 짐 때문에 점점 더 깊이 가라앉았습니다.", "Vì gánh nặng trên lưng, Christian ngày càng chìm sâu hơn.")
      ],
      vocabularyIds: ["word.slough", "word.sink"],
      grammarIds: ["grammar.daga_interruption", "grammar.reason_aseo_eoseo"],
      interaction: { type: "grammar_check", grammarId: "grammar.daga_interruption" },
      nextSceneId: "scene.slough.pliable_returns_home"
    },
    {
      id: "scene.slough.pliable_returns_home",
      chapterId: "chapter.slough_of_despond",
      order: 4,
      type: "dialogue_and_reflection",
      titleKo: "유순한 사람이 돌아가다",
      titleVi: "Dễ Thay Đổi quay về nhà",
      transitionKo: "첫 어려움에 실망한 유순한 사람은 집과 가까운 쪽으로 올라가 돌아갔습니다.",
      environment: { backgroundId: "environment.slough_pliable_returns", asset: imageRoot + "scene-02-04-pliable-returns.png", atmosphere: "abandonment", time: "overcast" },
      visual: visual("scene-02-04-pliable-returns.png", "left-bottom", "유순한 사람이 돌아가다", "크리스천 · 유순한 사람", "집으로 돌아가는 유순한 사람과 수렁에서 홀로 몸부림치는 크리스천", "Dễ Thay Đổi quay về nhà còn Christian một mình vùng vẫy trong vũng lầy"),
      characters: [
        { characterId: "character.christian", position: "left" },
        { characterId: "character.pliable", position: "right" }
      ],
      lines: [
        line("line.slough.returns.01", "character.pliable", "이것이 당신이 말한 행복입니까?", "Đây là hạnh phúc mà anh đã nói đến sao?"),
        line("line.slough.returns.02", "character.pliable", "저는 더 이상 함께 가지 않겠습니다.", "Tôi sẽ không đi cùng anh nữa."),
        line("line.slough.returns.03", "character.pliable", "저는 집으로 돌아가겠습니다.", "Tôi sẽ quay về nhà."),
        line("line.slough.returns.04", "character.narrator", "유순한 사람은 자기 집과 가까운 쪽으로 기어 올라가 돌아갔습니다.", "Dễ Thay Đổi bò lên ở phía gần nhà mình rồi quay trở về."),
        line("line.slough.returns.05", "character.narrator", "크리스천은 반대편의 좁은 문을 향해 계속 몸부림쳤습니다.", "Christian vẫn cố đi về phía Cửa Hẹp ở phía bên kia.")
      ],
      vocabularyIds: ["word.disappointed", "word.struggle"],
      grammarIds: [],
      interaction: {
        type: "speech_response",
        questId: "quest.slough.continue_despite_difficulty_02",
        npcNameKo: "생각해 보기",
        npcLineKo: "유순한 사람은 왜 돌아갔습니까? 크리스천이라면 어떻게 하겠습니까?",
        npcLineVi: "Tại sao Dễ Thay Đổi quay về? Nếu là Christian, bạn sẽ làm gì?",
        requiredIntent: "continue_despite_difficulty",
        keywords: ["어려움", "계속", "가겠습니다"],
        grammarTarget: "resolve",
        successResponseKo: "이 문장은 유순한 사람에게 외친 원작 대사가 아니라, 사건을 돌아보는 학습자의 다짐입니다.",
        supportResponseKo: "어려움이 있어도 계속 가겠다는 뜻을 말해 보세요.",
        supplementKo: "어려움이 있어도 저는 계속 가겠습니다.",
        supplementVi: "Dù gặp khó khăn, tôi vẫn sẽ tiếp tục đi."
      },
      nextSceneId: "scene.slough.help_rescues_christian"
    },
    {
      id: "scene.slough.help_rescues_christian",
      chapterId: "chapter.slough_of_despond",
      order: 5,
      type: "dialogue",
      titleKo: "도움이 크리스천을 구조하다",
      titleVi: "Người Trợ Giúp cứu Christian",
      transitionKo: "도움은 크리스천이 발판을 놓친 이유를 묻고 단단한 땅으로 끌어올렸습니다.",
      environment: { backgroundId: "environment.slough_help_rescues_v2", asset: imageRoot + "scene-02-05-help-rescues.png", atmosphere: "rescue", time: "soft_light" },
      visual: visual("scene-02-05-help-rescues.png", "left-bottom", "도움이 크리스천을 구조하다", "크리스천 · 도움", "단단한 땅 위에서 크리스천을 수렁 밖으로 끌어올리는 도움", "Người Trợ Giúp đứng trên đất chắc và kéo Christian ra khỏi vũng lầy"),
      characters: [
        { characterId: "character.christian", position: "left" },
        { characterId: "character.help", position: "right" }
      ],
      lines: [
        line("line.slough.rescue_v2.01", "character.help", "왜 이곳에 빠졌습니까?", "Tại sao anh lại rơi xuống đây?"),
        line("line.slough.rescue_v2.02", "character.help", "왜 단단한 발판을 찾지 않았습니까?", "Tại sao anh không tìm những chỗ đặt chân vững chắc?"),
        line("line.slough.rescue_v2.03", "character.christian", "너무 두려워서 앞을 제대로 살피지 못했습니다.", "Vì quá sợ hãi, tôi đã không nhìn kỹ phía trước."),
        line("line.slough.rescue_v2.04", "character.help", "제 손을 잡으십시오.", "Hãy nắm lấy tay tôi."),
        line("line.slough.rescue_v2.05", "character.help", "단단한 땅으로 끌어올리겠습니다.", "Tôi sẽ kéo anh lên chỗ đất chắc."),
        line("line.slough.rescue_v2.06", "character.christian", "도와주셔서 감사합니다.", "Cảm ơn ông đã giúp tôi.")
      ],
      vocabularyIds: ["word.foothold", "word.reach_out_hand"],
      grammarIds: ["grammar.reason_aseo_eoseo"],
      interaction: {
        type: "speech_response",
        questId: "quest.slough.explain_fear_02",
        npcNameKo: "도움",
        npcLineKo: "왜 단단한 발판을 찾지 않았습니까?",
        npcLineVi: "Tại sao anh không tìm những chỗ đặt chân vững chắc?",
        requiredIntent: "explain_fear_and_mistake",
        secondaryIntent: "ask_help",
        keywords: ["두려워서", "살피지 못했습니다", "도와주십시오"],
        grammarTarget: "reason_and_request",
        successResponseKo: "솔직하게 이유를 말하고 도움을 요청했습니다. 도움은 손을 내밀어 크리스천을 끌어올렸습니다.",
        supportResponseKo: "두려워서 앞을 살피지 못했다고 설명한 뒤 도움을 요청해 보세요.",
        supplementKo: "너무 두려워서 앞을 제대로 살피지 못했습니다. 제발 도와주십시오.",
        supplementVi: "Vì quá sợ hãi, tôi đã không nhìn kỹ phía trước. Xin hãy giúp tôi."
      },
      nextSceneId: "scene.slough.meaning_of_the_slough"
    },
    {
      id: "scene.slough.meaning_of_the_slough",
      chapterId: "chapter.slough_of_despond",
      order: 6,
      type: "explanation_and_reflection",
      titleKo: "수렁과 발판의 의미",
      titleVi: "Ý nghĩa của vũng lầy và chỗ đặt chân",
      transitionKo: "단단한 땅 위에서 도움은 수렁과 그 한가운데 놓인 발판의 의미를 설명했습니다.",
      environment: { backgroundId: "environment.slough_meaning", asset: imageRoot + "scene-02-06-meaning-of-slough.png", atmosphere: "solemn_reflection", time: "clearing" },
      visual: visual("scene-02-06-meaning-of-slough.png", "right-bottom", "수렁과 발판의 의미", "크리스천 · 도움", "절망의 수렁과 단단한 발판의 의미를 크리스천에게 설명하는 도움", "Người Trợ Giúp giải thích cho Christian ý nghĩa của vũng lầy và những chỗ đặt chân vững chắc"),
      characters: [
        { characterId: "character.christian", position: "left" },
        { characterId: "character.help", position: "right" }
      ],
      lines: [
        line("line.slough.meaning.01", "character.help", "사람이 자신의 죄를 깨달을 때 생기는 두려움과 의심과 낙심이 이 수렁으로 흘러듭니다.", "Khi con người nhận ra tội lỗi của mình, nỗi sợ hãi, nghi ngờ và chán nản chảy vào vũng lầy này."),
        line("line.slough.meaning.02", "character.help", "오랜 세월 많은 가르침과 지혜가 더해졌지만 수렁은 여전히 남아 있습니다.", "Suốt nhiều năm, nhiều lời dạy và sự khôn ngoan đã được đưa vào đây, nhưng vũng lầy vẫn còn đó."),
        line("line.slough.meaning.03", "character.help", "그러나 수렁 한가운데에는 단단한 발판이 있습니다.", "Tuy nhiên, ở giữa vũng lầy có những chỗ đặt chân vững chắc."),
        line("line.slough.meaning.04", "character.help", "발판을 잘 살피면 수렁을 건널 수 있습니다.", "Nếu nhìn kỹ những chỗ đặt chân đó, anh có thể đi qua vũng lầy."),
        line("line.slough.meaning.05", "character.christian", "다음에는 단단한 발판을 잘 살피겠습니다.", "Lần sau, tôi sẽ tìm kỹ những chỗ đặt chân vững chắc."),
        line("line.slough.meaning.06", "character.christian", "다음에는 두려움에 쫓기지 않고 단단한 발판을 잘 살피겠습니다.", "Lần sau, tôi sẽ không chạy vì sợ hãi. Tôi sẽ tìm kỹ những chỗ đặt chân vững chắc.")
      ],
      vocabularyIds: ["word.doubt", "word.discouragement"],
      grammarIds: [],
      interaction: {
        type: "speech_response",
        questId: "quest.slough.reflect_and_continue_02",
        npcNameKo: "도움",
        npcLineKo: "다음에는 어떻게 길을 살피겠습니까?",
        npcLineVi: "Lần sau anh sẽ quan sát con đường như thế nào?",
        requiredIntent: "reflect_and_continue",
        keywords: ["두려움에 쫓기지 않고", "단단한 발판", "살피겠습니다"],
        grammarTarget: "reflection",
        successResponseKo: "크리스천은 도움의 손을 받아들인 뒤, 다음에는 두려움보다 발판을 먼저 살피기로 다짐했습니다.",
        supportResponseKo: "다음에는 단단한 발판을 잘 살피겠다고 말해 보세요.",
        supplementKo: "다음에는 두려움에 쫓기지 않고 단단한 발판을 잘 살피겠습니다.",
        supplementVi: "Lần sau, tôi sẽ không chạy vì sợ hãi. Tôi sẽ tìm kỹ những chỗ đặt chân vững chắc."
      },
      nextSceneId: null
    }
  ]);
}());

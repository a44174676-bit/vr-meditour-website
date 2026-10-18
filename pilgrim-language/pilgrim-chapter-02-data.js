(function () {
  "use strict";

  window.PILGRIM_CHAPTER_02_DATA = Object.freeze({
    chapterId: "chapter.slough_of_despond",
    contentVersion: 2,
    characters: [
      { id: "character.christian", nameKo: "크리스천", nameVi: "Christian" },
      { id: "character.obstinate", nameKo: "고집쟁이", nameVi: "Cứng Đầu" },
      { id: "character.pliable", nameKo: "유순한 사람", nameVi: "Dễ Thay Đổi" },
      { id: "character.help", nameKo: "도움", nameVi: "Người Trợ Giúp" },
      { id: "character.narrator", nameKo: "해설자", nameVi: "Người kể chuyện" }
    ],
    keyExpressions: [
      { id: "expression.slough.refuse_return", ko: "저는 멸망의 도시로 돌아갈 수 없습니다.", vi: "Tôi không thể quay lại Thành Hủy Diệt.", sceneId: "scene.slough.pursued_by_obstinate_and_pliable" },
      { id: "expression.slough.join_journey", ko: "저도 함께 가겠습니다.", vi: "Tôi cũng sẽ đi cùng anh.", sceneId: "scene.slough.pliable_joins_the_journey" },
      { id: "expression.slough.explain_burden", ko: "등에 진 짐 때문에 빨리 갈 수 없습니다.", vi: "Vì gánh nặng trên lưng, tôi không thể đi nhanh.", sceneId: "scene.slough.pliable_joins_the_journey" },
      { id: "expression.slough.question_happiness", ko: "이것이 당신이 말한 행복입니까?", vi: "Đây là hạnh phúc mà anh đã nói đến sao?", sceneId: "scene.slough.pliable_returns_home" },
      { id: "expression.slough.explain_fear", ko: "너무 두려워서 앞을 제대로 살피지 못했습니다.", vi: "Vì quá sợ hãi, tôi đã không nhìn kỹ phía trước.", sceneId: "scene.slough.help_rescues_christian" },
      { id: "expression.slough.inspect_footholds", ko: "다음에는 단단한 발판을 잘 살피겠습니다.", vi: "Lần sau, tôi sẽ tìm kỹ những chỗ đặt chân vững chắc.", sceneId: "scene.slough.meaning_of_the_slough" }
    ],
    vocabulary: [
      { id: "word.chase_after", word: "뒤쫓다", ko: "뒤쫓다", vi: "đuổi theo", partOfSpeech: "동사", description: "앞서가는 사람을 따라가 잡으려고 하다", descriptionVi: "Chạy theo người đang đi phía trước", example: "고집쟁이와 유순한 사람이 크리스천을 뒤쫓아왔습니다.", translation: "Cứng Đầu và Dễ Thay Đổi chạy theo Christian.", sceneId: "scene.slough.pursued_by_obstinate_and_pliable", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.return", word: "돌아가다", ko: "돌아가다", vi: "quay về", partOfSpeech: "동사", description: "떠났던 곳으로 다시 가다", descriptionVi: "Đi trở lại nơi đã rời đi", example: "저는 멸망의 도시로 돌아갈 수 없습니다.", translation: "Tôi không thể quay lại Thành Hủy Diệt.", sceneId: "scene.slough.pursued_by_obstinate_and_pliable", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.go_together", word: "함께 가다", ko: "함께 가다", vi: "đi cùng nhau", partOfSpeech: "표현", description: "다른 사람과 같은 길을 가다", descriptionVi: "Đi chung một con đường với người khác", example: "저도 함께 가겠습니다.", translation: "Tôi cũng sẽ đi cùng anh.", sceneId: "scene.slough.pliable_joins_the_journey", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.inheritance", word: "유업", ko: "유업", vi: "cơ nghiệp", partOfSpeech: "명사", description: "약속에 따라 이어받게 되는 귀한 것", descriptionVi: "Điều quý giá được nhận theo lời hứa", example: "그곳에는 영원히 사라지지 않는 유업이 있습니다.", translation: "Nơi đó có một cơ nghiệp không bao giờ hư mất.", sceneId: "scene.slough.pliable_joins_the_journey", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.burden", word: "짐", ko: "짐", vi: "gánh nặng", partOfSpeech: "명사", description: "들거나 등에 지고 옮기는 물건", descriptionVi: "Đồ vật phải mang trên người", example: "등에 진 짐 때문에 빨리 갈 수 없습니다.", translation: "Vì gánh nặng trên lưng, tôi không thể đi nhanh.", sceneId: "scene.slough.pliable_joins_the_journey", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.slough", word: "수렁", ko: "수렁", vi: "vũng lầy", partOfSpeech: "명사", description: "진흙이 깊어 발이 빠지는 곳", descriptionVi: "Nơi bùn sâu khiến chân bị lún", example: "그들은 함께 절망의 수렁에 빠졌습니다.", translation: "Họ cùng rơi xuống Vũng Lầy Tuyệt Vọng.", sceneId: "scene.slough.fall_into_despond", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.fall_into", word: "빠지다", ko: "빠지다", vi: "rơi xuống", partOfSpeech: "동사", description: "깊거나 위험한 곳 안으로 들어가다", descriptionVi: "Rơi vào một nơi sâu hoặc nguy hiểm", example: "그들은 걷다가 수렁에 빠졌습니다.", translation: "Họ đang đi thì rơi xuống vũng lầy.", sceneId: "scene.slough.fall_into_despond", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.sink", word: "가라앉다", ko: "가라앉다", vi: "chìm xuống", partOfSpeech: "동사", description: "물이나 진흙 속으로 내려가다", descriptionVi: "Chìm xuống nước hoặc bùn", example: "크리스천은 점점 더 깊이 가라앉았습니다.", translation: "Christian ngày càng chìm sâu hơn.", sceneId: "scene.slough.fall_into_despond", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.disappointed", word: "실망하다", ko: "실망하다", vi: "thất vọng", partOfSpeech: "동사", description: "기대한 것과 달라 마음이 무너지다", descriptionVi: "Buồn vì sự việc không như mong đợi", example: "유순한 사람은 첫 어려움 앞에서 실망했습니다.", translation: "Dễ Thay Đổi thất vọng trước khó khăn đầu tiên.", sceneId: "scene.slough.pliable_returns_home", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.struggle", word: "몸부림치다", ko: "몸부림치다", vi: "vùng vẫy", partOfSpeech: "동사", description: "어려운 곳에서 벗어나려고 온몸을 움직이다", descriptionVi: "Cố vùng vẫy để thoát khỏi khó khăn", example: "크리스천은 좁은 문을 향해 계속 몸부림쳤습니다.", translation: "Christian tiếp tục vùng vẫy về phía Cửa Hẹp.", sceneId: "scene.slough.pliable_returns_home", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.foothold", word: "발판", ko: "발판", vi: "chỗ đặt chân", partOfSpeech: "명사", description: "발을 안전하게 디딜 수 있는 곳", descriptionVi: "Nơi vững để đặt chân an toàn", example: "왜 단단한 발판을 찾지 않았습니까?", translation: "Tại sao anh không tìm chỗ đặt chân vững chắc?", sceneId: "scene.slough.help_rescues_christian", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.solid", word: "단단하다", ko: "단단하다", vi: "vững chắc", partOfSpeech: "형용사", description: "쉽게 무너지거나 흔들리지 않다", descriptionVi: "Không dễ lún hoặc lay động", example: "도움은 크리스천을 단단한 땅으로 끌어올렸습니다.", translation: "Người Trợ Giúp kéo Christian lên chỗ đất chắc.", sceneId: "scene.slough.help_rescues_christian", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.reach_out_hand", word: "손을 내밀다", ko: "손을 내밀다", vi: "đưa tay ra", partOfSpeech: "표현", description: "돕거나 잡기 위해 손을 뻗다", descriptionVi: "Đưa tay ra để giúp hoặc nắm lấy", example: "도움은 크리스천에게 손을 내밀었습니다.", translation: "Người Trợ Giúp đưa tay ra cho Christian.", sceneId: "scene.slough.help_rescues_christian", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.doubt", word: "의심", ko: "의심", vi: "nghi ngờ", partOfSpeech: "명사", description: "사실이나 약속을 확실히 믿지 못하는 마음", descriptionVi: "Cảm giác không thể tin chắc", example: "두려움과 의심이 이 수렁으로 흘러듭니다.", translation: "Nỗi sợ hãi và nghi ngờ chảy vào vũng lầy này.", sceneId: "scene.slough.meaning_of_the_slough", ttsAvailable: true, audioNormal: null, audioSlow: null },
      { id: "word.discouragement", word: "낙심", ko: "낙심", vi: "chán nản", partOfSpeech: "명사", description: "희망과 용기를 잃고 마음이 약해짐", descriptionVi: "Mất hy vọng và lòng can đảm", example: "두려움과 의심과 낙심이 수렁에 쌓입니다.", translation: "Nỗi sợ hãi, nghi ngờ và chán nản tích tụ trong vũng lầy.", sceneId: "scene.slough.meaning_of_the_slough", ttsAvailable: true, audioNormal: null, audioSlow: null }
    ],
    grammar: [
      {
        id: "grammar.daga_interruption", expression: "-다가",
        explanationKo: "어떤 행동을 하던 중 다른 사건이 일어날 때 사용합니다.",
        explanationVi: "Dùng khi một sự việc khác xảy ra trong lúc đang thực hiện hành động trước đó.",
        textExample: "걷다가 절망의 수렁에 빠졌습니다.",
        exampleId: "sentence.example.grammar.daga_interruption",
        example: "길을 걷다가 비를 만났습니다.", translation: "Tôi gặp mưa khi đang đi trên đường.",
        forms: ["걷다 → 걷다가", "가다 → 가다가", "이야기하다 → 이야기하다가"],
        audioNormal: null, audioSlow: null,
        exercise: {
          id: "exercise.grammar.daga_interruption.02", prompt: "두 사람은 길을 ______ 수렁에 빠졌습니다.",
          options: [{ id: "option.daga.01", text: "걷다가" }, { id: "option.daga.02", text: "걸어서" }, { id: "option.daga.03", text: "걸으려고" }],
          answerId: "option.daga.01"
        }
      },
      {
        id: "grammar.reason_aseo_eoseo", expression: "-아/어서",
        explanationKo: "앞의 내용이 뒤에 오는 결과의 이유나 원인일 때 사용합니다.",
        explanationVi: "Dùng để nối nguyên nhân hoặc lý do với kết quả phía sau.",
        textExample: "너무 두려워서 앞을 제대로 살피지 못했습니다.",
        exampleId: "sentence.example.grammar.reason_aseo_eoseo",
        example: "짐이 너무 무거워서 빨리 갈 수 없습니다.", translation: "Vì gánh nặng quá lớn nên tôi không thể đi nhanh.",
        forms: ["두렵다 → 두려워서", "무겁다 → 무거워서", "깊다 → 깊어서"],
        audioNormal: null, audioSlow: null,
        exercise: {
          id: "exercise.grammar.reason_aseo_eoseo.02", prompt: "짐이 너무 ______ 빨리 갈 수 없습니다.",
          options: [{ id: "option.reason.01", text: "무거워서" }, { id: "option.reason.02", text: "무겁다가" }, { id: "option.reason.03", text: "무거우려고" }],
          answerId: "option.reason.01"
        }
      }
    ],
    quests: [
      {
        id: "quest.slough.refuse_to_return_02", sceneId: "scene.slough.pursued_by_obstinate_and_pliable", npcId: "character.obstinate",
        answers: [
          { id: "answer.slough.refuse.complete", text: "저는 멸망의 도시로 돌아갈 수 없습니다.", result: { experience: 20, trustChange: 0, meaningDelivery: "success", grammarUse: "success" } },
          { id: "answer.slough.refuse.brief", text: "저는 돌아갈 수 없습니다.", result: { experience: 10, trustChange: 0, meaningDelivery: "partial", grammarUse: "basic" } },
          { id: "answer.slough.refuse.continue", text: "저는 계속 가겠습니다.", result: { experience: 10, trustChange: 0, meaningDelivery: "partial", grammarUse: "basic" } }
        ]
      },
      {
        id: "quest.slough.explain_burden_02", sceneId: "scene.slough.pliable_joins_the_journey", npcId: "character.pliable",
        answers: [
          { id: "answer.slough.burden.complete", text: "등에 진 짐 때문에 빨리 갈 수 없습니다.", result: { experience: 20, trustChange: 0, meaningDelivery: "success", grammarUse: "success" } },
          { id: "answer.slough.burden.brief", text: "짐 때문에 빨리 갈 수 없습니다.", result: { experience: 10, trustChange: 0, meaningDelivery: "partial", grammarUse: "basic" } },
          { id: "answer.slough.burden.heavy", text: "짐이 너무 무겁습니다.", result: { experience: 10, trustChange: 0, meaningDelivery: "partial", grammarUse: "basic" } }
        ]
      },
      {
        id: "quest.slough.continue_despite_difficulty_02", sceneId: "scene.slough.pliable_returns_home", npcId: "character.narrator",
        answers: [
          { id: "answer.slough.continue_difficulty.complete", text: "어려움이 있어도 저는 계속 가겠습니다.", result: { experience: 20, trustChange: 0, meaningDelivery: "success", grammarUse: "success" } },
          { id: "answer.slough.continue_difficulty.brief", text: "저는 계속 가겠습니다.", result: { experience: 10, trustChange: 0, meaningDelivery: "partial", grammarUse: "basic" } }
        ]
      },
      {
        id: "quest.slough.explain_fear_02", sceneId: "scene.slough.help_rescues_christian", npcId: "character.help",
        answers: [
          { id: "answer.slough.fear.complete", text: "너무 두려워서 앞을 제대로 살피지 못했습니다. 제발 도와주십시오.", result: { experience: 20, trustChange: 2, meaningDelivery: "success", grammarUse: "success" } },
          { id: "answer.slough.fear.brief", text: "너무 두려워서 앞을 살피지 못했습니다.", result: { experience: 10, trustChange: 1, meaningDelivery: "partial", grammarUse: "basic" } },
          { id: "answer.slough.ask_help", text: "제발 도와주십시오.", result: { experience: 10, trustChange: 1, meaningDelivery: "partial", grammarUse: "basic" } }
        ]
      },
      {
        id: "quest.slough.reflect_and_continue_02", sceneId: "scene.slough.meaning_of_the_slough", npcId: "character.help",
        answers: [
          { id: "answer.slough.reflect.complete", text: "다음에는 두려움에 쫓기지 않고 단단한 발판을 잘 살피겠습니다.", result: { experience: 20, trustChange: 1, meaningDelivery: "success", grammarUse: "success" } },
          { id: "answer.slough.reflect.brief", text: "다음에는 단단한 발판을 잘 살피겠습니다.", result: { experience: 10, trustChange: 0, meaningDelivery: "partial", grammarUse: "basic" } }
        ]
      }
    ]
  });
}());

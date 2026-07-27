(function () {
  "use strict";

  /*
   * JSON.stringify(window.PILGRIM_DATA)로 직렬화할 수 있는 순수 데이터 객체입니다.
   * 함수, DOM 참조, HTML 문자열과 브라우저 API를 포함하지 않습니다.
   */
  window.PILGRIM_DATA = Object.freeze({
    schemaVersion: "1.1.0",
    app: {
      id: "app.pilgrim_language",
      titleKo: "순례자의 길",
      subtitleKo: "천로역정으로 배우는 한국어",
      subtitleVi: "Học tiếng Hàn qua hành trình của người lữ hành",
      chapterMinutes: 7
    },
    rules: {
      id: "rules.language_growth.v1",
      maxExperience: 100,
      levelThresholds: [
        { id: "level.korean.1", level: 1, minimumExperience: 0 },
        { id: "level.korean.2", level: 2, minimumExperience: 100 }
      ]
    },
    map: [
      { id: "location.city_of_destruction", nameKo: "멸망의 도시", nameVi: "Thành Hủy Diệt", active: true },
      { id: "location.slough_of_despond", nameKo: "절망의 늪", nameVi: "Đầm Lầy Tuyệt Vọng", active: false },
      { id: "location.wicket_gate", nameKo: "좁은 문", nameVi: "Cánh Cổng Hẹp", active: false }
    ],
    npcs: [
      { id: "npc.evangelist", nameKo: "전도자", nameVi: "Người Truyền Đạo" }
    ],
    chapter: {
      id: "chapter.city_of_destruction",
      sceneId: "scene.city.departure",
      titleKo: "멸망의 도시를 떠나다",
      titleVi: "Rời Khỏi Thành Hủy Diệt",
      sentences: [
        { id: "sentence.city.departure.01", ko: "크리스천은 멸망의 도시에 살고 있었습니다.", vi: "Christian sống trong Thành Hủy Diệt.", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.02", ko: "그는 자신이 이곳을 떠나야 한다는 것을 알았습니다.", vi: "Anh biết rằng mình phải rời khỏi nơi này.", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.03", ko: "그러나 어디로 가야 할지 몰랐습니다.", vi: "Tuy nhiên, anh không biết mình phải đi đâu.", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.04", ko: "그때 전도자가 크리스천에게 다가왔습니다.", vi: "Lúc đó, Người Truyền Đạo đến gần Christian.", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.05", ko: "크리스천은 전도자에게 물었습니다.", vi: "Christian hỏi Người Truyền Đạo:", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.06", ko: "“제가 무엇을 해야 합니까?”", vi: "“Tôi phải làm gì?”", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.07", ko: "전도자는 멀리 있는 좁은 문을 가리키며 말했습니다.", vi: "Người Truyền Đạo chỉ về phía cánh cổng hẹp ở đằng xa và nói:", audioNormal: null, audioSlow: null },
        { id: "sentence.city.departure.08", ko: "“저 문을 향해 걸어가십시오.”", vi: "“Hãy đi về phía cánh cổng đó.”", audioNormal: null, audioSlow: null }
      ]
    },
    vocabulary: [
      { id: "word.leave", word: "떠나다", vi: "rời đi", exampleId: "sentence.example.word.leave", example: "저는 내일 고향을 떠납니다.", translation: "Ngày mai tôi rời quê hương.", audioNormal: null, audioSlow: null },
      { id: "word.decide", word: "결심하다", vi: "quyết tâm, quyết định", exampleId: "sentence.example.word.decide", example: "저는 새로운 길을 가기로 결심했습니다.", translation: "Tôi đã quyết định đi trên một con đường mới.", audioNormal: null, audioSlow: null },
      { id: "word.what_must_do", word: "무엇을 해야 합니까?", vi: "Tôi phải làm gì?", description: "방법이나 다음 행동을 정중하게 물을 때 사용하는 표현", audioNormal: null, audioSlow: null },
      { id: "word.head_toward", word: "향하다", vi: "hướng về phía", exampleId: "sentence.example.word.head_toward", example: "우리는 좁은 문을 향해 걸어갑니다.", translation: "Chúng tôi đi về phía cánh cổng hẹp.", audioNormal: null, audioSlow: null },
      { id: "word.point", word: "가리키다", vi: "chỉ, chỉ về phía", exampleId: "sentence.example.word.point", example: "전도자는 멀리 있는 문을 가리켰습니다.", translation: "Người Truyền Đạo chỉ về phía cánh cổng ở đằng xa.", audioNormal: null, audioSlow: null }
    ],
    grammar: [
      {
        id: "grammar.must_do",
        expression: "-아/어야 하다",
        explanationKo: "어떤 행동이 필요하거나 반드시 해야 할 때 사용합니다.",
        explanationVi: "Dùng để diễn tả một việc cần hoặc bắt buộc phải làm.",
        textExample: "이곳을 떠나야 합니다.",
        exampleId: "sentence.example.grammar.must_do",
        example: "저는 오늘 숙제를 해야 합니다.",
        translation: "Hôm nay tôi phải làm bài tập.",
        audioNormal: null,
        audioSlow: null,
        exercise: {
          id: "exercise.grammar.must_do.01",
          prompt: "저는 내일 병원에 ______ 합니다.",
          options: [
            { id: "option.must_do.01", text: "가야" },
            { id: "option.must_do.02", text: "가는지" },
            { id: "option.must_do.03", text: "가지만" }
          ],
          answerId: "option.must_do.01"
        }
      },
      {
        id: "grammar.not_know_if",
        expression: "-는지 모르다",
        explanationKo: "어떤 사실, 장소 또는 방법을 알지 못할 때 사용합니다.",
        explanationVi: "Dùng khi không biết một sự việc, địa điểm hoặc cách thức.",
        textExample: "어디로 가야 할지 몰랐습니다.",
        exampleId: "sentence.example.grammar.not_know_if",
        example: "그 사람이 언제 오는지 모릅니다.",
        translation: "Tôi không biết khi nào người đó đến.",
        audioNormal: null,
        audioSlow: null,
        exercise: {
          id: "exercise.grammar.not_know_if.01",
          prompt: "친구가 어디에 ______ 모릅니다.",
          options: [
            { id: "option.not_know_if.01", text: "있는지" },
            { id: "option.not_know_if.02", text: "있어야" },
            { id: "option.not_know_if.03", text: "있지만" }
          ],
          answerId: "option.not_know_if.01"
        }
      }
    ],
    quest: {
      id: "quest.evangelist_reason_01",
      npcId: "npc.evangelist",
      sceneId: "scene.city.departure",
      question: "왜 이곳을 떠나려고 합니까?",
      hintVi: "Tại sao bạn định rời khỏi nơi này?",
      answers: [
        {
          id: "answer.evangelist_reason.thoughtful",
          text: "저는 새로운 길을 찾으려고 합니다.",
          result: {
            experience: 30,
            trustChange: 2,
            meaningDelivery: "success",
            grammarUse: "success",
            politeness: "success",
            respect: "success",
            conversationCompletion: "high",
            feedbackId: "feedback.evangelist_reason.thoughtful",
            nextSceneId: "scene.city.direction"
          }
        },
        {
          id: "answer.evangelist_reason.brief",
          text: "그냥 떠날 것입니다.",
          result: {
            experience: 15,
            trustChange: 0,
            meaningDelivery: "partial",
            grammarUse: "success",
            politeness: "basic",
            respect: "neutral",
            conversationCompletion: "medium",
            feedbackId: "feedback.evangelist_reason.brief",
            nextSceneId: "scene.city.direction"
          }
        },
        {
          id: "answer.evangelist_reason.harsh",
          text: "당신이 알 필요 없습니다.",
          result: {
            experience: 5,
            trustChange: -1,
            meaningDelivery: "success",
            grammarUse: "needs_improvement",
            politeness: "needs_improvement",
            respect: "needs_improvement",
            conversationCompletion: "low",
            feedbackId: "feedback.evangelist_reason.harsh",
            nextSceneId: "scene.city.direction"
          },
          supplement: {
            id: "sentence.supplement.evangelist_reason.01",
            ko: "아직 정확히 모르지만, 새로운 길을 찾고 싶습니다.",
            vi: "Tôi vẫn chưa biết rõ, nhưng tôi muốn tìm một con đường mới.",
            audioNormal: null,
            audioSlow: null
          }
        }
      ]
    },
    feedback: {
      "feedback.evangelist_reason.thoughtful": {
        meaning: "의미 전달 성공",
        grammar: "목적 표현을 정확하게 사용했습니다.",
        politeness: "정중한 표현 성공",
        respect: "상대방을 존중하며 이유를 설명했습니다.",
        completion: "대화 완성도가 높습니다."
      },
      "feedback.evangelist_reason.brief": {
        meaning: "의미 전달 부분 성공",
        grammar: "미래 표현을 알맞게 사용했습니다.",
        politeness: "기본적인 정중함을 갖췄습니다.",
        respect: "이유 설명이 부족합니다.",
        completion: "한 문장을 더 덧붙이면 자연스럽습니다."
      },
      "feedback.evangelist_reason.harsh": {
        meaning: "의미 전달 성공",
        grammar: "문장은 완성되었지만 관계 표현을 보완해 보세요.",
        politeness: "정중한 표현을 더 연습해 보세요.",
        respect: "상대방을 배려하는 말로 바꾸는 연습이 필요합니다.",
        completion: "보충 표현으로 대화를 이어가 보세요."
      }
    },
    storageKeys: {
      progress: "pilgrimLanguage.progress.v1",
      savedWords: "pilgrimLanguage.savedWords.v1",
      selectedAnswer: "pilgrimLanguage.selectedAnswer.v1",
      experience: "pilgrimLanguage.experience.v1",
      trust: "pilgrimLanguage.trust.evangelist.v1",
      voiceKo: "pilgrimLanguage.voice.ko.v1",
      voiceVi: "pilgrimLanguage.voice.vi.v1"
    }
  });
}());

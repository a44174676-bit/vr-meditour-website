(function () {
  "use strict";

  window.PILGRIM_CHAPTERS = Object.freeze([
    {
      id: "chapter.city_of_destruction",
      order: 1,
      titleKo: "멸망의 도시를 떠나다",
      titleVi: "Rời Khỏi Thành Hủy Diệt",
      titleEn: "Leaving the City of Destruction",
      descriptionKo: "크리스천은 등에 무거운 짐을 지고 떠나야 할 길을 찾고 있습니다.",
      descriptionVi: "Christian đang mang một gánh nặng và tìm kiếm con đường mình phải đi.",
      minutes: 7,
      keyExpressionCount: 5,
      grammarCount: 2,
      dialogueCount: 1,
      sceneIds: [
        "scene.city.introduction",
        "scene.city.must_leave",
        "scene.city.does_not_know",
        "scene.city.evangelist_appears",
        "scene.city.asking_direction",
        "scene.city.first_departure"
      ],
      unlock: { type: "always" },
      startImage: "./assets/scenes/chapter-01-hero.png",
      completionImage: "./assets/scenes/scene-06-departure-to-gate.png",
      imageAvailable: true,
      theme: "city"
    },
    {
      id: "chapter.slough_of_despond",
      order: 2,
      titleKo: "절망의 수렁",
      titleVi: "Vũng Lầy Tuyệt Vọng",
      titleEn: "Slough of Despond",
      contentVersion: 2,
      descriptionKo: "크리스천을 집으로 데려가기 위해 고집쟁이와 유순한 사람이 뒤쫓아옵니다. 유순한 사람은 그의 이야기를 듣고 함께 길을 시작하지만, 첫 어려움인 절망의 수렁에서 마음이 드러납니다. 단단한 발판을 찾고 도움의 손을 받아 다시 길 위에 서 보세요.",
      descriptionVi: "Cứng Đầu và Dễ Thay Đổi đuổi theo Christian để đưa anh trở về. Dễ Thay Đổi nghe câu chuyện rồi cùng lên đường, nhưng tấm lòng của anh ta bộc lộ trước thử thách đầu tiên. Hãy tìm chỗ đặt chân vững chắc, nắm lấy bàn tay giúp đỡ và trở lại con đường.",
      minutes: 13,
      keyExpressionCount: 6,
      grammarCount: 2,
      dialogueCount: 4,
      sceneIds: [
        "scene.slough.pursued_by_obstinate_and_pliable",
        "scene.slough.pliable_joins_the_journey",
        "scene.slough.fall_into_despond",
        "scene.slough.pliable_returns_home",
        "scene.slough.help_rescues_christian",
        "scene.slough.meaning_of_the_slough"
      ],
      unlock: { type: "chapter_complete", chapterId: "chapter.city_of_destruction" },
      lockMessageKo: "제1장 여정을 완료하면 절망의 수렁이 열립니다.",
      lockMessageVi: "Hoàn thành Chương 1 để mở Vũng Lầy Tuyệt Vọng.",
      startImage: "./assets/scenes/chapter-02-v2/scene-02-01-pursuit.png",
      completionImage: "./assets/scenes/chapter-02-v2/scene-02-06-meaning-of-slough.png",
      imageAvailable: true,
      fallbackKo: "원작 장면 이미지 준비 중",
      fallbackVi: "Hình ảnh theo nguyên tác đang được chuẩn bị",
      theme: "slough"
    }
  ]);
}());

const PAIRS_PER_STAGE = 5;

const SUPPORTED_LANGS = ["ko", "en", "vi", "jp", "cn"];

const KOREAN_PRACTICE_I18N = {
  ko: {
    guideKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "한국어 의료관광 단어·문장 학습",
    mainDescription: "베트남어권 학습자를 위한 한국어 기본 단어와 의료관광 실무 문장을 단계별로 학습합니다.",
    guideVideoTitle: "사용법 안내 영상",
    guideVideoSubtitle: "Video hướng dẫn sử dụng",
    guideVideoDescriptionKo: "베트남어권 사용자를 위한 한국어 단어·의료관광 문장 학습 앱 사용법을 영상으로 안내합니다. 영상을 먼저 확인한 뒤, 아래에서 학습 모드를 선택하고 카드를 클릭해 한국어 MP3 발음을 들으며 학습할 수 있습니다.",
    guideVideoDescriptionVi: "Video này hướng dẫn cách sử dụng ứng dụng học từ vựng và câu tiếng Hàn dành cho người Việt. Sau khi xem video, bạn có thể chọn chế độ học, chọn cấp độ, bấm vào thẻ và nghe phát âm tiếng Hàn bằng MP3.",
    guideVideoLink: "영상 새 창에서 보기",
    homeLink: "← VR MEDI TOUR & HOME으로 돌아가기",
    learningMode: "학습 모드",
    wordsMode: "기본 단어",
    sentencesMode: "의료관광 문장",
    stageSelect: "단계 선택",
    testVoice: "발음 테스트",
    replayVoice: "발음 다시 듣기",
    restart: "처음부터 다시",
    stageLabel: "단계",
    successLabel: "성공",
    attemptsLabel: "시도 횟수",
    audioReady: "카드를 클릭하면 한국어 MP3 발음이 재생됩니다.",
    audioPreparing: "음성 파일을 준비하고 있습니다.",
    audioMissing: "음성 파일이 아직 준비되지 않았습니다.",
    audioPlaying: "재생 중:",
    audioPlayed: "한국어 MP3 발음이 재생되었습니다.",
    medicalNotice: "이 학습 자료는 한국어 표현 학습용입니다. 실제 진단, 처방, 치료 판단은 반드시 의료진의 안내를 따라야 합니다.",
    finalAttempts: "총 시도 횟수:",
    attemptUnit: "회",
    nextStage: "다음 단계",
    stageComplete: "단계 완료",
    learningComplete: "학습 완료",
    stageCompleteMessage: "5쌍을 모두 맞췄습니다. 다음 단계로 이동해 보세요.",
    finalCompleteMessage: "단계 학습을 완료했습니다.",
    cardClosedLabel: "뒤집힌 카드, 클릭해서 열기",
    cardMatchedLabel: "맞춤 완료",
    stagePrefix: "단계",
  },
  en: {
    guideKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "Korean Medical Tourism Words and Sentences",
    mainDescription: "Study basic Korean words and practical medical tourism sentences step by step for Vietnamese-speaking learners.",
    guideVideoTitle: "How-To Video",
    guideVideoSubtitle: "Usage guide video",
    guideVideoDescriptionKo: "This video explains how to use the Korean words and medical tourism sentence learning app for Vietnamese-speaking users. Watch the video first, then choose a learning mode below, click cards, and listen to Korean MP3 pronunciation.",
    guideVideoDescriptionVi: "This video guides Vietnamese users through the Korean vocabulary and sentence learning app. After watching, choose a mode and level, click cards, and listen to Korean MP3 pronunciation.",
    guideVideoLink: "Open video in new window",
    homeLink: "← Back to VR MEDI TOUR & HOME",
    learningMode: "Learning Mode",
    wordsMode: "Basic Words",
    sentencesMode: "Medical Tourism Sentences",
    stageSelect: "Stage",
    testVoice: "Test Pronunciation",
    replayVoice: "Replay Pronunciation",
    restart: "Restart",
    stageLabel: "Stage",
    successLabel: "Matched",
    attemptsLabel: "Attempts",
    audioReady: "Click a card to play Korean MP3 pronunciation.",
    audioPreparing: "Preparing audio files.",
    audioMissing: "The audio file is not ready yet.",
    audioPlaying: "Playing:",
    audioPlayed: "Korean MP3 pronunciation has played.",
    medicalNotice: "This material is for learning Korean expressions. Actual diagnosis, prescription, and treatment decisions must follow medical staff guidance.",
    finalAttempts: "Total attempts:",
    attemptUnit: "",
    nextStage: "Next Stage",
    stageComplete: "Stage Complete",
    learningComplete: "Learning Complete",
    stageCompleteMessage: "You matched all 5 pairs. Move to the next stage.",
    finalCompleteMessage: "You completed the stage learning.",
    cardClosedLabel: "Face-down card, click to open",
    cardMatchedLabel: "Matched",
    stagePrefix: "Stage",
  },
  vi: {
    guideKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "Học từ vựng và câu tiếng Hàn về du lịch y tế",
    mainDescription: "Học từng bước các từ tiếng Hàn cơ bản và câu thực tế trong du lịch y tế dành cho người học nói tiếng Việt.",
    guideVideoTitle: "Video hướng dẫn sử dụng",
    guideVideoSubtitle: "Video hướng dẫn sử dụng",
    guideVideoDescriptionKo: "Video này hướng dẫn cách sử dụng ứng dụng học từ vựng và câu du lịch y tế tiếng Hàn dành cho người Việt. Hãy xem video trước, sau đó chọn chế độ học, bấm vào thẻ và nghe phát âm tiếng Hàn bằng MP3.",
    guideVideoDescriptionVi: "Video này hướng dẫn cách sử dụng ứng dụng học từ vựng và câu tiếng Hàn dành cho người Việt. Sau khi xem video, bạn có thể chọn chế độ học, chọn cấp độ, bấm vào thẻ và nghe phát âm tiếng Hàn bằng MP3.",
    guideVideoLink: "Xem video trong cửa sổ mới",
    homeLink: "← Quay lại VR MEDI TOUR & HOME",
    learningMode: "Chế độ học",
    wordsMode: "Từ cơ bản",
    sentencesMode: "Câu du lịch y tế",
    stageSelect: "Chọn cấp độ",
    testVoice: "Kiểm tra phát âm",
    replayVoice: "Nghe lại phát âm",
    restart: "Bắt đầu lại",
    stageLabel: "Cấp độ",
    successLabel: "Đúng",
    attemptsLabel: "Số lần thử",
    audioReady: "Bấm vào thẻ để nghe phát âm tiếng Hàn bằng MP3.",
    audioPreparing: "Đang chuẩn bị tệp âm thanh.",
    audioMissing: "Tệp âm thanh chưa sẵn sàng.",
    audioPlaying: "Đang phát:",
    audioPlayed: "Đã phát âm tiếng Hàn bằng MP3.",
    medicalNotice: "Tài liệu này chỉ dùng để học cách diễn đạt tiếng Hàn. Việc chẩn đoán, kê đơn và điều trị thực tế phải theo hướng dẫn của nhân viên y tế.",
    finalAttempts: "Tổng số lần thử:",
    attemptUnit: "",
    nextStage: "Cấp độ tiếp theo",
    stageComplete: "Hoàn thành cấp độ",
    learningComplete: "Hoàn thành bài học",
    stageCompleteMessage: "Bạn đã ghép đúng cả 5 cặp. Hãy chuyển sang cấp độ tiếp theo.",
    finalCompleteMessage: "Bạn đã hoàn thành các cấp độ học.",
    cardClosedLabel: "Thẻ đang úp, bấm để mở",
    cardMatchedLabel: "Đã ghép đúng",
    stagePrefix: "Cấp độ",
  },
  jp: {
    guideKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "韓国語の医療観光単語・文章学習",
    mainDescription: "ベトナム語話者向けに、韓国語の基本単語と医療観光の実務文章を段階別に学習します。",
    guideVideoTitle: "使い方案内動画",
    guideVideoSubtitle: "使い方動画",
    guideVideoDescriptionKo: "ベトナム語話者向けの韓国語単語・医療観光文章学習アプリの使い方を動画で案内します。先に動画を確認し、下で学習モードを選んでカードをクリックし、韓国語MP3発音を聞きながら学習できます。",
    guideVideoDescriptionVi: "この動画では、ベトナム語話者向けの韓国語語彙・文章学習アプリの使い方を説明します。動画を見た後、学習モードと段階を選び、カードをクリックして韓国語MP3発音を聞けます。",
    guideVideoLink: "動画を新しいウィンドウで見る",
    homeLink: "← VR MEDI TOUR & HOMEへ戻る",
    learningMode: "学習モード",
    wordsMode: "基本単語",
    sentencesMode: "医療観光文章",
    stageSelect: "段階選択",
    testVoice: "発音テスト",
    replayVoice: "発音をもう一度聞く",
    restart: "最初からやり直す",
    stageLabel: "段階",
    successLabel: "成功",
    attemptsLabel: "試行回数",
    audioReady: "カードをクリックすると韓国語MP3発音が再生されます。",
    audioPreparing: "音声ファイルを準備しています。",
    audioMissing: "音声ファイルはまだ準備されていません。",
    audioPlaying: "再生中:",
    audioPlayed: "韓国語MP3発音が再生されました。",
    medicalNotice: "この学習資料は韓国語表現の学習用です。実際の診断、処方、治療判断は必ず医療スタッフの案内に従ってください。",
    finalAttempts: "総試行回数:",
    attemptUnit: "回",
    nextStage: "次の段階",
    stageComplete: "段階完了",
    learningComplete: "学習完了",
    stageCompleteMessage: "5組すべてを合わせました。次の段階へ進んでください。",
    finalCompleteMessage: "段階学習を完了しました。",
    cardClosedLabel: "裏向きのカード、クリックして開く",
    cardMatchedLabel: "一致完了",
    stagePrefix: "段階",
  },
  cn: {
    guideKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "韩语医疗旅游单词与句子学习",
    mainDescription: "面向越南语学习者，分阶段学习韩语基础单词和医疗旅游实用句子。",
    guideVideoTitle: "使用方法视频",
    guideVideoSubtitle: "使用指南视频",
    guideVideoDescriptionKo: "本视频介绍面向越南语用户的韩语单词和医疗旅游句子学习应用的使用方法。请先观看视频，然后在下方选择学习模式，点击卡片并收听韩语MP3发音。",
    guideVideoDescriptionVi: "本视频指导越南语用户如何使用韩语词汇和句子学习应用。观看后，可以选择学习模式和阶段，点击卡片并收听韩语MP3发音。",
    guideVideoLink: "在新窗口观看视频",
    homeLink: "← 返回 VR MEDI TOUR & HOME",
    learningMode: "学习模式",
    wordsMode: "基础单词",
    sentencesMode: "医疗旅游句子",
    stageSelect: "选择阶段",
    testVoice: "发音测试",
    replayVoice: "再次播放发音",
    restart: "从头开始",
    stageLabel: "阶段",
    successLabel: "成功",
    attemptsLabel: "尝试次数",
    audioReady: "点击卡片即可播放韩语MP3发音。",
    audioPreparing: "正在准备音频文件。",
    audioMissing: "音频文件尚未准备好。",
    audioPlaying: "正在播放:",
    audioPlayed: "已播放韩语MP3发音。",
    medicalNotice: "本学习资料仅用于学习韩语表达。实际诊断、处方和治疗判断必须遵循医务人员的指导。",
    finalAttempts: "总尝试次数:",
    attemptUnit: "次",
    nextStage: "下一阶段",
    stageComplete: "阶段完成",
    learningComplete: "学习完成",
    stageCompleteMessage: "已全部匹配5组。请进入下一阶段。",
    finalCompleteMessage: "您已完成阶段学习。",
    cardClosedLabel: "背面卡片，点击打开",
    cardMatchedLabel: "匹配完成",
    stagePrefix: "阶段",
  },
};

const KOREAN_PRACTICE_I18N_PATCH = {
  ko: {
    navHome: "홈",
    navCompany: "회사소개",
    navTrust: "Trust Center",
    navFaq: "FAQ",
    navContact: "문의",
    serviceAiSkin: "AI 피부분석",
    serviceMyData: "MD 의료마이데이터 AI",
    serviceAiConsult: "AI 상담",
    serviceAmisTravel: "AMIS Travel Lounge",
    serviceAmisStore: "AMIS Goods Store",
    serviceRoyalRoots: "베트남 리왕조 투어",
    serviceKoreanPractice: "🇰🇷 한국어 연습",
    mainKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "한국어 의료관광 단어·문장 학습",
    mainDescription: "베트남어권 학습자를 위한 한국어 기본 단어와 의료관광 실무 문장을 단계별로 학습합니다.",
    guideVideoTitle: "사용법 안내 영상",
    guideVideoSubtitle: "Video hướng dẫn sử dụng",
    guideVideoDescription1: "베트남어권 사용자를 위한 한국어 단어·의료관광 문장 학습 앱 사용법을 영상으로 안내합니다.",
    guideVideoDescription2: "영상을 먼저 확인한 뒤, 아래에서 학습 모드를 선택하고 카드를 클릭해 한국어 MP3 발음을 들으며 학습할 수 있습니다.",
    watchVideo: "영상 새 창에서 보기",
    modeLabel: "학습 모드",
    wordMode: "기본 단어",
    sentenceMode: "의료관광 문장",
    stageLabel: "단계 선택",
    testVoice: "발음 테스트",
    replayVoice: "발음 다시 듣기",
    restart: "처음부터 다시",
    stage: "단계",
    success: "성공",
    attempts: "시도 횟수",
    cardInstruction: "카드를 클릭하면 한국어 MP3 발음이 재생됩니다.",
    backHome: "VR MEDI TOUR & HOME으로 돌아가기",
    safetyNotice: "이 학습 자료는 한국어 표현 학습용입니다. 실제 진단, 처방, 치료 판단은 반드시 의료진의 안내를 따라야 합니다.",
  },
  en: {
    navHome: "Home",
    navCompany: "Company",
    navTrust: "Trust Center",
    navFaq: "FAQ",
    navContact: "Contact",
    serviceAiSkin: "AI Skin Analysis",
    serviceMyData: "MD Medical MyData AI",
    serviceAiConsult: "AI Consultation",
    serviceAmisTravel: "AMIS Travel Lounge",
    serviceAmisStore: "AMIS Goods Store",
    serviceRoyalRoots: "Vietnam Ly Dynasty Tour",
    serviceKoreanPractice: "🇰🇷 Korean Practice",
    mainKicker: "VR MEDI TOUR KOREAN LANGUAGE GUIDE",
    mainTitle: "Korean Medical Tourism Words & Sentences",
    mainDescription: "Learn basic Korean words and practical medical tourism sentences step by step.",
    guideVideoTitle: "How to Use This App",
    guideVideoSubtitle: "User guide video",
    guideVideoDescription1: "This video explains how Vietnamese-speaking users can use this Korean word and medical tourism sentence learning app.",
    guideVideoDescription2: "After watching the video, choose a learning mode and level below, then click the cards to listen to Korean MP3 pronunciation.",
    watchVideo: "Watch video in a new window",
    modeLabel: "Learning Mode",
    wordMode: "Basic Words",
    sentenceMode: "Medical Tourism Sentences",
    stageLabel: "Select Level",
    testVoice: "Pronunciation Test",
    replayVoice: "Replay Pronunciation",
    restart: "Start Again",
    stage: "Level",
    success: "Matched",
    attempts: "Attempts",
    cardInstruction: "Click a card to hear the Korean MP3 pronunciation.",
    backHome: "Back to VR MEDI TOUR & HOME",
    safetyNotice: "This material is for learning Korean expressions only. Diagnosis, prescriptions, and treatment decisions must follow medical professionals’ guidance.",
  },
  vi: {
    navHome: "Trang chủ",
    navCompany: "Giới thiệu công ty",
    navTrust: "Trung tâm tin cậy",
    navFaq: "Câu hỏi thường gặp",
    navContact: "Liên hệ",
    serviceAiSkin: "Phân tích da AI",
    serviceMyData: "MD AI MyData y tế",
    serviceAiConsult: "Tư vấn AI",
    serviceAmisTravel: "AMIS Travel Lounge",
    serviceAmisStore: "AMIS Goods Store",
    serviceRoyalRoots: "Tour cội nguồn nhà Lý",
    serviceKoreanPractice: "🇰🇷 Luyện tiếng Hàn",
    mainKicker: "HƯỚNG DẪN HỌC TIẾNG HÀN VR MEDI TOUR",
    mainTitle: "Học tiếng Hàn cho du lịch y tế",
    mainDescription: "Học từ vựng tiếng Hàn cơ bản và các câu thường dùng trong bệnh viện, chăm sóc sức khỏe và du lịch y tế.",
    guideVideoTitle: "Video hướng dẫn sử dụng",
    guideVideoSubtitle: "Hướng dẫn bằng tiếng Việt",
    guideVideoDescription1: "Video này hướng dẫn người Việt cách sử dụng ứng dụng học từ vựng và câu tiếng Hàn trong lĩnh vực du lịch y tế.",
    guideVideoDescription2: "Sau khi xem video, hãy chọn chế độ học và bài học, rồi bấm vào thẻ để nghe phát âm tiếng Hàn bằng MP3.",
    watchVideo: "Xem video trong cửa sổ mới",
    modeLabel: "Chế độ học",
    wordMode: "Từ vựng cơ bản",
    sentenceMode: "Câu dùng trong du lịch y tế",
    stageLabel: "Chọn bài học",
    testVoice: "Nghe mẫu",
    replayVoice: "Nghe lại",
    restart: "Bắt đầu lại",
    stage: "Bài học",
    success: "Đã ghép đúng",
    attempts: "Số lần thử",
    cardInstruction: "Bấm vào thẻ để nghe phát âm tiếng Hàn bằng MP3.",
    backHome: "Quay lại VR MEDI TOUR & HOME",
    safetyNotice: "Tài liệu này chỉ dùng để học cách diễn đạt bằng tiếng Hàn. Việc chẩn đoán, kê đơn và điều trị phải thực hiện theo hướng dẫn của nhân viên y tế.",
  },
  jp: {
    navHome: "ホーム",
    navCompany: "会社紹介",
    navTrust: "Trust Center",
    navFaq: "FAQ",
    navContact: "お問い合わせ",
    serviceAiSkin: "AI肌分析",
    serviceMyData: "MD 医療マイデータAI",
    serviceAiConsult: "AI相談",
    serviceAmisTravel: "AMIS Travel Lounge",
    serviceAmisStore: "AMIS Goods Store",
    serviceRoyalRoots: "ベトナム李王朝ツアー",
    serviceKoreanPractice: "🇰🇷 韓国語練習",
    mainKicker: "VR MEDI TOUR 韓国語学習ガイド",
    mainTitle: "医療観光のための韓国語単語・文章学習",
    mainDescription: "ベトナム語話者向けに、韓国語の基本単語と医療観光の実用表現を段階別に学習します。",
    guideVideoTitle: "使い方案内動画",
    guideVideoSubtitle: "ベトナム語による案内",
    guideVideoDescription1: "この動画では、ベトナム語話者向けの韓国語単語・医療観光表現学習アプリの使い方を案内します。",
    guideVideoDescription2: "動画を確認した後、下で学習モードと段階を選び、カードをクリックして韓国語MP3の発音を聞きながら学習できます。",
    watchVideo: "新しいウィンドウで動画を見る",
    modeLabel: "学習モード",
    wordMode: "基本単語",
    sentenceMode: "医療観光表現",
    stageLabel: "段階選択",
    testVoice: "発音テスト",
    replayVoice: "発音をもう一度聞く",
    restart: "最初からやり直す",
    stage: "段階",
    success: "成功",
    attempts: "試行回数",
    cardInstruction: "カードをクリックすると韓国語MP3の発音が再生されます。",
    backHome: "VR MEDI TOUR & HOMEへ戻る",
    safetyNotice: "この教材は韓国語表現の学習用です。実際の診断、処方、治療判断は必ず医療従事者の案内に従ってください。",
  },
  cn: {
    navHome: "首页",
    navCompany: "公司介绍",
    navTrust: "信任中心",
    navFaq: "常见问题",
    navContact: "咨询",
    serviceAiSkin: "AI皮肤分析",
    serviceMyData: "MD 医疗MyData AI",
    serviceAiConsult: "AI咨询",
    serviceAmisTravel: "AMIS Travel Lounge",
    serviceAmisStore: "AMIS Goods Store",
    serviceRoyalRoots: "越南李王朝寻根之旅",
    serviceKoreanPractice: "🇰🇷 韩语练习",
    mainKicker: "VR MEDI TOUR 韩语学习指南",
    mainTitle: "医疗旅游韩语单词与句子学习",
    mainDescription: "为越南语使用者分阶段学习韩语基础单词和医疗旅游实用句子。",
    guideVideoTitle: "使用方法视频",
    guideVideoSubtitle: "越南语使用指南",
    guideVideoDescription1: "本视频介绍越南语用户如何使用韩语单词与医疗旅游句子学习应用。",
    guideVideoDescription2: "观看视频后，可在下方选择学习模式和阶段，点击卡片收听韩语MP3发音。",
    watchVideo: "在新窗口观看视频",
    modeLabel: "学习模式",
    wordMode: "基础单词",
    sentenceMode: "医疗旅游句子",
    stageLabel: "选择阶段",
    testVoice: "发音测试",
    replayVoice: "重听发音",
    restart: "重新开始",
    stage: "阶段",
    success: "成功",
    attempts: "尝试次数",
    cardInstruction: "点击卡片即可播放韩语MP3发音。",
    backHome: "返回 VR MEDI TOUR & HOME",
    safetyNotice: "本资料仅用于学习韩语表达。实际诊断、处方和治疗判断必须遵循医务人员的指导。",
  },
};

Object.entries(KOREAN_PRACTICE_I18N_PATCH).forEach(([lang, dictionary]) => {
  Object.assign(KOREAN_PRACTICE_I18N[lang], dictionary);
});

const MODE_CONFIG = {
  words: {
    label: "기본 단어",
    title: "한국어 의료관광 단어·문장 학습",
    description: "베트남어권 학습자를 위한 한국어 기본 단어와 의료관광 실무 문장을 단계별로 학습합니다.",
    sets: window.WORD_SETS || [],
    itemsKey: "words",
    expectedStages: 20,
    expectedItems: 100,
  },
  sentences: {
    label: "의료관광 문장",
    title: "한국어 의료관광 단어·문장 학습",
    description: "베트남어권 학습자를 위한 한국어 기본 단어와 의료관광 실무 문장을 단계별로 학습합니다.",
    sets: window.SENTENCE_SETS || [],
    itemsKey: "items",
    expectedStages: 10,
    expectedItems: 50,
  },
};

const state = {
  mode: "words",
  currentStage: 0,
  cards: [],
  openCards: [],
  attempts: 0,
  matchedPairs: 0,
  isLocked: false,
  lastPronunciationCard: null,
  currentAudio: null,
  currentLanguage: "ko",
};

const els = {
  appTitle: document.querySelector(".app__title"),
  modeDescription: document.getElementById("mode-description"),
  modeSelect: document.getElementById("mode-select"),
  board: document.getElementById("board"),
  stageSelect: document.getElementById("stage-select"),
  stageLabel: document.getElementById("stage-label"),
  attempts: document.getElementById("attempts"),
  matchedPairs: document.getElementById("matched-pairs"),
  restartBtn: document.getElementById("restart-btn"),
  replayBtn: document.getElementById("replay-btn"),
  testVoiceBtn: document.getElementById("test-voice-btn"),
  audioStatus: document.getElementById("audio-status"),
  winModal: document.getElementById("win-modal"),
  winTitle: document.getElementById("win-title"),
  winMessage: document.getElementById("win-message"),
  finalAttempts: document.getElementById("final-attempts"),
  nextStageBtn: document.getElementById("next-stage-btn"),
  modalRestartBtn: document.getElementById("modal-restart-btn"),
};

function normalizeLanguage(lang) {
  const value = (lang || "").toString().toLowerCase();
  if (value === "ja") return "jp";
  if (value === "zh") return "cn";
  return SUPPORTED_LANGS.includes(value) ? value : "ko";
}

function t(key, lang = state.currentLanguage) {
  const normalized = normalizeLanguage(lang);
  return KOREAN_PRACTICE_I18N[normalized]?.[key] ?? KOREAN_PRACTICE_I18N.ko[key] ?? key;
}

function getLangFromHref(href) {
  try {
    const url = new URL(href, window.location.href);
    return url.searchParams.get("lang");
  } catch {
    return null;
  }
}

function updateStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

function updateModeOptions() {
  if (!els.modeSelect) return;
  const wordsOption = els.modeSelect.querySelector('option[value="words"]');
  const sentencesOption = els.modeSelect.querySelector('option[value="sentences"]');
  if (wordsOption) wordsOption.textContent = t("wordMode");
  if (sentencesOption) sentencesOption.textContent = t("sentenceMode");
}

function updateLanguageButtons() {
  document.querySelectorAll(".language-switcher a[data-lang], .language-switcher button[data-lang]").forEach((button) => {
    const isActive = normalizeLanguage(button.dataset.lang) === state.currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateLanguageUrl(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
}

function applyLanguage(lang, options = {}) {
  const nextLang = normalizeLanguage(lang);
  state.currentLanguage = nextLang;
  const htmlLangMap = { ko: "ko", en: "en", vi: "vi", jp: "ja", cn: "zh-CN" };
  document.documentElement.lang = htmlLangMap[nextLang] || nextLang;
  localStorage.setItem("koreanPracticeLang", nextLang);
  if (options.updateUrl) updateLanguageUrl(nextLang);
  updateStaticTranslations();
  updateModeOptions();
  updateLanguageButtons();
  updateModeCopy();
  fillStageSelect();
  updateStatus();
  if (!state.lastPronunciationCard) setAudioStatus(t("cardInstruction"));
}

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  return normalizeLanguage(params.get("lang") || localStorage.getItem("koreanPracticeLang") || "ko");
}

function initLanguageSwitcher() {
  const switcher = document.querySelector(".language-switcher");
  if (!switcher) return;
  switcher.addEventListener("click", (event) => {
    const control = event.target.closest("a[data-lang], button[data-lang]");
    if (!control) return;
    event.preventDefault();
    const lang = normalizeLanguage(control.dataset.lang || getLangFromHref(control.getAttribute("href")));
    applyLanguage(lang, { updateUrl: true });
  });
}

function getModeConfig() {
  return MODE_CONFIG[state.mode];
}

function getActiveSets() {
  return getModeConfig().sets;
}

function getStageItems(stage) {
  const config = getModeConfig();
  return stage[config.itemsKey] || [];
}

function getCurrentSet() {
  return getActiveSets()[state.currentStage];
}

function getDisplayText(card) {
  return {
    korean: card.korean || card.word || "",
    vietnamese: card.vietnamese || card.vi || "",
    english: card.english || card.en || "",
    pronunciation: card.pronunciation || "",
  };
}

function setAudioStatus(message, isWarning = false) {
  els.audioStatus.textContent = message;
  els.audioStatus.classList.toggle("is-warning", isWarning);
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createCards(items) {
  return shuffle(items.flatMap((item, index) => [
    { ...item, id: `${state.mode}-${state.currentStage}-${index}-a` },
    { ...item, id: `${state.mode}-${state.currentStage}-${index}-b` },
  ]));
}

function playPronunciation(card) {
  const text = getDisplayText(card).korean;

  if (!card || !card.audio) {
    setAudioStatus(t("audioMissing"), true);
    return;
  }

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
  }

  const audio = new Audio(card.audio);
  state.currentAudio = audio;
  state.lastPronunciationCard = card;
  els.replayBtn.disabled = false;

  audio.addEventListener("playing", () => {
    setAudioStatus(`${t("audioPlaying")} ${text}`);
  });
  audio.addEventListener("ended", () => {
    setAudioStatus(t("audioPlayed"));
  });
  audio.addEventListener("error", () => {
    setAudioStatus(t("audioMissing"), true);
  });

  audio.play().catch(() => {
    setAudioStatus(t("audioMissing"), true);
  });
}

function createCardElement(card) {
  const text = getDisplayText(card);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  button.dataset.id = card.id;
  button.dataset.korean = text.korean;
  button.setAttribute("aria-label", t("cardClosedLabel"));
  button.innerHTML = `
    <span class="card__inner">
      <span class="card__face card__back" aria-hidden="true"></span>
      <span class="card__face card__front">
        <span class="card__word">${text.korean}</span>
        <span class="card__vi">${text.vietnamese}</span>
        <span class="card__en">${text.english}</span>
        <span class="card__pron">${text.pronunciation}</span>
      </span>
    </span>
  `;
  button.addEventListener("click", () => handleCardClick(button, card));
  return button;
}

function openCard(button, card) {
  const text = getDisplayText(card);
  button.classList.add("is-open");
  button.setAttribute("aria-label", `${text.korean}, ${text.vietnamese}, ${text.english}, ${text.pronunciation}`);
  state.openCards.push({ button, card });
  playPronunciation(card);
}

function closeCard(button) {
  button.classList.remove("is-open");
  button.setAttribute("aria-label", t("cardClosedLabel"));
}

function markAsMatched(button) {
  button.classList.remove("is-open");
  button.classList.add("is-matched");
  button.setAttribute("aria-label", `${button.dataset.korean}, ${t("cardMatchedLabel")}`);
}

function handleCardClick(button, card) {
  if (state.isLocked || button.classList.contains("is-open") || button.classList.contains("is-matched")) {
    return;
  }

  openCard(button, card);

  if (state.openCards.length === 2) {
    state.attempts += 1;
    updateStatus();
    checkForMatch();
  }
}

function checkForMatch() {
  const [first, second] = state.openCards;
  state.isLocked = true;

  if (getDisplayText(first.card).korean === getDisplayText(second.card).korean) {
    markAsMatched(first.button);
    markAsMatched(second.button);
    state.matchedPairs += 1;
    state.openCards = [];
    state.isLocked = false;
    updateStatus();
    checkForStageComplete();
    return;
  }

  setTimeout(() => {
    closeCard(first.button);
    closeCard(second.button);
    state.openCards = [];
    state.isLocked = false;
  }, 850);
}

function updateStatus() {
  const totalStages = getActiveSets().length;
  els.stageLabel.textContent = `${state.currentStage + 1} / ${totalStages}`;
  els.attempts.textContent = state.attempts;
  els.matchedPairs.textContent = `${state.matchedPairs} / ${PAIRS_PER_STAGE}`;
  els.stageSelect.value = String(state.currentStage);
  els.modeSelect.value = state.mode;
}

function checkForStageComplete() {
  if (state.matchedPairs !== PAIRS_PER_STAGE) return;

  const totalStages = getActiveSets().length;
  const isFinalStage = state.currentStage === totalStages - 1;
  els.finalAttempts.textContent = state.attempts;
  els.winTitle.textContent = isFinalStage ? t("learningComplete") : `${state.currentStage + 1} ${t("stageComplete")}`;
  els.winMessage.textContent = isFinalStage
    ? `${totalStages} ${t("stage")} ${t("finalCompleteMessage")}`
    : t("stageCompleteMessage");
  els.nextStageBtn.hidden = isFinalStage;

  setTimeout(() => {
    els.winModal.hidden = false;
  }, 450);
}

function updateModeCopy() {
  els.appTitle.textContent = t("mainTitle");
  els.modeDescription.textContent = t("mainDescription");
}

function updateBoardModeClass() {
  const isSentenceMode = state.mode === "sentences";
  els.board.classList.toggle("sentence-mode", isSentenceMode);
  els.board.classList.toggle("word-mode", !isSentenceMode);
}

function startStage(stageIndex) {
  const activeSets = getActiveSets();
  const nextIndex = Math.min(Math.max(stageIndex, 0), activeSets.length - 1);
  const set = activeSets[nextIndex];

  state.currentStage = nextIndex;
  state.cards = createCards(getStageItems(set));
  state.openCards = [];
  state.attempts = 0;
  state.matchedPairs = 0;
  state.isLocked = false;
  state.lastPronunciationCard = null;

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
  }

  els.board.innerHTML = "";
  updateBoardModeClass();
  state.cards.forEach((card) => els.board.appendChild(createCardElement(card)));
  els.replayBtn.disabled = true;
  els.winModal.hidden = true;
  setAudioStatus(t("cardInstruction"));
  updateModeCopy();
  updateStatus();
}

function resetFromBeginning() {
  startStage(0);
}

function fillStageSelect() {
  els.stageSelect.innerHTML = "";
  getActiveSets().forEach((set, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1} ${t("stage")}: ${set.title}`;
    els.stageSelect.appendChild(option);
  });
}

function changeMode(mode) {
  if (!MODE_CONFIG[mode]) return;
  state.mode = mode;
  fillStageSelect();
  startStage(0);
}

function validateSet(mode, config) {
  if (!config.sets.length) throw new Error(`${config.label} 데이터가 없습니다.`);
  if (config.sets.length !== config.expectedStages) {
    console.warn(`${config.label} 단계 수가 ${config.expectedStages}이 아닙니다: ${config.sets.length}`);
  }

  const items = config.sets.flatMap((set) => set[config.itemsKey] || []);
  if (items.length !== config.expectedItems) {
    console.warn(`${config.label} 항목 수가 ${config.expectedItems}이 아닙니다: ${items.length}`);
  }

  config.sets.forEach((set, index) => {
    if ((set[config.itemsKey] || []).length !== PAIRS_PER_STAGE) {
      console.warn(`${config.label} ${index + 1}단계 항목 수가 5개가 아닙니다.`);
    }
  });
}

function validateData() {
  Object.entries(MODE_CONFIG).forEach(([mode, config]) => validateSet(mode, config));
}

els.restartBtn.addEventListener("click", resetFromBeginning);
els.modalRestartBtn.addEventListener("click", resetFromBeginning);
els.nextStageBtn.addEventListener("click", () => startStage(state.currentStage + 1));
els.stageSelect.addEventListener("change", (event) => startStage(Number(event.target.value)));
els.modeSelect.addEventListener("change", (event) => changeMode(event.target.value));
els.testVoiceBtn.addEventListener("click", () => {
  const firstItem = getStageItems(getCurrentSet())[0];
  playPronunciation(firstItem);
});
els.replayBtn.addEventListener("click", () => {
  if (state.lastPronunciationCard) playPronunciation(state.lastPronunciationCard);
});

initLanguageSwitcher();
validateData();
fillStageSelect();
startStage(0);
applyLanguage(getInitialLanguage());


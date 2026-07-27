(function () {
  "use strict";

  var data = window.PILGRIM_DATA;
  var scenes = window.PILGRIM_SCENES;
  var screen = document.getElementById("screen");
  var toast = document.getElementById("toast");
  var KEYS = {
    currentScene: "pilgrimLanguage.currentScene.v2",
    completedScenes: "pilgrimLanguage.completedScenes.v2",
    sceneResponses: "pilgrimLanguage.sceneResponses.v2",
    voiceAttempts: "pilgrimLanguage.voiceAttempts.v2",
    viewMode: "pilgrimLanguage.viewMode.v2",
    recordingAttempts: "pilgrimLanguage.recordingAttempts.v1",
    recordingNoticeAccepted: "pilgrimLanguage.recordingNoticeAccepted.v1"
  };
  var storage = {
    load: function (key) { try { return localStorage.getItem(key); } catch (error) { return null; } },
    save: function (key, value) {
      try { localStorage.setItem(key, value); return true; }
      catch (error) { showToast("이 브라우저에서는 학습 기록을 저장할 수 없습니다."); return false; }
    },
    remove: function (key) { try { localStorage.removeItem(key); return true; } catch (error) { return false; } }
  };
  var state = {
    route: "journey",
    currentSceneId: storage.load(KEYS.currentScene) || scenes[0].id,
    completedScenes: readArray(KEYS.completedScenes),
    sceneResponses: readObject(KEYS.sceneResponses, {}),
    voiceAttempts: readObject(KEYS.voiceAttempts, {}),
    viewMode: storage.load(KEYS.viewMode) || "immersive",
    translationLines: [],
    activeNote: null,
    activeSpeech: null,
    playbackToken: 0,
    recognition: null,
    recognitionState: "idle",
    recognitionText: "",
    experience: readNumber(data.storageKeys.experience, 0),
    trust: readSignedNumber(data.storageKeys.trust, 0),
    savedWords: readArray(data.storageKeys.savedWords),
    selectedAnswer: storage.load(data.storageKeys.selectedAnswer) || "",
    progress: readObject(data.storageKeys.progress, { completedChapters: [], lastLocation: "journey" }),
    selectedVoiceKo: storage.load(data.storageKeys.voiceKo) || "",
    selectedVoiceVi: storage.load(data.storageKeys.voiceVi) || "",
    recordingAttempts: readObject(KEYS.recordingAttempts, {}),
    recordingNoticeAccepted: storage.load(KEYS.recordingNoticeAccepted) === "true",
    recordingStatus: "idle",
    recordingLineId: null,
    recordingError: "",
    recordingElapsed: 0
  };
  var toastTimer = 0;
  var recordedAudio = null;
  var sentenceRecordings = new Map();
  var mediaRecorder = null;
  var mediaStream = null;
  var recordingChunks = [];
  var recordingStartedAt = 0;
  var recordingTimer = 0;
  var recordingLimitTimer = 0;
  var userRecordingAudio = null;
  var comparisonToken = 0;
  var comparisonResolve = null;
  var recordingRequestToken = 0;
  var discardPendingRecording = false;
  var diagnosticStream = null;
  var diagnosticRecorder = null;
  var diagnosticChunks = [];
  var diagnosticAudio = null;
  var diagnosticObjectUrl = "";
  var diagnosticTimer = 0;
  var diagnosticRequestToken = 0;
  var diagnosticState = { status: "대기 중", lastErrorName: "", lastErrorMessage: "", durationMs: 0 };
  var RECORDING_MIME_CANDIDATES = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus"
  ];

  function readArray(key) {
    try { var value = JSON.parse(storage.load(key) || "[]"); return Array.isArray(value) ? value : []; }
    catch (error) { return []; }
  }
  function readObject(key, fallback) {
    try { var value = JSON.parse(storage.load(key) || ""); return value && typeof value === "object" ? value : fallback; }
    catch (error) { return fallback; }
  }
  function readNumber(key, fallback) {
    var value = Number(storage.load(key));
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  }
  function readSignedNumber(key, fallback) {
    var raw = storage.load(key);
    if (raw === null || raw === "") return fallback;
    var value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }
  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }
  function currentScene() {
    return scenes.find(function (scene) { return scene.id === state.currentSceneId; }) || scenes[0];
  }
  function sceneIndex(id) {
    return scenes.findIndex(function (scene) { return scene.id === id; });
  }
  function persistV2() {
    storage.save(KEYS.currentScene, state.currentSceneId);
    storage.save(KEYS.completedScenes, JSON.stringify(state.completedScenes));
    storage.save(KEYS.sceneResponses, JSON.stringify(state.sceneResponses));
    storage.save(KEYS.voiceAttempts, JSON.stringify(state.voiceAttempts));
    storage.save(KEYS.viewMode, state.viewMode);
  }
  function migrateV1() {
    var legacyWordIds = { leave: "word.leave", decide: "word.decide", "what-do": "word.what_must_do", toward: "word.head_toward", point: "word.point" };
    var legacyAnswerIds = { thoughtful: "answer.evangelist_reason.thoughtful", brief: "answer.evangelist_reason.brief", harsh: "answer.evangelist_reason.harsh" };
    var wordMigrationChanged = false;
    state.savedWords = state.savedWords.map(function (id) {
      if (legacyWordIds[id]) wordMigrationChanged = true;
      return legacyWordIds[id] || id;
    });
    if (wordMigrationChanged) storage.save(data.storageKeys.savedWords, JSON.stringify(state.savedWords));
    if (legacyAnswerIds[state.selectedAnswer]) {
      state.selectedAnswer = legacyAnswerIds[state.selectedAnswer];
      storage.save(data.storageKeys.selectedAnswer, state.selectedAnswer);
    }
    if (!storage.load(KEYS.currentScene)) {
      var completedChapter = state.progress.completedChapters.indexOf(data.chapter.id) !== -1;
      if (completedChapter) {
        state.completedScenes = scenes.map(function (scene) { return scene.id; });
        state.currentSceneId = scenes[scenes.length - 1].id;
      } else if (state.selectedAnswer) {
        var migratedAnswer = data.quest.answers.find(function (answer) { return answer.id === state.selectedAnswer; });
        state.currentSceneId = "scene.city.asking_direction";
        state.completedScenes = scenes.slice(0, 4).map(function (scene) { return scene.id; });
        if (migratedAnswer) {
          state.sceneResponses["scene.city.evangelist_appears"] = {
            transcript: migratedAnswer.text,
            meaningDelivery: migratedAnswer.result.meaningDelivery,
            requiredIntent: "find_new_path",
            keywordMatches: migratedAnswer.id.indexOf("thoughtful") !== -1 ? ["새로운 길", "찾으려고"] : [],
            grammarMatch: migratedAnswer.id.indexOf("thoughtful") !== -1 ? "intention" : "needs_support",
            pronunciationScore: null,
            trustChange: migratedAnswer.result.trustChange,
            experience: migratedAnswer.result.experience
          };
        }
      } else if (state.progress.lastLocation === "quest" || state.progress.lastLocation === "result") {
        state.currentSceneId = "scene.city.evangelist_appears";
        state.completedScenes = scenes.slice(0, 3).map(function (scene) { return scene.id; });
      }
      persistV2();
    }
  }
  function setRoute(route) {
    stopDiagnosticMedia(false);
    cleanupRecordingSession({ keepRecordedBlob: true });
    stopSpeech();
    stopRecognition();
    state.route = route;
    state.activeNote = null;
    state.translationLines = [];
    state.progress.lastLocation = route;
    storage.save(data.storageKeys.progress, JSON.stringify(state.progress));
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function updateHeader() {
    var level = state.experience >= data.rules.levelThresholds[1].minimumExperience ? 2 : 1;
    document.getElementById("header-level").textContent = String(level);
    document.getElementById("header-xp").textContent = String(state.experience);
    document.getElementById("header-progress-value").style.width = state.experience + "%";
    document.querySelectorAll("[data-nav]").forEach(function (button) {
      if (button.dataset.nav === state.route || (state.route === "player" && button.dataset.nav === "journey") || (state.route === "result" && button.dataset.nav === "records")) {
        button.setAttribute("aria-current", "page");
      } else button.removeAttribute("aria-current");
    });
  }
  function render() {
    updateHeader();
    if (state.route === "journey") renderJourney();
    else if (state.route === "player") renderScenePlayer();
    else if (state.route === "review") renderReview();
    else if (state.route === "records") renderRecords();
    else if (state.route === "settings") renderSettings();
    else renderPilgrimageRecord();
  }

  function renderJourney() {
    var completed = state.progress.completedChapters.indexOf(data.chapter.id) !== -1;
    var coverVisual = scenes[0].visual;
    screen.innerHTML = '<section class="chapter-cover" aria-labelledby="chapter-title">' +
      '<div class="cover-copy"><p class="eyebrow">Chapter 01</p><h1 id="chapter-title">멸망의 도시를 떠나다</h1><p class="cover-vi" lang="vi">Rời Khỏi Thành Hủy Diệt</p>' +
      '<p class="cover-description">크리스천은 등에 무거운 짐을 지고<br>떠나야 할 길을 찾고 있습니다.</p><p class="cover-description vi" lang="vi">Christian đang mang một gánh nặng<br>và tìm kiếm con đường mình phải đi.</p>' +
      '<button class="button cover-start" type="button" data-action="start-journey">' + (completed ? "첫 번째 여정 다시 보기" : "첫 번째 여정 시작") + '</button>' +
      '<div class="cover-meta"><span>약 7분</span><span>핵심 표현 5개</span><span>대화 1회</span></div></div>' +
      '<div class="cover-scene" style="' + visualStyle(coverVisual) + '">' + pictureMarkup(coverVisual, true) + '</div></section>' +
      '<section class="journey-overview"><div><p class="eyebrow">Your path</p><h2>제1장 순례길</h2><p>여섯 장면을 지나며 필요한 한국어를 이야기 속에서 사용합니다.</p></div>' +
      sceneProgressMarkup(state.currentSceneId, true) + '<button class="button secondary" type="button" data-action="resume-journey">현재 장면 이어가기</button></section>';
  }

  function sceneProgressMarkup(activeId, compact) {
    return '<ol class="scene-progress ' + (compact ? "compact" : "") + '" aria-label="제1장 장면 진행">' + scenes.map(function (scene) {
      var completed = state.completedScenes.indexOf(scene.id) !== -1;
      var active = scene.id === activeId;
      return '<li class="' + (completed ? "completed " : "") + (active ? "active" : "") + '"><span aria-hidden="true">' + (completed ? "✓" : scene.order) + '</span><small>장면 ' + scene.order + '</small></li>';
    }).join("") + '</ol>';
  }

  function renderScenePlayer() {
    var scene = currentScene();
    if (scene.interaction.type === "speech_response") {
      renderDialogueScene(scene);
      return;
    }
    screen.innerHTML = '<section class="scene-shell theme-' + scene.visual.colorTheme + '" data-scene-id="' + scene.id + '">' +
      '<header class="scene-topbar"><button class="text-button" type="button" data-route="journey">← 여정 지도</button><div><strong>장면 ' + scene.order + ' / 6</strong><span>' + escapeHtml(scene.titleKo) + '</span></div><button class="audio-button stop" type="button" data-action="stop-speech">듣기 중지</button></header>' +
      sceneProgressMarkup(scene.id, false) +
      '<div class="cinematic-frame placement-' + scene.visual.panelPlacement + ' tone-' + scene.visual.overlayTone + '" style="' + visualStyle(scene.visual) + '"><div class="scene-stage">' + pictureMarkup(scene.visual, false) + '<div class="scene-transition">' + escapeHtml(scene.transitionKo) + '</div></div>' +
      '<div class="scene-content"><div class="scene-toolbar"><details class="reading-menu"><summary>보기</summary><div class="view-switch" role="group" aria-label="읽기 보기 방식"><button type="button" data-view-mode="immersive" aria-pressed="' + (state.viewMode === "immersive") + '">몰입 읽기</button><button type="button" data-view-mode="compare" aria-pressed="' + (state.viewMode === "compare") + '">한·베 비교</button></div></details>' +
      '<details class="scene-audio-menu"><summary>듣기</summary><div><button class="audio-button" type="button" data-scene-audio="ko">한국어 보통</button><button class="audio-button" type="button" data-scene-audio="ko" data-slow="true">한국어 천천히</button><button class="audio-button" type="button" data-scene-audio="vi">베트남어 보통</button><button class="audio-button" type="button" data-scene-audio="vi" data-slow="true">베트남어 천천히</button><button class="audio-button stop" type="button" data-action="stop-speech">듣기 중지</button></div></details></div><p class="speech-notice" aria-live="polite"></p>' +
      '<div class="scene-lines">' + scene.lines.map(function (line) { return lineMarkup(scene, line); }).join("") + '</div>' +
      sceneInteractionMarkup(scene) + '</div></div>' + activeNoteMarkup(scene) + '</section>';
    syncSceneContentOverflow();
    if (state.activeSpeech) setActiveSpeech(state.activeSpeech.key, state.activeSpeech.lang);
    if (state.activeNote) {
      var closeButton = screen.querySelector(".drawer-close");
      if (closeButton) closeButton.focus();
    }
  }

  function visualStyle(visual) {
    return '--desktop-position:' + visual.desktopPosition + ';--mobile-position:' + visual.mobilePosition + ';';
  }

  function pictureMarkup(visual, eager) {
    return '<picture class="scene-picture">' +
      (visual.mobileImage ? '<source media="(max-width: 719px)" srcset="' + escapeHtml(visual.mobileImage) + '">' : '') +
      '<img class="scene-background" src="' + escapeHtml(visual.image) + '" alt="' + escapeHtml(visual.imageAltKo) + '" loading="' + (eager ? "eager" : "lazy") + '"' + (eager ? ' fetchpriority="high"' : '') + ' width="1672" height="941"></picture>';
  }

  function characterMarkup(character) {
    var name = character.characterId === "character.evangelist" ? "전도자" : "크리스천";
    return '<figure class="scene-character ' + character.position + '"><img src="' + character.asset + '" alt="' + name + '"><figcaption>' + name + '</figcaption></figure>';
  }

  function lineMarkup(scene, line) {
    var translationVisible = state.viewMode === "compare" || state.translationLines.indexOf(line.id) !== -1;
    var speaker = line.speakerId === "character.christian" ? "크리스천" : line.speakerId === "character.evangelist" ? "전도자" : "이야기";
    return '<article class="scene-line ' + (state.viewMode === "compare" ? "compare" : "") + '">' +
      '<div class="line-language ko-line" data-speech-key="' + line.id + '" data-speech-lang="ko"><span class="speaker-label">' + speaker + '</span><span class="playing-label">재생 중 · 한국어</span><p>' + markedLine(scene, line.ko) + '</p>' +
      '<div class="concept-links">' + scene.vocabularyIds.map(function (id) {
        var word = data.vocabulary.find(function (item) { return item.id === id; });
        return '<button type="button" data-note-type="vocabulary" data-note-id="' + id + '">어휘 · ' + escapeHtml(word.word) + '</button>';
      }).join("") + scene.grammarIds.map(function (id) {
        var grammar = data.grammar.find(function (item) { return item.id === id; });
        return '<button type="button" data-note-type="grammar" data-note-id="' + id + '">문법 · ' + escapeHtml(grammar.expression) + '</button>';
      }).join("") + '</div><div class="line-actions"><button class="audio-button" type="button" data-line-audio="' + line.id + '" data-lang="ko">모범 음성 듣기</button>' +
      recordingControlsMarkup(line) +
      (state.viewMode === "immersive" ? '<button class="text-button" type="button" data-toggle-translation="' + line.id + '">' + (translationVisible ? "번역 숨기기" : "번역 보기") + '</button>' : '') + '</div></div>' +
      (translationVisible ? '<div class="line-language vi-line" data-speech-key="' + line.id + '" data-speech-lang="vi"><span class="playing-label">Đang phát · Tiếng Việt</span><p lang="vi">' + escapeHtml(line.vi) + '</p><button class="audio-button" type="button" data-line-audio="' + line.id + '" data-lang="vi">베트남어 듣기</button></div>' : '') + '</article>';
  }

  function recordingControlsMarkup(line) {
    var recording = sentenceRecordings.get(line.id);
    var active = state.recordingLineId === line.id;
    if (active && state.recordingStatus === "notice") {
      return '<div class="recording-notice" role="note"><p>내 목소리는 현재 브라우저 안에서만 임시로 사용되며 서버로 전송되지 않습니다. 페이지를 새로고침하면 녹음은 삭제될 수 있습니다.</p><button class="button recording-primary" type="button" data-action="accept-recording-notice" data-record-line="' + line.id + '">확인하고 녹음 시작</button><button class="text-button" type="button" data-action="cancel-recording">취소</button></div>';
    }
    if (active && state.recordingStatus === "requesting_permission") {
      return '<div class="recording-status" role="status" aria-live="polite">마이크 사용 권한을 확인하고 있습니다.</div>';
    }
    if (active && (state.recordingStatus === "recording" || state.recordingStatus === "processing")) {
      return '<div class="recording-active"><p class="recording-line-text">' + escapeHtml(line.ko) + '</p><p class="recording-status" role="status" aria-live="polite"><span aria-hidden="true">●</span> ' + (state.recordingStatus === "processing" ? "녹음을 처리하고 있습니다." : '녹음 중 <span class="recording-clock" aria-hidden="true">' + formatDuration(state.recordingElapsed * 1000) + '</span>') + '</p><p>문장을 읽어 보세요.</p>' + (state.recordingStatus === "recording" ? '<button class="button recording-stop" type="button" data-action="stop-recording" aria-label="현재 문장 녹음 끝내기">녹음 끝내기</button>' : '') + '</div>';
    }
    if (active && ["permission_denied", "unsupported", "error"].indexOf(state.recordingStatus) !== -1) {
      return '<div class="recording-error" role="alert"><p>' + escapeHtml(state.recordingError) + '</p><button class="text-button" type="button" data-action="cancel-recording">안내 닫기</button></div>';
    }
    if (recording) {
      var playbackStatus = "";
      if (active && state.recordingStatus === "playing_user") playbackStatus = '<p class="recording-playback-status" role="status">내 목소리를 재생하고 있습니다.</p>';
      if (active && (state.recordingStatus === "playing_reference" || state.recordingStatus === "comparing")) {
        playbackStatus = '<div class="recording-playback-status" role="status"><strong>모범 음성 → 내 목소리</strong><span>억양, 속도, 끊어 읽기를 비교해 보세요.</span><button class="audio-button stop" type="button" data-action="stop-comparison">비교 중지</button></div>';
      }
      return '<div class="recording-controls">' + playbackStatus + '<button class="button recording-primary" type="button" data-action="play-user-recording" data-record-line="' + line.id + '">내 목소리 듣기</button><details class="recording-more"><summary>듣기·비교</summary><div><button class="audio-button" type="button" data-action="compare-recording" data-record-line="' + line.id + '">원음과 비교</button><button class="audio-button" type="button" data-action="start-recording" data-record-line="' + line.id + '">다시 녹음</button></div></details><small>녹음 ' + formatDuration(recording.durationMs) + ' · 시도 ' + recording.attemptCount + '회</small></div>';
    }
    return '<button class="button recording-primary" type="button" data-action="start-recording" data-record-line="' + line.id + '" aria-label="현재 한국어 문장 내 목소리 녹음">내 목소리 녹음</button>';
  }

  function formatDuration(durationMs) {
    var seconds = Math.max(0, Math.round(durationMs / 1000));
    return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
  }

  function markedLine(scene, text) {
    var value = escapeHtml(text);
    scene.vocabularyIds.forEach(function (id) {
      var word = data.vocabulary.find(function (item) { return item.id === id; });
      if (!word) return;
      var stems = id === "word.leave" ? ["떠나야", "떠나"] : id === "word.head_toward" ? ["향해"] : id === "word.point" ? ["가리키며"] : ["무엇을 해야 합니까"];
      stems.forEach(function (stem) {
        value = value.replace(stem, '<button class="inline-term vocab-term" type="button" data-note-type="vocabulary" data-note-id="' + id + '">' + stem + '</button>');
      });
    });
    scene.grammarIds.forEach(function (id) {
      var terms = id === "grammar.must_do" ? ["떠나야", "해야 합니까"] : ["어디로 가야 할지"];
      terms.forEach(function (term) {
        if (value.indexOf(">" + term + "<") === -1) value = value.replace(term, '<button class="inline-term grammar-term" type="button" data-note-type="grammar" data-note-id="' + id + '">' + term + '</button>');
      });
    });
    return value;
  }

  function sceneInteractionMarkup(scene) {
    if (scene.interaction.type === "grammar_check") {
      var grammar = data.grammar.find(function (item) { return item.id === scene.interaction.grammarId; });
      return '<div class="scene-check" data-exercise="' + grammar.id + '"><h3>길 위의 한 문장</h3><p>크리스천은 이 도시를 ______ 합니다.</p><div class="scene-choices">' +
        grammar.exercise.options.map(function (option, index) { return '<button type="button" data-answer="' + option.id + '">' + (index + 1) + '. ' + escapeHtml(option.text) + '</button>'; }).join("") +
        '</div><p class="feedback" aria-live="polite"></p></div><button class="button scene-next" type="button" data-action="next-scene">다음 장면</button>';
    }
    if (scene.interaction.type === "reflection") {
      return '<div class="reflection-prompt"><span>생각해 보기</span><p>' + escapeHtml(scene.interaction.promptKo) + '</p></div><button class="button scene-next" type="button" data-action="next-scene">전도자를 찾아 계속하기</button>';
    }
    if (scene.interaction.type === "repeat_line") {
      return '<div class="repeat-prompt"><strong>직접 따라 말해 보세요</strong><p>“제가 무엇을 해야 합니까?”</p><button class="audio-button" type="button" data-line-audio="' + scene.interaction.lineId + '" data-lang="ko">다시 듣기</button></div><button class="button scene-next" type="button" data-action="next-scene">대답을 듣기</button>';
    }
    if (scene.interaction.type === "complete_chapter") {
      return '<button class="button scene-next" type="button" data-action="complete-chapter">첫 여정 마치기</button>';
    }
    return '<button class="button scene-next" type="button" data-action="next-scene">다음 장면</button>';
  }

  function activeNoteMarkup(scene) {
    if (!state.activeNote) return "";
    if (state.activeNote.type === "vocabulary") {
      var word = data.vocabulary.find(function (item) { return item.id === state.activeNote.id; });
      if (!word) return "";
      var saved = state.savedWords.indexOf(word.id) !== -1;
      return '<aside class="learning-drawer" role="dialog" aria-modal="true" aria-labelledby="vocabulary-note-title"><button class="drawer-close" type="button" data-action="close-note" aria-label="어휘 노트 닫기">×</button><p class="eyebrow">Travel note · 어휘</p><h2 id="vocabulary-note-title">' + escapeHtml(word.word) + '</h2><p class="note-meaning" lang="vi">' + escapeHtml(word.vi) + '</p>' +
        '<div class="form-change"><span>기본형</span><strong>' + escapeHtml(word.word) + '</strong><b>→</b><span>장면 표현</span><strong>' + (word.id === "word.leave" ? "떠나야 하다" : escapeHtml(word.word)) + '</strong></div>' +
        '<p><small>본문</small><br><strong>' + escapeHtml(scene.lines[0].ko) + '</strong></p>' +
        (word.example ? '<div class="note-example"><p>' + escapeHtml(word.example) + '</p><p lang="vi">' + escapeHtml(word.translation) + '</p></div>' : '') +
        '<div class="button-row"><button class="audio-button" type="button" data-note-audio="' + word.id + '" data-lang="ko">한국어 듣기</button>' +
        '<button class="audio-button" type="button" data-note-audio="' + word.id + '" data-lang="vi">베트남어 듣기</button>' +
        '<button class="button secondary" type="button" data-save-word="' + word.id + '">' + (saved ? "여행 노트에서 제거" : "여행 노트에 저장") + '</button></div></aside>';
    }
    var grammar = data.grammar.find(function (item) { return item.id === state.activeNote.id; });
    if (!grammar) return "";
    return '<aside class="learning-drawer grammar-drawer" role="dialog" aria-modal="true" aria-labelledby="grammar-note-title"><button class="drawer-close" type="button" data-action="close-note" aria-label="문법 노트 닫기">×</button><p class="eyebrow">Travel note · 문법</p><h2 id="grammar-note-title">' + escapeHtml(grammar.expression) + '</h2>' +
      '<div class="form-change"><span>기본형</span><strong>떠나다</strong><b>→</b><span>형태 변화</span><strong>' + (grammar.id === "grammar.must_do" ? "떠나야 하다" : "가는지 모르다") + '</strong></div>' +
      '<p>' + escapeHtml(grammar.explanationKo) + '</p><p class="vi" lang="vi">' + escapeHtml(grammar.explanationVi) + '</p><div class="note-example"><p>' + escapeHtml(grammar.textExample) + '</p><p>' + escapeHtml(grammar.example) + '</p><p lang="vi">' + escapeHtml(grammar.translation) + '</p></div>' +
      '<div class="scene-check" data-exercise="' + grammar.id + '"><h3>한 문장 완성</h3><p>' + escapeHtml(grammar.exercise.prompt) + '</p><div class="scene-choices">' +
      grammar.exercise.options.map(function (option, index) { return '<button type="button" data-answer="' + option.id + '">' + (index + 1) + '. ' + escapeHtml(option.text) + '</button>'; }).join("") +
      '</div><p class="feedback" aria-live="polite"></p></div></aside>';
  }

  function renderDialogueScene(scene) {
    var supported = recognitionSupported();
    var response = state.sceneResponses[scene.id];
    var showChoices = !supported || state.recognitionState === "help" || (state.voiceAttempts[scene.id] || 0) >= 2;
    screen.innerHTML = '<section class="scene-shell dialogue-player theme-' + scene.visual.colorTheme + '" data-scene-id="' + scene.id + '"><header class="scene-topbar"><button class="text-button" type="button" data-route="journey">← 여정 지도</button><div><strong>장면 4 / 6</strong><span>전도자와 대화</span></div><button class="audio-button stop" type="button" data-action="stop-speech">듣기 중지</button></header>' +
      sceneProgressMarkup(scene.id, false) + '<div class="cinematic-frame dialogue-frame placement-' + scene.visual.panelPlacement + ' tone-' + scene.visual.overlayTone + '" style="' + visualStyle(scene.visual) + '"><div class="scene-stage dialogue-stage">' + pictureMarkup(scene.visual, false) + '</div>' +
      '<div class="dialogue-panel"><p class="npc-name">전도자</p><div class="npc-bubble"><p>“' + escapeHtml(scene.interaction.npcLineKo) + '”</p><span lang="vi">' + escapeHtml(scene.interaction.npcLineVi) + '</span></div>' +
      (!response ? '<div class="speak-actions"><button class="button speak-primary" type="button" data-action="start-recognition">' + recognitionButtonText() + '</button><button class="button secondary" type="button" data-action="show-help">표현 도움받기</button></div>' : '') +
      '<p class="recognition-status" role="status" aria-live="polite">' + recognitionStatusMarkup(supported) + '</p>' +
      '<details class="dialogue-line-practice"><summary>장면 문장 녹음 연습</summary><div><p>' + escapeHtml(scene.lines[0].ko) + '</p><button class="audio-button" type="button" data-line-audio="' + scene.lines[0].id + '" data-lang="ko">모범 음성 듣기</button>' + recordingControlsMarkup(scene.lines[0]) + '</div></details>' +
      (showChoices && !response ? fallbackChoicesMarkup() : '') +
      (response ? dialogueResponseMarkup(response, scene) : '') + '</div></div></section>';
    syncSceneContentOverflow();
  }

  function syncSceneContentOverflow() {
    window.requestAnimationFrame(function () {
      document.querySelectorAll(".cinematic-frame").forEach(function (frame) {
        if (window.innerWidth < 720 || frame.classList.contains("placement-below-image")) {
          frame.classList.remove("content-expanded");
          return;
        }
        frame.classList.remove("content-expanded");
        var panel = frame.querySelector(".scene-content, .dialogue-panel");
        if (panel && panel.scrollHeight > panel.clientHeight + 2) frame.classList.add("content-expanded");
      });
    });
  }

  function positionRecordingPopover(details) {
    if (!details || !details.open) return;
    var popover = details.querySelector(":scope > div");
    if (!popover) return;
    details.classList.remove("popover-above", "popover-below");
    var boundary = details.closest(".scene-content, .dialogue-panel") || document.documentElement;
    var triggerRect = details.getBoundingClientRect();
    var boundaryRect = boundary.getBoundingClientRect();
    var popoverHeight = popover.offsetHeight;
    var lowerEdge = Math.min(window.innerHeight, boundaryRect.bottom);
    var upperEdge = Math.max(0, boundaryRect.top);
    var belowSpace = lowerEdge - triggerRect.bottom;
    var aboveSpace = triggerRect.top - upperEdge;
    if (window.innerWidth >= 720 && Math.max(belowSpace, aboveSpace) < popoverHeight + 12) {
      var frame = details.closest(".cinematic-frame");
      if (frame) frame.classList.add("content-expanded");
      triggerRect = details.getBoundingClientRect();
      boundaryRect = boundary.getBoundingClientRect();
      belowSpace = Math.min(window.innerHeight, boundaryRect.bottom) - triggerRect.bottom;
      aboveSpace = triggerRect.top - Math.max(0, boundaryRect.top);
    }
    details.classList.add(belowSpace >= popoverHeight + 12 || belowSpace >= aboveSpace ? "popover-below" : "popover-above");
  }

  function recognitionSupported() {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  function recognitionButtonText() {
    if (state.recognitionState === "listening") return "듣는 중…";
    if (state.recognitionState === "complete" || state.recognitionState === "error") return "다시 말하기";
    return "직접 말하기";
  }
  function recognitionStatusMarkup(supported) {
    if (!supported) return "이 브라우저에서는 직접 말하기를 지원하지 않습니다. 아래 표현 중 하나를 선택해 계속할 수 있습니다.";
    if (state.recognitionState === "listening") return '<span class="listening-dot" aria-hidden="true"></span> 듣는 중입니다. 한국어로 답해 주세요.';
    if (state.recognitionState === "analyzing") return "말씀하신 문장을 분석하고 있습니다.";
    if (state.recognitionText) return "인식된 문장: “" + escapeHtml(state.recognitionText) + "”";
    return "마이크를 누르고 한국어로 직접 답해 보세요.";
  }
  function fallbackChoicesMarkup() {
    return '<div class="expression-help"><h3>이 표현으로 이어가기</h3>' + data.quest.answers.map(function (answer) {
      return '<button type="button" data-quest-answer="' + answer.id + '">' + escapeHtml(answer.text) + '</button>';
    }).join("") + '</div>';
  }
  function dialogueResponseMarkup(response, scene) {
    var good = response.meaningDelivery === "success" && response.grammarMatch === "intention";
    var practiceLine = { id: "practice.evangelist_reason.response", ko: response.transcript || scene.interaction.supplementKo };
    return '<div class="npc-response"><div class="user-response"><p class="npc-name">나</p><p>“' + escapeHtml(practiceLine.ko) + '”</p>' + recordingControlsMarkup(practiceLine) + '</div><p class="npc-name">전도자</p><div class="npc-bubble response"><p>“' + (good ? "좋습니다. 저 멀리 좁은 문이 보입니까? 그 문을 향해 가십시오." : "괜찮습니다. 이렇게 말해 보십시오. ‘저는 새로운 길을 찾으려고 합니다.’") + '”</p></div>' +
      '<div class="dialogue-learning-result"><span>의미 전달 <strong>' + (response.meaningDelivery === "success" ? "완료" : "보완") + '</strong></span><span>이유 설명 <strong>' + (response.keywordMatches.length ? "완료" : "보완") + '</strong></span><span>목표 문법 <strong>' + (response.grammarMatch === "intention" ? "완료" : "보완") + '</strong></span><span>전도자 신뢰도 <strong>' + (response.trustChange > 0 ? "+" : "") + response.trustChange + '</strong></span></div>' +
      (!good ? '<div class="supplement"><p>' + escapeHtml(scene.interaction.supplementKo) + '</p><p lang="vi">' + escapeHtml(scene.interaction.supplementVi) + '</p><button class="audio-button" type="button" data-supplement-audio="ko">보충 표현 듣기</button><button class="button secondary" type="button" data-action="retry-dialogue">다시 말하기</button></div>' : '') +
      '<button class="button scene-next" type="button" data-action="next-scene">다음 장면</button></div>';
  }

  function startRecognition() {
    cleanupRecordingSession({ keepRecordedBlob: true });
    var scene = currentScene();
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      state.recognitionState = "help";
      renderDialogueScene(scene);
      return;
    }
    stopRecognition();
    var recognition = new Recognition();
    state.recognition = recognition;
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = function () { state.recognitionState = "listening"; renderDialogueScene(scene); };
    recognition.onresult = function (event) {
      state.recognitionState = "analyzing";
      state.recognitionText = event.results[0][0].transcript;
      evaluateSpeechResponse(scene, state.recognitionText);
    };
    recognition.onerror = function () {
      state.recognitionState = "error";
      state.voiceAttempts[scene.id] = (state.voiceAttempts[scene.id] || 0) + 1;
      persistV2();
      renderDialogueScene(scene);
    };
    recognition.onend = function () { state.recognition = null; };
    try { recognition.start(); }
    catch (error) { state.recognitionState = "error"; renderDialogueScene(scene); }
  }
  function stopRecognition() {
    if (state.recognition) {
      try { state.recognition.abort(); } catch (error) { /* already stopped */ }
      state.recognition = null;
    }
  }
  function evaluateSpeechResponse(scene, transcript) {
    var matches = scene.interaction.keywords.filter(function (keyword) { return transcript.indexOf(keyword) !== -1; });
    var grammarMatch = /찾으려고|찾고 싶/.test(transcript) ? "intention" : "needs_support";
    var response = {
      transcript: transcript,
      meaningDelivery: matches.length ? "success" : "partial",
      requiredIntent: scene.interaction.requiredIntent,
      keywordMatches: matches,
      grammarMatch: grammarMatch,
      pronunciationScore: null,
      trustChange: matches.length && grammarMatch === "intention" ? 2 : 0,
      experience: matches.length && grammarMatch === "intention" ? 30 : 15
    };
    state.voiceAttempts[scene.id] = (state.voiceAttempts[scene.id] || 0) + 1;
    applyDialogueResult(scene, response, matches.length && grammarMatch === "intention" ? "answer.evangelist_reason.thoughtful" : "answer.evangelist_reason.brief");
  }
  function chooseQuestAnswer(id) {
    var scene = currentScene();
    var answer = data.quest.answers.find(function (item) { return item.id === id; });
    if (!answer) return;
    var response = {
      transcript: answer.text,
      meaningDelivery: answer.result.meaningDelivery,
      requiredIntent: scene.interaction.requiredIntent,
      keywordMatches: id.indexOf("thoughtful") !== -1 ? ["새로운 길", "찾으려고"] : [],
      grammarMatch: id.indexOf("thoughtful") !== -1 ? "intention" : "needs_support",
      pronunciationScore: null,
      trustChange: answer.result.trustChange,
      experience: answer.result.experience
    };
    applyDialogueResult(scene, response, id);
  }
  function applyDialogueResult(scene, response, answerId) {
    var previous = data.quest.answers.find(function (answer) { return answer.id === state.selectedAnswer; });
    if (previous) {
      state.experience = Math.max(0, state.experience - previous.result.experience);
      state.trust -= previous.result.trustChange;
    }
    state.selectedAnswer = answerId;
    state.experience = Math.min(data.rules.maxExperience, state.experience + response.experience);
    state.trust += response.trustChange;
    state.sceneResponses[scene.id] = response;
    state.recognitionState = "complete";
    storage.save(data.storageKeys.selectedAnswer, answerId);
    storage.save(data.storageKeys.experience, String(state.experience));
    storage.save(data.storageKeys.trust, String(state.trust));
    persistV2();
    renderDialogueScene(scene);
    updateHeader();
  }

  function completeScene() {
    cleanupRecordingSession({ keepRecordedBlob: true });
    stopSpeech();
    var scene = currentScene();
    if (state.completedScenes.indexOf(scene.id) === -1) state.completedScenes.push(scene.id);
    if (scene.nextSceneId) {
      state.currentSceneId = scene.nextSceneId;
      state.translationLines = [];
      state.activeNote = null;
      state.recognitionState = "idle";
      state.recognitionText = "";
      persistV2();
      renderScenePlayer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function completeChapter() {
    cleanupRecordingSession({ keepRecordedBlob: true });
    stopSpeech();
    var scene = currentScene();
    if (state.completedScenes.indexOf(scene.id) === -1) state.completedScenes.push(scene.id);
    if (state.progress.completedChapters.indexOf(data.chapter.id) === -1) state.progress.completedChapters.push(data.chapter.id);
    state.progress.lastLocation = "result";
    storage.save(data.storageKeys.progress, JSON.stringify(state.progress));
    persistV2();
    state.route = "result";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderReview() {
    var words = data.vocabulary.filter(function (word) { return state.savedWords.indexOf(word.id) !== -1; });
    screen.innerHTML = '<section class="standard-page"><p class="eyebrow">Travel notes</p><h1>여행 노트 복습</h1><p>이야기 속에서 만나 저장한 표현만 모았습니다.</p>' +
      (words.length ? '<div class="review-grid">' + words.map(function (word) {
        return '<article class="review-word"><h2>' + escapeHtml(word.word) + '</h2><p lang="vi">' + escapeHtml(word.vi) + '</p><p>' + escapeHtml(word.example || word.description) + '</p><button class="audio-button" type="button" data-free-audio="' + escapeHtml(word.example || word.word) + '" data-lang="ko">한국어 듣기</button><button class="button secondary" type="button" data-save-word="' + word.id + '">저장 해제</button></article>';
      }).join("") + '</div>' : '<div class="empty-state"><h2>아직 저장한 표현이 없습니다</h2><p>장면 속 밑줄 표현을 눌러 여행 노트에 저장해 보세요.</p><button class="button" type="button" data-nav="journey">여정으로 돌아가기</button></div>') + '</section>';
  }
  function renderRecords() {
    screen.innerHTML = '<section class="standard-page"><p class="eyebrow">Pilgrimage record</p><h1>나의 기록</h1><div class="record-dashboard"><article><span>완료한 장면</span><strong>' + state.completedScenes.length + ' / 6</strong></article><article><span>경험치</span><strong>' + state.experience + ' / 100</strong></article><article><span>저장한 표현</span><strong>' + state.savedWords.length + '개</strong></article><article><span>전도자 신뢰도</span><strong>' + state.trust + '</strong></article></div>' +
      '<div class="record-path">' + sceneProgressMarkup(state.currentSceneId, true) + '</div>' +
      (state.progress.completedChapters.indexOf(data.chapter.id) !== -1 ? '<button class="button" type="button" data-action="show-record">오늘의 순례 기록 보기</button>' : '<p>제1장의 마지막 장면을 마치면 오늘의 순례 기록이 완성됩니다.</p>') + '</section>';
  }
  function renderSettings() {
    screen.innerHTML = '<section class="standard-page settings-page"><p class="eyebrow">Settings</p><h1>설정</h1><div class="settings-card"><h2>음성 설정</h2>' + voiceSettingsMarkup() + '</div>' +
      diagnosticMarkup() +
      '<div class="settings-card"><h2>읽기 방식</h2><div class="view-switch"><button type="button" data-view-mode="immersive" aria-pressed="' + (state.viewMode === "immersive") + '">몰입 읽기</button><button type="button" data-view-mode="compare" aria-pressed="' + (state.viewMode === "compare") + '">한·베 비교</button></div></div>' +
      '<div class="settings-card danger-zone"><h2>학습 데이터</h2><p>기존 v1 및 현재 v2 학습 기록을 이 기기에서 초기화합니다.</p><button class="button danger" type="button" data-action="reset">학습 데이터 초기화</button></div></section>';
  }

  function diagnosticMarkup() {
    var mediaDevices = Boolean(navigator.mediaDevices);
    var getUserMedia = Boolean(mediaDevices && navigator.mediaDevices.getUserMedia);
    var mediaRecorderSupport = Boolean(window.MediaRecorder);
    var mimeType = selectedRecordingMimeType();
    var koCount = getVoicesForLanguage("ko-KR").length;
    var viCount = getVoicesForLanguage("vi-VN").length;
    var activeTracks = [diagnosticStream, mediaStream].reduce(function (count, stream) {
      return count + (stream ? stream.getAudioTracks().filter(function (track) { return track.readyState === "live"; }).length : 0);
    }, 0);
    function item(label, value, level) {
      return '<div><dt>' + label + '</dt><dd><span class="diagnostic-badge ' + level + '">' + (level === "available" ? "사용 가능" : level === "check" ? "확인 필요" : "지원하지 않음") + '</span><small>' + escapeHtml(value) + '</small></dd></div>';
    }
    return '<section class="settings-card diagnostic-panel" aria-labelledby="diagnostic-title"><div class="diagnostic-heading"><div><p class="eyebrow">Voice diagnostics</p><h2 id="diagnostic-title">음성 환경 진단</h2></div><p>정보와 시험 녹음은 서버로 전송되지 않습니다.</p></div><dl class="diagnostic-grid">' +
      item("보안 연결", window.isSecureContext ? "보안 컨텍스트" : "HTTPS 또는 localhost 필요", window.isSecureContext ? "available" : "check") +
      item("미디어 장치", mediaDevices ? "navigator.mediaDevices 감지" : "API 없음", mediaDevices ? "available" : "unsupported") +
      item("마이크 요청", getUserMedia ? "getUserMedia 감지" : "API 없음", getUserMedia ? "available" : "unsupported") +
      item("녹음 API", mediaRecorderSupport ? "MediaRecorder 감지" : "API 없음", mediaRecorderSupport ? "available" : "unsupported") +
      item("녹음 형식", mimeType || (mediaRecorderSupport ? "브라우저 기본 형식" : "선택 불가"), mediaRecorderSupport ? "available" : "unsupported") +
      item("직접 말하기", recognitionSupported() ? "SpeechRecognition 감지" : "API 없음", recognitionSupported() ? "available" : "unsupported") +
      item("TTS", speechSupported() ? "speechSynthesis 감지" : "API 없음", speechSupported() ? "available" : "unsupported") +
      item("한국어 음성", koCount + "개", koCount ? "available" : "check") +
      item("베트남어 음성", viCount + "개", viCount ? "available" : "check") +
      item("활성 마이크", activeTracks + "개 track", activeTracks ? "check" : "available") +
      item("마지막 녹음 오류", diagnosticState.lastErrorName ? diagnosticState.lastErrorName + ": " + diagnosticState.lastErrorMessage : "없음", diagnosticState.lastErrorName ? "check" : "available") +
      '</dl><p class="diagnostic-status" role="status" aria-live="polite">' + escapeHtml(diagnosticState.status) + '</p><div class="diagnostic-actions">' +
      '<button class="button secondary" type="button" data-diagnostic="permission">마이크 권한 확인</button><button class="button secondary" type="button" data-diagnostic="record">3초 시험 녹음</button><button class="button secondary" type="button" data-diagnostic="play"' + (diagnosticObjectUrl ? "" : " disabled") + '>시험 녹음 듣기</button><button class="audio-button" type="button" data-diagnostic="tts-ko">한국어 TTS 시험</button><button class="audio-button" type="button" data-diagnostic="tts-vi">베트남어 TTS 시험</button><button class="button danger" type="button" data-diagnostic="stop">모든 음성·마이크 정지</button></div>' +
      '<details class="diagnostic-raw"><summary>개발자용 원시 정보</summary><pre>' + escapeHtml(JSON.stringify({
        isSecureContext: window.isSecureContext,
        mediaDevices: mediaDevices,
        getUserMedia: getUserMedia,
        mediaRecorder: mediaRecorderSupport,
        selectedMimeType: mimeType || null,
        speechRecognition: recognitionSupported(),
        speechSynthesis: speechSupported(),
        koKrVoiceCount: koCount,
        viVnVoiceCount: viCount,
        activeMicrophoneTracks: activeTracks,
        lastRecordingError: { name: diagnosticState.lastErrorName || null, message: diagnosticState.lastErrorMessage || null },
        userAgent: navigator.userAgent
      }, null, 2)) + '</pre></details></section>';
  }
  function renderPilgrimageRecord() {
    var response = state.sceneResponses["scene.city.evangelist_appears"];
    var visual = scenes[5].visual;
    screen.innerHTML = '<section class="record-visual" style="' + visualStyle(visual) + '">' + pictureMarkup(visual, false) + '<div class="record-visual-caption"><p class="eyebrow">Chapter complete</p><h1>오늘의 순례 기록</h1><p>도시를 떠날 첫 방향을 찾았습니다.</p></div></section><section class="pilgrimage-record"><dl>' +
      '<div><dt>오늘 만난 인물</dt><dd>크리스천 · 전도자</dd></div><div><dt>오늘 배운 핵심 문장</dt><dd>“제가 무엇을 해야 합니까?”</dd></div><div><dt>사용한 문법</dt><dd>-아/어야 하다 · -는지 모르다</dd></div>' +
      '<div><dt>저장한 단어</dt><dd>' + state.savedWords.length + '개</dd></div><div><dt>대화에서 잘한 점</dt><dd>' + (response && response.meaningDelivery === "success" ? "새로운 길을 찾으려는 뜻을 전했습니다." : "대화를 끝까지 이어 갔습니다.") + '</dd></div>' +
      '<div><dt>다시 연습할 표현</dt><dd>아직 정확히 모르지만, 새로운 길을 찾고 싶습니다.</dd></div><div><dt>경험치</dt><dd>' + state.experience + ' / 100</dd></div><div><dt>전도자 신뢰도</dt><dd>' + state.trust + '</dd></div><div><dt>다음 장소</dt><dd>절망의 늪</dd></div></dl>' +
      '<div class="record-actions"><button class="button" type="button" data-action="practice-again">다시 연습</button><button class="button secondary" type="button" data-route="journey">여정 지도로</button><button class="button secondary" type="button" data-action="preview-next">다음 장소 미리 보기</button></div></section>';
  }

  function voiceSettingsMarkup() {
    return '<div class="voice-settings-grid"><label>한국어 음성<select data-voice-select="ko">' + voiceOptionsMarkup("ko") + '</select></label><label>베트남어 음성<select data-voice-select="vi">' + voiceOptionsMarkup("vi") + '</select></label></div><p class="settings-help">기본값은 브라우저의 언어별 자동 음성입니다.</p>';
  }
  function speechSupported() {
    return "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  }
  function getVoicesForLanguage(lang) {
    if (!speechSupported()) return [];
    var prefix = lang.split("-")[0].toLowerCase();
    return window.speechSynthesis.getVoices().filter(function (voice) { return voice.lang.toLowerCase().split("-")[0] === prefix; });
  }
  function voiceOptionsMarkup(language) {
    var selected = language === "vi" ? state.selectedVoiceVi : state.selectedVoiceKo;
    var voices = getVoicesForLanguage(language === "vi" ? "vi-VN" : "ko-KR");
    return '<option value="">자동 선택</option>' + voices.map(function (voice) {
      return '<option value="' + escapeHtml(voice.name) + '"' + (voice.name === selected ? " selected" : "") + '>' + escapeHtml(voice.name) + ' (' + escapeHtml(voice.lang) + ')</option>';
    }).join("");
  }
  function getVoiceForLanguage(lang) {
    var voices = getVoicesForLanguage(lang);
    var selected = lang.indexOf("vi") === 0 ? state.selectedVoiceVi : state.selectedVoiceKo;
    return voices.find(function (voice) { return voice.name === selected; }) || voices.find(function (voice) { return voice.lang.toLowerCase() === lang.toLowerCase(); }) || voices[0] || null;
  }
  function speechNotice(lang) {
    return lang.indexOf("vi") === 0 ? "이 기기에는 베트남어 음성이 설치되어 있지 않습니다. 기기의 음성 설정에서 베트남어 음성을 추가하거나 다른 브라우저에서 다시 시도해 주세요." : "이 기기에는 한국어 음성이 설치되어 있지 않습니다. 기기의 음성 설정에서 한국어 음성을 추가하거나 다른 브라우저에서 다시 시도해 주세요.";
  }
  function findLine(lineId) {
    if (lineId === "practice.evangelist_reason.response") {
      var response = state.sceneResponses["scene.city.evangelist_appears"];
      var dialogueScene = scenes.find(function (scene) { return scene.id === "scene.city.evangelist_appears"; });
      return {
        id: lineId,
        ko: response && response.transcript ? response.transcript : dialogueScene.interaction.supplementKo,
        vi: dialogueScene.interaction.supplementVi,
        audioKoNormal: "",
        audioKoSlow: "",
        audioViNormal: "",
        audioViSlow: ""
      };
    }
    var found = null;
    scenes.some(function (scene) {
      found = scene.lines.find(function (line) { return line.id === lineId; });
      return Boolean(found);
    });
    return found;
  }

  function recordingSupported() {
    return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }
  function selectedRecordingMimeType() {
    if (!window.MediaRecorder || typeof window.MediaRecorder.isTypeSupported !== "function") return "";
    return RECORDING_MIME_CANDIDATES.find(function (type) { return window.MediaRecorder.isTypeSupported(type); }) || "";
  }
  function setDiagnosticError(error) {
    diagnosticState.lastErrorName = error && error.name ? error.name : "UnknownError";
    diagnosticState.lastErrorMessage = error && error.message ? error.message : "알 수 없는 오류";
    diagnosticState.status = "확인 필요: " + diagnosticState.lastErrorMessage;
    stopDiagnosticMedia(false);
    renderSettings();
  }
  async function checkDiagnosticPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setDiagnosticError({ name: "NotSupportedError", message: "이 브라우저에서는 마이크 권한 확인을 지원하지 않습니다." });
      return;
    }
    stopDiagnosticMedia(false);
    var requestToken = ++diagnosticRequestToken;
    diagnosticState.status = "마이크 권한을 확인하고 있습니다.";
    renderSettings();
    try {
      diagnosticStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (requestToken !== diagnosticRequestToken) {
        diagnosticStream.getTracks().forEach(function (track) { track.stop(); });
        diagnosticStream = null;
        return;
      }
      diagnosticState.status = "마이크 사용이 가능합니다. 확인용 track을 종료했습니다.";
      diagnosticState.lastErrorName = "";
      diagnosticState.lastErrorMessage = "";
      diagnosticStream.getTracks().forEach(function (track) { track.stop(); });
      diagnosticStream = null;
      renderSettings();
    } catch (error) { setDiagnosticError(error); }
  }
  async function startDiagnosticRecording() {
    if (!recordingSupported()) {
      setDiagnosticError({ name: "NotSupportedError", message: "이 브라우저에서는 시험 녹음을 지원하지 않습니다." });
      return;
    }
    stopDiagnosticMedia(false);
    var requestToken = ++diagnosticRequestToken;
    diagnosticState.status = "3초 시험 녹음을 준비하고 있습니다.";
    renderSettings();
    try {
      diagnosticStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      if (requestToken !== diagnosticRequestToken) {
        diagnosticStream.getTracks().forEach(function (track) { track.stop(); });
        diagnosticStream = null;
        return;
      }
      var mimeType = selectedRecordingMimeType();
      diagnosticRecorder = mimeType ? new MediaRecorder(diagnosticStream, { mimeType: mimeType }) : new MediaRecorder(diagnosticStream);
      diagnosticChunks = [];
      diagnosticRecorder.ondataavailable = function (event) {
        if (event.data && event.data.size) diagnosticChunks.push(event.data);
      };
      diagnosticRecorder.onerror = setDiagnosticError;
      diagnosticRecorder.onstop = function () {
        window.clearTimeout(diagnosticTimer);
        if (diagnosticStream) diagnosticStream.getTracks().forEach(function (track) { track.stop(); });
        diagnosticStream = null;
        if (!diagnosticChunks.length) {
          setDiagnosticError({ name: "EmptyRecordingError", message: "시험 녹음 데이터가 생성되지 않았습니다." });
          return;
        }
        var blob = new Blob(diagnosticChunks, { type: diagnosticRecorder.mimeType || mimeType || "audio/webm" });
        if (diagnosticObjectUrl) URL.revokeObjectURL(diagnosticObjectUrl);
        diagnosticObjectUrl = URL.createObjectURL(blob);
        diagnosticState.durationMs = 3000;
        diagnosticState.status = "3초 시험 녹음이 완료되었습니다.";
        diagnosticState.lastErrorName = "";
        diagnosticState.lastErrorMessage = "";
        diagnosticRecorder = null;
        diagnosticChunks = [];
        renderSettings();
      };
      diagnosticRecorder.start();
      diagnosticState.status = "시험 녹음 중입니다. 3초 후 자동으로 종료합니다.";
      renderSettings();
      diagnosticTimer = window.setTimeout(function () {
        if (diagnosticRecorder && diagnosticRecorder.state !== "inactive") diagnosticRecorder.stop();
      }, 3000);
    } catch (error) { setDiagnosticError(error); }
  }
  function playDiagnosticRecording() {
    if (!diagnosticObjectUrl) {
      diagnosticState.status = "먼저 3초 시험 녹음을 실행해 주세요.";
      renderSettings();
      return;
    }
    if (diagnosticAudio) diagnosticAudio.pause();
    diagnosticAudio = new Audio(diagnosticObjectUrl);
    diagnosticState.status = "시험 녹음을 재생하고 있습니다.";
    renderSettings();
    diagnosticAudio.onended = function () {
      diagnosticAudio = null;
      diagnosticState.status = "시험 녹음 재생을 마쳤습니다.";
      renderSettings();
    };
    diagnosticAudio.onerror = function () {
      setDiagnosticError({ name: "PlaybackError", message: "시험 녹음을 재생할 수 없습니다." });
    };
    diagnosticAudio.play().catch(setDiagnosticError);
  }
  function testDiagnosticTts(language) {
    if (!speechSupported()) {
      diagnosticState.status = "이 브라우저에서는 TTS를 지원하지 않습니다.";
      renderSettings();
      return;
    }
    window.speechSynthesis.cancel();
    var lang = language === "vi" ? "vi-VN" : "ko-KR";
    var voice = getVoiceForLanguage(lang);
    if (!voice) {
      diagnosticState.status = language === "vi" ? "베트남어 음성을 찾지 못했습니다." : "한국어 음성을 찾지 못했습니다.";
      renderSettings();
      return;
    }
    var utterance = new SpeechSynthesisUtterance(language === "vi" ? "Xin chào. Đây là bài kiểm tra giọng nói tiếng Việt." : "안녕하세요. 한국어 음성 환경 시험입니다.");
    utterance.lang = lang;
    utterance.voice = voice;
    utterance.onstart = function () { diagnosticState.status = language === "vi" ? "베트남어 TTS를 재생하고 있습니다." : "한국어 TTS를 재생하고 있습니다."; renderSettings(); };
    utterance.onend = function () { diagnosticState.status = "TTS 시험을 마쳤습니다."; renderSettings(); };
    utterance.onerror = function (event) { setDiagnosticError({ name: event.error || "TtsError", message: "TTS 시험을 재생하지 못했습니다." }); };
    window.speechSynthesis.speak(utterance);
  }
  function stopDiagnosticMedia(revokeRecording) {
    diagnosticRequestToken += 1;
    window.clearTimeout(diagnosticTimer);
    if (diagnosticRecorder && diagnosticRecorder.state !== "inactive") {
      diagnosticRecorder.ondataavailable = null;
      diagnosticRecorder.onstop = null;
      try { diagnosticRecorder.stop(); } catch (error) { /* continue cleanup */ }
    }
    diagnosticRecorder = null;
    diagnosticChunks = [];
    if (diagnosticStream) diagnosticStream.getTracks().forEach(function (track) { track.stop(); });
    diagnosticStream = null;
    if (diagnosticAudio) {
      diagnosticAudio.pause();
      diagnosticAudio.removeAttribute("src");
      diagnosticAudio = null;
    }
    if (revokeRecording && diagnosticObjectUrl) {
      URL.revokeObjectURL(diagnosticObjectUrl);
      diagnosticObjectUrl = "";
    }
  }
  function stopAllVoiceAndMicrophone() {
    stopDiagnosticMedia(false);
    cleanupRecordingSession({ keepRecordedBlob: true, discardPending: true });
    stopSpeech();
    stopRecognition();
    diagnosticState.status = "모든 음성과 마이크를 정지했습니다.";
    renderSettings();
  }
  function requestRecording(lineId) {
    if (!recordingSupported()) {
      state.recordingLineId = lineId;
      state.recordingStatus = "unsupported";
      state.recordingError = "이 브라우저에서는 음성 녹음을 지원하지 않습니다. 듣기와 다른 학습 기능은 계속 사용할 수 있습니다.";
      render();
      return;
    }
    if (!state.recordingNoticeAccepted) {
      state.recordingLineId = lineId;
      state.recordingStatus = "notice";
      render();
      return;
    }
    startRecording(lineId);
  }
  async function startRecording(lineId) {
    var previous = sentenceRecordings.get(lineId) || null;
    cleanupRecordingSession({ keepRecordedBlob: true });
    var requestToken = ++recordingRequestToken;
    stopSpeech();
    stopRecognition();
    state.recordingLineId = lineId;
    state.recordingStatus = "requesting_permission";
    state.recordingError = "";
    render();
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      if (requestToken !== recordingRequestToken) { stopMediaTracks(); return; }
      var mimeType = selectedRecordingMimeType();
      mediaRecorder = mimeType ? new MediaRecorder(mediaStream, { mimeType: mimeType }) : new MediaRecorder(mediaStream);
      recordingChunks = [];
      discardPendingRecording = false;
      mediaRecorder.ondataavailable = function (event) {
        if (event.data && event.data.size) recordingChunks.push(event.data);
      };
      mediaRecorder.onerror = function () {
        finishRecordingError("녹음 중 오류가 발생했습니다. 기존 녹음은 그대로 유지됩니다.");
      };
      mediaRecorder.onstop = function () {
        window.clearInterval(recordingTimer);
        window.clearTimeout(recordingLimitTimer);
        stopMediaTracks();
        if (discardPendingRecording || !recordingChunks.length) {
          if (!discardPendingRecording) finishRecordingError("녹음된 소리를 만들 수 없습니다. 기존 녹음은 그대로 유지됩니다.");
          return;
        }
        var actualMime = mediaRecorder && mediaRecorder.mimeType ? mediaRecorder.mimeType : (mimeType || "audio/webm");
        var blob = new Blob(recordingChunks, { type: actualMime });
        if (!blob.size) { finishRecordingError("녹음된 소리를 만들 수 없습니다. 기존 녹음은 그대로 유지됩니다."); return; }
        var attempts = Number(state.recordingAttempts[lineId] || (previous && previous.attemptCount) || 0) + 1;
        var nextRecording = {
          lineId: lineId,
          blob: blob,
          objectUrl: URL.createObjectURL(blob),
          mimeType: actualMime,
          durationMs: Math.min(20000, Date.now() - recordingStartedAt),
          createdAt: new Date().toISOString(),
          attemptCount: attempts
        };
        if (previous) URL.revokeObjectURL(previous.objectUrl);
        sentenceRecordings.set(lineId, nextRecording);
        state.recordingAttempts[lineId] = attempts;
        storage.save(KEYS.recordingAttempts, JSON.stringify(state.recordingAttempts));
        state.recordingStatus = "recorded";
        state.recordingElapsed = 0;
        mediaRecorder = null;
        recordingChunks = [];
        render();
      };
      recordingStartedAt = Date.now();
      state.recordingStatus = "recording";
      state.recordingElapsed = 0;
      mediaRecorder.start();
      render();
      recordingTimer = window.setInterval(function () {
        state.recordingElapsed = Math.min(20, Math.floor((Date.now() - recordingStartedAt) / 1000));
        var clock = document.querySelector(".recording-clock");
        if (clock) clock.textContent = formatDuration(state.recordingElapsed * 1000);
      }, 250);
      recordingLimitTimer = window.setTimeout(stopActiveRecording, 20000);
    } catch (error) {
      stopMediaTracks();
      state.recordingStatus = error && (error.name === "NotAllowedError" || error.name === "SecurityError") ? "permission_denied" : "error";
      state.recordingError = state.recordingStatus === "permission_denied"
        ? "마이크 사용이 허용되지 않았습니다. 브라우저 주소창의 마이크 설정을 확인하거나, 듣기와 선택형 학습으로 계속할 수 있습니다."
        : (error && error.name === "NotFoundError" ? "사용할 수 있는 마이크를 찾지 못했습니다." : "녹음을 시작할 수 없습니다. 듣기와 다른 학습 기능은 계속 사용할 수 있습니다.");
      render();
    }
  }
  function stopActiveRecording() {
    if (!mediaRecorder || mediaRecorder.state === "inactive") return;
    state.recordingStatus = "processing";
    render();
    try { mediaRecorder.stop(); }
    catch (error) { finishRecordingError("녹음을 끝내지 못했습니다. 기존 녹음은 그대로 유지됩니다."); }
  }
  function stopMediaTracks() {
    if (mediaStream) mediaStream.getTracks().forEach(function (track) { track.stop(); });
    mediaStream = null;
  }
  function finishRecordingError(message) {
    window.clearInterval(recordingTimer);
    window.clearTimeout(recordingLimitTimer);
    discardPendingRecording = true;
    stopMediaTracks();
    mediaRecorder = null;
    recordingChunks = [];
    state.recordingStatus = "error";
    state.recordingError = message;
    render();
  }
  function stopUserRecordingPlayback() {
    comparisonToken += 1;
    if (userRecordingAudio) {
      userRecordingAudio.pause();
      userRecordingAudio.removeAttribute("src");
      userRecordingAudio = null;
    }
  }
  function playUserRecording(lineId, comparisonId) {
    var recording = sentenceRecordings.get(lineId);
    if (!recording) return Promise.resolve();
    stopCurrentAudio(true);
    if (!comparisonId) stopUserRecordingPlayback();
    state.recordingLineId = lineId;
    state.recordingStatus = comparisonId ? "comparing" : "playing_user";
    render();
    return new Promise(function (resolve) {
      userRecordingAudio = new Audio(recording.objectUrl);
      userRecordingAudio.onended = function () {
        userRecordingAudio = null;
        if (!comparisonId || comparisonId === comparisonToken) {
          state.recordingStatus = "recorded";
          render();
        }
        resolve();
      };
      userRecordingAudio.onerror = function () {
        userRecordingAudio = null;
        state.recordingStatus = "error";
        state.recordingError = "내 목소리를 재생할 수 없습니다.";
        render();
        resolve();
      };
      userRecordingAudio.play().catch(function () {
        state.recordingStatus = "error";
        state.recordingError = "내 목소리를 재생할 수 없습니다.";
        render();
        resolve();
      });
    });
  }
  function playReferenceForComparison(line, token) {
    return new Promise(function (resolve) {
      comparisonResolve = function () { comparisonResolve = null; resolve(); };
      if (token !== comparisonToken) { comparisonResolve(); return; }
      if (line.audioKoNormal) {
        recordedAudio = new Audio(line.audioKoNormal);
        recordedAudio.onended = comparisonResolve;
        recordedAudio.onerror = function () { playReferenceTts(line, token, comparisonResolve); };
        recordedAudio.play().catch(function () { playReferenceTts(line, token, comparisonResolve); });
      } else playReferenceTts(line, token, comparisonResolve);
    });
  }
  function playReferenceTts(line, token, resolve) {
    if (!speechSupported() || token !== comparisonToken) { resolve(); return; }
    var voice = getVoiceForLanguage("ko-KR");
    if (!voice) { showSpeechNotice(speechNotice("ko-KR")); resolve(); return; }
    var utterance = new SpeechSynthesisUtterance(line.ko);
    utterance.lang = "ko-KR";
    utterance.voice = voice;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  }
  async function compareRecording(lineId) {
    var line = findLine(lineId);
    if (!line || !sentenceRecordings.has(lineId)) return;
    cleanupRecordingSession({ keepRecordedBlob: true });
    stopSpeech();
    var token = ++comparisonToken;
    state.recordingLineId = lineId;
    state.recordingStatus = "playing_reference";
    render();
    await playReferenceForComparison(line, token);
    if (token !== comparisonToken) return;
    state.recordingStatus = "comparing";
    render();
    await new Promise(function (resolve) { window.setTimeout(resolve, 700); });
    if (token !== comparisonToken) return;
    await playUserRecording(lineId, token);
  }
  function cleanupRecordingSession(options) {
    options = options || { keepRecordedBlob: true };
    recordingRequestToken += 1;
    window.clearInterval(recordingTimer);
    window.clearTimeout(recordingLimitTimer);
    if (comparisonResolve) comparisonResolve();
    stopUserRecordingPlayback();
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      discardPendingRecording = options.keepRecordedBlob === false || options.discardPending === true;
      try { mediaRecorder.stop(); } catch (error) { /* tracks are stopped below */ }
      stopMediaTracks();
    } else stopMediaTracks();
    mediaRecorder = null;
    recordingChunks = [];
    state.recordingStatus = "idle";
    state.recordingLineId = null;
    state.recordingElapsed = 0;
    if (options.keepRecordedBlob === false) {
      sentenceRecordings.forEach(function (recording) { URL.revokeObjectURL(recording.objectUrl); });
      sentenceRecordings.clear();
    }
  }
  function speakLine(lineId, language, slow) {
    var line = findLine(lineId);
    if (!line) return;
    var vi = language === "vi";
    speakText({
      text: vi ? line.vi : line.ko,
      lang: vi ? "vi-VN" : "ko-KR",
      rate: slow ? 0.7 : (vi ? 0.9 : 1),
      speechKey: line.id,
      audioNormal: vi ? line.audioViNormal : line.audioKoNormal,
      audioSlow: vi ? line.audioViSlow : line.audioKoSlow
    });
  }
  function speakText(options) {
    cleanupRecordingSession({ keepRecordedBlob: true });
    var token = ++state.playbackToken;
    stopCurrentAudio(false);
    var audioSource = options.rate <= 0.7 ? options.audioSlow : options.audioNormal;
    if (audioSource) {
      recordedAudio = new Audio(audioSource);
      recordedAudio.onplay = function () { if (token === state.playbackToken) setActiveSpeech(options.speechKey, options.lang); };
      recordedAudio.onended = function () { if (token === state.playbackToken) clearActiveSpeech(); };
      recordedAudio.onerror = function () { speakWithBrowserVoice(options, token); };
      recordedAudio.play().catch(function () { speakWithBrowserVoice(options, token); });
      return;
    }
    speakWithBrowserVoice(options, token);
  }
  function speakWithBrowserVoice(options, token) {
    if (!speechSupported()) { showSpeechNotice(speechNotice(options.lang)); return; }
    var voice = getVoiceForLanguage(options.lang);
    if (!voice) { showSpeechNotice(speechNotice(options.lang)); return; }
    var utterance = new SpeechSynthesisUtterance(options.text);
    utterance.lang = options.lang;
    utterance.rate = options.rate || 1;
    utterance.voice = voice;
    utterance.onstart = function () { if (token === state.playbackToken) setActiveSpeech(options.speechKey, options.lang); };
    utterance.onend = function () { if (token === state.playbackToken) clearActiveSpeech(); };
    utterance.onerror = function () { if (token === state.playbackToken) { clearActiveSpeech(); showSpeechNotice(speechNotice(options.lang)); } };
    window.speechSynthesis.speak(utterance);
  }
  function speakScene(language, slow) {
    cleanupRecordingSession({ keepRecordedBlob: true });
    var scene = currentScene();
    var index = 0;
    var token = ++state.playbackToken;
    stopCurrentAudio(false);
    function next() {
      if (token !== state.playbackToken || index >= scene.lines.length) { clearActiveSpeech(); return; }
      var line = scene.lines[index++];
      var vi = language === "vi";
      var voice = getVoiceForLanguage(vi ? "vi-VN" : "ko-KR");
      if (!voice) { showSpeechNotice(speechNotice(vi ? "vi-VN" : "ko-KR")); return; }
      var utterance = new SpeechSynthesisUtterance(vi ? line.vi : line.ko);
      utterance.lang = vi ? "vi-VN" : "ko-KR";
      utterance.rate = slow ? 0.7 : (vi ? 0.9 : 1);
      utterance.voice = voice;
      utterance.onstart = function () { setActiveSpeech(line.id, utterance.lang); };
      utterance.onend = next;
      utterance.onerror = function () { clearActiveSpeech(); showSpeechNotice(speechNotice(utterance.lang)); };
      window.speechSynthesis.speak(utterance);
    }
    next();
  }
  function speakChapter(language, slow) {
    cleanupRecordingSession({ keepRecordedBlob: true });
    var lines = scenes.reduce(function (all, scene) { return all.concat(scene.lines); }, []);
    var index = 0;
    var token = ++state.playbackToken;
    stopCurrentAudio(false);
    function next() {
      if (token !== state.playbackToken || index >= lines.length) { clearActiveSpeech(); return; }
      var line = lines[index++];
      var vi = language === "vi";
      var lang = vi ? "vi-VN" : "ko-KR";
      var voice = getVoiceForLanguage(lang);
      if (!voice) { showSpeechNotice(speechNotice(lang)); return; }
      var utterance = new SpeechSynthesisUtterance(vi ? line.vi : line.ko);
      utterance.lang = lang;
      utterance.rate = slow ? .7 : (vi ? .9 : 1);
      utterance.voice = voice;
      utterance.onstart = function () { setActiveSpeech(line.id, lang); };
      utterance.onend = next;
      utterance.onerror = function () { clearActiveSpeech(); showSpeechNotice(speechNotice(lang)); };
      window.speechSynthesis.speak(utterance);
    }
    next();
  }
  function setActiveSpeech(key, lang) {
    clearActiveSpeech();
    state.activeSpeech = { key: key, lang: lang };
    var shell = document.querySelector(".scene-shell");
    if (shell) shell.classList.add("is-speaking");
    if (!key) return;
    var language = lang.indexOf("vi") === 0 ? "vi" : "ko";
    var element = document.querySelector('[data-speech-key="' + key + '"][data-speech-lang="' + language + '"]');
    if (element) element.classList.add("speaking");
  }
  function clearActiveSpeech() {
    state.activeSpeech = null;
    var shell = document.querySelector(".scene-shell");
    if (shell) shell.classList.remove("is-speaking");
    document.querySelectorAll(".line-language.speaking").forEach(function (element) { element.classList.remove("speaking"); });
  }
  function stopCurrentAudio(invalidate) {
    if (invalidate !== false) state.playbackToken += 1;
    if (speechSupported()) window.speechSynthesis.cancel();
    if (recordedAudio) { recordedAudio.pause(); recordedAudio.removeAttribute("src"); recordedAudio = null; }
    clearActiveSpeech();
  }
  function stopSpeech() { stopCurrentAudio(true); }
  function showSpeechNotice(message) {
    var element = document.querySelector(".speech-notice");
    if (element) element.textContent = message;
    else showToast(message);
  }

  function toggleTranslation(lineId) {
    var index = state.translationLines.indexOf(lineId);
    if (index === -1) state.translationLines.push(lineId);
    else state.translationLines.splice(index, 1);
    renderScenePlayer();
  }
  function toggleSavedWord(id) {
    var index = state.savedWords.indexOf(id);
    if (index === -1) { state.savedWords.push(id); showToast("여행 노트에 저장했습니다."); }
    else { state.savedWords.splice(index, 1); showToast("여행 노트에서 제거했습니다."); }
    storage.save(data.storageKeys.savedWords, JSON.stringify(state.savedWords));
    render();
  }
  function answerExercise(button) {
    var wrapper = button.closest("[data-exercise]");
    var grammar = data.grammar.find(function (item) { return item.id === wrapper.dataset.exercise; });
    if (!grammar) return;
    var correct = button.dataset.answer === grammar.exercise.answerId;
    wrapper.querySelectorAll("[data-answer]").forEach(function (choice) {
      choice.classList.remove("correct", "incorrect");
      if (choice.dataset.answer === grammar.exercise.answerId) choice.classList.add("correct");
    });
    if (!correct) button.classList.add("incorrect");
    wrapper.querySelector(".feedback").textContent = correct ? "정답입니다. 이 문장을 다음 장면에서도 사용해 보세요." : "조금 더 살펴보세요. 정답 표현을 표시했습니다.";
  }
  function resetData() {
    if (!window.confirm("이 기기에 저장된 순례자의 길 학습 기록을 모두 초기화할까요?")) return;
    cleanupRecordingSession({ keepRecordedBlob: false });
    stopDiagnosticMedia(true);
    Object.keys(data.storageKeys).forEach(function (name) { storage.remove(data.storageKeys[name]); });
    Object.keys(KEYS).forEach(function (name) { storage.remove(KEYS[name]); });
    state.currentSceneId = scenes[0].id;
    state.completedScenes = [];
    state.sceneResponses = {};
    state.voiceAttempts = {};
    state.experience = 0;
    state.trust = 0;
    state.savedWords = [];
    state.selectedAnswer = "";
    state.progress = { completedChapters: [], lastLocation: "journey" };
    state.route = "journey";
    render();
    showToast("학습 기록을 초기화했습니다.");
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.nav) setRoute(target.dataset.nav);
    else if (target.dataset.route) setRoute(target.dataset.route);
    else if (target.dataset.diagnostic === "permission") checkDiagnosticPermission();
    else if (target.dataset.diagnostic === "record") startDiagnosticRecording();
    else if (target.dataset.diagnostic === "play") playDiagnosticRecording();
    else if (target.dataset.diagnostic === "tts-ko") testDiagnosticTts("ko");
    else if (target.dataset.diagnostic === "tts-vi") testDiagnosticTts("vi");
    else if (target.dataset.diagnostic === "stop") stopAllVoiceAndMicrophone();
    else if (target.dataset.action === "start-journey") {
      state.currentSceneId = scenes[0].id;
      persistV2();
      setRoute("player");
    } else if (target.dataset.action === "resume-journey") setRoute("player");
    else if (target.dataset.action === "next-scene") completeScene();
    else if (target.dataset.action === "complete-chapter") completeChapter();
    else if (target.dataset.action === "stop-speech") stopSpeech();
    else if (target.dataset.action === "start-recording") requestRecording(target.dataset.recordLine);
    else if (target.dataset.action === "accept-recording-notice") {
      state.recordingNoticeAccepted = true;
      storage.save(KEYS.recordingNoticeAccepted, "true");
      startRecording(target.dataset.recordLine);
    }
    else if (target.dataset.action === "stop-recording") stopActiveRecording();
    else if (target.dataset.action === "play-user-recording") playUserRecording(target.dataset.recordLine);
    else if (target.dataset.action === "compare-recording") compareRecording(target.dataset.recordLine);
    else if (target.dataset.action === "stop-comparison") {
      cleanupRecordingSession({ keepRecordedBlob: true });
      stopSpeech();
      render();
    }
    else if (target.dataset.action === "cancel-recording") {
      cleanupRecordingSession({ keepRecordedBlob: true, discardPending: true });
      render();
    }
    else if (target.dataset.action === "close-note") { state.activeNote = null; renderScenePlayer(); }
    else if (target.dataset.action === "start-recognition") startRecognition();
    else if (target.dataset.action === "show-help") { state.recognitionState = "help"; renderDialogueScene(currentScene()); }
    else if (target.dataset.action === "retry-dialogue") {
      delete state.sceneResponses[currentScene().id];
      state.recognitionState = "idle";
      persistV2();
      renderDialogueScene(currentScene());
    } else if (target.dataset.action === "show-record") { state.route = "result"; render(); }
    else if (target.dataset.action === "practice-again") {
      state.currentSceneId = scenes[0].id;
      state.route = "player";
      persistV2();
      render();
    } else if (target.dataset.action === "preview-next") showToast("다음 장소 ‘절망의 늪’은 2차 콘텐츠에서 열립니다.");
    else if (target.dataset.action === "reset") resetData();
    else if (target.dataset.viewMode) {
      state.viewMode = target.dataset.viewMode;
      storage.save(KEYS.viewMode, state.viewMode);
      render();
    } else if (target.dataset.toggleTranslation) toggleTranslation(target.dataset.toggleTranslation);
    else if (target.dataset.noteType) {
      state.activeNote = { type: target.dataset.noteType, id: target.dataset.noteId };
      renderScenePlayer();
    } else if (target.dataset.lineAudio) speakLine(target.dataset.lineAudio, target.dataset.lang, false);
    else if (target.dataset.sceneAudio) speakScene(target.dataset.lang, target.dataset.slow === "true");
    else if (target.dataset.chapterAudio) speakChapter(target.dataset.chapterAudio, target.dataset.slow === "true");
    else if (target.dataset.noteAudio) {
      var word = data.vocabulary.find(function (item) { return item.id === target.dataset.noteAudio; });
      speakText({ text: target.dataset.lang === "vi" ? (word.translation || word.vi) : (word.example || word.word), lang: target.dataset.lang === "vi" ? "vi-VN" : "ko-KR", rate: target.dataset.lang === "vi" ? .9 : 1 });
    } else if (target.dataset.supplementAudio) {
      speakText({ text: currentScene().interaction.supplementKo, lang: "ko-KR", rate: 1 });
    } else if (target.dataset.freeAudio) {
      speakText({ text: target.dataset.freeAudio, lang: target.dataset.lang === "vi" ? "vi-VN" : "ko-KR", rate: 1 });
    } else if (target.dataset.saveWord) toggleSavedWord(target.dataset.saveWord);
    else if (target.dataset.answer) answerExercise(target);
    else if (target.dataset.questAnswer) chooseQuestAnswer(target.dataset.questAnswer);
  });

  document.addEventListener("change", function (event) {
    var select = event.target.closest("[data-voice-select]");
    if (!select) return;
    if (select.dataset.voiceSelect === "vi") {
      state.selectedVoiceVi = select.value;
      storage.save(data.storageKeys.voiceVi, select.value);
    } else {
      state.selectedVoiceKo = select.value;
      storage.save(data.storageKeys.voiceKo, select.value);
    }
    showToast("음성 설정을 저장했습니다.");
  });

  document.addEventListener("click", function (event) {
    var summary = event.target.closest(".recording-more > summary");
    if (summary) {
      window.setTimeout(function () { positionRecordingPopover(summary.parentElement); }, 0);
      return;
    }
    if (!event.target.closest(".recording-more")) {
      document.querySelectorAll(".recording-more[open]").forEach(function (details) {
        details.open = false;
        details.classList.remove("popover-above", "popover-below");
      });
      syncSceneContentOverflow();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      var openRecordingMenu = document.querySelector(".recording-more[open]");
      if (openRecordingMenu) {
        openRecordingMenu.open = false;
        openRecordingMenu.classList.remove("popover-above", "popover-below");
        openRecordingMenu.querySelector("summary").focus();
        syncSceneContentOverflow();
      } else if (state.recordingStatus !== "idle") {
        cleanupRecordingSession({ keepRecordedBlob: true, discardPending: true });
        render();
      } else if (state.activeNote) {
        state.activeNote = null;
        renderScenePlayer();
      }
    }
  });

  window.addEventListener("resize", function () {
    syncSceneContentOverflow();
    document.querySelectorAll(".recording-more[open]").forEach(positionRecordingPopover);
  });

  window.addEventListener("beforeunload", function () {
    stopDiagnosticMedia(true);
    cleanupRecordingSession({ keepRecordedBlob: false });
    stopSpeech();
    stopRecognition();
  });
  if (speechSupported()) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
      if (state.route === "settings") {
        renderSettings();
        return;
      }
      document.querySelectorAll("[data-voice-select]").forEach(function (select) {
        var language = select.dataset.voiceSelect;
        select.innerHTML = voiceOptionsMarkup(language);
        select.value = language === "vi" ? state.selectedVoiceVi : state.selectedVoiceKo;
      });
    };
  }
  migrateV1();
  render();
}());

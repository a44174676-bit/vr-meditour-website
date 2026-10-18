"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var assert = require("assert");
var projectRoot = __dirname;
var sourceFiles = [
  "pilgrim-data.js",
  "pilgrim-scenes.js",
  "pilgrim-chapters.js",
  "pilgrim-chapter-02-data.js",
  "pilgrim-chapter-02-scenes.js",
  "pilgrim-app.js"
];

function runApp(options) {
  var values = Object.assign({}, options.storage || {});
  var elements = {};
  var listeners = {};
  function element(id) {
    if (!elements[id]) {
      elements[id] = {
        id: id, innerHTML: "", textContent: "", style: {},
        classList: { add: function () {}, remove: function () {} },
        querySelector: function () { return null; },
        querySelectorAll: function () { return []; }
      };
    }
    return elements[id];
  }
  var context = {
    console: console, URLSearchParams: URLSearchParams, Date: Date, Map: Map, Blob: Blob, URL: URL,
    setTimeout: function () { return 1; }, clearTimeout: function () {},
    setInterval: function () { return 1; }, clearInterval: function () {},
    navigator: { userAgent: "chapter-02-v2-smoke-test" },
    localStorage: {
      getItem: function (key) { return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null; },
      setItem: function (key, value) { values[key] = String(value); },
      removeItem: function (key) { delete values[key]; }
    },
    document: {
      getElementById: element,
      querySelector: function () { return null; },
      querySelectorAll: function () { return []; },
      addEventListener: function (type, listener) {
        if (!listeners[type]) listeners[type] = [];
        listeners[type].push(listener);
      }
    }
  };
  context.window = context;
  context.window.location = { search: options.search || "" };
  context.window.innerWidth = 1440;
  context.window.isSecureContext = true;
  context.window.addEventListener = function () {};
  context.window.requestAnimationFrame = function () { return 1; };
  context.window.scrollTo = function () {};
  context.window.confirm = function () { return true; };
  vm.createContext(context);
  sourceFiles.forEach(function (file) {
    vm.runInContext(fs.readFileSync(path.join(projectRoot, file), "utf8"), context, { filename: file });
  });
  return {
    html: element("screen").innerHTML,
    storage: values,
    context: context,
    screen: element("screen"),
    click: function (dataset) {
      var target = { dataset: dataset, closest: function (selector) { return selector === "button" ? this : null; } };
      (listeners.click || []).forEach(function (listener) { listener({ target: target }); });
      this.html = this.screen.innerHTML;
    },
    togglePractice: function (key, open) {
      var details = {
        dataset: { practiceKey: key }, open: open,
        classList: { contains: function (name) { return name === "dialogue-line-practice"; } }
      };
      (listeners.toggle || []).forEach(function (listener) { listener({ target: details }); });
    }
  };
}

function assertPureJson(value) {
  function visit(item) {
    if (item === null || typeof item === "string" || typeof item === "number" || typeof item === "boolean") return;
    assert.notStrictEqual(typeof item, "function");
    assert.notStrictEqual(typeof item, "undefined");
    assert.ok(Array.isArray(item) || Object.prototype.toString.call(item) === "[object Object]");
    Object.keys(item).forEach(function (key) { visit(item[key]); });
  }
  visit(value);
  assert.doesNotThrow(function () { JSON.stringify(value); });
}

function openAndCloseConcept(app, type, id, title) {
  assert.match(app.html, new RegExp('data-note-id="' + id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"'));
  app.click({ noteType: type, noteId: id });
  assert.match(app.html, /class="learning-drawer/);
  assert.match(app.html, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  app.click({ action: "close-note" });
}

var fresh = runApp({});
assert.match(fresh.html, /제1장 완료 후 시작할 수 있습니다/);
assert.strictEqual(fresh.storage["pilgrimLanguage.chapter02ContentVersion"], "2");

var migrated = runApp({
  storage: {
    "pilgrimLanguage.currentScene.v2": "scene.city.does_not_know",
    "pilgrimLanguage.completedScenes.v2": JSON.stringify(["scene.city.introduction", "scene.city.must_leave"]),
    "pilgrimLanguage.chapterProgress.v3": JSON.stringify({
      "chapter.city_of_destruction": {
        currentSceneId: "scene.city.does_not_know",
        completedSceneIds: ["scene.city.introduction", "scene.city.must_leave"],
        completed: false
      },
      "chapter.slough_of_despond": {
        currentSceneId: "scene.slough.after_rescue",
        completedSceneIds: ["scene.slough.approach_the_mire", "scene.slough.fall_into_despond"],
        completed: true
      }
    }),
    "pilgrimLanguage.progress.v1": JSON.stringify({
      completedChapters: ["chapter.city_of_destruction", "chapter.slough_of_despond"],
      lastLocation: "result"
    }),
    "pilgrimLanguage.sceneResponses.v2": JSON.stringify({
      "scene.city.evangelist_appears": { meaningDelivery: "success" },
      "scene.slough.after_rescue": { meaningDelivery: "success" }
    }),
    "pilgrimLanguage.voiceAttempts.v2": JSON.stringify({ "scene.slough.after_rescue": 2 }),
    "pilgrimLanguage.grammarCompleted.v1": JSON.stringify(["grammar.must_do", "grammar.daga_interruption", "grammar.reason_aseo_eoseo"]),
    "pilgrimLanguage.relationship.character_help.trust.v1": "7",
    "pilgrimLanguage.experience.v1": "77",
    "pilgrimLanguage.savedWords.v1": JSON.stringify(["word.leave"]),
    "pilgrimLanguage.recordingAttempts.v1": JSON.stringify({ "line.city.evangelist_appears.01": 3 }),
    "pilgrimLanguage.voice.ko.v1": "ko-test-voice",
    "pilgrimLanguage.voice.vi.v1": "vi-test-voice"
  }
});
var migratedProgress = JSON.parse(migrated.storage["pilgrimLanguage.chapterProgress.v3"]);
var migratedOverall = JSON.parse(migrated.storage["pilgrimLanguage.progress.v1"]);
var migratedResponses = JSON.parse(migrated.storage["pilgrimLanguage.sceneResponses.v2"]);
assert.strictEqual(migratedProgress["chapter.city_of_destruction"].currentSceneId, "scene.city.does_not_know");
assert.deepStrictEqual(Array.from(migratedProgress["chapter.city_of_destruction"].completedSceneIds), ["scene.city.introduction", "scene.city.must_leave"]);
assert.deepStrictEqual(Array.from(migratedProgress["chapter.slough_of_despond"].completedSceneIds), []);
assert.strictEqual(migratedProgress["chapter.slough_of_despond"].currentSceneId, "scene.slough.pursued_by_obstinate_and_pliable");
assert.strictEqual(migratedProgress["chapter.slough_of_despond"].completed, false);
assert.ok(migratedOverall.completedChapters.indexOf("chapter.city_of_destruction") !== -1);
assert.ok(migratedOverall.completedChapters.indexOf("chapter.slough_of_despond") === -1);
assert.ok(migratedResponses["scene.city.evangelist_appears"]);
assert.ok(!migratedResponses["scene.slough.after_rescue"]);
assert.strictEqual(migrated.storage["pilgrimLanguage.experience.v1"], "77");
assert.strictEqual(migrated.storage["pilgrimLanguage.relationship.character_help.trust.v1"], "0");
assert.deepStrictEqual(JSON.parse(migrated.storage["pilgrimLanguage.grammarCompleted.v1"]), ["grammar.must_do"]);
assert.deepStrictEqual(JSON.parse(migrated.storage["pilgrimLanguage.savedWords.v1"]), ["word.leave"]);
assert.deepStrictEqual(JSON.parse(migrated.storage["pilgrimLanguage.recordingAttempts.v1"]), { "line.city.evangelist_appears.01": 3 });
assert.strictEqual(migrated.storage["pilgrimLanguage.voice.ko.v1"], "ko-test-voice");
assert.strictEqual(migrated.storage["pilgrimLanguage.voice.vi.v1"], "vi-test-voice");
var idempotentStorage = Object.assign({}, migrated.storage);
var idempotentProgress = JSON.parse(idempotentStorage["pilgrimLanguage.chapterProgress.v3"]);
idempotentProgress["chapter.slough_of_despond"] = {
  currentSceneId: "scene.slough.pliable_joins_the_journey",
  completedSceneIds: ["scene.slough.pursued_by_obstinate_and_pliable"],
  completed: false
};
idempotentStorage["pilgrimLanguage.chapterProgress.v3"] = JSON.stringify(idempotentProgress);
var idempotent = runApp({ storage: idempotentStorage });
var preservedV2Progress = JSON.parse(idempotent.storage["pilgrimLanguage.chapterProgress.v3"])["chapter.slough_of_despond"];
assert.strictEqual(preservedV2Progress.currentSceneId, "scene.slough.pliable_joins_the_journey");
assert.deepStrictEqual(Array.from(preservedV2Progress.completedSceneIds), ["scene.slough.pursued_by_obstinate_and_pliable"]);

var chapter1Dialogue = runApp({
  storage: {
    "pilgrimLanguage.chapter02ContentVersion": "2",
    "pilgrimLanguage.currentScene.v2": "scene.city.evangelist_appears",
    "pilgrimLanguage.completedScenes.v2": JSON.stringify(["scene.city.introduction", "scene.city.must_leave", "scene.city.does_not_know"])
  }
});
var chapter1PracticeKey = "chapter.city_of_destruction:scene.city.evangelist_appears:line.city.evangelist_appears.01";
chapter1Dialogue.click({ action: "resume-journey" });
chapter1Dialogue.togglePractice(chapter1PracticeKey, true);
chapter1Dialogue.click({ action: "show-help" });
assert.match(chapter1Dialogue.html, new RegExp('data-practice-key="' + chapter1PracticeKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '" open'));

var dev = runApp({ search: "?devChapter=2" });
var chapterData = dev.context.PILGRIM_CHAPTER_02_DATA;
var chapterScenes = dev.context.PILGRIM_CHAPTER_02_SCENES;
var expectedSceneIds = [
  "scene.slough.pursued_by_obstinate_and_pliable",
  "scene.slough.pliable_joins_the_journey",
  "scene.slough.fall_into_despond",
  "scene.slough.pliable_returns_home",
  "scene.slough.help_rescues_christian",
  "scene.slough.meaning_of_the_slough"
];
var removedSceneIds = [
  "scene.slough.approach_the_mire",
  "scene.slough.burden_and_fear",
  "scene.slough.ask_for_help",
  "scene.slough.after_rescue"
];
assert.strictEqual(chapterData.contentVersion, 2);
assert.deepStrictEqual(Array.from(chapterScenes.map(function (scene) { return scene.id; })), expectedSceneIds);
removedSceneIds.forEach(function (id) {
  assert.ok(!chapterScenes.some(function (scene) { return scene.id === id; }));
});
assert.deepStrictEqual(Array.from(chapterData.characters.map(function (item) { return item.id; })), [
  "character.christian", "character.obstinate", "character.pliable", "character.help", "character.narrator"
]);
assert.strictEqual(chapterData.vocabulary.length, 15);
assert.deepStrictEqual(Array.from(chapterData.grammar.map(function (item) { return item.id; })), ["grammar.daga_interruption", "grammar.reason_aseo_eoseo"]);
chapterScenes.forEach(function (scene) {
  assert.ok(scene.lines.length);
  scene.lines.forEach(function (item) {
    assert.ok(item.ko);
    assert.ok(item.vi);
  });
  scene.vocabularyIds.forEach(function (id) {
    assert.ok(chapterData.vocabulary.some(function (word) { return word.id === id && word.sceneId === scene.id; }));
  });
  assert.strictEqual(scene.visual.imageAvailable, true);
  assert.match(scene.visual.image, /assets\/scenes\/chapter-02-v2\//);
  assert.doesNotMatch(scene.visual.image, /assets\/scenes\/chapter-02\//);
});
chapterData.keyExpressions.forEach(function (expression) {
  assert.ok(chapterScenes.some(function (scene) {
    return scene.lines.some(function (item) { return item.ko === expression.ko && item.vi === expression.vi; });
  }));
});
assert.strictEqual(chapterData.keyExpressions.length, 6);
assertPureJson({ chapters: dev.context.PILGRIM_CHAPTERS, data: chapterData, scenes: chapterScenes });
assert.match(dev.html, /chapter-02-v2\/scene-02-01-pursuit\.png/);
assert.match(dev.html, /loading="eager" fetchpriority="high" width="1600" height="900"/);
assert.match(dev.html, /scene-image-fallback[^>]*hidden/);
assert.doesNotMatch(dev.html, /assets\/scenes\/chapter-02\//);

dev.click({ action: "start-journey", chapterId: "chapter.slough_of_despond" });
assert.match(dev.html, /뒤쫓아온 두 사람/);
assert.match(dev.html, /chapter-02-v2\/scene-02-01-pursuit\.png/);
assert.match(dev.html, /loading="lazy" width="1600" height="900"/);
openAndCloseConcept(dev, "vocabulary", "word.chase_after", "뒤쫓다");
openAndCloseConcept(dev, "vocabulary", "word.return", "돌아가다");
var practiceKey = "chapter.slough_of_despond:scene.slough.pursued_by_obstinate_and_pliable:" +
  "line.slough.pursuit.01,line.slough.pursuit.02,line.slough.pursuit.03,line.slough.pursuit.04";
dev.togglePractice(practiceKey, true);
dev.click({ action: "show-help" });
assert.match(dev.html, /data-practice-key="[^"]+" open/);
dev.click({ questAnswer: "answer.slough.refuse.complete" });
dev.click({ action: "next-scene" });
assert.match(dev.html, /유순한 사람이 함께 가다/);
openAndCloseConcept(dev, "vocabulary", "word.go_together", "함께 가다");
openAndCloseConcept(dev, "vocabulary", "word.inheritance", "유업");
openAndCloseConcept(dev, "grammar", "grammar.reason_aseo_eoseo", "-아/어서");
dev.click({ questAnswer: "answer.slough.burden.complete" });
dev.click({ action: "next-scene" });
assert.match(dev.html, /절망의 수렁에 빠지다/);
openAndCloseConcept(dev, "grammar", "grammar.daga_interruption", "-다가");
openAndCloseConcept(dev, "grammar", "grammar.reason_aseo_eoseo", "-아/어서");
dev.click({ action: "next-scene" });
assert.match(dev.html, /유순한 사람이 돌아가다/);
openAndCloseConcept(dev, "vocabulary", "word.disappointed", "실망하다");
openAndCloseConcept(dev, "vocabulary", "word.struggle", "몸부림치다");
dev.click({ questAnswer: "answer.slough.continue_difficulty.complete" });
dev.click({ action: "next-scene" });
assert.match(dev.html, /도움이 크리스천을 구조하다/);
openAndCloseConcept(dev, "vocabulary", "word.foothold", "발판");
openAndCloseConcept(dev, "vocabulary", "word.reach_out_hand", "손을 내밀다");
openAndCloseConcept(dev, "grammar", "grammar.reason_aseo_eoseo", "-아/어서");
dev.click({ questAnswer: "answer.slough.fear.complete" });
dev.click({ action: "next-scene" });
assert.match(dev.html, /수렁과 발판의 의미/);
openAndCloseConcept(dev, "vocabulary", "word.doubt", "의심");
openAndCloseConcept(dev, "vocabulary", "word.discouragement", "낙심");
dev.click({ questAnswer: "answer.slough.reflect.complete" });
dev.click({ action: "complete-chapter" });
assert.match(dev.html, /절망의 수렁 바깥 단단한 땅/);
assert.match(dev.html, /세속현자의 유혹/);
assert.match(dev.html, /The Worldly Wiseman’s Temptation/);
assert.match(dev.html, /Sự cám dỗ của Nhà Thông Thái Thế Gian/);
var completedProgress = JSON.parse(dev.storage["pilgrimLanguage.chapterProgress.v3"]);
assert.strictEqual(completedProgress["chapter.slough_of_despond"].completed, true);

var lockedWithDevProgress = runApp({
  storage: {
    "pilgrimLanguage.chapter02ContentVersion": "2",
    "pilgrimLanguage.chapterProgress.v3": JSON.stringify({
      "chapter.city_of_destruction": { currentSceneId: "scene.city.introduction", completedSceneIds: [], completed: false },
      "chapter.slough_of_despond": { currentSceneId: expectedSceneIds[1], completedSceneIds: [expectedSceneIds[0]], completed: false }
    })
  }
});
assert.match(lockedWithDevProgress.html, /🔒 잠김/);
assert.doesNotMatch(lockedWithDevProgress.html, /🔒 진행 중/);

console.log("Chapter 02 content v2 smoke test passed");

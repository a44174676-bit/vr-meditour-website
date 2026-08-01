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

function runApp(initialVoices, storage) {
  var voices = initialVoices.slice();
  var spoken = [];
  var cancelCount = 0;
  var resumeCount = 0;
  var speechListeners = {};
  var documentListeners = {};
  var scheduledDelays = [];
  var values = Object.assign({}, storage || {});
  var elements = {};

  function element(id) {
    if (!elements[id]) {
      elements[id] = {
        innerHTML: "", textContent: "", style: {},
        classList: { add: function () {}, remove: function () {} },
        querySelector: function () { return null; },
        querySelectorAll: function () { return []; }
      };
    }
    return elements[id];
  }
  function Utterance(text) {
    this.text = text;
    this.lang = "";
    this.voice = undefined;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
  }
  var speechSynthesis = {
    paused: true,
    getVoices: function () { return voices.slice(); },
    addEventListener: function (type, listener) { speechListeners[type] = listener; },
    speak: function (utterance) {
      spoken.push(utterance);
      if (utterance.onstart) utterance.onstart();
      if (utterance.onend) utterance.onend();
    },
    cancel: function () { cancelCount += 1; },
    resume: function () { resumeCount += 1; this.paused = false; }
  };
  var context = {
    console: console, URLSearchParams: URLSearchParams, Date: Date, Map: Map, Blob: Blob, URL: URL,
    SpeechSynthesisUtterance: Utterance,
    speechSynthesis: speechSynthesis,
    setTimeout: function (callback, delay) { scheduledDelays.push(delay); return scheduledDelays.length; },
    clearTimeout: function () {},
    setInterval: function () { return 1; },
    clearInterval: function () {},
    navigator: { userAgent: "mobile-tts-smoke-test" },
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
        if (!documentListeners[type]) documentListeners[type] = [];
        documentListeners[type].push(listener);
      }
    }
  };
  context.window = context;
  context.window.location = { search: "" };
  context.window.innerWidth = 390;
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
    spoken: spoken,
    get cancelCount() { return cancelCount; },
    get resumeCount() { return resumeCount; },
    scheduledDelays: scheduledDelays,
    screen: element("screen"),
    click: function (dataset) {
      var target = { dataset: dataset, closest: function (selector) { return selector === "button" ? this : null; } };
      (documentListeners.click || []).forEach(function (listener) { listener({ target: target }); });
    },
    setVoices: function (nextVoices) {
      voices = nextVoices.slice();
      speechListeners.voiceschanged();
    }
  };
}

var emptyVoiceApp = runApp([]);
assert.ok(emptyVoiceApp.scheduledDelays.indexOf(150) !== -1);
assert.ok(emptyVoiceApp.scheduledDelays.indexOf(500) !== -1);
assert.ok(emptyVoiceApp.scheduledDelays.indexOf(1500) !== -1);

emptyVoiceApp.click({ freeAudio: "안녕하세요", lang: "ko" });
assert.strictEqual(emptyVoiceApp.spoken.length, 1);
assert.strictEqual(emptyVoiceApp.spoken[0].lang, "ko-KR");
assert.strictEqual(emptyVoiceApp.spoken[0].voice, undefined);
assert.strictEqual(emptyVoiceApp.spoken[0].pitch, 1);
assert.strictEqual(emptyVoiceApp.spoken[0].volume, 1);
assert.ok(emptyVoiceApp.resumeCount >= 1);

emptyVoiceApp.click({ freeAudio: "Xin chào", lang: "vi" });
assert.strictEqual(emptyVoiceApp.spoken.length, 2);
assert.strictEqual(emptyVoiceApp.spoken[1].lang, "vi-VN");
assert.strictEqual(emptyVoiceApp.spoken[1].voice, undefined);

emptyVoiceApp.click({ route: "settings" });
assert.match(emptyVoiceApp.screen.innerHTML, /전체 음성/);
assert.match(emptyVoiceApp.screen.innerHTML, /운영체제 기본 음성으로 재생 시도/);
emptyVoiceApp.setVoices([{ name: "Late Korean", lang: "ko-KR" }, { name: "Late Vietnamese", lang: "vi-VN" }]);
assert.match(emptyVoiceApp.screen.innerHTML, /Late Korean/);
assert.match(emptyVoiceApp.screen.innerHTML, /Late Vietnamese/);

var voicedApp = runApp([
  { name: "Korean Voice", lang: "ko-KR" },
  { name: "Vietnamese Voice", lang: "vi-VN" }
]);
voicedApp.click({ freeAudio: "한국어", lang: "ko" });
voicedApp.click({ freeAudio: "Tiếng Việt", lang: "vi" });
assert.strictEqual(voicedApp.spoken[0].voice.name, "Korean Voice");
assert.strictEqual(voicedApp.spoken[1].voice.name, "Vietnamese Voice");

var selectedMissingApp = runApp(
  [{ name: "Other Korean", lang: "ko-KR" }],
  { "pilgrimLanguage.voice.ko.v1": "Removed Korean Voice" }
);
selectedMissingApp.click({ freeAudio: "기본 음성", lang: "ko" });
assert.strictEqual(selectedMissingApp.spoken[0].voice, undefined);

var cancelsBeforeStop = emptyVoiceApp.cancelCount;
emptyVoiceApp.click({ action: "stop-speech" });
assert.ok(emptyVoiceApp.cancelCount > cancelsBeforeStop);

console.log("Mobile TTS fallback smoke test passed");

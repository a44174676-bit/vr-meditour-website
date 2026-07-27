# 순례자의 길 — 장면 기반 한·베 언어학습 시제품

## 목적

존 버니언의 《천로역정》 첫 장면을 자체 각색해, 사용자가 교재 탭을 공부하는 대신 여섯 장면을 통과하며 한국어를 듣고 읽고 사용하는 모바일 우선 웹앱입니다. 현재 구현 범위는 제1장 「멸망의 도시를 떠나다」입니다.

## 실행

별도 설치와 빌드 과정이 없습니다. 저장소 루트를 정적 서버 또는 VS Code Live Server로 실행한 뒤 다음 주소에 접속합니다.

```text
http://127.0.0.1:5500/pilgrim-language/
```

## 파일 구조

```text
pilgrim-language/
├── index.html
├── pilgrim.css
├── pilgrim-app.js
├── pilgrim-data.js
├── pilgrim-scenes.js
├── README.md
└── assets/
    ├── brand/
    ├── scenes/
    │   ├── chapter-01-hero.png
    │   ├── scene-02-searching-road.png
    │   └── scene-05-evangelist-dialogue.png
    ├── brand/
    ├── icons/
    └── legacy/
        ├── scenes/
        └── characters/
```

기존 기능 확인용 장면·인물 SVG는 삭제하지 않고 `assets/legacy/` 아래에 보존되어 있으며 현재 화면에는 렌더링하지 않습니다.

## 제1장 장면

1. `scene.city.introduction` — 멸망의 도시에서 크리스천을 만남
2. `scene.city.must_leave` — 떠나야 한다는 사실을 알게 됨
3. `scene.city.does_not_know` — 어디로 가야 할지 모르는 상황
4. `scene.city.evangelist_appears` — 전도자 등장과 직접 말하기
5. `scene.city.asking_direction` — “제가 무엇을 해야 합니까?”라고 질문
6. `scene.city.first_departure` — 좁은 문을 향해 첫 여정을 시작

장면마다 한국어 문장 1~2개, 요청 시 펼치는 베트남어 번역, 문장별 음성, 필요한 어휘·문법 노트와 한 가지 상호작용만 제공합니다.

## 구현 기능

- 몰입 읽기와 문장 ID 기반 한·베 비교 모드
- 한국어·베트남어 문장별 및 제1장 전체 음성
- 두 언어의 일반·느린 속도와 항상 접근 가능한 음성 정지
- 언어별 브라우저 음성 선택과 미설치 안내
- 본문의 어휘·문법에서 열리는 인라인 여행 노트
- 어휘 저장과 저장한 단어만 표시하는 복습
- 장면 맥락을 사용한 문법 문제
- Web Speech Recognition 기반 한국어 직접 말하기
- MediaRecorder 기반 문장별 자기 음성 녹음·다시 듣기·모범 음성 순차 비교
- 음성인식 미지원·두 번 실패·표현 도움 요청 시 기존 선택지 제공
- 의미·키워드·목표 의도·문법 사용만 확인하는 MVP 평가
- `pronunciationScore: null` 유지 — 임의 발음 점수 없음
- NPC 반응 우선, 언어학습 결과와 경험치는 보조 표시
- 경험치, 전도자 신뢰도, 장면 진행과 마지막 위치 저장
- 제1장 완료 후 오늘의 순례 기록
- 전체 학습 데이터 초기화

## 콘텐츠와 장면 데이터

`pilgrim-data.js`는 어휘, 문법, 퀘스트 규칙, 피드백과 기존 고유 ID를 유지합니다. `pilgrim-scenes.js`는 환경과 NPC 배치까지 포함하는 순수 장면 데이터이며 함수, DOM 요소, HTML 문자열, 이벤트 리스너와 브라우저 객체를 포함하지 않습니다.

다음처럼 JSON으로 변환할 수 있습니다.

```js
const contentJson = JSON.stringify(window.PILGRIM_DATA, null, 2);
const scenesJson = JSON.stringify(window.PILGRIM_SCENES, null, 2);
```

### 장면 데이터 구조

- `id`, `chapterId`, `order`, `type`: 영구 식별자와 순서
- `environment.backgroundId`: Unity 3D 환경 선택 키
- `environment.atmosphere`, `time`: 조명·환경 연출 힌트
- `visual.image`, `mobileImage`: 웹 장면 이미지와 선택적 모바일 대체 이미지
- `visual.desktopPosition`, `mobilePosition`: 화면 크기별 안전 크롭 기준
- `visual.panelPlacement`, `overlayTone`, `colorTheme`: 학습 패널 위치와 가독성·색상 힌트
- `visual.imageAltKo`, `imageAltVi`: 화면 접근성 및 현지화용 대체 텍스트
- `characters[].characterId`, `position`: NPC/인물 배치
- `lines[]`: 화자, 한국어·베트남어 문장, 언어·속도별 음원 경로
- `vocabularyIds`, `grammarIds`: 기존 학습 데이터 참조
- `interaction`: 계속, 문법 확인, 음성 응답, 반복, 장 완료 규칙
- `nextSceneId`: 다음 장면 연결

## Unity/Meta Quest 재사용

Unity에서는 `backgroundId`를 3D 환경 프리팹에, `characterId`를 NPC 프리팹/아바타에 매핑할 수 있습니다. `position`은 웹의 CSS 좌표가 아니라 `left`, `center`, `right` 같은 논리적 배치 힌트이므로 Unity 어댑터가 실제 Transform으로 변환합니다.

재사용 대상:

- 환경과 분위기 ID
- NPC 배치와 화자 ID
- 한·베 대사와 음원
- 어휘·문법 참조
- 사용자 음성 응답 의도·키워드
- 퀘스트 결과, 관계 지표와 다음 장면

웹 전용 필드/처리:

- `environment.asset`의 16:9 장면 이미지 경로
- DOM 렌더링, CSS, Web Speech API
- 브라우저 localStorage 어댑터

3D 확장에서는 `environment.asset` 대신 `backgroundId`를 Unity Addressable/Prefab ID와 연결합니다.

`visual`도 함수나 CSS 객체가 아닌 JSON 변환 가능한 값으로만 구성됩니다. Unity에서는 이미지 경로를 그대로 쓰거나, `colorTheme`과 `panelPlacement`를 UI Toolkit/Canvas 프리셋 ID로 매핑할 수 있습니다.

## 장면 이미지 전달과 최적화

- 시작 화면의 `chapter-01-hero.png`만 `loading="eager"`와 높은 fetch priority를 사용합니다.
- 플레이어와 기록 화면의 장면 이미지는 `loading="lazy"`로 불러옵니다.
- 모든 이미지는 고정 크기 속성과 `object-fit: cover`를 사용해 레이아웃 이동과 비율 왜곡을 줄입니다.
- 현재 개발 환경에는 AVIF/WebP 변환 도구가 없어 원본 PNG를 fallback으로 사용합니다.
- 배포 전 TODO: 승인된 로컬 이미지 변환 도구로 같은 파일명의 `.avif`와 `.webp` 파생본을 만들고, `<picture>`에 AVIF → WebP → PNG 순서로 연결합니다. 원본 PNG는 삭제하지 않습니다.

## 음성 파일 연결

각 장면 문장에는 다음 필드가 있습니다.

- `audioKoNormal`
- `audioKoSlow`
- `audioViNormal`
- `audioViSlow`

경로가 존재하면 녹음 음원을 먼저 재생하고, 없거나 재생에 실패하면 `ko-KR` 또는 `vi-VN` 브라우저 음성을 사용합니다. 직접 녹음 음원은 공개 전 원어민과 콘텐츠 담당자의 검수를 거쳐야 합니다.

## 자기 음성 녹음

문장별 “내 목소리 녹음”은 SpeechRecognition과 별개의 MediaRecorder 기능입니다. AI 발음 채점이나 NPC 결과 판정에는 사용하지 않으며, 모범 음성 → 내 목소리를 차례로 들으며 억양·속도·끊어 읽기를 스스로 비교하는 용도입니다.

- 마이크 입력에는 echo cancellation, noise suppression, automatic gain control을 요청합니다.
- 녹음은 최대 20초이며 문장별 최근 녹음 한 개만 유지합니다.
- WebM Opus, WebM, MP4, Ogg Opus 순서로 브라우저 지원 형식을 확인하고, 지원 형식이 확인되지 않으면 MediaRecorder 기본 형식을 사용합니다.
- 오디오 Blob과 Blob URL은 현재 페이지의 메모리에만 존재합니다. 서버 전송, 자동 다운로드, localStorage 저장은 하지 않습니다.
- 페이지를 새로고침하거나 닫으면 녹음은 삭제될 수 있습니다.
- localStorage에는 `pilgrimLanguage.recordingAttempts.v1`의 문장별 시도 횟수와 `pilgrimLanguage.recordingNoticeAccepted.v1`의 최초 안내 확인 여부만 저장합니다.
- 장면·메뉴 이동, 재녹음, 오류, 데이터 초기화 및 페이지 종료 시 타이머, 재생, MediaRecorder와 마이크 track을 정리합니다.

### 음성 환경 진단

설정 화면의 진단 패널은 보안 컨텍스트, 미디어·녹음·음성 API, 선택 가능한 녹음 형식, 언어별 TTS 음성 수, 활성 마이크 track과 마지막 시험 녹음 오류를 확인합니다. 마이크 권한 확인, 3초 임시 녹음, 녹음 재생, 한·베 TTS 시험과 전체 정지를 제공합니다.

진단용 stream, MediaRecorder, Blob과 오류 정보는 학습용 문장 녹음 상태와 분리되어 있으며 서버나 localStorage로 전송·저장하지 않습니다. 설정 화면을 벗어나거나 페이지를 닫으면 진단용 마이크와 재생을 정리합니다.

## localStorage

기존 v1 키:

- `pilgrimLanguage.progress.v1`
- `pilgrimLanguage.savedWords.v1`
- `pilgrimLanguage.selectedAnswer.v1`
- `pilgrimLanguage.experience.v1`
- `pilgrimLanguage.trust.evangelist.v1`
- `pilgrimLanguage.voice.ko.v1`
- `pilgrimLanguage.voice.vi.v1`

장면 기반 v2 키:

- `pilgrimLanguage.currentScene.v2`
- `pilgrimLanguage.completedScenes.v2`
- `pilgrimLanguage.sceneResponses.v2`
- `pilgrimLanguage.voiceAttempts.v2`
- `pilgrimLanguage.viewMode.v2`

첫 실행 시 기존 완료 장과 마지막 위치를 근거로 v2 진행 상태를 생성합니다. v1 키는 삭제하거나 덮어쓰지 않습니다.

## 향후 서버 API로 분리할 데이터

- 계정별 장면 진행과 기기 간 동기화
- 음성 시도와 구조화된 장면 응답
- 경험치·관계 지표 변경 이력
- 콘텐츠 버전과 번역 검수 상태
- 녹음 음원 URL과 배포 버전
- 관리자용 장면 편집·공개 상태

## 제외 범위

챕터 2 이상, 회원가입, 서버 DB, 결제, 실제 AI 자유대화, 발음 점수, 감정 분석, WebXR/3D, Meta Quest APK와 CMS는 구현하지 않았습니다.

## 저작권

존 버니언의 원작을 바탕으로 새로 각색한 시제품입니다. 현대 한국어·베트남어 번역본, 기존 출판물 삽화와 음원을 복사하지 않았습니다. 공개 전 별도 콘텐츠·번역·저작권 검수가 필요합니다.

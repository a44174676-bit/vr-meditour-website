# 순례자의 길 — 장면 기반 한·베 언어학습 시제품

## 목적

존 버니언의 《천로역정》을 자체 각색해, 사용자가 교재 탭을 공부하는 대신 장면을 통과하며 한국어를 듣고 읽고 사용하는 모바일 우선 웹앱입니다. 현재 Chapter 01 「멸망의 도시를 떠나다」와 Chapter 02 「절망의 수렁」의 1차 학습 흐름을 구현합니다.

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
├── pilgrim-chapters.js
├── pilgrim-chapter-02-data.js
├── pilgrim-chapter-02-scenes.js
├── qa-chapter-02-smoke.js
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

Chapter 03 이상, 회원가입, 서버 DB, 결제, 실제 AI 자유대화, 발음 점수, 감정 분석, WebXR/3D, Meta Quest APK와 CMS는 구현하지 않았습니다.

## Chapter 02 — 절망의 수렁

Chapter 02 `chapter.slough_of_despond`의 콘텐츠 버전은 2입니다. John Bunyan 원전의 사건 순서에 따라 고집쟁이와 유순한 사람의 추격, 크리스천의 귀환 거절, 유순한 사람의 동행과 이탈, 절망의 수렁, 도움의 질문과 구조, 단단한 발판의 의미를 B1 수준 한·베 학습용 문장으로 새로 각색했습니다.

장면 ID:

1. `scene.slough.pursued_by_obstinate_and_pliable`
2. `scene.slough.pliable_joins_the_journey`
3. `scene.slough.fall_into_despond`
4. `scene.slough.pliable_returns_home`
5. `scene.slough.help_rescues_christian`
6. `scene.slough.meaning_of_the_slough`

등장인물은 `character.christian`, `character.obstinate`, `character.pliable`, `character.help`, `character.narrator`입니다. 베트남어 이름은 각각 Christian, Cứng Đầu, Dễ Thay Đổi, Người Trợ Giúp, Người kể chuyện으로 통일합니다.

공식 핵심 표현:

1. 저는 멸망의 도시로 돌아갈 수 없습니다.
2. 저도 함께 가겠습니다.
3. 등에 진 짐 때문에 빨리 갈 수 없습니다.
4. 이것이 당신이 말한 행복입니까?
5. 너무 두려워서 앞을 제대로 살피지 못했습니다.
6. 다음에는 단단한 발판을 잘 살피겠습니다.

어휘 ID:

- `word.chase_after`, `word.return`, `word.go_together`, `word.inheritance`
- `word.burden`, `word.slough`, `word.fall_into`, `word.sink`
- `word.disappointed`, `word.struggle`, `word.foothold`, `word.solid`
- `word.reach_out_hand`, `word.doubt`, `word.discouragement`

문법 ID:

- `grammar.daga_interruption`
- `grammar.reason_aseo_eoseo`

Chapter 01 완료 데이터에 `chapter.city_of_destruction`이 기록되면 Chapter 02가 자동으로 해금됩니다. 잠금 상태에서는 시작 버튼을 사용할 수 없으며 잠금 이유를 한국어와 베트남어로 표시합니다.

### 챕터 레지스트리와 진행 저장

`pilgrim-chapters.js`는 챕터 ID, 순서, 한·베·영 제목, 소개, 학습 시간, 핵심 표현·문법·대화 수, 장면 ID, 해금 조건과 시작·완료 이미지 경로를 보관합니다. `pilgrim-chapter-02-data.js`와 `pilgrim-chapter-02-scenes.js`도 JSON 직렬화 가능한 콘텐츠만 결과 데이터에 포함합니다.

챕터별 진행 키:

```text
pilgrimLanguage.chapterProgress.v3
pilgrimLanguage.activeChapter.v3
```

`chapterProgress.v3`는 챕터별 `currentSceneId`, `completedSceneIds`, `completed`를 저장합니다. 최초 실행 시 기존 v1/v2 Chapter 01 현재 장면, 완료 장면과 완료 여부를 v3에 복사합니다. 기존 v1/v2 키는 삭제하거나 덮어쓰지 않으며 Chapter 01을 플레이할 때 계속 동기화합니다. 마이그레이션 파싱에 실패해도 기존 키를 삭제하지 않습니다.

Chapter 02 문법 완료는 `pilgrimLanguage.grammarCompleted.v1`, 도움과의 관계 지표는 `pilgrimLanguage.relationship.character_help.trust.v1`에 별도로 저장합니다.

### 콘텐츠 버전 2 마이그레이션

`pilgrimLanguage.chapter02ContentVersion`이 `2`가 아니면 한 번만 Chapter 02 v1 진행을 초기화합니다. Chapter 02의 현재 장면, 완료 장면, 완료 기록, 장면 응답, 음성 응답 시도, 두 문법 완료와 Help 임시 신뢰도를 새로 시작합니다. 기존 global XP는 안전한 Chapter 02 원장이 없으므로 차감하지 않습니다.

Chapter 01의 현재 장면, 완료 여부, 저장 단어, 녹음 시도, 음성 설정과 v1/v2 키는 보존합니다. 완료 표시와 장면별 완료 목록을 새로 시작하므로 Chapter 02 v2 XP가 중복 지급되지 않습니다.

### 개발용 Chapter 02 진입

Chapter 01 완료 데이터를 변경하지 않고 Chapter 02를 직접 확인하려면 다음 URL을 사용합니다.

```text
http://127.0.0.1:5500/pilgrim-language/?devChapter=2
```

이 파라미터는 현재 브라우저 세션의 진입만 허용하며 Chapter 01 완료, 경험치 또는 해금 데이터를 위조하지 않습니다.

### Chapter 02 장면 이미지

기존 `assets/scenes/chapter-02/` 이미지는 삭제하지 않지만 콘텐츠 v2에서 사용하지 않습니다. 원작 장면 이미지 6장은 `assets/scenes/chapter-02-v2/`에 설치되어 있습니다.

| 화면 | 이미지 |
| --- | --- |
| Chapter 02 시작·장면 1 | `assets/scenes/chapter-02-v2/scene-02-01-pursuit.png` |
| 장면 2 | `assets/scenes/chapter-02-v2/scene-02-02-pliable-joins.png` |
| 장면 3 | `assets/scenes/chapter-02-v2/scene-02-03-fall.png` |
| 장면 4 | `assets/scenes/chapter-02-v2/scene-02-04-pliable-returns.png` |
| 장면 5 | `assets/scenes/chapter-02-v2/scene-02-05-help-rescues.png` |
| 장면 6·순례 기록 | `assets/scenes/chapter-02-v2/scene-02-06-meaning-of-slough.png` |

설치된 이미지가 정상적으로 로드되면 fallback을 표시하지 않습니다. 파일 누락이나 로드 실패 시에는 깨진 이미지 대신 장면별 접근 가능한 fallback을 표시하며 학습은 계속 진행됩니다. Chapter 01 및 기존 Chapter 02 이미지는 재사용하지 않습니다.

### 다음 장소

Chapter 02 이후에는 곧바로 빛나는 문으로 가지 않습니다. 원작 순서에 따라 다음 장소는 `세속현자의 유혹 · The Worldly Wiseman’s Temptation · Sự cám dỗ của Nhà Thông Thái Thế Gian`으로 기록하며, Chapter 03은 구현하지 않고 미리 보기만 제공합니다.

### QA

로컬 정적 서버에서 다음을 확인합니다.

Chapter 02 v2 데이터, v1 진행 초기화, Chapter 01 보존, 6개 장면 진행 및 완료 기록은 저장소 루트에서 다음 명령으로 스모크 테스트할 수 있습니다.

```bash
node pilgrim-language/qa-chapter-02-smoke.js
```

1. Chapter 01 미완료/완료에 따른 Chapter 02 잠금·해금
2. `?devChapter=2` 직접 진입
3. 새 원작 사건 기준 6개 장면, 번역, 한·베 TTS와 느린 듣기
4. 어휘·문법 노트와 두 문법 문제
5. 직접 말하기, 표현 도움, 선택형 대체 응답
6. 문장별 임시 녹음과 순차 비교
7. Chapter 02 완료 기록과 세속현자의 유혹 미리 보기
8. Chapter 01 이미지·진행·저장 회귀
9. 390×844 가로 스크롤·하단 내비게이션
10. 1440×900 CTA 잘림, 콘솔 오류와 실패 요청

Netlify 배포 전에는 Chapter 02 v2 이미지의 실제 크롭과 모든 이미지의 200 응답, fallback 전환, HTTPS 마이크 권한, 한·베 음성, 콘텐츠 버전 마이그레이션과 Chapter 01 회귀를 다시 확인합니다.

아직 구현하지 않은 항목은 Chapter 02 녹음 음원, Chapter 03, 서버 저장, 계정 동기화, AI 발음 점수와 Meta Quest 앱입니다.

## 저작권

존 버니언의 원작을 바탕으로 새로 각색한 시제품입니다. 현대 한국어·베트남어 번역본, 기존 출판물 삽화와 음원을 복사하지 않았습니다. 공개 전 별도 콘텐츠·번역·저작권 검수가 필요합니다.

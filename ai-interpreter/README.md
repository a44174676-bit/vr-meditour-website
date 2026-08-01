# VR MEDI TALK MVP

한국어를 기준으로 영어·베트남어·일본어·중국어를 연결하는 정확도 우선 PTT 음성 통역 서비스입니다.

## Environment

Netlify의 Functions 범위 환경변수에 `VR_MEDI_TALK_OPENAI_API_KEY`를 설정합니다. 키를 저장소, HTML, 브라우저 JavaScript 또는 `netlify.toml`에 넣지 않습니다.

## Data handling

- 버튼을 놓으면 브라우저가 완성된 짧은 녹음을 전사 Function으로 일시 전송합니다.
- 전사, 엄격 번역·재검증, 음성합성은 각각 분리된 Netlify Function이 처리하며 파일이나 대화내용을 저장하지 않습니다.
- 음성합성은 검증된 번역에 대해 서버가 발급한 단기 서명 토큰이 있을 때만 허용됩니다.
- 확정 원문과 검증된 번역 자막, 직전 번역 음성은 현재 탭 메모리에만 보관합니다.
- 대화 종료 또는 페이지 이탈 시 마이크, 진행 중 요청, 자막과 음성 Blob을 삭제합니다.

## Scope

`language-config.json`이 언어 코드, 캐릭터 이미지, 전사 언어와 TTS 로케일의 단일 원본입니다. 한국어↔영어, 한국어↔베트남어, 한국어↔일본어, 한국어↔중국어만 허용하며 외국어↔외국어는 서버에서 거부합니다. `ui-translations.js`는 API 호출 없이 5개 화면 언어를 제공합니다. `direct-realtime`과 `text-only`는 사용하지 않습니다.

# VR MEDI TALK MVP

한국어(`ko-KR`)와 베트남어(`vi-VN`) 간 전용 실시간 음성 통역 MVP입니다.

## Environment

Netlify의 Functions 범위 환경변수에 `VR_MEDI_TALK_OPENAI_API_KEY`를 설정합니다. 키를 저장소, HTML, 브라우저 JavaScript 또는 `netlify.toml`에 넣지 않습니다.

## Data handling

- 브라우저가 마이크 음성을 OpenAI Realtime Translation API로 직접 전송합니다.
- Netlify Function은 단기 client secret 발급만 담당하며 음성이나 자막을 받지 않습니다.
- 자막과 직전 번역 녹음은 현재 탭 메모리에만 보관합니다.
- 대화 종료 또는 페이지 이탈 시 마이크, WebRTC 연결, 자막과 녹음 Blob을 삭제합니다.

## Scope

`language-config.json`이 언어 코드와 메타데이터의 단일 원본이며 `language-config.js`가 공개 언어와 번역 방향을 구성합니다. 현재 `enabled` 및 `medicallyVerified`가 모두 참이고 `direct-realtime`인 한국어와 베트남어만 UI에 표시합니다. `staged-pipeline`과 `text-only`는 향후 설정 값으로만 계획되어 있으며 이 MVP에는 구현하지 않습니다.

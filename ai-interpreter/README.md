# VR MEDI TALK MVP

한국어(`ko-KR`)와 베트남어(`vi-VN`) 간 정확도 우선 PTT 음성 통역 MVP입니다.

## Environment

Netlify의 Functions 범위 환경변수에 `VR_MEDI_TALK_OPENAI_API_KEY`를 설정합니다. 키를 저장소, HTML, 브라우저 JavaScript 또는 `netlify.toml`에 넣지 않습니다.

## Data handling

- 버튼을 놓으면 브라우저가 완성된 짧은 녹음을 전사 Function으로 일시 전송합니다.
- 전사, 엄격 번역·재검증, 음성합성은 각각 분리된 Netlify Function이 처리하며 파일이나 대화내용을 저장하지 않습니다.
- 확정 원문과 검증된 번역 자막, 직전 번역 음성은 현재 탭 메모리에만 보관합니다.
- 대화 종료 또는 페이지 이탈 시 마이크, 진행 중 요청, 자막과 음성 Blob을 삭제합니다.

## Scope

`language-config.json`이 언어 코드와 메타데이터의 단일 원본이며 `language-config.js`가 공개 언어와 번역 방향을 구성합니다. 현재 `enabled` 및 `medicallyVerified`가 모두 참이고 `staged-pipeline`인 한국어와 베트남어만 UI에 표시합니다. `direct-realtime`과 `text-only`는 현재 MVP에서 사용하지 않습니다.

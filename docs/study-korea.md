# VR STUDENT KOREA — 구현 및 인수인계

> 후속 변경: 공개 빌드를 `dist/` 허용목록 방식으로 전환하고 관리자 모의 UI/데이터 모델을 추가했습니다. 이 문서의 최초 상태와 달라진 내용 및 PRD 원문 미수신 한계는 [PRD v1 후속 검토](study-korea-prd-v1-gap.md)를 우선 참조하세요.

## 기준과 기존 구조

- 작업 브랜치: `feat/vr-student-korea`. 병합·배포·외부 접수 서비스 연결·DB 변경 없음.
- 별도 첨부 PRD 파일은 작업 공간/대화 첨부에서 확인되지 않음. 사용자 메시지의 필수 요구사항을 P0 기준으로 구현. 원본 PRD의 추가 P0/P1/P2 구분은 추후 대조 필요.
- 기존 구조: 루트 정적 HTML/CSS + Netlify Functions, `netlify.toml`의 publish는 `.`. 루트 앱에 빌드 패키지나 번들러 없음. 별도 settlement-ai-system의 Vite 앱은 이번 대상 아님.
- 기존 언어 선택: `public/site-language-data.js`, `?lang=`, `localStorage.vrMediTourLang`. 신규 페이지도 같은 URL/저장키를 사용하며 ko/vi만 지원; 다른 언어는 한국어로 기본 표시.
- 기본 네이비 색상/시스템 폰트 기반에 신규 페이지 전용 골드 스타일 적용. 공통 스타일 덮어쓰기 없음.
- 기존 의료 상담은 외부 n8n 웹훅 전달, 옴니볼은 환경변수 기반 수신기 어댑터. 유학생용 영구 저장·관리자 인증 기능은 확인되지 않아 기존 의료 데이터 흐름과 연결하지 않음.

## 경로와 구현 범위

- `/study-korea/` (정적 디렉터리 라우팅). `/study-korea`도 디렉터리 URL로 연결.
- `/study-korea/?lang=ko`, `/study-korea/?lang=vi`.
- 홈페이지 주 메뉴에 한국 유학 / Du học Hàn Quốc 추가; 기존 번역 체계 사용.
- 히어로/상담 CTA, 서비스 소개, 대학·학과 및 입학 준비, 출입국 안내, 부산 생활적응, 상담 4단계, 학생·보호자 상담, 별도 기관 협력 문의, FAQ, 개인정보 안내/필수 동의.
- 미확정 제휴·로고·학비·장학금 수치 없음. 입학/비자 결과 보장 없음.
- 반응형, 키보드 포커스, skip link, 의미 있는 label, required, 입력 오류 포커스/aria-invalid, 상태 알림, reduced-motion, 언어별 문서 제목/description, canonical/hreflang/OG.
- 문의 유형은 `student`/`partner`, 관심 분야는 안정적인 열거값, 정책 버전과 접수 ID를 전달. P1/P2 관리 UI·공식 대학 정보·후속 상담 상태 등을 별도 모듈로 확장 가능. 원본 PRD 없이 P1/P2 범위를 임의 확정하지 않음.

## 현재 접수 상태 (중요)

**실제 접수·영구 저장·관리자 조회는 활성화하지 않았다.** 현재는 양식 내용 확인과 화면 탐색만 가능하며 제출 버튼은 비활성이다. 설정 누락이나 설정 조회 오류에도 닫힌 상태를 유지한다. 개인정보는 localStorage, 로그 등에 저장하지 않는다. 언어 선택만 localStorage에 저장한다.

`GET /.netlify/functions/study-korea-inquiry`는 활성화 상태/승인된 정책만 반환한다. 문의 조회 API가 아니며 개인정보를 반환하지 않는다. 미설정 POST는 503. API 성공은 연결된 수신기가 영구 저장 후 `accepted: true`와 유효한 접수번호를 반환한 경우에만 표시한다. 화면 테스트의 성공 응답은 **모의 응답**이며 실제 저장 검증이 아니다.

서버: 유형별 필수 필드·문자열 길이·이메일·관심 분야·동의·정책 버전·UUID·콘텐츠 타입·허용 Origin·본문 크기 검증, 허니팟, 필드 허용목록, 수신기 HTTPS 및 Bearer 인증, 리다이렉트 차단, 타임아웃. 클라이언트: 중복 클릭 방지, 실패 시 입력 보존, 같은 내용 재시도 시 동일 idempotency key. 개인정보나 수신기 오류 본문을 로그/클라이언트에 노출하지 않음.

Origin/허니팟만으로 봇 요청을 완전히 막을 수 없다. 운영용 분산 rate limit 및 스팸 검증은 아래 수신기 요구사항에 포함된다. 프로세스 메모리 기반 rate limit을 운영 보안으로 오인하지 않도록 구현하지 않았다.

## 추가 환경변수 — 모두 현재 미설정

| 변수 | 용도 |
| --- | --- |
| `STUDY_KOREA_ENABLED` | 모든 검증 후 `true`로 접수 개방 |
| `STUDY_KOREA_RECEIVER_VERIFIED` | 관리자 권한·저장·분산 rate limit·중복 방지 등 아래 수신기 요구사항을 실증한 후에만 `true` |
| `STUDY_KOREA_RECEIVER_URL` | 승인된 영구 저장 수신기의 HTTPS URL (클라이언트에 공개하지 않음) |
| `STUDY_KOREA_RECEIVER_TOKEN` | 서버 전용 인증 비밀값; 저장소에 커밋 금지 |
| `STUDY_KOREA_SITE_ORIGIN` | 허용할 정확한 HTTPS origin. 운영 예: `https://vr-meditour.com` |
| `STUDY_KOREA_POLICY_VERSION` | 법인이 승인한 동의문/개인정보 정책 버전 |
| `STUDY_KOREA_POLICY_KO` | 승인된 한국어 전체 개인정보 안내 |
| `STUDY_KOREA_POLICY_VI` | 승인된 베트남어 전체 개인정보 안내 |

정책에는 처리 주체, 유형별 수집 항목과 목적, 확정된 보유기간, 동의 거부권/불이익, 열람·정정·삭제 문의처 및 적용되는 위탁/국외 이전 사항을 법인이 확인하여 기재한다. 두 언어가 같은 의미인지 검토한다. 정책 변경 시 버전도 변경한다. 본 저장소는 보유기간을 임의로 정하지 않는다.

## 승인 후 연동 방안 및 관리자 접근제어

승인된 내부 시스템에 별도 `student_inquiries` / `partner_inquiries` 테이블 또는 엄격히 분리된 유형으로 저장하는 수신기를 구현한다. 기존 n8n 의료 상담 웹훅을 그대로 재사용하지 않는다. 외부 서비스 선정/연결 및 DB 적용은 별도 승인 후 수행한다.

수신기 필수 계약:

1. Bearer 토큰 검증 및 서버 측 입력 재검증. 일반 공개 사용자는 insert API만 사용하며 목록/단건/내보내기 접근 불가.
2. 관리자 SSO/인증과 서버 측 admin 역할 검사. DB 권한/RLS로 비로그인·일반 사용자 읽기 차단. 단순 숨김 메뉴/브라우저 비밀키로 보호하지 않음.
3. `submissionId`의 원자적 유일성 보장. 동일 ID/동일 내용 재시도는 같은 접수번호; 동일 ID/다른 내용은 거절. 정책 버전·동의 시각 기록.
4. 영구 저장 트랜잭션 커밋 이후에만 HTTP 2xx + `{"accepted":true,"receiptId":"..."}`. 접수번호는 ASCII 영숫자/밑줄/하이픈 1–100자. 큐 전달/이메일 발송만으로 성공 반환 금지.
5. 서버/게이트웨이의 지속성 있는 rate limit과 스팸 검증. 한도 초과는 429. 수신기는 공유 인증키와 실제 필요 범위의 식별자를 기준으로 남용을 제한하고 오탐·프라이버시 영향을 검토.
6. HTTPS, 저장 데이터 암호화, 관리자 감사 로그, 승인된 보유기간에 따른 자동 파기, 백업의 파기 정책, 운영 알림과 복구 검증.
7. 관리자 조회 화면에서는 사용자 입력을 HTML로 렌더링하지 말고 안전한 텍스트로 출력.

`RECEIVER_VERIFIED=true`는 실제 테스트를 대체하지 않는 운영 확인 플래그다. 이 저장소에는 관리자 화면/인증 서버/DB가 없으며 위 접근제어의 운영 검증은 미완료다.

## 검증 결과

- `node tests/study-korea/inquiry.test.cjs`: 7개 서버 테스트 통과. 네트워크 호출은 모의 처리. 비활성 차단, 설정/HTTPS, 메서드/Origin/형식/크기, 잘못된 입력/스팸/동의, 두 유형의 전달 허용목록, 기관 이메일, 실패/429/모호한 성공 차단.
- `node --check study-korea/student.js`, `node --check netlify/functions/study-korea-inquiry.js`, `node --check public/site-language-data.js`: 통과.
- Python `tomllib`으로 Netlify 설정 파싱 통과.
- `python tests/study-korea/browser.py`: 로컬 Chromium 통과. 서버는 `python -m http.server 8080 --bind 127.0.0.1`로 실행. 외부 브라우저 요청 차단, 신규 API는 모의 처리.
- 브라우저 검증: 한/베 전환, 1440px 데스크톱, 360/390/768px 가로 넘침 없음, 비활성 접수, 필수 입력/동의 오류, 실패 후 입력 유지, 동일 ID 재시도, 성공 후 초기화, 기관 문의, 홈페이지 양 언어 메뉴. 신규 페이지 JS 예외 없음.
- 기존 보호 대상 기능의 소스 파일 수정 없음. 변경은 홈페이지 메뉴 한 줄, 해당 번역 세 줄, 신규 경로 보안 헤더와 신규 파일로 한정. 기존 기능의 외부 AI/API 실서비스 회귀 호출은 수행하지 않음.
- 별도 프로덕션 빌드 단계가 없는 정적 사이트이므로 위 문법·설정·브라우저 검증을 수행. Netlify 배포 환경의 실제 라우팅/헤더/함수 실행은 아직 검증하지 않음.
- 미리보기: `docs/study-korea-previews/{desktop,mobile}-{ko,vi}.png`. 기본 접수 준비 상태를 촬영.

## 실제 배포 전 점검사항 / 미완료

- 원본 첨부 PRD 확보 및 P0 누락 대조, 베트남어 원어민 교정.
- 법인의 서비스 지원 범위·개인정보 정책/보유기간/문의처 승인.
- 승인된 저장 수신기 및 관리자 인증/권한 UI 구현·연동, 실제 영구 저장 및 조회 권한 테스트(비로그인/일반 사용자 차단), 파기/rate limit/중복 재시도 테스트.
- 승인된 환경에 환경변수 설정. 실데이터 없이 end-to-end 검증 후 접수 개방.
- Netlify에서 `/study-korea` 및 `/study-korea/` 응답, 전용 CSP 헤더, HTTPS 리다이렉션, 모바일 메뉴, 함수 환경변수 분리 확인. 프리뷰는 프리뷰 전용 수신기/origin/테스트 데이터 사용.
- 배포 시 검색엔진 등록/sitemap 정책에 따라 URL 추가 검토. 실제 배포·메인 병합은 이번 작업에 포함하지 않음.

## 변경 파일

- `index.html`: 신규 메뉴 한 줄.
- `public/site-language-data.js`: 신규 메뉴 번역.
- `netlify.toml`: 신규 페이지 전용 보안 헤더.
- `study-korea/index.html`, `study-korea/student.css`, `study-korea/student.js`: 독립 페이지/스타일/동작.
- `netlify/functions/study-korea-inquiry.js`: 기본 비활성 접수 어댑터.
- `tests/study-korea/inquiry.test.cjs`, `tests/study-korea/browser.py`: 서버/브라우저 검증.
- `docs/study-korea.md`, `docs/study-korea-previews/*.png`: 인수인계 및 4개 미리보기.

## 운영 준비 후속 검토

PRD 추적표, Netlify Forms/DB 비교, 관리자·파기·알림 설계, 비용 가정과 병합/배포 체크리스트는 [운영 준비 검토](study-korea-readiness.md)를 참조한다.

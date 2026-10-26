# 관리자 서버 API 준비 단계 — 2026-10-26

## 결과와 범위

PRD v1.0 FR-04/05의 서버 측 접근제어·리드 관리 로직을 준비했다. 외부 Auth/DB 연결, 실제 개인정보, 운영 환경변수, 배포 또는 main 병합은 하지 않았다.

`netlify/functions/study-korea-admin.js`는 **항상 미연결 상태**로 서비스 팩토리를 생성한다. GET/PATCH/직접 URL 호출은 `503 ADMIN_NOT_CONFIGURED`. 환경변수만 켜서 활성화할 수 없다. 외부 제공자와 보안 검토가 끝난 후 실제 어댑터를 코드로 연결해야 한다.

기존 관리자 화면은 여전히 `dev-tools/study-korea-admin/`의 메모리 모의 화면이다. 새로운 API에 연결하지 않았고 로그인 화면을 가장하지 않는다. 실제 관리자 로그인/DB 권한 검증이 완성된 것은 아니다.

## 코드 구성

- `server/study-korea/admin-service.cjs`: 외부 제공자에 종속되지 않는 서버 서비스.
- `netlify/functions/study-korea-admin.js`: 미연결 기본 차단 래퍼.
- `tests/study-korea/admin-api.test.cjs`: 가상 세션/롤백 가능한 메모리 저장소 테스트. 이 어댑터는 테스트 파일 안에만 존재.
- `docs/study-korea-data-model.sql`: 감사 기록에 이전/새 담당자 식별자 추가. 여전히 실행하지 않은 설계 초안.
- `scripts/build-public.cjs`: `server/`를 공개 경로 거절 목록에 추가. 기존 명시적 허용목록에도 없으며 dist에 들어가지 않음.

Netlify 함수 번들에는 서비스 모듈이 필요하다. 정적 공개 금지와 함수 번들 내부 포함은 별개다. 실제 Netlify 번들/직접 URL 503은 승인된 테스트 배포 때 확인해야 하며 이번에는 로컬 함수 호출로 검증했다.

## API 계약 (향후 연결용)

기본 경로 `/.netlify/functions/study-korea-admin`. 인증 토큰은 Authorization Bearer 헤더로만 전달하며 URL에는 넣지 않는다. 쿠키 또는 클라이언트 role 헤더는 신뢰하지 않는다.

| 요청 | 입력 | 응답 / 접근 |
| --- | --- | --- |
| GET 목록 | `type=STUDENT` 또는 `PARTNER`, `limit=1..50` (기본20), 선택 cursor | receipt/type/status/담당자/version/시각만. 이름·연락처·본문 없음 |
| GET 상세 | `id=<lead-id>` | 권한 있는 담당자에게만 허용 필드·동의 요약·최근 메모 최대20개. 없는 ID와 미배정 ID는 모두404 |
| PATCH 수정 | JSON `id`, `version`, 선택 `status`, `assignee_id`, `note` 중 하나 이상 | 동시 수정 확인 후 최소 요약 반환. 메모 최대1000자. 미허용 필드 거절 |

PATCH는 허용 HTTPS origin 및 application/json 필수, 8KB 제한. GET도 명시된 다른 Origin은 거절한다. Bearer 인증을 기본으로 하므로 브라우저가 자동 전송하는 쿠키에 의존하지 않는다. 모든 응답은 no-store이고 공급자 오류 본문·토큰·개인정보를 반환/로그로 출력하지 않는다.

상태코드: 400 형식/전환 오류, 401 세션 미인증, 403 MFA/권한/Origin, 404 대상 없음 또는 미배정, 409 버전 충돌, 413 크기, 415 형식, 503 미구성/저장소 장애. 성공은 저장소 transaction 콜백이 **커밋 완료 후 반환**한다는 어댑터 계약을 전제로 한다.

## 권한 및 상태

- 검증된 세션의 subject/MFA(`aal2`)만 사용한다. 토큰에 ADMIN이라고 적혀 있어도 권한은 매 요청 DB의 활성 membership으로 확인한다.
- ADMIN: 학생/기관 목록과 상세, 상태·메모·담당자 변경.
- COUNSELOR: 본인 배정 학생 문의 조회·상태·메모. 재배정 불가.
- B2B_MANAGER: 본인 배정 파트너 문의 조회·상태·메모. 학생 조회 불가.
- CONTENT_EDITOR/비활성/없는 계정: 리드 접근 거절.
- 배정 대상은 활성 계정 + 해당 문의 유형 역할이어야 한다. 미배정 해제 기능은 이번 API 범위에 없다.
- PRD 상태 NEW → CONTACT_ATTEMPTED → CONTACTED → CONSULTING → QUALIFIED → CLOSED. 각 진행 상태에서 CLOSED 허용, 종결 후 재개 미지원.
- 권한 확인·현재 version 확인·조건부 갱신·메모 추가·감사 기록은 동일 transaction. 감사 실패 시 메모와 상태 갱신도 롤백한다. 감사에는 actor/id/이전·새 상태/담당자/시각만, 고객 본문·메모 내용은 복사하지 않는다.

## 실제 연결에 필요한 어댑터

`createAdminHandler({verifySession, repository, origin})`:

1. `verifySession(token)` — 승인된 Auth SDK를 사용해 서명, 고정 algorithm, issuer, audience, 만료, 세션 철회, MFA를 검증하고 `{subject, assurance:'aal2'}` 반환. 디코딩만 하거나 브라우저가 보낸 subject/role을 그대로 반환하면 안 된다. 현재 실제 verifier는 없음.
2. `repository.transaction(fn)` — commit 완료 이후만 resolve, 예외 시 rollback. 세션 membership/담당자/리드를 잠그거나 동등한 직렬화 제어로 권한 철회·재배정 경합을 차단해야 한다.
3. transaction 객체 메서드:
   - `getMembership(subject)` 활성 역할; 상세/쓰기 시 관련 row lock.
   - `listLeads({type,assignee_id,limit,cursor})` DB에서 유형/담당자 scope를 강제. 반환 결과도 서비스가 재검사하지만 DB가 전체 데이터를 읽어오는 구현을 피한다.
   - `getLead(id)` 권한 검사에 필요한 행; 변경 시 잠금.
   - `getConsentSummary(id)` lead_id 포함, 개인정보 본문 제외.
   - `listNotes(id,20)` 해당 lead_id의 최신20개만 반환.
   - `compareAndUpdate(id,expectedVersion,patch)` version 조건부 UPDATE; 적용 행 1개일 때만 true.
   - `addNote`, `addAudit` 파라미터화 INSERT, 동일 트랜잭션.
4. PostgreSQL RLS/최소권한, 테스트/운영 격리, 마이그레이션 검토. privileged/BYPASSRLS 키를 브라우저에 노출하지 않는다.
5. Auth/DB 공급자·리전·수탁/국외이전·비용·관리자 계정/MFA와 보유정책 승인 후에만 위 코드를 연결한다. 인증 SDK 선택도 승인된 공급자 결정 뒤 수행한다.

## 테스트 결과와 한계

`node tests/study-korea/admin-api.test.cjs`: 12개 통과.

- 미구성 API 직접 호출 차단, 토큰/MFA/역할/비활성 계정 거절.
- 유형별/배정별 목록·상세 및 IDOR 차단, 민감 필드 목록 응답에서 제외.
- Origin/미허용 필드/크기/잘못된 전환, 담당자 역할 검사.
- 상태·메모·최소 감사의 원자적 처리 모델, 버전 충돌, 감사 실패 롤백.
- 잘못된 저장소가 다른 유형 데이터를 반환하면 전체 응답 차단.
- 권한 철회 후 다음 요청 거절.

추가로 공개 산출물 검증 통과: server/docs/tests/dev-tools/함수 소스는 dist에 없다. 기존 정적 공개 파일364개는 동일하게 유지한다.

테스트의 verifier는 테스트 subject를 반환하는 가짜 함수이고 저장소는 메모리 복제/커밋 방식이다. **실제 JWT 검증/DB 잠금/RLS/다중 프로세스 동시성/운영 rollback을 실증한 것이 아니다.** 실제 세션·DB 연결, API rate limit, 열람 감사/내보내기/삭제·파기, 관리자 운영 UI 연결은 남아 있다.

## FR 상태 갱신

FR-04는 미구현에서 **부분 구현**(서버 정책 로직/기본 차단)으로 갱신한다. 운영 인증 인수기준은 미충족이다. FR-05도 실제 저장/API-UI 연결 전이므로 부분 구현 유지. 전체 완료3/12(25%), P0 완료3/8(37.5%)는 그대로다.

## 다음 승인 단계

- DB/Auth 공급자·리전·테스트 프로젝트·예산·계약 조건 선정 승인.
- 관리자 역할/초대/MFA와 개인정보 보유·국외이전·미성년 접수범위 승인.
- 승인된 테스트 환경에서 실제 SDK/DB 어댑터를 연결하고 비인가 직접 호출, role 변경, 동시에 PATCH 2건, 감사 실패/DB 장애, 파기/복원 검증.
- 검증 및 별도 승인 전 운영 접수·main 병합·배포 금지 유지.

## 2026-10-26 어댑터 후속 검증

[PostgreSQL·인증 어댑터 결과](study-korea-adapters.md): jose 서명 검증과 PostgreSQL 저장소를 추가했으며 일회성 로컬 DB에서 동시 수정/롤백/RLS 기본 거절을 검증했다. 외부/운영 연결은 없고 기본 관리자503 차단은 유지한다. 이전의 SQL 미실행 표기는 외부/운영 미적용으로 갱신한다.

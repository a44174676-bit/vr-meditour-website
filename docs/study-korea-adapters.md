# PostgreSQL·인증 어댑터 준비 결과 — 2026-10-26

## 범위

이전 관리자 서비스에 연결할 PostgreSQL 저장소와 OIDC JWT 검증 어댑터를 구현했다. **아직 연결하지 않았다.** `netlify/functions/study-korea-admin.js`는 종전처럼 인자 없는 팩토리로 생성되어 모든 호출이503이다. 외부 DB/Auth, 운영 환경변수, 실제 개인정보, main 병합·배포는 사용하지 않았다.

이번에는 로컬 가상 데이터 DB에서 초안 SQL을 실제 실행했다. 기존 문서의 “SQL 미실행”은 이제 “외부/운영 미적용, 일회성 로컬 테스트 실행”으로 읽는다. 테스트 DB는 고정 루프백의 새 컨테이너로 생성했고 기존 DB를 변경하지 않았다.

## 파일

- `server/study-korea/postgres-repository.cjs`: 주입된 pg Pool 기반 트랜잭션 저장소, 명시적 TLS 검증 Pool factory.
- `server/study-korea/oidc-verifier.cjs`: jose 기반 서명/클레임/MFA 검증 + 필수 세션 철회 확인 콜백.
- `server/study-korea/package.json`, `package-lock.json`: 서버 전용 pg/jose 의존성. 루트 빌드/기존 서비스에는 의존성 추가 없음.
- `server/study-korea/admin-service.cjs`: 공급자 subject의 `|`, `:`, `@` 등을 허용하는 제한된 ID 검증. 역할 신뢰 방식은 변함없음.
- `tests/study-korea/oidc-verifier.test.cjs`, `postgres-integration.test.cjs`: 외부 연결 없는 인증/실제 로컬 SQL 테스트.

## PostgreSQL 저장소 계약

- import 시 연결하지 않는다. 승인된 Pool을 넘겨야 사용 가능하다.
- transaction은 BEGIN→행 잠금→콜백→COMMIT 완료 후 반환. 예외는 ROLLBACK. rollback도 실패하면 연결을 폐기한다.
- membership `FOR SHARE`, 상세 lead `FOR UPDATE`, 목록의 scope/limit 적용과 `FOR SHARE`. 동일 version 조건부 갱신으로 동시에 두 요청이 와도 한 건만 처리한다.
- 쿼리는 파라미터화; schema/table명은 코드 고정. 목록은 유형·담당자 필터 + UUID keyset pagination + 최대50개. 이름/연락처는 목록 쿼리에서 읽지 않는다.
- statement5초, lock3초, idle transaction10초 제한. 연결 factory는 인증서 검증 필수이며 connection URL의 TLS 옵션 우회 query string은 거절한다.
- 메모·감사 INSERT는 같은 transaction. UUID는 서버에서 생성. 스키마에 맞춰 동의 요약과 최신 메모20개 조회.
- SQL 오류/잠금 시간초과는 서비스의 일반503으로 전달, SQL 원문/값을 고객에게 출력하지 않는다.

**권한 주의:** 이번 통합 테스트의 애플리케이션 연결은 일회성 DB 소유자 계정이라 RLS를 우회한다. 이는 운영 권한 정책 검증이 아니다. 별도의 비권한 role로 기본 거절 RLS는 확인했지만 운영 어댑터는 최소권한 계정과 실제 role별 정책/요청 context를 설계·검증해야 한다. 소유자/BYPASSRLS 키를 운영 기본값으로 사용하면 안 된다.

## 인증 프로필 및 한계

- 검증 엔진은 표준 `jose`. 허용 알고리즘 RS256/ES256, typ=JWT, 고정 issuer/audience, 필수 exp/iat/sub/iss/aud/session_id/aal.
- 승인된 **공개** JWKS만 주입. private/symmetric key 거절. 토큰의 jku 등으로 URL을 따라가지 않고, 키 자동 검색/네트워크 호출도 하지 않는다.
- 기본 유효기간 최대900초(설정60~3600초), 미래 발급/만료/잘못된 nbf 거절. MFA `aal2` 필수.
- `isSessionActive({subject,sessionId})`가 정확히 true일 때만 반환. 조회 실패/철회는 인증 거절. 이 콜백의 실제 공급자 구현은 아직 없다.
- role 클레임은 반환하지 않음. 관리자 역할은 기존 서비스가 DB membership으로 매번 확인한다.
- `aal`/`session_id`는 현재 준비한 명시적 프로필이다. 모든 OIDC 제공자에 공통인 표준 claim이라고 가정하지 않는다. 제공자 확정 후 실제 토큰/MFA/철회 의미를 확인하고 profile을 승인해야 한다.
- 공개키 교체 시 최신 승인 JWKS로 verifier를 다시 생성해야 한다. 자동 로테이션/폐기/장애 시 동작을 구현·운영 검증하는 작업이 남아 있다.

## 테스트 결과

인증6개 테스트 통과: 유효 서명, payload 변조/unknown kid, issuer/audience/만료/미래발급/과도한 수명, 필수 claim/MFA/type, 철회/조회 실패, 대칭·약한 알고리즘/안전하지 않은 구성 차단. 테스트 키는 실행 중 생성되고 저장하지 않는다. 실제 IdP 연결 검증은 아니다.

PostgreSQL17 로컬 통합6개 통과:
1. 상태·메모·감사 실제 commit 및 동의/메모 상세 조회.
2. 동시 PATCH 두 건 → 200 한 건,409 한 건; 감사도 한 건.
3. DB 감사 trigger 오류 → 상태 version/메모 모두 rollback.
4. membership 비활성 후 다음 요청403.
5. UUID keyset pagination 중복 없음/limit 적용.
6. 별도 비권한 SQL role에서 RLS 기본 거절로 조회0행/수정0행.

기존 관리자 서비스12개, 공개 산출물 검사1개도 재통과. UI는 변경하지 않아 브라우저 테스트를 불필요하게 반복하지 않았다. 서버 디렉터리·의존성·테스트·문서는 dist에 없다.

## 재현 방법 (로컬 가상 데이터 전용)

1. `npm ci --prefix server/study-korea --ignore-scripts`.
2. `node tests/study-korea/oidc-verifier.test.cjs`.
3. 새 로컬 PostgreSQL17 컨테이너 생성. 사용 이미지 고정 digest:
   `postgres@sha256:266d3c257594e195b309ae9d1805e54c788f1d7b375f56bf6c367aac6c917e7b`.
   DB=`student_adapter_test`, 사용자=`fixture_owner`, 암호=`fixture-only-password`는 공개 테스트 전용 값이며 어떤 운영 자격증명도 아니다. bind는127.0.0.1:55432만, 데이터는 tmpfs, 기존 volume mount 금지.
4. `node tests/study-korea/postgres-integration.test.cjs`.
5. 이 테스트 전용 컨테이너 제거. 새 컨테이너에서만 실행하며 기존 DB의 스키마를 지우거나 재사용하지 않는다.

통합 테스트는 접속 주소가 코드에 고정되어 있고 DB명/사용자도 확인한다. 환경변수로 외부 접속 URL을 주입할 수 없다. 실제 운영정보를 테스트 fixture에 넣지 않는다. 이번 실행 뒤 `vr-student-adapter-test` 컨테이너와 tmpfs 데이터 제거를 확인했다. 테스트용 공개 이미지/개발 의존성만 작업 환경에 남는다.

## 승인 전 남은 작업

- Auth/DB 제공자·리전·가격·위탁/국외이전·실제 테스트 프로젝트 선정.
- 운영 role별 RLS/DB 최소권한 계정, 로그인/MFA/세션 철회 API·키 회전, 비밀관리.
- 실제 네트워크 TLS/CA, pooling/proxy와 transaction timeout, 권한 철회·재배정 경합 검증.
- 스키마 migration 리뷰 및 승인된 테스트 프로젝트에 적용 승인. 현재 docs SQL은 운영 자동 실행 스크립트가 아니다.
- 상담 수신기 영구 저장/idempotency/outbox·삭제/보유·rate limit 구현과 정책 승인.
- 관리자 UI를 실제 로그인/API에 연결하고 end-to-end 검증. 이후 별도 main 병합·배포 승인.

P0 FR-04/05는 실제 서비스 연결/운영 인증/관리자 UI 완료 전까지 부분 구현 유지. 완료율3/8은 바뀌지 않는다. 로컬 PostgreSQL 검증을 실제 서비스 개방 완료로 표시하지 않는다.

# 외국인정착통합AI시스템 (MVP)

## 프로젝트 개요
외국인 사용자의 정착 과업 자동 생성, 상태 추적, 진행률/위험도 계산, 담당자 이관을 지원하는 규칙 기반 MVP입니다.

## 빠른 실행
```bash
cd settlement-ai-system/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
```bash
cd settlement-ai-system/frontend
npm install
npm run dev
```

## 백엔드 실행 방법
- 주소: `http://localhost:8000`
- 헬스체크: `GET /health`

## 백엔드 테스트 실행
```bash
cd settlement-ai-system/backend
pytest -q
```

## 프론트엔드 빌드
```bash
cd settlement-ai-system/frontend
npm install
npm run build
npm run preview
```

## 샘플 데이터 생성 방법
```bash
cd settlement-ai-system/backend
python seed.py
```
- 3명 샘플 사용자 생성
- 이름 기준 중복 생성 방지

## API 목록
- `GET /`
- `GET /health`
- `POST /users`
- `GET /users`
- `GET /users/{user_id}`
- `POST /users/{user_id}/generate-roadmap`
- `GET /users/{user_id}/tasks`
- `PATCH /tasks/{task_id}/status`
- `GET /users/{user_id}/passport`
- `POST /users/{user_id}/risk`
- `GET /handoffs`
- `GET /dashboard/{role}` (`operator`, `medical`, `settlement`, `korean`, `mentor`, `admin`, `family`)

## API 테스트 순서
1) 백엔드 실행  
2) GET /  
3) POST /users  
4) POST /users/{user_id}/generate-roadmap  
5) GET /users/{user_id}/tasks  
6) PATCH /tasks/{task_id}/status  
7) GET /users/{user_id}/passport  
8) POST /users/{user_id}/risk  
9) GET /handoffs  
10) GET /dashboard/operator

## Docker 실행
```bash
cd settlement-ai-system
docker compose up --build
```
- backend: `http://localhost:8000`
- frontend static: `http://localhost:4173`

## CI 검증 항목
- backend dependency install
- `python -m py_compile`
- `pytest`
- frontend `npm install`
- frontend `npm run build`

## 현재 MVP 범위
- 규칙 기반 과업 생성/단계 판단
- 과업 상태 변경 시뮬레이션
- 진행률(가중치) 및 위험도 계산
- 역할별 대시보드 필터링
- 더미 에이전트 로그

## 아직 실제 연동하지 않은 기능
- 실제 AI API
- QR 인증
- 위치 인증
- 병원 예약 API
- Gmail/카카오 알림
- 실제 비자/법률/의료 판단

## 개인정보 보호 주의사항
- 여권번호/외국인등록번호/주민등록번호 미수집
- 의료정보는 상담 필요 수준으로만 처리
- 의료/법률/비자 판단은 전문가 최종 확인 필요

## pip/npm 403 발생 시 해결 방법
- 사내 프록시/보안정책에서 `pypi.org`, `files.pythonhosted.org`, `registry.npmjs.org` 허용
- frontend `.npmrc` registry 확인
- pip index-url/프록시 설정 확인
- 제한 환경에서는 사내 미러(PyPI/npm mirror) 사용

## MVP 완료 기준
1) backend pytest 통과  
2) GET /health 정상  
3) frontend npm run build 성공  
4) 사용자 생성 → 로드맵 생성 → 과업 상태 변경 → 패스포트 확인 → 위험도 계산 → 이관 대시보드 확인 흐름 정상

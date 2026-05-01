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


## 별도 배포 구조 (기존 홈페이지와 분리)
- 기존 루트 홈페이지 파일(`index.html`, `styles.css`, `thank-you.html`)은 수정하지 않고 유지합니다.
- `settlement-ai-system/frontend`는 Netlify 별도 사이트로 배포합니다.
- `settlement-ai-system/backend`는 Render 또는 Railway에 별도 API 서버로 배포합니다.

## Netlify (Frontend) 배포
Netlify Site settings에서 아래와 같이 설정합니다.
- **Base directory**: `settlement-ai-system/frontend`
- **Build command**: `npm run build`
- **Publish directory**: `settlement-ai-system/frontend/dist`

환경변수(필수):
- `VITE_API_BASE_URL=https://<배포된-backend-도메인>`

예시:
- Render 사용 시: `https://your-backend.onrender.com`
- Railway 사용 시: `https://your-backend.up.railway.app`

## Render / Railway (Backend) 배포
백엔드 디렉터리: `settlement-ai-system/backend`

### Start command
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Install
- `requirements.txt` 기준으로 의존성 설치

### Environment Variables
- `DATABASE_URL` (필수, 기본값은 sqlite 파일)
- `CORS_ORIGINS` (권장, 예: Netlify 도메인)

권장 예시:
- `DATABASE_URL=sqlite:///./settlement.db`
- `CORS_ORIGINS=https://<netlify-site>.netlify.app,http://localhost:5173`

## 배포 연결 체크리스트
1. Backend가 `/health`에서 200 응답
2. Frontend `VITE_API_BASE_URL`이 실제 Backend URL로 설정
3. Netlify 재배포 후 브라우저에서 사용자 생성/로드맵 생성 API 호출 확인


## 초보자용 배포 순서 (별도 테스트 앱)
> 기존 `vr-meditour.com` 루트 홈페이지는 수정하지 않습니다.

### A. Backend 먼저 배포 (Render 또는 Railway)
1. 배포 서비스에서 **Root Directory**를 `settlement-ai-system/backend`로 지정
2. Build/Install: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. 환경변수 설정
   - `DATABASE_URL=sqlite:///./settlement.db`
   - `CORS_ORIGINS=https://<netlify-site>.netlify.app,http://localhost:5173`
5. 배포 완료 후 Backend URL 확보

### B. Frontend 배포 (Netlify)
1. Netlify에서 저장소 연결 후 아래 설정 입력
   - Base directory: `settlement-ai-system/frontend`
   - Build command: `npm run build`
   - Publish directory: `settlement-ai-system/frontend/dist`
2. Netlify 환경변수 설정
   - `VITE_API_BASE_URL=https://<배포된-backend-도메인>`
3. Deploy 실행 후 Frontend URL 확보

### C. 연결 확인
1. Backend URL + `/health` 접속 → 200/JSON 확인
2. Frontend 접속 후 사용자 등록
3. 로드맵 생성
4. 과업 상태 변경
5. 패스포트/위험도/대시보드 확인

## 배포 후 확인 URL 목록
- Backend health: `https://<backend-domain>/health`
- Backend docs(Swagger): `https://<backend-domain>/docs`
- Backend root status: `https://<backend-domain>/`
- Frontend app: `https://<netlify-site>.netlify.app`
- Frontend에서 호출하는 API base: `VITE_API_BASE_URL`

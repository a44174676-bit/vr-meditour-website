# AI 기반 피부·체성분 통합 분석 MVP (skin-body-ai-mvp)

비전공자도 쉽게 테스트할 수 있도록 만든 **Beauty Wellness Reference Report**용 웹앱입니다.  
사용자가 피부/체성분 수치를 입력하거나 얼굴 이미지를 업로드/촬영하면 점수와 참고 리포트를 카드 형태로 보여줍니다.

> **중요 안내**: 본 결과는 의료 진단이 아니며, 참고용입니다.

---

## 1) 프로그램 설명

### 1단계 기능
- 수치 입력 기반 `/analyze` API 분석
- 피부 점수 / 체성분 점수 / Health-Derma Score
- 추천 화장품 / 웰니스 루틴

### 2단계 기능
- 휴대폰 카메라 촬영(`capture="user"`) 및 얼굴 사진 업로드
- `/analyze-image` API를 통한 기본 이미지 분석
- 평균 밝기, 평균 붉은기, 피부톤 참고값, 이미지 품질 안내

---

## 2) 로컬 실행 방법

### 2-1. 준비물
- Python 3.10 이상
- 브라우저(PC/모바일)

### 2-2. 프로젝트 이동
```bash
cd skin-body-ai-mvp
```

### 2-3. 가상환경(권장)
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .\.venv\Scripts\Activate.ps1
```

### 2-4. 백엔드 패키지 설치
```bash
cd backend
pip install -r requirements.txt
```

### 2-5. 백엔드 실행
```bash
cd backend
uvicorn main:app --reload
```

### 2-6. 프론트엔드 실행
```bash
cd skin-body-ai-mvp/frontend
python -m http.server 5500
```

접속:
- 프론트엔드: http://127.0.0.1:5500
- 백엔드 상태: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

---

## 3) 백엔드 클라우드 배포 방법 (Render/Railway)

### 3-1. 배포 기본
- 배포 루트: `skin-body-ai-mvp/backend`
- Python 버전: 3.10+
- 설치 명령:
```bash
pip install -r requirements.txt
```

### 3-2. 시작 명령어 (중요)
Render 기준 start command:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Railway도 동일한 방식으로 사용 가능:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3-3. CORS 환경변수 (선택)
현재 기본은 `*` 허용이라 바로 동작합니다.  
운영에서 제한하려면 환경변수 `ALLOWED_ORIGINS`를 쉼표로 설정하세요.

예시:
```text
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app,https://your-domain.com
```

---

## 4) 프론트엔드 Netlify 배포 방법 (/skin-analysis 페이지용)

이 MVP는 **기존 VR MEDI TOUR & HOME 홈페이지를 대체하지 않고**, 별도 기능 페이지(`/skin-analysis`)로 연결하는 것을 목표로 합니다.

### 4-1. 배포 대상
- 폴더: `skin-body-ai-mvp/frontend`
- 정적 배포 가능 (HTML/CSS/JS)

### 4-2. Netlify 배포
1. Netlify에서 새 사이트 생성
2. `frontend` 폴더를 배포 폴더로 지정
3. Build command 없이 정적 배포
4. 배포된 URL 확인 후, 기존 홈페이지에서 `/skin-analysis` 링크로 연결

> 실제 운영 라우팅은 메인 사이트 구조에 맞춰 리버스 프록시/리디렉션 설정으로 연결하세요.

---

## 5) 배포 후 API 주소 변경 방법 (가장 중요)

프론트엔드 파일:
- `skin-body-ai-mvp/frontend/script.js`

아래 한 줄만 수정하면 됩니다.
```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

예시(배포 후):
```js
const API_BASE_URL = "https://your-backend-service.onrender.com";
```

이후 호출은 자동으로 아래 경로를 사용합니다.
- `${API_BASE_URL}/analyze`
- `${API_BASE_URL}/analyze-image`

---

## 6) 테스트 가능한 API 경로

- `GET /` : 서버 상태 확인
- `POST /analyze` : 수치 기반 분석
- `POST /analyze-image` : 이미지 기반 분석

---

## 7) 카메라 기능 주의사항

- PC에서는 파일 업로드 방식으로 동작할 수 있습니다.
- 휴대폰에서는 브라우저별 카메라 호출 UX가 다를 수 있습니다.
- 카메라 기능은 **HTTPS 환경에서 더 안정적으로 동작**합니다.

---

## 8) 법적·윤리적 주의사항

- 본 기능은 의료 진단이 아닙니다.
- 피부질환 판단이나 치료 권고를 하지 않습니다.
- 뷰티·웰니스 참고 리포트로만 사용하세요.

---

## 9) 기존 홈페이지와의 관계

- 본 `skin-body-ai-mvp`는 **기존 VR MEDI TOUR & HOME 홈페이지를 대체하지 않습니다.**
- 별도의 기능 페이지(`/skin-analysis`)로 연결하여 운영하는 구조를 권장합니다.

---

## 폴더 구조

```text
skin-body-ai-mvp/
├─ backend/
│  ├─ main.py
│  ├─ analysis_engine.py
│  ├─ recommendation_engine.py
│  ├─ image_analysis_engine.py
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ script.js
└─ README.md
```


## 10) 머지 충돌 정리 메모

- `/analyze`(1단계 수치 분석)와 `/analyze-image`(2단계 이미지 분석) 기능을 모두 유지했습니다.
- 기존 VR MEDI TOUR & HOME 홈페이지를 대체하지 않고, `/skin-analysis` 기능 페이지로 연결하는 방향을 유지합니다.


## 11) 충돌 해결 확인 항목

- `POST /analyze`와 `POST /analyze-image` API를 모두 유지합니다.
- 프론트엔드는 `API_BASE_URL`(및 내부 endpoint 상수) 기준으로 중복 없이 호출합니다.
- 기존 VR MEDI TOUR & HOME 홈페이지 대체 없이, 별도 기능 페이지로 운용합니다.

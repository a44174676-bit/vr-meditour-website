# AI 기반 피부·체성분 통합 분석 MVP (skin-body-ai-mvp)

비전공자도 쉽게 테스트할 수 있도록 만든 **Beauty Wellness Reference Report**용 웹앱입니다.  
사용자가 피부/체성분 수치를 입력하면 점수와 추천 루틴을 카드 형태로 보여줍니다.

> **중요 안내**: 본 결과는 의료 진단이 아니며, 참고용입니다.

---

## 1) 프로그램 설명

- 백엔드(FastAPI): 입력값을 받아 피부 점수, 체성분 점수, Health-Derma Score를 계산
- 추천 로직: 입력값 조건에 따라 화장품/웰니스 추천 생성
- 프론트엔드(HTML/CSS/JS): 폼 입력 → API 호출(fetch) → 결과 카드 렌더링

점수 등급은 초보자가 이해하기 쉽게 아래 문구를 함께 제공합니다.
- **좋음**: 80점 이상
- **관리 필요**: 50~79.99점
- **주의 필요**: 50점 미만

---

## 2) 설치 방법

### 2-1. 준비물
- Python 3.10 이상
- 인터넷 브라우저(Chrome, Edge 등)

### 2-2. 프로젝트 이동
```bash
cd skin-body-ai-mvp
```

### 2-3. 가상환경 생성/활성화 (권장)
#### macOS/Linux
```bash
python -m venv .venv
source .venv/bin/activate
```
#### Windows (PowerShell)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2-4. 백엔드 패키지 설치
```bash
cd backend
pip install -r requirements.txt
```

---

## 3) 백엔드 실행 방법

`backend` 폴더에서 아래 명령 실행:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

정상 실행 후 브라우저에서 아래 주소 확인:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs (Swagger UI)

---

## 4) 프론트엔드 실행 방법

새 터미널을 열고 프로젝트 루트(`skin-body-ai-mvp`)로 이동 후 실행:

```bash
cd frontend
python -m http.server 5500
```

브라우저에서 접속:
- http://127.0.0.1:5500

---

## 5) 테스트 방법

1. 백엔드 실행(8000 포트)
2. 프론트엔드 실행(5500 포트)
3. 웹 화면에서 수치 입력 후 **분석하기** 클릭
4. 아래 항목이 카드로 출력되는지 확인
   - 피부 점수 + 쉬운 등급
   - 체성분 점수 + 쉬운 등급
   - Health-Derma Score + 쉬운 등급
   - 추천 화장품
   - 추천 웰니스 제품/루틴
   - 주의 문구: **본 결과는 의료 진단이 아니며, 참고용입니다**

예시 테스트 값:
- moisture=30, redness=70, oiliness=65, texture=60
- body_water=40, muscle_level=45, body_fat_rate=55, stress_level=80, sleep_quality=35

---

## 6) 향후 확장 방향

- 얼굴 사진 업로드
- 카메라 촬영
- 실제 AI 피부 분석 모델 연결
- BIA 센서 연결
- 제품 DB 연결
- 결제 시스템 연결
- 자동판매기 출고 제어 연결

---

## 폴더 구조

```text
skin-body-ai-mvp/
├─ backend/
│  ├─ main.py
│  ├─ analysis_engine.py
│  ├─ recommendation_engine.py
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ script.js
└─ README.md
```

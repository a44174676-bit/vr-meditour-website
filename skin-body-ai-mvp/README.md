# AI 기반 피부·체성분 통합 분석 MVP (skin-body-ai-mvp)

비전공자도 쉽게 테스트할 수 있도록 만든 **Beauty Wellness Reference Report**용 웹앱입니다.  
사용자가 피부/체성분 수치를 입력하면 점수와 추천 루틴을 카드 형태로 보여줍니다.

> **중요 안내**: 본 결과는 의료 진단이 아니며, 참고용입니다.

---

## 1) 프로그램 설명

### 1단계 기능
- 백엔드(FastAPI): 입력값을 받아 피부 점수, 체성분 점수, Health-Derma Score를 계산
- 추천 로직: 입력값 조건에 따라 화장품/웰니스 추천 생성
- 프론트엔드(HTML/CSS/JS): 폼 입력 → API 호출(fetch) → 결과 카드 렌더링

### 2단계 기능 (이미지 분석 추가)
- 휴대폰 카메라 촬영(`capture="user"`)
- 얼굴 사진 업로드
- 기본 이미지 분석 (Pillow 기반)
- 평균 밝기, 평균 붉은기, 피부톤 참고값, 이미지 품질 안내 제공

점수 등급은 초보자가 이해하기 쉽게 아래 문구를 함께 제공합니다.
- **좋음**: 80점 이상
- **관리 필요**: 50~79.99점
- **주의 필요**: 50점 미만

---

## 2) 설치 방법

### 2-1. 준비물
- Python 3.10 이상
- 인터넷 브라우저(Chrome, Edge, 모바일 브라우저 등)

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

```bash
cd backend
uvicorn main:app --reload
```

정상 실행 후 브라우저에서 확인:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs

---

## 4) 프론트엔드 실행 방법

새 터미널에서:
```bash
cd skin-body-ai-mvp/frontend
python -m http.server 5500
```

브라우저 접속:
- http://127.0.0.1:5500

---

## 5) 테스트 방법

### 수치 입력 분석 테스트
1. 백엔드 실행
2. 프론트엔드 실행
3. 수치 입력 후 **분석하기** 클릭
4. 점수/등급/추천 카드 확인

### 이미지 분석 테스트
1. 휴대폰 또는 PC에서 프론트엔드 접속
2. 얼굴 이미지 선택 또는 촬영
3. 미리보기 표시 확인
4. **이미지 분석하기** 클릭
5. 결과 카드에서 아래 항목 확인
   - 평균 밝기
   - 평균 붉은기
   - 피부톤 참고값
   - 이미지 품질 안내

---

## 6) 카메라 관련 주의사항

- PC에서는 파일 업로드 방식으로 동작할 수 있습니다.
- 휴대폰에서는 브라우저 종류에 따라 카메라 호출 방식이 다를 수 있습니다.
- 실제 배포 환경에서는 카메라 기능 안정성을 위해 HTTPS가 필요할 수 있습니다.

---

## 7) 법적·윤리적 주의사항

- 본 기능은 의료 진단이 아닙니다.
- 피부질환 판단이나 치료 권고를 하지 않습니다.
- 뷰티·웰니스 참고 리포트로만 사용하세요.

---

## 8) 향후 확장 방향

- 얼굴 사진 업로드 고도화
- 카메라 실시간 촬영 품질 향상
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
│  ├─ image_analysis_engine.py
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ script.js
└─ README.md
```

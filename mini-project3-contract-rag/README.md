# 한-베 비즈니스 문서 RAG 분석 도우미

- **성명:** 정성영
- **학번:** 20242502
- **과정:** 부산외국어대학교 AI 부트캠프 미니 프로젝트 3
- **배포:** Streamlit Community Cloud

## 서비스 개요

한국어·베트남어·영어 PDF/TXT/MD 문서를 업로드한 뒤 한국어로 질문하면 다음 결과를 제공한다.

1. 문서 유형, 발신자, 수신자, 작성 목적
2. 사용자의 질문에 대한 쉬운 한국어 답변
3. 문서에서 확인되는 핵심 사실
4. 우리 회사가 즉시·다음·확인 단계로 해야 할 일
5. 위험하거나 불명확한 사항
6. 이 문서만으로는 증명되지 않는 사항
7. 파일명·페이지·조각과 원문 인용 근거

단순 번역문을 나열하지 않고, 검색된 근거만 사용해 문서 의미와 실행 과제를 구조화한다.

## 기술 구조

```text
다국어 PDF/TXT/MD 업로드
        ↓
페이지별 텍스트 추출 및 메타데이터 보존
        ↓
LangChain RecursiveCharacterTextSplitter
        ↓
다국어 문자 n-gram Embedding + FAISS VectorDB
        ↓
한국어 질문을 한·베·영 검색어로 확장
        ↓
관련 근거 조각 검색 또는 전체 문서 근거 선정
        ↓
Claude Messages API 근거 기반 한국어 분석
        ↓
문서 정체·핵심 사실·실행 과제·위험·원문 근거 표시
```

## 핵심 기술

- **Claude Code:** 코드 생성·수정·오류 해결
- **LangChain:** Document, Text Splitter, Embeddings 인터페이스, FAISS 연동
- **RAG:** 문서 분할 → 임베딩 → VectorDB → 근거 검색 → Claude 답변 생성
- **Claude API:** 근거 범위 안에서 한국어 구조화 분석
- **Streamlit:** 문서 업로드·질의·분석 결과 UI 및 웹 배포

## 실행

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Anthropic API 키 설정

### Streamlit Community Cloud

앱의 **Settings → Secrets**에 다음을 등록한다.

```toml
ANTHROPIC_API_KEY = "sk-ant-..."
ANTHROPIC_MODEL = "claude-sonnet-4-20250514"
```

API 키를 GitHub 코드나 `secrets.toml` 파일로 공개 저장하지 않는다. 앱의 비밀번호 입력칸에 세션용 API 키를 직접 입력해 시험할 수도 있다.

## 보안 및 판단 범위

- 업로드된 문서는 앱 메모리에서 처리하며 GitHub 저장소에 자동 저장하지 않는다.
- 다만 선택된 문서 근거는 분석을 위해 Anthropic API로 전송된다.
- 개인정보, 서명, 계좌번호, 여권번호, 환자정보와 영업비밀은 가린 뒤 사용한다.
- 스캔 PDF는 OCR이 없으면 텍스트를 읽지 못할 수 있다.
- 본 서비스는 문서 이해와 확인사항 정리를 위한 교육용 도구이며 법률·세무 자문이나 폐업 완료 증명을 대신하지 않는다.

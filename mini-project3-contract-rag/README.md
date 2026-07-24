# 한–베 비즈니스 계약 RAG 검토 도우미

- **성명:** 정성영
- **학번:** 20242502
- **과정:** 부산외국어대학교 AI 부트캠프 미니 프로젝트 3
- **배포:** Streamlit Community Cloud

## 서비스 개요

영어·베트남어·한국어 계약 문서를 업로드한 뒤 한국어로 질문하면 LangChain으로 문서를 분할하고, 다국어 문자 n-gram 임베딩과 FAISS VectorDB로 관련 조항을 검색한다. 검색된 조항은 한국어로 번역하고 위험 신호, 확인 질문, 원문 근거와 함께 표시한다.

## 기술 구조

```text
다국어 PDF/TXT/MD 업로드
        ↓
LangChain Document 생성 및 RecursiveCharacterTextSplitter 문서 분할
        ↓
다국어 문자 n-gram Embedding
        ↓
FAISS VectorDB 구축
        ↓
한국어 질문을 베트남어·영어 검색어로 확장
        ↓
관련 문서 조각 검색
        ↓
한국어 번역·위험 신호·확인 질문·원문 근거 표시
```

## 핵심 기술

- **Claude Code:** 코드 생성·수정·오류 해결에 활용
- **LangChain:** 문서 처리, 분할, Embeddings 인터페이스, FAISS 연결
- **RAG:** 문서 분할 → 임베딩 → VectorDB → 관련 근거 검색
- **Streamlit:** 문서 업로드·질의·결과 화면 및 웹 배포

## 특징

- 별도의 Anthropic API 키 없이 실행 가능
- 한국어·베트남어·영어 문서 지원
- 실제 문서를 업로드하면 데모 문서는 자동 제외
- 검색된 문서 조각을 한국어로 표시
- 법률자문이 아닌 교육용 1차 검토 보조 도구

## 실행

```bash
pip install -r requirements.txt
streamlit run app.py
```

## 보안 및 한계

- 번역 과정에서 검색된 문장 일부가 외부 번역 서비스로 전송될 수 있으므로 개인정보·계좌번호·서명·영업비밀은 가린 뒤 사용한다.
- 업로드 문서는 GitHub 저장소에 자동 저장하지 않는다.
- 스캔 PDF는 OCR 기능이 없어 텍스트를 읽지 못할 수 있다.
- 위험 신호는 키워드 기반이며 법률적 유효성을 판단하지 않는다.

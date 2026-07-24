# 한–베 비즈니스 계약 RAG 검토 도우미

- 성명: 정성영
- 학번: 20242502
- 과목: AI 부트캠프 미니 프로젝트 3

영어·베트남어·한국어 계약 문서를 업로드하고 질문하면 LangChain으로 문서를 분할하고, 다국어 임베딩과 FAISS VectorDB로 관련 조항을 검색합니다. 검색 결과를 바탕으로 한국어 요약, 위험 신호, 상대방 확인 질문, 원문 근거를 제공합니다.

## 기술
- Claude Code: 코드 생성·수정·디버깅 지원
- LangChain: 문서 처리·분할·임베딩·FAISS 연동
- RAG: 문서 분할 → 임베딩 → VectorDB → 질의 검색 → 근거 표시
- Streamlit: 웹 UI 및 배포

## 실행
```bash
pip install -r requirements.txt
streamlit run app.py
```

교육용 문서 검토 보조 도구이며 법률자문이 아닙니다. 공개 환경에는 실제 개인정보나 영업비밀 문서를 업로드하지 마세요.

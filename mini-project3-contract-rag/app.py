from __future__ import annotations

import io
import re
from typing import List, Sequence

import numpy as np
import streamlit as st
from pypdf import PdfReader
from sklearn.feature_extraction.text import HashingVectorizer
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

AUTHOR = "정성영"
STUDENT_ID = "20242502"
APP_TITLE = "한–베 비즈니스 계약 RAG 검토 도우미"

class MultilingualHashEmbeddings(Embeddings):
    """API 키와 모델 다운로드 없이 작동하는 다국어 문자 n-gram 임베딩."""
    def __init__(self, n_features: int = 4096):
        self.vectorizer = HashingVectorizer(
            analyzer="char_wb", ngram_range=(2, 5), n_features=n_features,
            alternate_sign=False, norm="l2", lowercase=True
        )

    def _encode(self, texts: Sequence[str]) -> List[List[float]]:
        matrix = self.vectorizer.transform(texts)
        return matrix.astype(np.float32).toarray().tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._encode(texts)

    def embed_query(self, text: str) -> List[float]:
        return self._encode([text])[0]

DEMO = """
HỢP ĐỒNG HỢP TÁC / BUSINESS COOPERATION AGREEMENT

Điều 2. Thanh toán / Article 2. Payment
Bên B thanh toán 50% tiền đặt cọc trong vòng 7 ngày kể từ ngày ký. Khoản tiền đặt cọc không được hoàn lại, trừ khi Bên A không thể cung cấp dịch vụ.
Party B shall pay a 50% deposit within seven days of signing. The deposit is non-refundable unless Party A is unable to provide the service.

Điều 3. Gia hạn và chấm dứt / Article 3. Renewal and Termination
Hợp đồng được tự động gia hạn thêm một năm nếu không bên nào thông báo bằng văn bản ít nhất 60 ngày trước ngày hết hạn.
This agreement will automatically renew for one additional year unless either party gives written notice at least 60 days before expiration.

Điều 4. Bảo mật và dữ liệu cá nhân / Article 4. Confidentiality and Personal Data
Hai bên phải bảo mật thông tin khách hàng. Việc chuyển dữ liệu cá nhân ra nước ngoài chỉ được thực hiện khi có căn cứ pháp lý và sự đồng ý cần thiết.
The parties shall protect customer information. Cross-border transfer of personal data is permitted only with a lawful basis and required consent.

Điều 5. Phạt vi phạm / Article 5. Penalty
Bên vi phạm phải trả khoản phạt bằng 20% tổng giá trị hợp đồng và bồi thường toàn bộ thiệt hại phát sinh.
The breaching party shall pay a penalty equal to 20% of the total contract value and indemnify all resulting losses.

Điều 6. Luật áp dụng và trọng tài / Article 6. Governing Law and Arbitration
Hợp đồng được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp được giải quyết tại Trung tâm Trọng tài Quốc tế Việt Nam tại Hà Nội bằng tiếng Việt.
This agreement is governed by Vietnamese law. Disputes shall be resolved by the Vietnam International Arbitration Centre in Hanoi in Vietnamese.
""".strip()

RISK_RULES = {
    "자동 갱신·해지": ["automatic renewal", "tự động gia hạn", "자동 갱신", "unilateral termination"],
    "손해배상·위약금": ["penalty", "indemnify", "phạt vi phạm", "bồi thường", "위약금"],
    "준거법·분쟁해결": ["governing law", "arbitration", "luật áp dụng", "trọng tài", "준거법", "중재"],
    "독점·경업 제한": ["exclusive", "non-compete", "độc quyền", "không cạnh tranh", "독점"],
    "개인정보·비밀유지": ["personal data", "confidential", "dữ liệu cá nhân", "bảo mật", "개인정보"],
    "대금·환불": ["payment", "refund", "deposit", "thanh toán", "hoàn tiền", "tiền đặt cọc", "환불"],
}

CHECK_QUESTIONS = {
    "자동 갱신·해지": "자동 갱신을 거절하려면 언제까지 어떤 방식으로 통지해야 합니까?",
    "손해배상·위약금": "위약금과 손해배상 책임의 상한이 설정되어 있습니까?",
    "준거법·분쟁해결": "적용 법률·중재기관·장소·언어·비용 부담이 감당 가능합니까?",
    "독점·경업 제한": "독점 또는 경업 제한의 지역·기간·상품 범위가 명확합니까?",
    "개인정보·비밀유지": "국외 이전 동의, 보관기간, 파기 절차가 명시되어 있습니까?",
    "대금·환불": "계약금·잔금의 지급 조건과 환불 예외가 객관적으로 정해져 있습니까?",
}

def read_file(uploaded) -> str:
    raw = uploaded.getvalue()
    if uploaded.name.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(raw))
        return "\n".join((page.extract_text() or "") for page in reader.pages)
    for enc in ("utf-8", "utf-8-sig", "cp949", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            pass
    return ""

def split_documents(items):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700, chunk_overlap=120,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    chunks = []
    for source, text in items:
        docs = splitter.split_documents([Document(page_content=text, metadata={"source": source})])
        for idx, doc in enumerate(docs, 1):
            doc.metadata["chunk"] = idx
        chunks.extend(docs)
    return chunks

def detect_risks(text: str):
    lowered = text.lower()
    return {
        category: [word for word in words if word.lower() in lowered]
        for category, words in RISK_RULES.items()
        if any(word.lower() in lowered for word in words)
    }

st.set_page_config(page_title=APP_TITLE, page_icon="📑", layout="wide")
st.title(APP_TITLE)
st.caption(f"Claude Code · LangChain · RAG 기반 다국어 계약 문서 검색 | {AUTHOR} · {STUDENT_ID}")
st.warning("교육용 1차 검토 보조 도구이며 법률자문이 아닙니다. 공개 화면에는 개인정보나 영업비밀 문서를 업로드하지 마세요.")

with st.sidebar:
    st.header("문서 설정")
    use_demo = st.checkbox("영어·베트남어 데모 계약서 사용", True)
    files = st.file_uploader("계약 문서 업로드", type=["pdf", "txt", "md"], accept_multiple_files=True)
    top_k = st.slider("검색 조각 수", 2, 6, 4)
    st.markdown("**지원 언어:** 한국어·베트남어·영어")
    st.markdown("**VectorDB:** FAISS")
    st.markdown("**Embedding:** 다국어 문자 n-gram")

items = [("demo_ko_vi_contract.txt", DEMO)] if use_demo else []
for file in files or []:
    text = read_file(file)
    if text.strip():
        items.append((file.name, text))

if not items:
    st.info("데모 문서를 선택하거나 계약 문서를 업로드하세요.")
    st.stop()

docs = split_documents(items)
vectorstore = FAISS.from_documents(docs, MultilingualHashEmbeddings())
st.success(f"문서 {len(items)}개를 {len(docs)}개 조각으로 분할하여 VectorDB를 구성했습니다.")

query = st.text_input("계약서에 질문하세요", "자동 갱신과 해지 조건을 찾아줘")
if st.button("RAG 검색 및 검토", type="primary", use_container_width=True):
    results = vectorstore.similarity_search_with_score(query, k=top_k)
    combined = "\n".join(doc.page_content for doc, _ in results)
    risks = detect_risks(combined)

    left, right = st.columns([1.35, 1])
    with left:
        st.subheader("1. 근거 기반 검토 요약")
        if results:
            excerpt = re.sub(r"\s+", " ", results[0][0].page_content).strip()
            st.write(f"질문과 가까운 조항을 {len(results)}개 검색했습니다. 가장 관련성이 높은 내용: {excerpt[:450]}{'…' if len(excerpt) > 450 else ''}")
        st.subheader("2. 검색된 원문 근거")
        for rank, (doc, score) in enumerate(results, 1):
            source = doc.metadata.get("source", "문서")
            chunk = doc.metadata.get("chunk", "-")
            with st.expander(f"근거 {rank} · {source} · chunk {chunk}", expanded=(rank == 1)):
                st.code(doc.page_content, language=None)
                st.caption(f"FAISS 거리값: {float(score):.4f} — 낮을수록 질문과 가깝습니다.")
    with right:
        st.subheader("3. 위험 신호")
        if risks:
            for category, words in risks.items():
                st.markdown(f"**{category}**")
                st.caption("탐지 표현: " + ", ".join(words[:4]))
        else:
            st.info("등록된 위험 키워드와 일치하는 표현이 없습니다.")
        st.subheader("4. 상대방에게 확인할 질문")
        for idx, category in enumerate(risks, 1):
            st.write(f"{idx}. {CHECK_QUESTIONS.get(category, category + ' 조건을 확인하세요.')}")
        st.subheader("5. 판단 범위")
        st.write("실제 계약 체결 전에는 한국·베트남의 자격 있는 전문가에게 준거법, 세무, 개인정보, 외환 및 분쟁해결 조항을 확인해야 합니다.")

with st.expander("단순 번역기와 다른 점"):
    st.markdown("- 질문 언어와 문서 언어가 달라도 VectorDB에서 관련 조항을 검색합니다.\n- 위험 신호와 확인 질문을 생성합니다.\n- 원문 조각과 문서명을 근거로 표시합니다.")

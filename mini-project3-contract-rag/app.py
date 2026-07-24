from __future__ import annotations

import io
import re
from typing import Dict, List, Sequence, Tuple

import numpy as np
import streamlit as st
from deep_translator import GoogleTranslator
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
            analyzer="char_wb",
            ngram_range=(2, 5),
            n_features=n_features,
            alternate_sign=False,
            norm="l2",
            lowercase=True,
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
    "자동 갱신·해지": ["automatic renewal", "tự động gia hạn", "자동 갱신", "unilateral termination", "chấm dứt"],
    "손해배상·위약금": ["penalty", "indemnify", "phạt vi phạm", "bồi thường", "위약금"],
    "준거법·분쟁해결": ["governing law", "arbitration", "luật áp dụng", "trọng tài", "준거법", "중재"],
    "독점·경업 제한": ["exclusive", "non-compete", "độc quyền", "không cạnh tranh", "독점"],
    "개인정보·비밀유지": ["personal data", "confidential", "dữ liệu cá nhân", "bảo mật", "개인정보"],
    "대금·환불": ["payment", "refund", "deposit", "thanh toán", "hoàn tiền", "tiền đặt cọc", "환불"],
    "폐업·청산 절차": ["dissolution", "liquidation", "giải thể", "thanh lý", "폐업", "청산"],
}

CHECK_QUESTIONS = {
    "자동 갱신·해지": "자동 갱신을 거절하거나 계약을 종료하려면 언제까지 어떤 방식으로 통지해야 합니까?",
    "손해배상·위약금": "위약금과 손해배상 책임의 상한이 설정되어 있습니까?",
    "준거법·분쟁해결": "적용 법률·중재기관·장소·언어·비용 부담이 감당 가능합니까?",
    "독점·경업 제한": "독점 또는 경업 제한의 지역·기간·상품 범위가 명확합니까?",
    "개인정보·비밀유지": "국외 이전 동의, 보관기간, 파기 절차가 명시되어 있습니까?",
    "대금·환불": "계약금·잔금의 지급 조건과 환불 예외가 객관적으로 정해져 있습니까?",
    "폐업·청산 절차": "폐업·청산에 필요한 서류, 비용, 책임자, 처리 기한이 명확합니까?",
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


def split_documents(items: List[Tuple[str, str]]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=120,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks: List[Document] = []
    for source, text in items:
        docs = splitter.split_documents(
            [Document(page_content=text, metadata={"source": source})]
        )
        for idx, doc in enumerate(docs, 1):
            doc.metadata["chunk"] = idx
        chunks.extend(docs)
    return chunks


def detect_risks(text: str) -> Dict[str, List[str]]:
    lowered = text.lower()
    return {
        category: [word for word in words if word.lower() in lowered]
        for category, words in RISK_RULES.items()
        if any(word.lower() in lowered for word in words)
    }


def split_translation_blocks(text: str, max_chars: int = 3000) -> List[str]:
    cleaned = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not cleaned:
        return []
    blocks: List[str] = []
    current = ""
    for paragraph in cleaned.split("\n"):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        candidate = f"{current}\n{paragraph}".strip()
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                blocks.append(current)
            if len(paragraph) <= max_chars:
                current = paragraph
            else:
                for start in range(0, len(paragraph), max_chars):
                    blocks.append(paragraph[start : start + max_chars])
                current = ""
    if current:
        blocks.append(current)
    return blocks


@st.cache_data(show_spinner=False)
def translate_text(text: str, target: str = "ko") -> str:
    """Google 번역 연결을 사용해 텍스트를 번역한다. 실패하면 빈 문자열을 반환한다."""
    translated: List[str] = []
    for block in split_translation_blocks(text):
        try:
            translated.append(
                GoogleTranslator(source="auto", target=target).translate(block)
            )
        except Exception:
            return ""
    return "\n\n".join(translated).strip()


@st.cache_data(show_spinner=False)
def build_query_variants(query: str) -> List[str]:
    """한국어 질문을 베트남어·영어로 함께 변환해 교차언어 검색 정확도를 높인다."""
    variants = [query]
    for lang in ("vi", "en"):
        translated = translate_text(query, target=lang)
        if translated and translated not in variants:
            variants.append(translated)
    return variants


def multilingual_search(vectorstore: FAISS, query: str, k: int):
    merged = {}
    for variant in build_query_variants(query):
        for doc, score in vectorstore.similarity_search_with_score(variant, k=k):
            key = (doc.metadata.get("source"), doc.metadata.get("chunk"))
            if key not in merged or score < merged[key][1]:
                merged[key] = (doc, score)
    return sorted(merged.values(), key=lambda item: item[1])[:k]


def is_overview_query(query: str) -> bool:
    normalized = re.sub(r"\s+", "", query.lower())
    overview_terms = [
        "무슨내용",
        "문서내용",
        "전체내용",
        "요약",
        "어떤문서",
        "무엇에관한",
        "핵심내용",
    ]
    return any(term in normalized for term in overview_terms)


def make_korean_bullets(korean_text: str, max_points: int = 5) -> List[str]:
    cleaned = re.sub(r"\s+", " ", korean_text).strip()
    if not cleaned:
        return []
    sentences = [
        sentence.strip(" -•")
        for sentence in re.split(r"(?<=[.!?])\s+|(?<=다\.)\s+", cleaned)
        if len(sentence.strip()) >= 20
    ]
    priority_words = [
        "폐업",
        "해산",
        "청산",
        "계약",
        "종료",
        "해지",
        "서류",
        "비용",
        "지급",
        "환불",
        "세금",
        "기한",
        "책임",
        "요청",
    ]
    prioritized = [
        sentence for sentence in sentences if any(word in sentence for word in priority_words)
    ]
    ordered = prioritized + [sentence for sentence in sentences if sentence not in prioritized]
    unique: List[str] = []
    for sentence in ordered:
        if sentence not in unique:
            unique.append(sentence)
        if len(unique) >= max_points:
            break
    return unique


st.set_page_config(page_title=APP_TITLE, page_icon="📑", layout="wide")
st.title(APP_TITLE)
st.caption(
    f"Claude Code · LangChain · RAG 기반 다국어 계약 문서 검색 | {AUTHOR} · {STUDENT_ID}"
)
st.warning(
    "교육용 1차 검토 보조 도구이며 법률자문이 아닙니다. "
    "개인정보·서명·계좌번호·영업비밀은 가린 뒤 업로드하세요."
)
st.info(
    "한국어 번역 기능은 외부 번역 서비스로 검색된 문장 일부를 전송할 수 있습니다. "
    "기밀 문서에는 사용하지 마세요."
)

with st.sidebar:
    st.header("문서 설정")
    use_demo = st.checkbox("업로드 문서가 없을 때 영어·베트남어 데모 사용", True)
    files = st.file_uploader(
        "계약 문서 업로드",
        type=["pdf", "txt", "md"],
        accept_multiple_files=True,
    )
    top_k = st.slider("검색 조각 수", 2, 6, 4)
    show_original = st.checkbox("베트남어·영어 원문도 펼쳐서 표시", False)
    st.markdown("**출력 언어:** 한국어")
    st.markdown("**지원 문서:** 한국어·베트남어·영어")
    st.markdown("**VectorDB:** FAISS")
    st.markdown("**Embedding:** 다국어 문자 n-gram + 질문 번역 검색")

# 실제 문서가 업로드되면 데모 문서는 자동 제외한다.
items: List[Tuple[str, str]] = []
for file in files or []:
    text = read_file(file)
    if text.strip():
        items.append((file.name, text))

if not items and use_demo:
    items = [("demo_ko_vi_contract.txt", DEMO)]

if not items:
    st.info("계약 문서를 업로드하거나 데모 문서를 선택하세요.")
    st.stop()

docs = split_documents(items)
vectorstore = FAISS.from_documents(docs, MultilingualHashEmbeddings())
st.success(
    f"문서 {len(items)}개를 {len(docs)}개 조각으로 분할하여 VectorDB를 구성했습니다. "
    "업로드 문서가 있으면 데모 문서는 자동 제외됩니다."
)

query = st.text_input(
    "계약서에 한국어로 질문하세요",
    "이 문서는 무슨 내용이며 내가 확인해야 할 사항은 무엇이야?",
)

if st.button("한국어 RAG 검색 및 검토", type="primary", use_container_width=True):
    with st.spinner("관련 문서를 검색하고 한국어로 변환하는 중입니다..."):
        if is_overview_query(query):
            selected_docs = docs[: min(len(docs), 8)]
            results = [(doc, 0.0) for doc in selected_docs]
        else:
            results = multilingual_search(vectorstore, query, k=top_k)

        combined_original = "\n\n".join(doc.page_content for doc, _ in results)
        korean_combined = translate_text(combined_original[:12000], target="ko")
        risks = detect_risks(combined_original)

    if not korean_combined:
        st.error(
            "한국어 번역 연결에 실패했습니다. 잠시 후 다시 시도하거나 "
            "민감정보를 제거한 짧은 문서로 테스트하세요."
        )

    left, right = st.columns([1.35, 1])

    with left:
        st.subheader("1. 한국어 핵심 요약")
        bullets = make_korean_bullets(korean_combined)
        if bullets:
            for bullet in bullets:
                st.markdown(f"- {bullet}")
        elif korean_combined:
            st.write(korean_combined[:1200])
        else:
            st.info("한국어 요약을 생성하지 못했습니다.")

        st.subheader("2. 한국어로 확인한 검색 근거")
        for rank, (doc, score) in enumerate(results, 1):
            source = doc.metadata.get("source", "문서")
            chunk = doc.metadata.get("chunk", "-")
            korean_chunk = translate_text(doc.page_content, target="ko")
            with st.expander(
                f"근거 {rank} · {source} · 조각 {chunk}",
                expanded=(rank == 1),
            ):
                if korean_chunk:
                    st.markdown("**한국어 번역**")
                    st.write(korean_chunk)
                else:
                    st.warning("이 조각은 한국어 번역에 실패했습니다.")

                if show_original:
                    st.markdown("**원문**")
                    st.code(doc.page_content, language=None)

                if score:
                    st.caption(
                        f"FAISS 거리값: {float(score):.4f} — 낮을수록 질문과 가깝습니다."
                    )

    with right:
        st.subheader("3. 확인이 필요한 위험 신호")
        if risks:
            for category, words in risks.items():
                st.markdown(f"**{category}**")
                st.caption("원문 탐지 표현: " + ", ".join(words[:4]))
        else:
            st.info("등록된 위험 키워드와 일치하는 표현이 없습니다.")

        st.subheader("4. 상대방 또는 전문가에게 확인할 질문")
        if risks:
            for idx, category in enumerate(risks, 1):
                st.write(
                    f"{idx}. {CHECK_QUESTIONS.get(category, category + ' 조건을 확인하세요.')}"
                )
        else:
            st.write("1. 이 문서의 목적, 효력, 처리 기한과 담당자를 확인하세요.")
            st.write("2. 비용·세금·환불·책임 조항이 있는지 전문가에게 확인하세요.")

        st.subheader("5. 판단 범위")
        st.write(
            "이 결과는 검색된 문장을 한국어로 옮겨 확인하기 위한 교육용 보조 결과입니다. "
            "실제 폐업·청산·계약 체결 전에는 한국·베트남의 자격 있는 전문가에게 "
            "법률, 세무, 개인정보, 외환 및 분쟁해결 사항을 확인해야 합니다."
        )

with st.expander("단순 번역기와 다른 점"):
    st.markdown(
        "- 한국어 질문을 베트남어와 영어로 함께 변환해 관련 조항을 검색합니다.\n"
        "- 검색된 베트남어·영어 근거를 한국어로 표시합니다.\n"
        "- 위험 신호와 확인 질문을 별도로 제공합니다.\n"
        "- 업로드 문서가 있으면 데모 문서를 자동 제외합니다."
    )

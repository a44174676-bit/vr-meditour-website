from __future__ import annotations

import io
import re
from dataclasses import dataclass
from typing import Any, Iterable, List, Sequence

import numpy as np
from pypdf import PdfReader
from sklearn.feature_extraction.text import HashingVectorizer

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

MAX_FULL_CONTEXT_CHARS = 90_000
MAX_RETRIEVED_CONTEXT_CHARS = 45_000

DEMO_DOCUMENT = """
HỢP ĐỒNG HỢP TÁC / BUSINESS COOPERATION AGREEMENT

Điều 1. Mục đích / Article 1. Purpose
Hai bên hợp tác phát triển chương trình du lịch y tế giữa Việt Nam và Hàn Quốc.
The parties cooperate to develop a medical tourism program between Vietnam and Korea.

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


class MultilingualHashEmbeddings(Embeddings):
    """API 키나 대형 모델 다운로드 없이 사용하는 문자 n-gram 검색 임베딩."""

    def __init__(self, n_features: int = 8192) -> None:
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


@dataclass(frozen=True)
class LoadedFile:
    name: str
    documents: List[Document]
    character_count: int


def read_pdf(uploaded_file: Any) -> LoadedFile:
    reader = PdfReader(io.BytesIO(uploaded_file.getvalue()))
    page_docs: List[Document] = []
    total_chars = 0
    for page_number, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if not text:
            continue
        total_chars += len(text)
        page_docs.append(
            Document(
                page_content=text,
                metadata={
                    "source": uploaded_file.name,
                    "page": page_number,
                    "document_type": "pdf",
                },
            )
        )
    return LoadedFile(uploaded_file.name, page_docs, total_chars)


def read_text_file(uploaded_file: Any) -> LoadedFile:
    raw = uploaded_file.getvalue()
    decoded = ""
    for encoding in ("utf-8", "utf-8-sig", "cp949", "latin-1"):
        try:
            decoded = raw.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    decoded = decoded.strip()
    docs: List[Document] = []
    if decoded:
        docs = [
            Document(
                page_content=decoded,
                metadata={
                    "source": uploaded_file.name,
                    "page": 1,
                    "document_type": "text",
                },
            )
        ]
    return LoadedFile(uploaded_file.name, docs, len(decoded))


def load_uploaded_file(uploaded_file: Any) -> LoadedFile:
    if uploaded_file.name.lower().endswith(".pdf"):
        return read_pdf(uploaded_file)
    return read_text_file(uploaded_file)


def split_documents(base_documents: Iterable[Document]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1_100,
        chunk_overlap=180,
        separators=["\n\n", "\n", ". ", "。", "; ", " ", ""],
    )
    chunks: List[Document] = []
    chunk_counter_by_source: dict[str, int] = {}
    for base_document in base_documents:
        source = str(base_document.metadata.get("source", "문서"))
        for doc in splitter.split_documents([base_document]):
            chunk_counter_by_source[source] = chunk_counter_by_source.get(source, 0) + 1
            doc.metadata["chunk"] = chunk_counter_by_source[source]
            chunks.append(doc)
    return chunks


def build_vectorstore(chunks: List[Document]) -> FAISS:
    return FAISS.from_documents(chunks, MultilingualHashEmbeddings())


def search_documents(
    vectorstore: FAISS,
    variants: Sequence[str],
    k: int,
) -> List[tuple[Document, float]]:
    merged: dict[tuple[str, int, int], tuple[Document, float]] = {}
    for variant in variants:
        for doc, score in vectorstore.similarity_search_with_score(variant, k=k):
            key = (
                str(doc.metadata.get("source", "문서")),
                int(doc.metadata.get("page", 0) or 0),
                int(doc.metadata.get("chunk", 0) or 0),
            )
            if key not in merged or score < merged[key][1]:
                merged[key] = (doc, float(score))
    return sorted(merged.values(), key=lambda item: item[1])[:k]


def is_overview_question(question: str) -> bool:
    compact = re.sub(r"\s+", "", question.lower())
    keywords = (
        "무슨내용",
        "어떤내용",
        "전체요약",
        "문서요약",
        "무슨문서",
        "어떤문서",
        "핵심내용",
        "내가해야할",
        "우리법인이해야할",
        "목적이뭐",
    )
    return any(keyword in compact for keyword in keywords)


def unique_documents(docs: Sequence[Document]) -> List[Document]:
    seen: set[tuple[str, int, int]] = set()
    result: List[Document] = []
    for doc in docs:
        key = (
            str(doc.metadata.get("source", "문서")),
            int(doc.metadata.get("page", 0) or 0),
            int(doc.metadata.get("chunk", 0) or 0),
        )
        if key not in seen:
            seen.add(key)
            result.append(doc)
    return result


def select_context_documents(
    chunks: List[Document],
    retrieved: List[tuple[Document, float]],
    overview: bool,
) -> List[Document]:
    if overview:
        selected = chunks
        max_chars = MAX_FULL_CONTEXT_CHARS
    else:
        first_chunks: List[Document] = []
        seen_sources: set[str] = set()
        for chunk in chunks:
            source = str(chunk.metadata.get("source", "문서"))
            if source not in seen_sources:
                first_chunks.append(chunk)
                seen_sources.add(source)
        selected = first_chunks + [doc for doc, _ in retrieved]
        max_chars = MAX_RETRIEVED_CONTEXT_CHARS

    final_docs: List[Document] = []
    used_chars = 0
    for doc in unique_documents(selected):
        length = len(doc.page_content)
        if final_docs and used_chars + length > max_chars:
            break
        final_docs.append(doc)
        used_chars += length
    return final_docs


def context_block(documents: Sequence[Document]) -> str:
    blocks: List[str] = []
    for doc in documents:
        source = str(doc.metadata.get("source", "문서"))
        page = doc.metadata.get("page", "-")
        chunk = doc.metadata.get("chunk", "-")
        blocks.append(
            f"[SOURCE={source} | PAGE={page} | CHUNK={chunk}]\n{doc.page_content.strip()}"
        )
    return "\n\n---\n\n".join(blocks)

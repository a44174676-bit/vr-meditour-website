"""
한-베 비즈니스 문서 RAG 분석 도우미
성명: 정성영 | 학번: 20242502
"""

from __future__ import annotations

from typing import Any, List

import streamlit as st
from langchain_core.documents import Document

from claude_analysis import (
    DEFAULT_MODEL,
    ClaudeAPIError,
    analyze_with_claude,
    create_query_variants,
)
from document_pipeline import (
    DEMO_DOCUMENT,
    LoadedFile,
    build_vectorstore,
    is_overview_question,
    load_uploaded_file,
    search_documents,
    select_context_documents,
    split_documents,
)

APP_TITLE = "한-베 비즈니스 문서 RAG 분석 도우미"
AUTHOR = "정성영"
STUDENT_ID = "20242502"


def get_secret(name: str, default: str = "") -> str:
    try:
        value = st.secrets.get(name, default)
        return str(value).strip() if value else default
    except Exception:
        return default


def safe_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def display_analysis(result: dict[str, Any]) -> None:
    identity = result.get("document_identity")
    identity = identity if isinstance(identity, dict) else {}

    st.subheader("1. 이 문서는 무엇인가")
    st.success(str(identity.get("one_sentence_summary", "분석 결과를 확인하지 못했습니다.")))

    identity_cols = st.columns(4)
    identity_cols[0].metric("문서 유형", str(identity.get("document_type", "확인 불가")))
    identity_cols[1].metric("발신자", str(identity.get("sender", "확인 불가")))
    identity_cols[2].metric("수신자", str(identity.get("recipient", "확인 불가")))
    identity_cols[3].metric("문서 날짜", str(identity.get("date", "확인 불가")))

    st.subheader("2. 질문에 대한 답")
    st.write(str(result.get("answer_to_question", "답변을 생성하지 못했습니다.")))
    purpose = str(result.get("purpose", "")).strip()
    if purpose:
        st.markdown("**문서의 목적**")
        st.write(purpose)

    left, right = st.columns([1.15, 1])
    with left:
        st.subheader("3. 핵심 사실")
        facts = safe_list(result.get("key_facts"))
        if not facts:
            st.info("확정적으로 정리할 핵심 사실을 찾지 못했습니다.")
        for item in facts:
            if isinstance(item, dict):
                st.markdown(f"- {item.get('fact', '')}")
                ids = safe_list(item.get("evidence_ids"))
                if ids:
                    st.caption("근거: " + ", ".join(map(str, ids)))

        st.subheader("4. 우리 법인이 할 일")
        actions = safe_list(result.get("actions_for_company"))
        if not actions:
            st.info("문서 근거만으로 구체적 행동을 확정하기 어렵습니다.")
        for index, item in enumerate(actions, start=1):
            if not isinstance(item, dict):
                continue
            st.markdown(
                f"**{index}. [{item.get('priority', '확인')}] {item.get('action', '')}**"
            )
            if item.get("reason"):
                st.write(str(item.get("reason")))
            ids = safe_list(item.get("evidence_ids"))
            if ids:
                st.caption("근거: " + ", ".join(map(str, ids)))

    with right:
        st.subheader("5. 위험 및 불명확 사항")
        risks = safe_list(result.get("risks_and_limits"))
        if not risks:
            st.info("원문 근거에서 별도 위험을 확정하지 못했습니다.")
        for item in risks:
            if isinstance(item, dict):
                st.markdown(f"**[{item.get('level', '확인필요')}] {item.get('item', '')}**")
                if item.get("why"):
                    st.write(str(item.get("why")))

        st.subheader("6. 추가로 확인할 질문")
        for index, question in enumerate(safe_list(result.get("questions_to_confirm")), start=1):
            st.write(f"{index}. {question}")

        st.subheader("7. 이 문서만으로 증명되지 않는 것")
        unproven = safe_list(result.get("what_this_document_does_not_prove"))
        if not unproven:
            st.info("별도 기재 없음")
        for item in unproven:
            st.markdown(f"- {item}")

    st.subheader("8. 원문 근거")
    evidence = safe_list(result.get("evidence"))
    if not evidence:
        st.warning("근거 목록이 생성되지 않았습니다. 결과를 확정적으로 사용하지 마세요.")
    for index, item in enumerate(evidence, start=1):
        if not isinstance(item, dict):
            continue
        source = str(item.get("source", "문서"))
        page = str(item.get("page", "-"))
        chunk = str(item.get("chunk", "-"))
        with st.expander(f"근거 {index} · {source} · 페이지 {page} · 조각 {chunk}"):
            if item.get("korean_explanation"):
                st.markdown("**한국어 의미**")
                st.write(str(item.get("korean_explanation")))
            if item.get("original_quote"):
                st.markdown("**원문 인용**")
                st.code(str(item.get("original_quote")), language=None)

    st.caption("분석 신뢰도: " + str(result.get("confidence", "확인 불가")))
    limitations = safe_list(result.get("limitations"))
    if limitations:
        with st.expander("분석 한계"):
            for item in limitations:
                st.markdown(f"- {item}")


st.set_page_config(page_title=APP_TITLE, page_icon="📑", layout="wide")
st.title(APP_TITLE)
st.caption(f"Claude Code · LangChain · FAISS · Claude 근거 기반 생성 | {AUTHOR} · {STUDENT_ID}")
st.warning(
    "문서 이해와 확인사항 정리를 위한 교육용 보조 도구이며 법률자문이 아닙니다. "
    "서명, 계좌번호, 여권번호, 고객정보, 영업비밀은 가린 뒤 업로드하세요."
)

with st.sidebar:
    st.header("분석 설정")
    uploaded_files = st.file_uploader(
        "PDF·TXT·MD 문서 업로드",
        type=["pdf", "txt", "md"],
        accept_multiple_files=True,
        help="스캔 PDF는 텍스트를 읽지 못할 수 있습니다.",
    )
    use_demo = st.checkbox("업로드 문서가 없을 때 데모 사용", value=True)
    retrieval_k = st.slider("RAG 검색 조각 수", 4, 12, 8)
    st.divider()

    configured_key = get_secret("ANTHROPIC_API_KEY")
    session_key = st.text_input(
        "Anthropic API 키",
        type="password",
        help="입력한 키는 현재 세션에서만 사용합니다. Streamlit Secrets 등록을 권장합니다.",
    )
    api_key = configured_key or session_key.strip()
    model = get_secret("ANTHROPIC_MODEL", DEFAULT_MODEL)

    st.markdown("**출력 언어:** 한국어")
    st.markdown("**검색:** LangChain + FAISS")
    st.markdown(f"**생성 모델:** `{model}`")
    if configured_key:
        st.success("Streamlit Secrets의 API 키가 연결되어 있습니다.")
    elif session_key:
        st.info("현재 세션에 입력한 API 키를 사용합니다.")
    else:
        st.error("실제 한국어 분석을 위해 Anthropic API 키가 필요합니다.")

base_documents: List[Document] = []
file_summaries: List[LoadedFile] = []
for uploaded_file in uploaded_files or []:
    try:
        loaded = load_uploaded_file(uploaded_file)
        file_summaries.append(loaded)
        base_documents.extend(loaded.documents)
    except Exception as exc:
        st.error(f"{uploaded_file.name}을 읽지 못했습니다: {exc}")

if not base_documents and use_demo:
    base_documents = [
        Document(
            page_content=DEMO_DOCUMENT,
            metadata={"source": "demo_ko_vi_contract.txt", "page": 1, "document_type": "text"},
        )
    ]
    file_summaries = [LoadedFile("demo_ko_vi_contract.txt", base_documents, len(DEMO_DOCUMENT))]

if not base_documents:
    st.info("분석할 문서를 업로드하세요.")
    st.stop()

with st.expander("읽은 문서 확인", expanded=False):
    for loaded in file_summaries:
        st.write(
            f"- {loaded.name}: 텍스트 {loaded.character_count:,}자, "
            f"읽은 페이지/구역 {len(loaded.documents)}개"
        )
        if loaded.character_count == 0:
            st.warning(f"{loaded.name}에서 텍스트를 읽지 못했습니다. OCR이 필요할 수 있습니다.")

chunks = split_documents(base_documents)
if not chunks:
    st.error("문서에서 검색 가능한 텍스트를 찾지 못했습니다.")
    st.stop()

vectorstore = build_vectorstore(chunks)
st.success(
    f"문서 {len(file_summaries)}개를 {len(chunks)}개 근거 조각으로 구성했습니다. "
    "업로드 문서가 있으면 데모는 포함되지 않습니다."
)

question = st.text_area(
    "한국어로 질문하세요",
    value="이 문서는 무슨 내용이며, 우리 법인이 지금 확인하거나 해야 할 일은 무엇인가?",
    height=90,
)
consent = st.checkbox("선택된 문서 근거가 Claude API로 전송되는 것에 동의합니다.")

if st.button("근거 기반 한국어 분석", type="primary", use_container_width=True):
    if not api_key:
        st.error("Anthropic API 키를 입력하거나 Streamlit Secrets에 등록해야 분석이 작동합니다.")
        st.stop()
    if not consent:
        st.error("외부 API 전송 동의를 확인해야 분석할 수 있습니다.")
        st.stop()
    if not question.strip():
        st.error("질문을 입력하세요.")
        st.stop()

    try:
        overview = is_overview_question(question)
        with st.status("문서를 분석하고 있습니다...", expanded=True) as status:
            if overview:
                status.write("전체 문서의 목적과 후속 조치를 분석합니다.")
                retrieved: List[tuple[Document, float]] = []
            else:
                status.write("질문을 한국어·베트남어·영어 검색어로 확장합니다.")
                variants = create_query_variants(api_key, model, question)
                status.write("FAISS 근거 검색: " + " / ".join(variants))
                retrieved = search_documents(vectorstore, variants, retrieval_k)

            context_docs = select_context_documents(chunks, retrieved, overview)
            status.write(f"선정된 근거 {len(context_docs)}개를 Claude가 한국어로 구조화합니다.")
            result = analyze_with_claude(api_key, model, question, context_docs)
            status.update(label="분석 완료", state="complete", expanded=False)
        display_analysis(result)

    except ClaudeAPIError as exc:
        message = str(exc)
        if "HTTP 401" in message:
            st.error("Anthropic API 키가 올바르지 않습니다.")
        elif "HTTP 429" in message:
            st.error("API 사용 한도 또는 속도 제한에 걸렸습니다. 잠시 후 다시 시도하세요.")
        else:
            st.error(f"Claude API 호출 오류: {message}")
    except Exception as exc:
        st.error(f"분석 중 오류가 발생했습니다: {exc}")

with st.expander("단순 번역기와 다른 점"):
    st.markdown(
        "- LangChain으로 문서를 페이지·조각 단위로 나누고 FAISS에서 근거를 검색합니다.\n"
        "- Claude는 검색된 근거만 사용해 문서의 정체, 목적, 핵심 사실을 한국어로 설명합니다.\n"
        "- 우리 법인이 할 일, 아직 증명되지 않은 사항, 확인 질문을 분리합니다.\n"
        "- 각 결론에 파일명·페이지·조각과 원문 인용을 붙입니다."
    )

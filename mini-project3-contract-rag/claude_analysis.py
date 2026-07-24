from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from typing import Any, List, Sequence

from langchain_core.documents import Document

from document_pipeline import context_block

DEFAULT_MODEL = "claude-sonnet-4-20250514"


class ClaudeAPIError(RuntimeError):
    """Anthropic Messages API 호출 오류."""


def claude_text(
    api_key: str,
    model: str,
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 3_500,
) -> str:
    payload = {
        "model": model,
        "max_tokens": max_tokens,
        "temperature": 0,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_prompt}],
    }
    request = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "content-type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ClaudeAPIError(f"HTTP {exc.code}: {detail[:500]}") from exc
    except urllib.error.URLError as exc:
        raise ClaudeAPIError(f"네트워크 오류: {exc.reason}") from exc

    blocks = body.get("content", [])
    texts = [
        str(block.get("text", ""))
        for block in blocks
        if isinstance(block, dict) and block.get("type") == "text"
    ]
    text = "\n".join(texts).strip()
    if not text:
        raise ClaudeAPIError("Claude 응답에 텍스트가 없습니다.")
    return text


def extract_json_object(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end > start:
        parsed = json.loads(cleaned[start : end + 1])
        if isinstance(parsed, dict):
            return parsed
    raise ValueError("Claude 응답에서 JSON 객체를 읽지 못했습니다.")


def create_query_variants(api_key: str, model: str, question: str) -> List[str]:
    system_prompt = (
        "You generate search queries for a multilingual Korean-Vietnamese-English RAG system. "
        "Return only a JSON array of three short strings in this order: Korean, Vietnamese, English."
    )
    user_prompt = (
        "다음 한국어 질문의 의미를 유지하면서 계약·공문 검색에 적합한 짧은 검색어로 바꾸세요. "
        "설명 없이 JSON 배열만 출력하세요.\n\n질문: " + question
    )
    try:
        raw = claude_text(api_key, model, system_prompt, user_prompt, max_tokens=300)
        match = re.search(r"\[[\s\S]*\]", raw)
        if not match:
            return [question]
        values = json.loads(match.group(0))
        return [str(value).strip() for value in values if str(value).strip()][:3] or [question]
    except Exception:
        return [question]


def analysis_schema_instruction() -> str:
    return """
반드시 아래 JSON 구조만 출력하세요. 마크다운 코드블록을 쓰지 마세요.
{
  "document_identity": {
    "document_type": "문서 유형",
    "sender": "발신자 또는 확인 불가",
    "recipient": "수신자 또는 확인 불가",
    "date": "날짜 또는 확인 불가",
    "one_sentence_summary": "쉬운 한국어 한 문장 요약"
  },
  "answer_to_question": "사용자 질문에 대한 명확하고 쉬운 한국어 답변",
  "purpose": "이 문서가 작성된 실제 목적",
  "key_facts": [
    {"fact": "핵심 사실", "evidence_ids": ["파일명|페이지|조각"]}
  ],
  "actions_for_company": [
    {"priority": "즉시|다음|확인", "action": "우리 법인이 할 일", "reason": "이유", "evidence_ids": ["파일명|페이지|조각"]}
  ],
  "risks_and_limits": [
    {"level": "높음|중간|낮음|확인필요", "item": "위험 또는 불명확 사항", "why": "근거와 의미", "evidence_ids": ["파일명|페이지|조각"]}
  ],
  "questions_to_confirm": ["상대방·변호사·세무사 등에게 확인할 구체적 질문"],
  "what_this_document_does_not_prove": ["이 문서만으로 확인할 수 없는 사항"],
  "evidence": [
    {"id": "파일명|페이지|조각", "source": "파일명", "page": "페이지", "chunk": "조각", "original_quote": "원문 1~2문장", "korean_explanation": "원문의 쉬운 한국어 의미"}
  ],
  "confidence": "높음|중간|낮음",
  "limitations": ["분석 한계"]
}
""".strip()


def analyze_with_claude(
    api_key: str,
    model: str,
    question: str,
    documents: Sequence[Document],
) -> dict[str, Any]:
    system_prompt = """
당신은 한국-베트남 비즈니스 문서 분석 보조자입니다.
검색된 원문 근거만 사용하여 한국어로 설명합니다.

원칙:
1. 번역 문장을 나열하지 말고 문서의 정체, 목적, 핵심 사실, 사용자가 할 일을 먼저 설명합니다.
2. 원문에 없는 사실을 만들지 않습니다. 불명확하면 반드시 '확인 불가' 또는 '추가 확인 필요'라고 씁니다.
3. 법률적 유효성, 폐업 완료, 세무 종결, 계약 해지 완료를 문서가 직접 증명하지 않으면 완료됐다고 말하지 않습니다.
4. 주소, 이메일, 머리말 같은 형식정보는 핵심 사실로 취급하지 않습니다.
5. 사용자가 비전문가라고 가정하고 쉬운 한국어를 사용합니다.
6. 모든 중요한 결론에 evidence_ids를 붙입니다.
7. evidence에는 실제 제공된 SOURCE, PAGE, CHUNK만 사용합니다.
8. 이 도구는 법률자문이 아니라 문서 이해와 확인사항 정리 도구입니다.
""".strip()

    prompt = f"""
사용자 질문:
{question}

검색·선정된 문서 근거:
{context_block(documents)}

작업:
- 사용자 질문에 직접 답하세요.
- 문서가 무엇인지 한 문장으로 먼저 설명하세요.
- 우리 법인이 지금 해야 할 일과 아직 증명되지 않은 사항을 분리하세요.
- 원문 인용은 짧게 사용하세요.

{analysis_schema_instruction()}
""".strip()

    raw = claude_text(api_key, model, system_prompt, prompt, max_tokens=4_500)
    try:
        return extract_json_object(raw)
    except Exception:
        repair_prompt = (
            "다음 응답을 내용 손실 없이 요청된 JSON 구조로 고치세요. "
            "원문에 없던 사실은 추가하지 마세요.\n\n"
            + raw
            + "\n\n"
            + analysis_schema_instruction()
        )
        repaired = claude_text(
            api_key,
            model,
            "Return only valid JSON. Do not add markdown or explanations.",
            repair_prompt,
            max_tokens=4_500,
        )
        return extract_json_object(repaired)

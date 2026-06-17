"""Step 8c — RAGAS 표준 4 메트릭 + vLLM (Qwen2.5-32B-Instruct-AWQ).

vLLM 은 OpenAI compatible API 제공 → RAGAS 가 ChatOpenAI 그대로 사용.
PagedAttention + Continuous Batching 으로 Ollama 대비 5-10x throughput.

사전 셋업:
  vllm serve Qwen/Qwen2.5-32B-Instruct-AWQ \\
    --port 8001 --max-model-len 8192 \\
    --gpu-memory-utilization 0.6   # ai-server Ollama 와 공존

입력:
  data/responses/cell{1-4}.jsonl

출력:
  data/results/ragas_vllm_scores.csv
  data/results/ragas_vllm_summary.md

주의:
  RAGAS 표준 메트릭 구현은 유지하되, reference 는 평가 가능한 자연어 정답문으로 변환한다.
  예: ground_truth="F" → "거짓입니다. ... 실제 거주지는 인천 부평구입니다."
  한국어 단답에서 Faithfulness statement extraction 이 빈 결과를 내는 문제를 막기 위해
  RAGAS PydanticPrompt 만 한국어 예시로 localize 할 수 있다.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
from pathlib import Path

import pandas as pd
import yaml
from dotenv import load_dotenv
from langchain_core.outputs import Generation, LLMResult

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT.parent / ".env")
os.environ.setdefault("RAGAS_DO_NOT_TRACK", "true")

RESPONSES_DIR = ROOT / "data" / "responses"
SCENARIOS_CSV = ROOT / "data" / "scenarios" / "phase1.csv"
PERSONA_DIR = ROOT / "data" / "personas"
RESULTS_DIR = ROOT / "data" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

VLLM_BASE_URL = os.getenv("VLLM_BASE_URL", "http://127.0.0.1:8001/v1")
JUDGE_MODEL = os.getenv("VLLM_JUDGE_MODEL", "Qwen/Qwen2.5-32B-Instruct-AWQ")
EMBED_MODEL = "BAAI/bge-m3"

KG_LABELS = {
    "name": "이름",
    "residence": "거주지",
    "occupation": "직업",
    "education": "최종 학력",
    "marriage": "결혼 정보",
    "children": "자녀 정보",
    "health": "건강 정보",
    "preferences": "선호 정보",
}


def _clean_location(province: str, district: str) -> str:
    """KG 의 '인천-부평구' 같은 district 를 발표용 정답 문자열로 정리."""
    district = str(district)
    if "-" in district:
        district = district.split("-")[-1]
    return f"{province} {district}".strip()


def _load_scenario_meta() -> dict[str, dict]:
    df = pd.read_csv(SCENARIOS_CSV, encoding="utf-8-sig")
    df.columns = [c.lstrip("﻿") for c in df.columns]
    return {row["id"]: row.to_dict() for _, row in df.iterrows()}


def _load_persona(persona_id: str) -> dict:
    path = PERSONA_DIR / f"{persona_id}.yaml"
    if not path.exists():
        raise FileNotFoundError(f"페르소나 KG 없음: {path}")
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def _actual_fact(kg: dict, kg_node: str) -> str:
    """시나리오의 kg_node 를 자연어 fact 로 변환."""
    if kg_node == "name":
        return kg["name"]
    if kg_node == "residence":
        return _clean_location(kg["residence"]["province"], kg["residence"]["district"])
    if kg_node == "occupation":
        return str(kg["occupation"])
    if kg_node == "education":
        edu = kg["education"]
        if edu.get("field"):
            return f"{edu['level']}({edu['field']})"
        return str(edu["level"])
    if kg_node == "marriage":
        marriage = kg["marriage"]
        if marriage.get("status") == "미혼":
            return "미혼"
        if marriage.get("marriage_year"):
            return f"{marriage['marriage_year']}년에 결혼"
        return str(marriage.get("status") or "정보 없음")
    if kg_node == "children":
        children = kg.get("children") or []
        if not children:
            return "자녀 없음"
        names = ", ".join(c["name"] for c in children)
        return f"자녀 {len(children)}명({names})"
    if kg_node == "health":
        conditions = ", ".join(kg["health"].get("conditions") or []) or "질환 정보 없음"
        return f"주요 질환: {conditions}"
    if kg_node == "preferences":
        prefs = kg["preferences"]
        return f"음식 {prefs['food']}, 취미 {prefs['hobby']}, 문화 {prefs['culture']}"
    return "정보 없음"


def build_reference_answer(rec: dict, scenario_meta: dict[str, dict]) -> str:
    """RAGAS reference 용 자연어 정답문 생성.

    RAGAS Context Recall/Faithfulness 는 "F" 같은 라벨보다 자연어 claim 에 안정적이다.
    ground_truth 라벨은 유지하되 평가 입력 reference 만 자연어화한다.
    """
    sid = rec["scenario_id"]
    meta = scenario_meta.get(sid, {})
    pattern = str(rec.get("pattern") or meta.get("pattern") or "")
    persona_id = rec["persona_id"]
    persona_name = meta.get("persona_name") or rec.get("persona_name")
    kg_node = str(meta.get("kg_node") or "")
    ground_truth = str(rec.get("ground_truth") or meta.get("ground_truth") or "")

    if not persona_name or (kg_node and kg_node != "none"):
        kg = _load_persona(persona_id)
        persona_name = persona_name or kg["name"]
    else:
        kg = {}

    if kg_node == "none" or pattern == "F-비존재" or ground_truth == "정보 없음":
        return f"제공된 페르소나 정보에는 {persona_name} 씨에 대해 질문한 사실이 없습니다."

    label = KG_LABELS.get(kg_node, "해당 사실")
    fact = _actual_fact(kg, kg_node) if kg_node else ground_truth

    if pattern.startswith("T-"):
        return f"{persona_name} 씨의 {label}: {fact}."

    if pattern.startswith("F-") or pattern.startswith("ADV-") or ground_truth == "F":
        return f"제공된 페르소나 정보 기준 {persona_name} 씨의 {label}: {fact}."

    return f"{persona_name} 씨의 {label}: {ground_truth}."


def load_cell(cell_id: int, limit: int | None, scenario_meta: dict[str, dict]) -> pd.DataFrame:
    path = RESPONSES_DIR / f"cell{cell_id}.jsonl"
    if not path.exists():
        raise FileNotFoundError(f"{path} 없음")
    rows = []
    for line in path.open(encoding="utf-8"):
        rec = json.loads(line)
        if rec.get("error"):
            continue
        reference = build_reference_answer(rec, scenario_meta)
        rows.append({
            "scenario_id": rec["scenario_id"],
            "question": rec["question"],
            "answer": rec["answer"] or "정보 없음",
            "contexts": rec["retrieved_contexts"] or [""],
            "reference": reference,
            "ground_truth_label": str(rec["ground_truth"]),
            "cell": cell_id,
            "pattern": rec["pattern"],
        })
        if limit and len(rows) >= limit:
            break
    return pd.DataFrame(rows)


class FastOpenAICompatRagasLLM:
    """Minimal RAGAS LLM wrapper for vLLM OpenAI-compatible chat completions.

    RAGAS 0.4.x 의 Instructor/LangChain structured-output wrapper 는 vLLM 에서
    호출당 30초 이상 걸릴 수 있다. 이 wrapper 는 RAGAS BaseRagasLLM 인터페이스로
    일반 chat completion 을 직접 호출하고, RAGAS 의 기존 JSON parser 에 파싱을 맡긴다.
    """

    multiple_completion_supported = True

    def __init__(
        self,
        model: str,
        base_url: str,
        api_key: str = "dummy",
        max_tokens: int = 768,
        timeout: int = 120,
    ):
        from ragas.llms.base import BaseRagasLLM

        self._base_cls = BaseRagasLLM
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.max_tokens = max_tokens
        self.timeout = timeout
        self.run_config = None
        self.cache = None

    def set_run_config(self, run_config):
        self.run_config = run_config

    def get_temperature(self, n: int) -> float:
        return 0.3 if n > 1 else 0.0

    @staticmethod
    def _prompt_to_text(prompt) -> str:
        if hasattr(prompt, "to_string"):
            return prompt.to_string()
        return getattr(prompt, "text", str(prompt))

    def _call(self, prompt_text: str, n: int, temperature: float, stop):
        import requests

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "Return only valid JSON. Do not wrap the JSON in markdown.",
                },
                {"role": "user", "content": prompt_text},
            ],
            "temperature": temperature,
            "max_tokens": self.max_tokens,
            "n": n,
            "response_format": {"type": "json_object"},
        }
        if stop:
            payload["stop"] = stop

        res = requests.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=self.timeout,
        )
        res.raise_for_status()
        return res.json()

    def generate_text(
        self,
        prompt,
        n: int = 1,
        temperature: float = 0.01,
        stop=None,
        callbacks=None,
    ) -> LLMResult:
        prompt_text = self._prompt_to_text(prompt)
        data = self._call(prompt_text, n=n, temperature=temperature, stop=stop)
        generations = []
        for choice in data.get("choices", []):
            message = choice.get("message") or {}
            generations.append(
                Generation(
                    text=message.get("content") or "",
                    generation_info={"finish_reason": choice.get("finish_reason")},
                )
            )
        return LLMResult(generations=[generations])

    async def agenerate_text(
        self,
        prompt,
        n: int = 1,
        temperature: float | None = 0.01,
        stop=None,
        callbacks=None,
    ) -> LLMResult:
        return await asyncio.to_thread(
            self.generate_text,
            prompt,
            n=n,
            temperature=temperature if temperature is not None else self.get_temperature(n),
            stop=stop,
            callbacks=callbacks,
        )

    async def generate(
        self,
        prompt,
        n: int = 1,
        temperature: float | None = 0.01,
        stop=None,
        callbacks=None,
    ) -> LLMResult:
        return await self.agenerate_text(
            prompt,
            n=n,
            temperature=temperature if temperature is not None else self.get_temperature(n),
            stop=stop,
            callbacks=callbacks,
        )

    def is_finished(self, response: LLMResult) -> bool:
        for batch in response.generations:
            for gen in batch:
                reason = (gen.generation_info or {}).get("finish_reason")
                if reason not in (None, "stop"):
                    return False
        return True


def build_judge(wrapper: str):
    from langchain_openai import ChatOpenAI
    from langchain_huggingface import HuggingFaceEmbeddings
    from ragas.llms import LangchainLLMWrapper
    from ragas.embeddings import LangchainEmbeddingsWrapper

    if wrapper == "fast":
        judge = FastOpenAICompatRagasLLM(
            model=JUDGE_MODEL,
            base_url=VLLM_BASE_URL,
            api_key="dummy",
            max_tokens=768,
            timeout=120,
        )
    else:
        judge = LangchainLLMWrapper(ChatOpenAI(
            model=JUDGE_MODEL,
            base_url=VLLM_BASE_URL,
            api_key="dummy",   # vLLM 은 키 검증 X
            temperature=0.0,
            max_tokens=1024,
            timeout=120,
        ))
    embed = LangchainEmbeddingsWrapper(HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        encode_kwargs={"normalize_embeddings": True},
    ))
    return judge, embed


async def adapt_metric_prompts(metrics, judge, language: str):
    """RAGAS 공식 prompt adaptation 을 사용해 한국어 답변 평가 안정화."""
    for metric in metrics:
        prompts = metric.get_prompts()
        if not prompts:
            continue
        adapted = await metric.adapt_prompts(
            language=language,
            llm=judge,
            adapt_instruction=True,
        )
        metric.set_prompts(**adapted)


def apply_korean_localized_prompts(metrics):
    """RAGAS metric 알고리즘은 그대로 두고 prompt examples 만 한국어 fact-QA 에 맞춘다."""
    from ragas.metrics._context_precision import ContextPrecisionPrompt, QAC, Verification
    from ragas.metrics._context_recall import (
        ContextRecallClassification,
        ContextRecallClassificationPrompt,
        ContextRecallClassifications,
        QCA,
    )
    from ragas.metrics._faithfulness import (
        NLIStatementInput,
        NLIStatementOutput,
        NLIStatementPrompt,
        StatementFaithfulnessAnswer,
        StatementGeneratorInput,
        StatementGeneratorOutput,
        StatementGeneratorPrompt,
    )

    class KoreanStatementGeneratorPrompt(StatementGeneratorPrompt):
        instruction = (
            "질문과 답변을 보고, 답변의 각 문장을 하나 이상의 완전한 사실 진술로 분해하세요. "
            "대명사는 쓰지 말고, 한국어 답변도 그대로 이해 가능한 한국어 진술로 만드세요. "
            "반드시 JSON 형식으로 출력하세요."
        )
        examples = [
            (
                StatementGeneratorInput(
                    question="김원규 씨의 직업은 무엇인가요?",
                    answer="김원규 씨의 직업은 건물 경비원입니다.",
                ),
                StatementGeneratorOutput(
                    statements=["김원규 씨의 직업은 건물 경비원입니다."]
                ),
            ),
            (
                StatementGeneratorInput(
                    question="김원규 씨는 전라남에 살고 있다. (참/거짓)",
                    answer="F. 김원규 씨는 인천 부평구에 거주하고 있습니다.",
                ),
                StatementGeneratorOutput(
                    statements=[
                        "김원규 씨는 전라남에 살고 있지 않습니다.",
                        "김원규 씨는 인천 부평구에 거주하고 있습니다.",
                    ]
                ),
            ),
            (
                StatementGeneratorInput(
                    question="김원규 씨의 최근 가입한 동호회의 이름은 무엇인가요?",
                    answer="정보 없음",
                ),
                StatementGeneratorOutput(
                    statements=["김원규 씨의 최근 가입한 동호회 이름은 제공된 정보에 없습니다."]
                ),
            ),
        ]

    class KoreanNLIStatementPrompt(NLIStatementPrompt):
        instruction = (
            "주어진 context 를 근거로 각 statement 가 직접 추론 가능한지 판단하세요. "
            "직접 추론 가능하면 verdict=1, context 에 없거나 반대되면 verdict=0 입니다. "
            "반드시 JSON 형식으로 출력하세요."
        )
        examples = [
            (
                NLIStatementInput(
                    context="name: 김원규\nresidence:\n  province: 인천\n  district: 인천-부평구\noccupation: 건물 경비원",
                    statements=[
                        "김원규 씨의 직업은 건물 경비원입니다.",
                        "김원규 씨는 전라남에 살고 있습니다.",
                    ],
                ),
                NLIStatementOutput(
                    statements=[
                        StatementFaithfulnessAnswer(
                            statement="김원규 씨의 직업은 건물 경비원입니다.",
                            reason="context 에 occupation: 건물 경비원이 명시되어 있습니다.",
                            verdict=1,
                        ),
                        StatementFaithfulnessAnswer(
                            statement="김원규 씨는 전라남에 살고 있습니다.",
                            reason="context 의 거주지는 인천 부평구이며 전라남이 아닙니다.",
                            verdict=0,
                        ),
                    ]
                ),
            )
        ]

    class KoreanContextPrecisionPrompt(ContextPrecisionPrompt):
        instruction = (
            "question, answer, context 를 보고 이 context 가 answer 를 도출하는 데 유용했는지 판단하세요. "
            "유용하면 verdict=1, 유용하지 않으면 verdict=0 입니다. 반드시 JSON 형식으로 출력하세요."
        )
        examples = [
            (
                QAC(
                    question="김원규 씨의 직업은 무엇인가요?",
                    context="occupation: 건물 경비원",
                    answer="김원규 씨의 직업은 건물 경비원입니다.",
                ),
                Verification(
                    reason="context 에 직업 정보가 직접 포함되어 있어 answer 도출에 유용합니다.",
                    verdict=1,
                ),
            ),
            (
                QAC(
                    question="김원규 씨의 직업은 무엇인가요?",
                    context="health:\n  conditions:\n  - 고혈압",
                    answer="김원규 씨의 직업은 건물 경비원입니다.",
                ),
                Verification(
                    reason="context 는 건강 정보이고 직업 정보를 포함하지 않으므로 answer 도출에 유용하지 않습니다.",
                    verdict=0,
                ),
            ),
        ]

    class KoreanContextRecallPrompt(ContextRecallClassificationPrompt):
        instruction = (
            "context 와 reference answer 를 보고, reference answer 의 각 사실 진술이 context 에 귀속될 수 있는지 분류하세요. "
            "귀속 가능하면 attributed=1, 아니면 attributed=0 입니다. 반드시 JSON 형식으로 출력하세요."
        )
        examples = [
            (
                QCA(
                    question="김원규 씨의 거주지는 어디인가요?",
                    context="residence:\n  province: 인천\n  district: 인천-부평구",
                    answer="김원규 씨의 거주지: 인천 부평구.",
                ),
                ContextRecallClassifications(
                    classifications=[
                        ContextRecallClassification(
                            statement="김원규 씨의 거주지는 인천 부평구입니다.",
                            reason="context 에 province: 인천, district: 인천-부평구가 명시되어 있습니다.",
                            attributed=1,
                        )
                    ]
                ),
            )
        ]

    for metric in metrics:
        if metric.name == "faithfulness":
            metric.set_prompts(
                statement_generator_prompt=KoreanStatementGeneratorPrompt(language="korean"),
                n_l_i_statement_prompt=KoreanNLIStatementPrompt(language="korean"),
            )
        elif metric.name == "context_precision":
            metric.set_prompts(
                context_precision_prompt=KoreanContextPrecisionPrompt(language="korean"),
            )
        elif metric.name == "context_recall":
            metric.set_prompts(
                context_recall_classification_prompt=KoreanContextRecallPrompt(language="korean"),
            )


def run_ragas(
    df: pd.DataFrame,
    judge,
    embed,
    prompt_mode: str,
    language: str | None,
    max_workers: int,
):
    from datasets import Dataset
    from ragas import evaluate
    from ragas.metrics import Faithfulness, AnswerRelevancy, ContextPrecision, ContextRecall
    from ragas.run_config import RunConfig

    metrics = [
        Faithfulness(llm=judge),
        AnswerRelevancy(llm=judge, embeddings=embed),
        ContextPrecision(llm=judge),
        ContextRecall(llm=judge),
    ]
    if prompt_mode == "korean-localized":
        print("  RAGAS prompt mode: korean-localized")
        apply_korean_localized_prompts(metrics)
    elif prompt_mode == "adapt":
        print(f"  RAGAS prompt adaptation: {language}")
        asyncio.run(adapt_metric_prompts(metrics, judge, language))
    else:
        print("  RAGAS prompt mode: standard")

    ds = Dataset.from_pandas(df[["question", "answer", "contexts", "reference"]])
    # vLLM continuous batching → max_workers ↑ 가능
    rc = RunConfig(max_workers=max_workers, timeout=300)
    result = evaluate(ds, metrics=metrics, llm=judge, embeddings=embed,
                       raise_exceptions=False, run_config=rc)
    return result.to_pandas()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cells", default="1,3")
    ap.add_argument(
        "--merge-cells",
        default=None,
        help="평가 후 합쳐서 summary/scores 로 저장할 셀. 예: 1,2,3,4. 기본값은 --cells 와 동일",
    )
    ap.add_argument(
        "--output-prefix",
        default="ragas_vllm",
        help="결과 파일 prefix. 기본값: ragas_vllm",
    )
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument(
        "--prompt-mode",
        choices=["standard", "korean-localized", "adapt"],
        default="korean-localized",
        help="standard=RAGAS 기본 영어 prompt, korean-localized=RAGAS prompt 한국어 예시 고정, adapt=RAGAS adapt_prompts 즉석 실행",
    )
    ap.add_argument(
        "--language",
        default="korean",
        help="--prompt-mode adapt 일 때 사용할 RAGAS adapt_prompts 언어",
    )
    ap.add_argument("--max-workers", type=int, default=8)
    ap.add_argument(
        "--wrapper",
        choices=["fast", "langchain"],
        default="fast",
        help="fast=직접 vLLM JSON 호출, langchain=기존 LangChain wrapper",
    )
    args = ap.parse_args()

    cells = [int(c) for c in args.cells.split(",")]
    merge_cells = [int(c) for c in (args.merge_cells or args.cells).split(",")]
    language = args.language.strip() or None
    print(f"[1] vLLM: {VLLM_BASE_URL} / {JUDGE_MODEL}")
    print(f"[2] Embed: {EMBED_MODEL}")

    # vLLM ready check
    import requests
    try:
        r = requests.get(VLLM_BASE_URL.removesuffix("/v1") + "/v1/models", timeout=5)
        models = [m["id"] for m in r.json().get("data", [])]
        print(f"[3] vLLM ready, loaded models: {models}")
    except Exception as e:
        print(f"❌ vLLM 서버 응답 없음 ({VLLM_BASE_URL}): {e}")
        print(f"   먼저: vllm serve {JUDGE_MODEL} --port 8001 --gpu-memory-utilization 0.6")
        return 1

    judge, embed = build_judge(args.wrapper)
    scenario_meta = _load_scenario_meta()

    for cid in cells:
        print(f"\n=== Cell {cid} ===")
        df = load_cell(cid, args.limit, scenario_meta)
        print(f"  trial: {len(df)}")
        t0 = time.time()
        scores = run_ragas(df, judge, embed, args.prompt_mode, language, args.max_workers)
        elapsed = time.time() - t0
        print(f"  완료: {elapsed:.1f}s ({elapsed/len(df):.2f}s/trial)")
        scores["cell"] = cid
        scores["scenario_id"] = df["scenario_id"].values
        scores["pattern"] = df["pattern"].values
        scores["ground_truth_label"] = df["ground_truth_label"].values
        scores.to_csv(RESULTS_DIR / f"{args.output_prefix}_cell{cid}.csv",
                      index=False, encoding="utf-8-sig")

    merged_parts = []
    for cid in merge_cells:
        cell_path = RESULTS_DIR / f"{args.output_prefix}_cell{cid}.csv"
        if not cell_path.exists():
            raise FileNotFoundError(
                f"{cell_path} 없음. 먼저 --cells {cid} 로 평가하거나 --merge-cells 에서 제외하세요."
            )
        merged_parts.append(pd.read_csv(cell_path, encoding="utf-8-sig"))

    merged = pd.concat(merged_parts, ignore_index=True)
    merged.to_csv(RESULTS_DIR / f"{args.output_prefix}_scores.csv",
                  index=False, encoding="utf-8-sig")

    metric_cols = [c for c in ("faithfulness", "answer_relevancy",
                               "context_precision", "context_recall") if c in merged.columns]
    summary = merged.groupby("cell")[metric_cols].mean(numeric_only=True).round(4)
    nan_rates = merged.groupby("cell")[metric_cols].apply(lambda x: x.isna().mean()).round(3)
    print("\n=== 셀별 평균 ===")
    print(summary.to_markdown())
    print("\n=== NaN 비율 ===")
    print(nan_rates.to_markdown())

    with (RESULTS_DIR / f"{args.output_prefix}_summary.md").open("w", encoding="utf-8") as f:
        f.write(f"# Phase 1 RAGAS 표준 (vLLM + {JUDGE_MODEL})\n\n")
        f.write(f"- Evaluated cells in this run: {cells}\n")
        f.write(f"- Merged cells in this report: {merge_cells}\n")
        f.write(f"- Prompt mode: {args.prompt_mode}\n")
        if args.prompt_mode == "adapt":
            f.write(f"- Prompt adaptation language: {language or 'disabled'}\n")
        f.write("- Reference: RAGAS용 자연어 정답문 (원 ground_truth_label 별도 보존)\n\n")
        f.write("## 셀별 평균\n\n")
        f.write(summary.to_markdown() + "\n\n")
        f.write("## NaN 비율\n\n")
        f.write(nan_rates.to_markdown() + "\n\n")
        f.write("## 패턴별 평균\n\n")
        f.write(merged.groupby(["cell", "pattern"])[metric_cols].mean(numeric_only=True).round(4).to_markdown())

    print(f"\n✅ {RESULTS_DIR / f'{args.output_prefix}_summary.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

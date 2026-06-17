"""Step 6 — ChromaDB 인덱스 빌드 (VectorRAG 셀 준비).

30 페르소나 yaml → 약 300 chunk → bge-m3 임베딩 → experiments/rag/chroma_db/

bge-m3 가중치는 ai-server 가 받아둔 ~/.cache/huggingface 에서 자동 로드.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from rag.vector_rag import VectorRAG

ROOT = Path(__file__).resolve().parent.parent


def main():
    rag = VectorRAG(
        persona_dir=ROOT / "data" / "personas",
        chroma_path=ROOT / "rag" / "chroma_db",
        embedding_model="BAAI/bge-m3",
        top_k=5,
    )
    print("[1] bge-m3 로딩 + ChromaDB 인덱스 빌드 ...")
    n = rag.build()
    print(f"[2] {n} chunk 인덱싱 완료")

    # 1개 retrieve 테스트
    res = rag.retrieve("P001", "김원규 씨는 언제 결혼했나요?")
    print(f"\n[3] 검색 테스트 — P001 / '김원규 씨는 언제 결혼했나요?'")
    for i, (doc, kind, dist) in enumerate(zip(
            res.contexts,
            res.meta["chunk_kinds"],
            res.meta["distances"]), 1):
        print(f"  {i}. [{kind}, dist={dist:.3f}] {doc[:100]}")


if __name__ == "__main__":
    sys.exit(main())

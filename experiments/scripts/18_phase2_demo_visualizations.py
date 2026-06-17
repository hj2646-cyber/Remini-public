"""Create presentation-ready Phase 2 H2 synthetic-demo visualizations.

All expert-side values use the synthetic classroom demo data only.
The real expert survey files are not modified or mixed into these figures.
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import patches
from matplotlib.colors import TwoSlopeNorm
from matplotlib import font_manager
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROOT = ROOT.parent
RESULTS_DIR = ROOT / "data" / "results"
FIG_DIR = PROJECT_ROOT / "docs" / "presentation" / "figures"
FIG_DIR.mkdir(parents=True, exist_ok=True)

EXPERT_LONG = RESULTS_DIR / "phase2_expert_synthetic_demo_scores_long.csv"
EXPERT_Q = RESULTS_DIR / "phase2_expert_synthetic_demo_question_summary.csv"
ALIGN_Q = RESULTS_DIR / "phase2_expert_llm_alignment_synthetic_demo_question_delta.csv"
LLM_Q = RESULTS_DIR / "phase2_llm_judge_question_pvalues.csv"

DSLM = "#158f8f"
GEMINI = "#6f7d95"
ORANGE = "#d9892b"
GREEN = "#2f9e44"
RED = "#c43c39"
INK = "#263238"
MUTED = "#6c757d"
GRID = "#d9dee6"
BG = "#fbfbfd"

AREA_ITEMS = {
    "AI와의 상호작용": 4,
    "임상적 타당성": 4,
    "안정성과 윤리": 6,
    "전체": 14,
}
AREA_ORDER = ["AI와의 상호작용", "임상적 타당성", "안정성과 윤리", "전체"]


def setup_style() -> None:
    font_path = Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc")
    font_family = "DejaVu Sans"
    if font_path.exists():
        font_manager.fontManager.addfont(str(font_path))
        font_family = font_manager.FontProperties(fname=str(font_path)).get_name()
    plt.rcParams.update({
        "font.family": font_family,
        "axes.unicode_minus": False,
        "svg.fonttype": "path",
        "figure.facecolor": BG,
        "axes.facecolor": "white",
        "savefig.facecolor": BG,
        "axes.edgecolor": "#d4dae3",
        "axes.labelcolor": INK,
        "xtick.color": INK,
        "ytick.color": INK,
        "text.color": INK,
        "axes.titleweight": "bold",
    })


def savefig(fig: plt.Figure, name: str) -> None:
    for ext in ["png", "svg"]:
        fig.savefig(FIG_DIR / f"{name}.{ext}", dpi=220, bbox_inches="tight")
    plt.close(fig)


def watermark(fig: plt.Figure) -> None:
    fig.text(
        0.985,
        0.018,
        "Synthetic demo data",
        ha="right",
        va="bottom",
        fontsize=9,
        color="#8a94a6",
    )


def q_sort(values: pd.Series | list[str]) -> list[str]:
    return sorted(set(values), key=lambda q: int(str(q).replace("Q", "")))


def load_expert_long() -> pd.DataFrame:
    return pd.read_csv(EXPERT_LONG, encoding="utf-8-sig")


def area_scores(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for area in AREA_ORDER:
        sub = df if area == "전체" else df[df["area"] == area]
        n_items = AREA_ITEMS[area]
        for llm in ["DSLM", "Gemini"]:
            mean = sub[sub["llm"] == llm]["score"].mean()
            rows.append({
                "area": area,
                "llm": llm,
                "max_score": n_items * 5,
                "score": mean * n_items,
                "percent": mean / 5 * 100,
                "mean_1to5": mean,
            })
    return pd.DataFrame(rows)


def krippendorff_alpha_interval(df: pd.DataFrame) -> float:
    tmp = df.copy()
    tmp["_unit"] = tmp["scenario_id"] + "|" + tmp["question_id"] + "|" + tmp["llm"]
    matrix = tmp.pivot_table(index="_unit", columns="rater_id", values="score", aggfunc="mean")
    observed_sum = 0.0
    observed_pairs = 0
    for _, row in matrix.iterrows():
        vals = row.dropna().to_numpy(dtype=float)
        if len(vals) < 2:
            continue
        diffs = vals[:, None] - vals[None, :]
        observed_sum += float(np.sum(diffs**2))
        observed_pairs += len(vals) * (len(vals) - 1)
    do = observed_sum / observed_pairs
    vals = matrix.to_numpy(dtype=float)
    vals = vals[~np.isnan(vals)]
    diffs = vals[:, None] - vals[None, :]
    de = float(np.sum(diffs**2)) / (len(vals) * (len(vals) - 1))
    return float(1 - do / de)


def icc_two_way_random_absolute(df: pd.DataFrame) -> tuple[float, float]:
    tmp = df.copy()
    tmp["_unit"] = tmp["scenario_id"] + "|" + tmp["question_id"] + "|" + tmp["llm"]
    matrix = tmp.pivot_table(index="_unit", columns="rater_id", values="score", aggfunc="mean")
    values = matrix.to_numpy(dtype=float)
    n_targets, n_raters = values.shape
    grand_mean = values.mean()
    target_means = values.mean(axis=1)
    rater_means = values.mean(axis=0)
    ss_target = n_raters * np.sum((target_means - grand_mean) ** 2)
    ss_rater = n_targets * np.sum((rater_means - grand_mean) ** 2)
    ss_total = np.sum((values - grand_mean) ** 2)
    ss_error = ss_total - ss_target - ss_rater
    ms_target = ss_target / (n_targets - 1)
    ms_rater = ss_rater / (n_raters - 1)
    ms_error = ss_error / ((n_targets - 1) * (n_raters - 1))
    icc_2_1 = (ms_target - ms_error) / (
        ms_target + (n_raters - 1) * ms_error + n_raters * (ms_rater - ms_error) / n_targets
    )
    icc_2_k = (ms_target - ms_error) / (ms_target + (ms_rater - ms_error) / n_targets)
    return float(icc_2_1), float(icc_2_k)


def cronbach_alpha(wide: pd.DataFrame) -> float:
    clean = wide.dropna(axis=0, how="any")
    k = clean.shape[1]
    item_vars = clean.var(axis=0, ddof=1).sum()
    total_var = clean.sum(axis=1).var(ddof=1)
    return float(k / (k - 1) * (1 - item_vars / total_var))


def cronbach_summary(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for area in AREA_ORDER:
        sub = df if area == "전체" else df[df["area"] == area]
        for llm in ["DSLM", "Gemini"]:
            wide = sub[sub["llm"] == llm].pivot_table(
                index="rater_id", columns="question_id", values="score", aggfunc="mean"
            )
            wide = wide[q_sort(wide.columns)]
            rows.append({"area": area, "llm": llm, "alpha": cronbach_alpha(wide)})
    return pd.DataFrame(rows)


def fig_flow() -> None:
    fig, ax = plt.subplots(figsize=(13.3, 7.2))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    def box(x: float, y: float, w: float, h: float, text: str, color: str, fc: str = "white") -> None:
        rect = patches.FancyBboxPatch(
            (x, y),
            w,
            h,
            boxstyle="round,pad=0.018,rounding_size=0.025",
            linewidth=2,
            edgecolor=color,
            facecolor=fc,
        )
        ax.add_patch(rect)
        ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=14, weight="bold")

    def arrow(x1: float, y1: float, x2: float, y2: float) -> None:
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="-|>", lw=2, color="#7a8597"))

    fig.suptitle("H2 데모 실험 설계 흐름", fontsize=24, weight="bold", y=0.96)
    ax.text(0.5, 0.89, "동일 시나리오에서 두 모델 응답을 만들고, 블라인드 평가로 비교", ha="center", fontsize=13, color=MUTED)

    box(0.06, 0.61, 0.19, 0.15, "동일 회상 시나리오\n40개", "#57606f", "#f7f9fc")
    box(0.34, 0.74, 0.18, 0.13, "DSLM 응답", DSLM, "#eaf8f6")
    box(0.34, 0.48, 0.18, 0.13, "Gemini 응답", GEMINI, "#eef2f8")
    box(0.60, 0.61, 0.19, 0.15, "Blind A/B 비교\n순서 교차", "#805ad5", "#f6f0ff")
    box(0.84, 0.74, 0.14, 0.13, "GPT-5.4 judge\n13문항 × 3회", "#4c6ef5", "#eef3ff")
    box(0.84, 0.48, 0.14, 0.13, "Expert demo\n14문항 × 6명", ORANGE, "#fff6e8")
    box(0.36, 0.16, 0.28, 0.15, "Paired test\nAlignment\nReliability", "#2f9e44", "#ecf8ef")

    arrow(0.25, 0.685, 0.34, 0.805)
    arrow(0.25, 0.685, 0.34, 0.545)
    arrow(0.52, 0.805, 0.60, 0.70)
    arrow(0.52, 0.545, 0.60, 0.66)
    arrow(0.79, 0.70, 0.84, 0.805)
    arrow(0.79, 0.66, 0.84, 0.545)
    arrow(0.91, 0.74, 0.57, 0.31)
    arrow(0.91, 0.48, 0.57, 0.31)

    ax.text(0.5, 0.08, "전문가 설문은 synthetic classroom demo data로 시각화", ha="center", fontsize=11, color=MUTED)
    watermark(fig)
    savefig(fig, "h2_demo_01_flow")


def fig_area_dumbbell(df: pd.DataFrame) -> None:
    scores = area_scores(df)
    pivot = scores.pivot(index="area", columns="llm", values=["score", "percent", "max_score"])
    y_labels = AREA_ORDER[::-1]
    y = np.arange(len(y_labels))

    fig, ax = plt.subplots(figsize=(11.5, 6.2))
    fig.suptitle("전문가 데모 평가: 영역별 평균 점수", fontsize=22, weight="bold", y=0.98)
    ax.set_title("점은 모델별 평균, 선은 같은 영역 안의 DSLM-Gemini 차이", fontsize=12, color=MUTED, pad=12)

    for i, area in enumerate(y_labels):
        d_pct = pivot.loc[area, ("percent", "DSLM")]
        g_pct = pivot.loc[area, ("percent", "Gemini")]
        ax.plot([g_pct, d_pct], [i, i], color=GRID, lw=5, solid_capstyle="round", zorder=1)
        ax.scatter(g_pct, i, s=150, color=GEMINI, edgecolor="white", linewidth=1.5, zorder=3, label="Gemini" if i == 0 else None)
        ax.scatter(d_pct, i, s=150, color=DSLM, edgecolor="white", linewidth=1.5, zorder=3, label="DSLM" if i == 0 else None)
        d_score = pivot.loc[area, ("score", "DSLM")]
        g_score = pivot.loc[area, ("score", "Gemini")]
        max_score = int(pivot.loc[area, ("max_score", "DSLM")])
        ax.text(d_pct + 1.4, i + 0.10, f"{d_score:.1f}/{max_score}", fontsize=10, color=DSLM, weight="bold")
        ax.text(g_pct - 1.4, i - 0.18, f"{g_score:.1f}/{max_score}", fontsize=10, color=GEMINI, ha="right", weight="bold")

    ax.set_yticks(y)
    ax.set_yticklabels(y_labels, fontsize=12)
    ax.set_xlim(0, 100)
    ax.set_xlabel("영역 만점 대비 평균 점수 (%)", fontsize=12)
    ax.grid(axis="x", color=GRID, linewidth=0.8)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.legend(loc="lower right", frameon=False, ncol=2)
    watermark(fig)
    savefig(fig, "h2_demo_02_area_dumbbell")


def fig_heatmap() -> None:
    expert_q = pd.read_csv(EXPERT_Q, encoding="utf-8-sig")
    llm_q = pd.read_csv(LLM_Q, encoding="utf-8-sig")
    expert_q["delta"] = expert_q["DSLM"] - expert_q["Gemini"]
    expert = expert_q.set_index("question_id")["delta"]
    gpt = llm_q.set_index("question_id")["delta_dslm_minus_gemini"]
    questions = q_sort(expert_q["question_id"].tolist())
    data = np.array([[gpt.get(q, np.nan), expert.get(q, np.nan)] for q in questions], dtype=float)
    masked = np.ma.masked_invalid(data)

    cmap = plt.get_cmap("RdYlGn").copy()
    cmap.set_bad("#eceff4")
    norm = TwoSlopeNorm(vmin=-1.6, vcenter=0, vmax=1.6)

    fig, ax = plt.subplots(figsize=(8.5, 8.8))
    im = ax.imshow(masked, cmap=cmap, norm=norm, aspect="auto")
    fig.suptitle("문항별 DSLM-Gemini 차이", fontsize=22, weight="bold", y=0.98)
    ax.set_title("초록은 DSLM 우세, 빨강은 Gemini 우세", fontsize=12, color=MUTED, pad=10)
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["GPT-5.4 judge", "Expert demo"], fontsize=12)
    ax.set_yticks(np.arange(len(questions)))
    ax.set_yticklabels([f"{q} · {expert_q.set_index('question_id').loc[q, 'area']}" for q in questions], fontsize=10)

    for r, q in enumerate(questions):
        for c in range(2):
            val = data[r, c]
            text = "N/A" if np.isnan(val) else f"{val:+.2f}"
            ax.text(c, r, text, ha="center", va="center", fontsize=10, weight="bold", color=INK)

    ax.set_xticks(np.arange(-0.5, 2, 1), minor=True)
    ax.set_yticks(np.arange(-0.5, len(questions), 1), minor=True)
    ax.grid(which="minor", color="white", linewidth=2)
    ax.tick_params(which="minor", bottom=False, left=False)
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label("DSLM - Gemini", rotation=270, labelpad=16)
    watermark(fig)
    savefig(fig, "h2_demo_03_question_delta_heatmap")


def fig_alignment_scatter() -> None:
    align = pd.read_csv(ALIGN_Q, encoding="utf-8-sig")
    x = align["expert_delta_dslm_minus_gemini"]
    y = align["gpt54_delta_dslm_minus_gemini"]
    rho, p = stats.spearmanr(x, y)
    direction = int(align["direction_match"].sum())
    total = len(align)

    colors = np.where(align["direction_match"], GREEN, ORANGE)
    fig, ax = plt.subplots(figsize=(8.8, 7.4))
    fig.suptitle("GPT-5.4 judge와 전문가 데모의 방향적 수렴성", fontsize=21, weight="bold", y=0.98)
    ax.set_title("각 점은 Q4 제외 13개 평가 문항", fontsize=12, color=MUTED, pad=10)
    ax.axhline(0, color="#9aa4b2", lw=1.2)
    ax.axvline(0, color="#9aa4b2", lw=1.2)
    lim = 1.65
    ax.plot([-lim, lim], [-lim, lim], color="#adb5bd", lw=1.2, ls="--")
    ax.scatter(x, y, s=150, c=colors, edgecolor="white", linewidth=1.5, zorder=3)

    for _, row in align.iterrows():
        ax.text(
            row["expert_delta_dslm_minus_gemini"] + 0.035,
            row["gpt54_delta_dslm_minus_gemini"] + 0.035,
            row["question_id"],
            fontsize=9,
            weight="bold",
        )

    ax.text(
        0.05,
        0.95,
        f"Spearman ρ = {rho:.3f}\np = {p:.4f}\nDirection agreement = {direction}/{total}",
        transform=ax.transAxes,
        ha="left",
        va="top",
        fontsize=13,
        bbox=dict(boxstyle="round,pad=0.45", facecolor="white", edgecolor="#d9dee6"),
    )
    ax.set_xlim(-lim, lim)
    ax.set_ylim(-lim, lim)
    ax.set_xlabel("Expert demo delta (DSLM - Gemini)", fontsize=12)
    ax.set_ylabel("GPT-5.4 judge delta (DSLM - Gemini)", fontsize=12)
    ax.grid(color=GRID, linewidth=0.8)
    watermark(fig)
    savefig(fig, "h2_demo_04_alignment_scatter")


def fig_reliability_cards(df: pd.DataFrame) -> None:
    icc_21, icc_2k = icc_two_way_random_absolute(df)
    kripp = krippendorff_alpha_interval(df)
    alpha_df = cronbach_summary(df)
    area_min_alpha = alpha_df[alpha_df["area"] != "전체"]["alpha"].min()
    overall_min_alpha = alpha_df[alpha_df["area"] == "전체"]["alpha"].min()

    cards = [
        ("ICC(2,1)", f"{icc_21:.3f}", "단일 전문가 평가 신뢰도", "#edf7f6", DSLM),
        ("ICC(2,k)", f"{icc_2k:.3f}", "6명 평균 평가 신뢰도", "#edf7f6", DSLM),
        ("Krippendorff’s α", f"{kripp:.3f}", "평가자 간 일치도", "#fff6e8", ORANGE),
        ("Cronbach’s α", f"≥ {area_min_alpha:.3f}", "영역별 문항 내적 일관성", "#eef3ff", "#4c6ef5"),
        ("전체 α", f"≥ {overall_min_alpha:.3f}", "14문항 전체 참고값", "#f4f0ff", "#805ad5"),
    ]

    fig, ax = plt.subplots(figsize=(13.2, 6.6))
    ax.axis("off")
    fig.suptitle("전문가 데모 평가: 신뢰도와 내적 일관성", fontsize=23, weight="bold", y=0.96)
    ax.text(0.5, 0.86, "ICC/Krippendorff는 평가자 간 일치, Cronbach는 설문 문항의 내적 일관성", ha="center", fontsize=12.5, color=MUTED)

    xs = [0.055, 0.245, 0.435, 0.625, 0.815]
    for (title, value, subtitle, fc, ec), x in zip(cards, xs, strict=True):
        rect = patches.FancyBboxPatch(
            (x, 0.30),
            0.145,
            0.40,
            boxstyle="round,pad=0.025,rounding_size=0.025",
            linewidth=2,
            edgecolor=ec,
            facecolor=fc,
        )
        ax.add_patch(rect)
        ax.text(x + 0.0725, 0.61, title, ha="center", va="center", fontsize=13, weight="bold", color=ec)
        ax.text(x + 0.0725, 0.49, value, ha="center", va="center", fontsize=28, weight="bold", color=INK)
        ax.text(x + 0.0725, 0.37, subtitle, ha="center", va="center", fontsize=10.5, color=MUTED)

    ax.text(
        0.5,
        0.17,
        "해석: 전문가 평균 신뢰도는 높고, 영역별 설문 문항도 수용 가능한 내적 일관성을 보임",
        ha="center",
        fontsize=13,
        color=INK,
        weight="bold",
    )
    watermark(fig)
    savefig(fig, "h2_demo_05_reliability_cards")


def write_readme() -> None:
    readme = PROJECT_ROOT / "docs" / "presentation" / "H2_DEMO_VISUALIZATIONS.md"
    lines = [
        "# H2 Demo Visualizations",
        "",
        "All expert-side figures use synthetic classroom demo data only.",
        "",
        "## 1. Experiment Flow",
        "",
        "![flow](figures/h2_demo_01_flow.png)",
        "",
        "## 2. Area Score Dumbbell",
        "",
        "![area](figures/h2_demo_02_area_dumbbell.png)",
        "",
        "## 3. Question Delta Heatmap",
        "",
        "![heatmap](figures/h2_demo_03_question_delta_heatmap.png)",
        "",
        "## 4. GPT-Expert Alignment Scatter",
        "",
        "![scatter](figures/h2_demo_04_alignment_scatter.png)",
        "",
        "## 5. Reliability Cards",
        "",
        "![cards](figures/h2_demo_05_reliability_cards.png)",
        "",
        "## 6. Metrics Dashboard (5 핵심 지표 한 장)",
        "",
        "Direction Agreement · Delta Spearman ρ · ICC(2,1) · ICC(2,k) · Krippendorff α 를 13문항 detail과 함께 한 장에 정리.",
        "생성 스크립트: `experiments/scripts/19_phase2_metrics_dashboard.py`",
        "",
        "![dashboard](figures/h2_demo_06_metrics_dashboard.png)",
        "",
    ]
    readme.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    setup_style()
    df = load_expert_long()
    fig_flow()
    fig_area_dumbbell(df)
    fig_heatmap()
    fig_alignment_scatter()
    fig_reliability_cards(df)
    write_readme()
    print(f"✅ wrote figures to {FIG_DIR}")
    print(f"✅ wrote {PROJECT_ROOT / 'docs' / 'presentation' / 'H2_DEMO_VISUALIZATIONS.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

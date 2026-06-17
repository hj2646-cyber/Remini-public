"""Phase 2 H2 alignment & reliability dashboard.

Combines the five primary alignment & reliability metrics on the synthetic
classroom demo data into a single presentation-ready figure:
- Direction Agreement
- Delta Spearman ρ
- ICC(2,1), ICC(2,k)
- Krippendorff's α
- Per-question DSLM-Gemini delta strip (expert vs GPT-5.4)

All expert-side values use the synthetic classroom demo data only.
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import font_manager, patches
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROOT = ROOT.parent
RESULTS_DIR = ROOT / "data" / "results"
FIG_DIR = PROJECT_ROOT / "docs" / "presentation" / "figures"
FIG_DIR.mkdir(parents=True, exist_ok=True)

EXPERT_LONG = RESULTS_DIR / "phase2_expert_synthetic_demo_scores_long.csv"
ALIGN_Q = RESULTS_DIR / "phase2_expert_llm_alignment_synthetic_demo_question_delta.csv"

DSLM = "#158f8f"
GEMINI = "#6f7d95"
ORANGE = "#d9892b"
GREEN = "#2f9e44"
RED = "#c43c39"
BLUE = "#4c6ef5"
INK = "#263238"
MUTED = "#6c757d"
GRID = "#d9dee6"
BG = "#fbfbfd"


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


def q_sort(values) -> list[str]:
    return sorted(set(values), key=lambda q: int(str(q).replace("Q", "")))


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


def panel_direction(ax: plt.Axes, align: pd.DataFrame) -> None:
    match = int(align["direction_match"].sum())
    total = len(align)
    pct = match / total * 100
    bin_p = float(stats.binomtest(match, total, p=0.5, alternative="greater").pvalue)

    ax.set_aspect("equal")
    ax.set_xlim(-1.4, 1.4)
    ax.set_ylim(-1.4, 1.4)
    ax.axis("off")
    ax.pie(
        [match, total - match],
        colors=[GREEN, ORANGE],
        startangle=90,
        counterclock=False,
        wedgeprops=dict(width=0.32, edgecolor=BG, linewidth=2),
    )
    ax.text(0, 0.13, f"{match}/{total}", ha="center", va="center", fontsize=28, weight="bold", color=INK)
    ax.text(0, -0.18, f"{pct:.1f}%", ha="center", va="center", fontsize=13, color=MUTED)
    ax.text(0, -0.40, f"binomial p = {bin_p:.4f}", ha="center", va="center", fontsize=9.5, color=MUTED)
    ax.text(0, 1.30, "Direction Agreement", ha="center", va="center", fontsize=13.5, weight="bold", color=INK)
    ax.text(0, 1.14, "13문항 부호 일치", ha="center", va="center", fontsize=10.5, color=MUTED)


def panel_spearman(ax: plt.Axes, align: pd.DataFrame) -> None:
    x = align["expert_delta_dslm_minus_gemini"].to_numpy(dtype=float)
    y = align["gpt54_delta_dslm_minus_gemini"].to_numpy(dtype=float)
    rho, p = stats.spearmanr(x, y)
    colors = np.where(align["direction_match"], GREEN, ORANGE)

    lim = 1.85
    ax.plot([-lim, lim], [-lim, lim], color="#adb5bd", lw=1.0, ls="--", zorder=1)
    ax.axhline(0, color="#9aa4b2", lw=0.8, zorder=1)
    ax.axvline(0, color="#9aa4b2", lw=0.8, zorder=1)
    ax.scatter(x, y, s=80, c=colors, edgecolor="white", linewidth=1.4, zorder=3)
    ax.set_xlim(-lim, lim)
    ax.set_ylim(-lim, lim)
    ax.set_xticks([-1.5, 0, 1.5])
    ax.set_yticks([-1.5, 0, 1.5])
    ax.set_xlabel("Expert Δ", fontsize=10)
    ax.set_ylabel("GPT-5.4 Δ", fontsize=10)
    ax.grid(color=GRID, linewidth=0.6, zorder=0)
    ax.set_title("Delta Spearman ρ", fontsize=13.5, weight="bold", color=INK, pad=10)
    ax.text(
        0.04,
        0.96,
        f"ρ = {rho:.3f}\np = {p:.4f}",
        transform=ax.transAxes,
        ha="left",
        va="top",
        fontsize=12,
        weight="bold",
        bbox=dict(boxstyle="round,pad=0.35", facecolor="white", edgecolor="#d9dee6"),
    )


def _benchmark_bands(ax: plt.Axes, y: float, bands: list[tuple[float, float, str]]) -> None:
    for lo, hi, color in bands:
        ax.barh([y], [hi - lo], left=lo, color=color, edgecolor="none", height=0.55, zorder=1)


def panel_icc(ax: plt.Axes, icc_21: float, icc_2k: float) -> None:
    bands = [
        (0.0, 0.4, "#f5c6c6"),
        (0.4, 0.6, "#fde9c8"),
        (0.6, 0.75, "#ddeec7"),
        (0.75, 1.0, "#bfe1b2"),
    ]
    for y in (0, 1):
        _benchmark_bands(ax, y, bands)
    ax.scatter([icc_21], [0], s=170, color=DSLM, edgecolor="white", linewidth=2, zorder=3)
    ax.scatter([icc_2k], [1], s=170, color=DSLM, edgecolor="white", linewidth=2, zorder=3)
    ax.text(icc_21, 0.47, f"{icc_21:.3f}", ha="center", fontsize=12, weight="bold", color=INK)
    ax.text(icc_2k, 1.47, f"{icc_2k:.3f}", ha="center", fontsize=12, weight="bold", color=INK)
    ax.text(0.2, -0.55, "Poor", ha="center", fontsize=8.5, color=MUTED)
    ax.text(0.5, -0.55, "Fair", ha="center", fontsize=8.5, color=MUTED)
    ax.text(0.675, -0.55, "Good", ha="center", fontsize=8.5, color=MUTED)
    ax.text(0.875, -0.55, "Excellent", ha="center", fontsize=8.5, color=MUTED)
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.95, 1.95)
    ax.set_yticks([0, 1])
    ax.set_yticklabels(["ICC(2,1)\n단일 평가자", "ICC(2,k)\n6명 평균"], fontsize=10.5)
    ax.set_xticks([0, 0.4, 0.6, 0.75, 1])
    ax.set_xticklabels(["0", ".40", ".60", ".75", "1"], fontsize=9)
    ax.grid(axis="x", color="white", linewidth=1.2, zorder=2)
    ax.spines[["top", "right"]].set_visible(False)
    ax.set_title("ICC — 평가자간 일치 (Cicchetti)", fontsize=13.5, weight="bold", pad=10)


def panel_krippendorff(ax: plt.Axes, kripp: float) -> None:
    bands = [
        (0.0, 0.667, "#f5c6c6"),
        (0.667, 0.8, "#fde9c8"),
        (0.8, 1.0, "#bfe1b2"),
    ]
    _benchmark_bands(ax, 0, bands)
    ax.scatter([kripp], [0], s=200, color=ORANGE, edgecolor="white", linewidth=2, zorder=3)
    ax.text(kripp, 0.5, f"α = {kripp:.3f}", ha="center", fontsize=14, weight="bold", color=INK)
    ax.text(0.333, -0.6, "Insufficient", ha="center", fontsize=8.5, color=MUTED)
    ax.text(0.733, -0.6, "Tentative", ha="center", fontsize=7.5, color=MUTED)
    ax.text(0.9, -0.6, "Reliable", ha="center", fontsize=8.5, color=MUTED)
    ax.set_xlim(0, 1)
    ax.set_ylim(-1.0, 0.95)
    ax.set_yticks([])
    ax.set_xticks([0, 0.667, 0.8, 1])
    ax.set_xticklabels(["0", ".667", ".80", "1"], fontsize=9)
    ax.grid(axis="x", color="white", linewidth=1.2, zorder=2)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.set_title("Krippendorff's α (Interval)", fontsize=13.5, weight="bold", pad=10)


def panel_questions(ax: plt.Axes, align: pd.DataFrame) -> None:
    questions = q_sort(align["question_id"].tolist())
    idx = align.set_index("question_id").loc[questions]
    x = np.arange(len(questions))
    expert = idx["expert_delta_dslm_minus_gemini"].to_numpy(dtype=float)
    gpt = idx["gpt54_delta_dslm_minus_gemini"].to_numpy(dtype=float)
    matches = idx["direction_match"].to_numpy()

    for i, m in enumerate(matches):
        if not m:
            ax.add_patch(patches.Rectangle((i - 0.5, -2.1), 1, 4.2, color=RED, alpha=0.08, zorder=0))

    width = 0.36
    ax.bar(x - width / 2, expert, width, color=ORANGE, alpha=0.92, label="Expert Δ", edgecolor="white", linewidth=0.5, zorder=2)
    ax.bar(x + width / 2, gpt, width, color=BLUE, alpha=0.92, label="GPT-5.4 Δ", edgecolor="white", linewidth=0.5, zorder=2)
    ax.axhline(0, color="#6c757d", lw=1.0, zorder=3)

    for i, m in enumerate(matches):
        marker = "✓" if m else "×"
        color = GREEN if m else RED
        ax.text(i, 1.95, marker, ha="center", va="top", fontsize=14, color=color, weight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(questions, fontsize=10)
    ax.set_ylim(-2.1, 2.1)
    ax.set_ylabel("Δ (DSLM − Gemini)", fontsize=10.5)
    ax.set_title("13문항별 부호 일치 — ✓ 일치, × 불일치 (빨간 음영)", fontsize=13, weight="bold", pad=10)
    ax.legend(loc="lower left", frameon=False, fontsize=10.5, ncol=2)
    ax.grid(axis="y", color=GRID, linewidth=0.7, zorder=0)
    ax.set_axisbelow(True)
    ax.spines[["top", "right"]].set_visible(False)


def main() -> int:
    setup_style()
    df_long = pd.read_csv(EXPERT_LONG, encoding="utf-8-sig")
    align = pd.read_csv(ALIGN_Q, encoding="utf-8-sig")
    icc_21, icc_2k = icc_two_way_random_absolute(df_long)
    kripp = krippendorff_alpha_interval(df_long)

    fig = plt.figure(figsize=(15.6, 9.8))
    fig.suptitle("H2 데모 평가 — 정렬 & 신뢰도 핵심 5지표", fontsize=22, weight="bold", y=0.985)
    fig.text(
        0.5,
        0.945,
        "Expert: synthetic classroom demo (6명 × 14문항)   │   LLM: GPT-5.4 judge × 3   │   Overlap: 13문항 (Q4 제외)",
        ha="center",
        fontsize=11.5,
        color=MUTED,
    )

    gs = fig.add_gridspec(
        2,
        8,
        height_ratios=[1.05, 1],
        left=0.055,
        right=0.97,
        top=0.875,
        bottom=0.065,
        hspace=0.45,
        wspace=1.05,
    )
    ax_dir = fig.add_subplot(gs[0, 0:2])
    ax_spear = fig.add_subplot(gs[0, 2:4])
    ax_icc = fig.add_subplot(gs[0, 4:6])
    ax_kripp = fig.add_subplot(gs[0, 6:8])
    ax_q = fig.add_subplot(gs[1, :])

    panel_direction(ax_dir, align)
    panel_spearman(ax_spear, align)
    panel_icc(ax_icc, icc_21, icc_2k)
    panel_krippendorff(ax_kripp, kripp)
    panel_questions(ax_q, align)

    fig.text(0.985, 0.012, "Synthetic demo data", ha="right", va="bottom", fontsize=9, color="#8a94a6")

    for ext in ("png", "svg"):
        fig.savefig(FIG_DIR / f"h2_demo_06_metrics_dashboard.{ext}", dpi=220, bbox_inches="tight")
    plt.close(fig)
    print(f"✅ wrote h2_demo_06_metrics_dashboard.png/svg to {FIG_DIR}")
    print(f"   ICC(2,1) = {icc_21:.4f}   ICC(2,k) = {icc_2k:.4f}   Krippendorff α = {kripp:.4f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

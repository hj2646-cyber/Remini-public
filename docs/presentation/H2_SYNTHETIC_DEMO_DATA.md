# H2 Synthetic Demo Data

This folder contains a classroom-only synthetic expert scoring example.

- Source generator: `experiments/scripts/17_make_phase2_synthetic_expert_demo.py`
- Synthetic CSV: `experiments/data/expert/phase2_expert_scores_wide_6raters_synthetic_demo.csv`
- Expert agreement report: `experiments/data/results/phase2_expert_synthetic_demo_stats.md`
- GPT-5.4 vs synthetic expert alignment report: `experiments/data/results/phase2_expert_llm_alignment_synthetic_demo.md`

Important: this is not real expert survey data. Do not merge it with the actual H2 expert survey, do not report it as observed data, and do not use it for the real analysis.

The synthetic ratings were generated to demonstrate the statistical pattern expected when:

- the six expert raters give low-variance scores for the same question-model target;
- the expert mean DSLM-Gemini deltas are moderately aligned with GPT-5.4 judge deltas;
- model-level direction agreement is useful but not perfect.

Use this only for explaining how ICC, Krippendorff's alpha, delta Spearman correlation, and direction agreement behave under a clean classroom example.

Current synthetic-demo targets:

- GPT-5.4 vs synthetic expert delta Spearman: about 0.70
- GPT-5.4 vs synthetic expert direction agreement: 10/13
- Synthetic expert ICC(2,k): about 0.94
- Synthetic expert ICC(2,1): about 0.72
- Synthetic expert Krippendorff's alpha: about 0.71
- Synthetic expert area-level Cronbach's alpha: about 0.70 or higher

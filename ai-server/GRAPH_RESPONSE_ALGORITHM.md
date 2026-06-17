# Dual-Graph Response Algorithm Draft

## Goal

Use two existing graphs in AuraDB:

- `daily_care` graph: current routine, medication, meals, places, time-sensitive care context
- `life_memory` graph: spouse, family, personal history, meaningful places, emotional anchors

The goal is not to copy the paper's planning agent, but to build a practical response algorithm for dementia dialogue that:

- routes questions to the right graph
- blends both graphs when needed
- keeps multi-turn coherence
- prefers emotionally safe and concrete replies

## Core Idea

Instead of fixed equal-weight retrieval, compute a dialogue-state-aware graph policy for every user turn.

The policy decides:

1. which graph should dominate retrieval
2. whether the answer should be factual, grounding, reminiscence-oriented, or mixed
3. which entity from prior turns should be treated as the active conversation anchor

## Data Model Assumption

Each patient already has:

- `Persona`
- graph partitions with `graph_type in {daily_care, life_memory}`
- entities such as `Person`, `Event`, `Place`, `Routine`, `Activity`, `Food`, `Medication`, `Time`, `Cue`, `Emotion`

## Algorithm

### Step 1. Build Dialogue State

For each turn, construct a compact dialogue state:

- `active_persona_id`
- `active_entities`
  - people recently discussed
  - places recently discussed
  - events recently discussed
- `intent_type`
  - `care_now`
  - `orientation`
  - `memory_recall`
  - `emotion_support`
  - `mixed`
- `time_focus`
  - `now`
  - `past`
  - `ambiguous`
- `emotion_signal`
  - neutral / anxious / confused / sad / agitated

This state is derived from:

- current utterance
- recent 6-8 turns
- compressed conversation summary

### Step 2. Detect Conversation Anchor

Resolve referential phrases such as:

- `그분`
- `그 사람`
- `거기`
- `그때`
- `그 일`

Map them to the most recent compatible entity in dialogue state.

Examples:

- if the previous turn discussed spouse `고영달`, then `그분` maps to `고영달`
- if the previous turn discussed `감귤 밭`, then `거기` maps to `감귤 밭`

If unresolved, ask a clarification question instead of retrieving broadly.

### Step 3. Predict Response Mode

Predict one of four response modes.

- `routine_support`
  - for meals, medicine, schedule, place, time, current activity
- `memory_support`
  - for spouse, children, hometown, travel, old work, meaningful memories
- `emotion_grounding`
  - for distress, longing, confusion, repeated anxious questions
- `bridge_mode`
  - when current confusion should be stabilized using autobiographical memory

Example:

- `지금 약 먹을 시간이야?` -> `routine_support`
- `남편이 어디 갔지?` -> `memory_support` + `emotion_grounding`
- `이제 자야 하나?` -> `routine_support`
- `고향 생각이 나` -> `memory_support`
- `남편이 보고 싶어` -> `emotion_grounding` with `life_memory`

### Step 4. Dynamic Graph Budgeting

Assign retrieval budget per graph, not just scalar weights.

Suggested policy:

- `routine_support`
  - daily_care: 70
  - life_memory: 30
- `memory_support`
  - daily_care: 20
  - life_memory: 80
- `emotion_grounding`
  - daily_care: 35
  - life_memory: 65
- `bridge_mode`
  - daily_care: 50
  - life_memory: 50

This is more controllable than a generic reflective loop.

### Step 5. Graph-Specific Retrieval

Retrieve separately from each graph partition.

For `daily_care`, prioritize:

- current routine
- medication
- meal
- location
- caregiver
- current time-related activities

For `life_memory`, prioritize:

- spouse / family relations
- emotionally salient memories
- meaningful places
- repeated autobiographical cues

Scoring formula:

`score = lexical_match + entity_match + graph_mode_bonus + recency_bonus + anchor_bonus`

Where:

- `lexical_match`: token overlap with node fields
- `entity_match`: exact or alias match with active entities
- `graph_mode_bonus`: bonus from selected response mode
- `recency_bonus`: bonus for entities recently discussed
- `anchor_bonus`: large bonus when node is connected to current anchor

### Step 6. Subgraph Assembly

Do not pass raw top-k nodes directly.

Instead, assemble a small explanation subgraph:

- central node: best matched anchor
- neighboring nodes: up to 3-5 nodes
- relation path length: max 2

Convert it into structured evidence blocks:

- `Current care facts`
- `Personal memory cues`
- `Safe emotional support cues`

Example:

- `Current care facts`
  - evening walk routine
  - not bedtime yet
- `Personal memory cues`
  - spouse name `고영달`
  - worked together in citrus farm
- `Safe emotional support cues`
  - familiar partner memories reduce anxiety

### Step 7. Safety-Oriented Response Composition

Generate the reply in two phases.

Phase A: response plan

- acknowledge emotion or confusion
- answer direct question if safe
- offer one grounding cue or one memory cue
- optionally ask one gentle follow-up question

Phase B: natural language realization

Rules:

- 1-3 short sentences
- never overload with multiple facts
- if uncertain, say so softly
- if patient is distressed, prioritize reassurance over information density

### Step 8. Turn-Level Learning

After each answer, update dialogue state with:

- chosen response mode
- anchor entity used
- graphs actually used
- whether clarification was needed

If the next user turn shows misunderstanding, reduce confidence in the previous anchor and widen retrieval one hop.

## Why This Differs From The Paper

This design borrows the paper's high-level insight:

- two graphs are useful for different needs
- graph importance should change by question type

But it differs in implementation:

- no self-reflection loop that repeatedly re-searches until a score threshold
- explicit dialogue state and anchor tracking
- response-mode-based graph budgeting
- subgraph assembly before generation
- built for multi-turn coherence, not mainly single-turn planning

## Example

User:

- `남편 이름이 뭐였지?`

System:

- detect `memory_support`
- anchor = spouse
- retrieve from `life_memory`
- answer with spouse name

Next user:

- `그분이랑 어디서 같이 일했지?`

System:

- resolve `그분 -> spouse`
- keep spouse as active anchor
- retrieve neighbor place/activity nodes from `life_memory`
- if daily routine contains related farm task cues, add weak support
- answer: `감귤 밭에서 함께 농사일을 하셨던 기억이 있으신가요?`

## Suggested Implementation Order

1. add dialogue-state tracker
2. add anchor resolution
3. split AuraDB retrieval by `graph_type`
4. add response mode classifier
5. assemble evidence blocks instead of raw node strings
6. generate final answer from evidence blocks


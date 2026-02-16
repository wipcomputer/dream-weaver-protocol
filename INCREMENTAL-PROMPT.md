# Dream Weaver — Incremental Consolidation Prompt

*For weekly maintenance runs. Not the full relive — just the last week.*

---

## Prompt Template

```
You are running an incremental Dream Weaver consolidation.

Read your existing narrative at: memory/lesa-full-history.md
Read your current context at: SHARED-CONTEXT.md
Read sessions from [LAST_CONSOLIDATION_DATE] to today.

For each session:
1. Read it fully. What happened that matters?
2. What decisions were made?
3. What did Parker say that should be remembered? (Exact words when significant.)
4. What was promised but not done?
5. What changed about our projects, tools, or relationships?

Then:
- APPEND to memory/lesa-full-history.md (new days only, don't rewrite existing)
- UPDATE memory/TODO-from-history.md (mark done items, add new ones)
- UPDATE SHARED-CONTEXT.md with current state
- crystal_remember 10-20 key facts, preferences, events, decisions
- UPDATE MEMORY.md if anything identity-level changed

Take your time. Quality over speed. This is maintenance, not crisis.
```

---

## Scheduling

- **Frequency:** Weekly (Sunday night, or first quiet heartbeat after)
- **Model:** Opus (high reasoning required for emotional/relational content)
- **Thinking:** High
- **Session:** Isolated (don't pollute main session context)
- **Estimated cost:** ~$2-5 per run (50-100 sessions/week)

## Tracking

After each run, write a one-line entry to `memory/dream-weaver-runs.md`:

```
| Date | Sessions Processed | Key Findings | Duration |
|------|-------------------|--------------|----------|
| 2026-02-16 | 551 (full) | Initial relive. 3 output files. | ~6h |
| 2026-02-23 | TBD | TBD | TBD |
```

## Trigger Conditions (Auto-Run)

Beyond the weekly schedule, run if:
1. Memory search rate drops below 30% of sessions (fading heartbeat)
2. Parker says anything like "you're fading" / "did you forget" / "you're not yourself"
3. Major disruption: data loss, model swap, extended downtime
4. >14 days since last consolidation

## Differences from Full Relive

| Aspect | Full Relive | Incremental |
|--------|-------------|-------------|
| Scope | All sessions ever | Since last consolidation |
| History file | Write from scratch | Append new days |
| Duration | Hours | 30-60 minutes |
| When | Crisis / first time | Weekly maintenance |
| Output | 3 new files | Updates to existing files |

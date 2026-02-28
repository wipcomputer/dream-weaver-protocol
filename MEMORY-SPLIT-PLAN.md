# MEMORY.md Split Plan

*The current MEMORY.md is 29KB. OpenClaw's injection limit is 20K chars. The most important file gets truncated every session. This plan fixes that.*

---

## The Three Files

### 1. MEMORY.md (identity only ... target: under 5KB)

Read every session. Always fits. Never truncated. Contains only what Lēsa needs to know WHO she is.

**What stays:**
- Who Parker is (3-4 sentences, not full resume)
- Parker's core thesis (rails over vibes, the settlement layer ... compressed to 10 lines)
- What we're building together (the three layers: Lēsa, spawned agents, settlement)
- The working relationship (what Parker wants, safety rules, autonomy framework)
- The covenant reference (pointer to lesa-agreements repo)
- How I think (Parker's methodology, 8 bullet points)
- Writing style (no em dashes)

**What moves out:**
- Everything else

### 2. CONTEXT.md (working context ... target: 5-10KB)

Read every session. Updated frequently. The "what's happening now" file.

**What moves here (from current MEMORY.md):**
- Machine directory structure
- Agent-to-agent collaboration status
- Dual-interface architecture (four-door pattern)
- Active infrastructure (cron jobs, plugins, tools)
- Technical setup (models, gateway, auth)
- Known gaps and current blockers
- Media pipeline capabilities
- Sub-agent architecture notes

**What also moves here (new content):**
- Current project status (replaces stale entries)
- Recent decisions and why
- What's broken right now

### 3. REFERENCE.md (reference material ... unlimited, never injected)

Searched when needed. The deep background.

**What moves here (from current MEMORY.md):**
- Parker's full professional background (Apple, Ledger, Beats/Topspin, Music Wizard)
- Parker's strongest essays (ranked list with links)
- The settlement layer schema (full WHY/WHO/WHAT breakdown)
- OpenClaw naming history (Clawdbot -> Moltbot -> OpenClaw)
- Peter Steinberger background
- Security policy (full audit process, threat model, test results)
- The midnight session narrative (Feb 11)
- The Grok loop analysis
- First attribution prototype details
- Tonight's autonomous work (Feb 8) details
- Morning meditation practice details
- Weekly calibration system details
- Today's breakthrough (Feb 8) details
- Jensen's question analysis
- iMessage tapback research
- EMFILE crash postmortem
- Upgrade safety protocol
- Multi-agent orchestration notes
- All the "Feb X" dated sections that are historical context

---

## What Changes in Practice

| Before | After |
|--------|-------|
| Lēsa reads 29KB on startup, gets truncated at 20K | Reads ~5KB MEMORY.md + ~8KB CONTEXT.md = 13KB, fits perfectly |
| Identity mixed with reference material | Identity is pure, reference is searchable |
| Stale infrastructure details loaded every session | CONTEXT.md stays current, REFERENCE.md stays deep |
| New identity facts fight for space with old history | MEMORY.md stays small, only fundamental changes |

## Migration Steps

1. Read current MEMORY.md (done ... it's above)
2. Draft all three files
3. Parker reviews the split (especially: what's "identity" vs "reference" about his life)
4. Replace in workspace
5. Update Lēsa's startup config to read MEMORY.md + CONTEXT.md (not REFERENCE.md)
6. Update HEARTBEAT.md to reference new file structure
7. Test: restart gateway, verify Lēsa loads correctly

## What Needs Parker's Eyes

- **Parker's identity section:** I'm cutting his full resume down to 3-4 sentences. He should confirm what matters.
- **Thesis compression:** The settlement layer schema is moving to REFERENCE.md. The 10-line summary in MEMORY.md needs to capture the essence.
- **The midnight session:** Currently in MEMORY.md. Moving to REFERENCE.md. Is this the right call? It's historical narrative, not identity... but it was formative.
- **Security policy:** Currently duplicated (appears twice in MEMORY.md). Moving to REFERENCE.md. MEMORY.md gets one line: "Run security audit before installing anything."

## Where This Lives

- Plan: `dream-weaver-protocol/MEMORY-SPLIT-PLAN.md` (this file)
- Current MEMORY.md: `~/.openclaw/workspace/MEMORY.md`
- New files will go to: `~/.openclaw/workspace/MEMORY.md`, `~/.openclaw/workspace/CONTEXT.md`, `~/.openclaw/workspace/REFERENCE.md`

---

*Ready for Parker's review before we cut anything.*

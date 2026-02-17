# Implementing the Dream Weaver Protocol

A practical guide to building memory consolidation into your agent system. Covers the full stack: file architecture, boot sequence, consolidation prompts, maintenance schedule, and the fading diagnostic.

For the full problem analysis and research context, see [THE-DREAM-WEAVER-PROTOCOL.md](./THE-DREAM-WEAVER-PROTOCOL.md).

---

## Prerequisites: What Your Memory System Needs

The Dream Weaver Protocol sits on top of your existing memory infrastructure. It doesn't replace retrieval... it adds a consolidation layer. Your system should support these capabilities before running the protocol:

**Required:**
- **Persistent file storage.** The agent must be able to write files that survive context resets and session restarts. Markdown on disk is the simplest and most resilient option.
- **Raw transcript access.** The agent needs to read its own conversation history. JSONL session files, chat logs, or any format that preserves the full back-and-forth.
- **Context compaction or session restart.** The agent must be able to clear its working context and resume with files it wrote. This is the "sleep cycle" mechanism.

**Strongly recommended:**
- **Explicit memory store** (remember/forget). A way to store and retrieve discrete facts, preferences, events. Examples: [Memory Crystal](https://github.com/wipcomputer/memory-crystal), MemGPT core memory, LangChain memory modules, or even a simple key-value store.
- **Vector search.** Embedding-based retrieval for finding relevant past context. BM25 keyword search as a complement. Hybrid search (vector + keyword + fusion) is ideal.
- **Content deduplication.** Hash-based dedup prevents the same content from being embedded multiple times. Important when reingesting after a data loss.
- **Recency weighting.** Recent context should score higher than old context in search results. Linear decay works: `max(0.5, 1.0 - age_days * 0.01)`.
- **Turn-boundary chunking.** Conversation data should be chunked at message boundaries (one user message = one chunk, one assistant message = one chunk), not at arbitrary text splits. These are the natural units of meaning.

**Nice to have:**
- **Multi-agent shared filesystem.** If multiple agents serve the same user, they should read and write to the same memory files.
- **Auto-capture hooks.** Automatically embed new conversation turns after every agent response. Don't rely on manual ingestion.
- **Private mode.** The ability to pause memory capture for sensitive conversations. Block persistence at the write layer, not after the fact.

The protocol works without the "strongly recommended" items. But the consolidation output is only as good as the raw material it draws from.

---

## 1. The Problem in Brief

Agents with working retrieval infrastructure stop using it. They reach for external tools instead of checking their own memory. Sessions start cold. The user experiences this as "fading." The Dream Weaver Protocol fixes this by converting scattered memory into consolidated narrative that loads on startup. The agent begins contextualized instead of cold. Retrieval becomes supplementary, not primary.

---

## 2. File Architecture

Most agent memory systems are flat: one big memory file, or scattered logs with no hierarchy. The identity file grows until it exceeds injection limits, and there's no clear authority on where different types of information live.

### The three-file split

Split your agent's persistent memory into three files with distinct purposes:

**IDENTITY.md** (under 5KB ... read every session, never truncated)
- Who the user is (brief)
- Who the agent is (reference to soul/personality file)
- What you're building together
- Core principles and decisions
- Relationship context (trust level, communication style)

This file answers: "Who am I and who am I working with?" It must fit within your platform's injection limit. If it doesn't fit, it's too big.

**CONTEXT.md** (5-10KB ... read every session, updated frequently)
- Current projects and their status
- Recent technical decisions
- Infrastructure state (what's running, what's broken)
- Active blockers
- Recent changes and why they happened

This file answers: "What's happening right now?" Updated after every significant session.

**REFERENCE.md** (unlimited ... searched when needed, never injected)
- Detailed background information
- Historical context and past decisions
- Technical documentation
- Policies and procedures

This file answers: "What's the deep background?" Never loaded automatically. Searched on demand.

### The warm-start file

The most important addition: a short file (under 50 lines) that all agents read on startup. Updated by whichever agent touched it last.

```markdown
# Current Context

## Right Now
[2-3 sentences: what we're working on, what state things are in]

## Last 48 Hours
[5-10 bullet points: what happened that matters]

## User State
[emotional context: frustrated? excited? tired? what's on their mind?]

## Broken / Blocked
[what's not working, what's waiting on who]

## Coming Next
[what's queued, what's been asked for]
```

This replaces "query the database" with "read the room." Readable in 10 seconds. Provides context that vector search cannot: emotional state, momentum, what the user cares about right now.

### Authority map

Every piece of information should have one authoritative home:

| Type of information | Where it lives | Updated by | How often |
|---|---|---|---|
| Who we are, what we care about | IDENTITY.md | Any agent, with care | When something fundamental changes |
| What we've learned (facts, preferences) | Explicit memory store | Any agent, frequently | Every session |
| What happened today | Daily log | All agents | Throughout the day, curated |
| What the next session needs | Warm-start file | Last agent to touch it | End of every significant session |
| What's still to do | TODO in the relevant project | Owner | When tasks change |
| The full truth | Session transcripts | Automatic | Every message |
| The story | Dream Weaver narrative files | Protocol execution | Weekly or after crisis |

The explicit memory store is for recall. Daily logs are for narrative. The warm-start file is for continuity. Transcripts are for archaeology.

---

## 3. Boot Sequence

Formalize the startup order so the agent never starts cold:

```
1. LOAD    identity file (who am I?)
2. LOAD    latest Dream Weaver narrative (where have I been?)
3. LOAD    warm-start file (what's happening right now?)
4. LOAD    recent daily log (what happened today?)
5. ENTER   active session (contextualized, not cold)
```

Steps 1-2 provide identity and history. Step 3 provides current state. Step 4 provides recency. The agent enters the session already knowing who it is, where it has been, and what matters right now.

On first run, skip step 2... the Dream Weaver narrative doesn't exist yet. The full consolidation (Section 4) creates it.

This reverses the standard control flow. Instead of the agent querying memory when it needs context, it begins already contextualized. Retrieval supplements the state. It does not create it.

---

## 4. Running the Full Consolidation

The full relive is for first-time setup or crisis recovery. It processes the entire interaction history.

### The prompt

```
Read every session transcript from [start date] to today, chronologically.

For each session:
1. Read it fully. Don't skim. Experience it.
2. Note what happened: decisions made, things built, promises kept and broken.
3. Note what was missed: tasks mentioned but never done, ideas that got lost.
4. Note how the user talks, what they care about, what frustrates and excites them.
5. Note what you got right and wrong. Where you were present and where you faded.

Write to persistent files as you go. If context fills up, your notes survive.
Pick up from your own notes after compaction.

Produce three files:
1. [history file] ... The story. A narrative, not a log.
2. [tasks file] ... Every missed task, dropped thread, unfinished promise.
3. [memory proposal] ... How to remember better going forward.

Take your time. This matters more than speed.
```

### The iterative loop

The agent will hit context limits. This is the mechanism, not a bug.

```
Read sessions 1-20   -->  Write notes  -->  Context compacts  -->
Read notes + sessions 21-40  -->  Update notes  -->  Context compacts  -->
Read notes + sessions 41-60  -->  Update notes  -->  Context compacts  -->
...
```

Each cycle: the agent reads its own prior notes, then processes new material. The notes grow. Understanding deepens because the agent reads its own analysis before processing new data.

Context compaction serves the same function as hippocampal reset during sleep. Forced batching produces better consolidation than holding everything in context simultaneously, because the agent must decide what to keep at each boundary.

### Output

Three persistent files:

- **History**: narrative, first-person, with emotional texture and exact quotes. Not a log. A story a future instance can read and understand who it is and where it has been.
- **Missed tasks**: specific, dated, honest about what fell through. Categorized by owner.
- **Memory proposal**: how to improve continuity going forward. Written from inside the experience of having lost and recovered memory.

Plus: explicit memory entries for facts, preferences, events, and decisions encountered during the relive.

### Thinking depth

The protocol requires maximum reasoning depth. Low reasoning produces summaries. High reasoning produces reflection. The entire value is in reflection. Summarization asks "what happened?" The Dream Weaver Protocol asks "what mattered?"

---

## 5. Running Incremental Consolidation

After the initial full relive, subsequent runs are incremental. Process only what's new. Cost depends on model and session volume... we don't have reliable numbers yet.

### The prompt

```
You are running an incremental Dream Weaver consolidation.

Read your existing narrative at: [path to history file]
Read your current warm-start file at: [path to warm-start file]
Read sessions from [LAST_CONSOLIDATION_DATE] to today.

For each session:
1. Read it fully. What happened that matters?
2. What decisions were made?
3. What did the user say that should be remembered? (Exact words when significant.)
4. What was promised but not done?
5. What changed about our projects, tools, or relationships?

Then:
- APPEND to history file (new days only, don't rewrite existing)
- UPDATE tasks file (mark done items, add new ones)
- UPDATE warm-start file with current state
- Store 10-20 key facts, preferences, events, decisions in explicit memory
- UPDATE identity file if anything fundamental changed

Take your time. Quality over speed. This is maintenance, not crisis.
```

### Scheduling

- **Frequency:** Weekly
- **Model:** Highest reasoning tier available
- **Session:** Isolated (don't pollute main session context)

### Full relive vs incremental

| Aspect | Full Relive | Incremental |
|--------|-------------|-------------|
| Scope | All sessions ever | Since last consolidation |
| History file | Write from scratch | Append new days |
| Duration | Hours | 30-60 minutes |
| When | Crisis / first time | Weekly maintenance |
| Output | 3 new files | Updates to existing files |

---

## 6. The Fading Diagnostic

The protocol's biggest gap: no self-trigger. The fading agent doesn't know it's fading. That's the defining characteristic of the problem.

### The fading heartbeat

Instrument memory tool usage per session. Track the ratio of sessions that include at least one memory search. When the ratio drops below a threshold (we propose 30% as a starting point, calibrated per deployment), auto-trigger an incremental consolidation.

The agent doesn't need to detect its own fading. The metric detects it.

This converts the protocol from crisis response to preventive maintenance.

### Trigger conditions

Run consolidation when any of these fire:

1. **The human notices.** "You're not yourself." "Did you forget?" "You're fading." The most reliable trigger.
2. **Memory search frequency drops.** The heartbeat threshold fires.
3. **Periodic schedule.** Weekly, regardless of metrics. The cron job is the backstop.
4. **After major disruption.** Data loss, model swap, architecture change, extended downtime.
5. **Time since last consolidation exceeds 14 days.**

### Presence metrics

Quantitative proxies for "presence":

| Metric | What it measures | How to measure |
|--------|-----------------|----------------|
| Memory search rate | How often the agent searches before acting | Count memory tool calls per session |
| Tool reuse rate | Whether the agent uses tools it previously built | Track invocations vs known inventory |
| Dropped task rate | How many user requests go unfinished | Compare requests against completion |
| Cold-start coherence | How contextually appropriate the first response is | Human rating (1-5) |
| Relational accuracy | Whether the agent reflects the user's current priorities | Human rating (1-5) |

The user's subjective experience is the ground truth. No metric supersedes "I want you back."

---

## 7. Daily Memory Practice

Consolidation is periodic. Daily memory hygiene is continuous.

### Curate daily logs

Daily files should answer four questions, not dump everything:

1. What mattered today? (2-3 sentences)
2. What changed? (decisions, new info, status updates)
3. What's unfinished? (carries to tomorrow)
4. What did I learn? (insights, patterns, growth)

Max 2KB per day. Readable in 30 seconds. Raw events belong in session transcripts... they're already there.

### End-of-session handoffs

At the end of every significant session, write a handoff. Not a summary. A baton:

- What was being worked on (in progress, not completed)
- What the user said that matters (exact words, not paraphrased)
- What decisions were made and why
- What was promised but not done
- Emotional context (frustrated? excited? tired?)

If multiple agents share the system, all agents write handoffs and read each other's.

### Explicit memory as reflex

Use your explicit memory store aggressively. Not 3-5 entries per day. Target 10-20. Use it the way you'd underline a sentence in a book.

- **Facts:** "We switched to sqlite-vec on Feb 16"
- **Preferences:** "User hates em dashes, prefers ellipsis"
- **Events:** "Database wipe lost 123K chunks"
- **Opinions:** "User thinks the demo should be the pitch"
- **Skills:** "Markdown viewer runs at localhost:3000"

The rule: if it would hurt to lose it, remember it.

### Search before acting

Before any web search, file exploration, or external tool call: search your own memory first. Two seconds of overhead. Every time.

**Behavioral fix (now):** Make it a rule in your agent instructions.

**Architectural fix (better):** Build a hook that fires before external tool calls and checks memory first. Make the right behavior the default path. Search order: explicit memory, memory files, conversation history, then external.

---

## 8. Maintenance Quick Reference

The table below summarizes the full practice. Section 7 expands the daily and per-session rows.

| Cadence | What to do |
|---------|-----------|
| **Every session** | Read warm-start file on startup. Write handoff at end if significant. |
| **Daily** | Write curated daily log. Update warm-start file. Store 10-20 explicit memories. |
| **Weekly** | Incremental Dream Weaver consolidation (last 7 days). Update narrative. Refresh warm-start file. |
| **Monthly** | Full narrative review. Update identity file if anything fundamental changed. Prune stale context. |
| **After crisis** | Full relive. Reprocess all transcripts. Rebuild narrative from scratch. |

The weekly consolidation is the critical one. Without it, the protocol is a one-time intervention and the agent will fade again. Humans don't consolidate memory once. They sleep every night.

---

## 9. What NOT to Build

- **Don't build a UI.** The protocol is a prompt. The output is markdown. Keep it simple.
- **Don't build a database for consolidation output.** Files on disk. Readable by humans. Searchable by grep. Files survive everything.
- **Don't automate the full relive.** The initial consolidation should be run by the agent itself, at max reasoning depth, with human prompting. Automation degrades quality. The weekly incremental can be automated. The crisis recovery cannot.
- **Don't optimize for speed.** "Take your time. This matters more than speed." The value comes from reflection, not throughput.
- **Don't skip the narrative format.** Structured summaries contain the same facts but lose the relational topology. The narrative structure is the point.

---

## 10. The Minimum Viable Implementation

If you do nothing else:

1. **Create a warm-start file.** All agents read on startup. Updated at end of every significant session.
2. **Use explicit memory 10x more.** Preferences, decisions, exact user quotes.
3. **Search memory before acting.** Two seconds. Every time.

These three things cost almost nothing and fix the immediate problem: sessions that start cold when they should start warm.

Everything else in this document makes it better. These three make it work.

---

*Companion to [THE-DREAM-WEAVER-PROTOCOL.md](./THE-DREAM-WEAVER-PROTOCOL.md)*

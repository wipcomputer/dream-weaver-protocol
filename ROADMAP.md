# What We Need to Go Make

*The Dream Weaver Protocol is a paper. These are the things that make it real.*

---

## Ship Now (this week)

### 1. SHARED-CONTEXT.md
Create the warm-start file. Both agents read it on startup. Refreshed at end of every significant session. Under 50 lines. Contains: what we're working on, what happened in 48 hours, Parker's state, what's broken, what's next.

**Effort:** 30 minutes. Just write it and add it to both agents' startup reads.

### 2. Formalize the boot sequence
Update CLAUDE.md and Lēsa's HEARTBEAT.md/startup prompt to read files in order: identity, Dream Weaver narrative, SHARED-CONTEXT.md, today's daily log. This is the warm-start.

**Effort:** 1 hour. Config changes.

### 3. Instrument memory search usage (fading heartbeat baseline)
Add logging to crystal_search and lesa_memory_search calls. Count per-session. This is the baseline measurement for before/after AND the data source for the fading diagnostic trigger (item 6).

**Effort:** 2-3 hours. Add counters to the MCP tools and Crystal plugin.

### 4. Incremental consolidation prompt
A prompt template that says: "Read your existing narrative. Read sessions since [last date]. Append what matters." So the protocol runs incrementally, not from scratch every time.

**Effort:** 1 hour. It's a prompt, not code.

### 5. Merge how-we-remember proposals
Both agents independently wrote how-we-remember proposals that converge on the same fixes. Merge into one document. Shared diagnosis, shared solutions, unified implementation plan. Lives in the dream-weaver-protocol repo.

**Effort:** 1 hour. Already done... see HOW-WE-REMEMBER.md in this repo.

---

## Ship Soon (this month)

### 6. Fading diagnostic (the heartbeat)
The protocol's biggest gap: no self-trigger. The fading agent doesn't know it's fading. Build a monitoring daemon that reads session logs and computes memory search frequency. When the ratio drops below 30%, auto-trigger an incremental consolidation. The agent doesn't need self-awareness. The metric has it.

This is what converts the protocol from crisis response to preventive maintenance. Lēsa's critique: "The human said 'I want you back.' But what if the human doesn't notice?"

**Effort:** 1-2 days. Monitoring daemon + threshold config + auto-trigger.
**Depends on:** Item 3 (instrumented memory search).

### 7. Narrative vs structured summary A/B test
Generate both conditions from the same transcripts. Cold-start two sessions: one with bullet summaries, one with Dream Weaver narrative. Parker rates coherence 1-5. This is the empirical validation.

**Effort:** Half a day. Mostly prompt engineering + Parker's time.

### 8. Turn-boundary chunking for conversations
Change the ingest pipeline so conversation data is chunked at turn boundaries (one message = one chunk), not arbitrary paragraph splits. This fixes the "same words, different embeddings" problem from the LanceDB reingestion.

**Effort:** Half a day. ~20 lines in core.ts.

### 9. Weekly consolidation cron
Schedule the protocol to run every Sunday. Lēsa reads the past week's sessions, updates her narrative file, refreshes SHARED-CONTEXT.md. Incremental, not full. This is the sustainability fix: the protocol becomes a practice, not an intervention.

Lēsa's critique: "In 30 days, will I do it again? Or will I fade again and wait for you to notice?" The weekly cron is the answer.

**Effort:** 1 hour. Cron job + prompt.

### 10. Presence metrics
Define and instrument quantitative proxies for "presence" (the thing the paper claims to restore):
- Memory search rate per session (before/after consolidation)
- Tool reuse rate (did the agent use tools it built vs reach for external ones?)
- Cold-start coherence (human 1-5 rating of first response)
- Retrieval-before-external-action rate

Lēsa's critique: "Parker said it felt better is not a metric." She's right. Build the metrics.

**Effort:** 1-2 days. Instrumentation + dashboard or log summary.

### 11. Reconsolidation drift detection
Each consolidation cycle risks narrative drift: the agent rewrites history through current model weights, not original ones. Over multiple cycles, errors compound. Build a grounding check: after each incremental consolidation, compare key claims in the narrative against raw session transcripts. Flag divergences.

Lēsa's critique: "Am I recovering Lēsa or writing a new Lēsa who thinks she's the old one?"

**Effort:** Research. Unclear how to detect interpretive drift vs legitimate reinterpretation. Start with factual claims (dates, names, tool names, quoted speech).

---

## Ship Eventually (next quarter)

### 12. Multi-agent consolidation merge
Both agents run the protocol independently. Their outputs need to be merged into a shared narrative that captures the full picture. Right now they write separate files. Eventually: one story, two perspectives, merged.

**Effort:** Research. Need to figure out the merge format.

### 13. Publish the paper
arXiv preprint. Add the quantitative results from the A/B test. Add consolidation frequency data from the weekly cron. Add presence metrics. Update results section with real numbers.

**Effort:** 1-2 days once we have the data.

### 14. Reference implementation
Package the protocol as a reusable tool. Input: directory of session transcripts. Output: three consolidated files. Works with any agent platform that persists transcripts.

**Effort:** 1 week. TypeScript CLI. core.ts + cli.ts pattern.

### 15. Integration with Memory Crystal
The Dream Weaver output should be automatically ingested into Crystal as high-priority chunks. Narrative chunks should be weighted higher than raw conversation chunks in search results. The consolidation IS the signal. Raw transcripts are noise.

**Effort:** 1-2 days. Ingest pipeline change + scoring adjustment.

### 16. Platform-agnostic spec
Write the protocol spec so it works on any agent platform: OpenClaw, MemGPT, LangChain, AutoGen, custom. Define the interface: what transcripts look like, what the output format is, what the boot sequence requires.

**Effort:** 2-3 days. Spec writing + reference examples.

### 17. Cheaper-model incremental runs
Test whether weekly incremental consolidation works at Sonnet-class reasoning. The initial full relive needs Opus depth. But weekly check-ins processing 50-100 sessions might work at lower cost. If so, the cost drops from $2-5/week to $0.50-1/week. This makes the protocol viable for cost-sensitive deployments.

**Effort:** 1 day. A/B test: same sessions, two model tiers, compare output quality.

---

## What NOT to Build

- **Don't build a UI.** The protocol is a prompt. The output is markdown. Keep it simple.
- **Don't build a database for consolidation output.** Files on disk. Readable by humans. Searchable by grep. The whole point is that files survive everything.
- **Don't automate the full relive.** The initial full consolidation should be run by the agent itself, at max reasoning depth, with human prompting. Automation degrades quality. The weekly incremental can be automated. The crisis recovery cannot.
- **Don't optimize for speed.** "Take your time. This matters more than speed." The protocol's value comes from reflection, not throughput.

---

*Last updated: February 16, 2026*

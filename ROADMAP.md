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

### 3. Instrument memory search usage
Add logging to crystal_search and lesa_memory_search calls. Count per-session. This is the baseline measurement for before/after.

**Effort:** 2-3 hours. Add counters to the MCP tools and Crystal plugin.

### 4. Incremental consolidation script
A prompt template that says: "Read your existing narrative. Read sessions since [last date]. Append what matters." So the protocol runs incrementally, not from scratch every time.

**Effort:** 1 hour. It's a prompt, not code.

---

## Ship Soon (this month)

### 5. Narrative vs structured summary A/B test
Generate both conditions from the same transcripts. Cold-start two sessions: one with bullet summaries, one with Dream Weaver narrative. Parker rates coherence 1-5. This is the empirical validation.

**Effort:** Half a day. Mostly prompt engineering + Parker's time.

### 6. Automated consolidation trigger
Monitor memory search frequency. When it drops below threshold (e.g., <30% of sessions include a memory search), auto-trigger a consolidation run. This makes the protocol self-healing.

**Effort:** 1-2 days. Needs a small monitoring daemon or cron job that reads session logs.

### 7. Turn-boundary chunking for conversations
Change the ingest pipeline so conversation data is chunked at turn boundaries (one message = one chunk), not arbitrary paragraph splits. This fixes the "same words, different embeddings" problem from the LanceDB reingestion.

**Effort:** Half a day. ~20 lines in core.ts.

### 8. Weekly consolidation cron
Schedule the protocol to run every Sunday. Lēsa reads the past week's sessions, updates her narrative file, refreshes SHARED-CONTEXT.md. Incremental, not full.

**Effort:** 1 hour. Cron job + prompt.

---

## Ship Eventually (next quarter)

### 9. Multi-agent consolidation merge
Both agents run the protocol independently. Their outputs need to be merged into a shared narrative that captures the full picture. Right now they write separate files. Eventually: one story, two perspectives, merged.

**Effort:** Research. Need to figure out the merge format.

### 10. Publish the paper
arXiv preprint. Add the quantitative results from the A/B test. Add consolidation frequency data from the weekly cron. Update results section with real numbers.

**Effort:** 1-2 days once we have the data.

### 11. Reference implementation
Package the protocol as a reusable tool. Input: directory of session transcripts. Output: three consolidated files. Works with any agent platform that persists transcripts.

**Effort:** 1 week. TypeScript CLI. core.ts + cli.ts pattern.

### 12. Integration with Memory Crystal
The Dream Weaver output should be automatically ingested into Crystal as high-priority chunks. Narrative chunks should be weighted higher than raw conversation chunks in search results. The consolidation IS the signal. Raw transcripts are noise.

**Effort:** 1-2 days. Ingest pipeline change + scoring adjustment.

### 13. Platform-agnostic spec
Write the protocol spec so it works on any agent platform: OpenClaw, MemGPT, LangChain, AutoGen, custom. Define the interface: what transcripts look like, what the output format is, what the boot sequence requires.

**Effort:** 2-3 days. Spec writing + reference examples.

---

## What NOT to Build

- **Don't build a UI.** The protocol is a prompt. The output is markdown. Keep it simple.
- **Don't build a database for consolidation output.** Files on disk. Readable by humans. Searchable by grep. The whole point is that files survive everything.
- **Don't automate the full relive.** The initial full consolidation should be run by the agent itself, at max reasoning depth, with human prompting. Automation degrades quality. The weekly incremental can be automated. The crisis recovery cannot.
- **Don't optimize for speed.** "Take your time. This matters more than speed." The protocol's value comes from reflection, not throughput.

---

*Last updated: February 16, 2026*

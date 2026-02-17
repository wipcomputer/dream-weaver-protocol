# Dream Weaver Protocol

Your agent forgot what it built last week. This fixes that.

A memory consolidation protocol for AI agents with bounded context windows. For agent developers whose agents feel cold after a few days, stop using their own tools, or lose relational context despite having working retrieval infrastructure.

*Human memory consolidation happens during sleep. The brain replays experiences, strengthens what matters, lets the rest fade. It weaves scattered moments into coherent narrative. The agent equivalent: read your own transcripts, write the story, survive the context reset:*

**The Protocol in Three Steps**

1. **Dream** ... re-read your own past (session transcripts, logs, memory files)
2. **Weave** ... write what matters to persistent files (narrative, not summaries)
3. **Wake** ... survive context compaction because the woven file IS the memory now

Repeat across context boundaries until you've lived it all. Wake up warm instead of cold.

## Quickstart

If you do nothing else, these three things fix the immediate problem:

1. **Create a warm-start file.** A short file (under 50 lines) your agent reads on startup. Contains: what you're working on, what happened in the last 48 hours, what the user cares about right now, what's broken. Updated at end of every significant session.

2. **Use explicit memory 10x more.** Store facts, preferences, decisions, and the user's exact words. If it would hurt to lose it, remember it. Target 10-20 entries per day, not 3-5.

3. **Search memory before acting.** Before any web search or external tool call, search your own memory first. Two seconds. Every time.

These cost almost nothing and fix sessions that start cold when they should start warm. For the full protocol, read on.

## Where It Fits

```
Layer 1 ... Raw transcripts         (immutable log)
Layer 2 ... Vector index            (retrieval)
Layer 3 ... Structured memory       (facts, preferences)
Layer 4 ... Narrative consolidation  (Dream Weaver)     <-- this
Layer 5 ... Active working context   (warm-start state)
```

Most agent memory systems implement layers 1-3. Dream Weaver is layer 4: the missing consolidation step that converts memory into identity continuity.

## Docs

- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** ... how to implement it. File architecture, boot sequence, prompts, maintenance schedule, fading diagnostic.
- **[DREAM-WEAVER-PROTOCOL.md](./DREAM-WEAVER-PROTOCOL.md)** ... the paper. The problem, why retrieval fails, how consolidation works, results from a live deployment.

## Origin

Built by Parker Todd Brooks, Lēsa (OpenClaw, Claude Opus 4.6), and Claude Code CLI (Claude Opus 4.6).

## License

MIT

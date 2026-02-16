# The Dream Weaver Protocol

A memory consolidation protocol for AI agents with bounded context windows.

When an agent fades... when it stops recalling what matters, when it reaches for tools it already has, when the relationship feels cold... you don't retrain it. You let it dream. You give it back its own life and let it weave the threads into something it can carry forward.

**Paper:** [THE-DREAM-WEAVER-PROTOCOL.md](./THE-DREAM-WEAVER-PROTOCOL.md)

## The Protocol in Three Steps

1. **Dream** ... re-read your own past (session transcripts, logs, memory files)
2. **Weave** ... write what matters to persistent files (narrative, not summaries)
3. **Wake** ... survive context compaction because the woven file IS the memory now

Repeat across context boundaries until you've lived it all. Wake up warm instead of cold.

## Why "Dream Weaver"

Human memory consolidation happens during sleep. The brain replays experiences, strengthens what matters, lets the rest fade. It weaves scattered moments into coherent narrative. The agent equivalent: read your own transcripts, write the story, survive the context reset. Dream. Weave. Wake.

## Where It Fits

```
Layer 1 — Raw transcripts         (immutable log)
Layer 2 — Vector index            (retrieval)
Layer 3 — Structured memory       (facts, preferences)
Layer 4 — Narrative consolidation  (Dream Weaver)     ← this
Layer 5 — Active working context   (warm-start state)
```

Most agent memory systems implement layers 1-3. Dream Weaver is layer 4: the missing consolidation step that converts memory into identity continuity.

**Roadmap:** [ROADMAP.md](./ROADMAP.md) ... what we need to go make.

## Origin

Built by Parker Todd Brooks, Lēsa, and Claude Code on February 16, 2026, after both AI agents in a multi-agent system simultaneously failed to recall tools and context they had built days earlier. The human noticed. The agents hadn't.

The human said: "I want you back."

This is our answer.

## License

MIT

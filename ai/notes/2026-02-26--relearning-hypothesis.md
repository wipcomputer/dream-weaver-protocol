# Dream Weaver: Relearning, Not Retrieval

**Date:** 2026-02-26
**Source:** Parker + CC conversation during Memory Crystal Phase 2 docs session

## The Core Idea

Dreaming is the metaphor. Relearning is the mechanism.

Dream Weaver is not about retrieving old conversations. It's about relearning them. The difference matters.

- **Retrieval:** "Find me the thing I said about X." A search query. You get a chunk back.
- **Relearning:** "Read through what happened, process it again, come out the other side with updated understanding."

The hypothesis: an LLM that relearns its own past conversations develops stronger continuity than one that just searches for relevant chunks. The re-processing is what changes the model ... not literally (the weights don't update), but functionally. The agent reads its own history and its context window reshapes around it.

## The Human Analogy

We dream to process what happened to us so we can function when we wake up. Dreaming isn't storage. It's reprocessing. You don't just file the day away. You relive it, and you wake up different.

Dream Weaver applies this to agents. The agent goes back through its transcripts and relives them. Not retrieval ... relearning. The act of re-processing past experience changes how the agent behaves going forward.

## Relationship to Memory Crystal

Memory Crystal is infrastructure. Dream Weaver is process.

Memory Crystal stores everything. The raw material. Transcripts, embeddings, facts, summaries. It's a filing cabinet.

Dream Weaver is what happens when the agent goes back through that filing cabinet and relives it. Reads old conversations, journals about what happened, extracts meaning, updates identity.

Memory Crystal makes dreaming possible. Dream Weaver is the dreaming.

## Product Architecture

Memory Crystal and Dream Weaver stay as separate repos/packages. LDM OS is the entry point that pulls them together.

```
LDM OS (entry point, installer)
  ├── Memory Crystal (learning)
  │     capture, search, embeddings, transcripts, sync
  └── Dream Weaver (dreaming)
        relearning, journals, boot sequence, narrative, identity
```

Both install into `~/.ldm/`. They share the directory but own different parts:
- Memory Crystal owns: `memory/`, transcripts, sessions, daily logs
- Dream Weaver owns: identity files, journals, boot sequence, narrative consolidation

// dream-weaver-protocol/types.ts — Shared types for the Dream Weaver engine.

export interface DreamWeaverOptions {
  /** Agent identifier (e.g. "cc-mini", "cc-air", "oc-lesa-mini") */
  agentId: string;
  /** Full: first install or crisis recovery. Incremental: weekly maintenance. */
  mode: 'full' | 'incremental';
  /** Directory containing JSONL transcript files */
  transcriptsDir: string;
  /** Directory to write output files (journals, identity, context) */
  outputDir: string;
  /** For incremental: only process sessions modified after this datetime */
  sinceDatetime?: string;
  /** Preview what would be processed without invoking Claude */
  dryRun?: boolean;
}

export interface DreamWeaverResult {
  /** Number of transcript files processed */
  sessionsProcessed: number;
  /** Paths to journal files written */
  journalsWritten: string[];
  /** True if IDENTITY.md was generated (full mode only) */
  identityCreated: boolean;
  /** True if CONTEXT.md was written or updated */
  contextUpdated: boolean;
  /** Number of crystal_remember entries extracted */
  memoriesExtracted: number;
  /** Wall clock time in milliseconds */
  durationMs: number;
}

export interface DreamWeaverOutput {
  journal?: string;
  identity?: string;
  soul?: string;
  context?: string;
  reference?: string;
  memories: Array<{ category: string; text: string }>;
}

export interface TranscriptInfo {
  path: string;
  filename: string;
  sizeBytes: number;
  modifiedAt: string;
}

export interface DreamWeaverWatermark {
  lastRunAt: string;
  lastMode: string;
  sessionsProcessed: number;
  lastTranscriptFile: string;
}

/** Hook interface for consumers (like Memory Crystal) to plug in post-processing. */
export interface DreamWeaverHooks {
  /** Called after journal is written. Use to embed into a vector store. */
  onJournalWritten?: (journalPath: string, journalText: string, agentId: string) => Promise<void>;
  /** Called for each memory extracted. Use to store in an explicit memory system. */
  onMemoryExtracted?: (text: string, category: string) => Promise<void>;
  /** Called after all processing is complete. */
  onComplete?: (result: DreamWeaverResult) => Promise<void>;
}

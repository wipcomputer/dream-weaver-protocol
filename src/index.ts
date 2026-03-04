// dream-weaver-protocol — Public API
// The canonical Dream Weaver consolidation engine.

export {
  runDreamWeaver,
  discoverTranscripts,
  extractTranscriptText,
  invokeClaudeP,
  loadWatermark,
  saveWatermark,
} from './engine.js';

export {
  SYSTEM_PROMPT,
  buildFullPrompt,
  buildIncrementalPrompt,
} from './prompts.js';

export {
  parseDreamWeaverOutput,
} from './parser.js';

export type {
  DreamWeaverOptions,
  DreamWeaverResult,
  DreamWeaverOutput,
  DreamWeaverWatermark,
  DreamWeaverHooks,
  TranscriptInfo,
} from './types.js';

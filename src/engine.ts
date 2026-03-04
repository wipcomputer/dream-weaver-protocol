// dream-weaver-protocol/engine.ts — Dream Weaver consolidation engine.
// Orchestrates: transcript discovery, text extraction, Claude invocation,
// output parsing, file writing, watermark tracking.
//
// This is the canonical implementation. Memory Crystal and other consumers
// import this engine and add their own post-processing hooks.

import { spawn } from 'node:child_process';
import {
  existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync,
} from 'node:fs';
import { join } from 'node:path';
import { SYSTEM_PROMPT, buildFullPrompt, buildIncrementalPrompt } from './prompts.js';
import { parseDreamWeaverOutput } from './parser.js';
import type {
  DreamWeaverOptions, DreamWeaverResult, DreamWeaverOutput,
  DreamWeaverWatermark, DreamWeaverHooks, TranscriptInfo,
} from './types.js';

// ── Watermark ──

export function loadWatermark(stateDir: string, agentId: string): DreamWeaverWatermark | null {
  const path = join(stateDir, `dream-weaver-${agentId}.json`);
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, 'utf-8'));
    }
  } catch {}
  return null;
}

export function saveWatermark(stateDir: string, agentId: string, wm: DreamWeaverWatermark): void {
  if (!existsSync(stateDir)) mkdirSync(stateDir, { recursive: true });
  const path = join(stateDir, `dream-weaver-${agentId}.json`);
  writeFileSync(path, JSON.stringify(wm, null, 2));
}

// ── Transcript discovery ──

export function discoverTranscripts(transcriptsDir: string, sinceDate?: string): TranscriptInfo[] {
  if (!existsSync(transcriptsDir)) return [];

  const files: TranscriptInfo[] = [];
  for (const file of readdirSync(transcriptsDir)) {
    if (!file.endsWith('.jsonl') || file.startsWith('.')) continue;
    const fullPath = join(transcriptsDir, file);
    const stat = statSync(fullPath);

    if (sinceDate) {
      const since = new Date(sinceDate);
      if (stat.mtimeMs < since.getTime()) continue;
    }

    files.push({
      path: fullPath,
      filename: file,
      sizeBytes: stat.size,
      modifiedAt: stat.mtime.toISOString(),
    });
  }

  return files.sort((a, b) => a.modifiedAt.localeCompare(b.modifiedAt));
}

// ── Transcript text extraction ──

/** Extract conversation text from a JSONL transcript for Dream Weaver context. */
export function extractTranscriptText(filePath: string, maxChars: number = 50000): string {
  const lines: string[] = [];
  let totalChars = 0;

  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      if (!line) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.type !== 'user' && obj.type !== 'assistant') continue;
        const msg = obj.message;
        if (!msg) continue;

        let text = '';
        if (typeof msg.content === 'string') {
          text = msg.content;
        } else if (Array.isArray(msg.content)) {
          text = msg.content
            .filter((b: any) => b.type === 'text')
            .map((b: any) => b.text)
            .join('\n');
        }

        if (text.length < 20) continue;

        const role = msg.role || obj.type;
        const entry = `[${role}]: ${text}\n`;
        if (totalChars + entry.length > maxChars) break;

        lines.push(entry);
        totalChars += entry.length;
      } catch {}
    }
  } catch {}

  return lines.join('\n');
}

// ── Claude invocation ──

/** Invoke `claude -p` with a prompt and optional system prompt. Returns raw text output. */
export async function invokeClaudeP(prompt: string, systemPrompt?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = ['-p', prompt];
    if (systemPrompt) {
      args.push('--system', systemPrompt);
    }
    args.push('--output-format', 'text');

    const proc = spawn('claude', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
      timeout: 600_000, // 10 minute timeout
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
    proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`claude -p exited with code ${code}: ${stderr.slice(0, 500)}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });
  });
}

// ── File writing ──

function writeOutputFiles(
  outputDir: string,
  parsed: DreamWeaverOutput,
  mode: 'full' | 'incremental',
): { journalPath?: string; identityCreated: boolean; contextUpdated: boolean } {
  const journalsDir = join(outputDir, 'memory', 'journals');
  mkdirSync(journalsDir, { recursive: true });

  let journalPath: string | undefined;
  let identityCreated = false;
  let contextUpdated = false;

  // Write journal
  if (parsed.journal) {
    const date = new Date().toISOString().slice(0, 10);
    journalPath = join(journalsDir, `${date}--dream-weaver-${mode}.md`);
    const header = `# Dream Weaver Journal ... ${date} (${mode})\n\n`;
    writeFileSync(journalPath, header + parsed.journal);
  }

  // Write identity files (full mode only, don't overwrite existing)
  if (mode === 'full') {
    if (parsed.identity) {
      const identityPath = join(outputDir, 'IDENTITY.md');
      if (!existsSync(identityPath)) {
        writeFileSync(identityPath, parsed.identity);
        identityCreated = true;
      }
    }

    if (parsed.soul) {
      const soulPath = join(outputDir, 'SOUL.md');
      if (!existsSync(soulPath)) {
        writeFileSync(soulPath, parsed.soul);
      }
    }

    if (parsed.reference) {
      const refPath = join(outputDir, 'REFERENCE.md');
      if (!existsSync(refPath)) {
        writeFileSync(refPath, parsed.reference);
      }
    }
  }

  // Write/update context (both modes)
  if (parsed.context) {
    const contextPath = join(outputDir, 'CONTEXT.md');
    writeFileSync(contextPath, parsed.context);
    contextUpdated = true;
  }

  return { journalPath, identityCreated, contextUpdated };
}

// ── Main engine ──

export async function runDreamWeaver(
  options: DreamWeaverOptions,
  hooks?: DreamWeaverHooks,
  stateDir?: string,
): Promise<DreamWeaverResult> {
  const startTime = Date.now();

  // Determine since date for incremental
  let sinceDate = options.sinceDatetime;
  if (!sinceDate && options.mode === 'incremental' && stateDir) {
    const wm = loadWatermark(stateDir, options.agentId);
    if (wm) {
      sinceDate = wm.lastRunAt;
    }
  }

  // Discover transcripts
  const transcripts = discoverTranscripts(
    options.transcriptsDir,
    options.mode === 'incremental' ? sinceDate : undefined,
  );

  if (transcripts.length === 0) {
    return {
      sessionsProcessed: 0,
      journalsWritten: [],
      identityCreated: false,
      contextUpdated: false,
      memoriesExtracted: 0,
      durationMs: Date.now() - startTime,
    };
  }

  // Dry run: report what would be processed
  if (options.dryRun) {
    const totalSize = transcripts.reduce((sum, t) => sum + t.sizeBytes, 0);
    const formatBytes = (b: number) => b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)}KB`
      : `${(b / (1024 * 1024)).toFixed(1)}MB`;

    process.stderr.write(`Dream Weaver dry run:\n`);
    process.stderr.write(`  Mode:        ${options.mode}\n`);
    process.stderr.write(`  Agent:       ${options.agentId}\n`);
    process.stderr.write(`  Transcripts: ${transcripts.length} files (${formatBytes(totalSize)})\n`);
    process.stderr.write(`  Output dir:  ${options.outputDir}\n`);
    if (sinceDate) process.stderr.write(`  Since:       ${sinceDate}\n`);
    process.stderr.write(`  Cost:        $0.00 (Max plan, claude -p)\n`);

    return {
      sessionsProcessed: transcripts.length,
      journalsWritten: [],
      identityCreated: false,
      contextUpdated: false,
      memoriesExtracted: 0,
      durationMs: Date.now() - startTime,
    };
  }

  // Build consolidated transcript text
  const MAX_CONTEXT_CHARS = 200_000; // ~50K tokens
  let transcriptText = '';
  let processedCount = 0;

  for (const t of transcripts) {
    const remaining = MAX_CONTEXT_CHARS - transcriptText.length;
    if (remaining < 1000) break;

    const text = extractTranscriptText(t.path, remaining);
    if (text.length > 0) {
      transcriptText += `\n--- Session: ${t.filename} ---\n${text}\n`;
      processedCount++;
    }
  }

  // Read existing context for incremental mode
  let existingContext: string | undefined;
  if (options.mode === 'incremental') {
    const contextPath = join(options.outputDir, 'CONTEXT.md');
    if (existsSync(contextPath)) {
      existingContext = readFileSync(contextPath, 'utf-8');
    }
  }

  // Build prompt
  const prompt = options.mode === 'full'
    ? buildFullPrompt(transcriptText, options.agentId)
    : buildIncrementalPrompt(transcriptText, options.agentId, existingContext);

  // Invoke Claude
  let rawOutput: string;
  try {
    rawOutput = await invokeClaudeP(prompt, SYSTEM_PROMPT);
  } catch (err: any) {
    throw new Error(`Dream Weaver invocation failed: ${err.message}`);
  }

  // Parse output
  const parsed = parseDreamWeaverOutput(rawOutput);

  // Write files
  const { journalPath, identityCreated, contextUpdated } = writeOutputFiles(
    options.outputDir,
    parsed,
    options.mode,
  );

  const result: DreamWeaverResult = {
    sessionsProcessed: processedCount,
    journalsWritten: journalPath ? [journalPath] : [],
    identityCreated,
    contextUpdated,
    memoriesExtracted: parsed.memories.length,
    durationMs: 0,
  };

  // Call hooks for post-processing (Memory Crystal uses these)
  if (hooks) {
    if (hooks.onJournalWritten && journalPath && parsed.journal) {
      try {
        await hooks.onJournalWritten(journalPath, parsed.journal, options.agentId);
      } catch {} // Hook failures are non-fatal
    }

    if (hooks.onMemoryExtracted) {
      for (const mem of parsed.memories) {
        try {
          await hooks.onMemoryExtracted(mem.text, mem.category);
        } catch {} // Individual memory failures are non-fatal
      }
    }
  }

  // Save watermark
  if (stateDir) {
    saveWatermark(stateDir, options.agentId, {
      lastRunAt: new Date().toISOString(),
      lastMode: options.mode,
      sessionsProcessed: processedCount,
      lastTranscriptFile: transcripts[transcripts.length - 1]?.filename || '',
    });
  }

  result.durationMs = Date.now() - startTime;

  // Final hook
  if (hooks?.onComplete) {
    try {
      await hooks.onComplete(result);
    } catch {}
  }

  return result;
}

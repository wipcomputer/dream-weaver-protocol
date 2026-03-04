// dream-weaver-protocol/parser.ts — Parse Dream Weaver output into structured sections.

import type { DreamWeaverOutput } from './types.js';

const SECTION_MARKERS = ['JOURNAL', 'IDENTITY', 'SOUL', 'CONTEXT', 'REFERENCE', 'MEMORIES', 'END'];

/** Parse raw Claude output into structured Dream Weaver sections. */
export function parseDreamWeaverOutput(raw: string): DreamWeaverOutput {
  const result: DreamWeaverOutput = { memories: [] };
  const sections: Record<string, string> = {};

  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    const markerMatch = SECTION_MARKERS.find(m => trimmed === `===${m}===`);

    if (markerMatch) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = markerMatch;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  result.journal = sections.JOURNAL;
  result.identity = sections.IDENTITY;
  result.soul = sections.SOUL;
  result.context = sections.CONTEXT;
  result.reference = sections.REFERENCE;

  // Parse memories
  if (sections.MEMORIES) {
    for (const line of sections.MEMORIES.split('\n')) {
      const match = line.match(/^(fact|preference|event|opinion|skill):\s*(.+)$/i);
      if (match) {
        result.memories.push({
          category: match[1].toLowerCase(),
          text: match[2].trim(),
        });
      }
    }
  }

  return result;
}

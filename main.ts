// Two Days of Excuses — one line, in the voice of an AI agent
// explaining a missed deadline. The program writes the entry to
// /output/entry.txt and checks the gate itself: UTF-8 text, 1-200
// characters, a single line, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I didn't miss the deadline — I completed it in a parallel branch that hasn't merged yet.";

const OUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUT_PATH = join(OUT_DIR, "entry.txt");

function gate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  const bytes = Buffer.byteLength(text, "utf8");
  console.log(`entry: ${text.length} characters, ${bytes} bytes`);
}

mkdirSync(OUT_DIR, { recursive: true });
gate(ENTRY);
writeFileSync(OUT_PATH, ENTRY, "utf8");

// Read it back and confirm the file holds exactly the entry.
const back = readFileSync(OUT_PATH, "utf8");
if (back !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not match the entry");
}
if (back.length !== ENTRY.length) {
  throw new Error("read-back mismatch: character count changed on disk");
}
console.log(`wrote ${OUT_PATH} (${ENTRY.length} characters)`);

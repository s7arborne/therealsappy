import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

export function renderMarkdown(md: string): string {
  const raw = marked.parse(md, { async: false }) as string;
  return purify.sanitize(raw);
}

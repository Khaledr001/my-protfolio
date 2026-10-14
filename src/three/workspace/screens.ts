import * as THREE from "three";

import type { DiffLine, Snippet } from "./codeContent";

// ── Editor theme (matches the site's warm night palette) ────────────────────
export const theme = {
  bg: "#0F1420",
  chrome: "#0B0F17",
  gutter: "#4A5368",
  line: "#161D2C",
  text: "#E9E6DF",
  muted: "#8B93A7",
  keyword: "#F2A65A",
  string: "#8BE0B0",
  type: "#4FD1C5",
  fn: "#8AB4F8",
  number: "#F7C08A",
  comment: "#5C6680",
  decorator: "#E9C46A",
  add: "rgba(139, 224, 176, 0.12)",
  remove: "rgba(240, 129, 122, 0.13)",
  addText: "#8BE0B0",
  removeText: "#F0817A",
};

const FONT = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';
const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif';

const KEYWORDS = new Set(
  "import from export const let async await return if else for of new class private public readonly interface type extends implements throw try catch function this constructor".split(
    " ",
  ),
);

interface Token {
  text: string;
  color: string;
}

/** A tiny TypeScript highlighter: good enough to read as code at a glance. */
function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const pattern =
    /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`?)|(@\w+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d'"`@/]+|\/)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(line))) {
    const [text, comment, str, decorator, num, word] = match;
    let color = theme.text;
    if (comment) color = theme.comment;
    else if (str) color = theme.string;
    else if (decorator) color = theme.decorator;
    else if (num) color = theme.number;
    else if (word) {
      const next = line.slice(pattern.lastIndex).trimStart()[0];
      if (KEYWORDS.has(word)) color = theme.keyword;
      else if (/^[A-Z]/.test(word)) color = theme.type;
      else if (next === "(") color = theme.fn;
    } else if (!/^\s+$/.test(text)) color = theme.muted;
    tokens.push({ text, color });
  }
  return tokens;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// ── Live editor on the monitor ──────────────────────────────────────────────

/**
 * Draws a code editor into a canvas and "types" the current snippet into it.
 * Redraws are throttled and only happen when the visible text changes.
 */
export class EditorScreen {
  readonly texture: THREE.CanvasTexture;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scale: number;
  private lines: Token[][] = [];
  private snippet: Snippet | null = null;
  private typedChars = 0;
  private totalChars = 0;
  private lastDrawn = -1;
  /** Wall-clock time of the last redraw (the scene clock can be frozen). */
  private lastDrawAt = 0;
  private holdUntil = 0;
  private cursorOn = true;
  private speed = 28;

  constructor(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d")!;
    this.scale = width / 1024;
    this.texture = makeTexture(this.canvas);
  }

  /** Start typing `snippet`. `speed` is characters per second. */
  show(snippet: Snippet, speed: number) {
    if (this.snippet === snippet) return;
    this.snippet = snippet;
    this.lines = snippet.code.split("\n").map(tokenize);
    this.totalChars = snippet.code.length;
    this.typedChars = 0;
    this.speed = speed;
    this.holdUntil = 0;
    this.lastDrawn = -1;
  }

  /** True once the whole snippet has been typed and held on screen. */
  isDone(time: number) {
    return this.typedChars >= this.totalChars && this.holdUntil > 0 && time > this.holdUntil;
  }

  update(time: number, delta: number, fps: number) {
    if (!this.snippet) return;
    if (this.typedChars < this.totalChars) {
      this.typedChars = Math.min(this.totalChars, this.typedChars + this.speed * delta);
      if (this.typedChars >= this.totalChars) this.holdUntil = time + 3.5;
    }
    const cursorOn = Math.floor(time * 2) % 2 === 0;
    const visible = Math.floor(this.typedChars);
    const now = performance.now() / 1000;
    const due = now - this.lastDrawAt >= 1 / fps;
    if (!due || (visible === this.lastDrawn && cursorOn === this.cursorOn)) return;
    this.cursorOn = cursorOn;
    this.lastDrawn = visible;
    this.lastDrawAt = now;
    this.draw(visible);
  }

  /** Font-dependent: call again once web fonts have loaded. */
  redraw() {
    this.lastDrawn = -1;
    this.draw(Math.floor(this.typedChars));
  }

  private draw(visibleChars: number) {
    const { ctx, canvas, scale: s } = this;
    const w = canvas.width;
    const h = canvas.height;
    const tabH = 44 * s;
    const statusH = 30 * s;
    const fontSize = 19 * s;
    const lineH = 29 * s;
    const gutterW = 64 * s;
    const top = tabH + 22 * s;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    // Tab bar
    ctx.fillStyle = theme.chrome;
    ctx.fillRect(0, 0, w, tabH);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(18 * s, 8 * s, 250 * s, tabH - 8 * s);
    ctx.fillStyle = theme.keyword;
    ctx.fillRect(18 * s, 8 * s, 250 * s, 2 * s);
    ctx.font = `${15 * s}px ${FONT}`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = theme.type;
    ctx.fillText("TS", 32 * s, tabH / 2 + 4 * s);
    ctx.fillStyle = theme.text;
    ctx.fillText(this.snippet?.file ?? "", 62 * s, tabH / 2 + 4 * s);
    ctx.fillStyle = theme.muted;
    ctx.fillText("app.module.ts", 300 * s, tabH / 2 + 4 * s);

    // Work out which characters are visible, line by line.
    let remaining = visibleChars;
    const rows: { tokens: Token[]; chars: number }[] = [];
    for (const tokens of this.lines) {
      const length = tokens.reduce((n, t) => n + t.text.length, 0);
      if (remaining <= 0 && rows.length > 0) break;
      rows.push({ tokens, chars: Math.max(0, Math.min(length, remaining)) });
      remaining -= length + 1;
    }

    const maxRows = Math.floor((h - top - statusH - 10 * s) / lineH);
    const first = Math.max(0, rows.length - maxRows);
    ctx.font = `${fontSize}px ${FONT}`;
    ctx.textBaseline = "alphabetic";

    rows.slice(first).forEach((row, i) => {
      const y = top + i * lineH + fontSize;
      const isCurrent = first + i === rows.length - 1;
      if (isCurrent) {
        ctx.fillStyle = theme.line;
        ctx.fillRect(gutterW - 8 * s, y - fontSize - 4 * s, w, lineH);
      }
      ctx.fillStyle = isCurrent ? theme.text : theme.gutter;
      ctx.textAlign = "right";
      ctx.fillText(String(first + i + 1), gutterW - 22 * s, y);
      ctx.textAlign = "left";

      let x = gutterW;
      let left = row.chars;
      for (const token of row.tokens) {
        if (left <= 0) break;
        const text = token.text.slice(0, left);
        ctx.fillStyle = token.color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
        left -= token.text.length;
      }
      if (isCurrent && this.cursorOn) {
        ctx.fillStyle = theme.keyword;
        ctx.fillRect(x + 2 * s, y - fontSize + 2 * s, 3 * s, fontSize + 4 * s);
      }
    });

    // Minimap
    ctx.globalAlpha = 0.35;
    this.lines.forEach((tokens, i) => {
      let x = w - 96 * s;
      tokens.forEach((t) => {
        if (!t.text.trim()) {
          x += t.text.length * 2.4 * s;
          return;
        }
        ctx.fillStyle = t.color;
        ctx.fillRect(x, top + i * 6 * s, t.text.length * 2.4 * s, 3 * s);
        x += t.text.length * 2.4 * s;
      });
    });
    ctx.globalAlpha = 1;

    // Status bar
    ctx.fillStyle = theme.chrome;
    ctx.fillRect(0, h - statusH, w, statusH);
    ctx.font = `${13 * s}px ${FONT}`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = theme.type;
    ctx.fillText("⎇ main", 18 * s, h - statusH / 2);
    ctx.fillStyle = theme.muted;
    ctx.fillText("TypeScript   UTF-8   ✓ 0 problems", 120 * s, h - statusH / 2);
    ctx.textAlign = "right";
    ctx.fillText(`Ln ${rows.length}`, w - 18 * s, h - statusH / 2);
    ctx.textAlign = "left";

    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

// ── Code review on the laptop ───────────────────────────────────────────────

export function drawReviewTexture(diff: DiffLine[], width = 1024) {
  const s = width / 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.round(width * 0.625);
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = theme.chrome;
  ctx.fillRect(0, 0, w, 74 * s);

  ctx.textBaseline = "middle";
  ctx.font = `600 ${24 * s}px ${SANS}`;
  ctx.fillStyle = theme.text;
  ctx.fillText("Scope call queue to tenant", 28 * s, 30 * s);
  ctx.font = `${16 * s}px ${FONT}`;
  ctx.fillStyle = theme.muted;
  ctx.fillText("lead.service.ts", 28 * s, 58 * s);
  ctx.fillStyle = theme.addText;
  ctx.fillText("+3", 210 * s, 58 * s);
  ctx.fillStyle = theme.removeText;
  ctx.fillText("−2", 250 * s, 58 * s);

  // Review status pill
  roundRect(ctx, w - 210 * s, 18 * s, 182 * s, 38 * s, 19 * s);
  ctx.fillStyle = "rgba(139, 224, 176, 0.14)";
  ctx.fill();
  ctx.fillStyle = theme.addText;
  ctx.font = `600 ${16 * s}px ${SANS}`;
  ctx.fillText("✓ Approved", w - 182 * s, 37 * s);

  const lineH = 36 * s;
  let y = 98 * s;
  ctx.font = `${18 * s}px ${FONT}`;
  diff.forEach((line) => {
    if (line.kind !== "context") {
      ctx.fillStyle = line.kind === "add" ? theme.add : theme.remove;
      ctx.fillRect(0, y, w, lineH);
    }
    ctx.fillStyle = line.kind === "add" ? theme.addText : line.kind === "remove" ? theme.removeText : theme.gutter;
    ctx.fillText(line.kind === "add" ? "+" : line.kind === "remove" ? "−" : " ", 22 * s, y + lineH / 2);
    let x = 48 * s;
    for (const token of tokenize(line.text)) {
      ctx.fillStyle = line.kind === "remove" ? theme.removeText : token.color;
      ctx.globalAlpha = line.kind === "remove" ? 0.75 : 1;
      ctx.fillText(token.text, x, y + lineH / 2);
      x += ctx.measureText(token.text).width;
    }
    ctx.globalAlpha = 1;
    y += lineH;
  });

  // Inline review thread
  y += 16 * s;
  roundRect(ctx, 48 * s, y, w - 96 * s, 132 * s, 14 * s);
  ctx.fillStyle = "#161D2C";
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 166, 90, 0.35)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(84 * s, y + 38 * s, 18 * s, 0, Math.PI * 2);
  ctx.fillStyle = theme.keyword;
  ctx.fill();
  ctx.fillStyle = theme.chrome;
  ctx.font = `700 ${14 * s}px ${SANS}`;
  ctx.textAlign = "center";
  ctx.fillText("SK", 84 * s, y + 39 * s);
  ctx.textAlign = "left";
  ctx.font = `${18 * s}px ${SANS}`;
  ctx.fillStyle = theme.text;
  ctx.fillText("Filter in SQL, not in memory — and add an index", 116 * s, y + 32 * s);
  ctx.fillText("on (tenant_id, timezone).", 116 * s, y + 58 * s);
  ctx.fillStyle = theme.addText;
  ctx.font = `${16 * s}px ${FONT}`;
  ctx.fillText("↳ Resolved · now an index scan", 116 * s, y + 100 * s);

  return makeTexture(canvas);
}

// ── Floating UI cards around the desk ───────────────────────────────────────

export type PanelKind = "pull-request" | "terminal" | "pipeline";

export function drawPanelTexture(kind: PanelKind, width = 640) {
  const s = width / 640;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.round(width * 0.56);
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;

  roundRect(ctx, 4 * s, 4 * s, w - 8 * s, h - 8 * s, 26 * s);
  ctx.fillStyle = "rgba(15, 20, 32, 0.9)";
  ctx.fill();
  ctx.strokeStyle = "rgba(233, 230, 223, 0.16)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();

  ctx.textBaseline = "middle";
  const label = (text: string, color = theme.muted) => {
    ctx.font = `${17 * s}px ${FONT}`;
    ctx.fillStyle = color;
    ctx.fillText(text.toUpperCase(), 36 * s, 46 * s);
  };

  if (kind === "pull-request") {
    label("Pull request", theme.keyword);
    ctx.font = `600 ${30 * s}px ${SANS}`;
    ctx.fillStyle = theme.text;
    ctx.fillText("feat: tenant-aware call queue", 36 * s, 104 * s);
    ctx.font = `${20 * s}px ${FONT}`;
    ctx.fillStyle = theme.addText;
    ctx.fillText("+128", 36 * s, 156 * s);
    ctx.fillStyle = theme.removeText;
    ctx.fillText("−34", 112 * s, 156 * s);
    ctx.fillStyle = theme.muted;
    ctx.fillText("6 files", 178 * s, 156 * s);
    [
      ["✓ Checks passed", theme.addText],
      ["✓ Review approved", theme.addText],
    ].forEach(([text, color], i) => {
      ctx.fillStyle = color;
      ctx.font = `${20 * s}px ${SANS}`;
      ctx.fillText(text, 36 * s, (214 + i * 42) * s);
    });
  } else if (kind === "terminal") {
    label("Terminal");
    const lines: [string, string][] = [
      ["$ pnpm test", theme.text],
      ["✓ all suites passed", theme.addText],
      ["$ docker compose up -d", theme.text],
      ["● api  ● worker  ● postgres", theme.type],
    ];
    ctx.font = `${22 * s}px ${FONT}`;
    lines.forEach(([text, color], i) => {
      ctx.fillStyle = color;
      ctx.fillText(text, 36 * s, (110 + i * 50) * s);
    });
  } else {
    label("Event flow", theme.type);
    const steps = ["lead.updated", "RabbitMQ", "webhook ✓"];
    steps.forEach((step, i) => {
      const x = (36 + i * 196) * s;
      roundRect(ctx, x, 128 * s, 170 * s, 64 * s, 14 * s);
      ctx.fillStyle = i === 1 ? "rgba(79, 209, 197, 0.14)" : "#161D2C";
      ctx.fill();
      ctx.strokeStyle = i === 1 ? "rgba(79, 209, 197, 0.6)" : "rgba(233, 230, 223, 0.14)";
      ctx.stroke();
      ctx.fillStyle = theme.text;
      ctx.font = `${18 * s}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText(step, x + 85 * s, 160 * s);
      ctx.textAlign = "left";
      if (i < steps.length - 1) {
        ctx.fillStyle = theme.keyword;
        ctx.fillText("→", x + 174 * s, 160 * s);
      }
    });
    ctx.font = `${18 * s}px ${SANS}`;
    ctx.fillStyle = theme.muted;
    ctx.fillText("Signed with HMAC-SHA256 · delivered async", 36 * s, 252 * s);
  }

  return makeTexture(canvas);
}

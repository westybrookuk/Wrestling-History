#!/usr/bin/env node
/**
 * apply_ops.mjs — deterministic applier for the CW/WWF pass-2 op set.
 *
 * Reads ops/pass2_ops.json and edits the target game repo's js/data.js and
 * js/timeline.js in place. Written to be run by someone who has read access to
 * westybrookuk/WCW-vs-WWF but whose workspace cannot reach it.
 *
 * SAFETY MODEL
 *   - Dry run by default. Nothing is written without --apply.
 *   - Every op reports a status. Nothing is silently skipped.
 *   - Refuses to write if any op is UNSUPPORTED or AMBIGUOUS unless
 *     --allow-partial is passed.
 *   - Verifies each edit landed by re-parsing the result before saving.
 *   - Writes .bak backups of every touched file.
 *
 * USAGE
 *   node apply_ops.mjs --repo /path/to/WCW-vs-WWF            # dry run
 *   node apply_ops.mjs --repo /path/to/WCW-vs-WWF --apply    # write
 *   node apply_ops.mjs --repo /path/to/WCW-vs-WWF --apply --allow-partial
 *   node apply_ops.mjs --repo /path --group titles --apply   # one group
 *   node apply_ops.mjs --repo /path --json                   # machine report
 *
 * EXIT CODES
 *   0 = every op APPLIED or ALREADY (dry run: everything resolvable)
 *   1 = at least one op needs a human (NOT_FOUND / UNSUPPORTED / AMBIGUOUS)
 *   2 = preflight failure (wrong repo, missing file, missing export)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, '..');

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d = null) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const APPLY = flag('--apply');
const ALLOW_PARTIAL = flag('--allow-partial');
const AS_JSON = flag('--json');
const ONLY_GROUP = opt('--group');
const REPO = resolve(opt('--repo', process.cwd()));
const OPS_FILE = opt('--ops', join(BUNDLE, 'ops', 'pass2_ops.json'));

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  grn: (s) => `\x1b[32m${s}\x1b[0m`,
  yel: (s) => `\x1b[33m${s}\x1b[0m`,
  cyn: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/* ------------------------------------------------------------------ utils */

/**
 * Match `key:` in JS object-literal form, accepting every style the game uses:
 *   id: 'x'      (unquoted key, single quotes — the dominant style in data.js)
 *   "id": "x"    (quoted key, double quotes — the audit JSON style)
 * Guarded so `someid:` and `.id:` do not match.
 */
function keyRe(key) {
  return new RegExp(`(?:(["'])${key}\\1|(?<![\\w$.])${key})\\s*:`, 'g');
}

/** Extract the string value of `key` from an object-literal slice. */
function keyValue(slice, key) {
  const m = keyRe(key).exec(slice);
  if (!m) return null;
  // the regex consumes up to the colon, so skip the space after it
  let vs = m.index + m[0].length;
  while (slice[vs] === ' ' || slice[vs] === '\t') vs++;
  const v = slice.slice(vs);
  const q = v[0];
  if (q !== '"' && q !== "'") return null;
  let out = '';
  for (let i = 1; i < v.length; i++) {
    if (v[i] === '\\') { out += v[i + 1]; i++; continue; }
    if (v[i] === q) return out;
    out += v[i];
  }
  return null;
}

/** Scan a JS source string from `start`, honouring strings/comments. Calls fn(ch, i). */
function eachCodeChar(src, fn, start = 0) {
  let i = start;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      const j = src.indexOf('\n', i);
      i = j < 0 ? n : j;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const j = src.indexOf('*/', i + 2);
      i = j < 0 ? n : j + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c;
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === q) break;
        if (q === '`' && src[j] === '$' && src[j + 1] === '{') {
          // crude template-expression skip
          let d = 1; let k = j + 2;
          while (k < n && d > 0) {
            if (src[k] === '{') d++;
            else if (src[k] === '}') d--;
            else if (src[k] === '"' || src[k] === "'" || src[k] === '`') {
              const q2 = src[k]; k++;
              while (k < n && src[k] !== q2) { if (src[k] === '\\') k++; k++; }
            }
            k++;
          }
          j = k;
          continue;
        }
        j++;
      }
      i = j + 1;
      continue;
    }
    fn(c, i);
    i++;
  }
}

/** Index of the char matching the opener at `open`, honouring strings/comments. */
function matchBracket(src, open) {
  const pairs = { '[': ']', '{': '}', '(': ')' };
  const want = pairs[src[open]];
  if (!want) return -1;
  let depth = 0;
  let end = -1;
  // MUST start at `open` — scanning from 0 would count earlier brackets in the
  // file and corrupt every match.
  eachCodeChar(src, (c, i) => {
    if (end >= 0) return;
    if (i < open) return;
    if (c === src[open]) depth++;
    else if (c === want) {
      depth--;
      if (depth === 0) end = i;
    }
  }, open);
  return end;
}

/**
 * All array literal ranges that make up `export const NAME = ...`.
 * Handles both a flat array (`= [`) and a map of arrays (`= { WWF: [...], WCW: [...] }`).
 */
function findArrays(src, name) {
  const re = new RegExp(`(?:export\\s+)?const\\s+${name}\\s*=\\s*([\\[{])`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    const at = m.index + m[0].length - 1;
    const opener = src[at];
    if (opener === '[') {
      const end = matchBracket(src, at);
      if (end > at) out.push({ path: name, open: at, close: end });
      continue;
    }
    // map form: collect every `[ ... ]` directly inside the braces
    const objEnd = matchBracket(src, at);
    if (objEnd < 0) continue;
    const seen = [];
    eachCodeChar(src, (c, i) => {
      if (i <= at || i >= objEnd) return;
      if (c === '[') {
        const end = matchBracket(src, i);
        if (end > i) {
          // label = nearest preceding identifier
          const before = src.slice(Math.max(0, i - 60), i);
          const lm = before.match(/([A-Za-z0-9_$-]+)\s*:\s*$/);
          seen.push({ path: `${name}.${lm ? lm[1] : '?'}`, open: i, close: end });
        }
      }
    });
    out.push(...seen);
  }
  return out;
}

/** Top-level object literals inside an array range, with their id. */
function objectLiterals(src, arr) {
  const found = [];
  let depth = 0;
  let start = -1;
  eachCodeChar(src, (c, i) => {
    if (i <= arr.open || i >= arr.close) return;
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        const raw = src.slice(start, i + 1);
        found.push({ start, end: i + 1, raw, id: keyValue(raw, 'id') });
        start = -1;
      }
    }
  });
  return found;
}

/** All ids declared anywhere in a file (for reference checks). */
function allIds(src) {
  const ids = new Set();
  const re = keyRe('id');
  let m;
  while ((m = re.exec(src))) {
    const v = keyValue(src.slice(m.index), 'id');
    if (v !== null) ids.add(v);
  }
  return ids;
}

/** Dominant string quote used inside a slice, so edits match house style. */
function quoteOf(slice) {
  let single = 0; let dbl = 0;
  const re = /(["'])/g;
  let m;
  while ((m = re.exec(slice))) { if (m[1] === "'") single++; else dbl++; }
  return single > dbl ? "'" : '"';
}

/**
 * Whether object keys in this slice are written quoted or bare.
 * data.js uses bare keys (`{ id: 'x' }`); the audit JSONs use quoted ones.
 */
function bareKeys(slice) {
  let quoted = 0; let bare = 0;
  const re = /(?:(["'])([\w$-]+)\1|(?<![\w$.])([\w$-]+))\s*:/g;
  let m;
  while ((m = re.exec(slice))) { if (m[2] !== undefined) quoted++; else bare++; }
  return bare > quoted;
}

/** Render an object key in the file's house style. */
function keyStr(key, bare) {
  return bare && /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

function ser(v, q = '"') {
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v === null) return 'null';
  if (typeof v === 'object') return JSON.stringify(v);
  if (q === '"') return JSON.stringify(v);
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** Indentation of the line containing index i. */
function lineIndent(src, i) {
  let s = i;
  while (s > 0 && src[s - 1] !== '\n') s--;
  const m = src.slice(s, i).match(/^[ \t]*/);
  return m ? m[0] : '';
}

/** Replace/insert a field inside the object literal spanning [start,end). */
function setField(src, start, end, key, value) {
  const lit = src.slice(start, end);
  const q = quoteOf(lit);
  const bare = bareKeys(lit);
  // existing field?
  const re = keyRe(key);
  const m = re.exec(lit);
  if (m) {
    // find the value's end: next comma at depth 1, or the final closing brace
    let vStart = m.index + m[0].length;
    while (lit[vStart] === ' ' || lit[vStart] === '\t') vStart++;
    let depth = 0;
    let vEnd = -1;
    // MUST start scanning at vStart. Scanning from 0 counts the literal's own
    // braces, so the closing `}` looks like depth-0 content and the replacement
    // swallows every field after the one being set.
    eachCodeChar(lit, (c, j) => {
      if (j < vStart) return;
      // latch: the first terminator wins. Without this the closing `}` of the
      // literal overwrites the comma we just found and the replacement eats
      // every remaining field.
      if (vEnd >= 0) return;
      if (c === '{' || c === '[' || c === '(') depth++;
      else if (c === '}' || c === ']' || c === ')') {
        if (depth === 0) { vEnd = j; return; }
        depth--;
      } else if (c === ',' && depth === 0) { vEnd = j; }
    }, vStart);
    if (vEnd < 0) vEnd = lit.length;
    // keep the space that sat between the old value and a closing brace,
    // otherwise `turn: 12 }` becomes `turn: 67}`
    const tail = (vEnd < lit.length && /[ \t]/.test(lit[vEnd - 1])) ? ' ' : '';
    const updated = lit.slice(0, vStart) + ser(value, q) + tail + lit.slice(vEnd);
    return { src: src.slice(0, start) + updated + src.slice(end), touched: true };
  }
  // absent -> insert after the opening brace
  const kv = `${keyStr(key, bare)}: ${ser(value, q)}`;
  if (!lit.includes('\n')) {
    // keep one-line literals on one line — the game's house style.
    // NOTE: src is the whole file, so the tail after the literal must be
    // re-attached with src.slice(end); returning lit.slice(close) instead
    // truncates everything after this entry.
    const close = lit.length - 1;
    const body = lit.slice(1, close).trim();
    const ins = body === '' ? ` ${kv} ` : ` ${body}, ${kv} `;
    return { src: src.slice(0, start) + '{' + ins + lit.slice(close) + src.slice(end), touched: true };
  }
  const indent = lineIndent(src, start) + '  ';
  const insert = `\n${indent}${kv},`;
  return { src: src.slice(0, start + 1) + insert + src.slice(start + 1), touched: true };
}

function removeLiteral(src, start, end) {
  // Element followed by a comma -> take the element, its comma, and its line.
  let i = end;
  while (i < src.length && (src[i] === ' ' || src[i] === '\t')) i++;
  if (src[i] === ',') {
    i++;
    while (i < src.length && (src[i] === ' ' || src[i] === '\t')) i++;
    if (src[i] === '\n') { while (i < src.length && /[\n \t]/.test(src[i])) i++; }
    return src.slice(0, start) + src.slice(i);
  }
  // Last element in the array -> there is no trailing comma, so take the
  // preceding one instead. (Doing this by always swallowing forward leaves
  // a dangling `[,]` behind when the array empties out.)
  let b = start;
  while (b > 0 && (src[b - 1] === ' ' || src[b - 1] === '\t')) b--;
  let hadComma = false;
  if (src[b - 1] === ',') {
    hadComma = true;
    b--;
    while (b > 0 && (src[b - 1] === ' ' || src[b - 1] === '\t')) b--;
  }
  if (hadComma) {
    const nl = src.lastIndexOf('\n', b - 1);
    if (nl >= 0 && src.slice(nl + 1, b).trim() === '') b = nl + 1;
  }
  let e = end;
  while (e < src.length && (src[e] === ' ' || src[e] === '\t')) e++;
  if (src[e] === '\n') e++;
  return src.slice(0, b) + src.slice(e);
}

function insertLiteral(src, arr, obj) {
  const indent = lineIndent(src, arr.open) + '  ';
  const probe = src.slice(arr.open, Math.min(arr.close, arr.open + 600));
  const q = quoteOf(probe);
  const bare = bareKeys(probe);
  // Keys keep the order the caller built them; drop undefined values so a
  // missing source field can never be written out as the string "undefined".
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
  const j = (v) => (typeof v === 'object' && v !== null ? JSON.stringify(v) : ser(v, q));
  const body = `${indent}{\n` + entries
    .map(([k, v]) => `${indent}  ${keyStr(k, bare)}: ${j(v)}`)
    .join(',\n') + `\n${indent}}`;

  // Replace the whitespace between the last element and the closing bracket,
  // rather than inserting into it — otherwise every add leaves a blank line.
  let tailStart = arr.close;
  while (tailStart > arr.open && /\s/.test(src[tailStart - 1])) tailStart--;
  const inner = src.slice(arr.open + 1, tailStart).trim();
  const needComma = inner !== '' && !inner.endsWith(',');
  const insert = `${needComma ? ',' : ''}\n${body},\n${lineIndent(src, arr.open)}`;
  return src.slice(0, tailStart) + insert + src.slice(arr.close);
}

/* --------------------------------------------------------------- preflight */

/** Parse-check a source string with the real Node parser. */
function syntaxOk(src) {
  const p = join(tmpdir(), `cwvwwf-syntax-${randomUUID()}.mjs`);
  try {
    writeFileSync(p, src);
    execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    const err = (e.stderr ? e.stderr.toString() : e.message)
      .split('\n').filter((l) => l && !l.includes(p)).slice(0, 6).join('\n');
    return { ok: false, err };
  } finally {
    try { rmSync(p, { force: true }); } catch { /* best effort */ }
  }
}

function preflight() {
  const problems = [];
  const files = {
    'js/data.js': ['INITIAL_TITLES', 'INITIAL_FACTIONS', 'ANN_ARRIVALS', 'FA_ARRIVALS'],
    'js/timeline.js': ['TIMELINE'],
    'js/engine.js': ['makeName'],
  };
  const sources = {};
  for (const [rel, needles] of Object.entries(files)) {
    const p = join(REPO, rel);
    if (!existsSync(p)) {
      problems.push(`missing ${rel} — is ${REPO} the WCW-vs-WWF repo root?`);
      continue;
    }
    const src = readFileSync(p, 'utf8');
    sources[rel] = src;
    const hard = rel === 'js/engine.js' ? [] : needles;
    for (const n of hard) {
      if (!new RegExp(`\\b${n}\\b`).test(src)) {
        problems.push(`${rel}: expected to find \`${n}\` — file shape differs from the audited version. Re-check the audit before applying.`);
      }
    }
    if (rel === 'js/engine.js' && !/makeName/.test(src)) {
      problems.push('js/engine.js: makeName not found — NEW-9 anchor may not match.');
    }
  }
  return { problems, sources };
}

/* ------------------------------------------------------------------- apply */

function main() {
  const opsDoc = JSON.parse(readFileSync(OPS_FILE, 'utf8'));
  const ops = ONLY_GROUP
    ? opsDoc.ops.filter((o) => o.ref.split('/')[0] === ONLY_GROUP)
    : opsDoc.ops;

  const { problems, sources } = preflight();
  if (problems.length) {
    console.error(C.red('PREFLIGHT FAILED\n'));
    for (const p of problems) console.error(`  ${C.red('x')} ${p}`);
    console.error(`\n${C.dim(`repo: ${REPO}`)}\n${C.dim(`ops:  ${OPS_FILE}`)}`);
    process.exit(2);
  }

  console.log(C.bold(`\nCW/WWF pass-2 applier`) + C.dim(`  repo=${REPO}  ops=${ops.length}  mode=${APPLY ? 'APPLY' : 'DRY-RUN'}`));
  if (APPLY && !ALLOW_PARTIAL) {
    console.log(C.dim('  (dry-run first is recommended: re-run without --apply and read the report)\n'));
  }

  const report = [];
  let needsHuman = 0;

  for (const op of ops) {
    const rel = op.file;
    let src = sources[rel];
    const rec = { ref: op.ref, op: op.op, id: op.id, file: rel, collection: op.collection, status: '', detail: '' };

    const arrays = findArrays(src, op.collection.split('.')[0]);
    if (!arrays.length) {
      rec.status = 'UNSUPPORTED';
      rec.detail = `collection \`${op.collection}\` not found in ${rel} — confirm the export name against the current source`;
      report.push(rec); needsHuman++;
      continue;
    }

    if (op.op === 'add') {
      // A free-agent arrival with no turn is not an arrival — refuse to invent one.
      if (/FA_ARRIVALS/.test(op.collection) && (op.changes?.turn === undefined)) {
        rec.status = 'MANUAL';
        rec.detail = `FA arrival with no \`turn\` — pick a turn (audit says ~${/turn (\d+)-(\d+)/.exec(op.audit_note || '')?.[0] || 'tbd'}) and add {"id":"${op.id}", ...stats, turn} to ${op.collection} by hand`;
        report.push(rec); needsHuman++;
        continue;
      }
      // Map-form collections (INITIAL_ROSTERS.WWF / .WCW / .ECW): pick the right
      // subgroup from a company hint. Never guess — an entry in the wrong
      // company is worse than no edit at all.
      let arr = arrays[arrays.length - 1];
      if (arrays.length > 1) {
        const hay = `${op.collection} ${op.guidance || ''} ${op.audit_note || ''} ${op.note || ''}`.toUpperCase();
        const hit = arrays.find((a) => new RegExp(`\\b${a.path.split('.').pop().toUpperCase()}\\b`).test(hay));
        if (!hit) {
          rec.status = 'MANUAL';
          rec.detail = `${op.collection} is a per-company map (${arrays.map((a) => a.path).join(', ')}) and no matching company appears in this op — choose the subgroup by hand`;
          report.push(rec); needsHuman++;
          continue;
        }
        arr = hit;
        rec.detail = `target group: ${arr.path}`;
      }
      const existing = objectLiterals(src, arr).filter((o) => o.id === op.id);
      if (existing.length) { rec.status = 'ALREADY'; rec.detail = 'id already present — apply skipped, verify by hand'; report.push(rec); continue; }
      const obj = { id: op.id, ...op.changes };
      if (obj.id !== op.id) obj.id = op.id;
      if (op.body_required) {
        obj.desc = `REVIEW-ME: ${op.audit_note} — author this to match the existing TIMELINE idiom`;
        obj.news = `REVIEW-ME: memorial line for ${op.id.replace(/-death|-retirement|-add$/, '')}`;
        rec.detail = 'scaffold written with REVIEW-ME markers — these bodies MUST be edited before commit';
      }
      src = insertLiteral(src, arr, obj);
      rec.status = 'APPLIED';
      if (op.guidance) rec.detail += ` | ${op.guidance}`;
      if (op.precondition) rec.detail += ` | PRECONDITION: ${op.precondition}`;
      sources[rel] = src;
      report.push(rec);
      continue;
    }

    // locate the target literal anywhere within the collection (or the whole file
    // when the collection is the starting-roster map and the id lives in a subgroup)
    let matches = [];
    for (const arr of arrays) {
      for (const o of objectLiterals(src, arr)) {
        if (o.id === op.id) matches.push({ ...o, arr });
      }
    }
    // ANN_STARTERS and friends hold bare strings, not object literals
    if (!matches.length && op.op === 'remove') {
      const hits = [];
      for (const arr of arrays) {
        const body = src.slice(arr.open + 1, arr.close);
        const re = /(["'])([^"']+)\1/g;
        let sm;
        while ((sm = re.exec(body))) {
          if (sm[2] === op.id) hits.push({ arr, at: arr.open + 1 + sm.index, raw: sm[0] });
        }
      }
      if (hits.length === 1) {
        const h = hits[0];
        src = removeLiteral(src, h.at, h.at + h.raw.length);
        rec.status = 'APPLIED';
        rec.detail = `removed bare string "${op.id}" from ${h.arr.path}`;
        if (op.guidance) rec.detail += ` | ${op.guidance}`;
        if (op.precondition) rec.detail += ` | PRECONDITION: ${op.precondition}`;
        sources[rel] = src;
        report.push(rec);
        continue;
      }
      if (hits.length > 1) {
        rec.status = 'AMBIGUOUS';
        rec.detail = `"${op.id}" appears in ${hits.length} groups (${hits.map((x) => x.arr.path).join(', ')}) — remove by hand`;
        report.push(rec); needsHuman++;
        continue;
      }
    }

    if (!matches.length) {
      // fall back to a whole-file search so a relocated entry still gets found
      matches = [];
      eachCodeChar(src, (c, i) => {
        if (c !== '{') return;
        const end = matchBracket(src, i);
        if (end < 0) return;
        const raw = src.slice(i, end + 1);
        if (keyValue(raw, 'id') === op.id) matches.push({ start: i, end: end + 1, raw, id: op.id, arr: null });
      });
    }

    if (!matches.length) {
      rec.status = 'NOT_FOUND';
      rec.detail = `no entry with id "${op.id}" anywhere in ${rel} — it may already be handled, or the id may differ`;
      report.push(rec); needsHuman++;
      continue;
    }
    if (matches.length > 1) {
      rec.status = 'AMBIGUOUS';
      rec.detail = `${matches.length} entries with id "${op.id}" — resolve by hand`;
      report.push(rec); needsHuman++;
      continue;
    }

    const lit = matches[0];

    if (op.op === 'remove') {
      src = removeLiteral(src, lit.start, lit.end);
      rec.status = 'APPLIED';
      if (op.guidance) rec.detail = `guidance: ${op.guidance}`;
      if (op.precondition) rec.detail = `PRECONDITION: ${op.precondition}`;
      sources[rel] = src;
      report.push(rec);
      continue;
    }

    if (op.move_to) {
      // Relocate: a starting-roster entry becomes a free-agent arrival.
      const dest = findArrays(src, op.move_to);
      if (!dest.length) {
        rec.status = 'UNSUPPORTED';
        rec.detail = `${op.move_to} not found in ${rel}`;
        report.push(rec); needsHuman++; continue;
      }
      const arr = dest[dest.length - 1];
      if (objectLiterals(src, arr).some((o) => o.id === op.id)) {
        rec.status = 'ALREADY';
        rec.detail = `${op.id} is already in ${op.move_to}`;
        report.push(rec); continue;
      }
      const turn = op.changes?.turn;
      if (turn === undefined) {
        rec.status = 'MANUAL';
        rec.detail = `relocation needs a turn`;
        report.push(rec); needsHuman++; continue;
      }
      // rebuild the entry: FA arrivals carry `turn` first and `interest`, not `company`
      const fieldOrder = ['id', 'name', 'align', 'pop', 'work', 'mic', 'age', 'ceiling', 'wage', 'finisher', 'interest', 'note'];
      const obj = {};
      for (const m of lit.raw.matchAll(/(?:(["'])([\w$-]+)\1|(?<![\w$.])([\w$-]+))\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|-?\d+(?:\.\d+)?|true|false|null)/g)) {
        const key = m[2] ?? m[3];
        let raw = m[4];
        if (raw === undefined) continue;
        if (raw[0] === '"' || raw[0] === "'") {
          let s = raw.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
          obj[key] = s;
        } else if (raw === 'true') obj[key] = true;
        else if (raw === 'false') obj[key] = false;
        else if (raw === 'null') obj[key] = null;
        else obj[key] = Number(raw);
      }
      delete obj.turn;
      const out = { turn };
      for (const k of fieldOrder) if (obj[k] !== undefined) out[k] = obj[k];
      for (const k of Object.keys(obj)) if (!(k in out)) out[k] = obj[k];
      if (out.interest === undefined) out.interest = 'ANY';
      delete out.company;
      out.note = `REVIEW-ME: relocated from the starting roster by pass 2 (${op.audit_note || ''}) - confirm interest and stats`;
      // Order matters: remove first, then re-locate the destination array.
      // Inserting first would shift every offset after it and the subsequent
      // removal would carve the wrong span out of the file.
      const trimmed = removeLiteral(src, lit.start, lit.end);
      const dest2 = findArrays(trimmed, op.move_to);
      if (!dest2.length) {
        rec.status = 'UNSUPPORTED';
        rec.detail = `${op.move_to} disappeared after the removal — aborting this op`;
        report.push(rec); needsHuman++; continue;
      }
      src = insertLiteral(trimmed, dest2[dest2.length - 1], out);
      rec.status = 'APPLIED';
      rec.detail = `moved WRESTLERS -> ${op.move_to} at turn ${turn}; dropped \`company\`, interest=${out.interest}`;
      rec.detail += ` | REVIEW: ${op.review || ''}`;
      sources[rel] = src;
      report.push(rec);
      continue;
    }

    if (op.op === 'modify' && op.changes) {
      let out = src;
      let s0 = lit.start;
      let e0 = lit.end;
      const changed = [];
      for (const [k, v] of Object.entries(op.changes)) {
        const before = out.slice(s0, e0);
        const res = setField(out, s0, e0, k, v);
        out = res.src;
        // the literal grows/shrinks as fields are added — re-find its end
        // before touching the next key, or later edits land at stale offsets
        const nEnd = matchBracket(out, s0);
        e0 = nEnd > 0 ? nEnd + 1 : e0;
        changed.push(`${k}${before === out.slice(s0, e0) ? '(already)' : ''}`);
      }
      src = out;
      rec.status = 'APPLIED';
      rec.detail = `set ${changed.join(', ')}`;
      if (op.guidance) rec.detail += ` | ${op.guidance}`;
      if (op.precondition) rec.detail += ` | PRECONDITION: ${op.precondition}`;
      sources[rel] = src;
      report.push(rec);
      continue;
    }

    if (op.op === 'convert_to_fa_arrival') {
      rec.status = 'MANUAL';
      rec.detail = `composite op — remove "${op.id}" from its starting roster and add {"id":"${op.id}",${Object.entries(op.changes || {}).map(([k, v]) => `${k}:${v}`).join(',')}} to FA_ARRIVALS by hand`;
      report.push(rec); needsHuman++;
      continue;
    }

    rec.status = 'UNSUPPORTED';
    rec.detail = `op "${op.op}" not implemented`;
    report.push(rec); needsHuman++;
  }

  /* ------------------------------------------------------- reference check */

  const dataSrc = sources['js/data.js'];
  const known = allIds(dataSrc);
  const holderRe = keyRe('holder');
  const unresolved = new Map();
  let hm;
  while ((hm = holderRe.exec(dataSrc))) {
    const h = keyValue(dataSrc.slice(hm.index), 'holder');
    if (!h || h === 'VACANT' || h === 'vacant') continue;
    if (!known.has(h)) {
      const back = dataSrc.slice(Math.max(0, hm.index - 300), hm.index);
      const nameM = [...back.matchAll(/(["'])?name\1?\s*:\s*(["'])([^"']*)\2/g)].pop();
      const idM = [...back.matchAll(/(["'])?id\1?\s*:\s*(["'])([^"']*)\2/g)].pop();
      const label = nameM ? nameM[3] : (idM ? idM[3] : '?');
      const k = `${label} -> ${h}`;
      if (!unresolved.has(k)) unresolved.set(k, (unresolved.get(k) || 0) + 1);
    }
  }

  /* ---------------------------------------------------------- verification */

  const verify = [];
  for (const rel of Object.keys(sources)) {
    const before = readFileSync(join(REPO, rel), 'utf8');
    if (before === sources[rel]) continue;
    // Hard gate: a file must still parse before we are willing to write it.
    const check = syntaxOk(sources[rel]);
    verify.push({ file: rel, bytes_before: before.length, bytes_after: sources[rel].length, parses: check.ok });
    if (!check.ok) {
      const dump = join(BUNDLE, `.syntax-dump-${rel.replace(/[\\/]/g, '_')}`);
      try { writeFileSync(dump, sources[rel]); } catch { /* best effort */ }
      console.error(C.red(`\n  SYNTAX GATE FAILED for ${rel}:\n${check.err}`));
      console.error(C.dim(`  broken candidate written to ${dump}`));
      console.error(C.dim(`  Nothing was written to the repo.`));
      process.exit(2);
    }
  }

  /* ---------------------------------------------------------------- output */

  if (AS_JSON) {
    console.log(JSON.stringify({ repo: REPO, mode: APPLY ? 'apply' : 'dry-run', ops: report, unresolved_holders: [...unresolved.keys()], verify }, null, 2));
  } else {
    const pad = Math.max(...report.map((r) => r.ref.length), 10);
    console.log('');
    for (const r of report) {
      const colour = r.status === 'APPLIED' ? C.grn : r.status === 'ALREADY' ? C.dim : C.yel;
      console.log(`  ${colour(r.status.padEnd(12))} ${r.ref.padEnd(pad)} ${C.dim(r.file)}`);
      if (r.detail) console.log(`  ${' '.repeat(12)} ${C.dim(r.detail)}`);
    }
    console.log('');
    const tally = report.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
    console.log(C.bold('  summary  ') + Object.entries(tally).map(([k, v]) => `${k}=${v}`).join('  '));

    if (unresolved.size) {
      console.log(C.yel('\n  UNRESOLVED TITLE HOLDERS (check these ids exist as workers or teams):'));
      for (const [k, v] of unresolved) console.log(`    ${k}${v > 1 ? ` (x${v})` : ''}`);
    } else {
      console.log(C.grn('\n  all title holders resolve to a declared id'));
    }

    if (APPLY) {
      if (needsHuman && !ALLOW_PARTIAL) {
        console.error(C.red(`\n  REFUSING TO WRITE: ${needsHuman} op(s) need a human. Fix them, or pass --allow-partial to write the rest.`));
        process.exit(1);
      }
      // Backups live next to the repo they describe, not in the bundle: the
      // bundle may live on another machine or a read-only mount.
      const bdir = join(REPO, '.pass2-backups', new Date().toISOString().replace(/[:.]/g, '-'));
      mkdirSync(bdir, { recursive: true });
      for (const rel of Object.keys(sources)) {
        const p = join(REPO, rel);
        const now = readFileSync(p, 'utf8');
        if (now === sources[rel]) continue;
        copyFileSync(p, join(bdir, rel.replace(/[\\/]/g, '__')));
        writeFileSync(p, sources[rel]);
        console.log(`  ${C.grn('wrote')} ${rel}  ${C.dim(`backup -> ${bdir}`)}`);
      }
      console.log(C.bold('\n  next: ') + 'bash tools/verify.sh ' + REPO);
    } else {
      console.log(C.bold('\n  dry run — nothing written.') + ' re-run with --apply');
    }
  }

  process.exit(needsHuman ? 1 : 0);
}

main();

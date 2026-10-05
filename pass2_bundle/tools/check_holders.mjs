#!/usr/bin/env node
/**
 * check_holders.mjs — does every INITIAL_TITLES holder resolve to a declared id?
 * Exit 0 = all resolve, 1 = at least one dangling holder, 2 = could not run.
 *
 *   node check_holders.mjs [repo]
 */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO = resolve(process.argv[2] || process.cwd());
const SRC = join(REPO, 'js', 'data.js');

let d;
try {
  d = readFileSync(SRC, 'utf8');
} catch {
  console.error(`cannot read ${SRC}`);
  process.exit(2);
}

// ids declared anywhere in the file (unquoted or quoted keys)
const ids = new Set();
// groups: 1=key quote, 2=value quote, 3=value
for (const m of d.matchAll(/(?:(['"])id\1|(?<![\w$.])id)\s*:\s*(['"])([^'"]*)\2/g)) ids.add(m[3]);

// every holder, with the nearest preceding name/id for a readable label
const rows = [];
// bare or quoted `holder:` — data.js writes bare keys.
// groups: 1=key quote (quoted-key branch), 2=value quote, 3=value
for (const m of d.matchAll(/(?:(['"])holder\1|(?<![\w$.])holder)\s*:\s*(['"])([^'"]*)\2/g)) {
  const h = m[3];
  if (!h || h === 'VACANT' || h === 'vacant') continue;
  const back = d.slice(Math.max(0, m.index - 400), m.index);
  const nameM = [...back.matchAll(/(["'])?name\1?\s*:\s*(["'])([^'"]*)\2/g)].pop();
  const idM = [...back.matchAll(/(["'])?id\1?\s*:\s*(["'])([^'"]*)\2/g)].pop();
  rows.push({ label: nameM ? nameM[3] : idM ? idM[3] : '?', holder: h, ok: ids.has(h) });
}

const bad = rows.filter((r) => !r.ok);
for (const r of bad) console.log(`  ${r.label} -> ${r.holder}`);
if (!bad.length) {
  console.log(`  ${rows.length} title holders, all resolve`);
  process.exit(0);
}
console.error(`  ${bad.length} of ${rows.length} holders do not resolve to a declared id`);
process.exit(1);

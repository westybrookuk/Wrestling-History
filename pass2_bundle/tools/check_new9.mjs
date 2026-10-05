#!/usr/bin/env node
/**
 * check_new9.mjs — is the NEW-9 female-name fix in effect?
 *
 *   node check_new9.mjs [repo]
 *
 * Exit 0 = fixed (non-zero female-named), 1 = not fixed, 2 = could not run.
 * The api shape differs from the audited version if this errors out — read the
 * message rather than assuming the fix is broken.
 */
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const REPO = resolve(process.argv[2] || process.cwd());

// the audited engine exports newGame and mulberry32
const engine = await import(pathToFileURL(join(REPO, 'js', 'engine.js')).href);
const { newGame, mulberry32 } = engine;
if (typeof newGame !== 'function' || typeof mulberry32 !== 'function') {
  console.error(`  engine.js does not export newGame/mulberry32 — api shape changed`);
  process.exit(2);
}

const FIRST = ['Amy','Angela','April','Ashley','Beth','Brenda','Carla','Cathy','Christina','Dawn',
  'Heather','Jennifer','Jessica','Julie','Kelly','Laura','Lisa','Michelle','Nicole','Rachel',
  'Rebecca','Sara','Shannon','Stephanie','Tara','Tracy'];

const s = newGame('WWF', 'normal', { rng: mulberry32(1234) });
const f = s.wrestlers.filter((w) => w.isIndy && !w.company && w.gender === 'f');
const named = f.filter((w) => FIRST.includes(w.name.split(' ')[0]));

console.log(`  female-named: ${named.length} / ${f.length}`);
if (f.length === 0) {
  console.error('  no female free agents generated — cannot evaluate (seed-dependent)');
  process.exit(2);
}
if (named.length === 0) {
  console.error('  0 female-named — NEW-9 is NOT applied (check makeName)');
  process.exit(1);
}
process.exit(0);

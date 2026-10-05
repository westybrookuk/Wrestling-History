# Pass-2 runbook — CW vs WWF game data

Execution order for the pass-2 corrections recorded in `audit/cwvwwf_data_audit_v7.md`
(PR #2, merged 2026-08-29). Everything here is **queued, not abandoned** — the game repo
was unreachable from the workspace that produced the audit.

The agreed order, unchanged:

```
1. Land the pass-1 patch
2. Titles / timeline / death-events pass
3. NEW-9 one-liner (female names)
4. FA-ENG-6/7 ledger + comments
5. Medium-confidence ops
6. (already done — PR #2 merged)
```

Steps 2 and 5 are one automated pass (`ops/pass2_ops.json`). Steps 3 and 4 are `js/engine.js`.

---

## 0. Prerequisites

- Node 18+ (the bundle is plain `.mjs`, no dependencies)
- A clone of `westybrookuk/WCW-vs-WWF` you can read and write
- A clean working tree: `git status --porcelain` should be empty
- The baseline the audit was written against is commit `3c43e7b`

```bash
git clone https://github.com/westybrookuk/WCW-vs-WWF.git
cd WCW-vs-WWF
git checkout -b arena/pass2-data
git status --porcelain    # must be empty
```

## 1. Land the pass-1 patch

```bash
git am ../pass2_bundle/pass1_high_confidence_corrections.patch
```

Touches `js/data.js` and `test/sim.js`; 92 corrections. If `git am` refuses, the baseline
has moved — fall back to `git apply --3way` and resolve by hand, then re-check the
`verify.sh` gates before continuing.

```bash
node test/sim.js && node test/ai-stress.js
```

## 2 + 5. The 64-op data pass

Dry run first, always:

```bash
node ../pass2_bundle/tools/apply_ops.mjs --repo .
```

Read the report. Every op gets a status:

| status | meaning |
|---|---|
| `APPLIED` | will be written |
| `ALREADY` | the edit is already in place — verify by hand, it was skipped |
| `NOT_FOUND` | no entry with that id — it may already be handled, or the id differs |
| `AMBIGUOUS` | the id appears more than once — resolve by hand |
| `MANUAL` | deliberately not automated (needs a judgement call) |
| `UNSUPPORTED` | the collection was not found — the file shape differs from the audit |

Then write:

```bash
node ../pass2_bundle/tools/apply_ops.mjs --repo . --apply
```

It refuses to write while any op needs a human. Once you have dealt with those, either
re-run until the report is clean, or:

```bash
node ../pass2_bundle/tools/apply_ops.mjs --repo . --apply --allow-partial
```

Backups of every touched file land in `<repo>/.pass2-backups/<timestamp>/`.

### Ops that will never automate — read these

| op | why |
|---|---|
| `announcers/mike-tenay` | two-step: remove from `ANN_ARRIVALS` **and** add to `ANN_STARTERS.WCW` |
| `announcers/kent-walton`, `tirantes` | confirm the exact `ANN_STARTERS` group before removing |
| `wrestler_medium/buh-buh-ray-dudley` | FA arrival with no exact turn (audit says ~t48-56) |
| `wrestler_medium/megumi-kudo` | pick the company group — the audit says FMW |
| `timeline_deaths/*` (adds) | scaffolds carry `REVIEW-ME` bodies — author them |

### Preconditions — resolve these before the title holders will resolve

- `njpw-junior → norio-honaga` — **add honaga as a worker first** (flagged unverified in the audit)
- `njpw-tag → hase-muto` — add Hase and the team
- `ajw-tag → kyoko-takako` — add the corrected Inoue team
- `ecw-tag → public-enemy`, `smw-tag → rock-n-roll-express` — `TEAMS` entries must exist
- `wwf-tag → 'VACANT'` — check how the engine handles a null/`VACANT` holder string first
- `nwa-world → chris-candido` — verify `roster(state, 'NWA')` semantics; he may need to be a floating champion

`tools/check_holders.mjs` reports any that are still dangling.

### Review flags in the op file

- `move_to` — `craig-pittman`, `scotty-riggs`, `dances-with-dudley` are relocated from
  `WRESTLERS` into `FA_ARRIVALS` (a `turn` on a starting-roster entry only means that).
  `company` is dropped and `interest` defaults to `'ANY'` — **set `interest` yourself**.
- Death-event scaffolds need real `desc`/`news` bodies matching the existing `TIMELINE` idiom.

## 3. NEW-9 — the one-liner

Female generated workers were being given male names: `makeName()` drew a female first
name and then the `else` branch unconditionally overwrote it with
`first = pick(ROOKIE_FIRST_NAMES)`. Observed 0/12 female indies named.

Change the branch that immediately follows `if (!first && flavor && INDY_INTL_NAMES[flavor])`
from `} else {` to `} else if (!first) {`, leaving `last = pick(ROOKIE_LAST_NAMES)` inside.

The exact anchor and replacement are in `ops/engine_anchors.json` under `NEW-9`.

```bash
node ../pass2_bundle/tools/check_new9.mjs .
```

Expect a non-zero `female-named` count. International female workers are separately
exempt (they draw from the INTL pools) — that is intended, leave it alone.

**Determinism:** the fix removes a wasted rng call, so new games diverge from pre-fix
seeds. Expected — same class of change as commit `3c43e7b`. Old saves keep their state;
do not try to re-seed them.

## 4. FA-ENG-6 / FA-ENG-7 — ledger and comments

Both **decided**, both implementation-only. Details in `ops/engine_anchors.json` under
`manual`.

- **FA-ENG-6** — the double January intake is intended. Record the rookie count in the
  ledger: `state.game.talentIntake.rookieClasses.push({ year: d.year, count })` instead of
  the year-only entry, and update the block comment to state the combined model
  (15 independent graduates + 4-6 training-camp rookies, every January 1996-2001).
  Re-verify: one spectate run should show `6x {indy 15}` plus rookie counts, and world
  totals must match the v6 baseline.
- **FA-ENG-7** — **no behaviour change.** The 2001 cap on indy classes is intentional.
  Add the one-line comment only. A reduced 5/year tail for 2002-2007 is *not recommended*:
  it would change the verified 150-indy baseline.

## 6. Gate and commit

```bash
bash ../pass2_bundle/tools/verify.sh .
```

| gate | fail means |
|---|---|
| syntax | a file was corrupted — restore from `.pass2-backups/` |
| `test/sim.js`, `test/ai-stress.js` | the data change broke the engine |
| NEW-9 | the female-name fix is missing or ineffective |
| `REVIEW-ME` markers | scaffold bodies still need authoring |
| title holders | a holder id has no matching worker/team |

Commit as one pass-2 commit (or two: data/timeline, then engine):

```bash
git add -A
git commit -m "Pass 2: titles, timeline, death events, NEW-9, medium-confidence ops"
git push origin arena/pass2-data
```

## Still open from pass 1 — owner decisions, not agent decisions

- **JWP** (`dynamite-kansai`, `mayumi-ozaki`): JWP is not a game company.
  Recommended: keep both in AJW as interpromotional guests, no change. Alternative: add JWP
  to `COMPANY_DEFS`.
- **Optional comeback arcs** — none required for correctness; apply only if you want them
  modelled: `barbarian` WCW t44-47, `windham` Stalker t72, `neidhart` ECW t12-15,
  `brandi` t76, `missy-hyatt` t47, the-shark/savio rename events, `spicolli` ECW t73.

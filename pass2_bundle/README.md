# CW/WWF pass-2 bundle

Everything needed to finish the pass-2 data corrections on
[`westybrookuk/WCW-vs-WWF`](https://github.com/westybrookuk/WCW-vs-WWF), packaged so it can
be run **anywhere** — no access to that repo was needed to build or test this.

> **Why this exists.** The audit (PR #2, merged 2026-08-29) left 5 of its 6 execution steps
> queued because the workspace could not reach the game repo:
> `gh repo view` → `Resource not accessible by integration`, `git clone` → HTTP 403.
> The plan, the op set and the patch were all committed; only the execution was blocked.
> This bundle is that same work, packaged to run from a machine that *does* have access.

Start with **[RUNBOOK.md](RUNBOOK.md)**.

## Contents

| path | what it is |
|---|---|
| `pass1_high_confidence_corrections.patch` | the pass-1 patch (92 corrections, `js/data.js` + `test/sim.js`), applies to `3c43e7b` |
| `ops/pass2_ops.json` | the 64 pass-2 ops, machine-readable: target file, collection, changes, preconditions, review flags |
| `ops/engine_anchors.json` | the `js/engine.js` changes — NEW-9 as an exact anchor, FA-ENG-6/7 as instructions, plus the open owner decisions |
| `tools/apply_ops.mjs` | the applier: dry run by default, per-op status, syntax gate, backups |
| `tools/verify.sh` | the post-apply gate |
| `tools/check_new9.mjs` | proves the female-name fix is in effect |
| `tools/check_holders.mjs` | proves every title holder resolves to a declared id |
| `tools/selftest.sh` | the bundle's own test suite (30 assertions: 22 semantic + 8 gate checks) |
| `tests/mock-game-repo/` | a synthetic fixture in the real game's data format |

## Quick start

```bash
git clone https://github.com/westybrookuk/WCW-vs-WWF.git && cd WCW-vs-WWF
git checkout -b arena/pass2-data

git am ../pass2_bundle/pass1_high_confidence_corrections.patch

node ../pass2_bundle/tools/apply_ops.mjs --repo .          # dry run — read this
node ../pass2_bundle/tools/apply_ops.mjs --repo . --apply  # write

bash ../pass2_bundle/tools/verify.sh .
```

## The op set

64 ops across 6 groups, in the order the audit agreed:

| group | ops | confidence |
|---|---|---|
| titles | 17 | 12 High, 5 removals/adds |
| factions | 3 | High |
| announcers | 6 | High |
| timeline dates | 9 | 7 High, 2 Medium |
| timeline deaths | 8 | 7 High, 1 Medium |
| wrestler / free-agent | 21 | Medium |

Of these the applier deliberately leaves to a human: `mike-tenay` (a two-step move across
two collections), the two `ANN_STARTERS` removals (confirm the group), `buh-buh-ray-dudley`
(no exact turn available), `megumi-kudo` (pick the company), and the eight timeline death
adds (bodies must be authored to match the existing idiom — scaffolds carry `REVIEW-ME`).

## Safety model

- **Dry run is the default.** Nothing is written without `--apply`.
- **Refuses to write** while any op is `NOT_FOUND`, `AMBIGUOUS`, `MANUAL` or
  `UNSUPPORTED` — override deliberately with `--allow-partial`.
- **Syntax gate.** Every touched file is parse-checked with `node --check` before anything
  is written. On failure the broken candidate is dumped to
  `pass2_bundle/.syntax-dump-*` and the repo is left untouched.
- **Backups** of each touched file go to `<repo>/.pass2-backups/<timestamp>/` — next to
  the repo they describe, so the bundle itself can live on a read-only mount.
- **Idempotent.** A second run reports `ALREADY` instead of double-applying.
- **House style is preserved** — bare keys and single quotes, matching `data.js`; inserted
  fields stay inline in one-line entries.

## Test coverage

`bash tools/selftest.sh` — 30 assertions against the synthetic fixture (22 semantic
value checks plus 8 safety-gate checks), including the
failure paths that matter:

- dry run writes nothing; `--apply` refuses when ops need a human
- **edited files still parse** after apply
- **semantic** assertions, not text greps: after apply, a title's holder really is the new
  value, a removed title really is gone, a relocated entry really is out of `WRESTLERS`
  and into `FA_ARRIVALS` at the right turn
- the fixture deliberately keeps untouched entries, so an over-eager edit is caught
- idempotency (a second apply must not duplicate)
- the NEW-9 anchor matches exactly once and changes behaviour (`Amy` survives)
- the fixture's own tests still pass afterwards

Bugs this suite caught during development, all fixed:

1. bracket matching scanned from the start of the file instead of from the opener, so no
   collection was ever found
2. the id/field regexes only matched quoted keys — the game writes bare keys
3. **replacing a field swallowed every field after it** (`{ turn: 51, id: … }` became
   `{ turn: 51 }`) because the value-end scan latched onto the closing brace
4. **the inline field-insert path dropped the rest of the file** (6112 bytes → 1772)
5. `insertLiteral` emitted object bodies with no braces, and two consecutive adds produced
   invalid syntax
6. relocating an entry removed using offsets from before the insert, corrupting the file
7. removing the last element of a string array left a dangling `[,]`
8. missing fields were serialised as the string `'undefined'`
9. in the runbook scripts, a `)` left inside single quotes inside `$( )` broke parsing

## Provenance

Everything is derived from `audit/cwvwwf_data_audit_v7.json` — the ops are a mechanical
re-expression of that manifest, not new judgements. The real data format (bare keys, single
quotes, flat `WRESTLERS` with a `company` field, `FA_ARRIVALS` keyed by `turn` first) was
read out of `pass1_high_confidence_corrections.patch`, which is the only surviving artefact
of the game repo's source.

The fixture is **synthetic** — plausible values, never historical fact. It exists to test
the tooling, and must never be copied into the game repo.

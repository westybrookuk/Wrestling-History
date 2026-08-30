# CW/WWF Wrestling History — Data Audit v6 (Delta: AI-scouting revision + applied corrections)

**Revision:** `3c43e7b` on branch `arena/01a042dd-wcw-vs-wwf` · **Prior audited:** `c2fd37f` · **Date:** 2026-08-30

**New commit audited:** `3c43e7b` *Constrain generated talent and improve AI scouting* (js/engine.js, +20/−8).

This report has two parts:

- Part 1 — delta audit of 3c43e7b against the v5 findings.
- Part 2 — application of the high-confidence wrestler, free-agent and arrival-date corrections from the committed research (audit/cwvwwf_patch_recommendations.json, 133 ops @ 12d9fcd; data.js/timeline.js unchanged since, so the ops still mapped cleanly). Applied as local commit 7621cf2 in the WCW-vs-WWF clone and published as audit/cwvwwf_high_confidence_corrections.patch (push to the game repo was blocked by token permissions — see delivery).

---

## Part 1 — Delta audit of 3c43e7b

### Fixed since c2fd37f (verified empirically)

### NEW-1 — FIXED (3c43e7b) — verified empirically

isIndy cold threshold lowered to 28 normal / 24 hard / 32 easy (was 38/32/38) and the gender bonus (+30 WWF/+15 WCW) deleted from the shared cold path. Measured: t1 WCW signed 12 indies — 10 male (9 ordinary), 2 female, 1 gem. Through t300: 37/39/37 of 150 signed on normal (ordinary men 26/31/30, women 5/1/5) and 79/150 on hard. Recruitment now tracks the stat distribution instead of gender.

> The bonus removal also affects HISTORICAL female FAs in the shared cold path (marginal women no longer clear the 55/48 thresholds) — a deliberate scope-broadening beyond generated talent, flagged as an observation.

### NEW-2 — FIXED (3c43e7b) — verified empirically

The cold path now calls canSign() before scoring ('const ncCold = canSign(state, w, comp); if (!ncCold.ok) continue;'). Repeated the v5 steal test: a written-released indy with a 16-week no-compete was NOT signed by the rival through the whole window.

### FA-ENG-3 — FIXED (3c43e7b) — verified empirically

New state.game.generatedTalentMode ('historical' when indyPool=0, else 'full') gates BOTH the January indy class and the rookie training class, plus a state.game.talentIntake ledger. indyPool=0 game: 348 wrestlers at t0 (37 jobbers remain), and after 110 weeks: 0 rookies, 0 indy classes, empty ledger. Old saves (no mode field) keep classes running — backwards compatible.

### NEW-8 — ATTEMPTED, STILL BROKEN → superseded by NEW-9

3c43e7b adds a 26-name FEMALE_FIRST_NAMES pool and a gender parameter to makeName — but the else branch unconditionally overwrites first with a ROOKIE_FIRST_NAMES pick, discarding the female name (see NEW-9).

### New finding

### NEW-9 · Medium (broken fix) · Female generated workers still get male names

- **Current value:** js/engine.js makeName(): `if (gender === 'f' && !flavor) first = pick(FEMALE_FIRST_NAMES);` is followed by a SEPARATE `if (!first && flavor && ...) {...} else { first = pick(ROOKIE_FIRST_NAMES); last = pick(ROOKIE_LAST_NAMES); }` — the else reassigns first unconditionally, so the female pick is drawn and immediately discarded (and one extra rng call is consumed per female worker). Female international workers are exempt by design (!flavor guard) and keep drawing from the male INTL pools.
- **Recommended value:** Change the else to `else if (!first) { first = pick(ROOKIE_FIRST_NAMES); ... }` (or restructure so the female pick short-circuits).
- **Explanation:** Verified empirically at 3c43e7b: 0 of 12 female indies in a fresh game have female first names ('Drew Bradley [f]', 'Ian Wright [f]', …); 0 female-named workers among all AI indy signings across four 300-week runs; all 5 AJW female jobbers male-named (intl exemption).
- **Confidence:** High · **Source:** Code js/engine.js L272-286; empirical generator runs at 3c43e7b (this audit)

### Still open at 3c43e7b

| ID | Re-check |
|---|---|
| FA-ENG-6 | Double January intake (15 indies + 4-6 rookies) unchanged in 'full' mode — now at least tracked in the talentIntake ledger (indy classes record counts; rookie classes record only the year). |
| FA-ENG-7 | Classes capped at 2001; tail is rookies-only. Unchanged. |
| FA-ENG-8 | '1,400+ unsigned independents' comment and the residual summary line unchanged (see also NEW-6). |
| FA-ENG-9 | employmentStatus still write-only. |
| FA-ENG-10 | Name dedup still per-call; the new female pool slightly raises collision odds within a call (nickname suffix dedup still applies). |
| FA-ENG-11 | sim.js still filters 'Need at least N matches' errors (3 sites). |
| FA4-1 | Generator header comment (2,500-4,000 workers) unchanged. |
| NEW-3 | Fresh indies still cannot enter bidding wars (pop ceiling 21 < 55); released-and-pushed path still works (v5). |
| NEW-4 | placeBid still accepts faUntil === null; ctx.sign still does not clear state.bids. |
| NEW-5 | Fresh vs released indy button sets still inconsistent (no OPEN for fresh, no REMOVE for released). |
| NEW-6 | Residual-market summary line still mislabels non-generated low-pop FAs as 'unsigned independents'. |

**Model re-verified (pre-correction data):** 408 = 311 scripted + 60 generated indies + 37 local jobbers (unchanged from v4/v5); 6 × 15 = 90 entering 1996-2001; 150 total indies by t300 in all four spectate runs; jobbers 37 constant; determinism PRESERVED (120-week replay identical). node test/sim.js → ALL SANITY CHECKS PASSED; node test/ai-stress.js → PASSED (12 seeded runs, 2,160 cards, save migration verified)

---

## Part 2 — Applied high-confidence corrections

**Source:** audit/cwvwwf_patch_recommendations.json (133 ops; 108 High) filtered to the requested categories — wrestler, free-agent and arrival-date corrections — at High confidence only

### What was applied (92 operations + 2 test updates)

- **wrestler_modifies:** 25 entries / 35 field changes (3 alignments, 7 contract/noRenew sets, 3 company moves, the Goldust→Dustin Rhodes identity swap, 11 birth-year ages)
- **removals_from_start:** 21 entries (12 duplicate/not-under-contract removals + 9 conversions)
- **fa_arrival_modifies:** 13 entries / 16 field changes (arrival turns + Lita/Rick Steiner/Dean Douglas ages)
- **conversions_to_fa_arrivals:** 9 (8 High converts + Eddy Guerrero per DEV-1)
- **new_fa_arrivals:** 11 (8 missing workers + 3 re-adds per DEV-4)
- **test_assertion_updates:** 2

### New baseline

- **fresh_game:** 387 = 290 starters + 60 generated indies + 37 local jobbers (was 408 = 311+60+37)
- **fa_arrivals:** 43 entries (was 23)
- **workers_ever_by_2001:** 430 distinct scripted workers (was 411)

### Verification

- node test/sim.js → ALL SANITY CHECKS PASSED (after the 2 assertion updates); node test/ai-stress.js → PASSED
- Parse/id checks: 290 unique wrestler ids, 43 unique FA ids, no WRESTLERS↔FA_ARRIVALS id overlap, entries turn-sorted
- 300-week spectate: no errors; all 20 new/converted arrivals present exactly on schedule (goldberg careerStartTurn=131, rvd=48, sable=59); Eddy Guerrero organically ran ECW → WCW as his real 1995 chain
- Determinism preserved (120-week replay identical); indy model intact (150 indies, 37 jobbers, 6 classes)
- Cross-reference safety pre-checked: sid timeline events null-guarded; teamValid tolerates the temporarily-missing Blu Brothers; DEFAULT_PICKS harmless; no other references to renamed/removed ids

### Documented deviations from the literal ops list

### DEV-1 — Eddy Guerrero applied as an ECW FA arrival at t13 instead of the literal op {company: null, contract: 21}.

Why: WRESTLERS entries with company:null are unsignable decoration in the current engine: newGame hardcodes faUntil:null/asking:null for starters, the AI allFAs filter excludes non-indy faUntil-null workers, and the FA tab hides pop<20 non-notable rows. The research itself specifies 'ECW arrival ~turn 13 (April 8, 1995)', which the FA_ARRIVALS mechanism delivers cleanly (16-week window, ECW interest).

### DEV-2 — Hardy Boyz applied as WWF FA arrivals at t144 instead of 'seeded unsigned free agents at start'.

Why: Same engine limitation as DEV-1 — seeded starters with company:null cannot be signed by anyone. The t144 arrival (mid-1998, interest WWF) is the historically load-bearing event and is fully playable. Jeff's age set to 20 and Matt's to 23 (arrival-date ages; the research's 17/20 were framed for a Jan-1995 seed and the engine has no aging mechanic).

### DEV-3 — Rick Rude's arrival turn corrected from the research's '~96' to t90.

Why: The research note is internally inconsistent: t96 is January 1997 by the game's turn formula (year=1995+⌊t/48⌋, month=⌊t/4⌋%12), while the sourced date is November 1996 (= t88-91). Per the standing 'never hand-derive turns' rule the DATE wins; t90 = November wk3 1996 (November to Remember, Nov 16).

### DEV-4 — Kurasawa (t36), Rad Radford (t18) and Phineas Godwinn (t30, age 26) were re-added as dated FA arrivals alongside their removals from the start.

Why: Their High-confidence recommendations explicitly include the later arrival ('add a WCW signing event ~turn 36', 'WWF debut May 13, 1995', 'the Godwinns debuted on WWF TV in August 1995, age 26'), and Phineas's absence would permanently break the Godwinns team. The nine 'optionally add…' removals (barbarian, barry-windham, jim-neidhart, tom-brandi, missy-hyatt, the-shark/savio-vega rename chains, louie-spicolli) were applied as removals only, exactly as the ops list carries them.

### DEV-5 — Mark Henry's finisher entered as 'Press Slam' (not 'World's Strongest Slam').

Why: Single-quoted JS string safety (apostrophe) plus period accuracy — the World's Strongest Slam name postdates 1996.

### DEV-6 — Two test/sim.js assertions updated to the corrected data.

Why: 'betrayal flip' assumed Hogan starts heel (he now correctly starts face; the test now asserts the align actually flips, direction-agnostic) and the custom-fed draft pick list included eddy-guerrero (now an FA arrival; replaced with chris-benoit, keeping the roster size at 8).

### Not applied in this pass (available follow-ups)

| Scope | Examples |
|---|---|
| Initial title holders (17 High ops) | wwf-women → Bull Nakano, wwf-tag vacant, nwa-world → Chris Candido, AJPW/NJPW/CMLL/SMW/USWA title holders; remove ecw-hardcore/aaa titles; add ecw-tag and smw-tag |
| Faction corrections (3 High ops) | dungeon-of-doom → Three Faces of Fear roster; million-dollar-corp leader |
| Announcer corrections (6 High ops) | CMLL announcer starters; Larry Zbyszko t67, Michael Cole t119, Tazz t243 arrival turns |
| Timeline event-date corrections (5 High ops) | austin-316 t71, dx t129, ecw-raven-title-96 t51, wcw-flair-returns-99 t177, wcw-final-nitro-2001 t299 |
| Timeline death/retirement events (7 High ops) | Pillman t132, Yokozuna t279, Baba t195, Onita t16, Spicolli t150, Rude t206, IYH-8 t67 — NOTE: until the Rude death event lands, the newly added Rick Rude will keep working past his April 20, 1999 death |
| Medium-confidence ops (25) | stat tuning (Bigelow/Bull Nakano/Blayze work rates), craig-pittman convert, dances-with-dudley t24, Bubba Ray Dudley & Megumi Kudo adds |

### Delivery

- Local commit: `7621cf2 (branch audit-work in the workspace clone, on top of 3c43e7b)`
- Patch: `audit/cwvwwf_high_confidence_corrections.patch (git format-patch; apply with `git am`)`
- Push: BLOCKED — the sandbox token (arena-ai-coding-agent[bot]) has no push permission on westybrookuk/WCW-vs-WWF (403). The commit is preserved in the workspace and published as the patch; it can be pushed once GitHub access for that repo is granted, or applied directly by the owner.

---

## Carry-over

Historical data findings beyond the applied ops (the 265-finding v2 list, six v3 lists, GEN-* generator verdicts) remain authoritative as committed in v4/v5. The not-applied op groups above are the natural next pass.

*The full 92-operation log (every field change with before/after values) is embedded in `audit/cwvwwf_data_audit_v6.json` as `part2_full_op_log`.*


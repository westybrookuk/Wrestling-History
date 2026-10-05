# WCW vs WWF — Game Data Audit v4: the jobber-generation fix, verified

**Audited revision:** `de2dc15` — *"Fix annual independent jobber generation"*, branch [`arena/01a042dd-wcw-vs-wwf`](https://github.com/westybrookuk/WCW-vs-WWF/tree/arena%2F01a042dd-wcw-vs-wwf) (PR #4).  
**Delta since the v3 audit (`1754a04`):** exactly one commit — `js/engine.js`, +5/−3 lines. `js/data.js` and `js/timeline.js` remain **byte-identical** to the original audit baseline (verified: 0 diff lines vs `12d9fcd`), so the complete historical audit carries over unchanged.  
**Method:** every claim below verified by running the actual engine — a fresh `newGame`, a player-run simulation to turn 252, a spectate simulation to turn 300 (past the final January-2001 class), and the repo’s own test suite.  
**Audit only — the repository has not been modified.**

---

## 1. The fix, verified

The v3 headline defect (**FA-ENG-1**: the January intake re-ran the *whole* generator, adding 37 signed local jobbers every January — 259 jobbers by 2001 instead of 37) is **fixed**: `generateWorldTalent(state, poolCount, includeJobbers = false)` now early-returns before the jobber loop (js/engine.js L266, L328–330), and only `newGame` passes `true` (L253). Jobbers are seeded exactly once, at world creation.

**Stated design vs. measured behaviour at `de2dc15`:**

| Design claim | Measured | Verdict |
|---|---|---|
| 60 generated unsigned independents at game start | VERIFIED: fresh game = 408 wrestlers (311 seeded + 60 indies + 37 jobbers); indyPool option 60/40/0 honoured at creation | ✅ Verified |
| 15 generated independents each January 1996-2001 | VERIFIED: all six classes fire (turns 51, 99, 147, 195, 243, 291) - indyClassYear [1996,1997,1998,1999,2000,2001] obser… | ✅ Verified |
| 90 total generated wrestlers gradually entering | VERIFIED: exactly 150 generated indies exist in the world after the 2001 class (60 + 6 x 15) and 0 of them are jobbers | ✅ Verified |
| 37 local federation jobbers | VERIFIED: jobbers stay at exactly 37 for the whole simulated period, per-fed distribution identical to the turn-0 seedi… | ✅ Verified |
| 23 scripted historical future arrivals | VERIFIED: js/data.js unchanged (0 diff lines vs the original audit baseline 12d9fcd) | ✅ Verified |

**Measurements:**
- **fresh_game:** 408 wrestlers = 311 seeded + 60 indies + 37 jobbers; indyPool=0 -> 348
- **player_sim_to_t252:** jobbers 37 (constant), indies 135 after the 2000 class, 0 indy signings
- **spectate_sim_to_t300:** indyClassYear [1996..2001], 150 indies total, 37 jobbers, 0 indy signings
- **test_suite:** node test/sim.js -> ALL SANITY CHECKS PASSED
- **determinism:** preserved: the includeJobbers=true path consumes the RNG in the same order as the pre-fix code, so identical seeds still produce identical worlds

The stated model — **60 at start / 15 per January 1996–2001 / 90 entering / 23 scripted arrivals / 37 jobbers** — now holds *exactly*: 150 generated independents and 37 jobbers in the world after the final 2001 class. The v3 overrun (~312 entrants, 259 jobbers) is gone, and determinism is preserved for fresh games (the `includeJobbers=true` path consumes the RNG in the same order as before). The fix comment in the code matches the intent precisely.

A second v3 finding falls with the same fix: **FA-ENG-4** (January jobbers recording `career.start: 0`) is **resolved as moot** — no jobbers are created after turn 0 any more, so the hardcoded `start: 0` is now always accurate.

---

## 2. Status of every v3 engine finding

| ID | Finding | Status at `de2dc15` | Conf. |
|---|---|---|---|
| `FA-ENG-1 [RESOLVED]` | v3 finding: the January intake re-ran the whole generator, adding 37 signed local jobbers… | **RESOLVED** | High |
| `FA-ENG-4 [RESOLVED AS MOOT]` | v3 finding: January jobbers recorded career: [{ company, start: 0 }] even when created at… | **RESOLVED (moot)** | High |
| `FA-ENG-2 [OPEN]` | Generated indies can never be signed: AI bidding filters w.faUntil !== null (js/engine.js… | **OPEN** | High |
| `FA-ENG-3 [OPEN]` | The indyPool=0 new-game option ("historical names only") still does not disable the Janua… | **OPEN** | High |
| `FA-ENG-5 [OPEN]` | deleteGeneratedWrestler (js/engine.js L338-345) still splices the wrestler without cleani… | **OPEN** | Low |
| `FA-ENG-6 [OPEN - needs design decision]` | Every January 1996-2001 still fires two generated intakes: the indy class (15) plus the p… | **OPEN** | Medium |
| `FA-ENG-7 [OPEN - design note]` | January classes stop after 2001 (hook gated to d.year <= 2001, js/engine.js L3360) while … | **OPEN** | Low |
| `FA-ENG-8 [OPEN]` | js/ui.js L713 still comments "1,400+ unsigned independents exist - show the notable ones … | **OPEN** | Low |
| `FA-ENG-9 [OPEN]` | employmentStatus ('independent' / 'local-jobber', js/engine.js L300) is written on every … | **OPEN** | Low |
| `FA-ENG-10 [OPEN]` | Name de-duplication remains per-call (usedNames Set inside each generateWorldTalent call)… | **OPEN** | Low |
| `FA-ENG-11 [OPEN - observation]` | test/sim.js still filters "Need at least N matches" validateCard errors out of its failur… | **OPEN** | Medium |
| `FA4-1` | The generateWorldTalent header comment (js/engine.js L258-261) still describes "a large u… | **OPEN** | Low |

### FA-ENG-2 [OPEN]

- **Current:** Generated indies can never be signed: AI bidding filters w.faUntil !== null (js/engine.js L3997) and indies are created with faUntil: null; the FREE AGENTS tab routes every generated indie to a REMOVE FROM WORLD button (js/ui.js L713-742); placeBlindBid rejects faUntil === null (L5538)  
- **Recommended:** Give generated indies an open bid window on creation (like the training-class rookies, faUntil = turn + 8-24) and/or SIGN/PPA buttons for isIndy workers; signFreeAgent() already works on them when invoked  
- **Category:** Bug / design defect · **Confidence:** High

Re-verified at de2dc15: 0 generated-indy signings in both new simulations (player and spectate, through t252/t300) while the unsigned pool reached 150. This is now the single biggest gap between the model's intent (a living curated market) and its behaviour (a decorative, ever-growing list).

### FA-ENG-3 [OPEN]

- **Current:** The indyPool=0 new-game option ("historical names only") still does not disable the January classes: state.game.indyPool is stored (js/engine.js L94) but never read; the January hook (L3360) fires regardless  
- **Recommended:** Gate the January class on (state.game.indyPool ?? 60) > 0, or store and honour a per-game flag.  
- **Category:** Bug · **Confidence:** High

Re-verified at de2dc15: a newGame with indyPool=0 starts with 348 wrestlers and 0 indies, then January 1996 still injects 15 generated indies.

### FA-ENG-5 [OPEN]

- **Current:** deleteGeneratedWrestler (js/engine.js L338-345) still splices the wrestler without cleaning state.bids[id]  
- **Recommended:** Add delete state.bids[id] on removal.  
- **Category:** Bug (edge case) · **Confidence:** Low

Unchanged by this revision; still a low-likelihood edge case with an easy fix.

### FA-ENG-6 [OPEN - needs design decision]

- **Current:** Every January 1996-2001 still fires two generated intakes: the indy class (15) plus the pre-existing training class (4-6 rookies, js/engine.js L3368-3401)  
- **Recommended:** Confirm the stacking is intended. With the jobber fix in place the true generated entry rate is 19-21 per year, not 15. The rookies are the only generated workers the AI ever signs, so removing them entirely would worsen FA-ENG-2 - thinning them, or giving indies windows, is the better path.  
- **Category:** Needs manual review · **Confidence:** Medium

Unchanged by this revision. Now the main reason the world still exceeds the "90 entering" design: measured 150 indies + ~25-36 rookies across 1996-2001, plus the 60 start pool and 37 jobbers.

### FA-ENG-7 [OPEN - design note]

- **Current:** January classes stop after 2001 (hook gated to d.year <= 2001, js/engine.js L3360) while the game runs to turn 599 (June 2007); the 2002-2007 tail has only the 4-6/year training class as new supply  
- **Recommended:** Acceptable as an intentional historical-period cap; consider a reduced rate (e.g. 5/year) through the tail or document the taper.  
- **Category:** Design note · **Confidence:** Low

Confirmed: the 2001 class (turn 291) is the last - verified in the spectate run.

### FA-ENG-8 [OPEN]

- **Current:** js/ui.js L713 still comments "1,400+ unsigned independents exist - show the notable ones and summarize the rest", and the summarize path is dead (every isIndy worker is notable)  
- **Recommended:** Update the comment to the shipped model (60 + 15/year, 150 by 2001).  
- **Category:** Cosmetic · **Confidence:** Low

Unchanged by this revision.

### FA-ENG-9 [OPEN]

- **Current:** employmentStatus ('independent' / 'local-jobber', js/engine.js L300) is written on every generated worker but read nowhere in the codebase  
- **Recommended:** Use it or drop it.  
- **Category:** Cosmetic · **Confidence:** Low

Re-verified at de2dc15: no read sites in js/.

### FA-ENG-10 [OPEN]

- **Current:** Name de-duplication remains per-call (usedNames Set inside each generateWorldTalent call); the training-class generator still has no dedup at all  
- **Recommended:** Keep a state-level name registry.  
- **Category:** Robustness · **Confidence:** Low

Unchanged by this revision; the v3 measurement (2 duplicate names in ~305 generated workers by 1999) still stands as the expected rate.

### FA-ENG-11 [OPEN - observation]

- **Current:** test/sim.js still filters "Need at least N matches" validateCard errors out of its failure conditions (L121-122, L229-230, L366-367)  
- **Recommended:** Reconsider silently ignoring insufficient-card validation.  
- **Category:** Observation · **Confidence:** Medium

The full suite passes at de2dc15 ("ALL SANITY CHECKS PASSED"), including the updated world-size thresholds (world >= 350, indies >= 55) - both consistent with the measured 408-worker fresh game.

### FA4-1

- **Current:** The generateWorldTalent header comment (js/engine.js L258-261) still describes "a large unsigned independent pool" filling out "the rest" of a 2,500-4,000-worker world  
- **Recommended:** Update the comment to the curated model (60 at start + 15/year 1996-2001 = 150 total, plus 37 one-time jobbers) - same cleanup class as FA-ENG-8.  
- **Category:** Cosmetic · **Confidence:** Low

Cosmetic only; surfaced by this revision because the jobber fix already corrected the adjacent comment but left the function header untouched.

**The remaining priority item is FA-ENG-2:** the curated 60 + 15/year market still cannot be signed by anyone — the AI only bids on workers with open `faUntil` windows (indies get `null`), the FREE AGENTS tab routes every generated indie to *REMOVE FROM WORLD* instead of SIGN/BID, and `placeBlindBid` rejects them outright. Both new simulations again measured **0 indy signings** while the pool grew to 150. The engine’s `signFreeAgent()` works on them when invoked directly; the market is broken at the reachability layer. With the jobber fix in place, this is now the single biggest gap between the model’s intent and its behaviour — a decorative, ever-growing list rather than a living market.

---

## 3. Historical data — carry-over re-verification

`git diff 12d9fcd..de2dc15 -- js/data.js js/timeline.js` → **0 lines.** The complete historical audit therefore stands as previously delivered (v2/v3), with every current value still accurate against this revision:

- **265 findings** across 14 sections + **237 verified-clean wrestlers**
- Headlines: 12 wrong championship holders at the January 1995 start; 7 duplicate identities; 12 wrong-company placements (Goldust→Dustin Rhodes/WCW, Sid→USWA, Guerrero NJPW/AAA, Eaton→WCW, Hogan seeded heel…); 15 of 23 future arrivals mis-dated (Goldberg t160→t131, Lita t200→t245, Jacqueline t96→t164, RVD t72→t48…); all 3 factions anachronistic; unmodelled deaths (Pillman t132, Yokozuna t279, Baba t195, Jumbo t257, Spicolli t150, Rude t206) and Austin’s neck injury (t124–137).
- **Six correction lists, unchanged and still fully applicable** (embedded in `cwvwwf_data_audit_v4.json` → `correction_lists_unchanged`; also available as the standalone `*_v3.json` files): 47 missing wrestlers (Kurt Angle t233, Edge t167, Christian t179, the Hardys, the Dudleys, Mark Henry t57, Rick Rude, Megumi Kudo…), 12 wrong-company, 28 arrival corrections, 79 stat corrections, 32 free-agent corrections, 7 generated-talent recommendations — every entry carrying `{id, current_value, recommended_value, explanation, confidence, source}`.

---

## 4. What to fix next (priority order)

1. **FA-ENG-2 (High):** open `faUntil` windows on generated indies (or add SIGN/PPA buttons for them) so the curated market can actually be signed — measured 0 signings across every simulation to date.
2. **FA-ENG-3 (High):** honour the `indyPool=0` option in the January-class gate.
3. **FA-ENG-6 (Medium, needs decision):** the 15/year class stacks with the 4–6/year training class (19–21 generated entrants/year in 1996–2001).
4. **FA-ENG-5 / FA-ENG-10 (Low):** `delete state.bids[id]` on removal; a state-level name registry.
5. **FA-ENG-8 / FA-ENG-9 / FA4-1 (Cosmetic):** the stale “1,400+” and “large pool” comments; the dead `employmentStatus` field.
6. **The historical corrections** (missing wrestlers led by Kurt Angle, wrong-company fixes, arrival turn/date corrections, stat fixes, title holders) — unchanged since v2/v3 and ready to apply from the embedded lists.

---

## Appendix — verification log

- `git fetch` + `git diff 1754a04..de2dc15`: single commit, `js/engine.js` only (+5/−3).
- Fresh `newGame`: 408 wrestlers (311 + 60 + 37); `indyPool=0` → 348 (and the January class still fires — FA-ENG-3).
- Player simulation to t252: jobbers constant at 37, per-fed distribution = the turn-0 set, 0 jobbers after t0, 0 indy signings.
- Spectate simulation to t300: `indyClassYear [1996,1997,1998,1999,2000,2001]`, **150 indies total**, 37 jobbers, 0 indy signings.
- `node test/sim.js`: **ALL SANITY CHECKS PASSED**.
- All callers of `generateWorldTalent` checked: only `newGame` (jobbers=true) and the January hook (jobbers omitted).

*Predecessors: `cwvwwf_data_audit_v3.json` / `.md` (free-agent model audit @ 1754a04), `cwvwwf_data_audit.json` / `.md` (v2 full-repository audit) and `cwvwwf_patch_recommendations.json` — all in this directory, all still accurate for this revision.*

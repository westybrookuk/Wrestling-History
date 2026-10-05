# WCW vs WWF — Game Data Audit v3: the revised free-agent model

**Audited revision:** `1754a04` — *"Refine free-agent pool and testing tools"*, branch `arena/01a042dd-wcw-vs-wwf` (PR #4), pushed 2026-08-29.  
**Files audited:** `js/engine.js` (world generation, January intake, delete tool, FA bidding), `js/data.js` (311 wrestlers, 23 future arrivals, 28 teams, 37 titles, 3 factions, 15 managers, announcer booths), `js/timeline.js` (291 events, turns 0–599), `js/ui.js` (FREE AGENTS tab, new-game options), `test/sim.js` (model thresholds).  
**Method:** every engine claim below was verified by running the actual engine (`newGame` + multi-year `runWeek` simulations) and reading the shipped code at cited lines; every historical claim carries the research sources from the v1/v2 audit, with current values re-confirmed against a fresh dump of this revision.  
**This is an audit only — the repository has not been modified.** Nothing is silently guessed; disputed or unverifiable points are flagged *Needs manual review*.

**Deliverables:** this report · `cwvwwf_data_audit_v3.json` (complete audit, all findings + sources) · six list files — `cwvwwf_missing_workers_v3.json`, `cwvwwf_wrong_company_v3.json`, `cwvwwf_future_arrival_corrections_v3.json`, `cwvwwf_stat_corrections_v3.json`, `cwvwwf_free_agent_corrections_v3.json`, `cwvwwf_generated_talent_recommendations_v3.json`. Every correction in every file carries `{id, current_value, recommended_value, explanation, confidence, source}`.

---

## 1. The new free-agent model vs. the stated design

| Stated design | Verified in code / measured | Verdict |
|---|---|---|
| 60 (js/engine.js L262; new-game options 60/40/0 via opts.indyPool) | Confirmed: generateWorldTalent(state, opts.indyPool ?? 60) at newGame (L253). Fresh game measured: exactly 60 generated unsigned … | ✅  |
| 15 per January, 1996-2001 (js/engine.js L263, L3358-3362) | Confirmed: at January week 4 of 1996-2001 (turns 51, 99, 147, 195, 243, 291) the engine calls generateWorldTalent(state, 15) once… | ✅  |
| 23 scripted historical future arrivals (js/data.js, unchanged since t… | Confirmed: 23 entries. The data file is byte-identical to the previously audited revision, so all 265 v2 findings on the seeded d… | ✅  |
| 37 generated local jobbers at start (NJPW 4, AJPW 4, AJW 5, CMLL 3, A… | Confirmed: 37 signed local jobbers at turn 0, correctly excluded from the historical roster audit. | ✅ (with caveats) |
| 408 wrestlers at turn 0 (311 seeded + 60 generated indies + 37 genera… | Measured: newGame produces 408 wrestlers; freeAgents() = 60. The prior revision produced 1,298 (950-pool); the new default world … | ✅  |

**Fresh-game measurement (turn 0):** 408 wrestlers = 311 seeded + 60 generated unsigned independents + 37 generated local jobbers. Indies: 15% female, 3.3% hidden gems, ages 18–41, pop 5–21, work 28–85, ceiling 42–91. The previous revision generated a 950-worker pool (1,298 total); the new default world is 890 workers smaller.

**January intake measurement (each class fires at January week 4 — turns 51, 99, 147, 195, 243, 291):**

| Year | Turn | Indies added | **Jobbers also added (bug FA-ENG-1)** | Total wrestlers after |
|---|---|---|---|---|
| 1996 | 51 | +15 | **+37** | 476 |
| 1997 | 99 | +15 | **+37** | 542 |
| 1998 | 147 | +15 | **+37** | 604 |
| 1999 | 195 | +15 | **+37** | 661 |
| 2000 | 243 | +15 | **+37** | 718 (measured at t268) |
| 2001 | 291 | +15 | **+37** | not measured (sim ended t268); identical code path |

**Totals by end-2001.** Intended: *60 + 90 = 150 generated independents; 37 jobbers; 23 scripted arrivals*. Actual projected: *150 generated independents + 259 jobbers (37 x 7 intakes) + ~25-36 training-class rookies (4-6/yr, still active) = ~434-445 generated workers entering, i.e. the "90 total entering" design is exceeded by ~3.5x, driven by the FA-ENG-1 jobber side-effect*.

Two implementation defects break the design in practice:

1. **FA-ENG-1 (High):** the January call `generateWorldTalent(state, 15)` re-runs the *whole* generator — including the local-jobber loop. Every January adds 37 signed jobbers on top of the 15 indies (NJPW +4/yr, AJW +5/yr, …), so the world reaches **259 jobbers by 2001 instead of 37**, and the “90 total generated entering” becomes ~312.
2. **FA-ENG-2 (High):** generated indies can **never be signed** — the AI only bids on workers with an open `faUntil` window (indies are created with `faUntil: null`), the UI’s FREE AGENTS tab routes every generated indie to a *REMOVE FROM WORLD* button instead of SIGN/BID, and `placeBlindBid` rejects them outright. Measured: **0 signings in a 5.5-year simulation** while the pool grew past 135. The engine’s `signFreeAgent()` works on them when called directly — the market is broken at the reachability layer, not the data layer.

---

## 2. Free-agent model / engine findings

### FA-ENG-1 — The January intake re-runs the ENTIRE generator: generateWorldTalent(state, 15) at js/engine.j…

- **Current:** The January intake re-runs the ENTIRE generator: generateWorldTalent(state, 15) at js/engine.js L3361 also executes the unguarded INDY_JOBBERS_PER_FED loop at L329-333, adding 37 signed local jobbers every January 1996-2001  
- **Recommended:** Split the function - e.g. generateIndyClass(state, n) that skips the jobber loop - or pass an options object ({ pool: 15, jobbers: false }). Keep the 37 jobbers as a single turn-0 seeding.  
- **Category:** Bug · **Confidence:** High  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the real engine (this audit…

The headline defect of the revision. Measured: each January 1996-2000 adds +15 unsigned indies AND +37 signed local jobbers (NJPW +4/yr -> 20 by 1999, AJW +5/yr -> 25, CMLL/AAA/USWA/ASW +3/yr -> 15 each). By end-2001 the world carries 259 generated jobbers instead of 37, inflating every mid-card fed payroll and contradicting the documented design ("90 total generated wrestlers gradually entering"; the new-game hint promises only the 15/year). Historical note: real NJPW/AJPW/AJW undercards did not gain 4-5 permanent local hands per year.

### FA-ENG-2 — Generated indies can never be signed: the AI free-agent loop filters w.faUntil !== null (js/en…

- **Current:** Generated indies can never be signed: the AI free-agent loop filters w.faUntil !== null (js/engine.js L3995) and generated indies are created with faUntil: null (L313); the FREE AGENTS tab only offers BID to "hot" (pop >= 55) workers and routes every generated indie to a REMOVE FROM WORLD button instead (js/ui.js L713-742); placeBlindBid rejects faUntil === null outright (L5536)  
- **Recommended:** Give generated indies an open bid window on creation (e.g. faUntil = turn + 8-24, like the training-class rookies at L3393), and/or add SIGN/PPA buttons for isIndy workers, and/or let AI feds periodically open windows on the best remaining indies. signFreeAgent() itself works on them if invoked - only the paths to reach it are closed.  
- **Category:** Bug / design defect · **Confidence:** High  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the real engine (this audit…

Measured over a 5.5-year simulation: 0 of 135+ available generated indies were ever signed by any company (the AI signed only faUntil-window workers). The engine functions accept indies (signFreeAgent/placeBid succeed when called directly), so this is a reachability defect, not a data defect. Consequence: the curated 60 + 15/year market is decorative - it only grows, and the player's only interaction is deleting workers.

### FA-ENG-3 — The indyPool=0 new-game option ("historical names only") does not disable the January classes:…

- **Current:** The indyPool=0 new-game option ("historical names only") does not disable the January classes: state.game.indyPool is stored (js/engine.js L94) but never read, and the January hook (L3358) fires regardless of the chosen pool size  
- **Recommended:** Gate the January class on (state.game.indyPool ?? 60) > 0, or store and honour a per-game flag.  
- **Category:** Bug · **Confidence:** High  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the real engine (this audit…

Measured: newGame with indyPool=0 correctly starts with 0 generated indies (348 wrestlers), but January 1996 still injects 15 indies + 37 jobbers. A player who chose "historical names only" silently receives generated talent anyway.

### FA-ENG-4 — January jobbers record their career as starting at turn 0: makeWorker always writes career: [{…

- **Current:** January jobbers record their career as starting at turn 0: makeWorker always writes career: [{ company, start: 0, end: null }] (js/engine.js L318) even when the worker is created at turn 51+  
- **Recommended:** Use start: state.game.turn (careerStartTurn at L321 is already correct - align the career array with it).  
- **Category:** Bug · **Confidence:** Medium  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29)

Data-integrity: a jobber generated in January 1998 (turn 147) shows a career history beginning January 1995. Affects career-length displays, retirement timing and anything reading w.career.

### FA-ENG-5 — The new deleteGeneratedWrestler (js/engine.js L336-343) splices the wrestler but never cleans …

- **Current:** The new deleteGeneratedWrestler (js/engine.js L336-343) splices the wrestler but never cleans state.bids[id] (bid store at L228) or other id-keyed state  
- **Recommended:** Add delete state.bids[id] on removal, and sweep any other id-keyed references.  
- **Category:** Bug (edge case) · **Confidence:** Low  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29)

If a bid was ever placed on a generated indie (placeBid accepts them), removing the worker leaves an orphaned bid entry; withdrawBid's UI handler dereferences wrestler(...).name and would throw on the orphan. Low likelihood, easy fix.

### FA-ENG-6 — Every January 1996-2001 fires TWO generated intakes: the new indy class (15) and the pre-exist…

- **Current:** Every January 1996-2001 fires TWO generated intakes: the new indy class (15) and the pre-existing training-class intake (4-6 rookies, js/engine.js L3366-3399) in the same January week 4  
- **Recommended:** Confirm the stacking is intended. If the 15/year class replaces the old supply, retire or thin the training class inside 1996-2001 - but note the rookies are the only generated workers the AI actually signs (they open faUntil windows), so removing them entirely would worsen FA-ENG-2.  
- **Category:** Needs manual review · **Confidence:** Medium  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the real engine (this audit…

With FA-ENG-1 fixed, the true generated entry rate is 15 + 4-6 = 19-21 per year, not the stated 15. Needs a design decision rather than a silent guess - flagged as such.

### FA-ENG-7 — The January classes stop after 2001 (hook gated to d.year <= 2001, js/engine.js L3358) while t…

- **Current:** The January classes stop after 2001 (hook gated to d.year <= 2001, js/engine.js L3358) while the game timeline runs to turn 599 (June 2007)  
- **Recommended:** Acceptable as an intentional "historical period" cap; the 2002-2007 tail then has only the 4-6/year training class as new supply. Consider extending the class at a lower rate (e.g. 5/year) through the tail, or document the taper.  
- **Category:** Design note · **Confidence:** Low  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29)

Design note, not a bug.

### FA-ENG-8 — js/ui.js L713 still says "1,400+ unsigned independents exist - show the notable ones and summa…

- **Current:** js/ui.js L713 still says "1,400+ unsigned independents exist - show the notable ones and summarize the rest", and the summarize path (indyCount = market.length - notable.length) is now dead because every isIndy worker is notable  
- **Recommended:** Update the comment to the new model (60 + 15/year) and drop or repurpose the summarize path.  
- **Category:** Cosmetic · **Confidence:** Low  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29)

Cosmetic, but the comment actively misdescribes the shipped model and will mislead future maintainers.

### FA-ENG-9 — Generated workers get employmentStatus: 'independent' / 'local-jobber' (js/engine.js L300) but…

- **Current:** Generated workers get employmentStatus: 'independent' / 'local-jobber' (js/engine.js L300) but nothing in the codebase ever reads the field  
- **Recommended:** Either use it (roster filters, stats, the remove-from-world guard) or drop it; the remove-from-world guard currently re-derives the same information from isIndy && !w.company.  
- **Category:** Cosmetic · **Confidence:** Low  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29)

Dead field added by this revision. Harmless, but it is an undocumented save-format addition.

### FA-ENG-10 — Name de-duplication is per-call only: makeWorker dedups against a usedNames Set created inside…

- **Current:** Name de-duplication is per-call only: makeWorker dedups against a usedNames Set created inside each generateWorldTalent call (js/engine.js L268, L285-292); the training-class generator has no dedup at all  
- **Recommended:** Keep a state-level registry of generated names (or check against all existing wrestler names) on creation.  
- **Category:** Robustness · **Confidence:** Low  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the real engine (this audit…

Measured: 2 duplicate names across ~305 generated workers by 1999 in one sim (e.g. "Gavin Smith", "Carlos Ramirez"). The per-call Set means a January class can repeat a name from an earlier class, and rookies can repeat anything.

### FA-ENG-11 — test/sim.js L974-975 now requires world >= 350 and indies >= 55 (was 1200/900), the determinis…

- **Current:** test/sim.js L974-975 now requires world >= 350 and indies >= 55 (was 1200/900), the determinism check moved to index 200, and "Need at least N matches" validateCard errors are now filtered out of the failure conditions (L121-122, L229-230, L366-367)  
- **Recommended:** Keep the size/determinism updates (consistent with the measured 408-worker fresh game); reconsider silently ignoring insufficient-card validation - an AI that cannot field a legal card is a real regression signal.  
- **Category:** Observation · **Confidence:** Medium  
- **Source:** Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: node test/sim.js (this audit)

The full suite passes on this revision ("ALL SANITY CHECKS PASSED").

---

## 3. Generated-pool assumptions review

The generated independents and local jobbers are treated separately from the historical roster (they are not counted as historical full-time members anywhere in this audit). The seven requested assumption areas:

| Area | Current assumption | Verdict | Conf. |
|---|---|---|---|
| `GEN-gender` | Indies: 13% female (company === null && rng() < 0.13, js/engine.js L299); AJW local jobbers are 100% female (… | Acceptable as-is. Optionally raise the unsigned-indie female share to ~15-18% only if you want the joshi free-agent scene (AJW, J… | High |
| `GEN-international` | Every generated worker rolls an international flavour independently of the target fed: 9% japan, 9% mexico, 9… | Keep the overall ~36% international share for unsigned indies, but bias the roll by the target company's country: NJPW/AJPW/FMW j… | High |
| `GEN-stat-ranges` | Indies: pop 5-21 (gems 8-17), work 28-57 (gems 68-85), mic 18-45 (gems 40-69), ceiling 42-67 (gems 80-91), wa… | Ranges are sound for a curated filler pool. Optional tuning: (a) gem pop 8-17 means a hidden gem is LESS popular than a lucky non… | High |
| `GEN-hidden-gems` | rng() < 0.04 per generated worker (js/engine.js L296) | Keep 4%. Measured 2/60 (3.3%) at start; over the full 60+90 indy population that is ~6 gems for the period, plus the training-cla… | Medium |
| `GEN-age-ranges` | Indies 18-41 (18 + rng()*24, js/engine.js L305); rookies 18-24; jobbers 18-41 | Acceptable. Optionally extend the indy range to 18-45: the real 1995 indie circuit carried a meaningful cohort of 40+ veterans ea… | Medium |
| `GEN-name-duplication` | US pool 158 first x 696 last = 109,968 combinations; each international region 30 x 30 = 900; dedup only with… | Acceptable for the 150-worker historical window (measured 2 duplicates in ~305 generated by 1999), but adopt the state-level name… | Medium |
| `GEN-entry-rate` | 15 generated indies per January 1996-2001 (90 total) + 4-6 training-class rookies per year (every year) + 37 … | 15/year is a defensible ambient supply ONCE FA-ENG-1 is fixed and FA-ENG-2 gives the market an exit. Historical cross-check: the … | Medium |

### GEN-gender

- **Current:** Indies: 13% female (company === null && rng() < 0.13, js/engine.js L299); AJW local jobbers are 100% female (company === AJW forces gender f); training-class rookies 22% female  
- **Recommendation:** Acceptable as-is. Optionally raise the unsigned-indie female share to ~15-18% only if you want the joshi free-agent scene (AJW, JWP, GAEA, LLPW, FMW womens division were all actively trading talent) to feel proportionate.

Measured fresh game: 9/60 = 15% female indies (13% expected, RNG noise). The real 1995 worldwide worker pool was overwhelmingly male; women were concentrated in the joshi promotions, which the game represents via AJW (seeded real roster) plus this generated share. 13% of a WORLDWIDE pool is a reasonable order of magnitude; note only 1 of 16 companies is a joshi promotion, so a 13% female open market is, if anything, generous.

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the rea…*

### GEN-international

- **Current:** Every generated worker rolls an international flavour independently of the target fed: 9% japan, 9% mexico, 9% europe, 9% uk, 64% US-generic (js/engine.js L289-290)  
- **Recommendation:** Keep the overall ~36% international share for unsigned indies, but bias the roll by the target company's country: NJPW/AJPW/FMW jobbers should draw japan names, CMLL/AAA jobbers mexico names, and US-federation jobbers mostly US names. Currently a NJPW local hand can be generated with a UK name and an AJW jobber with a European one.

The 36% international share of the OPEN MARKET is historically fair for the period (US indies carried real Puerto Rican, Canadian, Mexican and Japanese presence, and the talent trade was global). The flaw is only the flavour-vs-fed independence for the 37 jobbers (and each January's accidental jobber batch - FA-ENG-1).

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the rea…*

### GEN-stat-ranges

- **Current:** Indies: pop 5-21 (gems 8-17), work 28-57 (gems 68-85), mic 18-45 (gems 40-69), ceiling 42-67 (gems 80-91), wage $3-8K, asking $5-12K. Jobbers: same stats + contract 40-119 turns. Rookies: pop 16-27, work 40-64, mic 28-49, age 18-24, ceiling 55-89, asking $12-21K  
- **Recommendation:** Ranges are sound for a curated filler pool. Optional tuning: (a) gem pop 8-17 means a hidden gem is LESS popular than a lucky non-gem (5-21) - consider gems 14-24 so "gem" is strictly better on discovery; (b) non-gem asking $5-12K/month is cheap enough that any fed could stockpile them if FA-ENG-2 is fixed - consider scaling asking with ceiling.

Verified: ceiling is a POPULARITY cap only (pop is clamped to ceiling at js/engine.js L623, L884, L1283+, while work grows independently to a hard cap of 92 at L3192). Therefore the 23.7% of generated workers who start with work > ceiling (measured 161/679) are NOT inconsistent - a great technician with modest star potential is a real archetype. Non-gems (pop 5-21, work 28-57, ceiling 42-67) sit credibly below TV level; gems (work 68-85, ceiling 80-91) are genuinely worth scouting.

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the rea…*

### GEN-hidden-gems

- **Current:** rng() < 0.04 per generated worker (js/engine.js L296)  
- **Recommendation:** Keep 4%. Measured 2/60 (3.3%) at start; over the full 60+90 indy population that is ~6 gems for the period, plus the training-class rookies' own "rare 90-ceiling diamond" (ceiling 55-89, L3388).

Historical calibration: the real "hidden gems" of 1995-2001 were mostly real people the game does not seed (Kurt Angle, the Hardys, Edge/Christian, the Dudleys, Jericho's rise, Rey Mysterio) - those belong to the missing-wrestlers list, not to a random gem roll. 4% ambient gems is a reasonable design substitute for the untrackable rest; a much higher rate would create fictional workers outshining real main-eventers.

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the rea…*

### GEN-age-ranges

- **Current:** Indies 18-41 (18 + rng()*24, js/engine.js L305); rookies 18-24; jobbers 18-41  
- **Recommendation:** Acceptable. Optionally extend the indy range to 18-45: the real 1995 indie circuit carried a meaningful cohort of 40+ veterans earning shots between territories.

Ages are internally consistent (the engine ages workers and retires them; the training-class cap of 24 and the dojo cutoff at 28, js/engine.js L4686, line up with the rookie design).

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29)*

### GEN-name-duplication

- **Current:** US pool 158 first x 696 last = 109,968 combinations; each international region 30 x 30 = 900; dedup only within a single generation call (see FA-ENG-10)  
- **Recommendation:** Acceptable for the 150-worker historical window (measured 2 duplicates in ~305 generated by 1999), but adopt the state-level name registry from FA-ENG-10 before the pools grow. Also consider one more international region (e.g. a Caribbean/Puerto Rican pool, given WWC and the US indy scene's Boricua presence).

The small 900-name international pools are the realistic collision risk (36% of every batch draws from 3,600 total intl names); by 2001 each region's pool will have been sampled ~20+ times, so regional repeats become common even with a global registry.

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the rea…*

### GEN-entry-rate

- **Current:** 15 generated indies per January 1996-2001 (90 total) + 4-6 training-class rookies per year (every year) + 37 jobbers per year (bug, FA-ENG-1)  
- **Recommendation:** 15/year is a defensible ambient supply ONCE FA-ENG-1 is fixed and FA-ENG-2 gives the market an exit. Historical cross-check: the big two promotions alone absorbed well over 15 NEW TV workers per year in this window (nWo additions, luchador imports, joshi imports, ECW exports, WWF newcomers) - but nearly all of those are the jobs of the 23 scripted…

Measured: the classes fire reliably (1996-2000 verified in-sim) and stack with the training class as described in FA-ENG-6. After 2001 supply tapers to 4-6 rookies/year (FA-ENG-7).

*Source: Code: WCW-vs-WWF @ 1754a04 (branch arena/01a042dd-wcw-vs-wwf / PR #4, "Refine free-agent pool and testing tools", pushed 2026-08-29); Empirical: fresh-game simulation with the rea…*

---

## 4. Historical data — carry-over re-verification

**`js/data.js` and `js/timeline.js` are byte-identical to the previously audited commit `12d9fcd`** — this revision changed only `js/engine.js`, `js/ui.js` and `test/sim.js`. All research findings therefore carry over with their current values re-confirmed against a fresh dump of `1754a04` (spot-verified: Hogan `align: heel`, Lita FA age 24 / turn 200, Bertha Faye age 27, Goldust company WWF, Sid company WWF, Eaton company SMW, Goldberg FA turn 160, Vader contract 150, Austin contract 20, Bigelow contract 40).

**Carried over:** 265 findings across 14 sections (roster, arrivals, teams, titles, managers, announcers, cruiserweights, timeline, documentation, factions, generated workers, ratings, absences, booth detail) + 237 verified-clean wrestlers. Full texts with sources: `cwvwwf_data_audit_v3.json` → `carried_over_findings` (and the v2 report for rendered history). Headlines unchanged:

- **12 wrong championship holders** at the January 1995 start (IWGP belts, Triple Crown, WWF Women’s/Tag, NWA World → Candido, CMLL World → Silver King, all three SMW/USWA belts); 2 nonexistent titles seeded; 2 real titles missing.
- **7 duplicate identities** (awesome/gladiator, avalanche/shark, kurasawa/nakanishi, sione/barbarian, rad-radford/spicolli, kwang/savio, douglas/dean-douglas).
- **12 wrong-company placements** — incl. Goldust→Dustin Rhodes (WCW), Sid→USWA champion, Guerrero still NJPW/AAA, Eaton→WCW, Hogan seeded heel (should be the face who turns at Bash at the Beach 96, turn 72).
- **15 of 23 future arrivals mis-dated** (Goldberg t160→t131, Lita t200→t245, Jacqueline t96→t164, RVD t72→t48, Kane t140→t132, Val Venis t132→t163, Sable t84→t59, Dean Douglas t40→t27 …) — full conversion table below.
- **All 3 factions anachronistic** (Horsemen should form at turn 39; Dungeon was the Three Faces of Fear; the Million Dollar Corp’s leader should be DiBiase).
- **Deaths/retirements still unmodelled** (Pillman t132, Yokozuna t279, Baba t195, Jumbo t257, Spicolli t150, Rude t206, Onita t16; Austin’s neck injury t124–137) — Owen (t211), Shawn (t155) and Bret (t239) are modelled correctly.

---

## 5. The six lists (summary view — full detail in the JSON files)

### 5.1 Missing wrestlers — `cwvwwf_missing_workers_v3.json` (47 entries: 28 from the v2 audit + 19 previously flagged)

**Tier 1 (10) — major names, strongly recommended:** `kurt-angle`, `edge`, `christian`, `jeff-hardy`, `matt-hardy`, `buh-buh-ray-dudley`, `d-von-dudley`, `mark-henry`, `rick-rude`, `megumi-kudo`.

Every entry carries the real availability date, suggested stat block, facts, confidence and source. Tier-1 highlights: **Kurt Angle** (signed Oct 1998, TV debut Nov 14, 1999 = turn 233; suggested 30/40/88/70/94 heel), Edge (t167), Christian (t179), Jeff & Matt Hardy (real WWF enhancement talent *at the January 1995 start*, contracts 1998 ≈ t144), Bubba Ray (t48–56) & D-Von (t61), Mark Henry (first TV Mar 11, 1996 = t57; 24/30/55/50/88), Rick Rude (absent-at-start correct + ECW t96 / WCW t137 chains, d. Apr 20, 1999 = t206), Megumi Kudo (FMW womens anchor; retirement Apr 29, 1997 = t111).

### 5.2 Wrong company — `cwvwwf_wrong_company_v3.json` (12 entries)

| ID | Current | Recommended | Conf. |
|---|---|---|---|
| `sid` | WWF starting roster, age 34, contract 100, pop 62 | Move to USWA (he was the reigning USWA Unified World Heavyweight Champion); add a WWF signing ~turn… | High |
| `goldust` | WWF starting roster as Goldust, age 26, contract 120 + noRe… | Replace the starter with Dustin Rhodes (WCW babyface, age 29, short contract ~15 turns + noRenew - … | High |
| `eddy-guerrero` | ECW starting roster, age 27, contract 36, pop 42 | Remove from the ECW starting roster; make him a free agent (NJPW Black Tiger II / AAA affiliate) at… | High |
| `barry-windham` | WCW starting roster, age 34, contract 40, pop 62 | Remove from the starting roster (retired in 1994); optionally add a WWF arrival ~turn 72 (The Stalk… | High |
| `jim-neidhart` | NWA starting roster, age 39, contract 40, pop 50 | Remove from the NWA starting roster; optionally add an ECW arrival ~turn 12-15 (Neidhart resurfaced… | High |
| `bobby-eaton` | SMW starting roster, age 36, contract 40 + noRenew, pop 54 | Move to WCW: Eaton remained under WCW contract through 1995-1999 and formed The Blue Bloods with Lo… | High |
| `bobby-blaze` | NWA starting roster, age 24, contract 60, pop 34 | Move to SMW: Bobby Blaze was a Smoky Mountain Wrestling regular (he held the SMW Beat the Champ TV … | High |
| `dynamite-kansai` | AJW starting roster, age 27, contract 100, pop 58 | JWP placement historically, BUT note: JWP is not one of the game's 16 companies (COMPANY_DEFS: WCW,… | High |
| `mayumi-ozaki` | AJW starting roster, age 23, contract 100, pop 48 | JWP placement historically, BUT note: JWP is not one of the game's 16 companies (COMPANY_DEFS: WCW,… | High |
| `phineas-godwinn` | WWF starting roster as Phineas Godwinn, age 34, contract 80… | Remove from the starting roster: Dennis Knight was in WCW as Tex Slazenger (with Shanghai Pierce) i… | High |
| `missy-hyatt` | WCW manager on the starting roster | Remove from the WCW start (she left WCW in February 1994); optionally add an ECW manager arrival ~t… | High |
| `ajw-kansai-ozaki` | company: AJW | company: JWP (both were JWP wrestlers in 1995 - they were defending the JWP tag titles on Jan 8, 19… | Medium |

### 5.3 Future-arrival corrections — `cwvwwf_future_arrival_corrections_v3.json` (28 entries: 23 wrestler arrivals + 5 announcer arrivals)

| ID | Game turn (date) | Real arrival | Verdict |
|---|---|---|---|
| `ahmed-johnson` | 52 (Feb 1–7, 1996) | WWF debut early 1996 (verified in v1 research) | Correct |
| `road-warrior-hawk` | 52 (Feb 1–7, 1996) | Hawk returned to WCW in May 1995 for a singles run (~turn 16-19; Warrior angle build); th… | Wrong availability date |
| `road-warrior-animal` | 52 (Feb 1–7, 1996) | Animal was out injured; the Road Warriors reunited in WCW for SuperBrawl VI, Feb 11, 1996… | Correct within tolerance |
| `scott-steiner` | 60 (Apr 1–7, 1996) | The Steiners were NJPW-based through 1995 (IWGP tag challenge Jan 4, 1995) and returned t… | Wrong availability date |
| `rick-steiner` | 60 (Apr 1–7, 1996) | See Scott Steiner | Wrong availability date |
| `chris-jericho` | 72 (Jul 1–7, 1996) | ECW debut early 1996 (~turn 52), WCW debut Aug 20, 1996 (~turn 78) | Wrong availability date |
| `rob-van-dam` | 72 (Jul 1–7, 1996) | ECW debut Jan 5, 1996 (~turn 48) | Wrong availability date |
| `the-rock` | 88 (Nov 1–7, 1996) | WWF debut at Survivor Series, Nov 17, 1996 (~turn 90; the game's turn 88 is the same mont… | Correct |
| `ken-shamrock` | 116 (Jun 1–7, 1997) | WWF debut Feb 1997 (special referee at In Your House 13, Feb 16, 1997 = turn 102; in-ring… | Wrong availability date |
| `val-venis` | 132 (Oct 1–7, 1997) | WWF debut May 1998 (~turn 163) | Wrong availability date |
| `kane` | 140 (Dec 1–7, 1997) | Badd Blood debut Oct 5, 1997 (~turn 132) | Wrong availability date |
| `bill-goldberg` | 160 (May 1–7, 1998) | TV debut Sept 22, 1997 (~turn 131) | Wrong availability date |
| `scotty-riggs` | 16 (May 1–7, 1995) | Riggs was still in SMW; his WCW debut with the American Males came Aug-Sept 1995 (~turn 3… | Wrong availability date |
| `isaac-yankem` | 24 (Jul 1–7, 1995) | Yankem debuted on WWF TV June-Aug 1995 (first TV ~June 26, 1995 = turn 23; the game's tur… | Correct |
| `bertha-faye` | 32 (Sep 1–7, 1995) | Bertha debuted with the WWF mid-1995 and beat Blayze for the Women's title Aug 27, 1995 (… | Correct |
| `dean-douglas` | 40 (Nov 1–7, 1995) | Shane Douglas left ECW for the WWF in July 1995 (vignettes from July 29, 1995 = turn 27);… | Wrong availability date |
| `the-giant` | 40 (Nov 1–7, 1995) | Paul Wight's first appearance was Sept 18, 1995 (~turn 33), in-ring debut at Halloween Ha… | Correct within tolerance |
| `dances-with-dudley` | 40 (Nov 1–7, 1995) | The Dudley family act debuted July 1, 1995 (Hardcore Heaven) = turn 24 | Wrong availability date |
| `sable` | 84 (Oct 1–7, 1996) | Sable debuted at WrestleMania XII, Mar 31, 1996 (~turn 59) | Wrong availability date |
| `jacqueline` | 96 (Jan 1–7, 1997) | WWF debut June 1998 (~turn 164) | Wrong availability date |
| `chyna` | 100 (Feb 1–7, 1997) | Chyna debuted as Triple H's bodyguard in early 1997 (Feb 1997 per most sources; some date… | Correct within tolerance |
| `lita` | 200 (Mar 1–7, 1999) | WWF debut Feb 8, 2000 (~turn 245); before that she was in ECW in 1999 as Miss Congenialit… | Wrong availability date |
| `trish-stratus` | 260 (Jun 1–7, 2000) | WWF TV debut Mar 19, 2000 (~turn 254); the game's June 2000 is ~3 months late (minor) | Minor - Wrong availability date |
| `mike-tenay` *(announcer)* | 48 (Jan 1–7, 1996) | Tenay called When Worlds Collide for WCW on Nov 6, 1994 and was on Nitro from Sept 2, 199… | Wrong availability date |
| `kevin-kelly` *(announcer)* | 96 (Jan 1–7, 1997) | Kevin Kelly was on WWF TV from ~1995-96 (Action Zone/Superstars); exact booth-start date … | Needs manual review |
| `larry-zbyszko` *(announcer)* | 140 (Dec 1–7, 1997) | Zbyszko joined Nitro commentary May 27, 1996 (turn 67), not Dec 1997 | Wrong availability date |
| `michael-cole` *(announcer)* | 200 (Mar 1–7, 1999) | Cole joined the WWF in 1997, first on-screen June 30, 1997 (~turn 119), not Mar 1999 | Wrong availability date |
| `tazz` *(announcer)* | 260 (Jun 1–7, 2000) | Tazz signed Jan 2000 (Royal Rumble debut as the reigning ECW champion, Jan 23, 2000 = tur… | Wrong availability date |

### 5.4 Stat corrections — `cwvwwf_stat_corrections_v3.json` (79 entries: ages, contracts, alignment, pop/work/mic/ceiling)

| ID | Stat | Current → Recommended | Conf. |
|---|---|---|---|
| `shane-douglas` |  | ECW starter, age 30, contract 80 (no noRenew flag) → Keep as ECW World Champion starter (age 30 is correct: born Nov 21, 1964);… | High |
| `phineas-godwinn` |  | WWF starting roster as Phineas Godwinn, age 34, contra… → Remove from the starting roster: Dennis Knight was in WCW as Tex Slazenger… | High |
| `waylon-mercy` |  | WWF starting roster (age 37, contract 30, pop 38) → Convert to a WWF FA arrival ~turn 24 (Spivey rejoined the WWF in June 1995… | High |
| `vader` |  | Contract 150 turns (~end 1997), no noRenew flag → Contract ~35 turns + noRenew (Vader was fired by WCW in August/September 1… | High |
| `jeff-jarrett` |  | Contract 90 turns + noRenew (~Sept 1996) → Contract ~27 turns (Jarrett left the WWF in July 1995 for the USWA); flag … | High |
| `bam-bam-bigelow` |  | Contract 40 turns + noRenew (~October 1995) → Contract ~43 turns + noRenew (last WWF match: Survivor Series, Nov 19, 199… | High |
| `british-bulldog` |  | Contract 120 turns (~July 1997) → Contract ~143 turns (Bulldog jumped to WCW in November/December 1997 along… | High |
| `steve-austin` |  | Contract 20 turns + noRenew (~June 1995) → Contract ~35 turns + noRenew (Austin was fired by WCW in September 1995; E… | High |
| `brian-pillman` |  | Contract 56 turns + noRenew (~May 1996) → Contract ~53 turns (Pillman's WCW run ended Feb 11, 1996 - the worked firi… | Medium |
| `chris-benoit` |  | Contract 28 turns (~July 1995) → Contract ~32-36 turns (Benoit, Guerrero and Malenko left ECW for WCW toget… | High |
| `dean-malenko` |  | ECW starter, contract 32 turns (~Sept 1995) → Correct: Malenko left ECW for WCW in September 1995 with Benoit and Guerre… | High |
| `lex-luger` |  | Contract 32 turns + noRenew (~September 1995) → Correct: Luger's WWF deal lapsed in 1995 and he appeared on the very first… | High |
| `diesel` |  | Contract 64 turns + noRenew (~May 1996) → Correct: Nash's last WWF match was April 1996 and he debuted in WCW on the… | High |
| `razor-ramon` |  | Contract 64 turns + noRenew (~May 1996) → Correct: Hall's last WWF match was April 1996 and he walked onto Nitro on … | High |
| `bret-hart` |  | Contract 144 turns + noRenew (~Jan 1998) → Correct: Bret left the WWF after Survivor Series 1997 (Nov 9, 1997) and de… | High |
| `one-two-three-kid` |  | Contract 72 turns + noRenew (~July 1996) → Correct within tolerance: the Kid's WWF run ended in 1996 and he appeared … | Medium |
| `cactus-jack` |  | Contract 60 turns + noRenew (~Jan 1996) → Correct within tolerance: Foley's ECW farewell came in early 1996 (the Man… | Medium |
| `alundra-blayze` |  | Contract 49 turns + noRenew (~Feb 1996) → Correct: Blayze left the WWF in late 1995 and threw the WWF Women's title … | High |
| `hulk-hogan` |  | heel, pop 97, age 41, contract 240 → face at the January 1995 start (red-and-yellow top babyface); heel turn at… | High |
| `booker-t` |  | face (Harlem Heat), age 29, contract 180 → heel: Harlem Heat worked heel through 1995-96 (managed by Sister Sherri fr… | High |
| `mabel` |  | heel, age 27, contract 80, pop 40 → face at the start: Men on a Mission were babyfaces through early 1995 (Mab… | Medium |
| `mo` |  | heel, age 30, contract 40, pop 33 → face at the start (Men on a Mission were babyfaces until mid-1995) | High |
| `johnny-b-badd` |  | 31 → 34 (Marc Mero, b. July 9, 1960) | High |
| `meng` |  | 31 → 35 (Tonga Uliuli Fifita, b. February 1959) | High |
| `avalanche` |  | 37 → 31 (John Tenta, b. June 22, 1963) | High |
| `big-bubba-rogers` |  | Big Bubba Rogers, heel, age 34 → In January 1995 Ray Traylor was working as THE BOSS (WCW's guardian-of-the… | Medium |
| `marty-jannetty` |  | 35 → 34 (b. February 3, 1960 - turns 35 within the first month of game time) | Medium |
| `rocco-rock` |  | 32 → 41 (b. September 3, 1953) | High |
| `fatu` |  | 24 → 29 (b. October 11, 1965) | High |
| `hakushi` |  | 29 → 28 (b. December 2, 1966) | High |
| `adam-bomb` |  | 31 → 30 (b. March 3, 1964) | High |
| `rey-mysterio` |  | 21 → 20 (b. December 11, 1974) | High |
| `nakanishi` |  | 26 → 27 (b. October 3, 1967) | High |
| `duke-droese` |  | WWF starter, age 29 → Keep as a WWF starter (correct: Droese joined the WWF roster in 1994) but … | High |
| `chris-candido` |  | 23 → 24 (b. March 21, 1970) - and he is the reigning NWA World Heavyweight Cham… | High |
| `stevie-ray` |  | 36 → ~31-32 (Lane Huffman, b. 1963 per most sources) - verify DOB before changi… | Low |
| `hack-meyers` |  | 34 → ~21 (b. June 30, 1973) - verify DOB before changing | Low |
| `johnny-grunge` |  | 31 → ~29 (b. 1965/66) - verify DOB before changing | Low |
| `owen-hart` |  | 82 → 86-88 | Medium |
| `taz` |  | 78 → 82-84 | Medium |
| `psicosis` |  | 66 → 72-76 | Medium |
| `juventud` |  | 66 → 72-76 | Medium |
| `bam-bam-bigelow` |  | 60 → 66-70 | Medium |
| `bull-nakano` |  | 66 → 72-76 | Medium |
| `alundra-blayze` |  | 58 → 68-72 | Medium |
| `jim-duggan` |  | 65 → 55-60 | Medium |
| `lita` |  | 24 at turn 200 (Mar 1999) → 21 at turn 200 (b. April 14, 1975 - she was 23 when she debuted in ECW in … | High |
| `bertha-faye` |  | 27 at turn 32 (Aug 1995) → ~34 at turn 32 (Rhonda Singh b. February 21, 1961; she died in July 2001 a… | Medium |
| `sable` |  | 29 at turn 84 → 28 (Rena Mero b. August 8, 1967) | Medium |
| `rick-steiner` |  | 34 at turn 60 → 35 (b. March 9, 1961) | Medium |
| `chyna` |  | 27 at turn 100 → 26 (Joanie Laurer b. December 27, 1969; 27 only from late December 1997) | Medium |
| `trish-stratus` |  | 24 at turn 260 → 23 (Patricia Stratigeas b. December 18, 1975; 24 only from mid-December 20… | Medium |
| `jimmy-snuka` |  | 52 → 51 (b. May 18, 1943) | Medium |
| `hulk-hogan` |  | 42 → No change - defensible | Medium |
| `the-rock` |  | 80 at debut (turn 88) → No change - defensible | Medium |
| `rey-mysterio` |  | 35 → No change - defensible (optionally 40-45 if the game models Mexican popula… | Medium |
| `road-warrior-hawk` |  | turn 52 (Feb 1996), tagged as "one half of the legenda… → Hawk returns to WCW ~turn 17-19 (May 1995) as a singles wrestler (helped S… | High |
| `road-warrior-animal` |  | turn 52 (Feb 1996), interest WCW → Keep as-is (correct); optionally model his 1995 back-injury layoff | High |
| `scott-steiner` |  | turn 60 (Apr 1996), note "returning from a run in the … → turn ~52-53 (SuperBrawl VI, Feb 11, 1996); note should read "from New Japa… | High |
| `rick-steiner` |  | turn 60 (Apr 1996), interest WCW → turn ~52-53 (Feb 1996); see scott-steiner finding | High |
| `chris-jericho` |  | turn 72 (July 1996), interest ANY → ECW arrival ~turn 52 (ECW debut early 1996); WCW signing ~turn 78 (WCW deb… | High |
| `rob-van-dam` |  | turn 72 (July 1996), interest ANY → ECW arrival ~turn 48 (debut at House Party, Jan 5, 1996, defeating Axl Rot… | High |
| `the-rock` |  | turn 88 (Nov 1996 W1), interest WWF → Keep as-is (correct): Survivor Series Nov 17, 1996 debut | High |
| `ken-shamrock` |  | turn 116 (June 1997), interest WWF → turn ~101-107 (Feb-Mar 1997): first WWF appearances around In Your House 1… | Medium |
| `val-venis` |  | turn 132 (Oct 1997), interest WWF → turn ~163 (May 1998): Val Venis debuted in the WWF in mid-1998 | High |
| `kane` |  | turn 140 (Dec 1997), interest WWF → turn ~132 (Oct 1997): Kane debuted at Badd Blood, Oct 5, 1997 | High |
| `bill-goldberg` |  | turn 160 (May 1998), interest WCW, note "training at t… → turn ~131 (Sept 1997): TV debut on Nitro Sept 22, 1997 (dark matches from … | High |
| `scotty-riggs` |  | turn 16 (May 1995), interest ANY → Verify: Riggs' WCW signing date is unconfirmed; the American Males team fo… | Low |
| `isaac-yankem` |  | turn 24 (July 1995), interest WWF → Keep as-is (acceptable): Yankem debuted on WWF TV in August 1995 (Lawler's… | High |
| `bertha-faye` |  | turn 32 (Sept 1995 W1), interest WWF → Keep as-is (correct): Bertha Faye debuted around SummerSlam 95 (Aug 27, 19… | High |
| `dean-douglas` |  | turn 40 (Nov 1995), interest WWF, separate wrestler (a… → Remove as a separate person (duplicate of shane-douglas): script Shane Dou… | High |
| `the-giant` |  | turn 40 (Nov 1995 W1), interest WCW, note "arrives at … → Keep as-is (acceptable); first appearance was actually earlier: Sept 18, 1… | High |
| `dances-with-dudley` |  | turn 40 (Nov 1995), interest ECW → turn ~24 (July 1995): the Dudley family debuted in ECW on July 1, 1995 | High |
| `sable` |  | turn 84 (Oct 1996), interest WWF → turn ~59 (March 1996): Sable debuted at WrestleMania XII (Mar 31, 1996) | High |
| `jacqueline` |  | turn 96 (Jan 1997), interest ANY → turn ~164 (June 1998): Jacqueline debuted in the WWF in mid-1998; in Jan 1… | High |
| `chyna` |  | turn 100 (Feb 1997 W1), interest WWF → Keep as-is (correct): Chyna debuted in early 1997 as Triple H's bodyguard | High |
| `lita` |  | turn 200 (Mar 1999), interest ANY → turn ~210 for ECW (Miss Congeniality, mid-1999) or turn ~245 for the WWF (… | High |
| `trish-stratus` |  | turn 260 (June 2000 W1), interest WWF → turn ~254 (March 2000): Trish debuted on WWF TV on March 19, 2000 | High |
| `ahmed-johnson` |  | turn 52 (Feb 1996), interest WWF → Keep as-is (acceptable): Johnson was in the WWF by late 1995/early 1996 (h… | Medium |

### 5.5 Free-agent corrections — `cwvwwf_free_agent_corrections_v3.json` (32 entries)

Roster composition at January 1995: **12 removals** (duplicates + retired/departed workers: awesome, shark, kurasawa, barbarian, rad-radford, spicolli, savio, windham, neidhart, phineas, brandi, missy-hyatt), **9 conversions to later arrivals** (disco t34, pittman t32, mr-jl t34, renegade t10, waylon-mercy t24, m-m-rock t4, blu brothers t8–10, lafitte t13), **Eddy Guerrero a free agent at start** (NJPW/AAA; ECW arrival t13), plus the duplicate-identity pairs and the real-FA-pool gap: in January 1995 the actual open market held the **Hardy Boyz, Al Snow, Unabomb (Kane), the Gangstas and Louie Spicolli** — none of whom exist in the game. The same file carries the eight free-agent-model engine corrections (FA-ENG-1 … FA-ENG-8) with fixes.

### 5.6 Generated-talent recommendations — `cwvwwf_generated_talent_recommendations_v3.json` (7 entries)

Summarised in section 3 above. Verdicts: gender **reasonable**, international **fair share, fix the per-fed flavour roll**, stat ranges **sound** (with two optional tunings), hidden gems **keep 4%**, ages **acceptable** (optionally to 45), name duplication **low risk now, add a registry**, entry rate **15/yr fine once FA-ENG-1/2 are fixed**.

---

## 6. Verification log

- Fresh `newGame`: 408 wrestlers (311 + 60 + 37) — matches the stated model. `indyPool=0`: 348 wrestlers.
- January classes fire 1996–2000 in-sim (+15 indies, +37 jobbers each); 2001 follows the identical code path.
- 5.5-year simulation: 0 generated-indy signings by any company; AI signed only `faUntil`-window workers.
- Generated-indy stats measured across 679 workers from 7 seeds: 15% female, ~3–4% gems, 23.7% start with work > ceiling (verified **not** a bug — `ceiling` clamps popularity only; work grows independently to 92).
- `node test/sim.js`: **ALL SANITY CHECKS PASSED** (world-size and determinism thresholds updated for the new model; note the loosened insufficient-card validation — FA-ENG-11).
- Historical data: `git diff 12d9fcd..1754a04 -- js/data.js js/timeline.js` → empty; all v1/v2 findings carry over.

---

## Appendix — file manifest

| File | Contents |
|---|---|
| `cwvwwf_data_audit_v3.json` | Complete audit: meta, model verification, engine findings, generated-pool review, all 265 carried-over findings, the six lists, verified-correct wrestlers |
| `cwvwwf_data_audit_v3.md` | This report |
| `cwvwwf_missing_workers_v3.json` | 47 missing workers (28 tiered + 19 previously flagged) with availability, stats, sources |
| `cwvwwf_wrong_company_v3.json` | 12 wrong-company placements with correct-company recommendations |
| `cwvwwf_future_arrival_corrections_v3.json` | 23 wrestler + 5 announcer arrival corrections with turn↔date conversions |
| `cwvwwf_stat_corrections_v3.json` | 79 stat corrections (age/contract/align/pop/work/mic/ceiling) |
| `cwvwwf_free_agent_corrections_v3.json` | 32 free-agent & roster-composition corrections incl. the engine model fixes |
| `cwvwwf_generated_talent_recommendations_v3.json` | 7 generated-pool assumption reviews with verdicts |

*Predecessors: `cwvwwf_data_audit.json` / `.md` (v2) hold the complete rendered research audit with full source URLs for every historical claim; `cwvwwf_patch_recommendations.json` holds the structured patch operations. All remain accurate for this revision.*

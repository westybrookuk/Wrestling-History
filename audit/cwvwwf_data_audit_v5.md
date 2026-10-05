# CW/WWF Wrestling History — Data Audit v5 (Delta: Generated Independents Made Recruitable)

**Revision:** `c2fd37f` on branch `arena/01a042dd-wcw-vs-wwf` · **Prior audited:** `de2dc15` · **Date:** 2026-08-30

**New commits audited:** `2db032f` *Make generated independents recruitable* (+28/−8 across engine/ui/titles/2 tests) and `c2fd37f` *export endReign from titles.js* (1 line).

## Scope

Delta audit only: the two commits between de2dc15 and c2fd37f. js/data.js and js/timeline.js are byte-identical to 12d9fcd (verified 0-diff), so every historical-roster finding, the 265-finding correction list, the six v3 lists and the generator (GEN-*) verdicts carry over unchanged from audit/cwvwwf_data_audit_v3.* and audit/cwvwwf_data_audit_v4.*.

## Verdict at a glance

- **Carried findings re-checked:** 10 → **2 FIXED** (FA-ENG-2, FA-ENG-5), **8 still open**
- **New findings:** 8 (major: NEW-1, NEW-2)
- **User verification checklist:** 9/9 items answered: 6 PASS, 1 PASS-with-bias, 1 PASS-with-gap, 1 PARTIAL
- **Model:** unchanged and re-verified: 408 = 311+60+37 at t0; 150 indies by t300; 37 jobbers; 6 classes; determinism preserved; both test suites pass

---

## 1. Fixed since de2dc15 — verified empirically

### FA-ENG-2 — Generated independents were unsignable by anyone

**Status:** OPEN → **FIXED (2db032f) — verified empirically**

2db032f rewires the whole path: (a) AI allFAs filter now admits fresh indies ((w.isIndy && w.faUntil === null) || window) at js/engine.js L3997-3999; (b) new isIndy cold-sign threshold (hard 32 / otherwise 38) at L4009; (c) the FREE AGENTS row for a fresh generated indie now offers SIGN ${asking}K/mo / PPA ${max(10, asking*0.6)}K/show / REMOVE (js/ui.js L741-743) instead of REMOVE FROM WORLD only.

- Player: signFreeAgent(written) → contract 180 (130+rint0-60), wage = max(asking, wage*1.2) = 12, faUntil/asking cleared, on roster, NOT in FA list; PPA → contract 97 (60+rint0-40), wage = max(10, round(wage*0.6)) = 10; OPEN re-sign of own release → contractType 'open', wage = round(wage*0.9).
- Signed indy main-events a valid card (validateCard passes with the indy in a singles match).
- AI: 11 of the 60 opening indies cold-signed by WCW in week 1 (seed 1234); by t300, 20-23 of 150 signed on normal, 35 on hard.
- test/ai-stress.js now asserts an AI indy signing plus the full player lifecycle (bid → sign → release → delete) and PASSES at c2fd37f.
- *Caveats:* The fix works mechanically but is unevenly distributed — see NEW-1 (recruitment bias), NEW-3 (bidding-war reachability) and NEW-5 (button-set inconsistency).

### FA-ENG-5 — deleteGeneratedWrestler left a stale state.bids entry

**Status:** OPEN → **FIXED (2db032f) — verified empirically**

deleteGeneratedWrestler (js/engine.js L341-348) now executes `delete state.bids[id]` before splicing the wrestler out.

- placeBid() on a fresh indy, then deleteGeneratedWrestler() → wrestler gone AND state.bids[id] === undefined.
- exportSave → importSave round-trip: the deletion persists (wrestler still gone, bid entry still gone, signed indies and the rest of the pool intact).
- Deleting a SIGNED indy is still correctly refused ('only unsigned generated independents can be removed').

## 2. Carried findings still open at c2fd37f

| ID | Status | Re-check at c2fd37f |
|---|---|---|
| FA-ENG-3 | **Still open** | indyPool=0 ('historical names only') still only zeroes the opening pool (js/engine.js L253); the January class hook (L3361) never reads state.game.indyPool, so 15 generated indies still arrive every January 1996-2001. |
| FA-ENG-6 | **Still open** | Double January intake unchanged: 15-indy class (L3361) + 4-6 training-class rookies (L3376) every January 1996-2001. Rookies remain a separate non-isIndy population (ids 'rookie-*', faUntil 10-20w, 80% end up in ECW or retire). |
| FA-ENG-7 | **Still open (design note)** | Classes still capped at 2001 (d.year <= 2001, L3361); 2002-2007 tail is rookies-only. Confirmed again in all four t300 spectate runs (indyClassYear = [1996..2001] exactly). |
| FA-ENG-8 | **Still open** | The '1,400+ unsigned independents' comment (js/ui.js L713-714) and the residual-summary line (L772) are verbatim. Sharpened by this revision: since every isIndy row is now in the table, the hidden residual the line counts is non-generated low-pop FAs — see NEW-6. |
| FA-ENG-9 | **Still open** | employmentStatus ('independent' | 'local-jobber') is still write-only — zero read sites in js/ at c2fd37f. |
| FA-ENG-10 | **Still open** | Name de-duplication still per-call (usedNames Set inside generateWorldTalent); training-class generator still has none. v3 rate (≈2 duplicate names in ~305 generated workers by 1999) still the expectation. |
| FA-ENG-11 | **Still open** | test/sim.js still filters 'Need at least N matches' validateCard errors at 3 sites. Full suite passes at c2fd37f ('ALL SANITY CHECKS PASSED'). |
| FA4-1 | **Still open** | generateWorldTalent header comment still describes '2,500-4,000 active workers worldwide … a large unsigned independent pool' (js/engine.js L258-261). Same cleanup class as FA-ENG-8. |

*(FA-ENG-4 was already moot at v4; FA-ENG-1 was already fixed at de2dc15. Historical data findings — the 265-finding list, six correction lists, GEN-\* generator verdicts — are untouched by this revision since `js/data.js` / `js/timeline.js` are byte-identical to 12d9fcd and the generator code is unchanged; they carry over from v4 unchanged.)*

---

## 3. New findings (introduced or newly exposed by making generated workers recruitable)

### NEW-1 · Major (balance / realism) · AI recruitment bias — structural

- **Current value:** AI cold-sign score = pop*0.5 + work*0.25 + mic*0.25 (+30 WWF / +15 WCW for women, +12 interest, +10 WCW young workhorse, +8 WWF mic) against an isIndy threshold of 38 on normal/easy and 32 on hard (js/engine.js L4003-4009). An ordinary male indie tops out at 21*0.5+57*0.25+45*0.25 = 36.0 — below 38 even at maximum stats — while an average female indie scores ≈24.75+15/30 ≈ 40-55. Result: the AI recruits essentially every woman and every hidden gem and no ordinary man.
- **Recommended value:** Lower the isIndy cold threshold to ≈24-28 on normal (or score generated workers on ceiling/potential rather than current stats), and make the gender bonus conditional on a women's-division need. Also give easy difficulty its own indy threshold (easy currently inherits 38 while historical FAs get 64).
- **Explanation:** Measured at c2fd37f: week 1, WCW signed 11 of 60 opening indies = 8 of 14 women + 3 gems + 0 ordinary men (seed 1234). Through t300 on normal across 3 seeds: 23/20/20 of 150 signed, of which ordinary men = 0 in all three runs (women 20/19/16, gems 9/3/6). On hard: 35/150 including 6 ordinary men. WCW dominates (Bischoff aggression 0.85, moneyFloor 0.6) — WWF signed 0-4. Compounding the optics, women get male names (NEW-8), so the rival roster visibly fills with male-named women within weeks of game start.
- **Confidence:** High · **Source:** Code js/engine.js L3993-4016; instrumented cold-sign week + 4 spectate sims at c2fd37f (this audit)

### NEW-2 · Major (rules asymmetry) · AI bypasses no-compete clauses

- **Current value:** The AI cold-sign path calls ctx.sign() directly without canSign() (js/engine.js L4010-4015); only the hot bidding path checks canSign (L4017-4019). canSign() enforces the 16-week no-compete that releaseWrestler() attaches to written releases (L843-851) — for the player only.
- **Recommended value:** Add a canSign(state, w, comp).ok check to the cold-sign branch, same as the hot branch.
- **Explanation:** Reproduced at c2fd37f: WWF player released a written-contract indy (no-compete until t16, FA window t12); WCW instant-signed her at t3 — 13 weeks inside the clause — while the player attempting the same move gets 'No-compete clause: … 16 more weeks.' The engine gap predates this revision, but 2db032f newly exposes every released generated worker to it.
- **Confidence:** High · **Source:** Code js/engine.js L3993-4019 vs L843-851; empirical steal at t3 of a 16-week clause (this audit)

### NEW-3 · Medium (reachability) · Bidding wars unreachable for fresh generated indies

- **Current value:** A fresh indie (pop 5-21, faUntil null) is never 'hot' (pop >= 55), so the UI offers no BID button (js/ui.js L739-743) and the AI never opens bids on non-hot FAs; wars on generated workers are reachable only after sign → push to pop ≥ 55 → release. A PPA release (no no-compete, 6-week window) works end-to-end; a written release does not in practice (12-week window < 16-week no-compete, so at expiry only the releasing company can win — L3404-3410 + L843-851).
- **Recommended value:** Acceptable as design (indies are cold-market talent) — document it. If wars on fresh indies are wanted, give first-bid indies an faUntil window (placeBid currently accepts faUntil === null, see NEW-4).
- **Explanation:** Verified both ways: player bid on a fresh indy sits unresolved forever (no expiry); forced war on a released pushed indy worked perfectly — 'WCW RAISES its offer … $110K/month' (t5-t7), 'WCW SIGNS Todd Parrish for $110K/month after a bidding war', beating the player's $85K. Answer to the checklist item 'can enter bidding wars': yes, but only via the release path.
- **Confidence:** High · **Source:** Code js/ui.js L730-743, js/engine.js L3993-4040, L3404-3410; empirical bidding war at c2fd37f (this audit)

### NEW-4 · Low (API edge case) · Programmatic bid on a fresh indy never resolves or expires

- **Current value:** placeBid() (js/engine.js L775-792) has no faUntil guard — unlike placeBlindBid() which rejects faUntil === null (L5538) — and the weekly expiry loop (L3406) only processes faUntil !== null workers, so a bid placed on a fresh indy sits in state.bids forever. ctx.sign() (AI cold-sign) also does not clear state.bids, so an AI signing can leave a dangling entry.
- **Recommended value:** Reject faUntil === null in placeBid() (mirror placeBlindBid), or open a window when first bid upon; add `delete state.bids[id]` to ctx.sign().
- **Explanation:** No UI path can create this state (fresh indies have no BID button), so impact is API/save-import only. REMOVE now cleans the entry if the worker is deleted (FA-ENG-5 fix).
- **Confidence:** High · **Source:** Code js/engine.js L775-792, L3406, L3483-3494, L5536-5539 (this audit)

### NEW-5 · Medium (UI consistency) · Inconsistent action buttons for fresh vs released generated indies

- **Current value:** Fresh indy row: SIGN / PPA / REMOVE — no OPEN (moonlight deals) (js/ui.js L741-743). Released non-hot indy in the 'YOUR EXPIRING CONTRACTS' section: SIGN / OPEN / PPA — no REMOVE (the isIndy branch requires tag !== 'ex', L740). So a generated worker can only get a moonlight deal after being signed and released once, and can never be removed from the world after a release — even though deleteGeneratedWrestler() would allow it (company === null).
- **Recommended value:** Add OPEN to the fresh-indy row (signFreeAgent handles 'open' on any free agent) and/or REMOVE for released indies.
- **Explanation:** Engine side all three deal types work on indies (verified: OPEN re-sign gave contractType 'open', wage = round(wage*0.9)). This is purely an inconsistency of which buttons are offered where.
- **Confidence:** High · **Source:** Code js/ui.js L739-750; empirical OPEN re-sign at c2fd37f (this audit)

### NEW-6 · Low (cosmetic) · Residual-market summary line now mislabels its contents

- **Current value:** '…and N more unsigned independents on the open market (pop under 20) — signable for a song, waiting for their shot' (js/ui.js L772). Since every isIndy worker is now rendered in the table, N counts only NON-generated low-pop free agents (e.g. released enhancement-tier workers), which the line still calls 'unsigned independents'.
- **Recommended value:** Re-word to '…and N more unsigned workers on the open market (pop under 20)'.
- **Explanation:** Direct consequence of flipping indies into the notable set / adding them to the table; the hidden remainder changed meaning but the label did not.
- **Confidence:** High · **Source:** Code js/ui.js L716-719, L772 (this audit)

### NEW-7 · Info (fixed latent crash + broken intermediate commit) · endReign ReferenceError — pre-existing, fixed by c2fd37f

- **Current value:** The 24/7 hardcore title-change branch (js/engine.js L3433) has called endReign() since long before this branch, but titles.js never exported it — a latent ReferenceError with a 12% chance per week per hardcore title holder. 2db032f added the import; c2fd37f added the export that makes it resolve. Note 2db032f STANDALONE IS BROKEN: it imports a name titles.js does not yet export, so the whole app fails to load at that commit — only c2fd37f runs.
- **Recommended value:** Nothing to change at head; keep the pair squashed or note it for bisect hygiene.
- **Explanation:** Reproduced at de2dc15 with a forced hardcore champion: runWeek throws 'endReign is not defined' within 60 weeks. Same test at c2fd37f runs clean. The dormant ecw-hardcore title activates via timeline, so real games could hit this.
- **Confidence:** High · **Source:** Empirical forced-24/7 runs at de2dc15 (reproduced) and c2fd37f (clean); git worktrees (this audit)

### NEW-8 · Low-Medium (pre-existing, newly prominent) · Female generated workers get male names

- **Current value:** makeWorker() picks the name via makeName() BEFORE rolling gender (js/engine.js L290-301), and the shared first-name pool (ROOKIE_FIRST_NAMES, 158 entries) is effectively all male — 'Quinn' is the only ambiguous entry. Every female generated indie therefore carries a male name (observed: 'Johnny Simpson [f]', 'Osamu Yamada [f]', 'Felipe Rodriguez [f]').
- **Recommended value:** Roll gender first and draw from gendered name pools (or tag the pools), at least for the 13% female share.
- **Explanation:** Pre-existing generator quirk — but newly prominent because the AI now signs nearly every female indie within weeks of game start (NEW-1), so rival rosters visibly fill with male-named women.
- **Confidence:** High · **Source:** Code js/engine.js L272-301 + js/data.js ROOKIE_FIRST_NAMES; instrumented t1 signings (this audit)

---

## 4. Verification checklist (as requested)

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | Generated workers signable by the player | **PASS** | SIGN/PPA buttons on every fresh indy row; signFreeAgent written (contract 130-190w), PPA (60-100w), OPEN (re-sign path) all verified; signed indy passes validateCard in a match. |
| 2 | Considered by the AI | **PASS with bias (NEW-1)** | 11/60 signed in week 1; 20-23/150 by t300 on normal, 35 on hard; but ordinary male indies are mathematically excluded (score ceiling 36 < threshold 38) and WWF barely participates. |
| 3 | Can enter bidding wars | **PARTIAL (NEW-3)** | Fresh indies: no. Released-and-pushed (pop ≥ 55) indies: yes — full war verified end-to-end (WCW raised to $110K/mo and beat the player's $85K). PPA releases work; written releases are no-compete-locked in practice. |
| 4 | Written / PPA / OPEN deals behave correctly | **PASS (NEW-5 button gap)** | Contract lengths, wage math (max(asking, wage*1.2); PPA ×0.6 floor 10; OPEN ×0.9), morale/loyalty deltas, faUntil/asking cleared on sign — all exact. OPEN is only offered on the released-indy row, not the fresh one. |
| 5 | Released generated workers return to free agency correctly | **PASS (standard FA pipeline)** | releaseWrestler: company null, exCompany set, faUntil +12 (written) / +6 (PPA), asking recomputed, no-compete +16 (written). Re-appears in the FA tab ('YOUR GUY'); player can re-sign own release immediately. At window expiry follows the normal pipeline (80% ECW if age ≤ 42, else retires) — same rules as historical FAs, e.g. observed RETIRED at t20. Caveat: NEW-2 (rival AI can steal mid-no-compete). |
| 6 | Deleted generated workers permanently removed | **PASS** | Spliced from state.wrestlers; deletion survives exportSave→importSave round-trip; deleting a signed indy is refused. |
| 7 | Deleting clears outstanding bids | **PASS** | delete state.bids[id] added (FA-ENG-5 fixed); verified with an open player bid before deletion, plus round-trip. |
| 8 | No local-jobber duplication | **PASS** | 37 jobbers constant across all four t300 runs; jobbers seeded once at world generation (employmentStatus 'local-jobber'); January classes add graduates only (byCo counts stay 150 total indies). |
| 9 | 60 at start / 15 per year / 90 entering still correct | **PASS** | Fresh game 408 = 311 scripted + 60 indies + 37 jobbers; indyClassYear [1996..2001] in all runs; exactly 150 generated indies by t300 (126-129 still unsigned + 16-35 signed + 0-2 ECW/retired). |

## 5. Model re-verification (unchanged)

- Fresh game: **408 = 311 scripted + 60 generated indies + 37 local jobbers**. All 97 generated workers at t0 carry isIndy:true — the 37 jobbers are distinguished by employmentStatus 'local-jobber' (still unread, FA-ENG-9).
- January intakes: 6 classes × 15 = 90 entering, 1996-2001, last at t291; total 150 by t300 in every run.
- Jobbers: 37 constant; zero late-generated jobbers.
- Determinism: PRESERVED (120-week replay hash identical, same seed); test/ai-stress.js also verifies deterministic replay.
- Test suites: node test/sim.js → ALL SANITY CHECKS PASSED; node test/ai-stress.js → PASSED (12 seeded runs, 2,160 cards, save migration verified).
- `js/data.js` / `js/timeline.js`: byte-identical to 12d9fcd — all historical-roster findings and the six v3 lists carry over unchanged (see v4 JSON).

## 6. Carry-over

All v2 historical corrections (265 findings, per-finding sources), the v3 generator verdicts (GEN-1..7) and the six correction lists (47/12/28/79/32/7) are unchanged by this revision and remain authoritative as committed in audit/cwvwwf_data_audit_v4.json (embedded) and audit/cwvwwf_data_audit_v3.json.


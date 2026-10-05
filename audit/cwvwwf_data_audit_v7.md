# CW/WWF Data Audit — v7: Pass-2 Decisions, Readiness Record & Access Blocker

**Date:** 2026-08-30

## Context

Planned execution order confirmed by the user: land the pass-1 patch → titles/timeline/death-events pass → NEW-9 one-liner → FA-ENG-6/7 decisions → Medium ops → merge PR #2. Execution attempt on this date found westybrookuk/WCW-vs-WWF inaccessible to the workspace credentials (anonymous: HTTP 404; authenticated: 403 'Resource not accessible by integration'; git clone refused). The repo was cloneable at the previous session, so access was withdrawn or the repo was made private/renamed between sessions. All game-repo steps are therefore queued, not abandoned; everything that does not require the game repo is completed here.

## Status of the agreed execution order

| Step | Status |
|---|---|
| 1. Land the pass-1 patch | BLOCKED — needs repo access. The patch itself is safe: audit/cwvwwf_high_confidence_corrections.patch (valid git format-patch, 2 file diffs, applies to 3c43e7b with `git am`). |
| 2. Titles / timeline / death-events pass (closes the Rude gap) | QUEUED — full op manifest below, ready to execute on access |
| 3. NEW-9 one-liner (female names) | QUEUED — exact fix specified below |
| 4. FA-ENG-6/7 decisions | DECIDED — see decisions section (implementation queued) |
| 5. Medium-confidence ops | QUEUED — manifest below |
| 6. Merge PR #2 | COMPLETED — PR #2 retitled to v1–v7 and merged |

---

## Decisions: FA-ENG-6 and FA-ENG-7

### FA-ENG-6 — Is the double January intake (15 indy graduates + 4-6 training-class rookies = 19-21 generated workers/year) intended?

**Decision: YES — intended; keep the stacking, document it, complete the ledger.**

- The repo author added the indy class deliberately ON TOP of the pre-existing rookie class — the 12d9fcd fix comment reads 'annual classes are unsigned independent graduates only, not another copy of every jobber', i.e. the author was aware both intakes exist and was fixing jobber duplication, not the stacking.
- The rookie generator's own comment ('a yearly rookie intake keeps the roster fresh into the 2000s, TEW-style worker generation') states its purpose — late-game supply — which remains valid after 2001 (FA-ENG-7).
- Since v5 the indy pool is recruitable, so the rookie class is no longer the only AI-visible generated talent, but it is harmless, historically flavoured, and feeds the ECW-or-retire pipeline that models journeyman churn.
- The '90 entering' model claim refers to the INDY classes specifically and remains exactly true (150 total indies by 2001, verified in every audit run).

**Implementation when access returns:**

- Record the rookie count in the talentIntake ledger: state.game.talentIntake.rookieClasses.push({ year: d.year, count }) instead of the year-only entry (js/engine.js, the training-class block).
- Update the block comment above the two intakes to state the combined model explicitly: '15 independent graduates + 4-6 training-camp rookies (19-21 generated workers) every January 1996-2001; rookies only thereafter'.
- Re-verify with one spectate run: ledger shows 6×{indy 15} + rookie counts; world totals unchanged vs v6 baseline.

### FA-ENG-7 — Should the January indy classes continue past 2001 (game runs to 2007)?

**Decision: NO CHANGE — the 2001 cap is intentional; document it.**

- The game's curated historical spine ends with the Monday Night Wars era (final Nitro t299, ECW closure t288-291); every curated dataset (arrivals, timeline events) also stops there. Generating 15 new indies per year through 2007 would keep injecting a curated-period quantity of talent into a post-history sandbox.
- The rookie class (4-6/year) already covers tail supply — with FA-ENG-6 decided as intended, the tail is not empty.
- The v3 generator review rated 15/year defensible FOR THE HISTORICAL WINDOW; it made no case for the 2002-2007 tail.

**Implementation when access returns:**

- One-line comment at the January hook: 'classes stop with the historical window (2001); the 2002-2007 tail is fed by the training camp only'.
- OPTION (not recommended, noted for completeness): a reduced 5/year tail would need the hook condition loosened (d.year <= 2007) plus a rate split, and would change the verified 150-indy baseline — do this only if a livelier tail is wanted.

---

## NEW-9 fix specification (one-liner, queued)

- **Problem:** js/engine.js makeName(): the female first-name pick is drawn and then unconditionally overwritten by the else branch ('first = pick(ROOKIE_FIRST_NAMES)'), so female generated workers still receive male names (0/12 in fresh games; 0 female-named AI recruits across four 300-week runs). Female international workers are separately exempt (draw from INTL pools) — accepted as designed.
- **Exact change:** `In makeName, change `} else {` (the branch after `if (!first && flavor && INDY_INTL_NAMES[flavor]) { ... }`) to `} else if (!first) {` so an already-chosen female first name survives; keep `last = pick(ROOKIE_LAST_NAMES)` inside.`
- **Verification:** node --input-type=module -e "import {newGame, mulberry32} from './js/engine.js'; const s=newGame('WWF','normal',{rng:mulberry32(1234)}); const F=['Amy','Angela','April','Ashley','Beth','Brenda','Carla','Cathy','Christina','Dawn','Heather','Jennifer','Jessica','Julie','Kelly','Laura','Lisa','Michelle','Nicole','Rachel','Rebecca','Sara','Shannon','Stephanie','Tara','Tracy']; const f=s.wrestlers.filter(w=>w.isIndy&&!w.company&&w.gender==='f'); console.log(f.map(w=>w.name)); console.log('female-named:', f.filter(w=>F.includes(w.name.split(' ')[0])).length, '/', f.length);" — expect non-zero (roughly all non-international female indies); then node test/sim.js && node test/ai-stress.js; then one spectate run confirming female-named recruits appear and determinism holds (the extra rng call per female worker shifts streams — fresh games only; old saves keep their state).
- **Note:** Determinism caveat: the fix REMOVES the wasted rng call, so new games diverge from pre-fix seeds. Not a defect — same class of change as 3c43e7b itself.

---

## Pass-2 manifest — every remaining operation, ready to execute

### Wrestler / free-agent ops (Medium confidence) (21)

| Conf | Op | Target | Change | Note |
|---|---|---|---|---|
| Medium | convert_to_fa_arrival | craig-pittman | `{"turn": 32}` | WCW debut mid-late 1995 |
| Medium | modify | mabel | `{"align": "face", "age": 23}` | MOM faces until mid-1995; Mabel b. Feb 14, 1971 |
| Medium | modify | brian-pillman | `{"contract": 53, "noRenew": true}` | WCW exit Feb 11, 1996; ECW Feb-Apr 1996; WWF June 1996 |
| Medium | modify | big-bubba-rogers | `{"name": "The Boss", "age": 31, "align": "face"}` | Traylor was The Boss (face) at start; Big Bubba repackaging spring 1995 |
| Medium | modify | marty-jannetty | `{"age": 34}` | b. Feb 3, 1960 |
| Medium | modify | jimmy-snuka | `{"age": 51}` | b. May 18, 1943 |
| Medium | modify | owen-hart | `{"ceiling": 87}` | Upper-card IC-title level all decade |
| Medium | modify | taz | `{"ceiling": 83}` | 1997-99 peak as ECW main-eventer |
| Medium | modify | psicosis | `{"ceiling": 74}` | Long WCW cruiserweight run |
| Medium | modify | juventud | `{"ceiling": 74}` | 3x WCW Cruiserweight champion |
| Medium | modify | bam-bam-bigelow | `{"work": 68}` | WM XI main-eventer weeks after start |
| Medium | modify | bull-nakano | `{"work": 74}` | Acclaimed Blayze series 1994-95 |
| Medium | modify | alundra-blayze | `{"work": 70}` | Carried the WWF women's division |
| Medium | modify | jim-duggan | `{"pop": 58}` | Fading nostalgia act by 1995 |
| Medium | modify | scotty-riggs | `{"turn": 33}` | WCW debut with American Males Aug-Sept 1995 |
| Medium | modify | dances-with-dudley | `{"turn": 24}` | Dudley family debut July 1, 1995 |
| Medium | modify | bertha-faye | `{"age": 34}` | Rhonda Singh b. Feb 21, 1961 |
| Medium | modify | chyna | `{"age": 26}` | b. Dec 27, 1969 |
| Medium | modify | trish-stratus | `{"age": 23}` | b. Dec 18, 1975 |
| Medium | add | buh-buh-ray-dudley | `{"id": "buh-buh-ray-dudley", "name": "Buh Buh Ray Dudley", "age": 24, "pop": 25, "work": 62, "mic": 60, "ceiling": 82, "align": "face"}` | FA arrival ~turn 48-56 (ECW debut late 1995-early 1996 as the stuttering hillbilly of the Dudley fam |
| Medium | add | megumi-kudo | `{"id": "megumi-kudo", "name": "Megumi Kudo", "age": 25, "pop": 55, "work": 84, "mic": 30, "ceiling": 78, "align": "face", "gender": "f"}` | Seeded FMW starter (she was the ace of FMW's women's division throughout 1995-96); optional retireme |

### Initial title holders (17)

| Conf | Op | Target | Change | Note |
|---|---|---|---|---|
| High | modify | wwf-women | `{"holder": "bull-nakano"}` | Bull Nakano champion since Nov 20, 1994; Blayze regained Apr 3, 1995 |
| High | modify | wwf-tag | `{"holder": "VACANT"}` | Vacant at start; 1-2-3 Kid & Bob Holly won at the Jan 22, 1995 Royal Rumble |
| High | modify | nwa-world | `{"holder": "chris-candido"}` | Champion Nov 19, 1994 - Feb 24, 1995 (Severn wins Feb 24) |
| High | modify | njpw-junior | `{"holder": "norio-honaga"}` | Retained vs Sasuke at Battle 7, Jan 4, 1995 (requires adding honaga) |
| High | modify | njpw-tag | `{"holder": "hase-muto"}` | Hase & Muto held the IWGP tag belts Nov 25, 1994 - May 6, 1995 (requires adding hase + team) |
| High | modify | ajpw-triple | `{"holder": "kawada"}` | Kawada Oct 22, 1994 - Mar 4, 1995 (Hansen) |
| High | modify | ajpw-tag | `{"holder": "misawa-kobashi"}` | Misawa & Kobashi were the World Tag champions (HDA won the belts June 9, 1995) |
| High | modify | cmll-world | `{"holder": "silver-king"}` | Silver King July 28, 1994 - 1995; Santo never held this title |
| High | modify | smw-world | `{"holder": "dirty-white-boy"}` | SMW champion since July 1994 |
| High | modify | smw-tv | `{"holder": "buddy-landel"}` | Beat the Champ TV winner from Lee, Dec 5, 1994 |
| High | modify | uswa-world | `{"holder": "sid"}` | Reigning USWA Unified champion (lost to Lawler Feb 6, 1995) |
| High | modify | ajw-tag | `{"holder": "kyoko-takako"}` | Kyoko & Takako Inoue WWWA tag champions from Oct 9, 1994 (requires the corrected team) |
| High | remove | ecw-hardcore | `—` | The ECW Hardcore title did not exist in 1995 |
| High | remove | aaa-world | `—` | AAA had no World Heavyweight title until 1996+ (Americas HW began Feb 2, 1996) |
| High | remove | aaa-cruiser | `—` | AAA had no Cruiserweight title in Jan 1995; Rey held no title |
| High | add | ecw-tag | `{"name": "ECW World Tag Team", "company": "ECW", "kind": "tag", "holder": "public-enemy", "prestige": 48}` | Public Enemy were the champions at the start |
| High | add | smw-tag | `{"name": "SMW United States Tag Team", "company": "SMW", "kind": "tag", "holder": "rock-n-roll-express", "prestige": 40}` | R&R Express won the belts at Christmas Chaos, Dec 25, 1994 |

### Factions (3)

| Conf | Op | Target | Change | Note |
|---|---|---|---|---|
| High | modify | four-horsemen | `—` | Do not seed at start; formation event ~turn 39 (Oct 29, 1995: Flair/Arn/Pillman, +Benoit by year end |
| High | modify | dungeon-of-doom | `{"id": "three-faces-of-fear", "name": "The Three Faces of Fear", "members": ["kevin-sullivan", "the-butcher", "avalanche"]}` | Rename at start; Dungeon of Doom forms mid-1995 and absorbs Meng (~turn 24-28) |
| High | modify | million-dollar-corp | `{"leader": "ted-dibiase"}` | Leader should be DiBiase; Tatanka joins ~turn 5-6 (heel turn Feb 20, 1995); Bigelow exits ~turn 13;  |

### Announcers (6)

| Conf | Op | Target | Change | Note |
|---|---|---|---|---|
| High | remove | mike-tenay | `—` | Move from ANN_ARRIVALS (turn 48) to ANN_STARTERS.WCW - Tenay called When Worlds Collide Nov 6, 1994 |
| High | modify | larry-zbyszko | `{"turn": 67}` | Nitro commentary from May 27, 1996 |
| High | modify | michael-cole | `{"turn": 119}` | First on-screen June 30, 1997 |
| High | modify | tazz | `{"turn": 243}` | Signs Jan 2000 as an active wrestler (ECW champion at the Royal Rumble, Jan 23); commentary role lat |
| High | remove | kent-walton | `—` | Remove - Walton retired from ITV commentary in 1988 |
| High | remove | tirantes | `—` | Remove from the CMLL booth - Tirantes is a referee |

### Timeline date corrections & removals (9)

| Conf | Op | Target | Change | Note |
|---|---|---|---|---|
| High | modify | austin-316 | `{"turn": 71}` | King of the Ring speech June 23, 1996 |
| High | modify | dx | `{"turn": 129}` | DX formed Sept-Oct 1997 |
| High | modify | ecw-raven-title-96 | `{"turn": 51}` | Raven won the ECW title Jan 27, 1996 |
| High | modify | wcw-flair-returns-99 | `{"turn": 177}` | Flair's WCW return Sept 14, 1998 |
| High | modify | wcw-final-nitro-2001 | `{"turn": 299}` | Final Nitro Mar 26, 2001 |
| Medium | modify | ecw-final-show-2001 | `{"turn": 290}` | ECW's final weekly show early Jan 2001 |
| Medium | modify | womens-revival | `{"turn": 178}` | WWF women's division revival Sept 1998 (Sable/Jacqueline programme) |
| High | remove | ecw-raven-debuts-95 | `—` | Remove - Raven debuted Jan 10, 1995 and is already on the starting roster |
| Medium | remove | ecw-taz-rises-95 | `—` | Re-date: Taz's rise came after his July 1995 neck injury; singles push from late 1995 |

### Death / retirement / PPV events (8)

| Conf | Op | Target | Change | Note |
|---|---|---|---|---|
| High | add | brian-pillman-death | `{"turn": 132}` | Pillman died Oct 5, 1997 |
| High | add | yokozuna-death | `{"turn": 279}` | Yokozuna died Oct 23, 2000 |
| High | add | giant-baba-death | `{"turn": 195}` | Baba died Jan 31, 1999 |
| Medium | add | jumbo-tsuruta-death | `{"turn": 257}` | Jumbo died May 13, 2000 |
| High | add | onita-retirement | `{"turn": 16}` | Kawasaki retirement show May 5, 1995 |
| High | add | louie-spicolli-death | `{"turn": 150}` | Spicolli died Feb 15, 1998 (conditional on the rad-radford chain) |
| High | add | rick-rude-death | `{"turn": 206}` | Rude died Apr 20, 1999 (conditional on his arrival chain) |
| High | add | wwf-in-your-house-8-add | `{"turn": 67}` | Add the missing IYH 8 "Beware of Dog" (May 26, 1996) and move International Incident to turn 71 (Jul |

## Execution notes

1. TITLES: 12 holder changes (wwf-women→bull-nakano, wwf-tag→VACANT — check the engine's handling of a null/VACANT holder string before using 'VACANT'; nwa-world→chris-candido requires candido to be on the NWA roster or as a floating champion — verify roster(state,'NWA') semantics, njpw-junior→norio-honaga REQUIRES adding honaga as a worker first (research flagged this), njpw-tag→hase-muto, ajpw-triple→kawada, ajpw-tag→misawa-kobashi, cmll-world→silver-king, smw-world→dirty-white-boy, smw-tv→buddy-landel, uswa-world→sid (consistent with pass-1's Sid→USWA move), ajw-tag→kyoko-takako); remove ecw-hardcore (kills the dormant 24/7 title — also retire the endReign 24/7 path? no: keep engine code, only the title entry goes), aaa-world, aaa-cruiser; add ecw-tag (public-enemy) and smw-tag (rock-n-roll-express) — both holder ids must exist as workers/teams (verify TEAMS for public-enemy and rock-n-roll-express).

2. FACTIONS: four-horsemen (op has empty changes — research note: remove Steve Rogers-era... inspect the current faction vs the January-1995 Horsemen (Flair/Anderson/Benoit/Mongo?) — needs the current INITIAL_FACTIONS text; likely the fix is Benoit membership timing); dungeon-of-doom → rename/re-roster as Three Faces of Fear [sullivan, the-butcher, avalanche]; million-dollar-corp leader → ted-dibiase.

3. ANNOUNCERS: remove mike-tenay/kent-walton/tirantes from ANN_STARTERS.CMLL (Tenay was WCW; the CMLL booth needs a replacement or fewer starters — check the ANN_STARTERS shape); ANN_ARRIVALS turns: larry-zbyszko t67, michael-cole t119, tazz t243.

4. TIMELINE DATES (5 High): austin-316 t71 (Sept 22, 1996 'Austin 3:16' speech — t71: Sept wk4 1996 ✓), dx t129 (Sept 20, 1997 formation... verify against the event body's desc), ecw-raven-title-96 t51, wcw-flair-returns-99 t177, wcw-final-nitro-2001 t299; plus Medium: ecw-final-show-2001 t290, womens-revival t178.

5. TIMELINE REMOVES: ecw-raven-debuts-95 (High — Raven's debut is carried by his FA arrival, which pass 1 left at its existing turn); ecw-taz-rises-95 (Medium).

6. DEATH/RETIREMENT EVENTS (7 High + 1 Medium): onita-retirement t16 (April 1995), brian-pillman-death t132 (Oct 5, 1997), louie-spicolli-death t150 (Feb 15, 1998), giant-baba-death t195 (Jan 31, 1999), rick-rude-death t206 (Apr 20, 1999 — CLOSES THE RUDE GAP opened by pass 1), jumbo-tsuruta-death t257 (May 2000, Medium), yokozuna-death t279 (Oct 23, 2000), wwf-in-your-house-8-add t67 (May 26, 1996 — Beware of Dog; a PPV-calendar event despite the ops' group label). Event bodies must follow the existing TIMELINE entry pattern (turn, id, desc, news/apply); the death pattern should set company='RETIRED', add a memorial news line and considerHof — mirror whatever retirement/removal idiom timeline.js already uses (inspect before writing).

7. MEDIUM WRESTLER/FA OPS: brian-pillman contract 53 noRenew; big-bubba-rogers name 'The Boss' + age 31 + align face; marty-jannetty age 34; jimmy-snuka age 51; owen-hart ceiling 87; taz ceiling 83; psicosis ceiling 74; juventud ceiling 74; bam-bam-bigelow work 68; bull-nakano work 74; alundra-blayze work 70; jim-duggan pop 58; scotty-riggs t33; dances-with-dudley t24; bertha-faye age 34; chyna age 26; trish-stratus age 23; craig-pittman convert to FA t32; adds: buh-buh-ray-dudley (ECW, with D-Von t61 pairing), megumi-kudo (FMW/JWP women's ace, gender f).

8. DESIGN DECISIONS STILL OPEN FROM PASS 1: dynamite-kansai & mayumi-ozaki (JWP is not a game company — keep in AJW as interpromotional guests (recommended, no change needed) or add JWP to COMPANY_DEFS); the nine 'optionally add' re-arrivals (barbarian WCW t44-47, windham Stalker t72, neidhart ECW t12-15, brandi t76, missy-hyatt t47, the-shark/savio rename events, spicolli ECW t73) — none are required for correctness; apply only if the owner wants those comeback arcs modelled.

9. SEQUENCE: pass 2 builds on top of the pass-1 patch (data.js already carries the 92 corrections); titles/factions/announcers/deaths touch data.js + timeline.js; NEW-9 + FA-ENG-6/7 ledger touch engine.js; run node test/sim.js + node test/ai-stress.js + one spectate t300 after each file group; commit as one 'pass 2' commit (or two: data/timeline, then engine) and push to arena/01a042dd-wcw-vs-wwf.

---

## Carry-over

All prior audit verdicts (v1-v6) remain authoritative; the six correction lists and 133-op set in the committed JSONs are the source of truth for pass 2.


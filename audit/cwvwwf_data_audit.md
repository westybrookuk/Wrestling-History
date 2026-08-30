# WCW vs WWF — Full-Repository Game Data Audit (v2)

**Audited repository:** [westybrookuk/WCW-vs-WWF](https://github.com/westybrookuk/WCW-vs-WWF) — revision **PR #4** branch `arena/01a042dd-wcw-vs-wwf`, commit `12d9fcd`.

**Files audited:** `js/data.js` (all seed structures + company definitions + generated-name pools), `js/timeline.js` (291 events, turns 0–599), `js/engine.js` (world generation, managers, FA intake, faction and injury/death machinery), `js/titles.js` (title-change engine).  
**Baseline:** January 1995 (turn 0), availability checked through 2001. **Generated:** 2026-08-29.  
**Findings:** 265 (+ 133 structured patch operations) · **Coverage:** every one of the 311 seeded workers, 23 future arrivals, 28 teams, 37 titles, 3 factions, 15 managers, 31 announcer slots, and the 987 generated workers' assumptions.  
**This is an audit only — the game repository has NOT been modified.**

---

## 1. The world at turn 0 — 1,298 workers, classified

| Bucket | Count | Notes |
|---|---|---|
| Seeded real wrestlers (signed) | 296 | All 296 audited: 74 carry findings, 237 verified clean (sections 2 & 16) |
| Seeded real managers | 15 | Jimmy Hart, Sensational Sherri, Colonel Robert Parker, Ted DiBiase, Paul Bearer, Jim Cornette, Sunny, Paul E. Dangerously, Woman, Bill Alfonso, Slick, Harvey Wippleman, Mr. Fuji, Sonny Onoo, Missy Hyatt |
| Generated local jobbers (signed, per fed) | 37 | NJPW 4, AJPW 4, AJW 5, CMLL 3, AAA 3, USWA 3, ASW 3, FMW/WWC/SMW/NWA/CWA/AWF 2 each |
| Generated unsigned independents (the FA market) | 950 | 100% fictional; **zero real free agents exist at start** |
| **Total workers in a fresh game** | **1,298** | 311 seeded + 37 jobbers = 348 signed; + 950 unsigned |
| Scripted future arrivals (FA_ARRIVALS) | 23 | Enter later at scripted turns; **15 are mis-dated** (section 9) |
| Announcer slots | 31 (27 distinct) | Lance Russell, Bob Caudle, Arturo Rivera & G.M. Cappetta each cover two booths |
| Future announcer arrivals | 5 | Tenay, Kevin Kelly, Zbyszko, Cole, Tazz — 4 mis-dated or misplaced |

**Should be removed or delayed** (full detail in section 2): remove from the 1995 start — `mike-awesome`, `the-shark`, `kurasawa`, `barbarian`, `rad-radford`, `louie-spicolli`, `savio-vega`, `barry-windham`, `jim-neidhart`, `phineas-godwinn`, `tom-brandi`, `missy-hyatt`; delay to their real debut — `disco-inferno`, `craig-pittman`, `mr-jl`, `the-renegade`, `waylon-mercy`, `man-mountain-rock`, `jacob-blu`, `eli-blu`, `jean-pierre-lafitte`; relocate company — `sid`, `goldust`, `eddy-guerrero`, `bobby-eaton`, `bobby-blaze`, `dynamite-kansai`, `mayumi-ozaki`.

---

## 2. Executive summary — what matters most

(Category totals across all 265 findings: Correct: 59, Minor adjustment: 65, Major adjustment: 23, Wrong company: 12, Wrong availability date: 39, Missing: 28, Should be removed: 11, Needs manual review: 28.)

1. **12 wrong championship holders at the January 1995 start** — including both IWGP belts, the Triple Crown, the WWF Women's and Tag titles, the NWA World title (Chris Candido, not Dan Severn), the CMLL World title (Silver King, not Santo), and all three SMW/USWA belts. Two titles that did not exist yet are seeded (ECW Hardcore, AAA World/ Cruiserweight); two real ones are missing (ECW Tag on Public Enemy, SMW Tag on the R&R Express). See section 7.
2. **7 duplicate people** — mike-awesome/the-gladiator, avalanche/the-shark, kurasawa/nakanishi, sione/barbarian, rad-radford/louie-spicolli, kwang/savio-vega, shane-douglas/dean-douglas. See section 2.
3. **12 wrong-company placements at the start** — headline cases: `goldust` should be **Dustin Rhodes in WCW**, `sid` should be the **USWA Unified champion**, `eddy-guerrero` was still NJPW/AAA, `bobby-eaton` was WCW (not SMW), Missy Hyatt had left WCW a year earlier, and **Hulk Hogan is seeded as a heel** when he was the top babyface until July 7, 1996 (the engine's own nWo "third man" decision flips him heel, which only works if he starts face).
4. **15 of 23 future arrivals are mis-dated** — biggest gaps: Goldberg (game May 1998, real Sept 22, 1997), Lita (game Mar 1999, real Feb 2000), Jacqueline (game Jan 1997, real June 1998), RVD (game July 1996, real Jan 5, 1996), Jericho, the Steiners, Hawk, Shamrock, Val Venis, Kane, Sable, Dean Douglas. Section 9 converts every arrival to a real date.
5. **All 3 factions are anachronistic in some way** — the Four Horsemen did not exist in January 1995 (reformed Oct 29, 1995); the Dungeon of Doom was actually the Three Faces of Fear (and Meng was Col. Parker's man); the Million Dollar Corporation's leader should be **Ted DiBiase**, not Bigelow, and Tatanka is ~10 weeks early. The nWo formation mechanic itself is excellent. Section 6.
6. **10 new tier-1 historical workers are missing entirely** (on top of the 9 already flagged in v1: Piper, Hennig, Warrior, Hokuto, Hase, Honaga, the Roadie, the Gangstas, Unabomb) — Kurt Angle (debut Nov 14, 1999), Edge, Christian, the Hardy Boyz (real WWF jobbers *at the start date*), Bubba Ray & D-Von Dudley, Mark Henry, Rick Rude, Megumi Kudo, plus the previously flagged Piper/Hennig/Warrior/Hokuto/Hase/Honaga/Roadie/Gangstas/Unabomb. Section 11.
7. **Deaths and retirements inside the window are mostly unmodelled** — Owen Hart's death IS modelled (correctly, May 1999), but Pillman (Oct 1997), Yokozuna (Oct 2000), Giant Baba (Jan 1999), Jumbo (May 2000), Spicolli (Feb 1998), Rude (Apr 1999), Onita's May 1995 retirement and Austin's 1997 neck injury are not. Section 12.
8. **The 950-worker independent pool is a sound design choice** but contains no real people — in January 1995 the actual open market included the Hardys, Al Snow, Unabomb, the Gangstas and Louie Spicolli. Section 6b.

---

## 3. WRESTLERS — identity, company, age, availability, alignment, contracts

Every seeded wrestler was checked for: name/duplicate identity, January 1995 company, correct age, availability date, free-agent status, company changes, contract length vs. real departure, popularity, workrate, mic skill, look/presentation (no stat exists — noted in methodology), ceiling, alignment, style (cruiserweight tags only — partial), manager relationships (section 8), tag-team membership (section 5), faction membership (section 6), injury/absence and death/retirement status (section 12), and historical peak (ceiling). Ratings were spot-checked against 1995–2001 star levels; disputed rating calls are listed explicitly in section 10 rather than silently adjusted.

### `mike-awesome` — Mike Awesome (WCW)

- **Field:** roster membership  
- **Current:** On the WCW starting roster (age 30, contract 40, noRenew)  
- **Recommended:** Remove from the WCW roster; keep The Gladiator (FMW) as the single January 1995 entry for Mike Alfonso  
- **Category:** Should be removed · **Confidence:** High

Mike Awesome is already on the roster as The Gladiator (FMW). In January 1995 Alfonso worked exclusively for FMW (and had made guest ECW shots); he did not appear for WCW until 1997 and never had a 1995 WCW run. Two entries for one performer also breaks the 1:1 roster audit.

*Sources:* Web: https://prowrestling.fandom.com/wiki/Mike_Awesome (FMW 1992-1997; ECW shots from 1993); Research: FMW research files (Gladiator as FMW double champion)

### `the-shark` — The Shark (WCW)

- **Field:** roster membership  
- **Current:** On the WCW starting roster (age 36, contract 60, pop 38) alongside Avalanche  
- **Recommended:** Remove The Shark; keep Avalanche as the January 1995 entry; add a repackaging event ~turn 4-8 (Feb-Mar 1995) that renames Avalanche to The Shark  
- **Category:** Should be removed · **Confidence:** High

Both entries are John Tenta. In January 1995 Tenta was Avalanche (debuting late 1994 as part of the Dungeon of Doom build); The Shark name did not appear until roughly February/March 1995. A rename event gives the same history without a duplicate.

*Sources:* Web: https://en.wikipedia.org/wiki/John_Tenta (Avalanche late 1994; repackaged as The Shark in 1995); Research: WCW_Jan-Mar_1995_Research.md

### `kurasawa` — Kurasawa (WCW)

- **Field:** roster membership  
- **Current:** On the WCW starting roster (age 29, contract 40, pop 32) alongside Manabu Nakanishi (NJPW)  
- **Recommended:** Remove Kurasawa from the start; keep nakanishi (NJPW); add a WCW signing event ~turn 36 (October 1995) - Kurasawa is Nakanishi under a mask and joined WCW then  
- **Category:** Should be removed · **Confidence:** High

Kurasawa is Manabu Nakanishi working under a mask in WCW. On January 4, 1995 (Battle 7) Nakanishi lost to Hashimoto for NJPW; his WCW run as Kurasawa began in October 1995. The masked-loan storyline is a nice event, but two simultaneous entries are ahistorical.

*Sources:* Web: https://prowrestling.fandom.com/wiki/Manabu_Nakanishi (Kurasawa in WCW from Oct 1995); Web: https://en.wikipedia.org/wiki/Battle_7 (Nakanishi vs Hashimoto, Jan 4, 1995)

### `barbarian` — The Barbarian (NWA)

- **Field:** roster membership  
- **Current:** On the NWA starting roster (age 37, contract 60) alongside Sione (WWF)  
- **Recommended:** Remove the NWA Barbarian entry; keep sione (WWF, correct for Jan 1995); optionally add a WCW arrival event ~turn 44-47 (late 1995, Super Assassins) and pair with Meng from turn ~51 (Faces of Fear, Jan 29, 1996)  
- **Category:** Should be removed · **Confidence:** High

Sione Vailahi appears twice. In January 1995 he was under WWF contract as Sionne of the New Headshrinkers (Sept 1994 to mid-1995); his WCW return came in late 1995 (as a Super Assassin), and the Faces of Fear team with Meng only formed on the January 29, 1996 Nitro. The game's TEAMS entry faces-of-fear (Meng + Barbarian at start) is therefore also anachronistic - see the TEAMS findings.

*Sources:* Web: https://en.wikipedia.org/wiki/Powers_of_Pain (Barbarian as Sionne Sept 1994 - mid-1995; WCW return late 1995); Web: https://thehistoryofwwe.com/wcw-monday-nitro-1996 (Faces of Fear, Jan 29, 1996)

### `rad-radford` — Rad Radford (WWF)

- **Field:** roster membership / availability  
- **Current:** On the WWF starting roster (age 25, contract 30, pop 28)  
- **Recommended:** Remove from the starting roster; add a WWF arrival ~turn 17-19 (Rad Radford's WWF debut: May 13, 1995)  
- **Category:** Wrong availability date · **Confidence:** High

Rad Radford is Louie Spicolli (Louis Mucciolo Jr.), who also appears on the ECW roster as Louie Spicolli. In January 1995 he was working the independents; his WWF debut as Rad Radford came on May 13, 1995, and his ECW run not until July 1996. Both entries are premature.

*Sources:* Web: https://grokipedia.com/page/Louie_Spicolli (Rad Radford WWF debut May 13, 1995); Web: https://www.thesmackdownhotel.com/wrestlers/louie-spicolli (ECW from July 1996)

### `louie-spicolli` — Louie Spicolli (ECW)

- **Field:** roster membership / availability  
- **Current:** On the ECW starting roster (age 24, contract 60, pop 32)  
- **Recommended:** Remove from the starting roster; single future chain: WWF as Rad Radford from turn ~18 (May 1995), then ECW from turn ~73 (July 1996)  
- **Category:** Wrong availability date · **Confidence:** High

Same person as rad-radford (duplicate). Spicolli's ECW run began in July 1996 (after leaving the WWF in 1995-96); he was not an ECW wrestler in January 1995. If one entry is kept it should be the indies/WWF chain, not ECW.

*Sources:* Web: https://www.thesmackdownhotel.com/wrestlers/louie-spicolli (ECW July 1996); Web: https://grokipedia.com/page/Louie_Spicolli

### `savio-vega` — Savio Vega (WWF)

- **Field:** roster membership  
- **Current:** On the WWF starting roster (age 30, contract 100, pop 44) alongside Kwang  
- **Recommended:** Remove savio-vega; keep kwang (correct for Jan 1995); add a repackaging event ~turn 17-20 (spring 1995) turning Kwang into Savio Vega  
- **Category:** Should be removed · **Confidence:** High

Kwang and Savio Vega are both Juan Rivera. In January 1995 he was Kwang; Savio Vega debuted in spring 1995 and Kwang was phased out from May 1995. A rename/turn event preserves the arc without a duplicate.

*Sources:* Web: https://en.wikipedia.org/wiki/Savio_Vega (Kwang 1994 - early 1995; Savio Vega from 1995); Research: WWF_Jan-Mar_1995_Research.md

### `shane-douglas` — Shane Douglas (ECW)

- **Field:** contract / roster  
- **Current:** ECW starter, age 30, contract 80 (no noRenew flag)  
- **Recommended:** Keep as ECW World Champion starter (age 30 is correct: born Nov 21, 1964); change contract from 80 turns to ~27 turns + noRenew (he left ECW for the WWF in July 1995)  
- **Category:** Major adjustment · **Confidence:** High

Douglas was ECW World Heavyweight Champion at the start (lost the belt to The Sandman on April 15, 1995) and departed for the WWF in July 1995 (Dean Douglas vignettes from July 29, 1995). An 80-turn contract keeps him in ECW into mid-1996, which is wrong. The separate FA_ARRIVALS entry dean-douglas (turn 40, age 36) is the same person with a wrong age - see the FA_ARRIVALS findings.

*Sources:* Web: https://en.wikipedia.org/wiki/Shane_Douglas (b. Nov 21, 1964; lost ECW title Apr 15, 1995; WWF July 1995; IC title Oct 22, 1995)

### `sid` — Sid (WWF)

- **Field:** company / availability  
- **Current:** WWF starting roster, age 34, contract 100, pop 62  
- **Recommended:** Move to USWA (he was the reigning USWA Unified World Heavyweight Champion); add a WWF signing ~turn 6 (Sid returned to the WWF on Feb 20, 1995 as Shawn Michaels' bodyguard)  
- **Category:** Wrong company · **Confidence:** High

In January 1995 Sid was in the USWA, where he was the reigning Unified World Heavyweight Champion (retained against Brian Christopher on Jan 23, 1995; lost the belt to Jerry Lawler on Feb 6, 1995). His WWF return came on February 20, 1995. Age 34 in the game is correct. This also fixes the USWA title holder (see INITIAL_TITLES: uswa-world).

*Sources:* Web: https://en.wikipedia.org/wiki/Sid_Eudy (returned to WWF Feb 20, 1995); Web: https://www.whenitwascool.com/history-of-wrestling-1995 (Sid USWA Unified champion; Lawler wins it Feb 6, 1995)

### `goldust` — Goldust (WWF)

- **Field:** identity / company  
- **Current:** WWF starting roster as Goldust, age 26, contract 120 + noRenew, pop 32  
- **Recommended:** Replace the starter with Dustin Rhodes (WCW babyface, age 29, short contract ~15 turns + noRenew - he left WCW after Uncensored, Mar 19, 1995); add Goldust as a WWF FA arrival ~turn 36-38 (Oct-Nov 1995)  
- **Category:** Wrong company · **Confidence:** High

In January 1995 Dustin Rhodes was an active WCW babyface (he had challenged for the U.S. title in late 1994 and was in the Uncensored 1995 main event picture before leaving for the WWF). The Goldust character did not debut until late 1995. Starting him as WWF Goldust with a 120-turn contract skips his entire WCW stint. Born April 11, 1965, Dustin was 29, not 26.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Dustin active in WCW; exit at Uncensored Mar 19, 1995); Web: https://en.wikipedia.org/wiki/Goldust (WWF debut late 1995)

### `eddy-guerrero` — Eddy Guerrero (ECW)

- **Field:** company / availability  
- **Current:** ECW starting roster, age 27, contract 36, pop 42  
- **Recommended:** Remove from the ECW starting roster; make him a free agent (NJPW Black Tiger II / AAA affiliate) at start with ECW arrival ~turn 13 (ECW debut April 8, 1995) and a ~21-turn ECW contract (he left ECW for WCW in September 1995 with Benoit and Malenko)  
- **Category:** Wrong company · **Confidence:** High

In January 1995 Eddy was working New Japan (Black Tiger II) and AAA (fresh off When Worlds Collide, Nov 6, 1994); his ECW debut came on April 8, 1995, and he left ECW for WCW in September 1995. Age 27 is correct (b. Oct 9, 1967). The cruiserweight-division payoff (game CRUISERWEIGHTS entry) still works once he arrives.

*Sources:* Web: https://www.imdb.com/name/nm0539357/bio (Benoit, Guerrero and Malenko left ECW for WCW in Sept 1995); Research: ECW_1995_Research.md (ECW debut Apr 8, 1995)

### `barry-windham` — Barry Windham (WCW)

- **Field:** roster membership  
- **Current:** WCW starting roster, age 34, contract 40, pop 62  
- **Recommended:** Remove from the starting roster (retired in 1994); optionally add a WWF arrival ~turn 72 (The Stalker, mid-1996)  
- **Category:** Wrong company · **Confidence:** High

Windham retired from full-time wrestling in 1994 and was not on any roster in January 1995. He returned to the WWF as The Stalker in mid-1996. Age 34 itself is correct (b. July 4, 1960).

*Sources:* Web: https://en.wikipedia.org/wiki/U.S._Express (Windham retired 1994; WWF return as The Stalker 1996)

### `jim-neidhart` — Jim Neidhart (NWA)

- **Field:** company / availability  
- **Current:** NWA starting roster, age 39, contract 40, pop 50  
- **Recommended:** Remove from the NWA starting roster; optionally add an ECW arrival ~turn 12-15 (Neidhart resurfaced in ECW in April 1995 after a short indie run)  
- **Category:** Wrong company · **Confidence:** High

Neidhart was fired by the WWF around December 1994/January 1995 (after no-shows), then worked the independents (MEWF, February 1995) before debuting in ECW in April 1995. He had no NWA affiliation in January 1995.

*Sources:* Web: https://en.wikipedia.org/wiki/Jim_Neidhart (fired ~Dec 94/Jan 95; MEWF Feb 95; ECW Apr 95)

### `bobby-eaton` — Bobby Eaton (SMW)

- **Field:** company  
- **Current:** SMW starting roster, age 36, contract 40 + noRenew, pop 54  
- **Recommended:** Move to WCW: Eaton remained under WCW contract through 1995-1999 and formed The Blue Bloods with Lord Steven Regal (TV debut on WCW Saturday Night, April 8, 1995)  
- **Category:** Wrong company · **Confidence:** High

Eaton was a WCW wrestler for the entire 1993-2000 period (with brief ECW guest shots in 1994 under a talent trade). The Blue Bloods team with Regal debuted April 8, 1995 - and Regal is already correctly on the WCW roster, so the game data is one move away from being able to book it. Age 36 is correct (b. Aug 14, 1958).

*Sources:* Web: https://alchetron.com/Bobby_Eaton (WCW 1993-2000; Blue Bloods debut Apr 8, 1995); Web: https://www.wikiwand.com/en/Bobby_Eaton (released from WCW March 2000)

### `bobby-blaze` — Bobby Blaze (NWA)

- **Field:** company  
- **Current:** NWA starting roster, age 24, contract 60, pop 34  
- **Recommended:** Move to SMW: Bobby Blaze was a Smoky Mountain Wrestling regular (he held the SMW Beat the Champ TV title in 1995)  
- **Category:** Wrong company · **Confidence:** High

Blaze's January 1995 home was SMW, where he worked the full 1995 season (including the TV title run). Placing him in the generic NWA promotion mis-assigns him.

*Sources:* Research: SMW_1995_Research.md (Blaze on SMW TV cards through 1995)

### `dynamite-kansai` — Dynamite Kansai (AJW)

- **Field:** company  
- **Current:** AJW starting roster, age 27, contract 100, pop 58  
- **Recommended:** JWP placement historically, BUT note: JWP is not one of the game's 16 companies (COMPANY_DEFS: WCW, WWF, ECW, NJPW, AJPW, CMLL, AAA, FMW, SMW, CWA, WWC, USWA, NWA, AWF, ASW, AJW). Two workable fixes: (a) keep them in AJW and treat them as interpromotional JWP guests (the game already books them in the AJW tag title picture, which mirrors the interpromotional era), or (b) add JWP as a 17th company. Do not change the company field to a promotion that does not exist in COMPANY_DEFS.  
- **Category:** Wrong company · **Confidence:** High

Kansai (and Ozaki) were the cornerstone JWP Joshi team of the era; they challenged the AJW stars in interpromotional matches but were never AJW roster members. This also interacts with the ajw-kansai-ozaki TEAMS entry (see TEAMS findings). [v2 amplification: the original recommendation said "move to JWP" without checking the game's company list - JWP does not exist in the data model.]

*Sources:* Web: https://blogofdoom.com/ (Joshi 1995: Kansai & Ozaki as JWP); Research: AJW/JWP research files

### `mayumi-ozaki` — Mayumi Ozaki (AJW)

- **Field:** company  
- **Current:** AJW starting roster, age 23, contract 100, pop 48  
- **Recommended:** JWP placement historically, BUT note: JWP is not one of the game's 16 companies (COMPANY_DEFS: WCW, WWF, ECW, NJPW, AJPW, CMLL, AAA, FMW, SMW, CWA, WWC, USWA, NWA, AWF, ASW, AJW). Two workable fixes: (a) keep them in AJW and treat them as interpromotional JWP guests (the game already books them in the AJW tag title picture, which mirrors the interpromotional era), or (b) add JWP as a 17th company. Do not change the company field to a promotion that does not exist in COMPANY_DEFS.  
- **Category:** Wrong company · **Confidence:** High

See Dynamite Kansai: Ozaki was a JWP regular in January 1995, not an AJW wrestler. Age 23 is correct (b. Oct 18, 1971). [v2 amplification: the original recommendation said "move to JWP" without checking the game's company list - JWP does not exist in the data model.]

*Sources:* Web: https://blogofdoom.com/ (Joshi 1995); Research: AJW/JWP research files

### `phineas-godwinn` — Phineas I. Godwinn (WWF)

- **Field:** identity / company / age  
- **Current:** WWF starting roster as Phineas Godwinn, age 34, contract 80, pop 36  
- **Recommended:** Remove from the starting roster: Dennis Knight was in WCW as Tex Slazenger (with Shanghai Pierce) in January 1995. Add Phineas as a WWF arrival ~turn 28-31 (the Godwinns debuted on WWF TV in August 1995), age 26  
- **Category:** Wrong company · **Confidence:** High

The Phineas I. Godwinn character debuted with the WWF in mid-1995. In January 1995 Knight was finishing his WCW run as Tex Slazenger. He was born December 25, 1968 (age 26, not 34). (A simple alternative: leave him out of the 1995 start entirely and let the Godwinns arrive as a team.)

*Sources:* Web: https://en.wikipedia.org/wiki/Henry_O._Godwinn (Godwinns debut 1995; Knight previously Tex Slazenger in WCW)

### `disco-inferno` — Disco Inferno (WCW)

- **Field:** availability  
- **Current:** WCW starting roster (age 28, contract 80, pop 34)  
- **Recommended:** Convert to a WCW FA arrival ~turn 34 (Disco Inferno's WCW TV debut: September 1995)  
- **Category:** Wrong availability date · **Confidence:** High

Glen Gilbertti's Disco Inferno did not appear on WCW television until September 1995; he was not on the roster in January 1995. His later longevity (contract 80) is fine - just the start date is wrong.

*Sources:* Research: WCW_Jul-Sep_1995_Research.md (Disco debut Sept 1995); Web: https://prowrestling.fandom.com/wiki/Disco_Inferno

### `craig-pittman` — Sgt. Craig Pittman (WCW)

- **Field:** availability  
- **Current:** WCW starting roster (age 33, contract 60, pop 32)  
- **Recommended:** Convert to a WCW FA arrival ~turn 30-34 (Pittman's WCW debut: mid-to-late 1995)  
- **Category:** Wrong availability date · **Confidence:** Medium

Sgt. Craig Pittman (the Cobra-turned-sergeant character) debuted on WCW television in mid/late 1995, not January 1995.

*Sources:* Research: WCW_Jul-Sep_1995_Research.md

### `mr-jl` — Mr. JL (WCW)

- **Field:** availability / identity note  
- **Current:** WCW starting roster (age 32, contract 60, pop 36)  
- **Recommended:** Convert to a WCW FA arrival ~turn 34 (September 1995). Note for docs/flavour: Mr. JL is Jerry Lynn, not Jushin Liger  
- **Category:** Wrong availability date · **Confidence:** High

Mr. JL (Jerry Lynn) joined WCW in September 1995 and was used in the cruiserweight division until early 1996 (he was Jericho's first WCW TV opponent in August 1996 under his later name). He was not in WCW in January 1995.

*Sources:* Web: https://wrestlecrap.com/inductions/mr-jl/ (Mr. JL = Jerry Lynn; WCW Sept 1995 - Feb 1996)

### `the-renegade` — The Renegade (WCW)

- **Field:** availability  
- **Current:** WCW starting roster (age 28, contract 60, pop 44)  
- **Recommended:** Convert to a WCW FA arrival ~turn 10 (Renegade's WCW debut: March 1995, with the Uncensored push on Mar 19, 1995)  
- **Category:** Wrong availability date · **Confidence:** High

The Renegade (Richard Wilson) debuted in March 1995 as the Ultimate Warrior knockoff pushed by Hogan. He was not on the roster in January 1995.

*Sources:* Research: WCW_Apr-Jun_1995_Research.md (Renegade debut Mar 1995; Uncensored Mar 19, 1995)

### `waylon-mercy` — Waylon Mercy (WWF)

- **Field:** availability / age  
- **Current:** WWF starting roster (age 37, contract 30, pop 38)  
- **Recommended:** Convert to a WWF FA arrival ~turn 24 (Spivey rejoined the WWF in June 1995; Waylon Mercy's Raw debut: July 3, 1995). Age 37 should be 42 (b. Oct 14, 1952)  
- **Category:** Wrong availability date · **Confidence:** High

Dan Spivey spent January 1995 finishing his All Japan tours; he rejoined the WWF in June 1995 and Waylon Mercy debuted on the July 3, 1995 Raw. He retired in October 1995 - so a short 30-turn-style contract is actually right, but the start date and age are not.

*Sources:* Web: https://en.wikipedia.org/wiki/Dan_Spivey (WWF June 1995; b. Oct 14, 1952; retired Oct 1995); Web: https://puroresusystem.fandom.com/wiki/Dan_Spivey (AJPW tours through 1995)

### `man-mountain-rock` — Man Mountain Rock (WWF)

- **Field:** availability  
- **Current:** WWF starting roster (age 36, contract 30, pop 34)  
- **Recommended:** Convert to a WWF FA arrival ~turn 4-6 (MMR debuted on WWF cards in February 1995)  
- **Category:** Wrong availability date · **Confidence:** High

Tony Atlas' Man Mountain Rock character appeared on WWF house shows and TV tapings from February 1995; he was not on the January 1995 roster.

*Sources:* Web: https://theofficialwrestlingmuseum.com/wwf-live-event-results-1995.html (MMR on Feb 1995 cards)

### `jacob-blu` — The Blu Brothers (WWF)

- **Field:** availability  
- **Current:** Jacob Blu (age 33) and Eli Blu (age 31) both on the WWF starting roster  
- **Recommended:** Convert both to a WWF FA arrival ~turn 8-12 (the Blu Brothers debuted on WWF TV in spring 1995)  
- **Category:** Wrong availability date · **Confidence:** Medium

Ron and Don Harris signed with the WWF in early 1995; the bearded Blu Brothers gimmick first appeared on television in spring 1995, not January 1995. (The TEAMS blu-brothers entry has the same timing issue.)

*Sources:* Research: WWF_Apr-Jun_1995_Research.md (Blu Brothers debut spring 1995)

### `jean-pierre-lafitte` — Jean-Pierre Lafitte (WWF)

- **Field:** availability  
- **Current:** WWF starting roster (age 26, contract 40, pop 38)  
- **Recommended:** Convert to a WWF FA arrival ~turn 12-20 (Carl Ouellet returned to the WWF as the pirate in spring 1995)  
- **Category:** Wrong availability date · **Confidence:** Medium

Ouellet's pirate character debuted on WWF television in spring 1995 (building to the Bret Hart and Kevin Nash programs later that year). He was not on the January 1995 roster.

*Sources:* Research: WWF_Apr-Jun_1995_Research.md (Lafitte debut spring 1995)

### `tom-brandi` — Tom Brandi (WWF)

- **Field:** availability  
- **Current:** WWF starting roster (age 27, contract 40, pop 24)  
- **Recommended:** Remove from the starting roster; optionally add a WWF arrival ~turn 76+ (Brandi's WWF run as Salvatore Sincere began in 1996)  
- **Category:** Wrong availability date · **Confidence:** Medium

Tom Brandi did not join the WWF until 1996 (as Salvatore Sincere). In early 1995 he was working the independents.

*Sources:* Web: https://prowrestling.fandom.com/wiki/Tom_Brandi (WWF 1996-1998 as Salvatore Sincere)

### `vader` — Vader (WCW)

- **Field:** contract  
- **Current:** Contract 150 turns (~end 1997), no noRenew flag  
- **Recommended:** Contract ~35 turns + noRenew (Vader was fired by WCW in August/September 1995; WWF debut at the Jan 1996 Royal Rumble, ~turn 50)  
- **Category:** Major adjustment · **Confidence:** High

Vader's WCW tenure ended abruptly in August/September 1995 (after the Orlando incident and subsequent suspension/release). A 150-turn contract keeps him in WCW into 1997. He signed with the WWF and appeared at the January 1996 Royal Rumble. His in-game age 39 is wrong too: born May 14, 1956 he was 38 (close, leave as-is).

*Sources:* Research: WCW_Jul-Sep_1995_Research.md (Vader suspension/release Aug-Sept 1995); Web: https://en.wikipedia.org/wiki/Big_Van_Vader (WWF debut Royal Rumble, Jan 21, 1996)

### `jeff-jarrett` — Jeff Jarrett (WWF)

- **Field:** contract  
- **Current:** Contract 90 turns + noRenew (~Sept 1996)  
- **Recommended:** Contract ~27 turns (Jarrett left the WWF in July 1995 for the USWA); flag him for a 1996-97 WWF return rather than a long single run  
- **Category:** Major adjustment · **Confidence:** High

Jarrett's 1995 WWF run ended in July 1995 (he left for the USWA after a pay dispute); he returned to the WWF in late 1996. A 90-turn noRenew contract holds him until September 1996, which misrepresents the gap year.

*Sources:* Web: https://en.wikipedia.org/wiki/Jeff_Jarrett (left WWF July 1995 for USWA; returned late 1996)

### `bam-bam-bigelow` — Bam Bam Bigelow (WWF)

- **Field:** contract  
- **Current:** Contract 40 turns + noRenew (~October 1995)  
- **Recommended:** Contract ~43 turns + noRenew (last WWF match: Survivor Series, Nov 19, 1995 - a loss to Goldust); then ECW from early 1996  
- **Category:** Minor adjustment · **Confidence:** High

Bigelow's WWF exit was November 1995 (Survivor Series), not October; he then made ECW appearances from early 1996 (feuding with Taz) before the 1998 WCW move. The game is one turn-month early - a small correction, and an ECW arrival event ~turn 48-52 would complete the chain.

*Sources:* Web: https://prowrestling.fandom.com/wiki/Bam_Bam_Bigelow (last WWF match Survivor Series Nov 19, 1995; ECW early 1996)

### `british-bulldog` — British Bulldog (WWF)

- **Field:** contract  
- **Current:** Contract 120 turns (~July 1997)  
- **Recommended:** Contract ~143 turns (Bulldog jumped to WCW in November/December 1997 alongside Jim Neidhart, after Survivor Series 1997)  
- **Category:** Minor adjustment · **Confidence:** High

Davey Boy Smith remained with the WWF from his 1994 return until the November 1997 Montreal aftermath, appearing in WCW by December 1997. 120 turns has him leave six months early.

*Sources:* Web: https://en.wikipedia.org/wiki/Davey_Boy_Smith (WCW debut Dec 1997)

### `steve-austin` — Steve Austin (WCW)

- **Field:** contract  
- **Current:** Contract 20 turns + noRenew (~June 1995)  
- **Recommended:** Contract ~35 turns + noRenew (Austin was fired by WCW in September 1995; ECW debut Sept 1995; WWF debut Dec 1995/Jan 1996, ~turn 48)  
- **Category:** Major adjustment · **Confidence:** High

Austin was injured in mid-1994 and fired by WCW in September 1995 (phone call from Bischoff while rehabbing). The 20-turn contract has him gone by June 1995 - about three months early. The correct arc: WCW to ~turn 35, ECW through ~turn 47, WWF from ~turn 48.

*Sources:* Web: https://en.wikipedia.org/wiki/Stone_Cold_Steve_Austin (fired from WCW Sept 1995; ECW Sept 1995; WWF Dec 1995)

### `brian-pillman` — Brian Pillman (WCW)

- **Field:** contract  
- **Current:** Contract 56 turns + noRenew (~May 1996)  
- **Recommended:** Contract ~53 turns (Pillman's WCW run ended Feb 11, 1996 - the worked firing that springboarded his ECW appearances Feb-Apr 1996 and his guaranteed WWF deal from June 1996)  
- **Category:** Minor adjustment · **Confidence:** Medium

Pillman's WCW tenure ran to February 1996 (Four Horsemen until Oct 1995, then the Loose Cannon exit); he appeared in ECW February-April 1996 and signed with the WWF in June 1996. The game's 56 turns is three turns (three weeks) late - trim to ~53 (Feb 11, 1996) and the arc lands.

*Sources:* Web: https://www.thesmackdownhotel.com/wrestlers/brian-pillman (WCW to Feb 11, 1996; ECW Feb-Apr 1996; WWF June 10, 1996); Web: https://prowrestlingstories.com/pro-wrestling-stories/brian-pillman-wrestling-legacy/ (WWF contract June 1996)

### `chris-benoit` — Chris Benoit (ECW)

- **Field:** contract  
- **Current:** Contract 28 turns (~July 1995)  
- **Recommended:** Contract ~32-36 turns (Benoit, Guerrero and Malenko left ECW for WCW together in September 1995)  
- **Category:** Minor adjustment · **Confidence:** High

Benoit's ECW run (from August 1994) ended in September 1995 when he, Eddy Guerrero and Dean Malenko jumped to WCW. The 28-turn contract is about a month and a half short.

*Sources:* Web: https://www.imdb.com/name/nm0539357/bio (Benoit, Guerrero and Malenko left for WCW in Sept 1995)

### `dean-malenko` — Dean Malenko (ECW)

- **Field:** contract / availability note  
- **Current:** ECW starter, contract 32 turns (~Sept 1995)  
- **Recommended:** Correct: Malenko left ECW for WCW in September 1995 with Benoit and Guerrero. (Optional polish: his ECW debut was Feb 1995, so a turn-4 arrival would be exact.)  
- **Category:** Correct · **Confidence:** High

Contract length matches the real September 1995 ECW-to-WCW jump. Age 34 is correct (b. 1959/60 - sources differ slightly; within tolerance).

*Sources:* Web: https://www.imdb.com/name/nm0539357/bio (Malenko left ECW for WCW Sept 1995)

### `lex-luger` — Lex Luger (WWF)

- **Field:** contract  
- **Current:** Contract 32 turns + noRenew (~September 1995)  
- **Recommended:** Correct: Luger's WWF deal lapsed in 1995 and he appeared on the very first WCW Monday Nitro (Sept 4, 1995)  
- **Category:** Correct · **Confidence:** High

Textbook contract modelling - his Nitro debut is turn 32 in game terms.

*Sources:* Web: https://en.wikipedia.org/wiki/Lex_Luger (appeared on first Nitro, Sept 4, 1995)

### `diesel` — Diesel (WWF)

- **Field:** contract  
- **Current:** Contract 64 turns + noRenew (~May 1996)  
- **Recommended:** Correct: Nash's last WWF match was April 1996 and he debuted in WCW on the May 27, 1996 Nitro (turn ~65)  
- **Category:** Correct · **Confidence:** High

Accurate within one turn.

*Sources:* Web: https://en.wikipedia.org/wiki/Kevin_Nash (WWF exit Apr 1996; Nitro debut May 27, 1996)

### `razor-ramon` — Razor Ramon (WWF)

- **Field:** contract  
- **Current:** Contract 64 turns + noRenew (~May 1996)  
- **Recommended:** Correct: Hall's last WWF match was April 1996 and he walked onto Nitro on May 27, 1996 (turn ~65)  
- **Category:** Correct · **Confidence:** High

Accurate within one turn. (Age 36 in game; Hall was born Oct 20, 1958, so 36 is exact.)

*Sources:* Web: https://en.wikipedia.org/wiki/Scott_Hall (Nitro debut May 27, 1996)

### `bret-hart` — Bret Hart (WWF)

- **Field:** contract  
- **Current:** Contract 144 turns + noRenew (~Jan 1998)  
- **Recommended:** Correct: Bret left the WWF after Survivor Series 1997 (Nov 9, 1997) and debuted in WCW in December 1997 (turn ~142)  
- **Category:** Correct · **Confidence:** High

Accurate within ~3 turns - and the noRenew flag is exactly the Montreal mechanic.

*Sources:* Web: https://en.wikipedia.org/wiki/Montreal_Screwjob (Nov 9, 1997)

### `one-two-three-kid` — The 1-2-3 Kid (WWF)

- **Field:** contract  
- **Current:** Contract 72 turns + noRenew (~July 1996)  
- **Recommended:** Correct within tolerance: the Kid's WWF run ended in 1996 and he appeared in WCW as Syxx from Sept 1996 (turn ~80)  
- **Category:** Correct · **Confidence:** Medium

Slightly early (72 turns = July 1996 vs a ~Sept 1996 WCW debut), but the noRenew flag and rough window are right.

*Sources:* Web: https://en.wikipedia.org/wiki/Syxx (WCW debut 1996)

### `cactus-jack` — Cactus Jack (ECW)

- **Field:** contract  
- **Current:** Contract 60 turns + noRenew (~Jan 1996)  
- **Recommended:** Correct within tolerance: Foley's ECW farewell came in early 1996 (the Mankind WWF debut followed on Apr 1, 1996, turn ~60)  
- **Category:** Correct · **Confidence:** Medium

The 60-turn window lands between his ECW exit (early 1996) and WWF debut - close enough for the sim.

*Sources:* Web: https://en.wikipedia.org/wiki/Mick_Foley (Mankind debut Apr 1, 1996)

### `alundra-blayze` — Alundra Blayze (WWF)

- **Field:** contract  
- **Current:** Contract 49 turns + noRenew (~Feb 1996)  
- **Recommended:** Correct: Blayze left the WWF in late 1995 and threw the WWF Women's title in the trash on the Dec 18, 1995 Nitro (turn ~46)  
- **Category:** Correct · **Confidence:** High

Excellent modelling - the noRenew flag and 49-turn window bracket the trash-can Nitro moment. (She is the wrong starting Women's champion though - see INITIAL_TITLES: wwf-women.)

*Sources:* Web: https://en.wikipedia.org/wiki/Alundra_Blazey (Nitro Dec 18, 1995)

### `hulk-hogan` — Hulk Hogan (WCW)

- **Field:** align  
- **Current:** heel, pop 97, age 41, contract 240  
- **Recommended:** face at the January 1995 start (red-and-yellow top babyface); heel turn at Bash at the Beach, July 7, 1996 (turn ~72) as the nWo founding moment  
- **Category:** Major adjustment · **Confidence:** High

Hogan entered 1995 as the unquestioned top babyface (the Dungeon of Doom was being built as his foil); his heel turn is THE hinge of the era and should be an event, not the starting state. Pop 97 and age 41 are correct.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Hogan babyface champion); Web: https://en.wikipedia.org/wiki/Bash_at_the_Beach_(1996) (heel turn July 7, 1996)

### `booker-t` — Booker T (WCW)

- **Field:** align  
- **Current:** face (Harlem Heat), age 29, contract 180  
- **Recommended:** heel: Harlem Heat worked heel through 1995-96 (managed by Sister Sherri from early 1995); face turns came later (1997+)  
- **Category:** Minor adjustment · **Confidence:** High

Harlem Heat were heels in the 1995 Dungeon/villain ecosystem, holding the WCW tag titles as heels. The game has Stevie Ray heel but Booker face - they should match.

*Sources:* Research: WCW_1995_Research.md (Harlem Heat heel tag champions)

### `mabel` — Mabel (WWF)

- **Field:** align / age  
- **Current:** heel, age 27, contract 80, pop 40  
- **Recommended:** face at the start: Men on a Mission were babyfaces through early 1995 (Mabel's King of the Ring heel turn came mid-1995). Age ~23 (b. Feb 14, 1971)  
- **Category:** Minor adjustment · **Confidence:** Medium

MOM worked as fun-loving faces in January 1995; the heel turn came with the King Mabel push in mid-1995. Age 27 is about four years high - Nelson Frazier was born February 14, 1971.

*Sources:* Web: https://en.wikipedia.org/wiki/Viscera_(wrestler) (b. Feb 14, 1971; heel turn mid-1995)

### `mo` — Mo (WWF)

- **Field:** align  
- **Current:** heel, age 30, contract 40, pop 33  
- **Recommended:** face at the start (Men on a Mission were babyfaces until mid-1995)  
- **Category:** Minor adjustment · **Confidence:** High

Same MOM timeline as Mabel - faces at the January 1995 start.

*Sources:* Web: https://en.wikipedia.org/wiki/Men_on_a_Mission (face act through early 1995)

### `johnny-b-badd` — Johnny B. Badd (WCW)

- **Field:** age  
- **Current:** 31  
- **Recommended:** 34 (Marc Mero, b. July 9, 1960)  
- **Category:** Minor adjustment · **Confidence:** High

Mero was 34 in January 1995, not 31. Everything else about the entry (WCW face, TV champion level) is right.

*Sources:* Web: https://en.wikipedia.org/wiki/Marc_Mero (b. July 9, 1960)

### `meng` — Meng (WCW)

- **Field:** age  
- **Current:** 31  
- **Recommended:** 35 (Tonga Uliuli Fifita, b. February 1959)  
- **Category:** Minor adjustment · **Confidence:** High

Fifita was born February 1959 (Feb 3 or Feb 10 in sources), making him 35 at the start - turning 36 within the first month of game time. The game's 31 understates him by four-plus years.

*Sources:* Web: https://en.wikipedia.org/wiki/Uliuli_Fifita (b. Feb 10, 1959); Web: https://tvtropes.org/pmwiki/pmwiki.php/Wrestling/Meng (b. Feb 3, 1959)

### `avalanche` — Avalanche (WCW)

- **Field:** age  
- **Current:** 37  
- **Recommended:** 31 (John Tenta, b. June 22, 1963)  
- **Category:** Minor adjustment · **Confidence:** High

Tenta was 31 in January 1995, not 37. (The same correction applies to the duplicate the-shark entry if it is kept.)

*Sources:* Web: https://en.wikipedia.org/wiki/John_Tenta (b. June 22, 1963)

### `big-bubba-rogers` — Big Bubba Rogers (WCW)

- **Field:** identity note / age  
- **Current:** Big Bubba Rogers, heel, age 34  
- **Recommended:** In January 1995 Ray Traylor was working as THE BOSS (WCW's guardian-of-the-front-office babyface; Big Bubba Rogers repackaging came in spring 1995). Age ~31 (b. May 19, 1963)  
- **Category:** Minor adjustment · **Confidence:** Medium

The character name and alignment are anachronistic: Traylor's Boss run (late 1994 - April 1995) was a face gimmick that transitioned into the Dungeon-adjacent Big Bubba heel in spring 1995. A rename event around turn 16-19 (May-June 1995) would capture it. Age 34 should be about 31.

*Sources:* Web: https://prowrestling.fandom.com/wiki/Big_Bubba_Rogers (The Boss 1994-95; Big Bubba from 1995); Research: WCW_Jan-Mar_1995_Research.md

### `marty-jannetty` — Marty Jannetty (WWF)

- **Field:** age  
- **Current:** 35  
- **Recommended:** 34 (b. February 3, 1960 - turns 35 within the first month of game time)  
- **Category:** Minor adjustment · **Confidence:** Medium

A one-year overstatement; effectively cosmetic given his birthday falls on game turn 1.

*Sources:* Web: https://www.thesmackdownhotel.com/wrestlers/marty-jannetty (b. Feb 3, 1960)

### `rocco-rock` — Rocco Rock (ECW)

- **Field:** age  
- **Current:** 32  
- **Recommended:** 41 (b. September 3, 1953)  
- **Category:** Major adjustment · **Confidence:** High

Rocco Rock (Teddy Pettingill) was 41 in January 1995, not 32 - the game appears to have given him his partner's approximate age. The Public Enemy were the reigning ECW World Tag Team champions at the start (see INITIAL_TITLES missing-title finding).

*Sources:* Web: https://en.wikipedia.org/wiki/The_Public_Enemy_(professional_wrestling) (Rocco Rock b. Sept 3, 1953)

### `fatu` — Fatu (WWF)

- **Field:** age  
- **Current:** 24  
- **Recommended:** 29 (b. October 11, 1965)  
- **Category:** Minor adjustment · **Confidence:** High

Fatu (Solofa Fatu Jr.) was 29 in January 1995, not 24.

*Sources:* Web: https://en.wikipedia.org/wiki/Rikishi_(wrestler) (b. Oct 11, 1965)

### `hakushi` — Hakushi (WWF)

- **Field:** age  
- **Current:** 29  
- **Recommended:** 28 (b. December 2, 1966)  
- **Category:** Minor adjustment · **Confidence:** High

Off by one; his January 9, 1995 Raw-area debut timing is otherwise modelled correctly.

*Sources:* Web: https://www.wwe.com/superstars/hakushi; Web: https://puroresusystem.fandom.com/wiki/Jinsei_Shinzaki (b. Dec 2, 1966)

### `adam-bomb` — Adam Bomb (WWF)

- **Field:** age  
- **Current:** 31  
- **Recommended:** 30 (b. March 3, 1964)  
- **Category:** Minor adjustment · **Confidence:** High

Off by one; otherwise a correct WWF mid-card placement (heel Bomb, pre-face turn).

*Sources:* Web: https://en.wikipedia.org/wiki/Bryan_Clark_(wrestler) (b. Mar 3, 1964)

### `rey-mysterio` — Rey Mysterio Jr. (AAA)

- **Field:** age  
- **Current:** 21  
- **Recommended:** 20 (b. December 11, 1974)  
- **Category:** Minor adjustment · **Confidence:** High

Off by one. Note that he held no AAA title in January 1995 (see INITIAL_TITLES: aaa-cruiser).

*Sources:* Web: https://en.wikipedia.org/wiki/Rey_Mysterio (b. Dec 11, 1974)

### `nakanishi` — Manabu Nakanishi (NJPW)

- **Field:** age  
- **Current:** 26  
- **Recommended:** 27 (b. October 3, 1967)  
- **Category:** Minor adjustment · **Confidence:** High

Off by one; otherwise correct (he challenged Hashimoto at Battle 7 on Jan 4, 1995).

*Sources:* Web: https://prowrestling.fandom.com/wiki/Manabu_Nakanishi (b. Oct 3, 1967)

### `duke-droese` — Duke "The Dumpster" Droese (WWF)

- **Field:** age / availability  
- **Current:** WWF starter, age 29  
- **Recommended:** Keep as a WWF starter (correct: Droese joined the WWF roster in 1994) but correct the age to 26 (b. August 20, 1968)  
- **Category:** Minor adjustment · **Confidence:** High

Verification note: Droese debuted with the WWF in 1994 (his Lawler garbage-can feud ran from then), so unlike the other new 1995 WWF characters he is a legitimate January 1995 starter. Only the age is off.

*Sources:* Web: https://charactersdb.com/duke-the-dumpster-droese (WWF debut 1994; b. Aug 20, 1968); Web: https://www.foxsports.com/wwe/duke-droese-superstar-bio (debuted 1994)

### `chris-candido` — Chris Candido (SMW)

- **Field:** age  
- **Current:** 23  
- **Recommended:** 24 (b. March 21, 1970) - and he is the reigning NWA World Heavyweight Champion at the start (see INITIAL_TITLES: nwa-world)  
- **Category:** Minor adjustment · **Confidence:** High

Off by one. His SMW placement is correct; the game is missing his championship status, which is one of the highest-impact title fixes in this audit.

*Sources:* Web: https://en.wikipedia.org/wiki/Chris_Candido (b. Mar 21, 1970; NWA World champion Nov 19, 1994 - Feb 24, 1995)

### `stevie-ray` — Stevie Ray (WCW)

- **Field:** age  
- **Current:** 36  
- **Recommended:** ~31-32 (Lane Huffman, b. 1963 per most sources) - verify DOB before changing  
- **Category:** Needs manual review · **Confidence:** Low

The game age of 36 appears 4-5 years high (Booker T, his younger brother, was born March 1, 1965). Public DOB sources for Stevie Ray are inconsistent; recommend confirming before import.

*Sources:* Web: https://en.wikipedia.org/wiki/Stevie_Ray (birth year varies across sources)

### `hack-meyers` — Hack Meyers (ECW)

- **Field:** age  
- **Current:** 34  
- **Recommended:** ~21 (b. June 30, 1973) - verify DOB before changing  
- **Category:** Needs manual review · **Confidence:** Low

The game age of 34 is roughly 13 years high: Meyers was an ECW young lion in 1995 (he died in 2020 aged 46). Confirm the DOB before import.

*Sources:* Web: https://prowrestling.fandom.com/wiki/Hack_Meyers (b. 1973; d. 2020)

### `johnny-grunge` — Johnny Grunge (ECW)

- **Field:** age  
- **Current:** 31  
- **Recommended:** ~29 (b. 1965/66) - verify DOB before changing  
- **Category:** Needs manual review · **Confidence:** Low

Grunge (Mike Durham) was about 29 in January 1995; sources give 1965 or 1966. Marked for verification rather than a silent change.

*Sources:* Web: https://en.wikipedia.org/wiki/The_Public_Enemy_(professional_wrestling) (Grunge b. 1965/66)

### `MISSING-dave-sullivan` — Dave Sullivan

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to WCW: face, the dyslexic "brother" of Kevin Sullivan, an active January 1995 WCW mid-carder (age ~30; feud with Kevin Sullivan/Dungeon of Doom)  
- **Category:** Missing · **Confidence:** High

Dave Sullivan was a regular on WCW TV in January 1995 (the Sullivan brothers angle ran through 1994-95). Suggested starter stats are estimates - tune to taste; the identity/company/alignment facts are verified.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Dave Sullivan on cards; Sullivan feud)

### `MISSING-paul-roma` — Paul Roma

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to WCW: heel mid-carder (Pretty Wonderful ran 1993-94; Roma remained under WCW contract into 1995), age ~35  
- **Category:** Missing · **Confidence:** High

Roma was a WCW roster member in January 1995. (His Pretty Wonderful partner Paul Orndorff is already in the game.)

*Sources:* Research: WCW_Jan-Mar_1995_Research.md

### `MISSING-the-roadie` — The Roadie

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to WWF: heel, Jeff Jarrett's roadie (debuting with Jarrett's WWF return in early 1995; Double J's "With My Baby Tonight" angle ran through mid-1995), age ~26  
- **Category:** Missing · **Confidence:** High

The Roadie (Jeff Jarrett's sidekick, later Road Dogg) was part of the WWF's early-1995 Jarrett act. He pairs naturally with the corrected Jarrett contract arc.

*Sources:* Web: https://en.wikipedia.org/wiki/Road_Dogg (Roadie debut with Jarrett, 1994-95 WWF run)

### `MISSING-ron-simmons` — Ron Simmons

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to ECW: Ron Simmons appeared in ECW in early 1995 (a short run before his WWF return as Faarooq in 1996)  
- **Category:** Missing · **Confidence:** Medium

Simmons worked ECW in the first half of 1995 after leaving WCW (1994). An ECW roster entry (or short FA stint) covers the gap.

*Sources:* Research: ECW_1995_Research.md (Simmons on 1995 ECW cards)

### `MISSING-tully-blanchard` — Tully Blanchard

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to ECW: Blanchard worked ECW dates in late 1994/early 1995 (his last major-promotion run)  
- **Category:** Missing · **Confidence:** Medium

The WWF/WCW veteran was on ECW cards around the start date; a short-contract entry preserves him for old-timer angles. Deep-cut entry - spot-verify before import.

*Sources:* Research: ECW_1995_Research.md

### `MISSING-gangstas-smw` — The Gangstas (New Jack & Mustapha Saed)

- **Field:** roster entries  
- **Current:** Not on the roster  
- **Recommended:** Add both to SMW (heels): the Gangstas debuted in SMW in early 1995 and instantly feuded with the Rock 'n' Roll Express - the highest-profile SMW act of 1995  
- **Category:** Missing · **Confidence:** High

The Gangstas were the defining SMW heel act of 1995 (their R&R Express feud was SMW's hottest program of the year). The game has SMW representation (Dirty White Boy, Landel, Bodies, Candido) but not its top heels.

*Sources:* Research: SMW_1995_Research.md (Gangstas debut 1995; feud with R&R Express)

### `MISSING-boo-bradley` — Boo Bradley

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to SMW: mid-carder active on January 1995 SMW cards  
- **Category:** Missing · **Confidence:** Medium

Boo Bradley was a regular SMW preliminary/mid-card worker in the period (the "Boo" dog angle was memorably ended by the Bullet).

*Sources:* Web: https://blogofdoom.com/ (SMW TV Jan 1995 - Boo Bradley on cards)

### `MISSING-d-lo-brown` — D-Lo Brown

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to SMW as enhancement/young talent (D-Lo worked SMW undercard dates in 1995 before his WWF run)  
- **Category:** Missing · **Confidence:** Medium

Accurate to the user's "comprehensive, including enhancement talent" scope; he was a SMW preliminary worker in 1995. Low stats appropriate.

*Sources:* Research: SMW_1995_Research.md

### `MISSING-al-snow` — Al Snow

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to SMW (he worked SMW in 1995 after his 1994 WWF release, before ECW)  
- **Category:** Missing · **Confidence:** Medium

Snow passed through SMW in 1995 (and to ECW later the same year); a short SMW entry bridges him to the late-90s Head era.

*Sources:* Web: https://en.wikipedia.org/wiki/Al_Snow (SMW 1995)

### `MISSING-unabomb` — Unabomb

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to SMW: Unabomb (Glen Jacobs) was tearing up SMW in 1995 (feuding with Tracy Smothers); he is the same person as the later Isaac Yankem FA entry and eventually Kane  
- **Category:** Missing · **Confidence:** High

The game books Isaac Yankem as a July 1995 WWF arrival, but Glen Jacobs' 1995 arc is SMW Unabomb -> WWF Isaac Yankem -> 1997+ Kane. An SMW Unabomb entry completes one of the game's own storyline chains.

*Sources:* Web: https://en.wikipedia.org/wiki/Kane_(wrestler) (Unabomb in SMW 1995; Yankem 1995-96)

### `MISSING-hiroshi-hase` — Hiroshi Hase

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to NJPW (age 33): one half of the reigning IWGP Tag Team champions with Keiji Muto (Nov 25, 1994 - May 6, 1995; retained vs the Steiners at Battle 7 on Jan 4, 1995)  
- **Category:** Missing · **Confidence:** High

Required for the corrected njpw-tag title holder (see INITIAL_TITLES). Hase was a top NJPW star of the period.

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Hase & Mutoh (c) def. Steiners, Jan 4, 1995)

### `MISSING-norio-honaga` — Norio Honaga

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to NJPW (age ~35): the reigning IWGP Junior Heavyweight champion (retained vs The Great Sasuke at Battle 7, Jan 4, 1995)  
- **Category:** Missing · **Confidence:** High

Required for the corrected njpw-junior title holder (see INITIAL_TITLES). The game currently gives Liger a belt he did not hold at the date.

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Honaga (c) def. Sasuke)

### `MISSING-akira-hokuto` — Akira Hokuto

- **Field:** roster entry  
- **Current:** Not on the roster  
- **Recommended:** Add to AJW (age ~28): top joshi star of the era; later the first WCW Women's champion (Nov 1996) and a Women's Cruiserweight champion in WCW  
- **Category:** Missing · **Confidence:** High

Hokuto is arguably the biggest joshi omission - she was AJW's ace-level attraction in 1995 and crossed over to WCW in 1996, which the game's women's division would benefit from.

*Sources:* Web: https://en.wikipedia.org/wiki/Akira_Hokuto (AJW star; first WCW Women's champion 1996)

### `MISSING-roddy-piper` — "Rowdy" Roddy Piper

- **Field:** FA arrival  
- **Current:** Not in FA_ARRIVALS  
- **Recommended:** Add a WCW FA arrival ~turn 87 (Piper appeared at Halloween Havoc on Oct 27, 1996 to set up the Hogan vs Piper Starrcade '96 main event)  
- **Category:** Missing · **Confidence:** High

Piper's WCW debut is a marquee 1996 moment; he headlined Starrcade '96 (Dec 29, 1996) against Hogan.

*Sources:* Web: https://en.wikipedia.org/wiki/Halloween_Havoc_(1996) (Piper's WCW appearance, Oct 27, 1996)

### `MISSING-ultimate-warrior` — The Ultimate Warrior

- **Field:** FA arrival  
- **Current:** Not in FA_ARRIVALS  
- **Recommended:** Add a WCW FA arrival ~turn 174 (Warrior returned Aug 17, 1998 to feud with Hogan; match at Halloween Havoc, Oct 25, 1998)  
- **Category:** Missing · **Confidence:** High

The Warrior's 1998 WCW return is a well-known late-era event; a short-contract arrival models it.

*Sources:* Web: https://en.wikipedia.org/wiki/Ultimate_Warrior (WCW return Aug-Sept 1998; Halloween Havoc 98)

### `MISSING-curt-hennig` — Curt Hennig

- **Field:** FA arrival  
- **Current:** Not in FA_ARRIVALS  
- **Recommended:** Add a WCW FA arrival ~turn 129 (Hennig signed with WCW in 1997, debuting with the Four Horsemen and turning on Ric Flair at Fall Brawl, Sept 14, 1997)  
- **Category:** Missing · **Confidence:** High

Hennig's 1997 WCW run was a top-line nWo-adjacent act (US champion; the Flair turn at Fall Brawl 97).

*Sources:* Web: https://en.wikipedia.org/wiki/Curt_Hennig (WCW debut 1997; Fall Brawl Sept 14, 1997)

### `paul-orndorff` — Paul Orndorff (WCW)

- **Field:** active-roster status  
- **Current:** WCW starter, age 45, face, contract 60, pop 44  
- **Recommended:** Consider a semi-active/agent flag: Orndorff wrestled a reduced WCW schedule in 1995 (mainly weekend shows) before transitioning to a backstage/Power Plant role  
- **Category:** Needs manual review · **Confidence:** Medium

Not an error - the entry is defensible (he was still on the roster). The nuance is how active he should be. Age 45 is correct.

*Sources:* Web: https://en.wikipedia.org/wiki/Paul_Orndorff (semi-active 1995; Power Plant trainer)

### `jumbo-tsuruta` — Jumbo Tsuruta (AJPW)

- **Field:** active-roster status  
- **Current:** AJPW starter, age 43, face, contract 60, pop 58  
- **Recommended:** Consider semi-active/retired status: Tsuruta's in-ring career effectively ended in the early 1990s (hepatitis); he held an office role in AJPW from 1993 and died in May 2000  
- **Category:** Needs manual review · **Confidence:** Medium

Tsuruta remained an AJPW executive but was not an active 1995 wrestler. Whether to keep him bookable is a design decision; flagging so the choice is explicit.

*Sources:* Web: https://en.wikipedia.org/wiki/Jumbo_Tsuruta (career ended early 1990s; AJPW office role)

### `blue-panther` — Blue Panther (AAA)

- **Field:** company  
- **Current:** AAA starter, age 34, face, contract 100  
- **Recommended:** Verify placement: Blue Panther was primarily a CMLL worker in this era (his AAA run came later); consider moving to CMLL  
- **Category:** Needs manual review · **Confidence:** Low

Luchador company assignments in 1995 are genuinely tangled (raid-era jumping). My sources suggest Panther was CMLL in 1995, but I could not pin a definitive January 1995 card placement - flagging rather than asserting.

*Sources:* Web: https://www.luchawiki.org/ (Blue Panther career chronology)

### `electroshock` — Electroshock (AAA)

- **Field:** availability  
- **Current:** AAA starter, age 25, heel, contract 80  
- **Recommended:** Verify availability: Electroshock's AAA run appears to begin in 1996-97, not January 1995  
- **Category:** Needs manual review · **Confidence:** Low

Could not confirm Electroshock on AAA cards in early 1995. Recommend verifying against AAA 1995 lineups before keeping him as a starter.

*Sources:* Web: https://www.luchawiki.org/ (Electroshock career chronology)

### `abismo-negro` — Abismo Negro (AAA)

- **Field:** availability  
- **Current:** AAA starter, age 24, heel, contract 80  
- **Recommended:** Verify availability: Abismo Negro's AAA run appears to begin in 1995-96 (not January 1995)  
- **Category:** Needs manual review · **Confidence:** Low

Same caveat as Electroshock - the character may post-date the start date. Verify against AAA 1995 lineups.

*Sources:* Web: https://www.luchawiki.org/ (Abismo Negro career chronology)

### `gedo` — Gedo (FMW)

- **Field:** company  
- **Current:** FMW starter, age 26, heel, contract 80  
- **Recommended:** Verify placement: Gedo (and Jado) were working WAR and New Japan junior dates in 1995, not FMW  
- **Category:** Needs manual review · **Confidence:** Low

The Gedo/Jado team's mid-90s home was WAR (with NJPW junior crossover shots); FMW placement looks off, but I could not pin their exact January 1995 bookings - flagging for verification.

*Sources:* Web: https://puroresusystem.fandom.com/wiki/Gedo (career chronology)

### `jado` — Jado (FMW)

- **Field:** company  
- **Current:** FMW starter, age 25, heel, contract 80  
- **Recommended:** Verify placement (see the Gedo finding: WAR/NJPW association in 1995, not FMW)  
- **Category:** Needs manual review · **Confidence:** Low

See Gedo.

*Sources:* Web: https://puroresusystem.fandom.com/wiki/Jado (career chronology)

### `missy-hyatt` — Missy Hyatt (WCW manager)

- **Field:** company / availability  
- **Current:** WCW manager on the starting roster  
- **Recommended:** Remove from the WCW start (she left WCW in February 1994); optionally add an ECW manager arrival ~turn 47 (ECW debut Dec 29, 1995)  
- **Category:** Wrong company · **Confidence:** High

Hyatt was not under WCW contract in January 1994, let alone 1995 - she had left in February 1994 and worked independents (including a short ECW run) before her ECW return in late 1995.

*Sources:* Web: https://en.wikipedia.org/wiki/Missy_Hyatt (left WCW Feb 26, 1994; ECW debut Dec 29, 1995)

### `samu` — Samu (WWF)

- **Field:** roster membership / team note  
- **Current:** WWF starting roster alongside Fatu; TEAMS has headshrinkers = fatu + samu  
- **Recommended:** Keep but verify the exact transition date: Samu exited the WWF around the start date and the active January 1995 team was the New Headshrinkers (Fatu + Sionne, booked on Jan 6, 1995 house shows)  
- **Category:** Needs manual review · **Confidence:** Medium

Samu was on his way out as the game begins - the New Headshrinkers with Sionne were already being booked in early January 1995. Either a very short Samu contract or a Sionne-for-Samu team swap in the first month models it; the exact handover date needs a house-show check before changing the data.

*Sources:* Web: https://wwfoldschool.com/wwf-action-zone-1995 (New Headshrinkers on Jan 1995 cards)

### `mascara-sagrada` — Máscara Sagrada (AAA)

- **Field:** company  
- **Current:** AAA starter, face  
- **Recommended:** Verify placement: Máscara Sagrada was primarily a CMLL técnico in this era (his AAA run came later)  
- **Category:** Needs manual review · **Confidence:** Low

Same raid-era ambiguity as Blue Panther - my sources point to CMLL for January 1995, but I could not pin a definitive card placement. Flagging rather than asserting.

*Sources:* Web: https://www.luchawiki.org/ (Máscara Sagrada career chronology)

### `ric-flair` — Ric Flair

- **Field:** roster status  
- **Current:** Active WCW wrestler at start (heel, pop 86, age 45, contract 150)  
- **Recommended:** Keep, but consider a "storyline retired" state until ~turn 7: Flair lost a retirement match to Hulk Hogan at Halloween Havoc 94 (Oct 23, 1994) and was reinstated in late February/March 1995 (returning to cost Hogan the title at SuperBrawl V)  
- **Category:** Minor adjustment · **Confidence:** High

Flair's on-screen status in January 1995 was "retired" following the Halloween Havoc 94 loser-retires match. Having him active is a reasonable simplification, but a reinstatement beat in February/March 1995 would match history. Alignment (heel), age 45, mic 96 and contract 150 are all sound.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Flair reinstatement, SuperBrawl V interference)

### `jerry-lawler` — Jerry Lawler

- **Field:** roster note  
- **Current:** WWF wrestler/announcer at start (heel)  
- **Recommended:** Keep as-is (correct): Lawler was under WWF contract in January 1995 while still working Memphis (USWA) - he beat Sid for the USWA Unified title on Feb 6, 1995  
- **Category:** Correct · **Confidence:** High

Correct placement. Optional flavour: his USWA moonlighting (winning the Unified title from Sid in February 1995) pairs with the Sid wrong-company fix.

*Sources:* Web: https://www.whenitwascool.com/history-of-wrestling-1995 (Lawler def. Sid, Feb 6, 1995)

## 4. FA_ARRIVALS — the 23 scripted future arrivals

Full turn-to-date conversion for all 23 entries is in section 9.

### `road-warrior-hawk` — Road Warrior Hawk

- **Field:** arrival turn  
- **Current:** turn 52 (Feb 1996), tagged as "one half of the legendary Road Warriors", interest WCW  
- **Recommended:** Hawk returns to WCW ~turn 17-19 (May 1995) as a singles wrestler (helped Sting vs Meng & Kurasawa; kayfabe arm injury Aug 1995); the Road Warriors reunion stays at turn ~52-53 (SuperBrawl VI, Feb 11, 1996)  
- **Category:** Wrong availability date · **Confidence:** High

Hawk reappeared in WCW in May 1995 as a singles act (feud with Meng/Kurasawa storyline; the Kurasawa arm-break angle was written to give him time off). He returned in January 1996 and the Road Warriors reformed for SuperBrawl VI (Feb 11, 1996). Animal's Feb 1996 arrival is correct; Hawk's should be ~9 months earlier.

*Sources:* Web: https://en.wikipedia.org/wiki/Road_Warrior_Hawk (reappeared in WCW May 1995; Warriors reformed Jan-Feb 1996); Web: https://bwwe.fandom.com/wiki/Hawk (Hawk returned January 1996, brought Animal back); Research: WCW_Jan-Mar_1996_Research.md (Road Warriors at SuperBrawl VI)

### `road-warrior-animal` — Road Warrior Animal

- **Field:** arrival turn  
- **Current:** turn 52 (Feb 1996), interest WCW  
- **Recommended:** Keep as-is (correct); optionally model his 1995 back-injury layoff  
- **Category:** Correct · **Confidence:** High

Animal returned alongside Hawk at SuperBrawl VI (Feb 11, 1996) after a long back-injury layoff. Turn 52 = Feb 1996 W1, an accurate placement.

*Sources:* Research: WCW_Jan-Mar_1996_Research.md

### `scott-steiner` — Scott Steiner

- **Field:** arrival turn + note  
- **Current:** turn 60 (Apr 1996), note "returning from a run in the independents", interest WCW  
- **Recommended:** turn ~52-53 (SuperBrawl VI, Feb 11, 1996); note should read "from New Japan": the Steiners were NJPW-based in 1995 (IWGP tag challengers at Battle 7, Jan 4, 1995) with ECW guest shots  
- **Category:** Minor adjustment · **Confidence:** High

The Steiners signed with WCW in early 1996 and debuted at SuperBrawl VI (Feb 11, 1996) - the game is ~2 months late. The "independents" note is wrong: through 1995 they were working New Japan (they challenged Hase & Muto for the IWGP tag titles on Jan 4, 1995) with brief ECW appearances.

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Jan 4, 1995: Hase & Mutoh (c) def. Steiner Brothers); Research: WCW_Jan-Mar_1996_Research.md (Steiners debut at SuperBrawl VI)

### `rick-steiner` — Rick Steiner

- **Field:** arrival turn + note  
- **Current:** turn 60 (Apr 1996), interest WCW  
- **Recommended:** turn ~52-53 (Feb 1996); see scott-steiner finding  
- **Category:** Minor adjustment · **Confidence:** High

See scott-steiner finding: SuperBrawl VI (Feb 11, 1996) debut, NJPW-based through 1995.

*Sources:* See scott-steiner finding

### `chris-jericho` — Chris Jericho

- **Field:** arrival turn  
- **Current:** turn 72 (July 1996), interest ANY  
- **Recommended:** ECW arrival ~turn 52 (ECW debut early 1996); WCW signing ~turn 78 (WCW debut Aug 20, 1996, defeating Mr. JL)  
- **Category:** Wrong availability date · **Confidence:** High

Jericho's ECW run began in early 1996 (he was ECW Television Champion June-July 1996) and he debuted for WCW on Aug 20, 1996 (taped for the Aug 31 WCW Saturday Night; his first match was against Mr. JL). A single July 1996 "ANY interest" arrival is 6+ months late for ECW and a month early for WCW.

*Sources:* Web: https://en.wikipedia.org/wiki/Chris_Jericho (WCW debut Aug 20, 1996 by defeating Mr. JL); Research: ECW_1996_Q1-Q3_Research.md (Jericho ECW TV champion June 22, 1996)

### `rob-van-dam` — Rob Van Dam

- **Field:** arrival turn  
- **Current:** turn 72 (July 1996), interest ANY  
- **Recommended:** ECW arrival ~turn 48 (debut at House Party, Jan 5, 1996, defeating Axl Rotten)  
- **Category:** Wrong availability date · **Confidence:** High

RVD signed with ECW in January 1996 and debuted at House Party on Jan 5, 1996. The July 1996 arrival is 6 months late. (He also worked brief WWF enhancement shots in 1996-97, but ECW is the correct first landing.)

*Sources:* Web: https://en.wikipedia.org/wiki/House_Party_(1996) (RVD ECW debut Jan 5, 1996); Web: https://prowrestling.fandom.com/wiki/Rob_Van_Dam (signed January 1996)

### `the-rock` — Rocky Maivia

- **Field:** arrival turn  
- **Current:** turn 88 (Nov 1996 W1), interest WWF  
- **Recommended:** Keep as-is (correct): Survivor Series Nov 17, 1996 debut  
- **Category:** Correct · **Confidence:** High

Rocky Maivia debuted at Survivor Series 96 (Nov 17, 1996). Turn 88 = November 1996 W1 - accurate.

*Sources:* Research: WWF_Oct-Dec_1996_Research.md (Rocky Maivia debut, Survivor Series 96)

### `ken-shamrock` — Ken Shamrock

- **Field:** arrival turn  
- **Current:** turn 116 (June 1997), interest WWF  
- **Recommended:** turn ~101-107 (Feb-Mar 1997): first WWF appearances around In Your House 13: Final Four (Feb 16, 1997); special referee at WrestleMania 13 (Mar 23, 1997)  
- **Category:** Wrong availability date · **Confidence:** Medium

Shamrock's WWF arrival was February 1997 (Final Four era), not June 1997 - roughly 3-4 months late in the game.

*Sources:* Research: WWF_Jan-Mar_1997_Research.md (Shamrock WWF arrival, IYH: Final Four / WrestleMania 13 referee)

### `val-venis` — Val Venis

- **Field:** arrival turn  
- **Current:** turn 132 (Oct 1997), interest WWF  
- **Recommended:** turn ~163 (May 1998): Val Venis debuted in the WWF in mid-1998  
- **Category:** Wrong availability date · **Confidence:** High

Sean Morley debuted as Val Venis in the WWF around May 1998 (first TV matches May 1998; first PPV SummerSlam 98 era). The October 1997 arrival is ~7 months early - at that time Morley was working Mexico (CMLL as Steel).

*Sources:* Auditor knowledge (career chronology): Val Venis WWF debut May 1998; no WWF TV appearances in 1997

### `kane` — Kane

- **Field:** arrival turn  
- **Current:** turn 140 (Dec 1997), interest WWF  
- **Recommended:** turn ~132 (Oct 1997): Kane debuted at Badd Blood, Oct 5, 1997  
- **Category:** Wrong availability date · **Confidence:** High

Kane's debut was the first-ever Hell in a Cell main event at Badd Blood (Oct 5, 1997), ripping the Cell door off to attack the Undertaker. December 1997 is 10 weeks late.

*Sources:* Research: WWF_Oct-Dec_1997_Research.md (Kane debut Badd Blood, Oct 5, 1997)

### `bill-goldberg` — Bill Goldberg

- **Field:** arrival turn  
- **Current:** turn 160 (May 1998), interest WCW, note "training at the Power Plant"  
- **Recommended:** turn ~131 (Sept 1997): TV debut on Nitro Sept 22, 1997 (dark matches from June 1997)  
- **Category:** Wrong availability date · **Confidence:** High

Goldberg's televised WCW debut was Sept 22, 1997 (Nitro, vs. Hugh Morrus); he had been working dark matches since June 1997. The May 1998 arrival is ~7 months late - it would place the game's Goldberg debut around the US title reign instead of the 173-0 streak. The "training at the Power Plant" note fits a Sept 1997 arrival well.

*Sources:* Research: WCW_Jul-Sep_1997_Research.md (Goldberg TV debut Sept 22, 1997)

### `scotty-riggs` — Scotty Riggs

- **Field:** arrival turn  
- **Current:** turn 16 (May 1995), interest ANY  
- **Recommended:** Verify: Riggs' WCW signing date is unconfirmed; the American Males team formed ~Aug-Sept 1995  
- **Category:** Needs manual review · **Confidence:** Low

No reliable source found for Riggs joining WCW in May 1995. The American Males formed in the second half of 1995 (they won the WCW tag titles in the autumn). Also note the internal inconsistency: the game's TEAMS list already has american-males as a STARTING WCW team while Riggs himself is a May 1995 arrival.

*Sources:* Auditor note: needs verification

### `isaac-yankem` — Isaac Yankem, DDS

- **Field:** arrival turn  
- **Current:** turn 24 (July 1995), interest WWF  
- **Recommended:** Keep as-is (acceptable): Yankem debuted on WWF TV in August 1995 (Lawler's dentist)  
- **Category:** Correct · **Confidence:** High

Isaac Yankem first appeared in mid-1995 (vignettes/first matches July-August 1995, first big program vs Bret Hart from Aug 1995). Turn 24 (July 1995) is a good match. See the isaac-yankem roster finding for the missing SMW "Unabomb" phase.

*Sources:* Research: WWF_Jul-Sep_1995_Research.md (Yankem debut)

### `bertha-faye` — Bertha Faye

- **Field:** arrival turn  
- **Current:** turn 32 (Sept 1995 W1), interest WWF  
- **Recommended:** Keep as-is (correct): Bertha Faye debuted around SummerSlam 95 (Aug 27, 1995)  
- **Category:** Correct · **Confidence:** High

Bertha Faye (Rhonda Singh) arrived in mid-1995 and beat Alundra Blayze for the Women's title at SummerSlam (Aug 27, 1995). Turn 32 = September 1995 W1, within a fortnight.

*Sources:* Research: WWF_Jul-Sep_1995_Research.md (Bertha Faye debut/Women's title win)

### `dean-douglas` — Dean Douglas

- **Field:** arrival turn + identity  
- **Current:** turn 40 (Nov 1995), interest WWF, separate wrestler (age 36, ceiling 58)  
- **Recommended:** Remove as a separate person (duplicate of shane-douglas): script Shane Douglas's WWF signing ~turn 27 (vignettes July 29, 1995; IC title Oct 22, 1995)  
- **Category:** Should be removed · **Confidence:** High

Dean Douglas IS Shane Douglas, who correctly starts on the ECW roster as World Champion. Because both entries exist, the same person appears twice. Historically Douglas left ECW in July 1995 and his WWF run ran to early 1996 (returning to ECW at House Party, Jan 5-6, 1996). See the shane-douglas roster finding for the full fix.

*Sources:* Web: https://www.wikiwand.com/en/Shane_Douglas (first appearance as Dean Douglas July 29, 1995; ECW return Jan 1996)

### `the-giant` — The Giant

- **Field:** arrival turn  
- **Current:** turn 40 (Nov 1995 W1), interest WCW, note "arrives at World War 3"  
- **Recommended:** Keep as-is (acceptable); first appearance was actually earlier: Sept 18, 1995 Nitro, in-ring debut Halloween Havoc (Oct 29, 1995)  
- **Category:** Correct · **Confidence:** High

The Giant first appeared in September 1995 and had his first match at Halloween Havoc (Oct 29, 1995); he won the World title from Hogan via DQ at World War 3 (Nov 19, 1995), which the note references. Turn 40 (Nov 1995 W1) is acceptable, though turn ~38-39 would nail the debut.

*Sources:* Research: WCW_Oct-Dec_1995_Research.md (Giant debut Halloween Havoc, title win at WW3)

### `dances-with-dudley` — Dances With Dudley

- **Field:** arrival turn  
- **Current:** turn 40 (Nov 1995), interest ECW  
- **Recommended:** turn ~24 (July 1995): the Dudley family debuted in ECW on July 1, 1995  
- **Category:** Wrong availability date · **Confidence:** High

Dances With Dudley was one of the original Dudleys who debuted in ECW in July 1995 (Buh Buh Ray Dudley followed). The November 1995 arrival is ~4 months late.

*Sources:* Research: ECW_1995_Q3_Research.md (Dudley family debut July 1, 1995)

### `sable` — Sable

- **Field:** arrival turn  
- **Current:** turn 84 (Oct 1996), interest WWF  
- **Recommended:** turn ~59 (March 1996): Sable debuted at WrestleMania XII (Mar 31, 1996)  
- **Category:** Wrong availability date · **Confidence:** High

Sable (Rena Mero) debuted as Triple H's valet at WrestleMania XII on March 31, 1996. The October 1996 arrival is ~7 months late.

*Sources:* Research: WWF_Jan-Mar_1996_Research.md (Sable debut WrestleMania XII)

### `jacqueline` — Jacqueline

- **Field:** arrival turn  
- **Current:** turn 96 (Jan 1997), interest ANY  
- **Recommended:** turn ~164 (June 1998): Jacqueline debuted in the WWF in mid-1998; in Jan 1997 she was Miss Texas in the USWA  
- **Category:** Wrong availability date · **Confidence:** High

Jacqueline (Jacqueline Moore) joined the WWF in 1998 (debut on the June 1998 TV; won the relaunched Women's title in Sept 1998, first champion of the revival). In January 1997 she was working Memphis/USWA as Miss Texas. The January 1997 arrival is ~17 months early.

*Sources:* Research: WWF_Apr-Jun_1998_Research.md (Jacqueline WWF debut); Auditor knowledge: Miss Texas in USWA 1996-97

### `chyna` — Chyna

- **Field:** arrival turn  
- **Current:** turn 100 (Feb 1997 W1), interest WWF  
- **Recommended:** Keep as-is (correct): Chyna debuted in early 1997 as Triple H's bodyguard  
- **Category:** Correct · **Confidence:** High

Chyna appeared in the WWF in early 1997 (widely dated to the In Your House: Final Four period, Feb 1997, and prominent from WrestleMania 13). Turn 100 = Feb 1997 W1 - accurate.

*Sources:* Research: WWF_Jan-Mar_1997_Research.md (Chyna debut)

### `lita` — Lita

- **Field:** arrival turn  
- **Current:** turn 200 (Mar 1999), interest ANY  
- **Recommended:** turn ~210 for ECW (Miss Congeniality, mid-1999) or turn ~245 for the WWF (Essa Rios valet debut Feb 8, 2000)  
- **Category:** Wrong availability date · **Confidence:** High

Amy Dumas appeared in ECW as Miss Congeniality in 1999 before debuting in the WWF as Lita in February 2000 (with Essa Rios). The March 1999 "ANY interest" arrival is ~9-11 months early for either landing.

*Sources:* Research: ECW_1999_Research.md (Miss Congeniality); WWF_Jan-Mar_2000_Research.md (Lita debut Feb 2000)

### `trish-stratus` — Trish Stratus

- **Field:** arrival turn  
- **Current:** turn 260 (June 2000 W1), interest WWF  
- **Recommended:** turn ~254 (March 2000): Trish debuted on WWF TV on March 19, 2000  
- **Category:** Minor adjustment · **Confidence:** High

Trish Stratus's first TV appearance was March 19, 2000 (managing Test & Prince Albert). The game is ~2-3 weeks late - close enough to keep with a small nudge.

*Sources:* Research: WWF_Jan-Mar_2000_Research.md (Trish debut March 19, 2000)

### `ahmed-johnson` — Ahmed Johnson

- **Field:** arrival turn  
- **Current:** turn 52 (Feb 1996), interest WWF  
- **Recommended:** Keep as-is (acceptable): Johnson was in the WWF by late 1995/early 1996 (he held the USWA Unified title in Nov 1995 during the WWF-USWA relationship)  
- **Category:** Correct · **Confidence:** Medium

Ahmed Johnson signed with the WWF in late 1995 (while USWA Unified Champion, Nov 6, 1995) and appeared on WWF TV around the turn of 1996. Turn 52 (Feb 1996) is within a couple of months.

*Sources:* Web: https://www.whenitwascool.com/history-of-wrestling-1995 (Ahmed Johnson pinned Lawler for USWA Unified title, Nov 6, 1995)

## 5. TEAMS

### `faces-of-fear` — Faces of Fear

- **Field:** members  
- **Current:** meng + kevin-sullivan (starting WCW team)  
- **Recommended:** Faces of Fear = meng + sione (The Barbarian), formed Jan 29, 1996 (turn ~51); for the January 1995 start, Sullivan's ally was The Butcher (Sullivan & The Butcher main-evented Clash XXX vs Hogan/Savage)  
- **Category:** Major adjustment · **Confidence:** High

The "Faces of Fear" name belongs to Meng & The Barbarian, a Dungeon of Doom team formed on the Jan 29, 1996 Nitro (they lost to the returning Road Warriors). Kevin Sullivan and Meng were both Dungeon-aligned in January 1995 but were never a named team; Sullivan's regular tag partner then was The Butcher (Ed Leslie).

*Sources:* Web: https://peoplepill.com/i/sione-vailahi (Faces of Fear with Haku/Meng formed Jan 29, 1996 Nitro); Research: WCW_Jan-Mar_1995_Research.md (Sullivan & The Butcher vs Hogan & Savage, Clash XXX)

### `american-males` — The American Males

- **Field:** starting team  
- **Current:** Starting WCW team (bagwell + riggs)  
- **Recommended:** Remove from starting teams; form the team ~turn 33 (Aug-Sept 1995)  
- **Category:** Wrong availability date · **Confidence:** High

The American Males formed in the second half of 1995 (they won the WCW tag titles from Harlem Heat on the Sept 22, 1995 Pro/TV tapings). Not a January 1995 team - and internally inconsistent with Scotty Riggs being a May 1995 FA arrival.

*Sources:* Auditor knowledge: American Males formed fall 1995 (brief tag title reign); Research: WCW_Jul-Sep_1995_Research.md

### `new-foundation` — The New Foundation

- **Field:** members  
- **Current:** owen-hart + marty-jannetty (starting WWF team)  
- **Recommended:** Remove or rebuild: The New Foundation was Owen Hart & Jim Neidhart (1991-92). Owen's actual early-1995 team was Owen Hart & Yokozuna (already in the game as owen-yoko)  
- **Category:** Should be removed · **Confidence:** High

The historical New Foundation was Owen Hart and Jim Neidhart (late 1991-February 1992). Owen Hart and Marty Jannetty were never a team under that (or any) name - this entry is fabricated. Owen's tag situation in January 1995 (teaming with Yokozuna, who won the titles with him at WrestleMania XI) is already modelled by owen-yoko.

*Sources:* Web: https://en.wikipedia.org/wiki/New_Foundation (Owen Hart & Jim Neidhart)

### `tenzan-kojima` — Tenzan & Kojima

- **Field:** members  
- **Current:** tenzan + kojima (starting NJPW team, holding IWGP tag titles)  
- **Recommended:** Replace with Cho-Ten (tenzan + chono), formed 1994-95 (first IWGP tag reign June 10, 1995); Tenzan & Kojima (Ten-Koji) first teamed years later - their first IWGP tag reign was Jan 4, 1999  
- **Category:** Major adjustment · **Confidence:** High

In January 1995 Hiroyoshi Tenzan's team was Cho-Ten with Masahiro Chono (they won the IWGP tag titles in a tournament in June 1995). Satoshi Kojima was a young singles worker then (he wrestled Tenzan in a young-lions match at Battle 7, Jan 4, 1995). The Ten-Koji partnership is an anachronism for 1995, and this team is also wrongly carrying the IWGP tag titles (see INITIAL_TITLES).

*Sources:* Web: https://puroresusystem.fandom.com/wiki/Hiroyoshi_Tenzan (Cho-Ten won IWGP tags June 1995; Ten-Koji first reign Jan 1999); Web: https://en.wikipedia.org/wiki/Battle_7 (Jan 4, 1995: Tenzan def. Kojima)

### `steiners` — The Steiner Brothers

- **Field:** company  
- **Current:** company: FA  
- **Recommended:** company: NJPW at start (IWGP tag title challengers Jan 4, 1995; ECW guest appearances mid-1995); they sign with WCW ~Feb 1996  
- **Category:** Minor adjustment · **Confidence:** Medium

The Steiners were New Japan-based through 1995 (challenged Hase & Muto for the IWGP tag titles at Battle 7) with guest shots in ECW, before signing with WCW (SuperBrawl VI, Feb 11, 1996). "FA" at start is a simplification that loses their NJPW affiliation.

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Steiners challenged for IWGP tag titles Jan 4, 1995)

### `road-warriors` — The Road Warriors

- **Field:** company  
- **Current:** company: FA  
- **Recommended:** company: FA is acceptable (Animal injured; Hawk finishing NJPW Hellraisers commitments before returning to WCW May 1995)  
- **Category:** Correct · **Confidence:** Medium

Acceptable simplification: Hawk was winding down his NJPW Hellraiser run and Animal was rehabbing a back injury. Hawk's May 1995 WCW return should ideally be modelled (see FA_ARRIVALS).

*Sources:* Web: https://en.wikipedia.org/wiki/Road_Warrior_Hawk

### `headshrinkers` — The Headshrinkers

- **Field:** members  
- **Current:** fatu + samu (starting WWF team)  
- **Recommended:** Verify: by January 1995 the active team was the New Headshrinkers (fatu + sione); Samu was exiting (the New Headshrinkers were booked on Jan 6, 1995 house shows)  
- **Category:** Needs manual review · **Confidence:** Medium

WWF house-show results from January 6, 1995 list "The New Headshrinkers" (Fatu & Sionne) in action, and the Dec 31 Superstars tag-title tournament shows Fatu & Sionne as the team - indicating Samu's exit was effectively complete at the game start. If confirmed, switch members to fatu + sione and move Samu out of the starting roster.

*Sources:* Web: https://www.theofficialwrestlingmuseum.com/wwf-live-event-results-1995.html (New Headshrinkers on Jan 6, 1995 card); Web: https://en.wikipedia.org/wiki/Jim_Neidhart (Dec 31 Superstars taping: "The New Headshrinkers (Fatu and Sionne)")

### `ajw-toyota-inoue` — Toyota & Inoue

- **Field:** members + title  
- **Current:** manami-toyota + kyoko-inoue (holding AJW tag titles at start)  
- **Recommended:** The WWWA World Tag Team Champions in January 1995 were Kyoko Inoue & Takako Inoue (won Oct 9, 1994, from Toyota & Toshiyo Yamada)  
- **Category:** Major adjustment · **Confidence:** High

The reigning WWWA tag champions at the start of 1995 were the Inoue duo (Kyoko & Takako), who beat Toyota & Yamada on Oct 9, 1994. The game's team (Toyota & Kyoko) is the wrong pairing for the belt. Either re-point the title to a new kyoko-inoue + takako-inoue team, or drop the title from this team. Also consider renaming the belt "WWWA World Tag Team Championship" for accuracy.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/manami-toyota/ (Oct 9, 1994: Takako & Kyoko Inoue def. Toyota & Yamada for WWWA tag titles)

### `ajw-kansai-ozaki` — Dynamite & Ozaki

- **Field:** company  
- **Current:** company: AJW  
- **Recommended:** company: JWP (both were JWP wrestlers in 1995 - they were defending the JWP tag titles on Jan 8, 1995)  
- **Category:** Wrong company · **Confidence:** Medium

Dynamite Kansai and Mayumi Ozaki were JWP Joshi Puroresu workers (Ozaki & Fukuoka defended the JWP tag titles against LCO on Jan 8, 1995). They challenged AJW in the interpromotional era but were not AJW roster members.

*Sources:* Web: https://www.blogofdoom.com/2022/02/07/joshi-spotlight-joshi-in-1995/ (Jan 8, 1995: LCO vs Ozaki & Fukuoka, JWP tag titles)

### `godwinns` — The Godwinns

- **Field:** starting team  
- **Current:** henry-godwinn + phineas-godwinn (starting WWF team)  
- **Recommended:** At the January 1995 start only Henry was in the WWF (Phineas debuted Aug 1995); form the team ~turn 29 (August 1995)  
- **Category:** Wrong availability date · **Confidence:** High

Henry O. Godwinn was a WWF singles wrestler in early 1995; Phineas I. Godwinn debuted with Hillbilly Jim in August 1995. The team should not exist at the start. (See the phineas-godwinn roster finding.)

*Sources:* Research: WWF_Jul-Sep_1995_Research.md (Phineas debut Aug 1995)

### `blu-brothers` — The Blu Brothers

- **Field:** starting team  
- **Current:** jacob-blu + eli-blu (starting WWF team)  
- **Recommended:** Keep team concept; move to FA arrival ~turn 8-10 (first WWF matches Feb-Mar 1995) - reconciled with the roster finding (t8-12): the twins appeared on WWF cards from February 1995 and were TV regulars by spring  
- **Category:** Minor adjustment · **Confidence:** Medium

The Harris twins debuted in the WWF in early 1995 (on cards from February 1995). As starters they are ~4-6 weeks early. See the jacob-blu/eli-blu age findings (twins should share an age).

*Sources:* Web: https://www.theofficialwrestlingmuseum.com/wwf-live-event-results-1995.html (Blu Brothers on Feb 1995 cards)

### `outsiders` — The Outsiders

- **Field:** company  
- **Current:** company: FA (razor-ramon + diesel)  
- **Recommended:** Keep as-is (correct): Razor and Diesel start in the WWF; the team forms via the Outsiders storyline (Hall May 27, 1996)  
- **Category:** Correct · **Confidence:** High

Good design - the FA-tagged dormant team that activates with the Hall/Nash WCW invasion is historically sound.

*Sources:* Research: WCW_Apr-Jun_1996_Research.md (Hall debut May 27, 1996)

### `MISSING-teams` — Missing teams

- **Field:** teams  
- **Current:** No Cho-Ten, Hase & Muto, Misawa & Kobashi, Inoue sisters, Gangstas, or New Headshrinkers entries  
- **Recommended:** Add: cho-ten (tenzan+chono, NJPW); hase-muto (hase+mutoh, NJPW, IWGP tag champions at start); misawa-kobashi (AJPW, World Tag champions at start); kyoko-takako (AJW, WWWA tag champions at start); gangstas (new-jack+mustafa, SMW); new-headshrinkers (fatu+sione, WWF)  
- **Category:** Missing · **Confidence:** High

Several of the corrected title holders (see INITIAL_TITLES) need matching team entries: Hase & Muto (IWGP tag champs), Misawa & Kobashi (AJPW World Tag champs), Kyoko & Takako Inoue (WWWA tag champs). The Gangstas were the top SMW heel team of early 1995. The New Headshrinkers (Fatu & Sionne) were the active WWW tag team in January 1995.

*Sources:* See INITIAL_TITLES findings; Web: https://thehistoryofwwe.com/smw-results-1995/ (Gangstas on all January 1995 SMW cards)

## 6a. FACTIONS (INITIAL_FACTIONS + scripted faction events)

### `four-horsemen` — The Four Horsemen (INITIAL_FACTIONS)

- **Field:** existence / formation date  
- **Current:** Seeded at game start: ric-flair (leader), arn-anderson, brian-pillman (WCW)  
- **Recommended:** Do not seed at start: the Horsemen were DORMANT in January 1995 (the 1993-94 Arn Anderson/Paul Roma incarnation had dissolved). Add a formation event ~turn 39 (Oct 29, 1995) (late October 1995): Flair, Arn and Pillman reformed the Horsemen on Nitro, with Chris Benoit added by the new year  
- **Category:** Wrong availability date · **Confidence:** High

The Horsemen reunion that this membership matches happened in late October 1995 (Arn/Pillman/Flair, with Benoit and Woman by year end). Seeding them in January 1995 skips Flair's "retirement"/reinstatement arc and leaves the game with a top WCW stable that did not exist at the start date.

*Sources:* Web: https://www.thesmackdownhotel.com/wrestlers/brian-pillman (Four Horsemen: Flair, Arn, Benoit, Woman - Oct 29, 1995 to Feb 11, 1996); Research: WCW_Jan-Mar_1995_Research.md (Horsemen dormant; Flair "retired" after Halloween Havoc 94)

### `dungeon-of-doom` — The Dungeon of Doom (INITIAL_FACTIONS)

- **Field:** name / membership at start  
- **Current:** Seeded at game start: kevin-sullivan (leader), meng, the-butcher, avalanche (WCW)  
- **Recommended:** Seed as "The Three Faces of Fear" (kevin-sullivan, the-butcher, avalanche) - the actual January 1995 Sullivan group. Meng should NOT be in it (he was Col. Robert Parker's bodyguard/enforcer). Add a rebrand event ~turn 24-28 (mid-1995): the group becomes the Dungeon of Doom, absorbs Meng (and later arrivals like Kamala and Zodiac)  
- **Category:** Minor adjustment · **Confidence:** High

The Three Faces of Fear (Sullivan, Butcher, Avalanche) formed after Sullivan turned on Hogan at Halloween Havoc 94. The "Dungeon of Doom" branding and its monster roster came together in mid-1995. Meng spent the first half of 1995 as Parker's bodyguard, not in Sullivan's group. The membership is 75% right - only the name and Meng's presence are anachronistic.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Three Faces of Fear; Meng with Parker); Web: https://en.wikipedia.org/wiki/Dungeon_of_Doom (stable formed 1995)

### `million-dollar-corp` — The Million Dollar Corporation (INITIAL_FACTIONS)

- **Field:** leader / membership  
- **Current:** Seeded at game start: bam-bam-bigelow (LEADER), irs, tatanka, king-kong-bundy (WWF)  
- **Recommended:** Leader should be ted-dibiase (DiBiase is already on the roster - the Corporation is HIS act, he never wrestled for it). Tatanka should join ~turn 5-6 (his heel turn came Feb 20, 1995 - he was a babyface, and unmanaged, in January). Bigelow leaves ~turn 13 (face turn after the Lawrence Taylor match at WrestleMania XI, Apr 2, 1995, Apr 2, 1995). Optional extra members for accuracy: nikolai-volkoff and kama (both in the group in 1995)  
- **Category:** Minor adjustment · **Confidence:** High

Two errors: the leader is wrong (Bigelow was a member, DiBiase the manager/leader), and Tatanka is ~10 weeks early. The core (IRS, Bundy, Bigelow) is correct for January 1995.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md (Corporation members; Tatanka heel turn Feb 1995); Web: https://en.wikipedia.org/wiki/Million_Dollar_Corporation

### `nwo-formation-mechanic` — The nWo (scripted, engine decision)

- **Field:** formation mechanic  
- **Current:** Player decision: when Hall & Nash are available, the player can "Form the nWo" (Hall + Nash), then optionally make Hulk Hogan the "third man" (sets hogan.align = heel)  
- **Recommended:** Correct and well-designed: matches the Outsiders arrival (Hall walked onto Nitro May 27, 1996) and the Hogan turn (Bash at the Beach, July 7, 1996). NOTE: the third-man decision flips Hogan heel, which only produces the intended history if Hogan starts as a FACE - reinforcing the hulk-hogan alignment finding (game currently seeds him heel)  
- **Category:** Correct · **Confidence:** High

The engine's nWo decision chain (engine.js ~line 4049) is a faithful model of the May-July 1996 sequence. The seeded heel alignment undercuts it: if Hogan is already a heel in January 1995, the third-man turn is a non-event.

*Sources:* Code: js/engine.js lines 4049-4080 (nWo formation decision); Web: https://en.wikipedia.org/wiki/New_World_Order_(professional_wrestling) (Hall May 27, 1996; Hogan July 7, 1996)

## 6b. Generated independent workers (engine.js world generation)

The engine generates 950 unsigned fictional free agents + 37 signed fictional local jobbers. These findings audit the assumptions, not individual fictional people (there are none to audit).

### `indy-fa-pool` — Generated unsigned independents (INDY_FA_POOL)

- **Field:** pool size / design  
- **Current:** 950 fictional unsigned free agents generated at game start (names from fictional ROOKIE_*/INDY_INTL_* pools; pop 5-21, work 28-57, mic 18-45, age 18-41; 4% "gems" with work 68-85 / ceiling 80-91; 13% female)  
- **Recommended:** Acceptable as a design choice - the engine comment itself notes 1995 had roughly 2,500-4,000 active workers worldwide and the curated database covers TV talent. But the fictional pool crowds out REAL unsigned workers of January 1995: recommend adding the historical names in the missing-workers list (Hardys, Dudleys, Al Snow, Unabomb, Gangstas, Spicolli, etc.) as seeded free agents so the open market is not 100% fictional  
- **Category:** Correct · **Confidence:** High

The generator (engine.js lines 259-323) is deterministic, statistically sane, and openly documented as filler. The one historical-fidelity gap: the real January 1995 independent scene had identifiable future stars, and none of them exist in the game world except as scripted WWF/WCW arrivals later.

*Sources:* Code: js/engine.js lines 259-323 (generateWorldTalent); Code: js/data.js ROOKIE_*/INDY_INTL_NAMES pools

### `indy-jobbers` — Generated local jobbers per promotion (INDY_JOBBERS_PER_FED)

- **Field:** distribution  
- **Current:** 37 generated local enhancement workers under contract: NJPW 4, AJPW 4, AJW 5, CMLL 3, AAA 3, USWA 3, ASW 3, FMW 2, WWC 2, SMW 2, NWA 2, CWA 2, AWF 2; WCW/WWF/ECW get 0  
- **Recommended:** Reasonable: the Japanese "young boy" system justifies NJPW/AJPW/AJW depth, and WCW/WWF/ECW already have seeded real enhancement talent (Jim Powers, Mike Bell, Reno Riggins, Don E. Allen, etc.). No change needed  
- **Category:** Correct · **Confidence:** Medium

Distribution matches how those promotions actually staffed undercards in 1995.

*Sources:* Code: js/engine.js line 261 (INDY_JOBBERS_PER_FED)

### `indy-international-flavor` — Generated worker nationalities

- **Field:** flavor mix  
- **Current:** 9% Japan / 9% Mexico / 9% Europe / 9% UK / 64% American names in the generated pool  
- **Recommended:** Acceptable approximation of the 1995 talent geography; no change needed  
- **Category:** Correct · **Confidence:** Medium

Rough but defensible. (Note: joshi representation is handled via the 13% female roll plus the AJW jobber count.)

*Sources:* Code: js/engine.js makeWorker() flavorRoll

### `real-fa-pool-gap` — Historical free agents, January 1995

- **Field:** open market at start  
- **Current:** No real-person free agents exist at game start: the FA market is 100% fictional generated workers (plus 23 scripted future arrivals that enter later)  
- **Recommended:** Seed a small real-person FA pool at start: the Hardy Boyz (unsigned WWF jobbers), Al Snow, Unabomb/Glen Jacobs (pre-Yankem), the Gangstas (pre-SMW), Louie Spicolli (indies), Ron Simmons/Tully Blanchard (between deals), Barry Windham (retired, could be absent), Sabu's NJPW affiliates, etc. - or convert them to early scripted arrivals  
- **Category:** Missing · **Confidence:** High

In January 1995 a promotion signing "a free agent" could realistically land the Hardys, Al Snow or the Gangstas. With a purely fictional market, the player can never sign these people until their scripted arrival, which slightly misrepresents how the era's talent market worked.

*Sources:* Web: https://www.wikiwand.com/en/Jeff_Hardy (Hardys as WWF enhancement talent from 1994, unsigned until 1998); Web: https://tvtropes.org/pmwiki/pmwiki.php/Wrestling/TheDudleyBoys (Dudley family act debuted July 1, 1995)

## 7. INITIAL_TITLES — championship holders at January 1995

### `wcw-world` — WCW World Heavyweight Championship

- **Field:** holder  
- **Current:** hulk-hogan  
- **Recommended:** Keep as-is (correct): Hogan was WCW World Champion (won July 17, 1994; held through April 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Hogan champion entering 1995)

### `wcw-us` — WCW United States Championship

- **Field:** holder  
- **Current:** vader  
- **Recommended:** Keep as-is (correct): Vader won the US title from Sting at Starrcade, Dec 27, 1994 (held until stripped in April 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Vader US champion)

### `wcw-tv` — WCW World Television Championship

- **Field:** holder  
- **Current:** arn-anderson  
- **Recommended:** Keep as-is (correct): Arn was TV Champion entering 1995 (retained vs Johnny B. Badd at Clash XXX)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Arn TV champion at Clash XXX)

### `wcw-tag` — WCW World Tag Team Championship

- **Field:** holder  
- **Current:** harlem-heat  
- **Recommended:** stars-n-stripes for a January 1, 1995 start (Stars & Stripes were champions); script the Harlem Heat title win at turn 2-3 (Jan 8, 1995 tapings, aired Jan 21)  
- **Category:** Minor adjustment · **Confidence:** High

Stars 'n' Stripes (Marcus Bagwell & The Patriot) were the reigning WCW tag champions on January 1, 1995. Harlem Heat won the belts from them at the January 8, 1995 tapings (aired Jan 21). Depending on how strictly the game pins its start date, either holder is defensible; the historically cleanest start is Stars 'n' Stripes with a scripted change in the first two weeks.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Stars & Stripes champions entering 1995; Harlem Heat win January tapings)

### `wwf-world` — WWF Championship

- **Field:** holder  
- **Current:** diesel  
- **Recommended:** Keep as-is (correct): Diesel won the title at Survivor Series, Nov 26, 1994 (held to Nov 19, 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md

### `wwf-ic` — WWF Intercontinental Championship

- **Field:** holder  
- **Current:** razor-ramon  
- **Recommended:** Keep as-is (correct): Razor was IC Champion entering 1995 (lost to Jeff Jarrett at the Royal Rumble, Jan 22, 1995 - scriptable at turn 3)  
- **Category:** Correct · **Confidence:** High

Accurate; the title change falls within the game's first month.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md (Jarrett wins IC title at Royal Rumble 95)

### `wwf-tag` — WWF Tag Team Championship

- **Field:** holder  
- **Current:** smoking-gunns  
- **Recommended:** Vacant at start (titles vacated in November 1994); script the 1-2-3 Kid & Bob Holly tournament win at the Royal Rumble (Jan 22, 1995, turn 3). The Smoking Gunns' first reign began Sept 25, 1995  
- **Category:** Major adjustment · **Confidence:** High

The WWF tag titles were VACATED when Shawn Michaels and Diesel split in late November 1994. A tournament ran on TV/house shows, with the 1-2-3 Kid & Bob Holly winning the titles at the Royal Rumble (Jan 22, 1995). The Smoking Gunns were NOT champions in January 1995 - their first title win came at the end of September 1995.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md (Kid & Holly win tag titles at Royal Rumble 95); Auditor knowledge: Gunns' first reign Sept 1995

### `wwf-women` — WWF Women's Championship

- **Field:** holder  
- **Current:** alundra-blayze  
- **Recommended:** bull-nakano  
- **Category:** Major adjustment · **Confidence:** High

Bull Nakano was the WWF Women's Champion in January 1995 (won the title from Alundra Blayze on Nov 20, 1994; Blayze regained it on April 3, 1995). Nakano is already on the game's WWF roster. Blayze's third reign (Oct 1995) is already correctly referenced by the madusa-trash timeline event - only the start state is wrong. Note: the README repeats this error ("Alundra Blayze carries the WWF Women's Championship into 1995").

*Sources:* Web: https://theofficialwrestlingmuseum.com/wwf-live-event-results-1995.html (Jan-Feb 1995 cards: "WWF Women's Champion Bull Nakano defeated Alundra Blayze")

### `ecw-world` — ECW World Heavyweight Championship

- **Field:** holder  
- **Current:** shane-douglas  
- **Recommended:** Keep as-is (correct): Douglas was champion entering 1995 (reign from March 26, 1994; lost to Sandman April 15, 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/shane-douglas/ (title chronology)

### `ecw-tv` — ECW World Television Championship

- **Field:** holder  
- **Current:** dean-malenko  
- **Recommended:** Keep as-is (correct): Malenko won the TV title Nov 4, 1994 (held to March 18, 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: ECW_1995_Q1_Research.md (Malenko TV champion)

### `ecw-hardcore` — ECW Hardcore Championship

- **Field:** existence  
- **Current:** Title exists at start with holder: null  
- **Recommended:** Remove this title (no ECW Hardcore Championship existed in 1995 - ECW's titles were World, TV and Tag). Replace with the missing ECW World Tag Team Championship  
- **Category:** Should be removed · **Confidence:** High

There was no "ECW Hardcore Championship" in the 1995-2001 period (ECW's actual championships: World Heavyweight, World Television, World Tag Team, plus the short-lived FTW title in 1998). If a third ECW belt is wanted, the historically correct choice is the ECW World Tag Team Championship, held in January 1995 by The Public Enemy (reign from Aug 1994; lost to Sabu & The Tazmaniac on Feb 4, 1995).

*Sources:* Research: ECW_1995_Q1_Research.md (Public Enemy ECW tag champions; Sabu & Tazmaniac win Feb 4, 1995)

### `ecw-tag-missing` — ECW World Tag Team Championship (missing)

- **Field:** existence  
- **Current:** Not present  
- **Recommended:** Add title with holder: public-enemy (reign from Aug 27, 1994; lost to Sabu & The Tazmaniac Feb 4, 1995)  
- **Category:** Missing · **Confidence:** High

The ECW tag titles existed from 1992 and were a core ECW belt (Public Enemy, then Sabu/Tazmaniac, Raven & Stevie Richards, the Gangstas, Eliminators, Dudleyz). Its absence guts ECW's tag division for the whole game.

*Sources:* Research: ECW_1995_Q1_Research.md (Public Enemy champions; Double Tables Feb 4, 1995)

### `njpw-world` — IWGP Heavyweight Championship

- **Field:** holder  
- **Current:** hashimoto  
- **Recommended:** Keep as-is (correct): Hashimoto was IWGP Heavyweight Champion (second reign, from May 1994; retained vs Kensuke Sasaki at Battle 7, Jan 4, 1995; lost the title in April 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Jan 4, 1995: Hashimoto (c) def. Sasaki)

### `njpw-junior` — IWGP Junior Heavyweight Championship

- **Field:** holder  
- **Current:** liger  
- **Recommended:** norio-honaga (reigning champion; retained vs The Great Sasuke at Battle 7, Jan 4, 1995; Liger regained the title later in 1995)  
- **Category:** Major adjustment · **Confidence:** High

The IWGP Junior Heavyweight Champion in January 1995 was Norio Honaga, not Jushin Liger - Honaga retained the title against The Great Sasuke at Battle 7 (Tokyo Dome, Jan 4, 1995). Liger held the title later in 1995. Honaga is not on the game's NJPW roster at all (see the roster Missing finding).

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Jan 4, 1995: Norio Honaga (c) def. The Great Sasuke)

### `njpw-tag` — IWGP Tag Team Championship

- **Field:** holder  
- **Current:** tenzan-kojima  
- **Recommended:** hase-muto (Hiroshi Hase & Keiji Muto, champions from Nov 25, 1994; retained vs the Steiner Brothers at Battle 7, Jan 4, 1995; lost the titles May 6, 1995)  
- **Category:** Major adjustment · **Confidence:** High

The IWGP Tag Team Champions in January 1995 were Hiroshi Hase & Keiji Muto. Tenzan & Kojima never held the IWGP tag titles together in this era (their first reign began Jan 4, 1999); even Cho-Ten (Tenzan & Chono) did not win them until June 1995. Hase is missing from the roster and a hase-muto team must be added.

*Sources:* Web: https://en.wikipedia.org/wiki/Battle_7 (Jan 4, 1995: Hase & Mutoh (c) def. Steiner Brothers); Web: https://prowrestling.fandom.com/wiki/IWGP_Tag_Team_Championship/Champion_gallery (24th champions: Hase & Muto, Nov 25, 1994 - May 6, 1995)

### `ajpw-triple` — AJPW Triple Crown Heavyweight Championship

- **Field:** holder  
- **Current:** misawa  
- **Recommended:** kawada (won from Steve Williams Oct 22, 1994; lost to Stan Hansen March 4, 1995)  
- **Category:** Major adjustment · **Confidence:** High

The Triple Crown Champion in January 1995 was Toshiaki Kawada, not Mitsuharu Misawa. Kawada won the title from Steve Williams on Oct 22, 1994 and held it until March 4, 1995 (dropping it to Stan Hansen; Misawa then beat Hansen for it in May 1995). Kawada drew with Kobashi in a January 19, 1995 title defence - a nice scriptable beat.

*Sources:* Web: https://puroresusystem.fandom.com/wiki/Holy_Demon_Army (Kawada TC reign Oct 22, 1994 - Mar 4, 1995); Web: https://www.blogofdoom.com/2025/01/20/match-review-kawada-kobashi-ajpw-95/ (Jan 19, 1995: Kawada (c) vs Kobata 60-min draw)

### `ajpw-tag` — AJPW World Tag Team Championship

- **Field:** holder  
- **Current:** holy-demon-army  
- **Recommended:** misawa-kobashi (Mitsuharu Misawa & Kenta Kobashi, champions since winning the 1994 World's Strongest Tag league; drew the Holy Demon Army in a Jan 24, 1995 defence; lost to HDA June 9, 1995)  
- **Category:** Major adjustment · **Confidence:** High

The AJPW World Tag Team Champions in January 1995 were Misawa & Kobashi, not the Holy Demon Army. Misawa & Kobashi defended the belts against Kawada & Taue on January 24, 1995 (60-minute draw). The HDA won the titles from them on June 9, 1995. The HDA team itself is correct for the period (formed 1993) - only the championship status is wrong.

*Sources:* Web: https://www.reddit.com/r/ajpw/comments/kkko16/the_history_of_ajpw_the_90s_part_2/ (Jan 24, 1995: Misawa & Kobashi (c) vs Kawada & Taue draw; June 9, 1995: HDA win titles); Web: https://puroresusystem.fandom.com/wiki/Holy_Demon_Army

### `ajpw-junior` — AJPW World Junior Heavyweight Championship

- **Field:** holder  
- **Current:** ogawa  
- **Recommended:** Verify: could not confirm Yoshinari Ogawa held the World Junior title in January 1995 - check the AJPW World Junior title lineage (early-1990s holders include Fuchi and Kikuchi) before keeping  
- **Category:** Needs manual review · **Confidence:** Low

No verification found that Ogawa was World Junior Heavyweight Champion at the start of 1995. The early-to-mid 1990s lineage is generally associated with Fuchi/Kikuchi. Ogawa's junior title reigns came later. Needs a lineage check.

*Sources:* Auditor note: needs title-lineage verification

### `cmll-world` — CMLL World Heavyweight Championship

- **Field:** holder  
- **Current:** el-hijo-del-santo  
- **Recommended:** silver-king (won from Black Magic July 28, 1994; lost to Apolo Dantés in 1995). El Hijo del Santo never held this title  
- **Category:** Major adjustment · **Confidence:** High

The CMLL World Heavyweight Champion in January 1995 was Silver King (5th champion, reigning since July 28, 1994). El Hijo del Santo never held the CMLL World Heavyweight title - he is a welterweight (multiple-time CMLL World Welterweight Champion). Silver King is already on the game's CMLL roster; only the holder reference needs to change.

*Sources:* Web: https://en.wikipedia.org/wiki/Silver_King_(wrestler) (defeated Black Magic for CMLL World Heavyweight title July 28, 1994; lost it to Apolo Dantés in 1995); Web: https://www.luchawiki.org/index.php/CMLL_World_Heavyweight_Championship (champion gallery: Silver King, 5th)

### `cmll-mid` — Mexican National Middleweight Championship

- **Field:** holder  
- **Current:** negro-casas  
- **Recommended:** Keep as-is (probable correct): Negro Casas held the National Middleweight title through this period - verify exact reign window  
- **Category:** Correct · **Confidence:** Medium

Negro Casas is the commonly cited Mexican National Middleweight Champion of the mid-1990s. Exact reign window should be verified against a title-lineage source, but the assignment is plausible.

*Sources:* Auditor note: plausible; verify reign window

### `aaa-world` — AAA World Heavyweight Championship

- **Field:** existence + holder  
- **Current:** Title exists at start; holder: konnan  
- **Recommended:** Remove or rename: no AAA "World Heavyweight" Championship existed in January 1995. The AAA Americas Heavyweight Championship was created Feb 2, 1996 (Konnan was its first champion - but only after he had left for WCW). For a January 1995 start, AAA's real top belts were the IWC World Heavyweight Championship (the US-partnership belt) and the Americas titles  
- **Category:** Should be removed · **Confidence:** High

AAA did not have a "World Heavyweight" championship in early 1995. The belt later called the AAA Mega Championship dates to 2007; the AAA Americas Heavyweight Championship was first won by Konnan in a tournament final on Feb 2, 1996 (by which point he was WCW-bound). Recommended: replace with the IWC World Heavyweight Championship (holder needs verification) or the Americas Heavyweight title introduced via a 1996 event.

*Sources:* Web: https://en.wikipedia.org/wiki/AAA_Americas_Heavyweight_Championship (first champion Konnan, Feb 2, 1996); Web: https://en.wikipedia.org/wiki/IWC_World_Heavyweight_Championship (IWC created to promote AAA in the US)

### `aaa-cruiser` — AAA World Cruiserweight Championship

- **Field:** existence + holder  
- **Current:** Title exists at start; holder: rey-mysterio  
- **Recommended:** Remove or rename: no AAA World Cruiserweight Championship existed in 1995. Rey Mysterio Jr. held no title in January 1995 (his 1995 titles were the Mexican National Trios from April 1995 and the WWA World Lightweight/Welterweight belts from June/Sept 1995)  
- **Category:** Should be removed · **Confidence:** High

No such title existed in AAA in 1995 (AAA's cruiserweight-era titles came much later). Rey was untitled at the January 1995 start. If a light-heavyweight-flavoured AAA belt is wanted, the WWA World Welterweight title (Rey def. Psicosis, Sept 22, 1995) is the closest real analogue, introduced mid-game.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/rey-mysterio-jr/ (1995 title chronology); Auditor note: no AAA cruiserweight title in 1995

### `fmw-brass` — FMW Brass Knuckles Heavyweight Championship

- **Field:** holder  
- **Current:** onita  
- **Recommended:** Keep as-is (probable correct): Onita was FMW's ace and Brass Knucks Heavyweight Champion into early 1995; note his retirement show (exploding ring vs Hayabusa) on May 5, 1995 - a strong timeline event candidate  
- **Category:** Correct · **Confidence:** Medium

Onita was the face of FMW and its reigning Brass Knucks champion in the period before his first retirement (May 5, 1995). Exact reign window worth verifying, but the assignment is plausible.

*Sources:* Auditor note: plausible; verify reign window

### `smw-world` — SMW Heavyweight Championship

- **Field:** holder  
- **Current:** brian-lee  
- **Recommended:** dirty-white-boy (The Dirty White Boy, champion since the fictitious July 5, 1994 title change; held into spring 1995 - lost to Buddy Landel via title-vacating no-contest July 1, 1995)  
- **Category:** Major adjustment · **Confidence:** High

The SMW Heavyweight Champion entering 1995 was The Dirty White Boy (Tony Anthony), not Brian Lee. Lee had been SMW champion in 1993-94 but by the start of 1995 he was the departing "Beat the Champ" TV champion (losing that belt to Buddy Landel on Dec 5/31, 1994) and was on his way to the USWA. Both men are already on the game's SMW roster.

*Sources:* Web: https://www.blogofdoom.com/2020/02/19/what-the-world-was-watching-smoky-mountain-tv-january-7-1995/ (SMW champions at the start of 1995: HW Champion Dirty White Boy; TV Champion Buddy Landel; Tag Champions R&R Express)

### `smw-tv` — SMW "Beat the Champ" Television Championship

- **Field:** holder  
- **Current:** bobby-eaton  
- **Recommended:** buddy-landel (won from Brian Lee Dec 5, 1994/aired Dec 31)  
- **Category:** Major adjustment · **Confidence:** High

The "Beat the Champ" TV champion entering 1995 was Buddy Landel, not Bobby Eaton (who was working WCW dates - see the roster finding). Landel is already on the game's SMW roster.

*Sources:* Web: https://www.blogofdoom.com/2020/02/19/what-the-world-was-watching-smoky-mountain-tv-january-7-1995/ (TV Champion: Buddy Landel, defeated Brian Lee Dec 5, 1994)

### `smw-tag-missing` — SMW Tag Team Championship (missing)

- **Field:** existence  
- **Current:** Not present  
- **Recommended:** Add title with holder: rock-n-roll-express (won from the Gangstas at Christmas Chaos, Dec 25, 1994)  
- **Category:** Missing · **Confidence:** High

SMW ran a tag team championship from its inception; at the start of 1995 the Rock 'n' Roll Express were the champions. The team is in the game but the belt is not.

*Sources:* Web: https://www.blogofdoom.com/2020/02/19/what-the-world-was-watching-smoky-mountain-tv-january-7-1995/ (SMW Tag Champions: R&R Express, beat the Gangstas at Christmas Chaos Dec 25, 1994)

### `cwa-world` — CWA World Heavyweight Championship

- **Field:** holder  
- **Current:** otto-wanz  
- **Recommended:** Keep as-is (probable correct): Wanz was the long-running CWA champion and still topped the card; verify his exact reign status in January 1995 (the German CWA was winding down)  
- **Category:** Correct · **Confidence:** Low

Plausible; the CWA was in decline by 1995 and Wanz's exact title status needs verification, but the assignment is defensible for a legends-based German roster.

*Sources:* Auditor note: plausible; verify

### `wwc-world` — WWC Universal Heavyweight Championship

- **Field:** holder  
- **Current:** carlos-colon  
- **Recommended:** Verify Colón's Universal reign window in January 1995 (he was multi-time champion across 1993-95); plausible  
- **Category:** Correct · **Confidence:** Low

Colón held the Universal title repeatedly in this era; the exact January 1995 reign needs verification against WWC lineage, but the assignment is plausible.

*Sources:* Auditor note: plausible; verify

### `wwc-tv` — WWC Television Championship

- **Field:** existence + holder  
- **Current:** Title exists; holder: ray-gonzalez  
- **Recommended:** Verify the WWC Television title existed and was held by Ray González in January 1995  
- **Category:** Needs manual review · **Confidence:** Low

Could not verify the WWC TV title or González's reign at the January 1995 start. Needs a WWC title-lineage check.

*Sources:* Auditor note: needs verification

### `uswa-world` — USWA Unified World Heavyweight Championship

- **Field:** holder  
- **Current:** tommy-rich  
- **Recommended:** sid (Sid Vicious was the reigning USWA Unified World Champion - retained vs Brian Christopher on Jan 23, 1995; lost to Jerry Lawler Feb 6, 1995). Tommy Rich held the separate USWA (Memphis) Heavyweight title in late 1994 but lost it to Brian Christopher on Dec 31, 1994  
- **Category:** Major adjustment · **Confidence:** High

The USWA ran two belts: the top-line Unified World Heavyweight Championship (held by Sid entering 1995) and the Memphis USWA Heavyweight title (Brian Christopher as of Dec 31, 1994). Tommy Rich was a former Memphis-title holder but not the Unified champion. Fixing this also resolves the sid wrong-company finding.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/brian-christopher/ (Jan 23, 1995: Sid retained Unified title vs Brian Christopher); Web: https://www.wrestling-titles.com/us/tn/uswa/uswa-h.html (USWA Heavyweight title: Christopher won Dec 31, 1994)

### `uswa-tv` — USWA Television Championship

- **Field:** existence + holder  
- **Current:** Title exists; holder: brian-christopher  
- **Recommended:** Replace with the USWA (Memphis) Heavyweight Championship, holder: brian-christopher (won Dec 31, 1994)  
- **Category:** Needs manual review · **Confidence:** Medium

A USWA Television title in January 1995 could not be verified; the promotion's second belt was the Memphis-lineage USWA Heavyweight title (held by Brian Christopher at the start of 1995). Recommend replacing unless the TV belt can be sourced.

*Sources:* Web: https://www.wrestling-titles.com/us/tn/uswa/uswa-h.html

### `nwa-world` — NWA World Heavyweight Championship

- **Field:** holder  
- **Current:** dan-severn  
- **Recommended:** chris-candido (won a tournament final on Nov 19, 1994 in Cherry Hill, NJ; lost to Dan Severn on Feb 24, 1995 at an SMW show in Erlanger, KY)  
- **Category:** Major adjustment · **Confidence:** High

The NWA World Heavyweight Champion in January 1995 was Chris Candido - not Dan Severn. Severn won the title from Candido on Feb 24, 1995 (the title change happened at an SMW event, a great scriptable beat around turn 7). Candido is already on the game's SMW roster, which is exactly where the NWA champion of the era was working.

*Sources:* Web: https://alliance-wrestling.com/25-years-ago-today-the-beast-becomes-worlds-heavyweight-champion/ (Severn def. Candido Feb 24, 1995; Candido won Nov 19, 1994); Web: https://www.onlineworldofwrestling.com/profile/dan-severn (Feb 24, 1995 - SMW: Severn defeated Candido to win NWA title)

### `nwa-north` — NWA North American Heavyweight Championship

- **Field:** holder  
- **Current:** greg-valentine  
- **Recommended:** Keep as-is (correct for Jan 1, 1995): Valentine was the inaugural NWA (Dallas) North American Champion (awarded Oct 30, 1994); note he lost it to Kevin von Erich on Jan 7, 1995, regained it March 18, 1995, and the promotion folded in May 1995  
- **Category:** Correct · **Confidence:** High

Valentine was indeed the reigning NWA North American Heavyweight Champion (NWA Dallas/Crockett-promotion belt) on January 1, 1995. Worth noting the belt changed hands on Jan 7, 1995 (Kevin von Erich) - a same-week scripted change if desired.

*Sources:* Web: https://www.thesmackdownhotel.com/title-history/nwa/nwa-north-american-heavyweight-championship (Valentine 1st reign Oct 30, 1994 - Jan 7, 1995)

### `awf-world` — AWF Heavyweight Championship

- **Field:** holder  
- **Current:** tito-santana  
- **Recommended:** Verify: Tito Santana was the AWF's ace, but confirm whether the AWF Heavyweight title existed/was held by him at the January 1995 start (the AWF's "Warriors of Wrestling" tapings ran 1994-96; its title tournament may post-date the game start)  
- **Category:** Needs manual review · **Confidence:** Low

The AWF was a small 1994-96 promotion (Savoldi brothers). Tito as champion is plausible but unverified for January 1995. Needs an AWF title-lineage check.

*Sources:* Auditor note: needs verification

### `asw-world` — ASW British Heavyweight Championship

- **Field:** holder  
- **Current:** tony-st-clair  
- **Recommended:** Keep as-is (probable correct): St Clair was the long-reigning All-Star British champion; verify exact January 1995 status  
- **Category:** Correct · **Confidence:** Low

Plausible; deep-cut territory, verify if possible.

*Sources:* Auditor note: plausible; verify

### `asw-mid` — ASW British Mid-Heavyweight Championship

- **Field:** holder  
- **Current:** robbie-brookside  
- **Recommended:** Verify Brookside held this belt at the January 1995 start  
- **Category:** Needs manual review · **Confidence:** Low

Deep-cut; could not verify.

*Sources:* Auditor note: needs verification

### `wwwa-world` — WWWA World Championship

- **Field:** holder  
- **Current:** aja-kong  
- **Recommended:** Keep as-is (correct): Aja Kong was WWWA World Champion (reign from Nov 1992; lost to Manami Toyota March 26, 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Web: https://www.blogofdoom.com/2022/02/07/joshi-spotlight-joshi-in-1995/ (WWWA title: Aja Kong since Nov 1992; Toyota March 1995)

### `ajw-all-pacific` — AJW All Pacific Championship

- **Field:** holder  
- **Current:** manami-toyota  
- **Recommended:** Keep as-is (correct): Toyota won the All Pacific title Aug 24, 1994 (vacated it in March 1995 upon winning the WWWA title)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/manami-toyota/ (All Pacific win Aug 24, 1994)

### `ajw-tag` — AJW Tag Team Championship

- **Field:** holder + name  
- **Current:** ajw-toyota-inoue (Toyota & Kyoko Inoue)  
- **Recommended:** kyoko-inoue + takako-inoue (the WWWA World Tag Team Champions since Oct 9, 1994); consider renaming the belt "WWWA World Tag Team Championship"  
- **Category:** Major adjustment · **Confidence:** High

The reigning WWWA World Tag Team Champions at the start of 1995 were Kyoko Inoue & Takako Inoue (beat Toyota & Yamada on Oct 9, 1994). The game awards the belts to a Toyota & Kyoko pairing that did not hold them. See the ajw-toyota-inoue teams finding.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/manami-toyota/ (Oct 9, 1994 WWWA tag title change)

## 8. Managers & SEED_MANAGERS

### `SEED-hulk-hogan` — Jimmy Hart -> Hulk Hogan

- **Field:** manager seed  
- **Current:** hulk-hogan managed by jimmy-hart  
- **Recommended:** Keep as-is (correct): Jimmy Hart managed Hogan at the start of 1995 (later joined the Dungeon of Doom, Oct 1995)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Hart with Hogan)

### `SEED-steve-austin` — Col. Robert Parker -> Steve Austin

- **Field:** manager seed  
- **Current:** steve-austin managed by robert-parker  
- **Recommended:** Acceptable for early 1995, but Parker's primary stable at the start of 1995 was Bunkhouse Buck/Meng/Arn Anderson (Parker & Meng accompanied TV champion Arn at Clash XXX). Consider re-pointing Parker to the First Family and dropping the Austin link by spring 1995  
- **Category:** Minor adjustment · **Confidence:** Medium

Parker managed "Stunning" Steve Austin in 1994 and into early 1995, but by January 1995 his on-screen focus was the Buck/Meng/Arn group. The seed is defensible but slightly stale.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Clash XXX: Arn (c) w/ Parker & Meng)

### `SEED-booker-t` — Sister Sherri -> Booker T

- **Field:** manager seed  
- **Current:** booker-t managed by sherri-martel  
- **Recommended:** Keep (correct) and extend: Sherri managed Harlem Heat - both booker-t and stevie-ray should carry the seed  
- **Category:** Minor adjustment · **Confidence:** High

Sherri Martel managed the whole of Harlem Heat (Booker and Stevie), not just Booker.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Harlem Heat w/ Sherri)

### `SEED-undertaker` — Paul Bearer -> The Undertaker

- **Field:** manager seed  
- **Current:** undertaker managed by paul-bearer  
- **Recommended:** Keep as-is (correct)  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Common knowledge

### `SEED-tatanka` — Ted DiBiase -> Tatanka

- **Field:** manager seed  
- **Current:** tatanka managed by ted-dibiase  
- **Recommended:** Move the link to ~turn 5-6 (late February 1995): Tatanka was still a BABYFACE (and unmanaged) in January 1995; he turned heel and joined the Million Dollar Corporation in late February 1995  
- **Category:** Wrong availability date · **Confidence:** High

Tatanka's heel turn and Million Dollar Corporation membership began in February 1995 (he "sold out" to DiBiase following the Royal Rumble period). At the January 1995 start he was an unmanaged face - the game's alignment (face) is right but the manager seed is ~2 months early.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md (Tatanka joins Million Dollar Corporation, Feb 1995)

### `SEED-yokozuna` — Jim Cornette -> Yokozuna

- **Field:** manager seed  
- **Current:** yokozuna managed by jim-cornette  
- **Recommended:** Keep as-is (correct): Camp Cornette managed Yokozuna (with Mr. Fuji also involved)  
- **Category:** Correct · **Confidence:** Medium

By early 1995 Yokozuna was managed by Jim Cornette (Camp Cornette with Owen Hart and the British Bulldog); Mr. Fuji's role had faded but he remained associated.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md (Camp Cornette)

### `SEED-bart-gunn` — Sunny -> Bart Gunn

- **Field:** manager seed  
- **Current:** bart-gunn managed by sunny  
- **Recommended:** Drop at start: Sunny debuted in the WWF in 1994 as TV personality "Tamara Murphy" and only began managing the Smoking Gunns in mid/late 1995; seed the Gunns link ~turn 24+  
- **Category:** Wrong availability date · **Confidence:** Medium

Tammy Sytch arrived in the WWF in 1994 as special-events reporter Tamara Murphy before becoming Sunny. Her run as the Smoking Gunns' manager began later in 1995. As a starting manager-personality she is fine; the bart-gunn client seed is roughly 6-12 months early.

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/tammy-lynn-sytch/ (1994 arrival as Tamara Murphy; Sunny & Skip Bodydonnas 1995)

### `SEED-sabu` — Paul E. Dangerously -> Sabu

- **Field:** manager seed  
- **Current:** sabu managed by paul-e-dangerously  
- **Recommended:** Keep (correct) and extend: Paul E. also managed The Tazmaniac alongside Sabu (the tag team champions from Feb 4, 1995)  
- **Category:** Minor adjustment · **Confidence:** Medium

Paul E. Dangerously managed Sabu in this period and was in the corner of Sabu & The Tazmaniac.

*Sources:* Research: ECW_1995_Q1_Research.md (Sabu & Tazmaniac w/ Paul E. win tag titles Feb 4, 1995)

### `SEED-sandman` — Woman -> The Sandman

- **Field:** manager seed  
- **Current:** sandman managed by woman  
- **Recommended:** Keep (correct) and extend: Woman also managed 2 Cold Scorpio in this period  
- **Category:** Minor adjustment · **Confidence:** High

Nancy "Woman" Sullivan managed both The Sandman and 2 Cold Scorpio in early 1995 (she was in Scorpio's corner at House Party, Jan 5, 1996 and through 1995).

*Sources:* Web: https://en.wikipedia.org/wiki/House_Party_(1996) (2 Cold Scorpio (with Woman) def. Mikey Whipwreck for TV title); Research: ECW_1995_Research.md (Woman managed Sandman & Scorpio)

### `SEED-taz` — Bill Alfonso -> Taz

- **Field:** manager seed  
- **Current:** taz managed by bill-alfonso  
- **Recommended:** Wrong on two counts at start: (1) Bill Alfonso was an ECW REFEREE until his heel turn on June 17, 1995 - not a starting manager; (2) The Tazmaniac's corner man was Paul E. Dangerously. Alfonso became a manager later (RVD from 1996, Taz from ~1997)  
- **Category:** Wrong availability date · **Confidence:** High

Alfonso entered ECW as a ("troubleshooting") referee and only turned heel manager on June 17, 1995; his managing career (RVD & Sabu, later Taz) began in 1996-97. As a January 1995 manager of Taz he is ~1.5-2 years early, and Taz's correct starting valet is Paul E. Dangerously.

*Sources:* Research: ECW_1995_Q3_Research.md (Alfonso heel turn June 17, 1995); Web: https://en.wikipedia.org/wiki/House_Party_(1996) (Jan 5, 1996: "Taz (with Bill Alfonso)" - the pairing existed by 1996, not 1995)

### `manager-roster-bill-alfonso` — Bill Alfonso

- **Field:** roster role  
- **Current:** ECW manager at start  
- **Recommended:** Reclassify as referee until turn ~22 (June 17, 1995), then manager (RVD from 1996)  
- **Category:** Wrong availability date · **Confidence:** High

See SEED-taz finding - Alfonso was a referee, not a manager, in January 1995.

*Sources:* See SEED-taz finding

### `manager-roster-sonny-onoo` — Sonny Onoo

- **Field:** roster role  
- **Current:** WCW manager at start  
- **Recommended:** Verify: Onoo's earliest verified WCW on-screen role found is special referee at Uncensored (March 19, 1995); as a starting manager he is borderline  
- **Category:** Needs manual review · **Confidence:** Medium

Sonny Onoo appeared in WCW around early-mid 1995 (special referee at Uncensored 95) and became a full-time manager of the Japanese talent later in 1995-96. A January 1995 manager role is slightly early but within tolerance.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Onoo special referee, Uncensored 95)

### `MISSING-eric-bischoff` — Eric Bischoff (missing)

- **Field:** manager/authority entry  
- **Current:** Not present as on-air personality  
- **Recommended:** Add as WCW authority/announcer: on-air host by early 1995 and Nitro play-by-play from Sept 4, 1995 (essential for the Nitro era)  
- **Category:** Missing · **Confidence:** High

Bischoff was WCW's on-screen executive/host (and Nitro's lead announcer from the first episode, Sept 4, 1995, until Nov 1996). He is central to the Monday Night War the game models.

*Sources:* Web: https://officialwwe.fandom.com/wiki/WCW_Monday_Nitro (Bischoff commentator Sept 4, 1995 - Nov 18, 1996)

### `MISSING-steve-mcmichael` — Steve "Mongo" McMichael (missing)

- **Field:** manager/announcer entry  
- **Current:** Not present anywhere  
- **Recommended:** Add as WCW announcer from turn 32 (Nitro debut episode, Sept 4, 1995; on the booth until May 1996) and later wrestler  
- **Category:** Missing · **Confidence:** High

Mongo was on the Nitro announce team from the first episode (Sept 4, 1995 - May 13, 1996) before becoming a wrestler (Four Horsemen).

*Sources:* Web: https://officialwwe.fandom.com/wiki/WCW_Monday_Nitro (McMichael Sept 4, 1995 - May 13, 1996)

### `MISSING-miss-elizabeth-manager` — Miss Elizabeth (missing)

- **Field:** manager entry  
- **Current:** Not present anywhere  
- **Recommended:** Add as WCW manager arrival ~turn 49-52 (returned to TV with Randy Savage in January 1996)  
- **Category:** Missing · **Confidence:** High

See the roster Missing finding - Elizabeth returned to WCW TV in January 1996.

*Sources:* Research: WCW_Jan-Mar_1996_Research.md

## 9a. Announcers (v1 findings: starters/arrivals)

### `ANN-starters-WCW` — WCW announce team (starters)

- **Field:** roster  
- **Current:** Tony Schiavone, Bobby Heenan, Dusty Rhodes  
- **Recommended:** Correct core trio for early-1995 WCW TV. Missing: Eric Bischoff (on-air host; Nitro PBP from Sept 1995), Gordon Solie (WCW Pro until July 1, 1995 - script exit ~turn 24), Chris Cruise (secondary shows), Steve McMichael (Nitro from Sept 4, 1995)  
- **Category:** Minor adjustment · **Confidence:** High

The three starters are accurate for WCW's January 1995 booths (Schiavone/Dusty on Saturday Night, Heenan on PPV/Clash). The notable omissions are Gordon Solie (still under contract until July 1995) and Eric Bischoff, plus Mongo for the Nitro era.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Schiavone/Heenan/Rhodes booths; Solie's July 1995 exit); Web: https://officialwwe.fandom.com/wiki/WCW_Monday_Nitro

### `ANN-starters-WWF` — WWF announce team (starters)

- **Field:** roster  
- **Current:** Vince McMahon, Jim Ross, Jerry Lawler  
- **Recommended:** Correct for January 1995 (Vince & Lawler on Raw; JR on secondary shows/PPVs). Optional additions: Todd Pettengill, Jim Cornette (commentary), Dok Hendrix, Stan Lane  
- **Category:** Correct · **Confidence:** High

Accurate core booth for the period; the extras are flavour.

*Sources:* Auditor knowledge: Jan 1995 Raw booth = McMahon & Lawler

### `ANN-starters-ECW` — ECW announce team (starter)

- **Field:** roster  
- **Current:** Joey Styles  
- **Recommended:** Keep as-is (correct): Joey Styles was ECW's voice by this period  
- **Category:** Correct · **Confidence:** High

Accurate.

*Sources:* Research: ECW_1995_Research.md

### `ANN-starters-SMW` — SMW announce team (starter)

- **Field:** roster  
- **Current:** Les Thatcher  
- **Recommended:** Verify/add Bob Caudle: SMW television commentary in this era was handled by Les Thatcher and Bob Caudle (Caudle is in the game under CUSTOM; consider adding him to SMW)  
- **Category:** Minor adjustment · **Confidence:** Medium

Bob Caudle worked with Jim Cornette's SMW (he is listed in the game's COMPANY_DEFS as an SMW figure but only appears as a CUSTOM starter announcer). Adding him to the SMW booth would match the promotion's real TV team.

*Sources:* Auditor note: Caudle-Thatcher SMW booth; verify

### `ANN-mike-tenay` — Mike Tenay (arrival + AWF starter)

- **Field:** arrival turn + company  
- **Current:** Listed as an AWF starter announcer; ANN_ARRIVALS entry at turn 48 (Jan 1996)  
- **Recommended:** Tenay should be a WCW starter announcer (or arrive ~turn 0): he called When Worlds Collide for WCW on Nov 6, 1994 and worked WCW B-shows/Hotline through 1995. Move to the Nitro booth ~turn 80 (Sept 2, 1996). Drop or verify the AWF assignment  
- **Category:** Wrong availability date · **Confidence:** High

Mike Tenay made his WCW announcing debut at the When Worlds Collide PPV (Nov 6, 1994) - every other WCW announcer had declined the gig - then worked Worldwide/Saturday Night and the Hotline through 1995 before joining Nitro's three-man booth on Sept 2, 1996. The game has him starting in the AWF and only arriving in (presumably) WCW in January 1996, roughly a year late. The AWF assignment itself could not be verified.

*Sources:* Web: https://en.wikipedia.org/wiki/Mike_Tenay (WCW announcing debut at When Worlds Collide, Nov 1994; Nitro from Sept 2, 1996)

### `ANN-larry-zbyszko` — Larry Zbyszko (arrival)

- **Field:** arrival turn  
- **Current:** turn 140 (Dec 1997)  
- **Recommended:** turn ~67 (May 27, 1996): Zbyszko joined the Nitro commentary team on the first two-hour Nitro (Schiavone & Zbyszko on hour one)  
- **Category:** Wrong availability date · **Confidence:** High

Zbyszko was a regular WCW commentator from May 27, 1996 (first two-hour Nitro) through 1999 - frequently on hour one with Schiavone. The game's December 1997 arrival is ~18 months late.

*Sources:* Web: https://thehistoryofwwe.com/wcw-monday-nitro-1996/ (May 27, 1996 Nitro: Schiavone & Zbyszko on commentary); Web: https://officialwwe.fandom.com/wiki/WCW_Monday_Nitro (Zbyszko May 27, 1996 - Mar 29, 1999)

### `ANN-michael-cole` — Michael Cole (arrival)

- **Field:** arrival turn  
- **Current:** turn 200 (Mar 1999)  
- **Recommended:** turn ~119 (June 1997): Cole joined the WWF in 1997 (first on-screen appearance June 30, 1997 Raw; backstage interviewer after SummerSlam 97; Raw hour-one announcer with JR & Kevin Kelly from late 1997)  
- **Category:** Wrong availability date · **Confidence:** High

Cole signed with the WWF in early-mid 1997 and first appeared on the June 30, 1997 Raw. By late 1997 he was announcing Raw's first hour. The game's March 1999 arrival is ~22 months late.

*Sources:* Web: https://wikiwand.com/en/articles/Michael_Coulthard (came to WWF 1997; first appeared June 30, 1997 Raw); Web: https://www.wwe.com/superstars/michael-cole (joined WWE 1997)

### `ANN-tazz` — Tazz (arrival)

- **Field:** arrival turn  
- **Current:** turn 260 (June 2000), "he is done wrestling"  
- **Recommended:** turn ~243 (Jan 23, 2000): Tazz debuted in the WWF at the Royal Rumble (def. Kurt Angle); he transitioned to commentary during 2000, which the note captures  
- **Category:** Minor adjustment · **Confidence:** High

Tazz's WWF in-ring debut was the 2000 Royal Rumble. Arriving him in June 2000 skips his Angle feud and the early-2000 ECW comeback match (vs. Awesome, April 2000).

*Sources:* Research: WWF_Jan-Mar_2000_Research.md (Tazz debuts vs Angle at Royal Rumble 2000)

### `ANN-kevin-kelly` — Kevin Kelly (arrival)

- **Field:** arrival turn  
- **Current:** turn 96 (Jan 1997)  
- **Recommended:** Verify: Kelly was doing WWF announcing (Superstars/Shotgun/Action Zone) by 1996 and was on Raw hour one from late 1997; January 1997 is plausible but may be ~1 year late  
- **Category:** Needs manual review · **Confidence:** Low

Kevin Kelly's exact WWF announce-team start needs verification; sources place him alongside Cole and Ross on Raw's first hour from late 1997, with earlier B-show work in 1996.

*Sources:* Web: https://wikiwand.com/en/articles/Michael_Coulthard (late 1997: Cole with JR and Kevin Kelly on Raw hour one)

### `ANN-kent-walton` — Kent Walton (ASW starter)

- **Field:** roster  
- **Current:** ASW starter announcer  
- **Recommended:** Remove or replace: Kent Walton was the iconic ITV wrestling commentator but retired from commentary in 1988 and had no 1995 on-air role; All-Star ran no national TV  
- **Category:** Should be removed · **Confidence:** Medium

Walton's famous "Have a good week... till next week" era ended with ITV wrestling's cancellation in the late 1980s. His presence as a January 1995 starter is anachronistic.

*Sources:* Auditor knowledge: Walton retired from ITV commentary 1988

### `ANN-tirantes` — Tirantes (CMLL starter announcer)

- **Field:** roster  
- **Current:** CMLL starter announcer  
- **Recommended:** Verify/reclassify: Tirantes was a famous CMLL REFEREE, not an announcer  
- **Category:** Needs manual review · **Confidence:** Medium

The best-known "Tirantes" of this era was the CMLL referee. If a CMLL announcer is wanted, Arturo Rivera (already in the game) fits; Tirantes should be reclassified or replaced.

*Sources:* Auditor knowledge: Tirantes as CMLL referee

### `ANN-nwa-starters` — NWA starter announcers (Cappetta, Caudle)

- **Field:** roster  
- **Current:** Gary Michael Cappetta and Bob Caudle as NWA starters  
- **Recommended:** Verify both: Cappetta was WCW's ring announcer in this period (not an NWA-booth announcer), and Caudle's 1995 home was SMW (with WWF part-time TV work)  
- **Category:** Needs manual review · **Confidence:** Medium

The generic-NWA company in the game represents the eastern NWA territory scene. Cappetta was under WCW contract in 1994-96 (ring announcer), so assigning him to the NWA booth is questionable; Caudle is better placed with SMW.

*Sources:* Auditor knowledge: GMC as WCW ring announcer 1994-96

## 9b. Announcer booths, per company (v2 detail)

### `ANN-starters-NJPW` — NJPW booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Shinpei Nogami (78), Antonio Inoki (60)  
- **Recommended:** Correct: Nogami was the voice of NJPW TV; Inoki appeared on commentary/segments as the owner-figure  
- **Category:** Correct · **Confidence:** Medium

Accurate for the period.

*Sources:* Research: NJPW quarterly files

### `ANN-starters-AJPW` — AJPW booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Tsuneharu Fujii (76), Giant Baba (58)  
- **Recommended:** Correct: Fujii was All Japan's longtime announcer; Baba appeared on commentary  
- **Category:** Correct · **Confidence:** Medium

Accurate for the period.

*Sources:* Research: AJPW quarterly files

### `ANN-starters-CMLL-AAA` — CMLL/AAA booths (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** CMLL: Arturo Rivera (82), Tirantes (40) | AAA: Dr. Alfonso Morales (80), Arturo Rivera-AAA (82)  
- **Recommended:** Rivera and Morales are correct legends of Mexican commentary. Tirantes should be removed (he is a referee, not an announcer - see the v1 announcer finding). Consider Pepe Casas/other referees only if the game models officials  
- **Category:** Correct · **Confidence:** Medium

The two genuine commentary icons of the era are correctly present; only the Tirantes mis-cast needs fixing.

*Sources:* Research: CMLL/AAA quarterly files

### `ANN-starters-FMW` — FMW booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Haruka Eigen (70), Kenji Ota (62)  
- **Recommended:** Plausible: Eigen was a genuine FMW-era broadcaster; Kenji Ota unverified - spot-check before relying on him  
- **Category:** Needs manual review · **Confidence:** Low

Deep-cut broadcast research is thin; flagged rather than asserted.

*Sources:* Research: FMW quarterly files

### `ANN-starters-WWC` — WWC booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Hugo Savinovich (82), Carlos Berríos (66)  
- **Recommended:** Correct: Savinovich was the voice of Puerto Rican wrestling (before his WWF Spanish-team move); Berríos is plausible  
- **Category:** Correct · **Confidence:** Medium

Accurate for the period.

*Sources:* Research: WWC quarterly files

### `ANN-starters-USWA` — USWA booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Dave Brown (72), Lance Russell (76)  
- **Recommended:** Correct: the classic Memphis announcing pair (Lance Russell's USWA return alongside Dave Brown is exactly right for 1995)  
- **Category:** Correct · **Confidence:** High

Accurate for the period.

*Sources:* Research: USWA quarterly files

### `ANN-starters-NWA` — NWA booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Gary Michael Cappetta (74), Bob Caudle (70)  
- **Recommended:** Cappetta is a good fit for a generic 1995 NWA ring-announcer role. Bob Caudle, however, was the SMW play-by-play voice in 1995 - consider moving him to the SMW booth (which currently has only Les Thatcher) and replacing his NWA slot  
- **Category:** Minor adjustment · **Confidence:** Medium

Caudle did NWA Pro commentary in the late 80s but by 1995 his home was SMW television.

*Sources:* Research: SMW quarterly files (Caudle on SMW TV)

### `ANN-starters-AJW` — AJW booth (ANN_STARTERS)

- **Field:** booth personnel  
- **Current:** Haruo Murata (74), Katsuya Kobayashi (60)  
- **Recommended:** Plausible joshi-era commentators; unverified individually - spot-check before import  
- **Category:** Needs manual review · **Confidence:** Low

Deep-cut broadcast research is thin; flagged rather than asserted.

*Sources:* Research: AJW quarterly files

### `ANN-missing-okerlund` — Gene Okerlund (missing)

- **Field:** booth personnel  
- **Current:** Not present anywhere  
- **Recommended:** Add to WCW: Okerlund was WCW's interviewer/host (from 1993) and the Nitro backstage host from the first episode (turn 32, Sept 4, 1995)  
- **Category:** Missing · **Confidence:** Medium

The Nitro broadcast team is incomplete without wrestling's most famous interviewer.

*Sources:* Research: WCW quarterly files (Okerlund on Nitro from Sept 1995)

### `ANN-missing-pettingill` — Todd Pettingill (missing)

- **Field:** booth personnel  
- **Current:** Not present anywhere  
- **Recommended:** Optional WWF addition: Pettingill hosted WWF pay-per-view pre-game/all-access segments 1993-97 (with Dok Hendrix/Michael Hayes)  
- **Category:** Missing · **Confidence:** Medium

A minor but era-defining WWF broadcast presence.

*Sources:* Research: WWF quarterly files 1995-97

## 9c. Cruiserweight data (CRUISERWEIGHTS / FA_CW)

### `CRUISERWEIGHTS` — CRUISERWEIGHTS style map

- **Field:** entries  
- **Current:** 13 entries: pillman, alex-wright, one-two-three-kid, sabu, mikey-whipwreck, two-cold-scorpio, hakushi, johnny-b-badd (highflyer); dean-malenko, chris-benoit, eddy-guerrero, chris-jericho, steve-regal (technician)  
- **Recommended:** Keep as-is (correct): all 13 are credible cruiserweight-division workers for the era; Benoit/Eddy/Malenko as "technician" styles match their WCW 1996 roles  
- **Category:** Correct · **Confidence:** High

The style map is sensible: the highflyers were the division's flyers and the technicians were the WCW cruiserweight division's workhorses of 1996-97. Johnny B. Badd was a genuine cruiserweight (WCW CW champion Nov 1995).

*Sources:* Auditor knowledge of the 1996-97 WCW cruiserweight division

### `FA_CW` — FA_CW cruiserweight tag map

- **Field:** entries  
- **Current:** rey-mysterio, psicosis, juventud, ultimo-dragon, rob-van-dam  
- **Recommended:** Correct for Rey/Psicosis/Juventud/Dragon (all genuine cruiserweights). RVD is questionable: he went to ECW as a heavyweight-style act and never worked the WCW cruiserweight division in this era - consider removing him from FA_CW  
- **Category:** Minor adjustment · **Confidence:** Medium

FA_CW is used by the engine to tag FA arrivals as cruiserweights. Rey, Psicosis, Juventud and Ultimo Dragon are exactly right. RVD is a stretch - in ECW he was presented as a heavyweight/TV-division act (his WCW CW association never existed).

*Sources:* Engine: js/engine.js line ~3316 (cw: !!FA_CW[fa.id]); Auditor knowledge: RVD's 1996 ECW role

### `cruiser-raid-split` — Cruiserweight raid timing (timeline event)

- **Field:** event timing  
- **Current:** Single cruiser-raid event at turn 72 (July 1996) releases Rey, Psicosis and Juventud from AAA together  
- **Recommended:** Stagger the raids: Psicosis first (~turn 54: WCW TV debut Feb 1996), Rey Mysterio (~turn 70: debut June 16, 1996), Juventud Guerrera (~turn 81: debut Sept 2, 1996 Nitro)  
- **Category:** Minor adjustment · **Confidence:** High

The AAA-to-WCW exodus was staggered across 1996: Psicosis debuted for WCW in February 1996 (lost to Konnan on the Feb 1996 Nitro, noted as his debut), Rey Mysterio Jr. debuted June 16, 1996, and Juventud Guerrera debuted Sept 2, 1996 (pinned Joe Gomez on Nitro). One lumped July 1996 event compresses ~7 months.

*Sources:* Web: https://thehistoryofwwe.com/wcw-results-1996/ (Psychosis debut Feb 1996; Juventud debut Sept 2, 1996 Nitro); Research: WCW_Apr-Jun_1996_Research.md (Rey debut June 16, 1996)

## 10. Ratings & stats — flagged corrections

Ratings for all 311 workers were compared against 1995–2001 star levels. Items below are the flagged corrections plus three judgment calls explicitly documented as "no change" so nothing is silently decided. Note: the game has no look/presentation stat (closest: finisher + gimmick flavour text), and wrestling style is only modelled for cruiserweights (cw/style tags).

### `owen-hart` — Owen Hart (WWF)

- **Field:** ceiling  
- **Current:** 82  
- **Recommended:** 86-88  
- **Category:** Minor adjustment · **Confidence:** Medium

Owen spent the entire 1995-99 period as an upper-card PPV opener/IC-title-level performer and was regarded as the best pure worker on the roster. A ceiling of 82 rates him below Booker T (88) and equal to Jake-era ceilings; he was a safer long-term bet than that. (His pop 64 and work 88 at start are spot-on.)

*Sources:* Research: WWF quarterly files 1995-99 (Owen consistently upper-card)

### `taz` — Taz (ECW)

- **Field:** ceiling  
- **Current:** 78  
- **Recommended:** 82-84  
- **Category:** Minor adjustment · **Confidence:** Medium

Taz's 1997-99 peak (Human Suplex Machine, FTW champion, one of ECW's two or three biggest acts, WWF debut at Royal Rumble 2000 as a former ECW World Champion) clears a 78 ceiling. Current value is fine for the 1995 Tazmaniac but the ceiling should encode his peak.

*Sources:* Research: ECW quarterly files 1997-99

### `psicosis` — Psicosis (AAA)

- **Field:** ceiling  
- **Current:** 66  
- **Recommended:** 72-76  
- **Category:** Minor adjustment · **Confidence:** Medium

Psicosis had a long WCW cruiserweight run (1996-2000) including a Cruiserweight title reign and several  PPV spots; 66 caps him as a jobber-to-the-stars.

*Sources:* Research: WCW quarterly files 1996-2000

### `juventud` — Juventud Guerrera (AAA)

- **Field:** ceiling  
- **Current:** 66  
- **Recommended:** 72-76  
- **Category:** Minor adjustment · **Confidence:** Medium

Juventud became a three-time WCW Cruiserweight champion (1998-99) and a genuine TV act; like Psicosis he is undervalued by the ceiling.

*Sources:* Research: WCW quarterly files 1996-2000

### `bam-bam-bigelow` — Bam Bam Bigelow (WWF)

- **Field:** work  
- **Current:** 60  
- **Recommended:** 66-70  
- **Category:** Minor adjustment · **Confidence:** Medium

Bigelow was one of the best big-man workers of the era and was trusted with the WrestleMania XI main event (vs Lawrence Taylor, Apr 2, 1995) weeks after the game starts. 60 is low for 1995 Bigelow.

*Sources:* Research: WWF_Jan-Mar_1995_Research.md (WM XI main event)

### `bull-nakano` — Bull Nakano (WWF)

- **Field:** work  
- **Current:** 66  
- **Recommended:** 72-76  
- **Category:** Minor adjustment · **Confidence:** Medium

Nakano's 1994-95 series with Alundra Blayze was the best women's wrestling on US TV; she was an excellent worker by any standard. 66 underrates her.

*Sources:* Research: WWF quarterly files 1994-95 (Blayze/Nakano series)

### `alundra-blayze` — Alundra Blayze (WWF)

- **Field:** work  
- **Current:** 58  
- **Recommended:** 68-72  
- **Category:** Minor adjustment · **Confidence:** Medium

See Bull Nakano: Blayze carried the division and their matches were praised in wrestling media. 58 is a jobber-adjacent work score for someone who was a genuinely good worker.

*Sources:* Research: WWF quarterly files 1994-95

### `jim-duggan` — "Hacksaw" Jim Duggan (WCW)

- **Field:** pop  
- **Current:** 65  
- **Recommended:** 55-60  
- **Category:** Minor adjustment · **Confidence:** Medium

Duggan in January 1995 was a fading nostalgia act in the WCW mid-card (his last real push had been 1993-94). A pop of 65 puts him level with Arn Anderson and above Marty Jannetty-era stars; he was over with live crowds but cooling fast.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Duggan mid-card comedy act)

### `lita` — Lita (FA_ARRIVALS)

- **Field:** age  
- **Current:** 24 at turn 200 (Mar 1999)  
- **Recommended:** 21 at turn 200 (b. April 14, 1975 - she was 23 when she debuted in ECW in 1999 and 24 only in April 2000); recommend age 21 at arrival and the arrival itself should move to turn ~245 (Feb 8, 2000) per the FA findings  
- **Category:** Minor adjustment · **Confidence:** High

Amy Dumas was born April 14, 1975. The FA entry also carries the wrong arrival year (see the FA_ARRIVALS findings) - both the date and the age should be corrected together.

*Sources:* Web: https://en.wikipedia.org/wiki/Lita_(wrestler) (b. Apr 14, 1975; WWF debut Feb 2000)

### `bertha-faye` — Bertha Faye (FA_ARRIVALS)

- **Field:** age  
- **Current:** 27 at turn 32 (Aug 1995)  
- **Recommended:** ~34 at turn 32 (Rhonda Singh b. February 21, 1961; she died in July 2001 aged 40)  
- **Category:** Minor adjustment · **Confidence:** Medium

The game understates her age by roughly seven years.

*Sources:* Web: https://en.wikipedia.org/wiki/Bertha_Faye (b. Feb 21, 1961; d. July 27, 2001)

### `sable` — Sable (FA_ARRIVALS)

- **Field:** age  
- **Current:** 29 at turn 84  
- **Recommended:** 28 (Rena Mero b. August 8, 1967)  
- **Category:** Minor adjustment · **Confidence:** Medium

Off by one at her (already-corrected) WrestleMania XII arrival window.

*Sources:* Web: https://en.wikipedia.org/wiki/Rena_Mero (b. Aug 8, 1967)

### `rick-steiner` — Rick Steiner (FA_ARRIVALS)

- **Field:** age  
- **Current:** 34 at turn 60  
- **Recommended:** 35 (b. March 9, 1961)  
- **Category:** Minor adjustment · **Confidence:** Medium

Off by one at arrival.

*Sources:* Web: https://en.wikipedia.org/wiki/Rick_Steiner (b. Mar 9, 1961)

### `chyna` — Chyna (FA_ARRIVALS)

- **Field:** age  
- **Current:** 27 at turn 100  
- **Recommended:** 26 (Joanie Laurer b. December 27, 1969; 27 only from late December 1997)  
- **Category:** Minor adjustment · **Confidence:** Medium

Off by one at her (correctly dated) February 1997 arrival.

*Sources:* Web: https://en.wikipedia.org/wiki/Chyna (b. Dec 27, 1969)

### `trish-stratus` — Trish Stratus (FA_ARRIVALS)

- **Field:** age  
- **Current:** 24 at turn 260  
- **Recommended:** 23 (Patricia Stratigeas b. December 18, 1975; 24 only from mid-December 2000)  
- **Category:** Minor adjustment · **Confidence:** Medium

Off by one at her June 2000 arrival.

*Sources:* Web: https://en.wikipedia.org/wiki/Trish_Stratus (b. Dec 18, 1975)

### `jimmy-snuka` — Jimmy Snuka (ECW)

- **Field:** age  
- **Current:** 52  
- **Recommended:** 51 (b. May 18, 1943)  
- **Category:** Minor adjustment · **Confidence:** Medium

Off by one at game start.

*Sources:* Web: https://en.wikipedia.org/wiki/Jimmy_Snuka (b. May 18, 1943)

### `hulk-hogan` — Hulk Hogan (WCW)

- **Field:** work  
- **Current:** 42  
- **Recommended:** No change - defensible  
- **Category:** Correct · **Confidence:** Medium

Correct-as-is (judgment call, documented): Hogan's in-ring work was genuinely limited by 1995; 42 is at the harsh end but within reason. His pop 97 and ceiling 97 are correct for the biggest draw in US wrestling.

*Sources:* Research: WCW quarterly files

### `the-rock` — Rocky Maivia (FA_ARRIVALS)

- **Field:** mic  
- **Current:** 80 at debut (turn 88)  
- **Recommended:** No change - defensible  
- **Category:** Correct · **Confidence:** Medium

Judgment call, documented: a mic rating of 80 on debut is generous for the rookie blue-chipper gimmick, but his ceiling (95) and the 1997-98 trajectory justify scouting him as an elite talker. Leave as a deliberate design statement rather than an error.

*Sources:* Research: WWF quarterly files 1996-98

### `rey-mysterio` — Rey Mysterio Jr. (AAA)

- **Field:** pop  
- **Current:** 35  
- **Recommended:** No change - defensible (optionally 40-45 if the game models Mexican popularity separately)  
- **Category:** Correct · **Confidence:** Medium

Judgment call, documented: 35 reflects a US-centric baseline; in Mexico Rey was already a sensation at 20. The game has no per-market popularity, so 35 is a fair compromise. Work 92 and ceiling 90 are exactly right.

*Sources:* Research: AAA quarterly files

## 12. Injuries, deaths, retirements & absences

The engine has the machinery (injured/injuryWeeks, retired, deceased, company=RETIRED) and uses it for Owen Hart (correct), Shawn Michaels (correct) and Bret Hart (acceptable). The in-window events below are missing.

### `brian-pillman-death` — Brian Pillman

- **Field:** death status  
- **Current:** Not modeled: Pillman simply continues (his WCW contract finding moves his exit to ~turn 50)  
- **Recommended:** Add a scripted event ~turn 132 (October 5, 1997): Pillman dies (deceased = true, company = RETIRED). He was under WWF contract when he died  
- **Category:** Missing · **Confidence:** High

Brian Pillman died on October 5, 1997 while an active WWF performer - one of the most consequential real events of the era. The game models Owen Hart's death (turn 211) with the same retired/deceased machinery, so the pattern exists.

*Sources:* Web: https://en.wikipedia.org/wiki/Brian_Pillman (d. Oct 5, 1997)

### `brian-pillman-injury` — Brian Pillman

- **Field:** injury/absence history  
- **Current:** Not modeled  
- **Recommended:** Optional scripted injury ~turn 12-15 (April 1995): Pillman shattered his ankle in a car accident and was off TV for months; also the loose-cannon persona began later in 1995  
- **Category:** Minor adjustment · **Confidence:** Medium

The April 1995 car accident is a well-documented chapter of Pillman's 1995 arc.

*Sources:* Web: https://en.wikipedia.org/wiki/Brian_Pillman (April 1995 car accident)

### `yokozuna-death` — Yokozuna

- **Field:** death / exit status  
- **Current:** Not modeled: Yokozuna remains a WWF wrestler indefinitely  
- **Recommended:** Model his WWF wind-down (last regular appearances late 1997 - early 1998; he worked independents afterward) and add a scripted death event ~turn 279 (October 23, 2000)  
- **Category:** Missing · **Confidence:** High

Yokozuna died October 23, 2000, aged 34, after leaving the WWF's active roster (weight-related). The game runs through 2001+ and he is a seeded wrestler, so the event is in-window.

*Sources:* Web: https://en.wikipedia.org/wiki/Yokozuna_(wrestler) (d. Oct 23, 2000)

### `giant-baba-death` — Giant Baba

- **Field:** death status  
- **Current:** Not modeled: Baba remains AJPW roster/president indefinitely  
- **Recommended:** Add a scripted event ~turn 195 (January 31, 1999): Baba dies; AJPW loses its founder (and, historically, within months, its TV deal momentum)  
- **Category:** Missing · **Confidence:** High

Giant Baba died January 31, 1999. He is a seeded AJPW wrestler and the company's defining figure; his death marked the beginning of All Japan's protracted decline (the exodus followed in 2000).

*Sources:* Web: https://en.wikipedia.org/wiki/Giant_Baba (d. Jan 31, 1999)

### `jumbo-tsuruta-death` — Jumbo Tsuruta

- **Field:** death status  
- **Current:** Not modeled (and the roster finding already recommends semi-active status)  
- **Recommended:** If kept on the roster in any capacity, add a scripted death event ~turn 257 (May 13, 2000)  
- **Category:** Minor adjustment · **Confidence:** Medium

Jumbo died May 13, 2000 - in-window for a game that runs to 2001+.

*Sources:* Web: https://en.wikipedia.org/wiki/Jumbo_Tsuruta (d. May 13, 2000)

### `louie-spicolli-death` — Louie Spicolli

- **Field:** death status  
- **Current:** Not modeled (roster finding removes him from the 1995 start anyway)  
- **Recommended:** If his FA chain is implemented (Rad Radford 1995-96, then ECW from July 1996), end it with a scripted death event ~turn 150 (February 15, 1998)  
- **Category:** Minor adjustment · **Confidence:** High

Spicolli died February 15, 1998 at 27 while under WCW contract.

*Sources:* Web: https://en.wikipedia.org/wiki/Louie_Spicolli (d. Feb 15, 1998)

### `rick-rude-death` — Rick Rude

- **Field:** death status  
- **Current:** Not modeled (Rude is absent from the game entirely - see missing workers)  
- **Recommended:** If the Rude chain is added (retired 1994, ECW Nov 1996-Aug 1997, WCW/nWo 1997-99), end it with a scripted death event ~turn 206 (April 20, 1999)  
- **Category:** Minor adjustment · **Confidence:** High

Rude died April 20, 1999. His arc (career-ending back injury in 1994 while WCW International champion, the ECW comeback as a talking-head antagonist, the famous dual Raw/Nitro appearance night in November 1997, then the nWo) is one of the era's best documented post-retirement stories.

*Sources:* Web: https://en.wikipedia.org/wiki/Rick_Rude (forced retirement 1994; d. Apr 20, 1999)

### `onita-retirement` — Atsushi Onita

- **Field:** retirement status  
- **Current:** Not modeled: Onita is a regular active FMW wrestler  
- **Recommended:** Add a scripted retirement event ~turn 16 (May 5, 1995): Onita's Kawasaki Stadium farewell (a genuine national story in Japan), with an optional un-retirement later in 1996-97  
- **Category:** Minor adjustment · **Confidence:** High

Onita's May 1995 retirement spectacular is the single most famous FMW event of the era. (His real comeback happened in 1996-97, so an optional return beat is historically licensed.)

*Sources:* Research: FMW quarterly files (Kawasaki retirement show, May 5, 1995)

### `austin-neck` — Steve Austin

- **Field:** injury/absence history  
- **Current:** Not modeled  
- **Recommended:** Optional scripted injury/absence ~turns 124-137 (Aug-Nov 1997): the Owen Hart piledriver at SummerSlam 97 (Aug 3) put Austin out until Survivor Series (Nov 9)  
- **Category:** Minor adjustment · **Confidence:** Medium

The neck injury that defined Austin's late career happened in-window. The game already models Owen's death at the same PPV venue family, so the machinery exists.

*Sources:* Web: https://en.wikipedia.org/wiki/Stone_Cold_Steve_Austin (SummerSlam 97 neck injury)

### `shawn-back-modeled` — Shawn Michaels

- **Field:** injury/retirement status  
- **Current:** MODELED: the WrestleMania XIV event (turn 155, Mar 1998) sets shawn.injured = true, injuryWeeks = 52, retired = true, company = RETIRED  
- **Recommended:** Correct as modeled - Shawn's post-WM14 back injury kept him out for 4+ years. (His 2002 comeback is outside the audited window and can be handled by the engine's comeback logic if it exists)  
- **Category:** Correct · **Confidence:** High

Good historical fidelity in the scripted timeline.

*Sources:* Code: js/timeline.js turn 155 (wwf-wrestlemania-14)

### `bret-retirement-modeled` — Bret Hart

- **Field:** injury/retirement status  
- **Current:** MODELED: the Starrcade 1999 event (turn 239, Dec 1999) forces Bret to vacate the title and sets injured/retired/RETIRED  
- **Recommended:** Close to history: the career-ending concussion came from Bill Goldberg's kick on the Oct 24, 1999 Nitro; Bret vacated the title and formally retired in early 2000. Turn 239 (Dec 1999) is a defensible compression of that two-month arc  
- **Category:** Correct · **Confidence:** High

Acceptable simplification of a well-documented sequence.

*Sources:* Code: js/timeline.js turn 239 (wcw-starrcade-99); Web: https://en.wikipedia.org/wiki/Bret_Hart (Goldberg kick Oct 24, 1999)

### `owen-death-modeled` — Owen Hart

- **Field:** death status  
- **Current:** MODELED: the Over the Edge 1999 event (turn 211, May 1999) sets deceased/retired/RETIRED  
- **Recommended:** Correct as modeled - Owen Hart died on May 23, 1999 at Over the Edge. Turn 211 = May 1999, exact  
- **Category:** Correct · **Confidence:** High

The most sensitive real event of the era is handled factually and respectfully in the timeline.

*Sources:* Code: js/timeline.js turn 211 (wwf-over-edge-99)

## 13. TIMELINE — dated event audit

### `ecw-raven-debuts-95` — Raven debuts in ECW

- **Field:** event turn  
- **Current:** turn 39 (Oct 1995 W4)  
- **Recommended:** Remove the event or move to turn 0-1: Raven debuted in ECW on Jan 10, 1995 and is already on the ECW starting roster  
- **Category:** Wrong availability date · **Confidence:** High

Raven debuted at the January 10, 1995 TV taping (the Dreamer feud began immediately) and the game already correctly includes him on the starting ECW roster. A second "Raven debuts" event in October 1995 is both ~9 months late and duplicated by the roster entry.

*Sources:* Research: ECW_1995_Q1_Research.md (Raven debut Jan 10, 1995)

### `ecw-taz-rises-95` — Taz begins his rise in ECW

- **Field:** event turn  
- **Current:** turn 7 (Feb 1995 W4)  
- **Recommended:** Re-date to ~turn 52+ (1996): Taz broke his neck in July 1995 and was out until early 1996; his rise (Human Suplex Machine) began in 1996, peaking 1997-99  
- **Category:** Wrong availability date · **Confidence:** Medium

In February 1995 Taz was The Tazmaniac, a mid-card tag worker (ECW tag champion with Sabu from Feb 4, 1995). He broke his neck in July 1995 (botched spike piledriver) and was inactive until early 1996. A "rise" event in February 1995 is about 18 months early - and the injury itself deserves an event at ~turn 25.

*Sources:* Web: http://wrestlingyearlyreviews.blogspot.com/2016/11/ecw-1996-raven-reigns-supreme-dreamer.html (Taz broken neck July 1995)

### `austin-316` — Austin 3:16

- **Field:** event turn  
- **Current:** turn 84 (Oct 1996 W1)  
- **Recommended:** turn ~71 (June 1996 W4): the "Austin 3:16" speech followed the King of the Ring final on June 23, 1996  
- **Category:** Wrong availability date · **Confidence:** High

The Austin 3:16 catchphrase was born from Austin's post-match speech after winning the 1996 King of the Ring (June 23, 1996). The game fires it in October 1996, ~14 weeks late.

*Sources:* Research: WWF_Apr-Jun_1996_Research.md (Austin wins KOTR June 23, 1996)

### `dx` — D-Generation X is born

- **Field:** event turn  
- **Current:** turn 140 (Dec 1997 W1)  
- **Recommended:** turn ~129-131 (Sept-Oct 1997): the group (Michaels, Helmsley, Chyna, Rude) formed in the weeks after SummerSlam 97, with the "D-Generation X" name in regular use by October 1997. If the event intentionally marks the "D-Generation X" IYH PPV (Dec 7, 1997), re-describe it  
- **Category:** Wrong availability date · **Confidence:** Medium

DX was formed in the autumn of 1997 (post-SummerSlam), not December. The December slot matches the D-X themed In Your House PPV rather than the group's formation.

*Sources:* Research: WWF_Oct-Dec_1997_Research.md (DX formation autumn 1997; D-Generation X: IYH Dec 7, 1997)

### `ecw-raven-title-96` — Raven wins the ECW Championship

- **Field:** event turn  
- **Current:** turn 87 (Oct 1996 W4)  
- **Recommended:** turn ~50 (Jan 27, 1996, aired Jan 30): Raven won the ECW World title from The Sandman on Hardcore TV. (Oct 5, 1996 was Sandman's re-win during Raven's no-show; Raven regained the title Dec 7, 1996 in a barbed-wire match)  
- **Category:** Wrong availability date · **Confidence:** High

Raven's first ECW World title win was on January 27, 1996 (from Sandman), not October 1996. The autumn 1996 events were Sandman briefly regaining the belt (Oct 5, due to Raven no-showing Ultimate Jeopardy) and Raven winning it back at Holiday Hell (Dec 7, 1996).

*Sources:* Web: https://www.onlineworldofwrestling.com/profile/raven/ (Jan 27, 1996: Raven def. Sandman for ECW title; Dec 7, 1996 barbed-wire rematch); Web: https://www.onlineworldofwrestling.com/profile/sandman/ (title chronology)

### `ecw-cactus-departure-95` — Cactus Jack prepares to leave ECW

- **Field:** event turn  
- **Current:** turn 39 (Sept 1995 W4)  
- **Recommended:** Re-date to ~turn 55-60 (early 1996): Cactus's WWF deal (Mankind) was signed in late 1995, with his ECW farewell promos and final appearances running into March 1996  
- **Category:** Needs manual review · **Confidence:** Medium

September 1995 is early for Cactus's ECW exit narrative; his anti-hardcore farewell promos and last ECW appearances came in late 1995 - March 1996 (the Mankind debut was April 1, 1996). As a "prepares to leave" teaser it is roughly 5 months early.

*Sources:* Research: ECW_1996_Q1_Research.md (Cactus farewell March 1996)

### `wcw-flair-returns-99` — Ric Flair returns to WCW television

- **Field:** event turn  
- **Current:** turn 199 (Feb 1999 W4)  
- **Recommended:** turn ~185 (Sept 14, 1998): Flair's famous return to WCW TV came on the Sept 14, 1998 Nitro (Four Horsemen reunion at Fall Brawl). If the event instead marks his 1999 president/champion arc (uncensored, March 14, 1999), re-describe it  
- **Category:** Wrong availability date · **Confidence:** Medium

The emotional "Flair returns" moment was September 1998, not February 1999. February-March 1999 corresponds to his presidency storyline (beating Bischoff for control at Uncensored, March 14, 1999).

*Sources:* Research: WCW_Jul-Sep_1998_Research.md (Flair returns, Four Horsemen reunion, Sept 14, 1998); Research: WCW_Jan-Mar_1999_Research.md (Flair presidency arc)

### `wcw-goldberg-injury-99` — Goldberg is sidelined after an injury

- **Field:** event turn  
- **Current:** turn 203 (Mar 1999 W4)  
- **Recommended:** Verify the exact date of Goldberg's hand injury (the limo-window punch is commonly dated to late 1998/early 1999) before keeping March 1999  
- **Category:** Needs manual review · **Confidence:** Low

Goldberg punched a limousine window and suffered a hand laceration/fracture around the turn of 1999. The exact TV date needs verification; March 1999 may be ~1-2 months late.

*Sources:* Auditor note: needs date verification

### `wcw-final-nitro-2001` — WCW closes after the final Nitro

- **Field:** event turn  
- **Current:** turn 303 (Apr 2001 W4)  
- **Recommended:** turn ~299 (Mar 2001 W4): the final Nitro aired March 26, 2001  
- **Category:** Minor adjustment · **Confidence:** High

The final episode of Nitro (the "Night of Champions" simulcast) was March 26, 2001. The game fires the closure ~4 weeks late.

*Sources:* Research: WCW_2001_Research.md (final Nitro March 26, 2001)

### `ecw-final-show-2001` — ECW's final historical show

- **Field:** event turn  
- **Current:** turn 303 (Apr 2001 W4)  
- **Recommended:** turn ~290 (Jan 2001): ECW's final show was a house show in Pine Bluff, AR on January 13, 2001 (Guilty as Charged, Jan 7, 2001, was the final PPV)  
- **Category:** Wrong availability date · **Confidence:** Medium

ECW effectively ceased operating after the January 13, 2001 house show. An April 2001 "final show" is ~3 months late; the April/May 2001 events should be limited to the bankruptcy filing.

*Sources:* Auditor knowledge: ECW's last show Jan 13, 2001 (Pine Bluff)

### `ecw-bankruptcy-2001` — ECW files for bankruptcy

- **Field:** event turn  
- **Current:** turn 307 (May 2001 W4)  
- **Recommended:** turn ~300-303 (April 2001): HHG Corp. (ECW's parent) filed for Chapter 11 bankruptcy protection in April 2001  
- **Category:** Minor adjustment · **Confidence:** Medium

The bankruptcy filing is generally dated to April 2001; the game's late-May slot is ~4-6 weeks late.

*Sources:* Auditor knowledge: ECW bankruptcy filing April 2001 - verify exact date

### `wcw-invasion-2001` — The WCW/ECW Alliance begins

- **Field:** event turn  
- **Current:** turn ~311 (June 2001 W4)  
- **Recommended:** turn ~316 (July 2001): the Alliance storyline launched with the ECW "revival" on Raw (July 9, 2001) and the Invasion PPV (July 22, 2001)  
- **Category:** Minor adjustment · **Confidence:** Medium

The combined WCW/ECW Alliance angle began in July 2001, not June. The game is ~4 weeks early.

*Sources:* Research: WWF_2001_Research.md (Invasion PPV July 22, 2001)

### `wwf-smackdown` — WWF can launch SmackDown!

- **Field:** event turn  
- **Current:** turn 223 (Aug 1999 W4)  
- **Recommended:** Keep as-is (acceptable): the SmackDown! pilot aired April 29, 1999, but the weekly series began Aug 26, 1999 - the event matches the weekly launch  
- **Category:** Correct · **Confidence:** High

The April 1999 pilot vs August 1999 weekly launch distinction makes turn 223 defensible; optionally add a flavour event at turn ~207 (Apr 29, 1999) for the pilot.

*Sources:* Auditor knowledge: SmackDown pilot April 29, 1999; weekly from Aug 26, 1999

### `womens-revival` — WWF revives the Women's Championship

- **Field:** event turn  
- **Current:** turn 190 (Dec 1998 W3)  
- **Recommended:** turn ~178 (Sept 1998): the Women's title was reactivated in the Sable/Jacqueline programme (Jacqueline became the first champion of the revival in September 1998)  
- **Category:** Minor adjustment · **Confidence:** Medium

The revived Women's Championship was contested from September 1998 (Jacqueline vs Sable). December 1998 is ~3 months late; also note the game's Jacqueline FA arrival (Jan 1997) should align with this arc (see FA_ARRIVALS).

*Sources:* Research: WWF_Jul-Sep_1998_Research.md (Jacqueline/Sable women's title programme)

### `wwf-in-your-house-8` — In Your House 8: International Incident

- **Field:** event name + turn  
- **Current:** turn 75 (July 1996 W4), titled "In Your House 8: International Incident"  
- **Recommended:** Correct show, wrong number: International Incident was IYH 9 (July 21, 1996 = turn 71). IYH 8 was "Beware of Dog" (May 26, 1996 = turn 67) and is MISSING from the timeline  
- **Category:** Major adjustment · **Confidence:** High

The WWF In Your House series in 1996: IYH6 Rage in the Cage (Feb 18), IYH7 Good Friends, Better Enemies (Apr 28), IYH8 Beware of Dog (May 26), IYH9 International Incident (July 21), IYH10 Mind Games (Sept 22), IYH11 Buried Alive (Oct 20), IYH12 It's Time (Dec 15). The game skips Beware of Dog and misnumbers everything from IYH8 onward.

*Sources:* Auditor knowledge: official IYH 1995-96 schedule; cross-checked against game event list

### `wwf-in-your-house-9` — In Your House 9: International Incident

- **Field:** event name  
- **Current:** turn 83 (Sept 1996 W4), titled "In Your House 9: International Incident"  
- **Recommended:** Correct to "In Your House 10: Mind Games" (Sept 22, 1996 = turn 83, the event's current slot - Michaels vs Mankind)  
- **Category:** Major adjustment · **Confidence:** High

The September 1996 In Your House was Mind Games (IYH10). Reusing the "International Incident" name duplicates the July event and erases Mind Games, one of the year's most famous matches.

*Sources:* Auditor knowledge: IYH10 Mind Games, Sept 22, 1996

### `ecw-ppv-names-98-99` — ECW PPV event names 1998-99

- **Field:** event names  
- **Current:** Reused/anachronistic names: ecw-barely-legal-98, ecw-matter-respect-97/98/99, ecw-barely-legal-99, ecw-crossing-line-99  
- **Recommended:** Replace with the real ECW PPV calendar: Barely Legal ran only in 1997; A Matter of Respect only in 1996; Crossing the Line Again was Feb 1997. Real 1998-99 events: Living Dangerously, Hardcore Heaven, Heat Wave, Anarchy Rulz, November to Remember, Guilty as Charged  
- **Category:** Needs manual review · **Confidence:** Medium

Several ECW timeline events use invented PPV names for years when those shows did not run. The core events (Guilty as Charged, Living Dangerously, Hardcore Heaven, Heat Wave, Anarchy Rulz, November to Remember) are already in the timeline - only the duplicated names need renaming.

*Sources:* Auditor knowledge: ECW PPV calendar 1997-2000

### `wwf-royal-rumble-2005-21` — Post-era WWF/WWE events (2005-07)

- **Field:** event dates  
- **Current:** WrestleMania 21 at 2005-03 W4; Vengeance 2006 at 2006-07 W4  
- **Recommended:** WrestleMania 21 was April 3, 2005 (Apr W1); Vengeance 2006 was June 25, 2006 (Jun W4). Minor date corrections for the optional extended-era events  
- **Category:** Minor adjustment · **Confidence:** Medium

Small date drift in the optional post-2001 extension events; the rest of the 2005-07 events sampled (Royal Rumble January dates, One Night Stand June dates, SummerSlam August dates) check out.

*Sources:* Auditor knowledge: WWE PPV calendar 2005-06

### `TIMELINE-verified` — Verified-correct timeline anchors

- **Field:** events  
- **Current:** 291 events in PR #4 timeline  
- **Recommended:** Verified correct (high confidence): nitro-debuts (Sept 1995), madusa-trash (Dec 1995), ringmaster (Jan 1996), mankind (Apr 1996), hall-nash-market (May 1996), curtain-call (May 1996), cruiser-division (Feb 1996), konnan-raid (Jan-Feb 1996), wcw-tv-deal (May 1996), wwf-tv-deal (Mar 1997), barely-legal (Apr 1997), wcw-thunder (Jan 1998), tyson (Mar 1998), rodman (Jul 1997), malone (Jul 1998), leno (Aug 1998), wcw-goldberg-us-title (Apr 1998), wcw-wolfpac (May 1998), wcw-fall-brawl-98 (Sept 1998), wcw-fingerpoke-of-doom (Jan 1999), wcw-sin-2001 (Jan 2001), wcw-superbrawl-revenge-2001 (Feb 2001), wcw-sale-2001 (Mar 2001), wcw-mayhem-2000 (Nov 2000, Steiner wins WCW title), wcw-bash-beach-2000 (Jul 2000, Booker T rises), wcw-spring-stampede-2000 (Apr 2000), ecw-tnn-99 (Aug 1999), ecw-guilty-as-charged-2001 (Jan 2001), and the annual Rumble/Mania/SummerSlam/Survivor Series month placements  
- **Category:** Correct · **Confidence:** High

The PR #4 timeline moved several old events to their correct windows (e.g. Thunder to Jan 1998, Outsiders market to May 1996, cruiser-division to Feb 1996). The above anchors all match history within the game's 4-week calendar resolution.

*Sources:* See individual research files: WCW/WWF/ECW quarterly research in Wrestling-History repo

## 14. Documentation claims (README/ROADMAP)

### `README-blayze` — README.md

- **Field:** claim  
- **Current:** "Alundra Blayze carries the WWF Women's Championship into 1995"  
- **Recommended:** Correct to "Bull Nakano carries the WWF Women's Championship into 1995 (she took it from Blayze on Nov 20, 1994)"  
- **Category:** Minor adjustment · **Confidence:** High

The README repeats the INITIAL_TITLES error (see wwf-women). Blayze regained the title on April 3, 1995 and held it when she appeared on Nitro in December 1995 - the game's madusa-trash event already models that correctly.

*Sources:* Web: https://theofficialwrestlingmuseum.com/wwf-live-event-results-1995.html (Bull Nakano as Women's Champion on Jan-Feb 1995 cards)

### `README-raid` — README.md

- **Field:** claim  
- **Current:** "the Cruiserweight raid of 1995 (Guerrero, Benoit, Malenko)"  
- **Recommended:** Acceptable as written; optionally clarify that Guerrero only arrived in ECW in April 1995 (he was NJPW/AAA-based at the January start) - the raid itself (ECW to WCW, Aug-Sept 1995) is correctly characterised  
- **Category:** Correct · **Confidence:** High

The ECW-to-WCW talent raid of summer 1995 did gut ECW of Guerrero/Benoit/Malenko as described; only Eddie's starting company is at issue (see roster finding).

*Sources:* Research: ECW_1995_Q3_Research.md

### `ROADMAP-cw-exodus` — ROADMAP.md v2.6 note

- **Field:** claim  
- **Current:** "the 1996 cruiserweight exodus (Konnan, Rey Mysterio, Psicosis, Juventud, Ultimo Dragon) is scripted"  
- **Recommended:** Correct as written; see the cruiser-raid timing finding for staggering the individual arrivals across 1996  
- **Category:** Correct · **Confidence:** High

The named wrestlers and the 1996 window are right; only the lumped July 1996 date compresses the real stagger.

*Sources:* See cruiser-raid-split finding

## 11. Missing workers (the complete list)

28 entries across three tiers (plus the 16 missing entries already in the v1 roster findings: Dave Sullivan, Paul Roma, the Roadie, Ron Simmons, Tully Blanchard, the Gangstas, Boo Bradley, D-Lo Brown, Al Snow, Unabomb, Hiroshi Hase, Norio Honaga, Akira Hokuto, Roddy Piper, Ultimate Warrior, Curt Hennig). Suggested stats are starting points for tuning, not assertions — every identity/date fact carries its own confidence.

### Tier 1 — major names, strongly recommended (10)

| ID | Company | Availability (real history) | Key facts | Conf. |
|---|---|---|---|---|
| `kurt-angle` | WWF | FA arrival ~turn 233 (televised debut November 14, 1999, Survivor Series, def. Shawn Stasiak; signed Oct 1998, dark matches from spring 1999) | Olympic gold medallist (1996, 110kg freestyle); WWF Champion by October 2000; four-time WWF/WCW/world champion in-window; the single most conspicuous absence from the game | High |
| `edge` | WWF | FA arrival ~turn 167 (WWF debut June 22, 1998, Raw Is War, entering through the crowd) | Became a multi-time tag/IC/US champion and, by 2001, a main-eventer (King of the Ring 2001, TLC legacy); brother-storyline anchor of The Brood | High |
| `christian` | WWF | FA arrival ~turn 179 (WWF debut September 27, 1998 at In Your House: Breakdown; won the Light Heavyweight title in his first match) | Edge's kayfabe brother; multi-time tag/Light Heavyweight champion; eventual main-eventer (slightly post-window peak) | High |
| `jeff-hardy` | WWF / independent | Seeded unsigned free agent at start (he was a 17-year-old WWF enhancement jobber from 1994, under fake names); WWF contract arrival ~turn 144 (signed 1998) | Half of the Hardy Boyz; TLC main-eventer by 2000-01; at game start he was literally the anonymous kid losing to Razor Ramon and being squashed by Waylon Mercy | High |
| `matt-hardy` | WWF / independent | Seeded unsigned free agent at start (WWF enhancement talent from 1994); WWF contract arrival ~turn 144 (signed 1998) | See Jeff Hardy; also ran the OMEGA indie promotion with Jeff in this window | High |
| `buh-buh-ray-dudley` | ECW | FA arrival ~turn 48-56 (ECW debut late 1995-early 1996 as the stuttering hillbilly of the Dudley family - exact first date unverified) | Half of what became the Dudley Boyz, ECW's dominant tag act (7-time ECW tag champions) before the WWF move in 1999; future WWF tag champion | Medium |
| `d-von-dudley` | ECW | FA arrival ~turn 61 (ECW debut April 13, 1996, Massacre on Queens Boulevard) | The preacher of the Dudley family; teamed with Bubba from February 1997 to form the definitive Dudley Boyz | High |
| `mark-henry` | WWF | FA arrival ~turn 57 (first TV appearance March 11, 1996, press-slamming Jerry Lawler on Raw; in-ring debut September 21, 1996; full-time TV from December 1997) | Olympic weightlifter on a famous 10-year contract; Nation of Domination from January 1998; European champion 1999 | High |
| `rick-rude` | none at start (retired) | Not on the roster at start (CORRECT - he was forced to retire in 1994 by the back injury suffered against Sting in Japan). Add FA chain: ECW arrival ~turn 96 (Nov 1996) (November 1996, as himself), WCW/nWo arrival ~turn 137 (Nov 10, 1997) (November 1997 - the night he appeared on both Raw and Nitro), exit March 1999, deceased April 20, 1999 | One of the best talkers of the era; his post-retirement ECW/WCW runs are famous. The game has no trace of him | High |
| `megumi-kudo` | FMW | Seeded FMW starter (she was the ace of FMW's women's division throughout 1995-96); optional retirement event ~turn 111 (April 29, 1997 farewell) | FMW's female ace; two-time FMW/WWA Women's champion in this window; her retirement spectacular (with the famous shark-tank cage match) was FMW's biggest women's event. The game models FMW with zero women | Medium |

- `kurt-angle` — Kurt Angle: suggested {"age": 30, "pop": 40, "work": 88, "mic": 70, "ceiling": 94, "align": "heel"}
- `edge` — Edge: suggested {"age": 24, "pop": 30, "work": 78, "mic": 60, "ceiling": 92, "align": "face"}
- `christian` — Christian: suggested {"age": 24, "pop": 25, "work": 74, "mic": 62, "ceiling": 88, "align": "heel"}
- `jeff-hardy` — Jeff Hardy: suggested {"age": 17, "pop": 8, "work": 65, "mic": 30, "ceiling": 90, "align": "face"}
- `matt-hardy` — Matt Hardy: suggested {"age": 20, "pop": 8, "work": 62, "mic": 35, "ceiling": 84, "align": "face"}
- `buh-buh-ray-dudley` — Buh Buh Ray Dudley: suggested {"age": 24, "pop": 25, "work": 62, "mic": 60, "ceiling": 82, "align": "face"} *Exact ECW first-appearance date needs verification (Low confidence on the turn; the 1996 window is solid).*
- `d-von-dudley` — D-Von Dudley: suggested {"age": 23, "pop": 25, "work": 58, "mic": 62, "ceiling": 80, "align": "heel"}
- `mark-henry` — Mark Henry: suggested {"age": 24, "pop": 30, "work": 55, "mic": 50, "ceiling": 88, "align": "face"}
- `rick-rude` — "Ravishing" Rick Rude: suggested {"age": 36, "pop": 62, "work": 72, "mic": 82, "ceiling": 76, "align": "heel"}
- `megumi-kudo` — Megumi Kudo: suggested {"age": 25, "pop": 55, "work": 84, "mic": 30, "ceiling": 78, "align": "face", "gender": "f"} *DOB/age approximate; title status and exact retirement date should be verified before import.*

### Tier 2 — valuable additions (14)

| ID | Company | Availability (real history) | Key facts | Conf. |
|---|---|---|---|---|
| `gangrel` | WWF | FA arrival ~turn 174 (WWF debut August 16, 1998, Sunday Night Heat) | Leader of The Brood; the vampire gimmick anchored the gothic mid-card of 1998-99 | Medium |
| `spike-dudley` | ECW | FA arrival ~turn 52+ (Little Spike Dudley debuted in ECW in 1996) | The tiny half-brother underdog act; later a WWF Hardcore champion | Medium |
| `big-dick-dudley` | ECW | FA arrival ~turn 24 (the Dudley family act - Dudley Dudley, Little Snot Dudley, Big Dick Dudley - debuted at Hardcore Heaven, July 1, 1995) | The enforcer of the original 1995 Dudley family; the game already books Dances with Dudley, so this completes the unit | Medium |
| `steve-blackman` | WWF | FA arrival ~turn 142 (returned to WWF TV Dec 15, 1997, on Raw by December 15, 1997) | The shoot-fighting "Lethal Weapon" mid-carder of 1997-2000 (Hardcore champion); had a brief WWF jobber stint in the late 1980s before this window | Medium |
| `test` | WWF | FA arrival ~turn 188 (WWF debut late 1998 - the Motley Crue bodyguard/Motivator of Stephanie McMahon storyline) | Andrew Martin; Corporation member, then the Stephanie McMahon engagement storyline in 1999 | Medium |
| `taka-michinoku` | WWF | FA arrival ~turn 142 (WWF Light Heavyweight tournament, Dec 1997, October-December 1997; champion by December 7, 1997; on Raw December 15, 1997) | The first WWF Light Heavyweight champion of the modern lineage; Michinoku Pro star before that | Medium |
| `bradshaw` | WWF | FA arrival ~turn 48-55 (WWF debut as the cowboy heel in early 1996) | John Layfield: Justin Hawk Bradshaw (1996) -> Blackjack Bradshaw (1997-98) -> Acolyte/APA (1998-2001); in January 1995 he was working independents | Medium |
| `francine` | ECW | Manager/valet arrival ~turn 24 (Hardcore Heaven, July 1, 1995 - Stevie Richards' ringside fan; managed the Pitbulls to the ECW tag titles on Sept 16, 1995; Shane Douglas' Head Cheerleader from 1996) | ECW's defining female manager of 1995-2000 | Medium |
| `beulah-mcgillicutty` | ECW | Manager/valet arrival ~turn 10-26 (first half of 1995, as Raven's valet in the Dreamer feud; the Beulah-Francine rivalry ran from August 1995) | Raven's valet at the center of the Raven/Dreamer program - ECW's hottest storyline of 1995 | Medium |
| `terri-runnels` | WWF | Manager/valet arrival ~turn 38-43 (Marlena debuted alongside Goldust in late 1995) | Goldust's director/valet - the finishing piece of the game's Goldust chain (see the goldust roster finding) | Medium |
| `billy-kidman` | WCW | FA arrival ~turn 37 (WCW TV debut October 14, 1995; joined Raven's Flock August 1997; Cruiserweight champion 1998-2000) | A fixture of the WCW cruiserweight division the game explicitly celebrates | Medium |
| `gene-okerlund` | WCW | Announcer/interviewer STARTER (WCW from 1993; Nitro backstage host from the first episode, Sept 4, 1995 = turn 32) | WCW's signature interviewer; the Nitro announce/host team is incomplete without him | Medium |
| `mima-shimoda` | AJW | Seeded AJW starter (rising junior star in 1995; half of Las Cachorras Orientales with Etsuko Mita; WWWA tag champion by 1996-97) | The top AJW villainess of the late 90s; her chain (with Mita) is the most conspicuous joshi omission after Hokuto | Medium |
| `etsuko-mita` | AJW | Seeded AJW starter (with Shimoda; WWWA tag champion era) | See Mima Shimoda | Medium |

- `gangrel` — Gangrel: suggested {"age": 34, "pop": 28, "work": 62, "mic": 55, "ceiling": 72, "align": "heel"} *Suggested age approximate - verify David Heath DOB before import.*
- `spike-dudley` — Spike Dudley: suggested {"age": 25, "pop": 20, "work": 66, "mic": 45, "ceiling": 70, "align": "face"}
- `big-dick-dudley` — Big Dick Dudley: suggested {"age": 26, "pop": 20, "work": 50, "mic": 25, "ceiling": 55, "align": "heel"}
- `steve-blackman` — Steve Blackman: suggested {"age": 34, "pop": 25, "work": 72, "mic": 25, "ceiling": 74, "align": "face"}
- `test` — Test: suggested {"age": 23, "pop": 30, "work": 60, "mic": 45, "ceiling": 78, "align": "heel"} *Exact debut month within late 1998 needs verification (Low confidence on the specific turn).*
- `taka-michinoku` — Taka Michinoku: suggested {"age": 23, "pop": 20, "work": 78, "mic": 30, "ceiling": 74, "align": "face"}
- `bradshaw` — Justin "Hawk" Bradshaw: suggested {"age": 29, "pop": 25, "work": 62, "mic": 65, "ceiling": 84, "align": "heel"} *Exact 1996 debut month needs verification.*
- `francine` — Francine: suggested {"age": 23, "pop": 25, "work": 30, "mic": 55, "ceiling": 65, "align": "heel", "kind": "manager"}
- `beulah-mcgillicutty` — Beulah McGillicutty: suggested {"age": 24, "pop": 25, "work": 25, "mic": 50, "ceiling": 60, "align": "heel", "kind": "manager"} *Exact first-appearance date needs verification (Low confidence on the specific turn).*
- `terri-runnels` — Terri Runnels (Marlena): suggested {"age": 28, "pop": 25, "work": 20, "mic": 50, "ceiling": 65, "align": "heel", "kind": "manager"}
- `billy-kidman` — Billy Kidman: suggested {"age": 21, "pop": 18, "work": 74, "mic": 30, "ceiling": 80, "align": "face"}
- `gene-okerlund` — "Mean" Gene Okerlund: suggested {"age": 51, "skill": 80, "kind": "announcer"}
- `mima-shimoda` — Mima Shimoda: suggested {"age": 24, "pop": 45, "work": 82, "mic": 30, "ceiling": 78, "align": "heel", "gender": "f"}
- `etsuko-mita` — Etsuko Mita: suggested {"age": 24, "pop": 42, "work": 78, "mic": 28, "ceiling": 74, "align": "heel", "gender": "f"}

### Tier 3 — optional deep cuts (4)

| ID | Company | Availability (real history) | Key facts | Conf. |
|---|---|---|---|---|
| `universo-2000` | CMLL | Seeded CMLL starter (top rudo heavyweight; CMLL World Heavyweight champion multiple times in-window) | The top CMLL heavyweight rudo of the era | Medium |
| `brazo-de-plata` | CMLL | Seeded CMLL starter (beloved comedy técnico; worked WWF Super Astros much later) | CMLL mainstay with genuine drawing power in Mexico | Medium |
| `lance-storm` | ECW | FA arrival mid-1995-96 (ECW debut date needs verification - he was splitting time with WAR in this window) | The technical indie darling who became an ECW tag/TV champion (1998-2000) and WCW US champion (2000) | Low |
| `blue-meanie` | ECW | FA arrival ~turn 44+ (ECW from late 1995; the bWo parody with Stevie Richards ran 1995-97) | The comedy heart of the bWo angle | Medium |

- `universo-2000` — Universo 2000: suggested {"age": 29, "pop": 55, "work": 62, "mic": 25, "ceiling": 70, "align": "heel"}
- `brazo-de-plata` — Brazo de Plata (Super Porky): suggested {"age": 34, "pop": 50, "work": 55, "mic": 35, "ceiling": 62, "align": "face"}
- `lance-storm` — Lance Storm: suggested {"age": 26, "pop": 15, "work": 78, "mic": 45, "ceiling": 78, "align": "heel"} *Needs manual review: exact ECW debut date unverified.*
- `blue-meanie` — Blue Meanie: suggested {"age": 24, "pop": 20, "work": 45, "mic": 50, "ceiling": 58, "align": "heel"}

**Tier-3 mentions worth a line each** (not fully researched here): Balls Mahoney (ECW 1997+), Tajiri/Super Crazy/Rhino/Steve Corino (late-ECW 1998–2000), Jerry Lynn's ECW return (the seeded mr-jl covers his WCW stint — his 1997–2000 ECW run is the missing half), Chavo Guerrero Jr (WCW 1996+), Hugh Morrus (WCW Oct 1995 — unverified), Ernest Miller (WCW 1997), Chris Kanyon (WCW 1995+ as Men at Work-era), the DOA/Harris twins (the seeded Blu Brothers are the same people — a repackaging event covers it), Droz (WWF 1998, career-ending injury Oct 1999), Debra (WCW 1996, WWF 1998), Luna Vachon (WWF return 1997), Kimberly Page (the Diamond Doll, WCW), Joel Gertner (ECW announcer ~1996), Scott Hudson (WCW 1997), Mark Madden (WCW 2000), Jonathan Coachman (WWF 1999).

## 9. The four-week calendar & every future arrival converted

The game calendar (`engine.js dateInfo`): **48 turns per year, 4 turns per month** — `year = 1995 + turn/48`, `month = floor(turn/4) % 12`, `week = (turn % 4) + 1`. Week 1 = the 1st–7th, week 2 = the 8th–14th, week 3 = the 15th–21st, week 4 = the 22nd–month-end. The scripted timeline runs from turn 0 (first week of January 1995) to turn 599 (June 2007); the full per-turn table (600 rows) is in the JSON `turn_calendar` key. Month anchors:

| Year | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1995 | 0–3 | 4–7 | 8–11 | 12–15 | 16–19 | 20–23 | 24–27 | 28–31 | 32–35 | 36–39 | 40–43 | 44–47 |
| 1996 | 48–51 | 52–55 | 56–59 | 60–63 | 64–67 | 68–71 | 72–75 | 76–79 | 80–83 | 84–87 | 88–91 | 92–95 |
| 1997 | 96–99 | 100–103 | 104–107 | 108–111 | 112–115 | 116–119 | 120–123 | 124–127 | 128–131 | 132–135 | 136–139 | 140–143 |
| 1998 | 144–147 | 148–151 | 152–155 | 156–159 | 160–163 | 164–167 | 168–171 | 172–175 | 176–179 | 180–183 | 184–187 | 188–191 |
| 1999 | 192–195 | 196–199 | 200–203 | 204–207 | 208–211 | 212–215 | 216–219 | 220–223 | 224–227 | 228–231 | 232–235 | 236–239 |
| 2000 | 240–243 | 244–247 | 248–251 | 252–255 | 256–259 | 260–263 | 264–267 | 268–271 | 272–275 | 276–279 | 280–283 | 284–287 |
| 2001 | 288–291 | 292–295 | 296–299 | 300–303 | 304–307 | 308–311 | 312–315 | 316–319 | 320–323 | 324–327 | 328–331 | 332–335 |
| 2002 | 336–339 | 340–343 | 344–347 | 348–351 | 352–355 | 356–359 | 360–363 | 364–367 | 368–371 | 372–375 | 376–379 | 380–383 |
| 2003 | 384–387 | 388–391 | 392–395 | 396–399 | 400–403 | 404–407 | 408–411 | 412–415 | 416–419 | 420–423 | 424–427 | 428–431 |
| 2004 | 432–435 | 436–439 | 440–443 | 444–447 | 448–451 | 452–455 | 456–459 | 460–463 | 464–467 | 468–471 | 472–475 | 476–479 |
| 2005 | 480–483 | 484–487 | 488–491 | 492–495 | 496–499 | 500–503 | 504–507 | 508–511 | 512–515 | 516–519 | 520–523 | 524–527 |
| 2006 | 528–531 | 532–535 | 536–539 | 540–543 | 544–547 | 548–551 | 552–555 | 556–559 | 560–563 | 564–567 | 568–571 | 572–575 |
| 2007 | 576–579 | 580–583 | 584–587 | 588–591 | 592–595 | 596–599 | end (t599 = Jun 22–30, 2007) | — | — | — | — | — | — | |

### Future wrestler arrivals — game turn vs. real history

| Entry | Game turn | Game date | Real arrival | Verdict |
|---|---|---|---|---|
| `ahmed-johnson` | 52 | Feb 1–7, 1996 | WWF debut early 1996 (verified in v1 research) | **Correct** |
| `road-warrior-hawk` | 52 | Feb 1–7, 1996 | Hawk returned to WCW in May 1995 for a singles run (~turn 16-19; Warrior angle build); the LOD reunited for SuperBrawl VI, Feb 11, 1996 (~turn 53) | **Wrong availability date** |
| `road-warrior-animal` | 52 | Feb 1–7, 1996 | Animal was out injured; the Road Warriors reunited in WCW for SuperBrawl VI, Feb 11, 1996 (~turn 53) | **Correct within tolerance** |
| `scott-steiner` | 60 | Apr 1–7, 1996 | The Steiners were NJPW-based through 1995 (IWGP tag challenge Jan 4, 1995) and returned to WCW for SuperBrawl VI, Feb 11, 1996 (~turn 53) | **Wrong availability date** |
| `rick-steiner` | 60 | Apr 1–7, 1996 | See Scott Steiner | **Wrong availability date** |
| `chris-jericho` | 72 | Jul 1–7, 1996 | ECW debut early 1996 (~turn 52), WCW debut Aug 20, 1996 (~turn 78) | **Wrong availability date** |
| `rob-van-dam` | 72 | Jul 1–7, 1996 | ECW debut Jan 5, 1996 (~turn 48) | **Wrong availability date** |
| `the-rock` | 88 | Nov 1–7, 1996 | WWF debut at Survivor Series, Nov 17, 1996 (~turn 90; the game's turn 88 is the same month) | **Correct** |
| `ken-shamrock` | 116 | Jun 1–7, 1997 | WWF debut Feb 1997 (special referee at In Your House 13, Feb 16, 1997 = turn 102; in-ring from WrestleMania 13, Mar 23, 1997 = turn 107) | **Wrong availability date** |
| `val-venis` | 132 | Oct 1–7, 1997 | WWF debut May 1998 (~turn 163) | **Wrong availability date** |
| `kane` | 140 | Dec 1–7, 1997 | Badd Blood debut Oct 5, 1997 (~turn 132) | **Wrong availability date** |
| `bill-goldberg` | 160 | May 1–7, 1998 | TV debut Sept 22, 1997 (~turn 131) | **Wrong availability date** |
| `scotty-riggs` | 16 | May 1–7, 1995 | Riggs was still in SMW; his WCW debut with the American Males came Aug-Sept 1995 (~turn 33) | **Wrong availability date** |
| `isaac-yankem` | 24 | Jul 1–7, 1995 | Yankem debuted on WWF TV June-Aug 1995 (first TV ~June 26, 1995 = turn 23; the game's turn 24 is spot on) | **Correct** |
| `bertha-faye` | 32 | Sep 1–7, 1995 | Bertha debuted with the WWF mid-1995 and beat Blayze for the Women's title Aug 27, 1995 (~turn 31) | **Correct** |
| `dean-douglas` | 40 | Nov 1–7, 1995 | Shane Douglas left ECW for the WWF in July 1995 (vignettes from July 29, 1995 = turn 27); age should be 31 | **Wrong availability date** |
| `the-giant` | 40 | Nov 1–7, 1995 | Paul Wight's first appearance was Sept 18, 1995 (~turn 33), in-ring debut at Halloween Havoc Oct 29, 1995 (~turn 38) | **Correct within tolerance** |
| `dances-with-dudley` | 40 | Nov 1–7, 1995 | The Dudley family act debuted July 1, 1995 (Hardcore Heaven) = turn 24 | **Wrong availability date** |
| `sable` | 84 | Oct 1–7, 1996 | Sable debuted at WrestleMania XII, Mar 31, 1996 (~turn 59) | **Wrong availability date** |
| `jacqueline` | 96 | Jan 1–7, 1997 | WWF debut June 1998 (~turn 164) | **Wrong availability date** |
| `chyna` | 100 | Feb 1–7, 1997 | Chyna debuted as Triple H's bodyguard in early 1997 (Feb 1997 per most sources; some date her first appearance to Sept 22, 1996 = turn 83, making the game a few months conservative) | **Correct within tolerance** |
| `lita` | 200 | Mar 1–7, 1999 | WWF debut Feb 8, 2000 (~turn 245); before that she was in ECW in 1999 as Miss Congeniality (~turn 210) | **Wrong availability date** |
| `trish-stratus` | 260 | Jun 1–7, 2000 | WWF TV debut Mar 19, 2000 (~turn 254); the game's June 2000 is ~3 months late (minor) | **Minor - Wrong availability date** |

### Future announcer arrivals — game turn vs. real history

| Entry | Game turn | Game date | Real arrival | Verdict |
|---|---|---|---|---|
| `mike-tenay` | 48 | Jan 1–7, 1996 | Tenay called When Worlds Collide for WCW on Nov 6, 1994 and was on Nitro from Sept 2, 1996 - he should be a WCW STARTER, not a 1996 arrival | **Wrong availability date** |
| `kevin-kelly` | 96 | Jan 1–7, 1997 | Kevin Kelly was on WWF TV from ~1995-96 (Action Zone/Superstars); exact booth-start date needs verification | **Needs manual review** |
| `larry-zbyszko` | 140 | Dec 1–7, 1997 | Zbyszko joined Nitro commentary May 27, 1996 (turn 67), not Dec 1997 | **Wrong availability date** |
| `michael-cole` | 200 | Mar 1–7, 1999 | Cole joined the WWF in 1997, first on-screen June 30, 1997 (~turn 119), not Mar 1999 | **Wrong availability date** |
| `tazz` | 260 | Jun 1–7, 2000 | Tazz signed Jan 2000 (Royal Rumble debut as the reigning ECW champion, Jan 23, 2000 = turn 243) and was an active wrestler first - commentary came later; June 2000 is late | **Wrong availability date** |

Turns referenced elsewhere in the audit, converted: Hogan's nWo turn July 7, 1996 = **turn 72** · Hall's Nitro walk-in May 27, 1996 = **turn 67** · first Nitro Sept 4, 1995 = **turn 32** · WrestleMania XI Apr 2, 1995 = **turn 12** · Bash at the Beach 96 = turn 72 · Montreal Survivor Series Nov 9, 1997 = **turn 137** · WrestleMania XIV Mar 29, 1998 = **turn 154–155** (game event sits at 155 ✓) · Owen Hart May 23, 1999 = **turn 211** (game ✓) · Starrcade 99 Dec 19, 1999 = **turn 238–239** (game Bret retirement event at 239 ✓) · final Nitro Mar 26, 2001 = **turn 299** (game ✓ once the v1 timeline fix is applied).

---

## 10b. Consolidated incorrect-stat list

All stat-level corrections (age/contract/align/rating) from sections 2, 4 and 10 in one place — this is the import checklist:

| ID (target) | Stat | Current | Recommended | Confidence |
|---|---|---|---|---|
| `rad-radford` | roster membership / availability | On the WWF starting roster (age 25, contract 30, pop 28) | Remove from the starting roster; add a WWF arrival ~turn 17-19 (Rad Radford's WWF debut: M | High |
| `louie-spicolli` | roster membership / availability | On the ECW starting roster (age 24, contract 60, pop 32) | Remove from the starting roster; single future chain: WWF as Rad Radford from turn ~18 (Ma | High |
| `sid` | company / availability | WWF starting roster, age 34, contract 100, pop 62 | Move to USWA (he was the reigning USWA Unified World Heavyweight Champion); add a WWF sign | High |
| `eddy-guerrero` | company / availability | ECW starting roster, age 27, contract 36, pop 42 | Remove from the ECW starting roster; make him a free agent (NJPW Black Tiger II / AAA affi | High |
| `jim-neidhart` | company / availability | NWA starting roster, age 39, contract 40, pop 50 | Remove from the NWA starting roster; optionally add an ECW arrival ~turn 12-15 (Neidhart r | High |
| `phineas-godwinn` | identity / company / age | WWF starting roster as Phineas Godwinn, age 34, contract 80, pop 36 | Remove from the starting roster: Dennis Knight was in WCW as Tex Slazenger (with Shanghai  | High |
| `waylon-mercy` | availability / age | WWF starting roster (age 37, contract 30, pop 38) | Convert to a WWF FA arrival ~turn 24 (Spivey rejoined the WWF in June 1995; Waylon Mercy's | High |
| `vader` | contract | Contract 150 turns (~end 1997), no noRenew flag | Contract ~35 turns + noRenew (Vader was fired by WCW in August/September 1995; WWF debut a | High |
| `jeff-jarrett` | contract | Contract 90 turns + noRenew (~Sept 1996) | Contract ~27 turns (Jarrett left the WWF in July 1995 for the USWA); flag him for a 1996-9 | High |
| `bam-bam-bigelow` | contract | Contract 40 turns + noRenew (~October 1995) | Contract ~43 turns + noRenew (last WWF match: Survivor Series, Nov 19, 1995 - a loss to Go | High |
| `british-bulldog` | contract | Contract 120 turns (~July 1997) | Contract ~143 turns (Bulldog jumped to WCW in November/December 1997 alongside Jim Neidhar | High |
| `steve-austin` | contract | Contract 20 turns + noRenew (~June 1995) | Contract ~35 turns + noRenew (Austin was fired by WCW in September 1995; ECW debut Sept 19 | High |
| `brian-pillman` | contract | Contract 56 turns + noRenew (~May 1996) | Contract ~53 turns (Pillman's WCW run ended Feb 11, 1996 - the worked firing that springbo | Medium |
| `chris-benoit` | contract | Contract 28 turns (~July 1995) | Contract ~32-36 turns (Benoit, Guerrero and Malenko left ECW for WCW together in September | High |
| `lex-luger` | contract | Contract 32 turns + noRenew (~September 1995) | Correct: Luger's WWF deal lapsed in 1995 and he appeared on the very first WCW Monday Nitr | High |
| `diesel` | contract | Contract 64 turns + noRenew (~May 1996) | Correct: Nash's last WWF match was April 1996 and he debuted in WCW on the May 27, 1996 Ni | High |
| `razor-ramon` | contract | Contract 64 turns + noRenew (~May 1996) | Correct: Hall's last WWF match was April 1996 and he walked onto Nitro on May 27, 1996 (tu | High |
| `bret-hart` | contract | Contract 144 turns + noRenew (~Jan 1998) | Correct: Bret left the WWF after Survivor Series 1997 (Nov 9, 1997) and debuted in WCW in  | High |
| `one-two-three-kid` | contract | Contract 72 turns + noRenew (~July 1996) | Correct within tolerance: the Kid's WWF run ended in 1996 and he appeared in WCW as Syxx f | Medium |
| `cactus-jack` | contract | Contract 60 turns + noRenew (~Jan 1996) | Correct within tolerance: Foley's ECW farewell came in early 1996 (the Mankind WWF debut f | Medium |
| `alundra-blayze` | contract | Contract 49 turns + noRenew (~Feb 1996) | Correct: Blayze left the WWF in late 1995 and threw the WWF Women's title in the trash on  | High |
| `hulk-hogan` | align | heel, pop 97, age 41, contract 240 | face at the January 1995 start (red-and-yellow top babyface); heel turn at Bash at the Bea | High |
| `booker-t` | align | face (Harlem Heat), age 29, contract 180 | heel: Harlem Heat worked heel through 1995-96 (managed by Sister Sherri from early 1995);  | High |
| `mabel` | align / age | heel, age 27, contract 80, pop 40 | face at the start: Men on a Mission were babyfaces through early 1995 (Mabel's King of the | Medium |
| `mo` | align | heel, age 30, contract 40, pop 33 | face at the start (Men on a Mission were babyfaces until mid-1995) | High |
| `johnny-b-badd` | age | 31 | 34 (Marc Mero, b. July 9, 1960) | High |
| `meng` | age | 31 | 35 (Tonga Uliuli Fifita, b. February 1959) | High |
| `avalanche` | age | 37 | 31 (John Tenta, b. June 22, 1963) | High |
| `marty-jannetty` | age | 35 | 34 (b. February 3, 1960 - turns 35 within the first month of game time) | Medium |
| `rocco-rock` | age | 32 | 41 (b. September 3, 1953) | High |
| `fatu` | age | 24 | 29 (b. October 11, 1965) | High |
| `hakushi` | age | 29 | 28 (b. December 2, 1966) | High |
| `adam-bomb` | age | 31 | 30 (b. March 3, 1964) | High |
| `rey-mysterio` | age | 21 | 20 (b. December 11, 1974) | High |
| `nakanishi` | age | 26 | 27 (b. October 3, 1967) | High |
| `chris-candido` | age | 23 | 24 (b. March 21, 1970) - and he is the reigning NWA World Heavyweight Champion at the star | High |
| `stevie-ray` | age | 36 | ~31-32 (Lane Huffman, b. 1963 per most sources) - verify DOB before changing | Low |
| `hack-meyers` | age | 34 | ~21 (b. June 30, 1973) - verify DOB before changing | Low |
| `johnny-grunge` | age | 31 | ~29 (b. 1965/66) - verify DOB before changing | Low |
| `missy-hyatt` | company / availability | WCW manager on the starting roster | Remove from the WCW start (she left WCW in February 1994); optionally add an ECW manager a | High |
| `owen-hart` | ceiling | 82 | 86-88 | Medium |
| `taz` | ceiling | 78 | 82-84 | Medium |
| `psicosis` | ceiling | 66 | 72-76 | Medium |
| `juventud` | ceiling | 66 | 72-76 | Medium |
| `bam-bam-bigelow` | work | 60 | 66-70 | Medium |
| `bull-nakano` | work | 66 | 72-76 | Medium |
| `alundra-blayze` | work | 58 | 68-72 | Medium |
| `jim-duggan` | pop | 65 | 55-60 | Medium |
| `lita` | age | 24 at turn 200 (Mar 1999) | 21 at turn 200 (b. April 14, 1975 - she was 23 when she debuted in ECW in 1999 and 24 only | High |
| `bertha-faye` | age | 27 at turn 32 (Aug 1995) | ~34 at turn 32 (Rhonda Singh b. February 21, 1961; she died in July 2001 aged 40) | Medium |
| `sable` | age | 29 at turn 84 | 28 (Rena Mero b. August 8, 1967) | Medium |
| `rick-steiner` | age | 34 at turn 60 | 35 (b. March 9, 1961) | Medium |
| `chyna` | age | 27 at turn 100 | 26 (Joanie Laurer b. December 27, 1969; 27 only from late December 1997) | Medium |
| `trish-stratus` | age | 24 at turn 260 | 23 (Patricia Stratigeas b. December 18, 1975; 24 only from mid-December 2000) | Medium |
| `jimmy-snuka` | age | 52 | 51 (b. May 18, 1943) | Medium |
| `hulk-hogan` | work | 42 | No change - defensible | Medium |
| `the-rock` | mic | 80 at debut (turn 88) | No change - defensible | Medium |
| `rey-mysterio` | pop | 35 | No change - defensible (optionally 40-45 if the game models Mexican popularity separately) | Medium |
| `road-warrior-hawk` (FA) | arrival turn | turn 52 (Feb 1996), tagged as "one half of the legendary Road Warriors | Hawk returns to WCW ~turn 17-19 (May 1995) as a singles wrestler (helped Sting vs Meng & K | High |
| `road-warrior-animal` (FA) | arrival turn | turn 52 (Feb 1996), interest WCW | Keep as-is (correct); optionally model his 1995 back-injury layoff | High |
| `scott-steiner` (FA) | arrival turn + note | turn 60 (Apr 1996), note "returning from a run in the independents", i | turn ~52-53 (SuperBrawl VI, Feb 11, 1996); note should read "from New Japan": the Steiners | High |
| `rick-steiner` (FA) | arrival turn + note | turn 60 (Apr 1996), interest WCW | turn ~52-53 (Feb 1996); see scott-steiner finding | High |
| `chris-jericho` (FA) | arrival turn | turn 72 (July 1996), interest ANY | ECW arrival ~turn 52 (ECW debut early 1996); WCW signing ~turn 78 (WCW debut Aug 20, 1996, | High |
| `rob-van-dam` (FA) | arrival turn | turn 72 (July 1996), interest ANY | ECW arrival ~turn 48 (debut at House Party, Jan 5, 1996, defeating Axl Rotten) | High |
| `the-rock` (FA) | arrival turn | turn 88 (Nov 1996 W1), interest WWF | Keep as-is (correct): Survivor Series Nov 17, 1996 debut | High |
| `ken-shamrock` (FA) | arrival turn | turn 116 (June 1997), interest WWF | turn ~101-107 (Feb-Mar 1997): first WWF appearances around In Your House 13: Final Four (F | Medium |
| `val-venis` (FA) | arrival turn | turn 132 (Oct 1997), interest WWF | turn ~163 (May 1998): Val Venis debuted in the WWF in mid-1998 | High |
| `kane` (FA) | arrival turn | turn 140 (Dec 1997), interest WWF | turn ~132 (Oct 1997): Kane debuted at Badd Blood, Oct 5, 1997 | High |
| `bill-goldberg` (FA) | arrival turn | turn 160 (May 1998), interest WCW, note "training at the Power Plant" | turn ~131 (Sept 1997): TV debut on Nitro Sept 22, 1997 (dark matches from June 1997) | High |
| `scotty-riggs` (FA) | arrival turn | turn 16 (May 1995), interest ANY | Verify: Riggs' WCW signing date is unconfirmed; the American Males team formed ~Aug-Sept 1 | Low |
| `isaac-yankem` (FA) | arrival turn | turn 24 (July 1995), interest WWF | Keep as-is (acceptable): Yankem debuted on WWF TV in August 1995 (Lawler's dentist) | High |
| `bertha-faye` (FA) | arrival turn | turn 32 (Sept 1995 W1), interest WWF | Keep as-is (correct): Bertha Faye debuted around SummerSlam 95 (Aug 27, 1995) | High |
| `dean-douglas` (FA) | arrival turn + identity | turn 40 (Nov 1995), interest WWF, separate wrestler (age 36, ceiling 5 | Remove as a separate person (duplicate of shane-douglas): script Shane Douglas's WWF signi | High |
| `the-giant` (FA) | arrival turn | turn 40 (Nov 1995 W1), interest WCW, note "arrives at World War 3" | Keep as-is (acceptable); first appearance was actually earlier: Sept 18, 1995 Nitro, in-ri | High |
| `dances-with-dudley` (FA) | arrival turn | turn 40 (Nov 1995), interest ECW | turn ~24 (July 1995): the Dudley family debuted in ECW on July 1, 1995 | High |
| `sable` (FA) | arrival turn | turn 84 (Oct 1996), interest WWF | turn ~59 (March 1996): Sable debuted at WrestleMania XII (Mar 31, 1996) | High |
| `jacqueline` (FA) | arrival turn | turn 96 (Jan 1997), interest ANY | turn ~164 (June 1998): Jacqueline debuted in the WWF in mid-1998; in Jan 1997 she was Miss | High |
| `chyna` (FA) | arrival turn | turn 100 (Feb 1997 W1), interest WWF | Keep as-is (correct): Chyna debuted in early 1997 as Triple H's bodyguard | High |
| `lita` (FA) | arrival turn | turn 200 (Mar 1999), interest ANY | turn ~210 for ECW (Miss Congeniality, mid-1999) or turn ~245 for the WWF (Essa Rios valet  | High |
| `trish-stratus` (FA) | arrival turn | turn 260 (June 2000 W1), interest WWF | turn ~254 (March 2000): Trish debuted on WWF TV on March 19, 2000 | High |
| `ahmed-johnson` (FA) | arrival turn | turn 52 (Feb 1996), interest WWF | Keep as-is (acceptable): Johnson was in the WWF by late 1995/early 1996 (he held the USWA  | Medium |

## 15. Recommended patch data

133 structured operations (remove / convert-to-arrival / modify / add) are provided in `audit/cwvwwf_patch_recommendations.json`, each with its own confidence level and source note. Nothing has been applied. Summary: 12 removals from the 1995 start, 9 convert-to-arrival ops, 41 wrestler stat/company ops, 18 future-arrival ops, 17 title operations, 3 faction ops, 17 timeline/absence ops, and 10 tier-1 additions.

---

## 16. Verified-correct coverage (the other 237 wrestlers)

Unchanged from v1: every seeded wrestler not carrying a finding was checked and produced no material historical issue (tiered verification notes — full list with per-wrestler notes in the JSON `verified_correct_wrestlers`). Highlights of what v2 confirmed: every top-line age checked out (Hogan 41, Flair 45, Michaels 29, Hart 37, Hashimoto 29, Misawa 32, Hansen 45, Funk 50, Aguayo 49); Luger's 32-turn contract lands on the first Nitro; Diesel/Razor's 64-turn contracts land on the Outsiders angle; Bret's 144 lands on Montreal; Blayze's 49 brackets the trash-can Nitro; Austin's seeded pop 52 / mic 76 / ceiling 94 is a near-perfect read of "Stunning" Steve in January 1995.

---

## Appendix — machine-readable outputs

- `audit/cwvwwf_data_audit.json` — this audit, including the full 600-row turn calendar, the worker classification, all findings with sources, and the verified lists.
- `audit/cwvwwf_patch_recommendations.json` — the structured patch operations (NOT applied).
- Each finding object: `{entity_id, entity_name, field, current_value, recommended_value, category, explanation, confidence, sources[]}`. Missing-worker objects add `{tier, company, availability, facts, suggested_stats}`.

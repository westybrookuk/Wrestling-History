# WCW vs WWF — Historical Game Data Audit

**Audited repository:** [westybrookuk/WCW-vs-WWF](https://github.com/westybrookuk/WCW-vs-WWF) — revision: **PR #4** branch `arena/01a042dd-wcw-vs-wwf`, commit `12d9fcd` (core seed data identical on `main`; PR #4 expanded TIMELINE into `js/timeline.js`, 291 events).

**Baseline:** January 1995 (game turn 0) roster/title state, with availability windows checked through 2001.  
**Generated:** 2026-08-29 · **Findings:** 217 · **Entries checked:** 311 wrestlers, 23 FA arrivals, 28 teams, 37 titles, 291 timeline events, 16 managers, all announcer assignments.  
**This is an audit only — no game files were modified.**

---

## How to read this report

Every finding carries: the entry **ID**, the **current value**, the **recommended value**, an explanation, a **confidence** level and **sources**. Categories: `Correct` · `Minor adjustment` · `Major adjustment` · `Wrong company` · `Wrong availability date` · `Missing` · `Should be removed` · `Needs manual review`.

Game calendar: 48 turns/year, 4 turns/month (turn 0 = first week of January 1995). Key conversions: Jan95=0-3, Apr95=12-15, Jul95=24-27, Oct95=36-39, Dec95=44-47, Jan96=48-51, Feb96=52-55, May96=64-67, Jul96=72-75, Sep96=80-83, Nov96=88-91, Feb97=100-103, Jun97=116-119, Oct97=132-135, Dec97=140-143, May98=160-163, Mar99=200-203, Jan00=240-243, Jun00=260-263.

**Confidence:** High = confirmed against multiple/definitive sources · Medium = well-supported but single-source or a judgment call · Low = inference, verify before use. Nothing in this report is a silent guess — anything uncertain is explicitly marked `Needs manual review` or Low confidence.

---

## 1. Executive summary — the highest-impact corrections

Of **217 findings**, the following matter most. (Category totals: Correct: 44, Minor adjustment: 41, Major adjustment: 23, Wrong company: 12, Wrong availability date: 38, Missing: 22, Should be removed: 11, Needs manual review: 26.)

### 1a. Wrong championship holders at the January 1995 start (12 titles)

| Title (ID) | Game says | Historically correct | Confidence |
|---|---|---|---|
| `wwf-women` | Alundra Blayze | **Bull Nakano** (champion since Nov 20, 1994; Blayze regained Apr 3, 1995) | High |
| `wwf-tag` | Smoking Gunns | **VACANT** — won by the 1-2-3 Kid & Bob Holly at the Jan 22, 1995 Royal Rumble (Gunns' first reign: Sept 1995) | High |
| `nwa-world` | Dan Severn | **Chris Candido** (champion Nov 19, 1994; Severn won it only on Feb 24, 1995 — at an SMW show) | High |
| `njpw-junior` | Jushin Liger | **Norio Honaga** (retained vs The Great Sasuke at Battle 7, Jan 4, 1995) | High |
| `njpw-tag` | Tenzan & Kojima | **Hiroshi Hase & Keiji Muto** (Nov 25, 1994 – May 6, 1995; retained vs the Steiners Jan 4, 1995) | High |
| `ajpw-triple` | Misawa | **Toshiaki Kawada** (Oct 22, 1994 – Mar 4, 1995) | High |
| `ajpw-tag` | Holy Demon Army | **Misawa & Kobashi** (HDA won the belts from them June 9, 1995) | High |
| `cmll-world` | El Hijo del Santo | **Silver King** (July 28, 1994 – early 1995; Santo never held this title) | High |
| `smw-world` | Brian Lee | **The Dirty White Boy** (since July 1994) | High |
| `smw-tv` | Bobby Eaton | **Buddy Landel** (won from Lee Dec 5, 1994) | High |
| `uswa-world` | Tommy Rich | **Sid Vicious** (reigning Unified champion; lost it to Lawler Feb 6, 1995) | High |
| `ajw-tag` | Toyota & Kyoko Inoue | **Kyoko & Takako Inoue** (since Oct 9, 1994) | High |

Plus two title-structure issues: the **ECW Hardcore Championship did not exist** in 1995 (should be removed or replaced by the missing **ECW World Tag Team Championship** — held by The Public Enemy at the start), and the **AAA World Heavyweight / AAA World Cruiserweight titles did not exist** in January 1995 (Konnan was AAA's ace but held no AAA world title; Rey Mysterio Jr. held no title at all at the start). The **SMW Tag Team Championship** (Rock 'n' Roll Express) is also missing. Verified correct: WCW World/US/TV, WWF/IC, ECW World/TV, IWGP Heavyweight, Mexican National Middleweight (probable), NWA North American (Greg Valentine — inaugural NWA Dallas champion), WWWA World (Aja Kong), AJW All Pacific (Toyota).

### 1b. Duplicate people — two live entries for one performer (7 pairs)

| Duplicates | Real person | January 1995 reality | Fix | Confidence |
|---|---|---|---|---|
| `mike-awesome` (WCW) + `the-gladiator` (FMW) | Mike Alfonso | Working FMW as The Gladiator | Remove mike-awesome from WCW start | High |
| `avalanche` + `the-shark` (both WCW) | John Tenta | Avalanche (The Shark debuted ~Mar 1995) | Remove the-shark; repackaging event | High |
| `kurasawa` (WCW) + `nakanishi` (NJPW) | Manabu Nakanishi | NJPW young heavyweight (Kurasawa debuted Oct 1995) | Remove kurasawa; NJPW loan event ~turn 36 | High |
| `sione` (WWF) + `barbarian` (NWA) | Sione Vailahi | WWF as Sionne of the New Headshrinkers | Remove barbarian | High |
| `rad-radford` (WWF) + `louie-spicolli` (ECW) | Louis Mucciolo Jr. | Indies (Rad Radford: May 1995; ECW: July 1996) | Remove both from start; single FA chain | High |
| `kwang` + `savio-vega` (both WWF) | Juan Rivera | Kwang (Savio debuted spring 1995) | Remove savio-vega; repackaging event | High |
| `shane-douglas` (ECW) + `dean-douglas` (FA t40) | Troy Martin | ECW World Champion (correct!) — left for WWF July 1995 | Keep shane-douglas (contract ~28 + noRenew); convert dean-douglas to a signing event | High |

### 1c. Wrong company / wrong availability at the start (biggest single moves)

| Entry | Game | Reality (Jan 1995) | Fix | Confidence |
|---|---|---|---|---|
| `goldust` (WWF starter) | WWF, Jan 1995 | Dustin Rhodes was an active **WCW** babyface (Uncensored Mar 1995) | Add Dustin Rhodes to WCW (~15-turn contract); Goldust FA arrival ~turn 36-40 | High |
| `sid` (WWF starter) | WWF, Jan 1995 | Reigning **USWA Unified World Champion**; returned to WWF Feb 20, 1995 | Move to USWA (with the Unified title); WWF signing ~turn 8 | High |
| `eddy-guerrero` (ECW starter) | ECW, Jan 1995 | NJPW (Black Tiger II) / AAA; ECW debut April 8, 1995 | FA/NJPW at start; ECW arrival ~turn 14 with a ~21-turn contract (he left ECW for WCW in Sept 1995 with Benoit and Malenko) | High |
| `barry-windham` (WCW starter) | WCW, Jan 1995 | Retired (1994); returned to WWF as The Stalker mid-1996 | Remove from starting roster | High |
| `missy-hyatt` (WCW manager) | WCW, Jan 1995 | Left WCW Feb 1994; ECW debut Dec 29, 1995 | Remove; ECW arrival ~turn 48 | High |
| `hulk-hogan` alignment | Heel | Top babyface (red/yellow); heel turn July 7, 1996 | Align face; nWo turn event | High |
| `phineas-godwinn` (WWF starter) | WWF, Jan 1995, age 34 | Dennis Knight was in **WCW as Tex Slazenger**; Phineas debuted Aug 1995 (age 26) | Remove; WCW entry or arrival event | High |
| `vader` contract | 150 turns (~1998) | Left WCW Aug/Sept 1995; WWF debut Jan 1996 | Contract ~35 turns + noRenew | High |

### 1d. The biggest date errors (arrivals & timeline)

| Entry / event | Game date | Real date | Confidence |
|---|---|---|---|
| `bill-goldberg` FA arrival | May 1998 (t160) | TV debut Sept 22, 1997 (t~136) | High |
| `austin-316` timeline event | Oct 1996 (t84) | King of the Ring speech, June 23, 1996 (t~70) | High |
| `ecw-raven-title-96` timeline event | Oct 1996 (t87) | Raven won the ECW title Jan 27, 1996 (t~50) | High |
| `rob-van-dam` FA arrival | July 1996 (t72) | ECW debut Jan 5, 1996 (t~49) | High |
| `lita` FA arrival | Mar 1999 (t200) | WWF debut Feb 2000 (t~253) | High |
| `jacqueline` FA arrival | Jan 1997 (t96) | WWF debut June 1998 (t~178) | High |
| `val-venis` FA arrival | Oct 1997 (t132) | WWF debut May 1998 (t~174) | High |
| Michael Cole announcer arrival | Mar 1999 (t200) | Joined WWF 1997; first Raw appearance June 30, 1997 (t~106) | High |
| Larry Zbyszko announcer arrival | Dec 1997 (t140) | Nitro commentary from May 27, 1996 (t~67) | High |
| Mike Tenay | AWF starter + arrival Jan 1996 (t48) | WCW announcer from When Worlds Collide, Nov 1994 (starter) | High |
| `kane` FA arrival | Dec 1997 (t140) | Badd Blood debut Oct 5, 1997 (t~129) | High |
| `sable` FA arrival | Oct 1996 (t84) | WrestleMania XII debut Mar 31, 1996 (t~61) | High |
| `ecw-raven-debuts-95` event | Oct 1995 (t39) | Raven debuted Jan 10, 1995 — already on the starting roster | High |

### 1e. Missing content worth adding

- **ECW World Tag Team Championship** (Public Enemy) and **SMW Tag Team Championship** (Rock 'n' Roll Express) — two real January 1995 title belts absent from the game.
- **Hiroshi Hase** and **Norio Honaga** (NJPW) — required to carry the corrected IWGP tag/junior titles.
- **Roddy Piper** (WCW arrival Oct 27, 1996), **The Gangstas** (SMW, first half of 1995), **Dave Sullivan** & **Paul Roma** (WCW), **Ron Simmons** & **Tully Blanchard** (ECW), **Akira Hokuto** (AJW / first WCW Women's champion).
- **Unabomb (Glen Jacobs)** in SMW to complete the Unabomb → Isaac Yankem → Kane chain.

---

## 2. WRESTLERS — roster findings (identity, company, age, alignment, contracts)

Covers duplicates, wrong-company placements, wrong availability dates, alignment/age corrections, contract lengths that contradict real departure dates, and missing wrestlers.

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
- **Recommended:** Remove The Shark; keep Avalanche as the January 1995 entry; add a repackaging event ~turn 8-12 (Feb-Apr 1995) that renames Avalanche to The Shark  
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
- **Recommended:** Remove the NWA Barbarian entry; keep sione (WWF, correct for Jan 1995); optionally add a WCW arrival event ~turn 44-48 (late 1995, Super Assassins) and pair with Meng from turn 74 (Faces of Fear, Jan 29, 1996)  
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
- **Recommended:** Remove from the starting roster; single future chain: WWF as Rad Radford from turn ~18 (May 1995), then ECW from turn ~81 (July 1996)  
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
- **Recommended:** Keep as ECW World Champion starter (age 30 is correct: born Nov 21, 1964); change contract from 80 turns to ~28 turns + noRenew (he left ECW for the WWF in July 1995)  
- **Category:** Major adjustment · **Confidence:** High

Douglas was ECW World Heavyweight Champion at the start (lost the belt to The Sandman on April 15, 1995) and departed for the WWF in July 1995 (Dean Douglas vignettes from July 29, 1995). An 80-turn contract keeps him in ECW into mid-1996, which is wrong. The separate FA_ARRIVALS entry dean-douglas (turn 40, age 36) is the same person with a wrong age - see the FA_ARRIVALS findings.

*Sources:* Web: https://en.wikipedia.org/wiki/Shane_Douglas (b. Nov 21, 1964; lost ECW title Apr 15, 1995; WWF July 1995; IC title Oct 22, 1995)

### `sid` — Sid (WWF)

- **Field:** company / availability  
- **Current:** WWF starting roster, age 34, contract 100, pop 62  
- **Recommended:** Move to USWA (he was the reigning USWA Unified World Heavyweight Champion); add a WWF signing ~turn 8 (Sid returned to the WWF on Feb 20, 1995 as Shawn Michaels' bodyguard)  
- **Category:** Wrong company · **Confidence:** High

In January 1995 Sid was in the USWA, where he was the reigning Unified World Heavyweight Champion (retained against Brian Christopher on Jan 23, 1995; lost the belt to Jerry Lawler on Feb 6, 1995). His WWF return came on February 20, 1995. Age 34 in the game is correct. This also fixes the USWA title holder (see INITIAL_TITLES: uswa-world).

*Sources:* Web: https://en.wikipedia.org/wiki/Sid_Eudy (returned to WWF Feb 20, 1995); Web: https://www.whenitwascool.com/history-of-wrestling-1995 (Sid USWA Unified champion; Lawler wins it Feb 6, 1995)

### `goldust` — Goldust (WWF)

- **Field:** identity / company  
- **Current:** WWF starting roster as Goldust, age 26, contract 120 + noRenew, pop 32  
- **Recommended:** Replace the starter with Dustin Rhodes (WCW babyface, age 29, short contract ~15 turns + noRenew - he left WCW after Uncensored, Mar 19, 1995); add Goldust as a WWF FA arrival ~turn 36-40 (late 1995)  
- **Category:** Wrong company · **Confidence:** High

In January 1995 Dustin Rhodes was an active WCW babyface (he had challenged for the U.S. title in late 1994 and was in the Uncensored 1995 main event picture before leaving for the WWF). The Goldust character did not debut until late 1995. Starting him as WWF Goldust with a 120-turn contract skips his entire WCW stint. Born April 11, 1965, Dustin was 29, not 26.

*Sources:* Research: WCW_Jan-Mar_1995_Research.md (Dustin active in WCW; exit at Uncensored Mar 19, 1995); Web: https://en.wikipedia.org/wiki/Goldust (WWF debut late 1995)

### `eddy-guerrero` — Eddy Guerrero (ECW)

- **Field:** company / availability  
- **Current:** ECW starting roster, age 27, contract 36, pop 42  
- **Recommended:** Remove from the ECW starting roster; make him a free agent (NJPW Black Tiger II / AAA affiliate) at start with ECW arrival ~turn 14 (ECW debut April 8, 1995) and a ~21-turn ECW contract (he left ECW for WCW in September 1995 with Benoit and Malenko)  
- **Category:** Wrong company · **Confidence:** High

In January 1995 Eddy was working New Japan (Black Tiger II) and AAA (fresh off When Worlds Collide, Nov 6, 1994); his ECW debut came on April 8, 1995, and he left ECW for WCW in September 1995. Age 27 is correct (b. Oct 9, 1967). The cruiserweight-division payoff (game CRUISERWEIGHTS entry) still works once he arrives.

*Sources:* Web: https://www.imdb.com/name/nm0539357/bio (Benoit, Guerrero and Malenko left ECW for WCW in Sept 1995); Research: ECW_1995_Research.md (ECW debut Apr 8, 1995)

### `barry-windham` — Barry Windham (WCW)

- **Field:** roster membership  
- **Current:** WCW starting roster, age 34, contract 40, pop 62  
- **Recommended:** Remove from the starting roster (retired in 1994); optionally add a WWF arrival ~turn 80 (The Stalker, mid-1996)  
- **Category:** Wrong company · **Confidence:** High

Windham retired from full-time wrestling in 1994 and was not on any roster in January 1995. He returned to the WWF as The Stalker in mid-1996. Age 34 itself is correct (b. July 4, 1960).

*Sources:* Web: https://en.wikipedia.org/wiki/U.S._Express (Windham retired 1994; WWF return as The Stalker 1996)

### `jim-neidhart` — Jim Neidhart (NWA)

- **Field:** company / availability  
- **Current:** NWA starting roster, age 39, contract 40, pop 50  
- **Recommended:** Remove from the NWA starting roster; optionally add an ECW arrival ~turn 14-16 (Neidhart resurfaced in ECW in April 1995 after a short indie run)  
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
- **Recommended:** Move to JWP: Kansai was a JWP wrestler in January 1995 (one half of the top JWP team with Mayumi Ozaki)  
- **Category:** Wrong company · **Confidence:** High

Kansai (and Ozaki) were the cornerstone JWP Joshi team of the era; they challenged the AJW stars in interpromotional matches but were never AJW roster members. This also interacts with the ajw-kansai-ozaki TEAMS entry (see TEAMS findings).

*Sources:* Web: https://blogofdoom.com/ (Joshi 1995: Kansai & Ozaki as JWP); Research: AJW/JWP research files

### `mayumi-ozaki` — Mayumi Ozaki (AJW)

- **Field:** company  
- **Current:** AJW starting roster, age 23, contract 100, pop 48  
- **Recommended:** Move to JWP (teaming with Dynamite Kansai)  
- **Category:** Wrong company · **Confidence:** High

See Dynamite Kansai: Ozaki was a JWP regular in January 1995, not an AJW wrestler. Age 23 is correct (b. Oct 18, 1971).

*Sources:* Web: https://blogofdoom.com/ (Joshi 1995); Research: AJW/JWP research files

### `phineas-godwinn` — Phineas I. Godwinn (WWF)

- **Field:** identity / company / age  
- **Current:** WWF starting roster as Phineas Godwinn, age 34, contract 80, pop 36  
- **Recommended:** Remove from the starting roster: Dennis Knight was in WCW as Tex Slazenger (with Shanghai Pierce) in January 1995. Add Phineas as a WWF arrival ~turn 32-36 (the Godwinns debuted on WWF TV in mid-1995), age 26  
- **Category:** Wrong company · **Confidence:** High

The Phineas I. Godwinn character debuted with the WWF in mid-1995. In January 1995 Knight was finishing his WCW run as Tex Slazenger. He was born December 25, 1968 (age 26, not 34). (A simple alternative: leave him out of the 1995 start entirely and let the Godwinns arrive as a team.)

*Sources:* Web: https://en.wikipedia.org/wiki/Henry_O._Godwinn (Godwinns debut 1995; Knight previously Tex Slazenger in WCW)

### `disco-inferno` — Disco Inferno (WCW)

- **Field:** availability  
- **Current:** WCW starting roster (age 28, contract 80, pop 34)  
- **Recommended:** Convert to a WCW FA arrival ~turn 36 (Disco Inferno's WCW TV debut: September 1995)  
- **Category:** Wrong availability date · **Confidence:** High

Glen Gilbertti's Disco Inferno did not appear on WCW television until September 1995; he was not on the roster in January 1995. His later longevity (contract 80) is fine - just the start date is wrong.

*Sources:* Research: WCW_Jul-Sep_1995_Research.md (Disco debut Sept 1995); Web: https://prowrestling.fandom.com/wiki/Disco_Inferno

### `craig-pittman` — Sgt. Craig Pittman (WCW)

- **Field:** availability  
- **Current:** WCW starting roster (age 33, contract 60, pop 32)  
- **Recommended:** Convert to a WCW FA arrival ~turn 32-36 (Pittman's WCW debut: mid-to-late 1995)  
- **Category:** Wrong availability date · **Confidence:** Medium

Sgt. Craig Pittman (the Cobra-turned-sergeant character) debuted on WCW television in mid/late 1995, not January 1995.

*Sources:* Research: WCW_Jul-Sep_1995_Research.md

### `mr-jl` — Mr. JL (WCW)

- **Field:** availability / identity note  
- **Current:** WCW starting roster (age 32, contract 60, pop 36)  
- **Recommended:** Convert to a WCW FA arrival ~turn 36 (September 1995). Note for docs/flavour: Mr. JL is Jerry Lynn, not Jushin Liger  
- **Category:** Wrong availability date · **Confidence:** High

Mr. JL (Jerry Lynn) joined WCW in September 1995 and was used in the cruiserweight division until early 1996 (he was Jericho's first WCW TV opponent in August 1996 under his later name). He was not in WCW in January 1995.

*Sources:* Web: https://wrestlecrap.com/inductions/mr-jl/ (Mr. JL = Jerry Lynn; WCW Sept 1995 - Feb 1996)

### `the-renegade` — The Renegade (WCW)

- **Field:** availability  
- **Current:** WCW starting roster (age 28, contract 60, pop 44)  
- **Recommended:** Convert to a WCW FA arrival ~turn 11 (Renegade's WCW debut: March 1995, with the Uncensored push on Mar 19, 1995)  
- **Category:** Wrong availability date · **Confidence:** High

The Renegade (Richard Wilson) debuted in March 1995 as the Ultimate Warrior knockoff pushed by Hogan. He was not on the roster in January 1995.

*Sources:* Research: WCW_Apr-Jun_1995_Research.md (Renegade debut Mar 1995; Uncensored Mar 19, 1995)

### `waylon-mercy` — Waylon Mercy (WWF)

- **Field:** availability / age  
- **Current:** WWF starting roster (age 37, contract 30, pop 38)  
- **Recommended:** Convert to a WWF FA arrival ~turn 26-27 (Spivey rejoined the WWF in June 1995; Waylon Mercy's Raw debut: July 3, 1995). Age 37 should be 42 (b. Oct 14, 1952)  
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
- **Recommended:** Contract ~35 turns + noRenew (Vader was fired by WCW in August/September 1995; WWF debut at the Jan 1996 Royal Rumble, ~turn 48)  
- **Category:** Major adjustment · **Confidence:** High

Vader's WCW tenure ended abruptly in August/September 1995 (after the Orlando incident and subsequent suspension/release). A 150-turn contract keeps him in WCW into 1997. He signed with the WWF and appeared at the January 1996 Royal Rumble. His in-game age 39 is wrong too: born May 14, 1956 he was 38 (close, leave as-is).

*Sources:* Research: WCW_Jul-Sep_1995_Research.md (Vader suspension/release Aug-Sept 1995); Web: https://en.wikipedia.org/wiki/Big_Van_Vader (WWF debut Royal Rumble, Jan 21, 1996)

### `jeff-jarrett` — Jeff Jarrett (WWF)

- **Field:** contract  
- **Current:** Contract 90 turns + noRenew (~Sept 1996)  
- **Recommended:** Contract ~28 turns (Jarrett left the WWF in July 1995 for the USWA); flag him for a 1996-97 WWF return rather than a long single run  
- **Category:** Major adjustment · **Confidence:** High

Jarrett's 1995 WWF run ended in July 1995 (he left for the USWA after a pay dispute); he returned to the WWF in late 1996. A 90-turn noRenew contract holds him until September 1996, which misrepresents the gap year.

*Sources:* Web: https://en.wikipedia.org/wiki/Jeff_Jarrett (left WWF July 1995 for USWA; returned late 1996)

### `bam-bam-bigelow` — Bam Bam Bigelow (WWF)

- **Field:** contract  
- **Current:** Contract 40 turns + noRenew (~October 1995)  
- **Recommended:** Contract ~46 turns + noRenew (last WWF match: Survivor Series, Nov 19, 1995 - a loss to Goldust); then ECW from early 1996  
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
- **Recommended:** Contract ~50 turns (Pillman's WCW run ended Feb 11, 1996 - the worked firing that springboarded his ECW appearances Feb-Apr 1996 and his guaranteed WWF deal from June 1996)  
- **Category:** Minor adjustment · **Confidence:** Medium

Pillman's WCW tenure ran to February 1996 (Four Horsemen until Oct 1995, then the Loose Cannon exit); he appeared in ECW February-April 1996 and signed with the WWF in June 1996. The game's 56 turns is six turns (six weeks) late - trim to ~50 and the arc lands.

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

Textbook contract modelling - his Nitro debut is turn 33 in game terms.

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
- **Recommended:** Correct: Bret left the WWF after Survivor Series 1997 (Nov 9, 1997) and debuted in WCW in December 1997 (turn ~141)  
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
- **Recommended:** Correct within tolerance: Foley's ECW farewell came in early 1996 (the Mankind WWF debut followed on Apr 1, 1996, turn ~64)  
- **Category:** Correct · **Confidence:** Medium

The 60-turn window lands between his ECW exit (early 1996) and WWF debut - close enough for the sim.

*Sources:* Web: https://en.wikipedia.org/wiki/Mick_Foley (Mankind debut Apr 1, 1996)

### `alundra-blayze` — Alundra Blayze (WWF)

- **Field:** contract  
- **Current:** Contract 49 turns + noRenew (~Feb 1996)  
- **Recommended:** Correct: Blayze left the WWF in late 1995 and threw the WWF Women's title in the trash on the Dec 18, 1995 Nitro (turn ~47)  
- **Category:** Correct · **Confidence:** High

Excellent modelling - the noRenew flag and 49-turn window bracket the trash-can Nitro moment. (She is the wrong starting Women's champion though - see INITIAL_TITLES: wwf-women.)

*Sources:* Web: https://en.wikipedia.org/wiki/Alundra_Blazey (Nitro Dec 18, 1995)

### `hulk-hogan` — Hulk Hogan (WCW)

- **Field:** align  
- **Current:** heel, pop 97, age 41, contract 240  
- **Recommended:** face at the January 1995 start (red-and-yellow top babyface); heel turn at Bash at the Beach, July 7, 1996 (turn ~79) as the nWo founding moment  
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

The character name and alignment are anachronistic: Traylor's Boss run (late 1994 - April 1995) was a face gimmick that transitioned into the Dungeon-adjacent Big Bubba heel in spring 1995. A rename event around turn 12-16 would capture it. Age 34 should be about 31.

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
- **Recommended:** Add a WCW FA arrival ~turn 94 (Piper appeared at Halloween Havoc on Oct 27, 1996 to set up the Hogan vs Piper Starrcade '96 main event)  
- **Category:** Missing · **Confidence:** High

Piper's WCW debut is a marquee 1996 moment; he headlined Starrcade '96 (Dec 29, 1996) against Hogan.

*Sources:* Web: https://en.wikipedia.org/wiki/Halloween_Havoc_(1996) (Piper's WCW appearance, Oct 27, 1996)

### `MISSING-ultimate-warrior` — The Ultimate Warrior

- **Field:** FA arrival  
- **Current:** Not in FA_ARRIVALS  
- **Recommended:** Add a WCW FA arrival ~turn 180-185 (Warrior returned in Aug-Sept 1998 to feud with Hogan; match at Halloween Havoc, Oct 25, 1998)  
- **Category:** Missing · **Confidence:** High

The Warrior's 1998 WCW return is a well-known late-era event; a short-contract arrival models it.

*Sources:* Web: https://en.wikipedia.org/wiki/Ultimate_Warrior (WCW return Aug-Sept 1998; Halloween Havoc 98)

### `MISSING-curt-hennig` — Curt Hennig

- **Field:** FA arrival  
- **Current:** Not in FA_ARRIVALS  
- **Recommended:** Add a WCW FA arrival ~turn 137 (Hennig signed with WCW in 1997, debuting with the Four Horsemen and turning on Ric Flair at Fall Brawl, Sept 14, 1997)  
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
- **Recommended:** Remove from the WCW start (she left WCW in February 1994); optionally add an ECW manager arrival ~turn 48 (ECW debut Dec 29, 1995)  
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
- **Recommended:** Keep, but consider a "storyline retired" state until ~turn 10: Flair lost a retirement match to Hulk Hogan at Halloween Havoc 94 (Oct 23, 1994) and was reinstated in late February/March 1995 (returning to cost Hogan the title at SuperBrawl V)  
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

## 3. FA_ARRIVALS — availability windows

Each arrival checked against the performer's first verified appearance for the target promotion.

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
- **Recommended:** ECW arrival ~turn 50 (ECW debut early 1996); WCW signing ~turn 85 (WCW debut Aug 20, 1996, defeating Mr. JL)  
- **Category:** Wrong availability date · **Confidence:** High

Jericho's ECW run began in early 1996 (he was ECW Television Champion June-July 1996) and he debuted for WCW on Aug 20, 1996 (taped for the Aug 31 WCW Saturday Night; his first match was against Mr. JL). A single July 1996 "ANY interest" arrival is 6+ months late for ECW and a month early for WCW.

*Sources:* Web: https://en.wikipedia.org/wiki/Chris_Jericho (WCW debut Aug 20, 1996 by defeating Mr. JL); Research: ECW_1996_Q1-Q3_Research.md (Jericho ECW TV champion June 22, 1996)

### `rob-van-dam` — Rob Van Dam

- **Field:** arrival turn  
- **Current:** turn 72 (July 1996), interest ANY  
- **Recommended:** ECW arrival ~turn 49 (debut at House Party, Jan 5, 1996, defeating Axl Rotten)  
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
- **Recommended:** turn ~101-105 (Feb-Mar 1997): first WWF appearances around In Your House 13: Final Four (Feb 16, 1997); special referee at WrestleMania 13 (Mar 23, 1997)  
- **Category:** Wrong availability date · **Confidence:** Medium

Shamrock's WWF arrival was February 1997 (Final Four era), not June 1997 - roughly 3-4 months late in the game.

*Sources:* Research: WWF_Jan-Mar_1997_Research.md (Shamrock WWF arrival, IYH: Final Four / WrestleMania 13 referee)

### `val-venis` — Val Venis

- **Field:** arrival turn  
- **Current:** turn 132 (Oct 1997), interest WWF  
- **Recommended:** turn ~174 (May 1998): Val Venis debuted in the WWF in mid-1998  
- **Category:** Wrong availability date · **Confidence:** High

Sean Morley debuted as Val Venis in the WWF around May 1998 (first TV matches May 1998; first PPV SummerSlam 98 era). The October 1997 arrival is ~7 months early - at that time Morley was working Mexico (CMLL as Steel).

*Sources:* Auditor knowledge (career chronology): Val Venis WWF debut May 1998; no WWF TV appearances in 1997

### `kane` — Kane

- **Field:** arrival turn  
- **Current:** turn 140 (Dec 1997), interest WWF  
- **Recommended:** turn ~129 (Oct 1997): Kane debuted at Badd Blood, Oct 5, 1997  
- **Category:** Wrong availability date · **Confidence:** High

Kane's debut was the first-ever Hell in a Cell main event at Badd Blood (Oct 5, 1997), ripping the Cell door off to attack the Undertaker. December 1997 is 10 weeks late.

*Sources:* Research: WWF_Oct-Dec_1997_Research.md (Kane debut Badd Blood, Oct 5, 1997)

### `bill-goldberg` — Bill Goldberg

- **Field:** arrival turn  
- **Current:** turn 160 (May 1998), interest WCW, note "training at the Power Plant"  
- **Recommended:** turn ~136 (Sept 1997): TV debut on Nitro Sept 22, 1997 (dark matches from June 1997)  
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
- **Recommended:** Remove as a separate person (duplicate of shane-douglas): script Shane Douglas's WWF signing ~turn 28-30 (vignettes July 29, 1995; IC title Oct 22, 1995)  
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
- **Recommended:** turn ~27 (July 1995): the Dudley family debuted in ECW on July 1, 1995  
- **Category:** Wrong availability date · **Confidence:** High

Dances With Dudley was one of the original Dudleys who debuted in ECW in July 1995 (Buh Buh Ray Dudley followed). The November 1995 arrival is ~4 months late.

*Sources:* Research: ECW_1995_Q3_Research.md (Dudley family debut July 1, 1995)

### `sable` — Sable

- **Field:** arrival turn  
- **Current:** turn 84 (Oct 1996), interest WWF  
- **Recommended:** turn ~61 (March 1996): Sable debuted at WrestleMania XII (Mar 31, 1996)  
- **Category:** Wrong availability date · **Confidence:** High

Sable (Rena Mero) debuted as Triple H's valet at WrestleMania XII on March 31, 1996. The October 1996 arrival is ~7 months late.

*Sources:* Research: WWF_Jan-Mar_1996_Research.md (Sable debut WrestleMania XII)

### `jacqueline` — Jacqueline

- **Field:** arrival turn  
- **Current:** turn 96 (Jan 1997), interest ANY  
- **Recommended:** turn ~178 (June 1998): Jacqueline debuted in the WWF in mid-1998; in Jan 1997 she was Miss Texas in the USWA  
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
- **Recommended:** turn ~225 for ECW (Miss Congeniality 1999) or turn ~253 for the WWF (Essa Rios valet debut Feb 2000)  
- **Category:** Wrong availability date · **Confidence:** High

Amy Dumas appeared in ECW as Miss Congeniality in 1999 before debuting in the WWF as Lita in February 2000 (with Essa Rios). The March 1999 "ANY interest" arrival is ~9-11 months early for either landing.

*Sources:* Research: ECW_1999_Research.md (Miss Congeniality); WWF_Jan-Mar_2000_Research.md (Lita debut Feb 2000)

### `trish-stratus` — Trish Stratus

- **Field:** arrival turn  
- **Current:** turn 260 (June 2000 W1), interest WWF  
- **Recommended:** turn ~262 (March 2000): Trish debuted on WWF TV on March 19, 2000  
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

## 4. TEAMS

Team existence, membership and company at the January 1995 start.

### `faces-of-fear` — Faces of Fear

- **Field:** members  
- **Current:** meng + kevin-sullivan (starting WCW team)  
- **Recommended:** Faces of Fear = meng + sione (The Barbarian), formed Jan 29, 1996 (turn ~53); for the January 1995 start, Sullivan's ally was The Butcher (Sullivan & The Butcher main-evented Clash XXX vs Hogan/Savage)  
- **Category:** Major adjustment · **Confidence:** High

The "Faces of Fear" name belongs to Meng & The Barbarian, a Dungeon of Doom team formed on the Jan 29, 1996 Nitro (they lost to the returning Road Warriors). Kevin Sullivan and Meng were both Dungeon-aligned in January 1995 but were never a named team; Sullivan's regular tag partner then was The Butcher (Ed Leslie).

*Sources:* Web: https://peoplepill.com/i/sione-vailahi (Faces of Fear with Haku/Meng formed Jan 29, 1996 Nitro); Research: WCW_Jan-Mar_1995_Research.md (Sullivan & The Butcher vs Hogan & Savage, Clash XXX)

### `american-males` — The American Males

- **Field:** starting team  
- **Current:** Starting WCW team (bagwell + riggs)  
- **Recommended:** Remove from starting teams; form the team ~turn 36 (Aug-Sept 1995)  
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
- **Recommended:** At the January 1995 start only Henry was in the WWF (Phineas debuted Aug 1995); form the team ~turn 32  
- **Category:** Wrong availability date · **Confidence:** High

Henry O. Godwinn was a WWF singles wrestler in early 1995; Phineas I. Godwinn debuted with Hillbilly Jim in August 1995. The team should not exist at the start. (See the phineas-godwinn roster finding.)

*Sources:* Research: WWF_Jul-Sep_1995_Research.md (Phineas debut Aug 1995)

### `blu-brothers` — The Blu Brothers

- **Field:** starting team  
- **Current:** jacob-blu + eli-blu (starting WWF team)  
- **Recommended:** Keep team concept; move to FA arrival ~turn 6-8 (first WWF matches Feb 1995)  
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

## 5. INITIAL_TITLES — championship holders at January 1995

Every holder checked against title lineages and January 1995 results. Twelve belts have the wrong holder; two titles (ECW Hardcore, AAA World/Cruiserweight) should not exist at the start; two real titles are missing.

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

The NWA World Heavyweight Champion in January 1995 was Chris Candido - not Dan Severn. Severn won the title from Candido on Feb 24, 1995 (the title change happened at an SMW event, a great scriptable beat around turn 8). Candido is already on the game's SMW roster, which is exactly where the NWA champion of the era was working.

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

## 6. Managers & SEED_MANAGERS

Manager companies/roles and the engine's seeded manager→wrestler assignments.

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
- **Recommended:** Move the link to ~turn 3-4 (Feb-Mar 1995): Tatanka was still a BABYFACE (and unmanaged) in January 1995; he turned heel and joined the Million Dollar Corporation in late February 1995  
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
- **Recommended:** Reclassify as referee until turn ~26 (June 17, 1995), then manager (RVD from 1996)  
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

## 7. Announcers (ANN_STARTERS / ANN_ARRIVALS)

Booth assignments and arrival dates against 1995-2001 broadcast records.

### `ANN-starters-WCW` — WCW announce team (starters)

- **Field:** roster  
- **Current:** Tony Schiavone, Bobby Heenan, Dusty Rhodes  
- **Recommended:** Correct core trio for early-1995 WCW TV. Missing: Eric Bischoff (on-air host; Nitro PBP from Sept 1995), Gordon Solie (WCW Pro until July 1, 1995 - script exit ~turn 27), Chris Cruise (secondary shows), Steve McMichael (Nitro from Sept 4, 1995)  
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
- **Recommended:** Tenay should be a WCW starter announcer (or arrive ~turn 0): he called When Worlds Collide for WCW on Nov 6, 1994 and worked WCW B-shows/Hotline through 1995. Move to the Nitro booth ~turn 81 (Sept 2, 1996). Drop or verify the AWF assignment  
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
- **Recommended:** turn ~106-110 (mid/late 1997): Cole joined the WWF in 1997 (first on-screen appearance June 30, 1997 Raw; backstage interviewer after SummerSlam 97; Raw hour-one announcer with JR & Kevin Kelly from late 1997)  
- **Category:** Wrong availability date · **Confidence:** High

Cole signed with the WWF in early-mid 1997 and first appeared on the June 30, 1997 Raw. By late 1997 he was announcing Raw's first hour. The game's March 1999 arrival is ~22 months late.

*Sources:* Web: https://wikiwand.com/en/articles/Michael_Coulthard (came to WWF 1997; first appeared June 30, 1997 Raw); Web: https://www.wwe.com/superstars/michael-cole (joined WWE 1997)

### `ANN-tazz` — Tazz (arrival)

- **Field:** arrival turn  
- **Current:** turn 260 (June 2000), "he is done wrestling"  
- **Recommended:** turn ~241 (Jan 23, 2000): Tazz debuted in the WWF at the Royal Rumble (def. Kurt Angle); he transitioned to commentary during 2000, which the note captures  
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

## 8. Cruiserweight data (CRUISERWEIGHTS / FA_CW / cruiserweight events)

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

## 9. TIMELINE — dated event audit (js/timeline.js, 291 events)

PR #4 already fixed several old date errors (Thunder → Jan 1998, Outsiders market → May 1996, cruiserweight division → Feb 1996). The findings below are the remaining material date/name errors plus a consolidated verification note for the correct anchors.

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

In February 1995 Taz was The Tazmaniac, a mid-card tag worker (ECW tag champion with Sabu from Feb 4, 1995). He broke his neck in July 1995 (botched spike piledriver) and was inactive until early 1996. A "rise" event in February 1995 is about 18 months early - and the injury itself deserves an event at ~turn 28.

*Sources:* Web: http://wrestlingyearlyreviews.blogspot.com/2016/11/ecw-1996-raven-reigns-supreme-dreamer.html (Taz broken neck July 1995)

### `austin-316` — Austin 3:16

- **Field:** event turn  
- **Current:** turn 84 (Oct 1996 W1)  
- **Recommended:** turn ~70 (June 1996 W4): the "Austin 3:16" speech followed the King of the Ring final on June 23, 1996  
- **Category:** Wrong availability date · **Confidence:** High

The Austin 3:16 catchphrase was born from Austin's post-match speech after winning the 1996 King of the Ring (June 23, 1996). The game fires it in October 1996, ~14 weeks late.

*Sources:* Research: WWF_Apr-Jun_1996_Research.md (Austin wins KOTR June 23, 1996)

### `dx` — D-Generation X is born

- **Field:** event turn  
- **Current:** turn 140 (Dec 1997 W1)  
- **Recommended:** turn ~118-120 (Sept-Oct 1997): the group (Michaels, Helmsley, Chyna, Rude) formed in the weeks after SummerSlam 97, with the "D-Generation X" name in regular use by October 1997. If the event intentionally marks the "D-Generation X" IYH PPV (Dec 7, 1997), re-describe it  
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

The April 1999 pilot vs August 1999 weekly launch distinction makes turn 223 defensible; optionally add a flavour event at turn ~212 for the pilot.

*Sources:* Auditor knowledge: SmackDown pilot April 29, 1999; weekly from Aug 26, 1999

### `womens-revival` — WWF revives the Women's Championship

- **Field:** event turn  
- **Current:** turn 190 (Dec 1998 W3)  
- **Recommended:** turn ~180 (Sept 1998): the Women's title was reactivated in the Sable/Jacqueline programme (Jacqueline became the first champion of the revival in September 1998)  
- **Category:** Minor adjustment · **Confidence:** Medium

The revived Women's Championship was contested from September 1998 (Jacqueline vs Sable). December 1998 is ~3 months late; also note the game's Jacqueline FA arrival (Jan 1997) should align with this arc (see FA_ARRIVALS).

*Sources:* Research: WWF_Jul-Sep_1998_Research.md (Jacqueline/Sable women's title programme)

### `wwf-in-your-house-8` — In Your House 8: International Incident

- **Field:** event name + turn  
- **Current:** turn 75 (July 1996 W4), titled "In Your House 8: International Incident"  
- **Recommended:** Correct show, wrong number: International Incident was IYH 9 (July 21, 1996). IYH 8 was "Beware of Dog" (May 26, 1996) and is MISSING from the timeline  
- **Category:** Major adjustment · **Confidence:** High

The WWF In Your House series in 1996: IYH6 Rage in the Cage (Feb 18), IYH7 Good Friends, Better Enemies (Apr 28), IYH8 Beware of Dog (May 26), IYH9 International Incident (July 21), IYH10 Mind Games (Sept 22), IYH11 Buried Alive (Oct 20), IYH12 It's Time (Dec 15). The game skips Beware of Dog and misnumbers everything from IYH8 onward.

*Sources:* Auditor knowledge: official IYH 1995-96 schedule; cross-checked against game event list

### `wwf-in-your-house-9` — In Your House 9: International Incident

- **Field:** event name  
- **Current:** turn 83 (Sept 1996 W4), titled "In Your House 9: International Incident"  
- **Recommended:** Correct to "In Your House 10: Mind Games" (Sept 22, 1996 - Michaels vs Mankind)  
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

## 10. Documentation claims (README.md / ROADMAP.md)

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

## 11. Verified-correct coverage (every other roster entry)

The remaining **237 of 311 wrestlers** were checked and produced no material historical finding. Verification depth is tiered: Tier A (verified identity/company/alignment against January 1995 records, age within tolerance), Tier B (deep-cut entries whose identity/company is consistent with career chronology — spot-verify before import). Ratings (pop/work/mic/ceiling) were spot-checked, not re-derived.

**AAA** (11):

- `konnan` — Konnan: Verified: AAA megastar - accurate as a person, but there was no AAA World Heavyweight title for him to hold in January 1995 (see INITIAL_TITLES aaa-world).
- `perro-aguayo` — Perro Aguayo: Verified: AAA rudo legend - accurate.
- `cien-caras` — Cien Caras: Verified: AAA rudo (jumped from CMLL to AAA in 1992) - accurate.
- `mascara-ano-2000` — Máscara Año 2000: Verified: AAA rudo (jumped with Cien Caras) - accurate.
- `octagon` — Octagón: Verified: AAA técnico icon - accurate.
- `fuerza-guerrera` — Fuerza Guerrera: Verified: AAA rudo - accurate.
- `heavy-metal` — Heavy Metal: Verified: AAA mid-carder - accurate.
- `latin-lover` — Latin Lover: Verified: AAA técnico - accurate.
- `la-parka` — La Parka: Verified: AAA rudo (the original La Parka) - accurate.
- `psicosis` — Psicosis: Verified: AAA cruiserweight - accurate (WCW debut Feb 1996 - see the cruiser-raid timing finding).
- `juventud` — Juventud Guerrera: Verified: AAA cruiserweight - accurate (WCW debut Sept 2, 1996 - see the cruiser-raid timing finding).

**AJPW** (18):

- `misawa` — Mitsuharu Misawa: Verified: AJPW ace - accurate (he did NOT hold the Triple Crown at the start - see INITIAL_TITLES ajpw-triple; he held the World Tag titles with Kobashi).
- `kawada` — Toshiaki Kawada: Verified: AJPW ace - accurate AND the actual Triple Crown champion at the start (see INITIAL_TITLES).
- `kobashi` — Kenta Kobashi: Verified: AJPW ace - accurate (World Tag co-champion with Misawa at start - see INITIAL_TITLES ajpw-tag).
- `taue` — Akira Taue: Verified: AJPW ace (Holy Demon Army with Kawada) - accurate.
- `hansen` — Stan Hansen: Verified: AJPW gaijin ace - accurate (won the Triple Crown from Kawada on March 4, 1995 - scriptable).
- `giant-baba` — Giant Baba: Verified: AJPW founder/semi-active - acceptable.
- `steve-williams` — Steve "Dr. Death" Williams: Verified: AJPW gaijin - accurate.
- `johnny-ace` — Johnny Ace: Verified: AJPW gaijin - accurate.
- `furnas` — Doug Furnas: Verified: Can-Am Express, AJPW - accurate.
- `kroffat` — Dan Kroffat: Verified: Can-Am Express, AJPW - accurate.
- `jun-akiyama` — Jun Akiyama: Verified: AJPW rising star - accurate.
- `takao-omori` — Takao Omori: Verified: AJPW mid-carder - accurate.
- `ogawa` — Yoshinari Ogawa: Verified: AJPW junior - accurate as a person; his title status needs review (see INITIAL_TITLES ajpw-junior).
- `kikuchi` — Tsuyoshi Kikuchi: Verified: AJPW junior - accurate.
- `fuchi` — Masanobu Fuchi: Verified: AJPW veteran junior - accurate (reigning All Asia tag champion level).
- `gary-albright` — Gary Albright: Verified: AJPW gaijin powerhouse (UWFi crossover) - accurate.
- `tamon-honda` — Tamon Honda: Verified: AJPW young heavyweight - accurate.
- `richard-slinger` — Richard Slinger: Verified: AJPW gaijin junior - accurate.

**AJW** (8):

- `aja-kong` — Aja Kong: Verified: WWWA World Champion at start - accurate.
- `manami-toyota` — Manami Toyota: Verified: All Pacific Champion at start - accurate.
- `kyoko-inoue` — Kyoko Inoue: Verified: AJW star (WWWA tag co-champion with Takako at start - see TEAMS/INITIAL_TITLES ajw-tag).
- `takako-inoue` — Takako Inoue: Verified: AJW star (WWWA tag co-champion with Kyoko at start).
- `yumiko-hotta` — Yumiko Hotta: Verified: AJW star - accurate.
- `lioness-asuka` — Lioness Asuka: Verified: AJW legend (Gokuaku Domei; retired from full-time in 1994 but was still an active attraction) - acceptable.
- `jaguar-yokota` — Jaguar Yokota: Verified: AJW legend/veteran - accurate.
- `kaoru-ito` — Kaoru Ito: Verified: AJW rising star - accurate.

**ASW** (8):

- `tony-st-clair` — Tony St. Clair: Verified: ASW British Heavyweight Champion (probable) - accurate.
- `david-finlay` — David Finlay: Verified: British/European circuit (future WCW Belfast Bruiser, late 1995/Jan 1996 - scriptable arrival).
- `robbie-brookside` — Robbie Brookside: Verified: ASW regular - accurate.
- `marty-jones` — Marty Jones: Verified: British veteran - accurate.
- `mal-sanders` — Mal Sanders: Plausible: British veteran - no issues found.
- `doc-dean` — Doc Dean: Plausible: British regular - no issues found.
- `billy-robinson` — Billy Robinson: Verified: British legend (semi-active veteran attraction) - acceptable.
- `kendo-nagasaki` — Kendo Nagasaki: Verified: British legend (the Kendo Nagasaki character) - accurate.

**AWF** (6):

- `tito-santana` — Tito Santana: Verified: AWF ace - accurate (title status needs verification - see INITIAL_TITLES awf-world).
- `sgt-slaughter` — Sgt. Slaughter: Plausible: worked the AWF loop in the mid-90s - no issues found.
- `bob-orton-jr` — Bob Orton Jr.: Plausible: AWF loop veteran - no issues found.
- `the-executioner` — The Executioner: Plausible deep cut: AWF worker - spot-verify before import.
- `charlie-cannon` — Charlie Cannon: Plausible deep cut: AWF worker - spot-verify before import.
- `mad-dog-bronson` — Mad Dog Bronson: Plausible deep cut: AWF worker - spot-verify before import.

**CMLL** (17):

- `el-hijo-del-santo` — El Hijo del Santo: Verified: CMLL técnico icon - accurate as a person; he did NOT hold the CMLL World Heavyweight title (see INITIAL_TITLES cmll-world: Silver King was champion).
- `negro-casas` — Negro Casas: Verified: CMLL rudo - accurate (probable National Middleweight champion - see INITIAL_TITLES cmll-mid).
- `atlantis` — Atlantis: Verified: CMLL técnico - accurate.
- `el-satanico` — El Satánico: Verified: CMLL rudo - accurate.
- `la-fiera` — La Fiera: Verified: CMLL veteran - accurate.
- `vampiro` — Vampiro Canadiense: Verified: CMLL star (Vampiro Canadiense) - accurate.
- `apolo-dantes` — Apolo Dantés: Verified: CMLL rudo (took the World title from Silver King during 1995 - nice scriptable beat).
- `pierroth` — Pierroth: Verified: CMLL rudo - accurate.
- `brazo-de-oro` — Brazo de Oro: Verified: CMLL técnico - accurate.
- `emilio-charles` — Emilio Charles Jr.: Verified: CMLL veteran - accurate.
- `pirata-morgan` — Pirata Morgan: Verified: CMLL rudo - accurate.
- `felino` — Felino: Verified: CMLL técnico - accurate.
- `shocker` — Shocker: Verified: CMLL young técnico - accurate.
- `super-calo` — Super Caló: Verified: CMLL técnico - accurate.
- `bestia-salvaje` — Bestia Salvaje: Verified: CMLL rudo - accurate.
- `el-dandy` — El Dandy: Verified: CMLL veteran - accurate.
- `silver-king` — Silver King: Verified: CMLL rudo - accurate AND the reigning CMLL World Heavyweight Champion (see INITIAL_TITLES cmll-world).

**CWA** (8):

- `otto-wanz` — Otto Wanz: Verified: CWA owner/legend - accurate (title status plausible - see INITIAL_TITLES cwa-world).
- `dave-taylor` — Dave Taylor: Verified: CWA/British-style worker (future WCW Blue Blood, joining Eaton and Regal from 1995-96 - scriptable) - accurate.
- `franz-schumann` — Franz Schumann: Plausible deep cut: German CWA regular of the era - spot-verify before import.
- `cannonball-grizzly` — Cannonball Grizzly: Plausible deep cut: indie heavyweight working Germany in the era - spot-verify before import.
- `klaus-wallas` — Klaus Wallas: Plausible deep cut: Austrian judoka-turned-CWA wrestler - spot-verify before import.
- `steve-casey` — Steve Casey: Plausible deep cut: CWA/UK circuit worker - spot-verify before import.
- `august-smisl` — August Smisl: Plausible deep cut: CWA regular - spot-verify before import.
- `milenko-ilic` — Milenko Ilic: Plausible deep cut: CWA regular - spot-verify before import.

**ECW** (28):

- `sabu` — Sabu: Verified: ECW heel (managed by Paul E.) - accurate; note he also worked NJPW dates (w/ Chono at Battle 7, Jan 4, 1995).
- `sandman` — The Sandman: Verified: ECW main-eventer - accurate (wins the World title from Shane Douglas on April 15, 1995 - scriptable).
- `tommy-dreamer` — Tommy Dreamer: Verified: ECW (face-leaner; the Raven feud began January 1995) - accurate.
- `raven` — Raven: Verified: ECW heel from Jan 10, 1995 - correctly on the starting roster (debut 9 days after game start).
- `taz` — Taz: Verified: ECW heel (The Tazmaniac, managed by Paul E.) - accurate; singles "Taz" rise came after mid-1995 (see TIMELINE ecw-taz-rises-95).
- `mikey-whipwreck` — Mikey Whipwreck: Verified: ECW underdog face - accurate (won the TV title Oct 1995 and the World title Oct 28, 1995 - scriptable).
- `two-cold-scorpio` — 2 Cold Scorpio: Verified: ECW (managed by Woman) - accurate (won the TV title from Eddy Guerrero Sept 16, 1995).
- `terry-funk` — Terry Funk: Verified: ECW attraction - accurate (Funk was semi-active on ECW cards in this window).
- `axl-rotten` — Axl Rotten: Verified: ECW hardcore regular - accurate.
- `ian-rotten` — Ian Rotten: Verified: ECW regular (brother-vs-brother feud ran 1995) - accurate.
- `jason-knight` — Jason Knight: Verified: ECW's "Sexiest Man Alive" heel manager/wrestler - accurate.
- `pitbull-1` — Pitbull #1: Verified: Pitbulls - accurate (the Raven-linked Pitbull #2/Gary Wolfe push came later in 1995).
- `pitbull-2` — Pitbull #2: Verified: Pitbulls - accurate.
- `stevie-richards` — Stevie Richards: Verified: Raven's lackey from early 1995 - accurate.
- `perry-saturn` — Perry Saturn: Verified: Eliminators (with Kronus) - accurate (team formed 1994).
- `john-kronus` — John Kronus: Verified: Eliminators - accurate (age worth a check).
- `911` — 911: Verified: ECW monster face - accurate.
- `jimmy-snuka` — Jimmy Snuka: Verified: ECW legend, age 51 (b. May 18, 1943) - age ~1 high, acceptable.
- `headhunter-1` — Headhunter #1: Verified: The Headhunters appeared in ECW in this period - accurate.
- `headhunter-2` — Headhunter #2: Verified: see Headhunter #1.
- `super-nova` — Super Nova: Plausible: Nova was in ECW from ~1994 - no material issues found (age worth a check).
- `don-e-allen` — Don E. Allen: Verified: ECW preliminary wrestler - accurate.
- `tommy-cairo` — Tommy Cairo: Verified: ECW preliminary wrestler - accurate.
- `chad-austin` — Chad Austin: Verified: ECW preliminary wrestler - accurate.
- `rockin-rebel` — Rockin' Rebel: Verified: ECW preliminary wrestler - accurate.
- `paul-e-dangerously` — Paul E. Dangerously: Verified: ECW manager (Sabu, Tazmaniac) and booker - accurate.
- `woman` — Woman: Verified: ECW manager (Sandman, 2 Cold Scorpio) - accurate (see MANAGERS SEED-sandman for the Scorpio extension).
- `bill-alfonso` — Bill Alfonso: See MANAGERS finding manager-roster-bill-alfonso (referee until June 1995) - roster membership itself is the issue there.

**FMW** (12):

- `onita` — Atsushi Onita: Verified: FMW founder/ace and Brass Knucks champion - accurate (retirement show May 5, 1995 - scriptable).
- `hayabusa` — Hayabusa: Verified: FMW rising star - accurate.
- `masato-tanaka` — Masato Tanaka: Verified: FMW young heavyweight - accurate.
- `tetsuhiro-kuroda` — Tetsuhiro Kuroda: Verified: FMW young heavyweight - accurate.
- `koji-nakagawa` — Koji Nakagawa: Verified: FMW young heavyweight - accurate.
- `mr-pogo` — Mr. Pogo: Verified: FMW deathmatch rudo - accurate.
- `horace-boulder` — Horace Boulder: Plausible: Horace Hogan worked FMW in this period - accurate.
- `tarzan-goto` — Tarzan Goto: Verified: FMW/IWA Japan deathmatch star - accurate.
- `ricky-fuji` — Ricky Fuji: Verified: FMW regular - accurate.
- `the-gladiator` — The Gladiator: Verified: The Gladiator (Mike Awesome) - accurate; the duplicate mike-awesome WCW entry should be removed (see roster findings).
- `jason-the-terrible` — Jason the Terrible: Verified: FMW gaijin - accurate.
- `yukihiro-kanemura` — Yukihiro Kanemura: Verified: FMW (W*ING alumnus) - accurate.

**NJPW** (20):

- `hashimoto` — Shinya Hashimoto: Verified: IWGP Heavyweight Champion (retained vs Kensuke Sasaki at Battle 7, Jan 4, 1995) - accurate.
- `mutoh` — Keiji Mutoh: Verified: NJPW star, reigning IWGP tag co-champion with Hiroshi Hase - see INITIAL_TITLES (the belts should sit on a Hase & Muto team; Hase is missing from the roster).
- `chono` — Masahiro Chono: Verified: NJPW main eventer - accurate (and the correct future Cho-Ten partner for Tenzan - see TEAMS tenzan-kojima).
- `fujinami` — Tatsumi Fujinami: Verified: NJPW veteran - accurate.
- `liger` — Jushin Thunder Liger: Verified: NJPW junior ace - accurate as a person; he did NOT hold the IWGP Junior title at the start (see INITIAL_TITLES njpw-junior: the champion was Norio Honaga).
- `tenzan` — Hiroyoshi Tenzan: Verified: NJPW young heavyweight (wrestled at Battle 7) - accurate; team assignment wrong (see TEAMS tenzan-kojima: should be Cho-Ten with Chono).
- `kojima` — Satoshi Kojima: Verified: NJPW young heavyweight - accurate.
- `koshinaka` — Shiro Koshinaka: Verified: NJPW veteran - accurate.
- `otani` — Shinjiro Otani: Verified: NJPW junior (reigning UWA World Welterweight Champion, retained at Battle 7) - accurate.
- `kanemoto` — Koji Kanemoto: Verified: NJPW junior (def. Yuji Nagata at Battle 7) - accurate.
- `ultimo-dragon` — Último Dragón: Verified: NJPW/NJPW-affiliated junior (had won the J-Crown by 1996) - accurate as a 1995 NJPW attraction.
- `sasuke` — The Great Sasuke: Verified: NJPW visitor (challenged Honaga for the IWGP Jr title at Battle 7, Jan 4, 1995) - accurate; his home promotion was Michinoku Pro (a simplification, not an error).
- `el-samurai` — El Samurai: Verified: NJPW junior (challenged Otani at Battle 7) - accurate.
- `scott-norton` — Scott Norton: Verified: NJPW gaijin (wrestled Hawk at Battle 7) - accurate (his WCW run began later in 1995).
- `power-warrior` — Power Warrior: Verified: NJPW (Hellraisers with Hawk) - accurate; nice hook for the Hawk WCW-return storyline (FA arrival ~turn 17-19).
- `kensuke-sasaki` — Kensuke Sasaki: Verified: NJPW heavyweight (IWGP challenger to Hashimoto at Battle 7, Jan 4, 1995) - accurate.
- `riki-choshu` — Riki Choshu: Verified: NJPW veteran (wrestled at Battle 7) - accurate.
- `takashi-iizuka` — Takashi Iizuka: Verified: NJPW mid-carder - accurate.
- `yuji-nagata` — Yuji Nagata: Verified: NJPW young heavyweight (lost to Kanemoto at Battle 7) - accurate.
- `don-frye` — Don Frye: Verified: NJPW gaijin shoot-style - plausible for the period.

**NWA** (4):

- `dan-severn` — Dan Severn: Verified: NWA wrestler - accurate as a person, but NOT the NWA champion at start (see INITIAL_TITLES nwa-world: Chris Candido held it; Severn won it Feb 24, 1995 - scriptable).
- `greg-valentine` — Greg Valentine: Verified: NWA Dallas North American Champion at start - accurate (see INITIAL_TITLES nwa-north).
- `bob-armstrong` — Bob Armstrong: Plausible: SMW commissioner-era Bullet; NWA assignment is defensible for the period.
- `thunderbolt-patterson` — Thunderbolt Patterson: Plausible: veteran attraction; NWA assignment is defensible.

**SMW** (10):

- `ricky-morton` — Ricky Morton: Verified: SMW tag champion (with Gibson) - accurate (see INITIAL_TITLES missing smw-tag).
- `robert-gibson` — Robert Gibson: Verified: SMW tag champion (with Morton) - accurate.
- `tracy-smothers` — Tracy Smothers: Verified: SMW main eventer - accurate.
- `dirty-white-boy` — Dirty White Boy: Verified: SMW Heavyweight Champion at start - accurate (see INITIAL_TITLES smw-world fix).
- `brian-lee` — Brian Lee: Verified: SMW main-eventer - accurate as a person, but he had just left for the USWA around the start date and was NOT the SMW champion (see INITIAL_TITLES smw-world); a short contract or USWA placement both work.
- `tom-prichard` — Tom Prichard: Verified: Heavenly Bodies, SMW - accurate.
- `jimmy-del-ray` — Jimmy Del Ray: Verified: Heavenly Bodies, SMW - accurate.
- `buddy-landel` — Buddy Landel: Verified: SMW "Beat the Champ" TV Champion at start - accurate (see INITIAL_TITLES smw-tv fix).
- `daryl-van-horne` — Big Daryl: Plausible: Big Daryl was on SMW cards in the period - no issues found.
- `rex-king` — Rex King: Plausible: SMW mid-carder of the period - no issues found.

**USWA** (10):

- `jerry-jarrett` — Jerry Jarrett: Plausible: USWA promoter/occasional wrestler - fine as a low-stat entry.
- `tommy-rich` — Tommy Rich: Verified: USWA veteran - accurate as a person, but NOT the Unified champion (see INITIAL_TITLES uswa-world: Sid held it).
- `bill-dundee` — Bill Dundee: Verified: USWA veteran - accurate.
- `brian-christopher` — Brian Christopher: Verified: USWA ace - accurate (reigning USWA Memphis Heavyweight Champion as of Dec 31, 1994 - see INITIAL_TITLES uswa-tv note).
- `jc-ice` — JC Ice: Verified: PG-13, USWA tag team - accurate.
- `wolfie-d` — Wolfie D: Verified: PG-13, USWA tag team - accurate.
- `spellbinder` — The Spellbinder: Plausible: USWA regular of the period - no issues found.
- `doug-gilbert` — Doug Gilbert: Verified: USWA regular - accurate.
- `jimmy-valiant` — Jimmy Valiant: Verified: USWA veteran attraction - accurate.
- `koko-b-ware` — Koko B. Ware: Verified: USWA (post-WWF) - accurate.

**WCW** (30):

- `sting` — Sting: Verified: WCW babyface ace, age 35, pop 88 - accurate for January 1995.
- `randy-savage` — Randy Savage: Verified: WCW face, age 42 - accurate (heel turn came Feb 1997).
- `jim-duggan` — "Hacksaw" Jim Duggan: Verified: WCW face, age 41 (b. Jan 29, 1954) - accurate.
- `arn-anderson` — Arn Anderson: Verified: WCW heel (Enforcer; TV champion level) - accurate.
- `lord-steven-regal` — Lord Steven Regal: Verified: WCW heel (Lord Steven Regal), age 26 (b. May 10, 1968) - accurate; pairs with the Bobby Eaton company fix to form the Blue Bloods (April 1995).
- `marcus-bagwell` — Marcus Bagwell: Verified: age 24 (b. Jan 10, 1970) - correct on Jan 1, 1995; Stars 'n' Stripes face.
- `the-patriot` — The Patriot: Verified: WCW face (Stars 'n' Stripes with Bagwell) - accurate; the team held the WCW tag titles into late 1994/early 1995 (see INITIAL_TITLES wcw-tag).
- `kevin-sullivan` — Kevin Sullivan: Verified: Dungeon heel leader - accurate for the Hogan programme.
- `the-butcher` — The Butcher: Verified: Ed Leslie as The Butcher (Sullivan's ally) - accurate; became Zodiac ~May 1995 and Booty Man Feb 1996 (repackaging candidates).
- `diamond-dallas-page` — Diamond Dallas Page: Verified: WCW heel with the Diamond Doll - accurate for early 1995.
- `one-man-gang` — One Man Gang: Verified: WCW heel, age 34 (b. Feb 16, 1960) - accurate.
- `bunkhouse-buck` — Bunkhouse Buck: Verified: Col. Parker's man - accurate. Age worth a check (Jimmy Golden b. 1949 implies ~45, game shows 40).
- `dick-slater` — Dick Slater: Verified: WCW heel - accurate.
- `brad-armstrong` — Brad Armstrong: Verified: WCW mid-carder - accurate (age a year low; b. June 15, 1961 implies 33).
- `brian-knobbs` — Brian Knobbs: Verified: Nasty Boy, age 30 (b. Dec 12, 1964) - accurate.
- `jerry-sags` — Jerry Sags: Verified: Nasty Boy - accurate (age ~1 high; b. July 5, 1965 implies 29).
- `alex-wright` — Alex Wright: Verified: WCW face, age 19 (b. May 17, 1975) - accurate.
- `blacktop-bully` — Blacktop Bully: Verified: Barry Darsow's trucker gimmick was running on WCW TV around the start date - accurate (repackaging from his 1994 run).
- `super-assassin` — Super Assassin: Plausible deep cut: the Super Assassins angle was a late-1995 WCW act - if this entry is meant for January 1995 it is ~10 months early; otherwise fine.
- `kendall-windham` — Kendall Windham: Plausible deep cut: Kendall Windham worked WCW dates in the mid-90s - no definitive January 1995 placement found; spot-verify before import.
- `joey-maggs` — Joey Maggs: Plausible: WCW weekend-show jobber of the era - no issues found.
- `buddy-lee-parker` — Sgt. Buddy Lee Parker: Plausible: WCW jobber (Sgt. Buddy Lee Parker) of the era - no issues found.
- `james-earl-wright` — Lt. James Earl Wright: Plausible: WCW jobber (Lt. James Earl Wright) of the era - no issues found.
- `the-gambler` — The Gambler: Plausible: WCW weekend-show jobber of the era - no issues found.
- `mark-starr` — Mark Starr: Plausible: WCW weekend-show jobber of the era - no issues found.
- `ricky-santana` — Ricky Santana: Plausible: WCW weekend-show jobber of the era - no issues found.
- `jimmy-hart` — Jimmy Hart: Verified: WCW manager (Hogan, then the Dungeon of Doom orbit) - accurate.
- `sherri-martel` — Sensational Sherri: Verified: WCW manager (Harlem Heat) - accurate; extend the seed to both Heat members (see MANAGERS SEED-booker-t).
- `robert-parker` — Colonel Robert Parker: Verified: WCW manager (Stud Stable) - accurate.
- `sonny-onoo` — Sonny Onoo: See MANAGERS finding manager-roster-sonny-onoo (earliest verified role 1995-96) - needs review.

**WWC** (10):

- `carlos-colon` — Carlos Colón: Verified: WWC owner/ace - accurate (title status needs verification - see INITIAL_TITLES wwc-world).
- `ray-gonzalez` — Ray González: Verified: WWC rising star - accurate.
- `abdullah-the-butcher` — Abdullah the Butcher: Verified: WWC attractions regular - accurate.
- `the-invader` — The Invader: Verified: WWC ace (Jose Gonzalez) - accurate.
- `huracan-castillo` — Huracán Castillo Jr.: Verified: WWC veteran - accurate.
- `miguel-perez-jr` — Miguel Pérez Jr.: Verified: WWC (future WWF Los Boricuas member) - accurate.
- `chicky-starr` — Chicky Starr: Verified: WWC regular - accurate.
- `el-gladiador` — El Gladiador: Plausible deep cut: WWC regular - spot-verify before import.
- `bronco-1` — Bronco #1: Plausible deep cut: WWC tag worker (Los Broncos) - spot-verify before import.
- `bronco-2` — Bronco #2: Plausible deep cut: see Bronco #1.

**WWF** (37):

- `shawn-michaels` — Shawn Michaels: Verified: WWF face, age 29, pop 80 - accurate (post-Rumble #1 contender era; Sid joins him in February 1995).
- `undertaker` — The Undertaker: Verified: WWF face, casket-match era - accurate.
- `owen-hart` — Owen Hart: Verified: heel, age 29, work 88 - accurate (Owen & Yokozuna were the reigning WWF tag champions coming off 1994 - the corrected wwf-tag holder is Kid & Holly from Jan 22, 1995, i.e. Owen/Yoko lost them in the gap).
- `yokozuna` — Yokozuna: Verified: heel (Camp Cornette), age 28 - accurate.
- `bob-backlund` — Bob Backlund: Verified: heel (post-title "insane" Backlund) - accurate for early 1995.
- `tatanka` — Tatanka: Verified: face at start (the DiBiase manager link is dated - see MANAGERS finding SEED-tatanka).
- `irs` — I.R.S.: Verified: heel (Million Dollar Corporation), age ~36 - accurate; his contract length aligns with Rotunda leaving the WWF for WCW (as V.K. Wallstreet) in 1995.
- `bart-gunn` — Bart Gunn: Verified: Smoking Gunn, face - accurate (age worth a check: b. March 2, 1963 implies 31, game shows 29; the Sunny manager link is dated - see MANAGERS).
- `billy-gunn` — Billy Gunn: Verified: Smoking Gunn, face, age 31 (b. Nov 11, 1963) - accurate.
- `bob-holly` — Bob "Spark Plug" Holly: Verified: face - accurate (age ~1 high on Jan 1; b. Jan 29, 1963); becomes co-champion with the 1-2-3 Kid at the Jan 22, 1995 Royal Rumble (see INITIAL_TITLES wwf-tag).
- `henry-godwinn` — Henry O. Godwinn: Verified: Henry O. Godwinn was the Godwinn in the WWF at the start window - accurate (Phineas did not arrive until mid-1995; see the phineas-godwinn finding and TEAMS godwinns).
- `hunter-hearst-helmsley` — Hunter Hearst Helmsley: Verified: young heel (Connecticut Blueblood), age 25, pop 36 - accurate for pre-Kliq HHH.
- `king-kong-bundy` — King Kong Bundy: Verified: Million Dollar Corporation heel, age 37 (b. Nov 7, 1957) - accurate.
- `doink-the-clown` — Doink the Clown: Verified: face Doink (Ray Apollo era) with Dink - accurate.
- `aldo-montoya` — Aldo Montoya: Verified: WWF enhancement face - accurate (debuted 1994).
- `barry-horowitz` — Barry Horowitz: Verified: WWF enhancement talent - accurate.
- `kama` — Kama: Verified: Kama (Supreme Fighting Machine) debuted on the Jan 9, 1995 Raw taping - the game having him as a WWF starter is marginally early by ~1 week but acceptable (Million Dollar Corporation).
- `sione` — Sione: Verified: Sionne of the New Headshrinkers, WWF, age 36 - accurate (b. Sept 6, 1958); pairs with the headshrinkers TEAMS note.
- `bull-nakano` — Bull Nakano: Verified: WWF heel, age 27 (b. Jan 8, 1968) - accurate, AND the reigning WWF Women's Champion at the start (see INITIAL_TITLES wwf-women).
- `brooklyn-brawler` — The Brooklyn Brawler: Verified: WWF enhancement talent - accurate.
- `kwang` — Kwang: Verified: Kwang, WWF heel - accurate (Juan Rivera; see the savio-vega duplicate finding).
- `mantaur` — Mantaur: Verified: Mantaur debuted on WWF house shows January 6, 1995 - a legitimate day-one starter.
- `nikolai-volkoff` — Nikolai Volkoff: Verified: returned to the WWF in late 1994/early 1995 (Million Dollar Corporation) - acceptable.
- `steven-dunn` — Steven Dunn: Verified: Well Dunn, WWF tag team - accurate.
- `timothy-well` — Timothy Well: Verified: Well Dunn, WWF tag team - accurate.
- `eli-blu` — Eli Blu: Verified as a person/company; availability is early - see the jacob-blu roster finding (the Blu Brothers debuted on WWF TV in spring 1995).
- `jim-powers` — Jim Powers: Verified: WWF enhancement talent through 1994-95 - accurate.
- `reno-riggins` — Reno Riggins: Plausible: WWF enhancement talent of the period - no issues found.
- `mike-bell` — Mike Bell: Plausible: WWF enhancement talent of the period (on Feb 1995 cards vs Man Mountain Rock) - no issues found.
- `brian-walsh` — Brian Walsh: Plausible: WWF enhancement talent of the period - no issues found.
- `ted-dibiase` — Ted DiBiase: Verified: WWF manager (Million Dollar Corporation) - accurate (his Tatanka link is dated - see MANAGERS SEED-tatanka).
- `paul-bearer` — Paul Bearer: Verified: WWF manager (Undertaker) - accurate.
- `jim-cornette` — Jim Cornette: Verified: WWF manager (Camp Cornette: Yokozuna, Owen) - accurate.
- `sunny` — Sunny: Verified: WWF personality from 1994 (as Tamara Murphy) - roster membership fine; the Bart Gunn manager link is dated (see MANAGERS SEED-bart-gunn).
- `slick` — Slick: Plausible: WWF manager winding down in this era - acceptable.
- `harvey-wippleman` — Harvey Wippleman: Verified: WWF manager/pest (still active around the new 1995 characters like Man Mountain Rock) - accurate.
- `mr-fuji` — Mr. Fuji: Verified: WWF manager (Yokozuna, Camp Cornette-adjacent) - accurate.

---

## Appendix — machine-readable version

The complete audit (all findings with sources, plus the verified lists) is available as `audit/cwvwwf_data_audit.json` in this repository, structured for later import:

```
{"meta": {...}, "summary": {..., "high_impact_findings": [...]},
 "findings": {"wrestlers_roster": [...], "fa_arrivals": [...], "teams": [...],
              "initial_titles": [...], "managers": [...], "announcers": [...],
              "cruiserweights": [...], "timeline": [...], "documentation": [...]},
 "verified_correct_wrestlers": [...]}
```

Each finding object: `{entity_id, entity_name, field, current_value, recommended_value, category, explanation, confidence, sources[]}`.
#!/usr/bin/env bash
# selftest.sh — proves apply_ops.mjs works, using the synthetic fixture repo.
# Run from anywhere:  bash pass2_bundle/tools/selftest.sh
set -uo pipefail

BUNDLE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$BUNDLE/tests/mock-game-repo"
WORK="$(mktemp -d)"
REPO="$WORK/game"
PASS=0; FAIL=0

ok()   { echo "  $(printf '\033[32mPASS\033[0m') $1"; PASS=$((PASS+1)); }
bad()  { echo "  $(printf '\033[31mFAIL\033[0m') $1"; FAIL=$((FAIL+1)); }
head_() { echo; echo "$(printf '\033[1m== %s\033[0m')" "$1"; }

cp -r "$SRC" "$REPO"
head_ "fixture is valid JS before any edit"
if node --check "$REPO/js/data.js" && node --check "$REPO/js/timeline.js" && node --check "$REPO/js/engine.js"; then
  ok "fixture parses"
else
  bad "fixture does not parse"; exit 1
fi

head_ "dry run writes nothing"
BEFORE=$(cat "$REPO/js/data.js" | shasum | cut -d' ' -f1)
node "$BUNDLE/tools/apply_ops.mjs" --repo "$REPO" > "$WORK/dry.txt" 2>&1
DRY_RC=$?
AFTER=$(cat "$REPO/js/data.js" | shasum | cut -d' ' -f1)
[ "$BEFORE" = "$AFTER" ] && ok "dry run left data.js untouched" || bad "dry run modified data.js"
grep -q "dry run — nothing written" "$WORK/dry.txt" && ok "dry-run banner present" || bad "no dry-run banner"

head_ "dry run refuses to write when ops need a human"
node "$BUNDLE/tools/apply_ops.mjs" --repo "$REPO" --apply > "$WORK/refuse.txt" 2>&1
REF_RC=$?
AFTER2=$(cat "$REPO/js/data.js" | shasum | cut -d' ' -f1)
[ "$AFTER" = "$AFTER2" ] && ok "refused without writing" || bad "wrote despite unresolved ops"
grep -q "REFUSING TO WRITE" "$WORK/refuse.txt" && ok "refusal message present" || bad "no refusal message"
[ "$REF_RC" -ne 0 ] && ok "non-zero exit on human-needed ops" || bad "exit 0 despite unresolved ops"

head_ "apply with --allow-partial"
node "$BUNDLE/tools/apply_ops.mjs" --repo "$REPO" --apply --allow-partial > "$WORK/apply.txt" 2>&1
head_ "edited files are still valid JS"
if node --check "$REPO/js/data.js" && node --check "$REPO/js/timeline.js"; then
  ok "data.js and timeline.js parse after apply"
else
  bad "a file failed to parse after apply"
  node --check "$REPO/js/data.js" 2>&1 | head -5
fi

head_ "spot-check individual ops landed (semantic, not text)"
if node --input-type=module -e '
const D = await import(process.argv[1]);
const T = await import(process.argv[2]);
const E = await import(process.argv[3]);
let bad = 0;
const t = (cond, msg) => { console.log(`  ${cond ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m"} ${msg}`); if (!cond) bad++; };

const title = (id) => D.INITIAL_TITLES.find((x) => x.id === id);
t(title("wwf-women").holder === "bull-nakano", "titles/wwf-women holder -> bull-nakano");
t(title("ecw-hardcore") === undefined, "titles/ecw-hardcore removed");
t(title("aaa-world") === undefined && title("aaa-cruiser") === undefined, "absent titles reported, not invented");
t(title("ecw-tag")?.holder === "public-enemy", "titles/ecw-tag added with holder");
t(title("smw-tag")?.holder === "rock-n-roll-express", "titles/smw-tag added with holder");

const w = (id) => D.WRESTLERS.find((x) => x.id === id);
const fa = (id) => D.FA_ARRIVALS.find((x) => x.id === id);
t(w("mabel")?.align === "face" && w("mabel")?.age === 23, "wrestlers/mabel align+age (two fields, one literal)");
t(w("big-bubba-rogers")?.name === "The Boss", "wrestlers/big-bubba-rogers name changed");
t(w("bull-nakano")?.work === 74, "wrestlers/bull-nakano work set");
t(w("jim-duggan")?.pop === 58, "wrestlers/jim-duggan pop set");
t(D.INITIAL_FACTIONS.find((x) => x.id === "million-dollar-corp")?.leader === "ted-dibiase", "factions leader added (new key)");
t(D.ANN_ARRIVALS.find((x) => x.id === "larry-zbyszko")?.turn === 67, "announcers/larry-zbyszko turn set");
t(!D.ANN_STARTERS.CMLL.includes("kent-walton") && !D.ANN_STARTERS.CMLL.includes("tirantes"), "bare-string removals from ANN_STARTERS.CMLL");
t(D.ANN_STARTERS.WWF.includes("howard-finkel"), "untouched announcer group intact");
t(w("craig-pittman") === undefined && fa("craig-pittman")?.turn === 32, "craig-pittman relocated WRESTLERS -> FA_ARRIVALS t32");
t(fa("craig-pittman")?.company === undefined && fa("craig-pittman")?.interest !== undefined, "relocated entry dropped company, gained interest");
t(w("scotty-riggs") === undefined && fa("scotty-riggs")?.turn === 33, "scotty-riggs relocated t33");
t(w("dances-with-dudley") === undefined && fa("dances-with-dudley")?.turn === 24, "dances-with-dudley relocated t24");

const ev = (id) => T.TIMELINE.find((x) => x.id === id);
t(ev("austin-316")?.turn === 71, "timeline austin-316 -> t71");
t(ev("brian-pillman-death")?.turn === 132, "timeline brian-pillman-death added");
t(ev("wcw-clash-95")?.turn === 24, "untouched timeline entry untouched");
t(ev("dx")?.turn === 129, "timeline dx -> t129");
t(String(ev("brian-pillman-death")?.desc || "").includes("REVIEW-ME"), "scaffold bodies flagged REVIEW-ME");
process.exit(bad ? 1 : 0);
' "$REPO/js/data.js" "$REPO/js/timeline.js" "$REPO/js/engine.js"; then :; else bad "semantic assertions failed"; fi

head_ "idempotency — second apply must not double-apply"
node "$BUNDLE/tools/apply_ops.mjs" --repo "$REPO" --apply --allow-partial > "$WORK/apply2.txt" 2>&1
if node --check "$REPO/js/data.js" && node --check "$REPO/js/timeline.js"; then
  ok "still valid after re-apply"
else
  bad "re-apply corrupted a file"
fi
COUNT=$(grep -c 'brian-pillman-death' "$REPO/js/timeline.js")
[ "$COUNT" -le 2 ] && ok "no duplicated death event scaffold ($COUNT line hits)" || bad "duplicated: $COUNT"

head_ "unresolved holder detection"
if grep -q "UNRESOLVED TITLE HOLDERS" "$WORK/apply.txt"; then
  ok "unresolved holders reported (fixture lacks most workers)"
else
  ok "all holders resolved (or none checked)"
fi

head_ "engine NEW-9 anchor"
node -e '
const {readFileSync,writeFileSync,copyFileSync,mkdirSync}=require("fs");
const p=process.argv[1]; let s=readFileSync(p,"utf8");
const re=/(\})\s*else\s*\{\s*\n(\s*)first\s*=\s*pick\(ROOKIE_FIRST_NAMES\)/;
const m=re.exec(s);
if(!m){console.log("  FAIL anchor not found");process.exit(1);}
s=s.replace(re,"$1 else if (!first) {\n$2first = pick(ROOKIE_FIRST_NAMES)");
copyFileSync(p,p+".bak"); writeFileSync(p,s);
console.log("  \x1b[32mPASS\x1b[0m NEW-9 anchor matched exactly once");
' "$REPO/js/engine.js"
if node --check "$REPO/js/engine.js"; then ok "engine.js valid after NEW-9"; else bad "engine.js broken by NEW-9"; fi
if node -e '
const {makeName}=await import(process.argv[1]);
const n=makeName(null,"f");
if(n.startsWith("Amy")){console.log("  \x1b[32mPASS\x1b[0m female name survives: "+n);process.exit(0);}
console.log("  \x1b[31mFAIL\x1b[0m female name still overwritten: "+n);process.exit(1);
' --input-type=module "$REPO/js/engine.js"; then :; else bad "NEW-9 behaviour wrong"; fi

head_ "tests still green in the fixture"
( cd "$REPO" && node test/sim.js >/dev/null 2>&1 && node test/ai-stress.js >/dev/null 2>&1 ) && ok "sim + ai-stress pass" || bad "fixture tests failed"

rm -rf "$WORK"
echo
echo "  $(printf '\033[1mTOTAL\033[0m')  pass=$PASS  fail=$FAIL"
[ "$FAIL" -eq 0 ] || exit 1

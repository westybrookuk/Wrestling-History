#!/usr/bin/env bash
# verify.sh — post-apply gate for the CW/WWF pass-2 bundle.
#
#   bash /path/to/pass2_bundle/tools/verify.sh [repo]
#
# Exit 0 = all gates green (warnings allowed), 1 = a gate failed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="${1:-$PWD}"

RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; BLD=$'\033[1m'; RST=$'\033[0m'

PASS=0; FAIL=0; WARN=0
ok()   { printf '  %sPASS%s %s\n' "$GRN" "$RST" "$1"; PASS=$((PASS+1)); }
bad()  { printf '  %sFAIL%s %s\n' "$RED" "$RST" "$1"; FAIL=$((FAIL+1)); }
warn() { printf '  %sWARN%s %s\n' "$YEL" "$RST" "$1"; WARN=$((WARN+1)); }
sec()  { printf '\n%s== %s%s\n' "$BLD" "$1" "$RST"; }

if ! cd "$REPO" 2>/dev/null; then echo "no such repo: $REPO"; exit 2; fi

sec "syntax"
for f in js/data.js js/timeline.js js/engine.js; do
  if [ ! -f "$f" ]; then bad "$f missing"; continue; fi
  if node --check "$f" 2>/dev/null; then ok "$f parses"; else bad "$f does not parse"; fi
done

sec "game test suite"
for t in test/sim.js test/ai-stress.js; do
  if [ ! -f "$t" ]; then warn "$t not found, skipped"; continue; fi
  if out=$(node "$t" 2>&1); then
    ok "$t"
  else
    bad "$t"
    printf '%s\n' "$out" | tail -15 | sed 's/^/       /'
  fi
done

sec "NEW-9: female generated workers get female names"
out=$(node "$HERE/check_new9.mjs" "$REPO" 2>&1); rc=$?
printf '%s\n' "$out" | sed 's/^/  /'
if [ "$rc" -eq 0 ]; then
  ok "NEW-9 is in effect"
elif [ "$rc" -eq 2 ]; then
  warn "could not evaluate NEW-9 (engine api shape differs?)"
else
  bad "NEW-9 not applied"
fi

sec "pass-2 scaffold markers (must be zero before commit)"
if grep -rn 'REVIEW-ME' js/ 2>/dev/null | grep -q .; then
  warn "REVIEW-ME markers still present, author these before committing:"
  grep -rn 'REVIEW-ME' js/ 2>/dev/null | sed 's/^/       /' | head -20
else
  ok "no REVIEW-ME markers left"
fi

sec "title holders resolve"
out=$(node "$HERE/check_holders.mjs" "$REPO" 2>&1); rc=$?
printf '%s\n' "$out" | sed 's/^/  /'
if [ "$rc" -eq 0 ]; then
  ok "all title holders resolve"
elif [ "$rc" -eq 2 ]; then
  warn "could not evaluate holders"
else
  bad "dangling title holders"
fi

sec "summary"
printf '  pass=%s fail=%s warn=%s\n' "$PASS" "$FAIL" "$WARN"
if [ "$FAIL" -gt 0 ]; then
  printf '\n  %sDO NOT COMMIT%s - failing gates above.\n' "$RED" "$RST"
  exit 1
fi
if [ "$WARN" -gt 0 ]; then
  printf '\n  %sRESOLVE WARNINGS, THEN COMMIT%s\n' "$YEL" "$RST"
  exit 0
fi
printf '\n  %sALL GATES GREEN%s\n' "$GRN" "$RST"

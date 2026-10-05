// SYNTHETIC FIXTURE — not the real engine.
// Reproduces the makeName() shape described in the audit's NEW-9 finding so the
// engine anchor regex can be tested.

export const ROOKIE_FIRST_NAMES = ['Mike', 'Rick', 'Dave', 'Steve', 'Bob'];
export const ROOKIE_LAST_NAMES = ['Smith', 'Jones', 'Rios', 'Kane', 'Dunn'];
export const FEMALE_FIRST_NAMES = ['Amy', 'Angela', 'April', 'Ashley', 'Beth', 'Shannon', 'Tara'];
export const INDY_INTL_NAMES = {
  JPN: [['Yoshi', 'Fujiwara']],
  MEX: [['Rayo', 'Diaz']],
};

export function pick(arr) { return arr[0]; }

export function makeName(flavor, gender) {
  let first = '';
  let last = '';
  if (gender === 'f') {
    first = pick(FEMALE_FIRST_NAMES);
  }
  if (!first && flavor && INDY_INTL_NAMES[flavor]) {
    const p = pick(INDY_INTL_NAMES[flavor]);
    first = p[0];
    last = p[1];
  } else {
    first = pick(ROOKIE_FIRST_NAMES);
    last = pick(ROOKIE_LAST_NAMES);
  }
  return `${first} ${last}`;
}

export function newGame() { return { wrestlers: [] }; }
export function mulberry32(a) { return () => a; }

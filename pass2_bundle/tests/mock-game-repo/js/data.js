// SYNTHETIC FIXTURE — not the real game data.
// Format-mimics js/data.js from westybrookuk/WCW-vs-WWF (see
// pass1_high_confidence_corrections.patch for the authoritative style:
// unquoted keys, single quotes, flat WRESTLERS with a `company` field,
// escaped apostrophes, occasional double-quoted strings).
// Values are plausible, not historical fact.

export const COMPANY_DEFS = {
  WWF: { name: 'WWF' },
  WCW: { name: 'WCW' },
  ECW: { name: 'ECW' },
};

// ------------------------------------------------------------
export const WRESTLERS = [
  // ==================== WCW ====================
  { id: 'hulk-hogan', name: 'Hulk Hogan', company: 'WCW', align: 'heel', pop: 97, work: 42, mic: 80, age: 41, ceiling: 97, wage: 200, contract: 240, finisher: 'Atomic Leg Drop' },
  { id: 'big-bubba-rogers', name: 'Big Bubba Rogers', company: 'WCW', align: 'heel', pop: 55, work: 68, ceiling: 74 },
  { id: 'scotty-riggs', name: 'Scotty Riggs', company: 'WCW', align: 'face', pop: 40, work: 62, ceiling: 70 },
  { id: 'jimmy-snuka', name: 'Jimmy Snuka', company: 'WCW', align: 'face', pop: 65, work: 70, ceiling: 75 },
  { id: 'marty-jannetty', name: 'Marty Jannetty', company: 'WCW', align: 'heel', pop: 55, work: 68, ceiling: 72 },
  { id: 'craig-pittman', name: 'Craig Pittman', company: 'WCW', align: 'face', pop: 30, work: 55, ceiling: 62 },
  { id: 'psicosis', name: 'Psicosis', company: 'WCW', align: 'heel', pop: 40, work: 58, ceiling: 70 },
  { id: 'jim-duggan', name: '"Hacksaw" Jim Duggan', company: 'WCW', align: 'face', pop: 65, work: 45, mic: 70, age: 41, ceiling: 68, wage: 60, contract: 60 },
  // ==================== WWF ====================
  { id: 'mabel', name: 'Mabel', company: 'WWF', align: 'heel', pop: 40, work: 60, ceiling: 70 },
  { id: 'bull-nakano', name: 'Bull Nakano', company: 'WWF', align: 'face', pop: 55, work: 72, ceiling: 74 },
  { id: 'alundra-blayze', name: 'Alundra Blayze', company: 'WWF', align: 'face', pop: 70, work: 68, ceiling: 78 },
  { id: 'chyna', name: 'Chyna', company: 'WWF', align: 'heel', pop: 72, work: 75, ceiling: 85 },
  { id: 'trish-stratus', name: 'Trish Stratus', company: 'WWF', align: 'face', pop: 50, work: 55, ceiling: 72 },
  { id: 'bertha-faye', name: 'Bertha Faye', company: 'WWF', align: 'face', pop: 45, work: 50, ceiling: 60 },
  { id: 'owen-hart', name: 'Owen Hart', company: 'WWF', align: 'heel', pop: 64, work: 88, mic: 58, age: 29, ceiling: 82, wage: 60, contract: 150 },
  { id: 'taz', name: 'Taz', company: 'ECW', align: 'heel', pop: 65, work: 70, ceiling: 78 },
  { id: 'rob-van-dam', name: 'Rob Van Dam', company: 'ANY', align: 'face', pop: 32, work: 82, mic: 55, age: 25, ceiling: 86, wage: 30, finisher: 'Five-Star Frog Splash', note: 'The Whole F\'n Show' },
  // ==================== ECW ====================
  { id: 'dances-with-dudley', name: 'Dances With Dudley', company: 'ECW', align: 'face', pop: 35, work: 60, ceiling: 70 },
  { id: 'shane-douglas', name: 'Shane Douglas', company: 'ECW', align: 'face', pop: 50, work: 70, ceiling: 75 },
  { id: 'brian-pillman', name: 'Brian Pillman', company: 'ECW', align: 'heel', pop: 50, work: 65, ceiling: 72 },
  { id: 'ricky-carnage', name: 'Ricky Carnage', company: 'SMW', align: 'heel', pop: 45, work: 65, ceiling: 72 },
  { id: 'dustin-rhodes', name: 'Dustin Rhodes', company: 'NWA', align: 'face', pop: 60, work: 72, ceiling: 80 },
  { id: 'satoshi-shirai', name: 'Satoshi Shirai', company: 'NJPW', align: 'heel', pop: 40, work: 65, ceiling: 74 },
  { id: 'bam-bam-bigelow', name: 'Bam Bam Bigelow', company: 'WWF', align: 'heel', pop: 63, work: 60, mic: 58, age: 33, ceiling: 74, wage: 55, contract: 43, finisher: "Greetings from Asbury Park", noRenew: true },
];

// ------------------------------------------------------------
export const INITIAL_TITLES = [
  { id: 'wwf-world', name: 'WWF Championship', company: 'WWF', kind: 'world', holder: 'bam-bam-bigelow', prestige: 90 },
  { id: 'wwf-women', name: 'WWF Womens Championship', company: 'WWF', kind: 'womens', holder: 'alundra-blayze', prestige: 70 },
  { id: 'wwf-tag', name: 'WWF Tag Team Championship', company: 'WWF', kind: 'tag', holder: 'the-bulldogs', prestige: 65 },
  { id: 'nwa-world', name: 'NWA World Heavyweight Championship', company: 'NWA', kind: 'world', holder: 'dustin-rhodes', prestige: 88 },
  { id: 'njpw-junior', name: 'IWGP Junior Heavyweight Championship', company: 'NJPW', kind: 'junior', holder: 'satoshi-shirai', prestige: 40 },
  { id: 'ecw-world', name: 'ECW World Heavyweight Championship', company: 'ECW', kind: 'world', holder: 'shane-douglas', prestige: 60 },
  { id: 'ecw-hardcore', name: 'ECW Hardcore Championship', company: 'ECW', kind: 'hardcore', holder: 'ricky-carnage', prestige: 35 },
  { id: 'smw-world', name: 'SMW World Championship', company: 'SMW', kind: 'world', holder: 'ricky-carnage', prestige: 45 },
];

// Free agents that appear at a given turn (0 = Jan 1995 week 1, 4/week).
// interest: which company's AI will chase them aggressively
export const FA_ARRIVALS = [
  { turn: 52, id: 'ahmed-johnson', name: 'Ahmed Johnson', align: 'face', pop: 30, work: 70, mic: 45, age: 32, ceiling: 78, wage: 25, interest: 'WWF', note: 'a powerhouse prospect' },
  { turn: 72, id: 'chris-jericho', name: 'Chris Jericho', align: 'heel', pop: 30, work: 78, mic: 72, age: 25, ceiling: 90, wage: 30, interest: 'ANY', note: 'a loudmouth with all the tools' },
];

export const INITIAL_FACTIONS = [
  { id: 'four-horsemen', name: 'The Four Horsemen', members: ['ric-flair', 'lex-lerner', 'arn-anderson'] },
  { id: 'million-dollar-corp', name: 'The Million Dollar Corporation', leader: 'steve-bisset', members: ['ted-dibiase', 'bam-bam-bigelow', 'tatanka'] },
];

export const ANN_STARTERS = {
  WCW: ['tony-schiavone', 'mike-tenay'],
  WWF: ['howard-finkel'],
  CMLL: ['kent-walton', 'tirantes'],
};

export const ANN_ARRIVALS = [
  { id: 'larry-zbyszko', turn: 12 },
  { id: 'michael-cole', turn: 30 },
  { id: 'tazz', turn: 60 },
  { id: 'kevin-kelly', turn: 90 },
];

export const TEAMS = [
  { id: 'the-bulldogs', name: 'The Bulldogs', members: ['bam-bam-bigelow'] },
];

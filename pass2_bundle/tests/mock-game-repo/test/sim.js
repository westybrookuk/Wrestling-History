// SYNTHETIC FIXTURE stub — stand-in for the game's test/sim.js.
import { newGame, makeName } from '../js/engine.js';

const s = newGame();
console.log('sim ok — games:', 1, 'workers:', s.wrestlers.length);
console.log('sample name:', makeName(null, 'f'));

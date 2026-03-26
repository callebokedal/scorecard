/**
 * Creates an empty HoleScore array for the given number of holes.
 * @param {number} holesPlayed
 * @returns {import('../types/models').HoleScore[]}
 */
export function createInitialHoleScores(holesPlayed) {
  return Array.from({ length: holesPlayed }, (_, i) => ({
    holeNumber: i + 1,
    strokes: null,
    putts: 0,
    teeShot: null,
    bunkersNearGreen: 0,
    bunkersFairway: 0,
    penaltiesWater: 0,
    penaltiesOOB: 0,
    penaltiesOther: 0,
  }));
}

/**
 * Calculates playing handicap for a player on a course.
 * Formula: Math.round(hcp * (slope / 113))
 * @param {number} hcp - Player handicap index
 * @param {number} slope - Course slope rating
 * @returns {number}
 */
export function calcPlayingHcp(hcp, slope) {
  return Math.round(hcp * (slope / 113));
}

/**
 * Calculates how many HCP strokes a player gets on a specific hole.
 * @param {number} playingHcp
 * @param {number} slopeIndex - Hole stroke index (1 = hardest)
 * @param {number} totalHoles - Total holes on course (9 or 18)
 * @returns {number}
 */
export function hcpStrokesOnHole(playingHcp, slopeIndex, totalHoles) {
  if (playingHcp <= 0) return 0;
  const strokes = Math.floor(playingHcp / totalHoles);
  const remainder = playingHcp % totalHoles;
  return strokes + (slopeIndex <= remainder ? 1 : 0);
}

/**
 * Calculates Stableford points for a single hole.
 * @param {number} strokes - Gross strokes played
 * @param {number} par
 * @param {number} hcpStrokes - Extra strokes from handicap on this hole
 * @returns {number}
 */
export function calcStablefordPoints(strokes, par, hcpStrokes) {
  if (strokes == null || strokes === 0) return 0;
  return Math.max(0, par + hcpStrokes - strokes + 2);
}

/**
 * Formats a date string (YYYY-MM-DD) for display.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Returns today's date as a YYYY-MM-DD string.
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * @fileoverview JSDoc type definitions for all domain models.
 */

/**
 * @typedef {object} Club
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name
 * @property {string} address
 * @property {string} [note]
 * @property {Course[]} courses
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {object} Course
 * @property {string} id - Unique identifier (UUID)
 * @property {string} clubId - Parent club id
 * @property {string} name
 * @property {number} holes - Total number of holes (typically 9 or 18)
 * @property {number} slope - Course slope rating (used for playing HCP calculation)
 * @property {HoleInfo[]} holeInfo - Par, slope index and optional length per hole
 * @property {string} [note]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {object} HoleInfo
 * @property {number} holeNumber - 1-based hole number
 * @property {number} par - Par for this hole (3, 4 or 5)
 * @property {number} slopeIndex - Stroke index 1–18 (1 = hardest)
 * @property {number} [length] - Optional length in meters
 * @property {string} [note]
 */

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {string} name
 * @property {number} hcp - Handicap index (can be negative)
 * @property {string} [defaultTee] - e.g. 'yellow', 'white', 'red'
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {object} Scorecard
 * @property {string} id
 * @property {string} name
 * @property {string} date - ISO date string (YYYY-MM-DD)
 * @property {string|null} courseId - null if "No course" selected
 * @property {number} holesPlayed - Number of holes in this round (may be less than course total)
 * @property {ScorecardPlayer[]} players
 * @property {boolean} completed
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {object} ScorecardPlayer
 * @property {string} playerId
 * @property {string} name - Snapshot of player name at time of round
 * @property {number} hcp - Snapshot of player HCP at time of round
 * @property {HoleScore[]} holes - One entry per hole played
 */

/**
 * @typedef {object} HoleScore
 * @property {number} holeNumber - 1-based
 * @property {number|null} strokes - Gross strokes (null = not yet entered)
 * @property {number} putts
 * @property {TeeShot|null} teeShot - 'hit'|'left'|'right'|'long'|'short'|'miss'|null
 * @property {TeeClub|null} teeClub - club used on tee, null if not recorded
 * @property {boolean} skipped - true if the hole was deliberately skipped
 * @property {number} bunkersNearGreen
 * @property {number} bunkersFairway
 * @property {number} bunkersOther
 * @property {number} penaltiesWater
 * @property {number} penaltiesOOB
 * @property {number} penaltiesOther
 */

/**
 * @typedef {'hit'|'left'|'right'|'long'|'short'|'miss'} TeeShot
 */

/**
 * @typedef {'1W'|'3W'|'5W'|'7W'|'2H'|'3H'|'4H'|'5H'|'2i'|'3i'|'4i'|'5i'|'6i'|'7i'|'8i'|'9i'} TeeClub
 */

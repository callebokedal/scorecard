/**
 * Generic localStorage helpers.
 * All values are JSON-serialised.
 */

const KEYS = {
  clubs: 'scorecard:clubs',
  players: 'scorecard:players',
  scorecards: 'scorecard:scorecards',
};

/**
 * Read a value from localStorage.
 * @template T
 * @param {string} key
 * @param {T} defaultValue
 * @returns {T}
 */
function getItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Write a value to localStorage.
 * @param {string} key
 * @param {unknown} value
 */
function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export { KEYS, getItem, setItem };

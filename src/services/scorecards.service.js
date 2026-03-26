import { KEYS, getItem, setItem } from './storage.service';

/** @returns {import('../types/models').Scorecard[]} */
export function loadScorecards() {
  return getItem(KEYS.scorecards, []);
}

/** @param {import('../types/models').Scorecard[]} scorecards */
export function saveScorecards(scorecards) {
  setItem(KEYS.scorecards, scorecards);
}

/**
 * @param {Omit<import('../types/models').Scorecard, 'id'|'createdAt'|'updatedAt'|'completed'>} data
 * @returns {import('../types/models').Scorecard}
 */
export function createScorecard(data) {
  const scorecards = loadScorecards();
  const now = new Date().toISOString();
  const scorecard = {
    id: crypto.randomUUID(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  saveScorecards([...scorecards, scorecard]);
  return scorecard;
}

/**
 * @param {string} scorecardId
 * @param {Partial<import('../types/models').Scorecard>} updates
 * @returns {import('../types/models').Scorecard}
 */
export function updateScorecard(scorecardId, updates) {
  const scorecards = loadScorecards();
  const updated = scorecards.map((s) =>
    s.id === scorecardId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
  );
  saveScorecards(updated);
  return updated.find((s) => s.id === scorecardId);
}

/** @param {string} scorecardId */
export function deleteScorecard(scorecardId) {
  saveScorecards(loadScorecards().filter((s) => s.id !== scorecardId));
}

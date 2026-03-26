import { KEYS, getItem, setItem } from './storage.service';

/** @returns {import('../types/models').Player[]} */
export function loadPlayers() {
  return getItem(KEYS.players, []);
}

/** @param {import('../types/models').Player[]} players */
export function savePlayers(players) {
  setItem(KEYS.players, players);
}

/**
 * @param {Omit<import('../types/models').Player, 'id'|'createdAt'|'updatedAt'>} data
 * @returns {import('../types/models').Player}
 */
export function createPlayer(data) {
  const players = loadPlayers();
  const now = new Date().toISOString();
  const player = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  savePlayers([...players, player]);
  return player;
}

/**
 * @param {string} playerId
 * @param {Partial<import('../types/models').Player>} updates
 * @returns {import('../types/models').Player}
 */
export function updatePlayer(playerId, updates) {
  const players = loadPlayers();
  const updated = players.map((p) =>
    p.id === playerId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  );
  savePlayers(updated);
  return updated.find((p) => p.id === playerId);
}

/** @param {string} playerId */
export function deletePlayer(playerId) {
  savePlayers(loadPlayers().filter((p) => p.id !== playerId));
}

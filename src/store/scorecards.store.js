import { create } from 'zustand';
import * as svc from '../services/scorecards.service';

export const useScorecardsStore = create((set, get) => ({
  scorecards: svc.loadScorecards(),

  addScorecard: (data) => {
    const scorecard = svc.createScorecard(data);
    set((s) => ({ scorecards: [...s.scorecards, scorecard] }));
    return scorecard;
  },

  editScorecard: (id, updates) => {
    const scorecard = svc.updateScorecard(id, updates);
    set((s) => ({
      scorecards: s.scorecards.map((sc) => (sc.id === id ? scorecard : sc)),
    }));
    return scorecard;
  },

  /**
   * Update a single hole score for one player in a scorecard.
   * @param {string} scorecardId
   * @param {string} playerId
   * @param {number} holeNumber
   * @param {Partial<import('../types/models').HoleScore>} updates
   */
  updateHoleScore: (scorecardId, playerId, holeNumber, updates) => {
    const sc = get().scorecards.find((s) => s.id === scorecardId);
    if (!sc) return;
    const updatedPlayers = sc.players.map((p) => {
      if (p.playerId !== playerId) return p;
      return {
        ...p,
        holes: p.holes.map((h) =>
          h.holeNumber === holeNumber ? { ...h, ...updates } : h
        ),
      };
    });
    const updated = svc.updateScorecard(scorecardId, { players: updatedPlayers });
    set((s) => ({
      scorecards: s.scorecards.map((sc) => (sc.id === scorecardId ? updated : sc)),
    }));
  },

  toggleComplete: (scorecardId) => {
    const sc = get().scorecards.find((s) => s.id === scorecardId);
    if (!sc) return;
    const updated = svc.updateScorecard(scorecardId, { completed: !sc.completed });
    set((s) => ({
      scorecards: s.scorecards.map((sc) => (sc.id === scorecardId ? updated : sc)),
    }));
  },

  removeScorecard: (id) => {
    svc.deleteScorecard(id);
    set((s) => ({ scorecards: s.scorecards.filter((sc) => sc.id !== id) }));
  },
}));

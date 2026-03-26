import { create } from 'zustand';
import * as svc from '../services/scorecards.service';

export const useScorecardsStore = create((set) => ({
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

  removeScorecard: (id) => {
    svc.deleteScorecard(id);
    set((s) => ({ scorecards: s.scorecards.filter((sc) => sc.id !== id) }));
  },
}));

import { create } from 'zustand';
import * as svc from '../services/players.service';

export const usePlayersStore = create((set) => ({
  players: svc.loadPlayers(),

  addPlayer: (data) => {
    const player = svc.createPlayer(data);
    set((s) => ({ players: [...s.players, player] }));
    return player;
  },

  editPlayer: (id, updates) => {
    const player = svc.updatePlayer(id, updates);
    set((s) => ({ players: s.players.map((p) => (p.id === id ? player : p)) }));
  },

  removePlayer: (id) => {
    svc.deletePlayer(id);
    set((s) => ({ players: s.players.filter((p) => p.id !== id) }));
  },
}));

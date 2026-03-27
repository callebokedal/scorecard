import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlayersStore } from '../store/players.store';
import { PlayerFormModal } from '../features/players/PlayerFormModal';

export default function PlayersPage() {
  const { t } = useTranslation();
  const players = usePlayersStore((s) => s.players);
  const removePlayer = usePlayersStore((s) => s.removePlayer);

  const [showAdd, setShowAdd] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const handleDelete = (player) => {
    if (window.confirm(t('players.confirmDelete', { name: player.name }))) {
      removePlayer(player.id);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t('players.title')}</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700"
        >
          {t('players.addBtn')}
        </button>
      </div>

      {players.length === 0 ? (
        <p className="text-gray-400 text-center mt-16">{t('players.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {players.map((player) => (
            <li key={player.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{player.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    HCP {Number(player.hcp).toFixed(1)}
                    {player.defaultTee && (
                      <span className="ml-2 text-gray-400">
                        {t('players.tee', { tee: player.defaultTee })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-700 font-bold text-sm shrink-0">
                  {Number(player.hcp).toFixed(1)}
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-bl-xl"
                  onClick={() => setEditingPlayer(player)}
                >
                  {t('common.edit')}
                </button>
                <button
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-br-xl"
                  onClick={() => handleDelete(player)}
                >
                  {t('common.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showAdd && <PlayerFormModal player={null} onClose={() => setShowAdd(false)} />}
      {editingPlayer && (
        <PlayerFormModal player={editingPlayer} onClose={() => setEditingPlayer(null)} />
      )}
    </div>
  );
}

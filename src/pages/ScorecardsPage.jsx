import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScorecardsStore } from '../store/scorecards.store';
import { ScorecardFormModal } from '../features/scorecards/ScorecardFormModal';
import { formatDate } from '../utils/scorecard.utils';

export default function ScorecardsPage() {
  const scorecards = useScorecardsStore((s) => s.scorecards);
  const removeScorecard = useScorecardsStore((s) => s.removeScorecard);
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);

  const handleCreated = (id) => {
    setShowCreate(false);
    navigate(`/scorecards/${id}`);
  };

  const handleDelete = (sc) => {
    if (window.confirm(`Delete scorecard "${sc.name}"?`)) {
      removeScorecard(sc.id);
    }
  };

  // Sort: ongoing first, then completed; within each group newest date first
  const sorted = [...scorecards].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.date.localeCompare(a.date);
  });

  const ongoing = sorted.filter((sc) => !sc.completed);
  const completed = sorted.filter((sc) => sc.completed);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Scorecards</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700"
        >
          + New Round
        </button>
      </div>

      {scorecards.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">⛳</p>
          <p className="text-gray-500 font-medium">No rounds yet</p>
          <p className="text-gray-400 text-sm mt-1">Start a new round to begin tracking.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {ongoing.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Ongoing
              </h2>
              <ScorecardList
                items={ongoing}
                onOpen={(id) => navigate(`/scorecards/${id}`)}
                onDelete={handleDelete}
              />
            </section>
          )}
          {completed.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Completed
              </h2>
              <ScorecardList
                items={completed}
                onOpen={(id) => navigate(`/scorecards/${id}`)}
                onDelete={handleDelete}
              />
            </section>
          )}
        </div>
      )}

      {showCreate && (
        <ScorecardFormModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('../types/models').Scorecard[]} props.items
 * @param {(id: string) => void} props.onOpen
 * @param {(sc: import('../types/models').Scorecard) => void} props.onDelete
 */
function ScorecardList({ items, onOpen, onDelete }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((sc) => {
        const playerNames = sc.players.map((p) => p.name).join(', ');
        const holesEntered = sc.players[0]?.holes.filter((h) => h.strokes !== null).length ?? 0;

        return (
          <li key={sc.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              className="w-full text-left px-4 py-3"
              onClick={() => onOpen(sc.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-gray-800 leading-snug">{sc.name}</span>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    sc.completed
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {sc.completed ? 'Done' : 'Ongoing'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{formatDate(sc.date)}</div>
              <div className="text-sm text-gray-400 mt-0.5 truncate">{playerNames}</div>
              {!sc.completed && (
                <div className="text-xs text-gray-400 mt-1">
                  {holesEntered}/{sc.holesPlayed} holes entered
                </div>
              )}
            </button>
            <div className="flex border-t border-gray-100">
              <button
                className="flex-1 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-bl-xl"
                onClick={() => onOpen(sc.id)}
              >
                {sc.completed ? 'View' : 'Continue'}
              </button>
              <button
                className="flex-1 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-br-xl"
                onClick={() => onDelete(sc)}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

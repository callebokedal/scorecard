import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScorecardsStore } from '../store/scorecards.store';
import { useClubsStore } from '../store/clubs.store';
import { ScorecardFormModal } from '../features/scorecards/ScorecardFormModal';
import { formatDate } from '../utils/scorecard.utils';
import { exportJSON } from '../services/importExport.service';

export default function ScorecardsPage() {
  const { t } = useTranslation();
  const scorecards = useScorecardsStore((s) => s.scorecards);
  const removeScorecard = useScorecardsStore((s) => s.removeScorecard);
  const clubs = useClubsStore((s) => s.clubs);
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);

  const handleCreated = (id) => {
    setShowCreate(false);
    navigate(`/scorecards/${id}`);
  };

  const handleDelete = (sc) => {
    if (window.confirm(t('scorecards.confirmDelete', { name: sc.name }))) {
      removeScorecard(sc.id);
    }
  };

  const sorted = [...scorecards].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.date.localeCompare(a.date);
  });

  const ongoing = sorted.filter((sc) => !sc.completed);
  const completed = sorted.filter((sc) => sc.completed);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t('scorecards.title')}</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700"
        >
          {t('scorecards.newRound')}
        </button>
      </div>

      {clubs.length === 0 && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          {t('scorecards.noClubs')}{' '}
          <button
            onClick={() => navigate('/clubs')}
            className="font-semibold underline hover:text-amber-900"
          >
            {t('scorecards.goToClubs')}
          </button>
        </div>
      )}

      {scorecards.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">⛳</p>
          <p className="text-gray-500 font-medium">{t('scorecards.empty')}</p>
          <p className="text-gray-400 text-sm mt-1">{t('scorecards.emptyHint')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {ongoing.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {t('scorecards.ongoing')}
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
                {t('scorecards.completed')}
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
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col gap-3">
      {items.map((sc) => {
        const playerNames = sc.players.map((p) => p.name).join(', ');
        const holesEntered = sc.players[0]?.holes.filter((h) => h.strokes !== null).length ?? 0;

        return (
          <li key={sc.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button className="w-full text-left px-4 py-3" onClick={() => onOpen(sc.id)}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-gray-800 leading-snug">{sc.name}</span>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    sc.completed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {sc.completed ? t('scorecards.done') : t('scorecards.ongoing')}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{formatDate(sc.date)}</div>
              <div className="text-sm text-gray-400 mt-0.5 truncate">{playerNames}</div>
              {!sc.completed && (
                <div className="text-xs text-gray-400 mt-1">
                  {t('scorecards.holesEntered', { entered: holesEntered, total: sc.holesPlayed })}
                </div>
              )}
            </button>
            <div className="flex border-t border-gray-100">
              <button
                className="flex-1 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-bl-xl"
                onClick={() => onOpen(sc.id)}
              >
                {sc.completed ? t('scorecards.viewBtn') : t('scorecards.continueBtn')}
              </button>
              <button
                className="flex-1 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => exportJSON(sc, `scorecard-${sc.name.replace(/\s+/g, '-').toLowerCase()}`)}
              >
                {t('common.export')}
              </button>
              <button
                className="flex-1 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-br-xl"
                onClick={() => onDelete(sc)}
              >
                {t('common.delete')}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScorecardsStore } from '../store/scorecards.store';
import { useClubsStore } from '../store/clubs.store';
import { TopNav } from '../components/layout/TopNav';
import { HoleNavigator } from '../features/scorecards/HoleNavigator';
import { PlayerAccordion } from '../features/scorecards/PlayerAccordion';
import { Leaderboard } from '../features/scorecards/Leaderboard';
import { formatDate } from '../utils/scorecard.utils';

export default function ScorecardDetailPage() {
  const { t } = useTranslation();
  const { scorecardId } = useParams();
  const navigate = useNavigate();

  const scorecards = useScorecardsStore((s) => s.scorecards);
  const updateHoleScore = useScorecardsStore((s) => s.updateHoleScore);
  const toggleComplete = useScorecardsStore((s) => s.toggleComplete);
  const clubs = useClubsStore((s) => s.clubs);

  const sc = scorecards.find((s) => s.id === scorecardId);

  const [currentHole, setCurrentHole] = useState(1);
  const [activeTab, setActiveTab] = useState(sc?.completed ? 1 : 0);
  const [expandedPlayerId, setExpandedPlayerId] = useState(sc?.players[0]?.playerId ?? null);

  const backBtn = (
    <button
      onClick={() => navigate('/scorecards')}
      className="text-white text-xl leading-none px-1"
      aria-label={t('common.back')}
    >
      ←
    </button>
  );

  if (!sc) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopNav title={t('common.notFound')} leftAction={backBtn} />
      </div>
    );
  }

  const course = sc.courseId
    ? clubs.flatMap((c) => c.courses).find((co) => co.id === sc.courseId) ?? null
    : null;

  const holeInfo = course?.holeInfo.find((h) => h.holeNumber === currentHole) ?? null;

  const allHolesEntered = sc.players.every((p) =>
    p.holes.every((h) => h.strokes != null)
  );

  const handleHoleChange = (updates, playerId) => {
    updateHoleScore(sc.id, playerId, currentHole, updates);
  };

  const togglePlayer = (playerId) => {
    setExpandedPlayerId((prev) => (prev === playerId ? null : playerId));
  };

  const tabs = [t('scorecard.tabScorecard'), t('scorecard.tabLeaderboard')];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav title={`${sc.name} · ${formatDate(sc.date)}`} leftAction={backBtn} />

      {/* Tab bar */}
      <div className="flex bg-white border-b border-gray-200 shadow-sm">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === idx
                ? 'text-green-700 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 ? (
        <div className="flex-1 flex flex-col">
          <HoleNavigator
            currentHole={currentHole}
            totalHoles={sc.holesPlayed}
            holeInfo={holeInfo}
            onPrev={() => setCurrentHole((h) => Math.max(1, h - 1))}
            onNext={() => setCurrentHole((h) => Math.min(sc.holesPlayed, h + 1))}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-0 p-0 max-w-lg mx-auto w-full">
              {sc.players.map((player) => {
                const holeScore = player.holes.find((h) => h.holeNumber === currentHole);
                return (
                  <PlayerAccordion
                    key={player.playerId}
                    player={player}
                    holeScore={holeScore}
                    holeInfo={holeInfo}
                    courseSlope={course?.slope ?? null}
                    expanded={expandedPlayerId === player.playerId}
                    onToggle={() => togglePlayer(player.playerId)}
                    onChange={(updates) => handleHoleChange(updates, player.playerId)}
                  />
                );
              })}

              <div className="pt-2 pb-6">
                {!sc.completed && allHolesEntered && (
                  <button
                    onClick={() => { toggleComplete(sc.id); setActiveTab(1); }}
                    className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 shadow-sm"
                  >
                    {t('scorecard.markComplete')}
                  </button>
                )}
                {sc.completed && (
                  <button
                    onClick={() => toggleComplete(sc.id)}
                    className="w-full py-3 rounded-xl bg-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-300"
                  >
                    {t('scorecard.reopen')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-w-lg mx-auto w-full">
          <Leaderboard scorecard={sc} course={course} />
        </div>
      )}
    </div>
  );
}

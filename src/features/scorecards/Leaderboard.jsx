import { useTranslation } from 'react-i18next';
import { computePlayerTotals } from '../../utils/scorecard.utils';

/**
 * Leaderboard tab — compact portrait table, detailed landscape table.
 * @param {object} props
 * @param {import('../../types/models').Scorecard} props.scorecard
 * @param {import('../../types/models').Course|null} props.course
 */
export function Leaderboard({ scorecard, course }) {
  const { t } = useTranslation();

  const rows = scorecard.players
    .map((player) => {
      const totals = computePlayerTotals(player, course);
      return { player, ...totals };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints || a.player.name.localeCompare(b.player.name));

  return (
    <div className="p-4">
      {/* Compact portrait table */}
      <div className="landscape:hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-3 py-2 text-left w-8">{t('scorecard.lb.rank')}</th>
              <th className="px-3 py-2 text-left">{t('scorecard.lb.player')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.score')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.pts')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.thru')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.player.playerId} className="border-t border-gray-100">
                <td className="px-3 py-2.5 text-gray-400 font-medium">{idx + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="font-semibold text-gray-800">{row.player.name}</div>
                  <div className="text-xs text-gray-400">HCP {Number(row.player.hcp).toFixed(1)}</div>
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-gray-900 tabular-nums">
                  {row.thru > 0 ? row.totalStrokes : '—'}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`font-bold tabular-nums ${row.thru > 0 ? 'text-green-700' : 'text-gray-400'}`}>
                    {row.thru > 0 ? row.totalPoints : '—'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center text-gray-500 tabular-nums">
                  {row.thru > 0 ? row.thru : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed landscape table */}
      <div className="hidden landscape:block overflow-x-auto">
        <table className="text-xs bg-white rounded-xl shadow-sm border border-gray-100 w-full min-w-max">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide">
              <th className="px-3 py-2 text-left sticky left-0 bg-gray-50">
                {t('scorecard.lb.player')}
              </th>
              {Array.from({ length: scorecard.holesPlayed }, (_, i) => (
                <th key={i + 1} className="px-2 py-2 text-center w-10">{i + 1}</th>
              ))}
              <th className="px-3 py-2 text-center">{t('scorecard.lb.tot')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.pts')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.player.playerId} className="border-t border-gray-100">
                <td className="px-3 py-2 font-semibold text-gray-800 sticky left-0 bg-white">
                  {row.player.name}
                </td>
                {row.player.holes.map((hole) => {
                  const info = course?.holeInfo.find((h) => h.holeNumber === hole.holeNumber);
                  const diff = info && hole.strokes != null ? hole.strokes - info.par : null;
                  return (
                    <td key={hole.holeNumber} className="px-2 py-2 text-center tabular-nums">
                      {hole.strokes != null ? (
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            diff == null ? 'text-gray-600'
                              : diff <= -2 ? 'bg-yellow-400 text-white'
                              : diff === -1 ? 'bg-red-500 text-white'
                              : diff === 0 ? 'text-gray-700'
                              : diff === 1 ? 'border border-gray-400 text-gray-600'
                              : 'border-2 border-gray-400 text-gray-500'
                          }`}
                        >
                          {hole.strokes}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center font-bold tabular-nums text-gray-800">
                  {row.thru > 0 ? row.totalStrokes : '—'}
                </td>
                <td className="px-3 py-2 text-center font-bold tabular-nums text-green-700">
                  {row.thru > 0 ? row.totalPoints : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';

/**
 * Aggregated round statistics per player.
 * @param {object} props
 * @param {import('../../types/models').Scorecard} props.scorecard
 */
export function RoundStatsTab({ scorecard }) {
  const { t } = useTranslation();

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col gap-6">
      {scorecard.players.map((player) => (
        <PlayerStats key={player.playerId} player={player} t={t} />
      ))}
    </div>
  );
}

function PlayerStats({ player, t }) {
  const played = player.holes.filter((h) => h.strokes != null);
  const totalStrokes = played.reduce((s, h) => s + h.strokes, 0);
  const totalPutts = played.reduce((s, h) => s + (h.putts ?? 0), 0);
  const avgStrokes = played.length ? (totalStrokes / played.length).toFixed(1) : '—';
  const avgPutts = played.length ? (totalPutts / played.length).toFixed(1) : '—';

  const teeShotHoles = player.holes.filter((h) => h.teeShot != null);
  const teeCounts = { hit: 0, long: 0, short: 0, left: 0, right: 0, miss: 0 };
  teeShotHoles.forEach((h) => { if (h.teeShot in teeCounts) teeCounts[h.teeShot]++; });

  const clubCounts = {};
  player.holes.forEach((h) => {
    if (h.teeClub) clubCounts[h.teeClub] = (clubCounts[h.teeClub] ?? 0) + 1;
  });
  const clubEntries = Object.entries(clubCounts).sort((a, b) => b[1] - a[1]);

  const totalBunkersNearGreen = player.holes.reduce((s, h) => s + (h.bunkersNearGreen ?? 0), 0);
  const totalBunkersFairway = player.holes.reduce((s, h) => s + (h.bunkersFairway ?? 0), 0);
  const totalBunkersOther = player.holes.reduce((s, h) => s + (h.bunkersOther ?? 0), 0);
  const totalBunkers = totalBunkersNearGreen + totalBunkersFairway + totalBunkersOther;

  const totalPenaltiesWater = player.holes.reduce((s, h) => s + (h.penaltiesWater ?? 0), 0);
  const totalPenaltiesOOB = player.holes.reduce((s, h) => s + (h.penaltiesOOB ?? 0), 0);
  const totalPenaltiesOther = player.holes.reduce((s, h) => s + (h.penaltiesOther ?? 0), 0);
  const totalPenalties = totalPenaltiesWater + totalPenaltiesOOB + totalPenaltiesOther;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Player header */}
      <div className="px-4 py-3 bg-green-700">
        <div className="font-semibold text-white">{player.name}</div>
        <div className="text-xs text-green-200 mt-0.5">
          HCP {Number(player.hcp).toFixed(1)} · {played.length}/{player.holes.length} {t('scorecard.stats.holesPlayed')}
        </div>
      </div>

      {/* Scoring */}
      <Section title={t('scorecard.score') + ' & ' + t('scorecard.putts')}>
        <StatRow label={t('scorecard.stats.totalStrokes')} value={played.length ? totalStrokes : '—'} />
        <StatRow label={t('scorecard.stats.avgStrokes')} value={avgStrokes} />
        <StatRow label={t('scorecard.stats.totalPutts')} value={played.length ? totalPutts : '—'} />
        <StatRow label={t('scorecard.stats.avgPutts')} value={avgPutts} />
      </Section>

      {/* Tee shots */}
      <Section title={t('scorecard.teeShot')}>
        {teeShotHoles.length === 0 ? (
          <p className="text-sm text-gray-400">{t('scorecard.stats.noData')}</p>
        ) : (
          <>
            <StatRow
              label={t('scorecard.hit')}
              value={`${teeCounts.hit} / ${teeShotHoles.length}`}
              highlight={teeCounts.hit > 0}
            />
            <StatRow label={t('scorecard.long')} value={teeCounts.long} />
            <StatRow label={t('scorecard.short')} value={teeCounts.short} />
            <StatRow label={t('scorecard.left')} value={teeCounts.left} />
            <StatRow label={t('scorecard.right')} value={teeCounts.right} />
            <StatRow label={t('scorecard.miss')} value={teeCounts.miss} />
            {clubEntries.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                {clubEntries.map(([club, count]) => (
                  <span
                    key={club}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
                  >
                    {club}
                    <span className="text-green-500">×{count}</span>
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {/* Bunkers */}
      <Section title={t('scorecard.bunkers')}>
        <StatRow label={t('scorecard.nearGreen')} value={totalBunkersNearGreen} />
        <StatRow label={t('scorecard.fairway')} value={totalBunkersFairway} />
        <StatRow label={t('scorecard.other')} value={totalBunkersOther} />
        <StatRow label={t('scorecard.stats.total')} value={totalBunkers} bold />
      </Section>

      {/* Penalties */}
      <Section title={t('scorecard.penalties')}>
        <StatRow label={t('scorecard.water')} value={totalPenaltiesWater} />
        <StatRow label={t('scorecard.oob')} value={totalPenaltiesOOB} />
        <StatRow label={t('scorecard.other')} value={totalPenaltiesOther} />
        <StatRow label={t('scorecard.stats.total')} value={totalPenalties} bold />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {boolean} [props.bold]
 * @param {boolean} [props.highlight]
 */
function StatRow({ label, value, bold, highlight }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm tabular-nums ${
        bold ? 'font-bold text-gray-900'
        : highlight ? 'font-semibold text-green-700'
        : 'text-gray-800'
      }`}>
        {value}
      </span>
    </div>
  );
}

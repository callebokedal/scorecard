import { useTranslation } from 'react-i18next';
import {
  calcPlayingHcp,
  hcpStrokesOnHole,
  calcStablefordPoints,
} from '../../utils/scorecard.utils';

const TEE_DIRECTIONS = ['hit', 'long', 'short', 'left', 'right', 'miss'];
const DIR_LABEL = { hit: '✓', long: '▲', short: '▼', left: '◄', right: '►', miss: '✕' };
const DIR_COLOR = {
  hit: 'text-green-600',
  long: 'text-blue-500',
  short: 'text-blue-500',
  left: 'text-amber-500',
  right: 'text-amber-500',
  miss: 'text-red-500',
};

/**
 * Aggregated round statistics per player.
 * @param {object} props
 * @param {import('../../types/models').Scorecard} props.scorecard
 * @param {import('../../types/models').Course|null} props.course
 */
export function RoundStatsTab({ scorecard, course }) {
  const { t } = useTranslation();
  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col gap-6">
      {scorecard.players.map((player) => (
        <PlayerStats key={player.playerId} player={player} course={course} t={t} />
      ))}
    </div>
  );
}

function PlayerStats({ player, course, t }) {
  const playingHcp = course ? calcPlayingHcp(player.hcp, course.slope) : null;

  const played = player.holes.filter((h) => h.strokes != null);
  const totalStrokes = played.reduce((s, h) => s + h.strokes, 0);
  const playedWithPutts = played.filter((h) => h.putts != null);
  const totalPutts = playedWithPutts.reduce((s, h) => s + h.putts, 0);
  const avgPutts = playedWithPutts.length ? (totalPutts / playedWithPutts.length).toFixed(1) : '—';

  // Points per hole (requires course)
  let totalPoints = 0;
  let pointsHoles = 0;
  if (course) {
    for (const h of played) {
      const info = course.holeInfo.find((hi) => hi.holeNumber === h.holeNumber);
      if (info) {
        const hcpStrokes = hcpStrokesOnHole(playingHcp, info.slopeIndex, course.holes);
        totalPoints += calcStablefordPoints(h.strokes, info.par, hcpStrokes);
        pointsHoles++;
      }
    }
  }
  const avgPoints = pointsHoles ? (totalPoints / pointsHoles).toFixed(2) : null;

  // Sparkline data — holes in order, only those with strokes
  const sparkHoles = [...played].sort((a, b) => a.holeNumber - b.holeNumber);
  const pointsSparkline = course
    ? sparkHoles.flatMap((h) => {
        const info = course.holeInfo.find((hi) => hi.holeNumber === h.holeNumber);
        if (!info) return [];
        const hcpStrokes = hcpStrokesOnHole(playingHcp, info.slopeIndex, course.holes);
        return [calcStablefordPoints(h.strokes, info.par, hcpStrokes)];
      })
    : [];
  const puttsSparkline = sparkHoles.map((h) => h.putts ?? null);

  // Tee shots
  const teeShotHoles = player.holes.filter((h) => h.teeShot != null);
  const teeCounts = Object.fromEntries(TEE_DIRECTIONS.map((d) => [d, 0]));
  teeShotHoles.forEach((h) => { if (h.teeShot in teeCounts) teeCounts[h.teeShot]++; });

  // Per-club breakdown: { clubName: { hit, long, short, left, right, miss } }
  const clubStats = {};
  const unknownCounts = Object.fromEntries(TEE_DIRECTIONS.map((d) => [d, 0]));
  let hasUnknown = false;
  player.holes.forEach((h) => {
    if (!h.teeShot) return;
    if (h.teeClub) {
      if (!clubStats[h.teeClub]) clubStats[h.teeClub] = Object.fromEntries(TEE_DIRECTIONS.map((d) => [d, 0]));
      if (h.teeShot in clubStats[h.teeClub]) clubStats[h.teeClub][h.teeShot]++;
    } else {
      if (h.teeShot in unknownCounts) { unknownCounts[h.teeShot]++; hasUnknown = true; }
    }
  });
  const clubEntries = Object.entries(clubStats).sort(
    (a, b) => Object.values(b[1]).reduce((s, v) => s + v, 0) - Object.values(a[1]).reduce((s, v) => s + v, 0)
  );
  // Only show unknown row if there are known clubs to compare against
  if (hasUnknown && clubEntries.length > 0) {
    clubEntries.push([t('scorecard.stats.unknownClub'), unknownCounts]);
  }

  // Bunkers
  const bunkersNearGreen = player.holes.reduce((s, h) => s + (h.bunkersNearGreen ?? 0), 0);
  const bunkersFairway = player.holes.reduce((s, h) => s + (h.bunkersFairway ?? 0), 0);
  const bunkersOther = player.holes.reduce((s, h) => s + (h.bunkersOther ?? 0), 0);

  // Penalties
  const penaltiesWater = player.holes.reduce((s, h) => s + (h.penaltiesWater ?? 0), 0);
  const penaltiesOOB = player.holes.reduce((s, h) => s + (h.penaltiesOOB ?? 0), 0);
  const penaltiesOther = player.holes.reduce((s, h) => s + (h.penaltiesOther ?? 0), 0);

  return (
    <div className="bg-white mb-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Player header */}
      <div className="px-4 py-3 bg-green-700 flex items-center justify-between">
        <div>
          <div className="font-semibold text-lg text-white">{player.name}</div>
          <div className="text-xs text-green-200 mt-0.5">
            HCP {Number(player.hcp).toFixed(1)} · {played.length}/{player.holes.length} {t('scorecard.stats.holesPlayed')}
          </div>
        </div>
        {pointsHoles > 0 && (() => {
          const diff = totalPoints - pointsHoles * 2;
          const diffStr = diff > 0 ? `+${diff}` : diff === 0 ? 'E' : `${diff}`;
          return (
            <div className="text-right">
              <div className="text-lg font-bold text-white tabular-nums">{totalPoints}p</div>
              <div className="text-xs text-green-200 tabular-nums">{diffStr}</div>
            </div>
          );
        })()}
      </div>

      {/* Scoring */}
      <Section title={t('scorecard.score') + ' & ' + t('scorecard.putts')}>
        <StatRow label={t('scorecard.stats.totalStrokes')} value={played.length ? totalStrokes : '—'} />
        <StatRow label={t('scorecard.stats.totalPutts')} value={played.length ? totalPutts : '—'} />
        <StatRow label={t('scorecard.stats.avgPutts')} value={avgPutts} />
        {avgPoints !== null && (
          <StatRow label={t('scorecard.stats.avgPoints')} value={avgPoints} highlight />
        )}
        {pointsSparkline.length >= 2 && (
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-1">{t('scorecard.stats.pointsPerHole')}</div>
            <Sparkline
              values={pointsSparkline}
              refValue={2}
              dotColor={(v) => v >= 3 ? '#16a34a' : v === 2 ? '#6b7280' : v === 1 ? '#f59e0b' : '#ef4444'}
            />
          </div>
        )}
        {puttsSparkline.filter((v) => v != null).length >= 2 && (
          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1">{t('scorecard.stats.puttsPerHole')}</div>
            <Sparkline
              values={puttsSparkline}
              dotColor={(v) => v <= 1 ? '#16a34a' : v === 2 ? '#6b7280' : '#ef4444'}
            />
          </div>
        )}
      </Section>

      {/* Tee shots */}
      <Section title={t('scorecard.teeShot')}>
        {teeShotHoles.length === 0 ? (
          <p className="text-sm text-gray-400">{t('scorecard.stats.noData')}</p>
        ) : (
          <>
            {/* Overall direction summary */}
            <div className="flex gap-3 flex-wrap mb-3">
              {TEE_DIRECTIONS.map((dir) => teeCounts[dir] > 0 && (
                <span key={dir} className="flex items-center gap-1 text-base">
                  <span className={`font-bold ${DIR_COLOR[dir]}`}>{DIR_LABEL[dir]}</span>
                  <span className="text-gray-700 tabular-nums">{teeCounts[dir]}</span>
                </span>
              ))}
            </div>

            {/* Per-club breakdown */}
            {clubEntries.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                {clubEntries.map(([club, counts]) => (
                  <div key={club} className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600 w-10 shrink-0">{club}</span>
                    <div className="flex gap-2 flex-wrap">
                      {TEE_DIRECTIONS.map((dir) => counts[dir] > 0 && (
                        <span key={dir} className="flex items-center gap-0.5 text-sm">
                          <span className={`font-bold ${DIR_COLOR[dir]}`}>{DIR_LABEL[dir]}</span>
                          <span className="text-gray-600 tabular-nums">{counts[dir]}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {/* Bunkers */}
      <Section title={t('scorecard.bunkers')}>
        <CompactStatRow items={[
          { label: t('scorecard.nearGreen'), value: bunkersNearGreen },
          { label: t('scorecard.fairway'), value: bunkersFairway },
          { label: t('scorecard.other'), value: bunkersOther },
        ]} total={bunkersNearGreen + bunkersFairway + bunkersOther} />
      </Section>

      {/* Penalties */}
      <Section title={t('scorecard.penalties')}>
        <CompactStatRow items={[
          { label: t('scorecard.water'), value: penaltiesWater },
          { label: t('scorecard.oob'), value: penaltiesOOB },
          { label: t('scorecard.other'), value: penaltiesOther },
        ]} total={penaltiesWater + penaltiesOOB + penaltiesOther} />
      </Section>
    </div>
  );
}

const SL_W = 300;
const SL_H = 48;
const SL_PAD = 6;

function Sparkline({ values, refValue, dotColor }) {
  const nonNull = values.filter((v) => v != null);
  if (nonNull.length < 2) return null;
  const allVals = refValue != null ? [...nonNull, refValue] : nonNull;
  const min = Math.min(...allVals) - 0.5;
  const max = Math.max(...allVals) + 0.5;
  const range = max - min || 1;
  const toX = (i) => SL_PAD + (i / (values.length - 1)) * (SL_W - SL_PAD * 2);
  const toY = (v) => SL_PAD + (1 - (v - min) / range) * (SL_H - SL_PAD * 2);
  const nullY = SL_H - SL_PAD;

  // Build line segments, breaking on null
  const segments = [];
  let seg = [];
  values.forEach((v, i) => {
    if (v != null) {
      seg.push(`${toX(i)},${toY(v)}`);
    } else {
      if (seg.length >= 2) segments.push(seg.join(' '));
      seg = [];
    }
  });
  if (seg.length >= 2) segments.push(seg.join(' '));

  return (
    <svg viewBox={`0 0 ${SL_W} ${SL_H}`} className="w-full" style={{ height: 48 }}>
      {refValue != null && (
        <line x1={SL_PAD} y1={toY(refValue)} x2={SL_W - SL_PAD} y2={toY(refValue)}
          stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" />
      )}
      {segments.map((pts, i) => (
        <polyline key={i} points={pts} fill="none" stroke="#9ca3af" strokeWidth="1.5"
          strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {values.map((v, i) =>
        v != null ? (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5"
            fill={dotColor ? dotColor(v) : '#6b7280'} />
        ) : (
          <circle key={i} cx={toX(i)} cy={nullY} r="3.5"
            fill="white" stroke="#d1d5db" strokeWidth="1.5" />
        )
      )}
    </svg>
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
/**
 * @param {object} props
 * @param {{ label: string, value: number }[]} props.items
 * @param {number} props.total
 */
function CompactStatRow({ items, total }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-3 flex-wrap">
        {items.map(({ label, value }) => (
          <span key={label} className="text-sm text-gray-600">
            {label} <span className="text-base font-semibold text-gray-800 tabular-nums">{value}</span>
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums shrink-0">
        {t('scorecard.stats.total')} <span className="text-base">{total}</span>
      </span>
    </div>
  );
}

function StatRow({ label, value, bold, highlight }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-base tabular-nums ${
        bold ? 'font-bold text-gray-900'
        : highlight ? 'font-semibold text-green-700'
        : 'text-gray-800'
      }`}>
        {value}
      </span>
    </div>
  );
}

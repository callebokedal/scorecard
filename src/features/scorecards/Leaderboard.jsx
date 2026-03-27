import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  computePlayerTotals,
  calcPlayingHcp,
  hcpStrokesOnHole,
  calcStablefordPoints,
} from '../../utils/scorecard.utils';

/** @typedef {'auto'|'portrait'|'landscape'} OrientationMode */

const ORIENTATION_CYCLE = { auto: 'landscape', landscape: 'portrait', portrait: 'auto' };
const ORIENTATION_KEY = 'scorecard:leaderboard:orientation';
const NET_VIEW_KEY = 'scorecard:leaderboard:netView';

function loadOrientation() {
  try {
    const v = localStorage.getItem(ORIENTATION_KEY);
    return v === 'landscape' || v === 'portrait' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

function loadNetView() {
  try {
    return localStorage.getItem(NET_VIEW_KEY) === 'true';
  } catch {
    return false;
  }
}

const OrientationIcons = {
  auto: (
    // Rotate-cw (lucide)
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
      <polyline points="21 3 21 8 16 8"/>
    </svg>
  ),
  portrait: (
    // Phone standing
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  landscape: (
    // Phone on side
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="18" y1="12" x2="18.01" y2="12"/>
    </svg>
  ),
};

/**
 * Leaderboard tab — portrait summary table + landscape per-hole table.
 * Includes a manual orientation toggle.
 * @param {object} props
 * @param {import('../../types/models').Scorecard} props.scorecard
 * @param {import('../../types/models').Course|null} props.course
 */
export function Leaderboard({ scorecard, course }) {
  const { t } = useTranslation();
  const [orientation, setOrientation] = useState(/** @type {OrientationMode} */ (loadOrientation));
  const [netView, setNetView] = useState(loadNetView);

  const cycleOrientation = () => {
    setOrientation((prev) => {
      const next = ORIENTATION_CYCLE[prev];
      try {
        localStorage.setItem(ORIENTATION_KEY, next);
        if (next === 'portrait') screen.orientation?.lock('portrait-primary');
        else if (next === 'landscape') screen.orientation?.lock('landscape-primary');
        else screen.orientation?.unlock();
      } catch (_) {}
      return next;
    });
  };

  // CSS visibility classes depending on forced vs auto mode
  const portraitClass =
    orientation === 'landscape' ? 'hidden'
    : orientation === 'portrait'  ? 'block'
    : 'block landscape:hidden';
  const landscapeClass =
    orientation === 'portrait'  ? 'hidden'
    : orientation === 'landscape' ? 'block'
    : 'hidden landscape:block';

  const totalHoles = scorecard.holesPlayed <= 9 ? 9 : 18;

  const rows = scorecard.players
    .map((player) => {
      const totals = computePlayerTotals(player, course);
      const playingHcp = course ? calcPlayingHcp(player.hcp, course.slope) : null;
      return { player, ...totals, playingHcp };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints || a.player.name.localeCompare(b.player.name));

  const toggleNetView = () => {
    setNetView((prev) => {
      const next = !prev;
      try { localStorage.setItem(NET_VIEW_KEY, String(next)); } catch (_) {}
      return next;
    });
  };

  const orientationLabel = {
    auto: t('scorecard.orientationAuto'),
    portrait: t('scorecard.orientationPortrait'),
    landscape: t('scorecard.orientationLandscape'),
  }[orientation];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Toolbar */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          type="button"
          onClick={toggleNetView}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors shadow-sm ${
            netView
              ? 'bg-green-700 border-green-700 text-white hover:bg-green-800'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {netView ? t('scorecard.lb.net') : t('scorecard.lb.gross')}
        </button>
        <button
          type="button"
          onClick={cycleOrientation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
        >
          {OrientationIcons[orientation]}
          {orientationLabel}
        </button>
      </div>

      {/* Compact portrait table */}
      <div className={`${portraitClass} max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-3 py-2 text-left w-8">{t('scorecard.lb.rank')}</th>
              <th className="px-3 py-2 text-left">{t('scorecard.lb.player')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.score')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.pts')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.hcpDiff')}</th>
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
                <td className="px-3 py-2.5 text-center font-bold tabular-nums text-green-700">
                  {row.thru > 0 ? row.totalPoints : '—'}
                </td>
                <td className="px-3 py-2.5 text-center">
                  {row.thru > 0 ? (() => {
                    const diff = row.totalPoints - row.thru * 2;
                    return (
                      <span className={`text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${
                        diff > 0 ? 'bg-green-100 text-green-700'
                        : diff < 0 ? 'bg-red-100 text-red-500'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                        {diff > 0 ? `+${diff}` : diff === 0 ? 'E' : diff}
                      </span>
                    );
                  })() : <span className="text-gray-300">—</span>}
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
      <div className={`${landscapeClass} overflow-x-auto`}>
        <table className="text-xs bg-white rounded-xl shadow-sm border border-gray-100 w-full min-w-max">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide">
              <th className="px-3 py-2 text-left sticky left-0 bg-gray-50">
                {t('scorecard.lb.holes')}
              </th>
              {Array.from({ length: scorecard.holesPlayed }, (_, i) => {
                const holeNum = (scorecard.startHole ?? 1) + i;
                return <th key={holeNum} className="px-2 py-2 text-center w-10">{holeNum}</th>;
              })}
              <th className="px-3 py-2 text-center">{t('scorecard.lb.tot')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.pts')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.hcpDiff')}</th>
              <th className="px-3 py-2 text-center">{t('scorecard.lb.thru')}</th>
            </tr>
            <tr className="bg-gray-50 border-t border-gray-100 text-gray-500">
              <td className="px-3 py-1 text-xs font-semibold sticky left-0 bg-gray-50">
                {t('scorecard.lb.par')}
              </td>
              {Array.from({ length: scorecard.holesPlayed }, (_, i) => {
                const holeNum = (scorecard.startHole ?? 1) + i;
                const info = course?.holeInfo.find((h) => h.holeNumber === holeNum);
                return (
                  <td key={holeNum} className="px-2 py-1 text-center text-xs font-medium tabular-nums">
                    {info?.par ?? '—'}
                  </td>
                );
              })}
              <td className="px-3 py-1 text-center text-xs font-medium tabular-nums">
                {course ? (() => {
                  const startHole = scorecard.startHole ?? 1;
                  return course.holeInfo
                    .filter((h) => h.holeNumber >= startHole && h.holeNumber < startHole + scorecard.holesPlayed)
                    .reduce((s, h) => s + h.par, 0);
                })() : '—'}
              </td>
              <td colSpan={3} />
            </tr>
            <tr className="bg-gray-50 border-t border-gray-100 text-gray-400">
              <td className="px-3 py-1 text-xs font-semibold sticky left-0 bg-gray-50">
                {t('scorecard.lb.si')}
              </td>
              {Array.from({ length: scorecard.holesPlayed }, (_, i) => {
                const holeNum = (scorecard.startHole ?? 1) + i;
                const info = course?.holeInfo.find((h) => h.holeNumber === holeNum);
                return (
                  <td key={holeNum} className="px-2 py-1 text-center text-xs tabular-nums">
                    {info?.slopeIndex ?? '—'}
                  </td>
                );
              })}
              <td colSpan={4} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const hcpDiff = row.thru > 0 ? row.totalPoints - row.thru * 2 : null;
              return (
              <tr key={row.player.playerId} className="border-t border-gray-100">
                <td className="px-3 py-2 sticky left-0 bg-white">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-gray-400 font-medium tabular-nums">{idx + 1}</span>
                    <span className="font-semibold text-gray-800">{row.player.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    HCP {Number(row.player.hcp).toFixed(1)}
                    {row.playingHcp != null && (
                      <span className="ml-1 text-gray-300">· {row.playingHcp}</span>
                    )}
                  </div>
                </td>
                {row.player.holes.map((hole) => {
                  const info = course?.holeInfo.find((h) => h.holeNumber === hole.holeNumber);
                  const hcpStrokes = row.playingHcp != null && info
                    ? hcpStrokesOnHole(row.playingHcp, info.slopeIndex, totalHoles)
                    : 0;
                  const diff = info && hole.strokes != null ? hole.strokes - info.par : null;
                  const displayDiff = netView && diff != null ? diff - hcpStrokes : diff;
                  const points = hole.strokes != null && info
                    ? calcStablefordPoints(hole.strokes, info.par, hcpStrokes)
                    : null;
                  return (
                    <td key={hole.holeNumber} className="px-1 py-1.5 text-center tabular-nums">
                      {hole.strokes != null ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold ${
                            displayDiff == null  ? 'text-gray-500'
                            : displayDiff <= -3  ? 'rounded-full bg-green-600 text-white ring-2 ring-green-700 ring-offset-1'
                            : displayDiff === -2 ? 'rounded-full bg-green-600 text-white ring-2 ring-green-700 ring-offset-1'
                            : displayDiff === -1 ? 'rounded-full bg-green-600 text-white'
                            : displayDiff === 0  ? 'text-gray-800'
                            : displayDiff === 1  ? 'border-2 border-gray-800 text-gray-800'
                            : displayDiff === 2  ? 'border-2 border-gray-800 text-gray-800 ring-2 ring-gray-800 ring-offset-1'
                            :                     'bg-gray-800 text-white ring-2 ring-gray-800 ring-offset-1'
                          }`}>
                            {hole.strokes}
                          </span>
                          <span className="text-[10px] mt-1 font-medium text-green-700 leading-none">
                            {points ?? 0}p
                          </span>
                          {hcpStrokes > 0 && (
                            <span className="text-[10px] text-gray-400 leading-none">
                              {'·'.repeat(hcpStrokes)}
                            </span>
                          )}
                        </div>
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
                <td className="px-3 py-2 text-center">
                  {hcpDiff != null ? (
                    <span className={`text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${
                      hcpDiff > 0 ? 'bg-green-100 text-green-700'
                      : hcpDiff < 0 ? 'bg-red-100 text-red-500'
                      : 'bg-gray-100 text-gray-500'
                    }`}>
                      {hcpDiff > 0 ? `+${hcpDiff}` : hcpDiff === 0 ? 'E' : hcpDiff}
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-3 py-2 text-center text-gray-500 tabular-nums">
                  {row.thru > 0 ? row.thru : '—'}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

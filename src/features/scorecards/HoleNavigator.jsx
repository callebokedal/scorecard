import { useTranslation } from 'react-i18next';

/**
 * Hole navigation bar — prev/next arrows with hole info in the center.
 * @param {object} props
 * @param {number} props.currentHole - absolute hole number (e.g. 10 for back 9)
 * @param {number} props.firstHole - first hole of the round (1 or 10)
 * @param {number} props.lastHole - last hole of the round (9 or 18)
 * @param {number} props.totalHoles - total holes being played
 * @param {import('../../types/models').HoleInfo|null} props.holeInfo
 * @param {() => void} props.onPrev
 * @param {() => void} props.onNext
 * @param {boolean} [props.hasMissingScores]
 */
export function HoleNavigator({ currentHole, firstHole, lastHole, totalHoles, holeInfo, onPrev, onNext, hasMissingScores }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
      <button
        onClick={onPrev}
        disabled={currentHole <= firstHole}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-transform text-lg"
        aria-label={t('common.back')}
      >
        ←
      </button>

      <div className="text-center">
        <div className="font-bold text-gray-800 text-lg">
          {t('scorecard.hole', { number: currentHole })}
        </div>
        {holeInfo ? (
          <div className="text-sm text-gray-500">
            Par {holeInfo.par}
            <span className="mx-1.5 text-gray-300">·</span>
            SI {holeInfo.slopeIndex}
            {holeInfo.length && (
              <>
                <span className="mx-1.5 text-gray-300">·</span>
                {holeInfo.length} m
              </>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400">{t('scorecard.noCourseSelected')}</div>
        )}
        <div className="text-xs text-gray-400 mt-0.5">
          {t('scorecard.holeFraction', { current: currentHole - firstHole + 1, total: totalHoles })}
        </div>
        {hasMissingScores && (
          <div className="flex items-center justify-center gap-1 mt-1 text-amber-500 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {t('scorecard.missingPrevScores')}
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={currentHole >= lastHole}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-transform text-lg"
        aria-label="→"
      >
        →
      </button>
    </div>
  );
}

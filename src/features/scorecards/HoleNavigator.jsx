import { useTranslation } from 'react-i18next';

/**
 * Hole navigation bar — prev/next arrows with hole info in the center.
 * @param {object} props
 * @param {number} props.currentHole - 1-based
 * @param {number} props.totalHoles
 * @param {import('../../types/models').HoleInfo|null} props.holeInfo
 * @param {() => void} props.onPrev
 * @param {() => void} props.onNext
 */
export function HoleNavigator({ currentHole, totalHoles, holeInfo, onPrev, onNext }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
      <button
        onClick={onPrev}
        disabled={currentHole <= 1}
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
          {t('scorecard.holeFraction', { current: currentHole, total: totalHoles })}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={currentHole >= totalHoles}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-transform text-lg"
        aria-label="→"
      >
        →
      </button>
    </div>
  );
}

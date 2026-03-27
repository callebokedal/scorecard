import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import { calcStablefordPoints } from '../../utils/scorecard.utils';

/**
 * Numpad modal for quick score entry on a single hole.
 * @param {object} props
 * @param {string} props.playerName
 * @param {import('../../types/models').HoleScore} props.holeScore
 * @param {(updates: Partial<import('../../types/models').HoleScore>) => void} props.onChange
 * @param {() => void} props.onClose
 * @param {import('../../types/models').HoleInfo|null} [props.holeInfo]
 * @param {number} [props.hcpStrokes]
 */
export function ScoreQuickEntryModal({ playerName, holeScore, onChange, onClose, holeInfo, hcpStrokes = 0 }) {
  const { t } = useTranslation();
  const [showHighRange, setShowHighRange] = useState(holeScore.strokes >= 10);

  const select = (strokes) => {
    onChange({ strokes, skipped: false });
    onClose();
  };

  const expectedStrokes = holeInfo ? holeInfo.par + hcpStrokes : null;

  const numBtn = (n) => {
    const isActive = holeScore.strokes === n && !holeScore.skipped;
    const isExpected = n === expectedStrokes;
    const points = holeInfo ? calcStablefordPoints(n, holeInfo.par, hcpStrokes) : null;
    return (
      <button
        key={n}
        type="button"
        onClick={() => select(n)}
        className={`h-14 rounded-lg text-lg font-semibold cursor-pointer transition-colors flex flex-col items-center justify-center gap-0 ${
          isActive
            ? 'bg-green-600 text-white'
            : isExpected
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 ring-2 ring-green-500'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        <span>{n}</span>
        {points != null && (
          <span className={`text-[10px] font-medium leading-none ${
            isActive ? 'text-green-100' : points >= 3 ? 'text-green-600' : points === 0 ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {points}p
          </span>
        )}
      </button>
    );
  };

  return (
    <Modal title={`${t('scorecard.score')} – ${playerName}`} onClose={onClose}>
      {!showHighRange ? (
        <>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(numBtn)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { onChange({ strokes: null, skipped: false }); onClose(); }}
              className="h-12 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
            >
              {t('scorecard.clear')}
            </button>
            <button
              type="button"
              onClick={() => { onChange({ strokes: null, skipped: true }); onClose(); }}
              className={`h-12 rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                holeScore.skipped
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-red-400 hover:bg-red-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </button>
            <button
              type="button"
              onClick={() => setShowHighRange(true)}
              className={`h-12 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
                holeScore.strokes >= 10
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              10+
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {Array.from({ length: 16 }, (_, i) => i + 10).map(numBtn)}
          </div>
          <button
            type="button"
            onClick={() => setShowHighRange(false)}
            className="w-full h-11 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
          >
            {t('common.back')} 1–9
          </button>
        </>
      )}
    </Modal>
  );
}

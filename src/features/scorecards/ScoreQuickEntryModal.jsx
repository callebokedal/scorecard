import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';

/**
 * Numpad modal for quick score entry on a single hole.
 * @param {object} props
 * @param {string} props.playerName
 * @param {import('../../types/models').HoleScore} props.holeScore
 * @param {(updates: Partial<import('../../types/models').HoleScore>) => void} props.onChange
 * @param {() => void} props.onClose
 */
export function ScoreQuickEntryModal({ playerName, holeScore, onChange, onClose }) {
  const { t } = useTranslation();
  const [showHighRange, setShowHighRange] = useState(holeScore.strokes >= 10);

  const select = (strokes) => {
    onChange({ strokes, skipped: false });
    onClose();
  };

  const numBtn = (n) => {
    const isActive = holeScore.strokes === n && !holeScore.skipped;
    return (
      <button
        key={n}
        type="button"
        onClick={() => select(n)}
        className={`h-14 rounded-lg text-lg font-semibold cursor-pointer transition-colors ${
          isActive
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {n}
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
              className={`h-12 rounded-lg text-xl font-semibold cursor-pointer transition-colors ${
                holeScore.skipped
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              —
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

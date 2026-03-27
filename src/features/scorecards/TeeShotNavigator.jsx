import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TeeClubModal } from './TeeClubModal';

/**
 * 5-way tee shot direction selector + miss + club selector.
 * Renders as a circular D-pad with 4 directional wedge buttons and a center HIT button.
 * @param {object} props
 * @param {import('../../types/models').TeeShot|null} props.value
 * @param {(v: import('../../types/models').TeeShot|null) => void} props.onChange
 * @param {import('../../types/models').TeeClub|null} props.club
 * @param {(v: import('../../types/models').TeeClub|null) => void} props.onClubChange
 */
export function TeeShotNavigator({ value, onChange, club, onClubChange }) {
  const { t } = useTranslation();
  const [clubModalOpen, setClubModalOpen] = useState(false);
  const select = (option) => onChange(value === option ? null : option);

  const wedgeActive = 'bg-green-300';
  const wedgeIdle = 'bg-blue-100 hover:bg-blue-200';

  return (
    <>
      <div className="py-2">
        <div className="flex items-center gap-4">

          {/* Left column: title, club, miss */}
          <div className="flex flex-col items-center h-44">
            <span className="text-sm font-medium text-gray-700">{t('scorecard.teeShot')}</span>
            <div className="flex-1" />

            {/* Club selector */}
            <button
              type="button"
              onClick={() => setClubModalOpen(true)}
              className={`w-10 h-10 rounded-full ring-2 cursor-pointer transition-colors flex items-center justify-center ${
                club
                  ? 'bg-green-600 text-white ring-green-600'
                  : 'bg-white text-gray-500 ring-gray-300 hover:bg-gray-50'
              }`}
            >
              {club ? (
                <span className="text-xs font-bold leading-none">{club}</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="14" y1="3" x2="6" y2="19" />
                  <path d="M3 19h7v2.5H5z" />
                </svg>
              )}
            </button>
            <span className="text-xs text-gray-600 mt-1">{t('scorecard.teeClub')}</span>

            <div className="h-3" />

            {/* Miss */}
            <button
              type="button"
              onClick={() => select('miss')}
              className={`w-10 h-10 rounded-full ring-2 cursor-pointer transition-colors text-base flex items-center justify-center ${
                value === 'miss'
                  ? 'bg-red-500 text-white ring-red-500'
                  : 'bg-white text-gray-500 ring-gray-300 hover:bg-gray-50'
              }`}
            >
              🏌
            </button>
            <span className="text-xs text-gray-600 mt-1">{t('scorecard.miss')}</span>
          </div>

          {/* D-pad */}
          <div className="relative w-44 h-44 shrink-0 rounded-full overflow-hidden select-none">

            {/* Up (Long) */}
            <button
              type="button"
              onClick={() => select('long')}
              style={{ clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)' }}
              className={`absolute inset-0 cursor-pointer transition-colors ${value === 'long' ? wedgeActive : wedgeIdle}`}
            >
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-gray-500 text-xs pointer-events-none">▲</span>
            </button>

            {/* Down (Short) */}
            <button
              type="button"
              onClick={() => select('short')}
              style={{ clipPath: 'polygon(50% 50%, 0% 100%, 100% 100%)' }}
              className={`absolute inset-0 cursor-pointer transition-colors ${value === 'short' ? wedgeActive : wedgeIdle}`}
            >
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-500 text-xs pointer-events-none">▼</span>
            </button>

            {/* Left */}
            <button
              type="button"
              onClick={() => select('left')}
              style={{ clipPath: 'polygon(50% 50%, 0% 0%, 0% 100%)' }}
              className={`absolute inset-0 cursor-pointer transition-colors ${value === 'left' ? wedgeActive : wedgeIdle}`}
            >
              <span className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">◄</span>
            </button>

            {/* Right */}
            <button
              type="button"
              onClick={() => select('right')}
              style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)' }}
              className={`absolute inset-0 cursor-pointer transition-colors ${value === 'right' ? wedgeActive : wedgeIdle}`}
            >
              <span className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">►</span>
            </button>

            {/* Center HIT button */}
            <button
              type="button"
              onClick={() => select('hit')}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ring-2 cursor-pointer z-10 font-semibold transition-colors flex flex-col items-center justify-center leading-tight ${
                value === 'hit'
                  ? 'bg-green-600 text-white ring-green-700'
                  : 'bg-white text-gray-700 ring-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs">{t('scorecard.hit').toUpperCase()}</span>
              <span className="text-xs">✓</span>
            </button>
          </div>

        </div>
      </div>

      {clubModalOpen && (
        <TeeClubModal
          value={club}
          onChange={onClubChange}
          onClose={() => setClubModalOpen(false)}
        />
      )}
    </>
  );
}

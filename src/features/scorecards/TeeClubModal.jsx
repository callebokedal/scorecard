import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';

const CLUB_GROUPS = [
  { labelKey: 'scorecard.clubWoods',   clubs: ['1W', '3W', '5W', '7W'] },
  { labelKey: 'scorecard.clubHybrids', clubs: ['2H', '3H', '4H', '5H'] },
  { labelKey: 'scorecard.clubIrons',   clubs: ['2i', '3i', '4i', '5i', '6i', '7i', '8i', '9i'] },
];

/**
 * Club selector modal for tee club selection.
 * @param {object} props
 * @param {import('../../types/models').TeeClub|null} props.value
 * @param {(v: import('../../types/models').TeeClub|null) => void} props.onChange
 * @param {() => void} props.onClose
 */
export function TeeClubModal({ value, onChange, onClose }) {
  const { t } = useTranslation();

  const select = (club) => {
    onChange(value === club ? null : club);
    onClose();
  };

  return (
    <Modal title={t('scorecard.teeClub')} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {CLUB_GROUPS.map(({ labelKey, clubs }) => (
          <div key={labelKey}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
              {t(labelKey)}
            </span>
            <div className="flex flex-wrap gap-2">
              {clubs.map((club) => (
                <button
                  key={club}
                  type="button"
                  onClick={() => select(club)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
                    value === club
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {club}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => { onChange(null); onClose(); }}
          className="w-full h-11 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors mt-1"
        >
          {t('scorecard.clear')}
        </button>
      </div>
    </Modal>
  );
}

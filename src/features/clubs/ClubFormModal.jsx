import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import { useClubsStore } from '../../store/clubs.store';

/**
 * Modal for creating or editing a club.
 * @param {object} props
 * @param {import('../../types/models').Club|null} props.club - Existing club to edit, or null to create
 * @param {() => void} props.onClose
 */
export function ClubFormModal({ club, onClose }) {
  const { t } = useTranslation();
  const addClub = useClubsStore((s) => s.addClub);
  const editClub = useClubsStore((s) => s.editClub);

  const [name, setName] = useState(club?.name ?? '');
  const [address, setAddress] = useState(club?.address ?? '');
  const [note, setNote] = useState(club?.note ?? '');

  const isEditing = !!club;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEditing) {
      editClub(club.id, { name: name.trim(), address: address.trim(), note: note.trim() });
    } else {
      addClub({ name: name.trim(), address: address.trim(), note: note.trim() });
    }
    onClose();
  };

  return (
    <Modal title={isEditing ? t('clubs.form.editTitle') : t('clubs.form.addTitle')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('clubs.form.name')}</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('clubs.form.namePlaceholder')}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('clubs.form.address')}</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t('clubs.form.addressPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('clubs.form.note')}</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('common.optional')}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
          >
            {isEditing ? t('clubs.form.saveBtn') : t('clubs.form.addBtn')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

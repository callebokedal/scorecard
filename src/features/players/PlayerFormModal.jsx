import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import { usePlayersStore } from '../../store/players.store';

const TEE_OPTIONS = ['Yellow', 'White', 'Red', 'Blue', 'Black'];

/**
 * Modal for creating or editing a player.
 * @param {object} props
 * @param {import('../../types/models').Player|null} props.player
 * @param {() => void} props.onClose
 */
export function PlayerFormModal({ player, onClose }) {
  const { t } = useTranslation();
  const addPlayer = usePlayersStore((s) => s.addPlayer);
  const editPlayer = usePlayersStore((s) => s.editPlayer);

  const [name, setName] = useState(player?.name ?? '');
  const [hcp, setHcp] = useState(player?.hcp ?? 0);
  const [defaultTee, setDefaultTee] = useState(player?.defaultTee ?? 'Yellow');

  const isEditing = !!player;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data = { name: name.trim(), hcp: Number(hcp), defaultTee };
    if (isEditing) {
      editPlayer(player.id, data);
    } else {
      addPlayer(data);
    }
    onClose();
  };

  return (
    <Modal
      title={isEditing ? t('players.form.editTitle') : t('players.form.addTitle')}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('players.form.name')}
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('players.form.namePlaceholder')}
            required
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('players.form.hcp')}
            </label>
            <input
              type="number" min={-10} max={54} step={0.1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={hcp}
              onChange={(e) => setHcp(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('players.form.defaultTee')}
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={defaultTee}
              onChange={(e) => setDefaultTee(e.target.value)}
            >
              {TEE_OPTIONS.map((tee) => (
                <option key={tee} value={tee}>{tee}</option>
              ))}
            </select>
          </div>
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
            {isEditing ? t('players.form.saveBtn') : t('players.form.addBtn')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

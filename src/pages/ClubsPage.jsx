import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClubsStore } from '../store/clubs.store';
import { ClubFormModal } from '../features/clubs/ClubFormModal';
import { importFile, mergeById } from '../services/importExport.service';
import { saveClubs, loadClubs } from '../services/clubs.service';

export default function ClubsPage() {
  const { t } = useTranslation();
  const clubs = useClubsStore((s) => s.clubs);
  const removeClub = useClubsStore((s) => s.removeClub);
  const navigate = useNavigate();

  const [showAdd, setShowAdd] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [importStatus, setImportStatus] = useState(null); // 'ok' | 'error' | null
  const importRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const data = await importFile(file);
      const merged = mergeById(loadClubs(), data);
      saveClubs(merged);
      useClubsStore.setState({ clubs: merged });
      setImportStatus('ok');
    } catch (err) {
      console.error(err);
      setImportStatus('error');
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleDelete = (club) => {
    if (window.confirm(t('clubs.confirmDelete', { name: club.name }))) {
      removeClub(club.id);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t('clubs.title')}</h1>
        <div className="flex items-center gap-2">
          {importStatus === 'ok' && (
            <span className="text-xs text-green-600 font-medium">{t('settings.importSuccess')} ✓</span>
          )}
          {importStatus === 'error' && (
            <span className="text-xs text-red-500 font-medium">{t('settings.importError')} ✕</span>
          )}
          <button
            onClick={() => importRef.current?.click()}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600"
          >
            {t('clubs.importClubBtn')}
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json,.yaml,.yml"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700"
          >
            {t('clubs.addBtn')}
          </button>
        </div>
      </div>

      {clubs.length === 0 ? (
        <p className="text-gray-400 text-center mt-16">{t('clubs.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {clubs.map((club) => (
            <li key={club.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <button
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                onClick={() => navigate(`/clubs/${club.id}`)}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800">{club.name}</div>
                  {club.address && (
                    <div className="text-sm text-gray-500 mt-0.5">{club.address}</div>
                  )}
                  <div className="text-xs text-green-700 font-medium mt-1">
                    {t('common.courseCount', { count: club.courses.length })} · {t('clubs.manageCourses')}
                  </div>
                </div>
                <svg className="shrink-0 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
              <div className="flex border-t border-gray-100">
                <button
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-bl-xl"
                  onClick={() => setEditingClub(club)}
                >
                  {t('common.edit')}
                </button>
                <button
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-br-xl"
                  onClick={() => handleDelete(club)}
                >
                  {t('common.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showAdd && <ClubFormModal club={null} onClose={() => setShowAdd(false)} />}
      {editingClub && (
        <ClubFormModal club={editingClub} onClose={() => setEditingClub(null)} />
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubsStore } from '../store/clubs.store';
import { ClubFormModal } from '../features/clubs/ClubFormModal';

export default function ClubsPage() {
  const clubs = useClubsStore((s) => s.clubs);
  const removeClub = useClubsStore((s) => s.removeClub);
  const navigate = useNavigate();

  const [showAdd, setShowAdd] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  const handleDelete = (club) => {
    if (window.confirm(`Delete "${club.name}"? This will also remove all its courses.`)) {
      removeClub(club.id);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Clubs</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700"
        >
          + Add Club
        </button>
      </div>

      {clubs.length === 0 ? (
        <p className="text-gray-400 text-center mt-16">No clubs yet. Add one to get started.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {clubs.map((club) => (
            <li
              key={club.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <button
                className="w-full text-left px-4 py-3"
                onClick={() => navigate(`/clubs/${club.id}`)}
              >
                <div className="font-semibold text-gray-800">{club.name}</div>
                {club.address && (
                  <div className="text-sm text-gray-500 mt-0.5">{club.address}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {club.courses.length} {club.courses.length === 1 ? 'course' : 'courses'}
                </div>
              </button>
              <div className="flex border-t border-gray-100">
                <button
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-bl-xl"
                  onClick={() => setEditingClub(club)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-br-xl"
                  onClick={() => handleDelete(club)}
                >
                  Delete
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

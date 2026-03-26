import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useClubsStore } from '../../store/clubs.store';

/**
 * Modal for creating or editing a course.
 * @param {object} props
 * @param {string} props.clubId
 * @param {import('../../types/models').Course|null} props.course - Existing course or null to create
 * @param {() => void} props.onClose
 */
export function CourseFormModal({ clubId, course, onClose }) {
  const addCourse = useClubsStore((s) => s.addCourse);
  const editCourse = useClubsStore((s) => s.editCourse);

  const [name, setName] = useState(course?.name ?? '');
  const [holes, setHoles] = useState(course?.holes ?? 18);
  const [slope, setSlope] = useState(course?.slope ?? 113);
  const [note, setNote] = useState(course?.note ?? '');

  const isEditing = !!course;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEditing) {
      editCourse(clubId, course.id, {
        name: name.trim(),
        slope: Number(slope),
        note: note.trim(),
      });
    } else {
      addCourse(clubId, {
        name: name.trim(),
        holes: Number(holes),
        slope: Number(slope),
        note: note.trim(),
      });
    }
    onClose();
  };

  return (
    <Modal title={isEditing ? 'Edit Course' : 'Add Course'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course name *</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Championship Course"
            required
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Holes {isEditing && <span className="text-gray-400 font-normal">(locked)</span>}
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              value={holes}
              onChange={(e) => setHoles(e.target.value)}
              disabled={isEditing}
            >
              <option value={9}>9</option>
              <option value={18}>18</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course slope</label>
            <input
              type="number"
              min={55}
              max={155}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={slope}
              onChange={(e) => setSlope(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
          >
            {isEditing ? 'Save' : 'Add Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

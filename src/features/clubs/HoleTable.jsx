import { useState } from 'react';
import { useClubsStore } from '../../store/clubs.store';

/**
 * Editable table of hole info (par, slope index, length) for a course.
 * Changes are saved to the store on blur.
 * @param {object} props
 * @param {string} props.clubId
 * @param {import('../../types/models').Course} props.course
 */
export function HoleTable({ clubId, course }) {
  const editCourse = useClubsStore((s) => s.editCourse);
  // Local copy for editing
  const [holeInfo, setHoleInfo] = useState(course.holeInfo);

  const updateField = (holeNumber, field, value) => {
    setHoleInfo((prev) =>
      prev.map((h) =>
        h.holeNumber === holeNumber ? { ...h, [field]: value === '' ? null : Number(value) } : h
      )
    );
  };

  const saveField = (holeNumber, field, value) => {
    const updated = holeInfo.map((h) =>
      h.holeNumber === holeNumber ? { ...h, [field]: value === '' || value === null ? null : Number(value) } : h
    );
    setHoleInfo(updated);
    editCourse(clubId, course.id, { holeInfo: updated });
  };

  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full text-sm min-w-[280px]">
        <thead>
          <tr className="bg-gray-100 text-gray-500 text-xs uppercase">
            <th className="px-4 py-2 text-left w-10">#</th>
            <th className="px-2 py-2 text-center">Par</th>
            <th className="px-2 py-2 text-center">SI</th>
            <th className="px-2 py-2 text-center">m</th>
          </tr>
        </thead>
        <tbody>
          {holeInfo.map((hole) => (
            <tr key={hole.holeNumber} className="border-t border-gray-100 even:bg-gray-50">
              <td className="px-4 py-1.5 font-medium text-gray-600">{hole.holeNumber}</td>
              <td className="px-2 py-1.5">
                <input
                  type="number"
                  min={3}
                  max={5}
                  className="w-14 text-center border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  value={hole.par ?? ''}
                  onChange={(e) => updateField(hole.holeNumber, 'par', e.target.value)}
                  onBlur={(e) => saveField(hole.holeNumber, 'par', e.target.value)}
                />
              </td>
              <td className="px-2 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={course.holes}
                  className="w-14 text-center border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  value={hole.slopeIndex ?? ''}
                  onChange={(e) => updateField(hole.holeNumber, 'slopeIndex', e.target.value)}
                  onBlur={(e) => saveField(hole.holeNumber, 'slopeIndex', e.target.value)}
                />
              </td>
              <td className="px-2 py-1.5">
                <input
                  type="number"
                  min={0}
                  className="w-16 text-center border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  value={hole.length ?? ''}
                  onChange={(e) => updateField(hole.holeNumber, 'length', e.target.value)}
                  onBlur={(e) => saveField(hole.holeNumber, 'length', e.target.value)}
                  placeholder="—"
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50 text-gray-600 font-medium text-xs">
            <td className="px-4 py-1.5">Total</td>
            <td className="px-2 py-1.5 text-center">
              {holeInfo.reduce((s, h) => s + (h.par ?? 0), 0)}
            </td>
            <td />
            <td className="px-2 py-1.5 text-center text-gray-400">
              {holeInfo.some((h) => h.length)
                ? holeInfo.reduce((s, h) => s + (h.length ?? 0), 0) + ' m'
                : ''}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

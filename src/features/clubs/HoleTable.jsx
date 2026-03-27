import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClubsStore } from '../../store/clubs.store';

/**
 * Editable table of hole info (par, slope index, length) for a course.
 * Changes are saved to the store on blur.
 * @param {object} props
 * @param {string} props.clubId
 * @param {import('../../types/models').Course} props.course
 */
export function HoleTable({ clubId, course }) {
  const { t } = useTranslation();
  const editCourse = useClubsStore((s) => s.editCourse);
  const [holeInfo, setHoleInfo] = useState(course.holeInfo);
  const [customParHole, setCustomParHole] = useState(/** @type {number|null} */ (null));
  const [customParValue, setCustomParValue] = useState('');
  const customParInputRef = useRef(null);
  const [lengthModalHole, setLengthModalHole] = useState(/** @type {number|null} */ (null));
  const [lengthModalValue, setLengthModalValue] = useState('');
  const lengthInputRef = useRef(null);

  useEffect(() => {
    if (customParHole != null) customParInputRef.current?.focus();
  }, [customParHole]);

  useEffect(() => {
    if (lengthModalHole != null) lengthInputRef.current?.focus();
  }, [lengthModalHole]);

  const saveField = (holeNumber, field, value) => {
    const updated = holeInfo.map((h) =>
      h.holeNumber === holeNumber
        ? { ...h, [field]: value === '' || value === null ? null : Number(value) }
        : h
    );
    setHoleInfo(updated);
    editCourse(clubId, course.id, { holeInfo: updated });
  };

  const savePar = (holeNumber, par) => {
    saveField(holeNumber, 'par', par);
  };

  const openCustomPar = (hole) => {
    setCustomParValue(hole.par != null ? String(hole.par) : '');
    setCustomParHole(hole.holeNumber);
  };

  const commitCustomPar = () => {
    const n = parseInt(customParValue, 10);
    if (!isNaN(n) && n > 0) savePar(customParHole, n);
    setCustomParHole(null);
  };

  const openLengthModal = (hole) => {
    setLengthModalValue(hole.length != null ? String(hole.length) : '');
    setLengthModalHole(hole.holeNumber);
  };

  const commitLength = () => {
    const n = parseInt(lengthModalValue, 10);
    saveField(lengthModalHole, 'length', isNaN(n) || n <= 0 ? null : n);
    setLengthModalHole(null);
  };

  const siCounts = holeInfo.reduce((acc, h) => {
    if (h.slopeIndex != null) acc[h.slopeIndex] = (acc[h.slopeIndex] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
    <div className="overflow-x-auto -mx-4">
      <table className="w-full text-sm min-w-[280px]">
        <thead>
          <tr className="bg-gray-100 text-gray-500 text-xs uppercase">
            <th className="px-2 py-2 text-left w-8">{t('clubs.holeTable.hole')}</th>
            <th className="px-1 py-2 text-center">{t('clubs.holeTable.par')}</th>
            <th className="px-1 py-2 text-center">{t('clubs.holeTable.si')}</th>
            <th className="px-1 py-2 text-center">{t('clubs.holeTable.length')}</th>
          </tr>
        </thead>
        <tbody>
          {holeInfo.map((hole) => (
            <tr key={hole.holeNumber} className="border-t border-gray-100 even:bg-gray-50">
              <td className="px-2 py-1.5 font-medium text-gray-600">{hole.holeNumber}</td>
              <td className="px-1 py-1.5">
                {customParHole === hole.holeNumber ? (
                  <div className="flex items-center gap-1">
                    <input
                      ref={customParInputRef}
                      type="number" min={1}
                      className="w-12 text-center border border-green-400 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-xs"
                      value={customParValue}
                      onChange={(e) => setCustomParValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitCustomPar(); if (e.key === 'Escape') setCustomParHole(null); }}
                      onBlur={commitCustomPar}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5">
                    {[3, 4, 5].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => savePar(hole.holeNumber, p)}
                        className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                          hole.par === p
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => openCustomPar(hole)}
                      className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                        hole.par != null && ![3, 4, 5].includes(hole.par)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={t('clubs.holeTable.customPar')}
                    >
                      {hole.par != null && ![3, 4, 5].includes(hole.par) ? hole.par : '···'}
                    </button>
                  </div>
                )}
              </td>
              <td className="px-1 py-1.5">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => { const v = (hole.slopeIndex ?? 1) - 1; if (v >= 1) saveField(hole.holeNumber, 'slopeIndex', v); }}
                    disabled={(hole.slopeIndex ?? 1) <= 1}
                    className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 disabled:opacity-30 transition-colors"
                  >−</button>
                  <span className={`w-6 text-center text-xs font-medium tabular-nums ${
                    hole.slopeIndex != null && siCounts[hole.slopeIndex] > 1
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-700'
                  }`}>
                    {hole.slopeIndex ?? '—'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { const v = (hole.slopeIndex ?? 0) + 1; if (v <= course.holes) saveField(hole.holeNumber, 'slopeIndex', v); }}
                    disabled={(hole.slopeIndex ?? 0) >= course.holes}
                    className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 disabled:opacity-30 transition-colors"
                  >+</button>
                </div>
              </td>
              <td className="px-1 py-1.5">
                <button
                  type="button"
                  onClick={() => openLengthModal(hole)}
                  className="w-14 h-6 rounded bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition-colors tabular-nums"
                >
                  {hole.length != null ? `${hole.length}m` : '—'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50 text-gray-600 font-medium text-xs">
            <td className="px-1 py-1.5" colspan="3">{t('clubs.holeTable.total')}:
              <span className='ps-1'>{holeInfo.reduce((s, h) => s + (h.par ?? 0), 0)}</span>
            </td>
            <td className="px-1 py-1.5 text-center text-gray-400">
              {holeInfo.some((h) => h.length)
                ? holeInfo.reduce((s, h) => s + (h.length ?? 0), 0) + ' m'
                : ''}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    {lengthModalHole != null && (() => {

      const hole = holeInfo.find((h) => h.holeNumber === lengthModalHole);
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setLengthModalHole(null)}>
          <div className="bg-white rounded-xl shadow-xl p-5 w-64 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-semibold text-gray-700 mb-3">
              {t('clubs.holeTable.lengthModalTitle', { hole: lengthModalHole })}
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={lengthInputRef}
                type="number" min={0}
                className="flex-1 text-center border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={lengthModalValue}
                onChange={(e) => setLengthModalValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitLength(); if (e.key === 'Escape') setLengthModalHole(null); }}
                placeholder="metres"
              />
              <span className="text-sm text-gray-400">m</span>
            </div>
            <div className="flex gap-2 mt-4">
              {hole?.length != null && (
                <button
                  type="button"
                  onClick={() => { saveField(lengthModalHole, 'length', null); setLengthModalHole(null); }}
                  className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm hover:bg-gray-200"
                >
                  {t('common.delete')}
                </button>
              )}
              <button type="button" onClick={commitLength} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}

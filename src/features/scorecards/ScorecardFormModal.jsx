import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import { useClubsStore } from '../../store/clubs.store';
import { usePlayersStore } from '../../store/players.store';
import { useScorecardsStore } from '../../store/scorecards.store';
import { createInitialHoleScores, todayISO } from '../../utils/scorecard.utils';

/**
 * Modal for creating a new scorecard.
 * @param {object} props
 * @param {() => void} props.onClose
 * @param {(id: string) => void} props.onCreated
 */
export function ScorecardFormModal({ onClose, onCreated }) {
  const { t } = useTranslation();
  const clubs = useClubsStore((s) => s.clubs);
  const players = usePlayersStore((s) => s.players);
  const addScorecard = useScorecardsStore((s) => s.addScorecard);

  const allCourses = clubs.flatMap((club) =>
    club.courses.map((course) => ({
      courseId: course.id,
      courseName: course.name,
      clubName: club.name,
      holes: course.holes,
      slope: course.slope,
      holeInfo: course.holeInfo,
    }))
  );

  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayISO());
  const [holesPlayed, setHolesPlayed] = useState(18);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);

  useEffect(() => {
    const course = allCourses.find((c) => c.courseId === courseId);
    if (course) {
      setName(course.courseName);
      setHolesPlayed(course.holes);
    } else {
      setHolesPlayed(18);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const selectedCourse = allCourses.find((c) => c.courseId === courseId) ?? null;

  const togglePlayer = (id) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || selectedPlayerIds.length === 0) return;

    const scorecardPlayers = selectedPlayerIds.map((pid) => {
      const player = players.find((p) => p.id === pid);
      return {
        playerId: pid,
        name: player.name,
        hcp: player.hcp,
        holes: createInitialHoleScores(holesPlayed),
      };
    });

    const sc = addScorecard({
      name: name.trim(),
      date,
      courseId: courseId || null,
      holesPlayed,
      players: scorecardPlayers,
    });

    onCreated(sc.id);
  };

  return (
    <Modal title={t('scorecards.form.title')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('scorecards.form.course')}
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">{t('scorecards.form.noCourse')}</option>
            {clubs.map((club) =>
              club.courses.length > 0 ? (
                <optgroup key={club.id} label={club.name}>
                  {club.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.holes})
                    </option>
                  ))}
                </optgroup>
              ) : null
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('scorecards.form.roundName')}
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('scorecards.form.roundNamePlaceholder')}
            required
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('scorecards.form.date')}
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('scorecards.form.holes')}
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={holesPlayed}
              onChange={(e) => setHolesPlayed(Number(e.target.value))}
            >
              {selectedCourse && selectedCourse.holes === 9 ? (
                <option value={9}>9</option>
              ) : (
                <>
                  <option value={9}>9</option>
                  <option value={18}>18</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('scorecards.form.players')}{' '}
            <span className="text-gray-400 font-normal">{t('scorecards.form.maxPlayers')}</span>
          </label>
          {players.length === 0 ? (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              {t('scorecards.form.noPlayers')}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {players.map((player) => {
                const checked = selectedPlayerIds.includes(player.id);
                const disabled = !checked && selectedPlayerIds.length >= 4;
                return (
                  <li key={player.id}>
                    <label
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                        checked
                          ? 'border-green-500 bg-green-50'
                          : disabled
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-green-600"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => togglePlayer(player.id)}
                      />
                      <span className="flex-1 text-sm font-medium text-gray-800">
                        {player.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        HCP {Number(player.hcp).toFixed(1)}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
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
            disabled={!name.trim() || selectedPlayerIds.length === 0}
            className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('scorecards.form.startBtn')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

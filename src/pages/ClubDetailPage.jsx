import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClubsStore } from '../store/clubs.store';
import { TopNav } from '../components/layout/TopNav';
import { CourseFormModal } from '../features/clubs/CourseFormModal';
import { HoleTable } from '../features/clubs/HoleTable';
import { ClubFormModal } from '../features/clubs/ClubFormModal';

export default function ClubDetailPage() {
  const { t } = useTranslation();
  const { clubId } = useParams();
  const navigate = useNavigate();
  const clubs = useClubsStore((s) => s.clubs);
  const removeCourse = useClubsStore((s) => s.removeCourse);

  const club = clubs.find((c) => c.id === clubId);

  const [activeTab, setActiveTab] = useState(0);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingClub, setEditingClub] = useState(false);

  const backBtn = (
    <button
      onClick={() => navigate('/clubs')}
      className="text-white text-xl leading-none px-1"
      aria-label={t('common.back')}
    >
      ←
    </button>
  );

  if (!club) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopNav title={t('clubs.notFound')} leftAction={backBtn} />
      </div>
    );
  }

  const activeCourse = club.courses[activeTab] ?? null;

  const handleDeleteCourse = (course) => {
    if (window.confirm(t('clubs.confirmDeleteCourse', { name: course.name }))) {
      removeCourse(club.id, course.id);
      setActiveTab(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav title={club.name} leftAction={backBtn} />

      <main className="flex-1 max-w-lg mx-auto w-full">
        {/* Club info */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div>
            {club.address && <p className="text-sm text-gray-500">{club.address}</p>}
            {club.note && <p className="text-sm text-gray-400 mt-0.5 italic">{club.note}</p>}
          </div>
          <button
            onClick={() => setEditingClub(true)}
            className="text-sm text-green-700 font-medium hover:underline ml-4 shrink-0"
          >
            {t('clubs.editClubBtn')}
          </button>
        </div>

        {/* Course tabs */}
        <div className="flex items-center gap-1 px-4 overflow-x-auto pb-1">
          {club.courses.map((course, idx) => (
            <button
              key={course.id}
              onClick={() => setActiveTab(idx)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === idx
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {course.name}
            </button>
          ))}
          <button
            onClick={() => setShowAddCourse(true)}
            className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-dashed border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600"
          >
            {t('clubs.addCourseBtn')}
          </button>
        </div>

        {/* Course content */}
        {activeCourse ? (
          <div className="mt-3 px-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm text-gray-500">
                  {t('clubs.holesSlope', { holes: activeCourse.holes, slope: activeCourse.slope })}
                </span>
                {activeCourse.note && (
                  <p className="text-xs text-gray-400 italic mt-0.5">{activeCourse.note}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingCourse(activeCourse)}
                  className="text-sm text-green-700 font-medium hover:underline"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDeleteCourse(activeCourse)}
                  className="text-sm text-red-500 font-medium hover:underline"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t('clubs.holeDetails')}
                </span>
                <span className="text-xs text-gray-400">{t('clubs.siHint')}</span>
              </div>
              <div className="px-4 py-2">
                <HoleTable clubId={club.id} course={activeCourse} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-400 text-sm">
            {t('clubs.noCourses')}{' '}
            <button
              onClick={() => setShowAddCourse(true)}
              className="text-green-600 font-medium hover:underline"
            >
              {t('clubs.addOne')}
            </button>
          </div>
        )}
      </main>

      {showAddCourse && (
        <CourseFormModal
          clubId={club.id}
          course={null}
          onClose={() => {
            setShowAddCourse(false);
            setActiveTab(club.courses.length);
          }}
        />
      )}
      {editingCourse && (
        <CourseFormModal
          clubId={club.id}
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
      {editingClub && (
        <ClubFormModal club={club} onClose={() => setEditingClub(false)} />
      )}
    </div>
  );
}

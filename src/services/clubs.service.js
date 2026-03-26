import { KEYS, getItem, setItem } from './storage.service';

/** @returns {import('../types/models').Club[]} */
export function loadClubs() {
  return getItem(KEYS.clubs, []);
}

/** @param {import('../types/models').Club[]} clubs */
export function saveClubs(clubs) {
  setItem(KEYS.clubs, clubs);
}

/**
 * @param {Omit<import('../types/models').Club, 'id'|'createdAt'|'updatedAt'|'courses'>} data
 * @returns {import('../types/models').Club}
 */
export function createClub(data) {
  const clubs = loadClubs();
  const now = new Date().toISOString();
  const club = {
    id: crypto.randomUUID(),
    courses: [],
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  saveClubs([...clubs, club]);
  return club;
}

/**
 * @param {string} clubId
 * @param {Partial<import('../types/models').Club>} updates
 * @returns {import('../types/models').Club}
 */
export function updateClub(clubId, updates) {
  const clubs = loadClubs();
  const updated = clubs.map((c) =>
    c.id === clubId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  saveClubs(updated);
  return updated.find((c) => c.id === clubId);
}

/** @param {string} clubId */
export function deleteClub(clubId) {
  saveClubs(loadClubs().filter((c) => c.id !== clubId));
}

/**
 * @param {string} clubId
 * @param {Omit<import('../types/models').Course, 'id'|'clubId'|'createdAt'|'updatedAt'|'holeInfo'>} data
 * @returns {import('../types/models').Course}
 */
export function createCourse(clubId, data) {
  const clubs = loadClubs();
  const now = new Date().toISOString();
  const course = {
    id: crypto.randomUUID(),
    clubId,
    holeInfo: Array.from({ length: data.holes }, (_, i) => ({
      holeNumber: i + 1,
      par: 4,
      slopeIndex: i + 1,
      length: null,
      note: '',
    })),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  const updated = clubs.map((c) =>
    c.id === clubId
      ? { ...c, courses: [...c.courses, course], updatedAt: now }
      : c
  );
  saveClubs(updated);
  return course;
}

/**
 * @param {string} clubId
 * @param {string} courseId
 * @param {Partial<import('../types/models').Course>} updates
 * @returns {import('../types/models').Course}
 */
export function updateCourse(clubId, courseId, updates) {
  const clubs = loadClubs();
  let updatedCourse;
  const updated = clubs.map((c) => {
    if (c.id !== clubId) return c;
    const courses = c.courses.map((course) => {
      if (course.id !== courseId) return course;
      updatedCourse = { ...course, ...updates, updatedAt: new Date().toISOString() };
      return updatedCourse;
    });
    return { ...c, courses, updatedAt: new Date().toISOString() };
  });
  saveClubs(updated);
  return updatedCourse;
}

/**
 * @param {string} clubId
 * @param {string} courseId
 */
export function deleteCourse(clubId, courseId) {
  const clubs = loadClubs();
  const updated = clubs.map((c) =>
    c.id === clubId
      ? { ...c, courses: c.courses.filter((co) => co.id !== courseId), updatedAt: new Date().toISOString() }
      : c
  );
  saveClubs(updated);
}

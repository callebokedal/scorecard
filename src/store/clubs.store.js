import { create } from 'zustand';
import * as svc from '../services/clubs.service';

/**
 * Zustand store for clubs and courses.
 * Keeps localStorage in sync via the service layer.
 */
export const useClubsStore = create((set, get) => ({
  clubs: svc.loadClubs(),

  addClub: (data) => {
    const club = svc.createClub(data);
    set((s) => ({ clubs: [...s.clubs, club] }));
    return club;
  },

  editClub: (id, updates) => {
    const club = svc.updateClub(id, updates);
    set((s) => ({ clubs: s.clubs.map((c) => (c.id === id ? club : c)) }));
  },

  removeClub: (id) => {
    svc.deleteClub(id);
    set((s) => ({ clubs: s.clubs.filter((c) => c.id !== id) }));
  },

  addCourse: (clubId, data) => {
    const course = svc.createCourse(clubId, data);
    set((s) => ({
      clubs: s.clubs.map((c) =>
        c.id === clubId ? { ...c, courses: [...c.courses, course] } : c
      ),
    }));
    return course;
  },

  editCourse: (clubId, courseId, updates) => {
    const course = svc.updateCourse(clubId, courseId, updates);
    set((s) => ({
      clubs: s.clubs.map((c) =>
        c.id === clubId
          ? { ...c, courses: c.courses.map((co) => (co.id === courseId ? course : co)) }
          : c
      ),
    }));
  },

  removeCourse: (clubId, courseId) => {
    svc.deleteCourse(clubId, courseId);
    set((s) => ({
      clubs: s.clubs.map((c) =>
        c.id === clubId
          ? { ...c, courses: c.courses.filter((co) => co.id !== courseId) }
          : c
      ),
    }));
  },
}));

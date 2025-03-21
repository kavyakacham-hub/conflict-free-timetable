
import { Faculty, Subject, Classroom, ScheduleEntry, ConflictInfo } from '@/types/scheduler';

// Keys for localStorage
const KEYS = {
  FACULTY: 'timetable-faculty',
  SUBJECTS: 'timetable-subjects',
  CLASSROOMS: 'timetable-classrooms',
  SCHEDULE: 'timetable-schedule',
  CONFLICTS: 'timetable-conflicts',
};

// Save and retrieve faculty data
export const saveFaculty = (faculty: Faculty[]): void => {
  localStorage.setItem(KEYS.FACULTY, JSON.stringify(faculty));
};

export const loadFaculty = (): Faculty[] => {
  const data = localStorage.getItem(KEYS.FACULTY);
  return data ? JSON.parse(data) : [];
};

// Save and retrieve subjects data
export const saveSubjects = (subjects: Subject[]): void => {
  localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
};

export const loadSubjects = (): Subject[] => {
  const data = localStorage.getItem(KEYS.SUBJECTS);
  return data ? JSON.parse(data) : [];
};

// Save and retrieve classrooms data
export const saveClassrooms = (classrooms: Classroom[]): void => {
  localStorage.setItem(KEYS.CLASSROOMS, JSON.stringify(classrooms));
};

export const loadClassrooms = (): Classroom[] => {
  const data = localStorage.getItem(KEYS.CLASSROOMS);
  return data ? JSON.parse(data) : [];
};

// Save and retrieve schedule data
export const saveSchedule = (schedule: ScheduleEntry[]): void => {
  localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
};

export const loadSchedule = (): ScheduleEntry[] => {
  const data = localStorage.getItem(KEYS.SCHEDULE);
  return data ? JSON.parse(data) : [];
};

// Save and retrieve conflicts data
export const saveConflicts = (conflicts: ConflictInfo[]): void => {
  localStorage.setItem(KEYS.CONFLICTS, JSON.stringify(conflicts));
};

export const loadConflicts = (): ConflictInfo[] => {
  const data = localStorage.getItem(KEYS.CONFLICTS);
  return data ? JSON.parse(data) : [];
};

// Clear all timetable data from localStorage
export const clearAllData = (): void => {
  localStorage.removeItem(KEYS.FACULTY);
  localStorage.removeItem(KEYS.SUBJECTS);
  localStorage.removeItem(KEYS.CLASSROOMS);
  localStorage.removeItem(KEYS.SCHEDULE);
  localStorage.removeItem(KEYS.CONFLICTS);
};

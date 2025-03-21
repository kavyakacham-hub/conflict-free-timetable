
export interface Faculty {
  id: string;
  name: string;
  department: string;
  availableTimeSlots: TimeSlot[];
  preferredTimeSlots?: TimeSlot[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  duration: number; // in minutes
  requiredRoomType?: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type?: string;
  building?: string;
  floor?: number;
}

export interface TimeSlot {
  id: string;
  day: Day;
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
}

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  facultyId: string;
  classroomId: string;
  timeSlotId: string;
  day: Day;
  startTime: string;
  endTime: string;
}

export type Day = 
  | "Monday" 
  | "Tuesday" 
  | "Wednesday" 
  | "Thursday" 
  | "Friday" 
  | "Saturday" 
  | "Sunday";

export interface ConflictInfo {
  type: "faculty" | "classroom" | "time";
  message: string;
  relatedEntries: ScheduleEntry[];
}

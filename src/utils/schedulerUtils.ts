
import { 
  Faculty, 
  Subject, 
  Classroom, 
  TimeSlot, 
  ScheduleEntry, 
  ConflictInfo, 
  Day 
} from "@/types/scheduler";

// Check if two time slots overlap
export const doTimeSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  if (slot1.day !== slot2.day) return false;
  
  const start1 = convertTimeToMinutes(slot1.startTime);
  const end1 = convertTimeToMinutes(slot1.endTime);
  const start2 = convertTimeToMinutes(slot2.startTime);
  const end2 = convertTimeToMinutes(slot2.endTime);
  
  return (start1 < end2 && start2 < end1);
};

// Convert time string to minutes since midnight
export const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes back to time string
export const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

// Check if a schedule entry has conflicts with existing entries
export const checkForConflicts = (
  newEntry: ScheduleEntry,
  existingEntries: ScheduleEntry[]
): ConflictInfo[] => {
  const conflicts: ConflictInfo[] = [];
  
  const newTimeSlot: TimeSlot = {
    id: newEntry.timeSlotId,
    day: newEntry.day,
    startTime: newEntry.startTime,
    endTime: newEntry.endTime,
  };
  
  // Check for conflicts with each existing entry
  existingEntries.forEach(entry => {
    const entryTimeSlot: TimeSlot = {
      id: entry.timeSlotId,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
    };
    
    if (doTimeSlotsOverlap(newTimeSlot, entryTimeSlot)) {
      // Faculty conflict - same faculty is scheduled at overlapping times
      if (entry.facultyId === newEntry.facultyId) {
        conflicts.push({
          type: "faculty",
          message: `Faculty is already scheduled during this time slot`,
          relatedEntries: [entry],
        });
      }
      
      // Classroom conflict - same classroom is scheduled at overlapping times
      if (entry.classroomId === newEntry.classroomId) {
        conflicts.push({
          type: "classroom",
          message: `Classroom is already booked during this time slot`,
          relatedEntries: [entry],
        });
      }
    }
  });
  
  return conflicts;
};

// Generate available time slots for the week
export const generateTimeSlots = (): TimeSlot[] => {
  const days: Day[] = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ];
  
  const startHour = 8; // 8:00 AM
  const endHour = 18; // 6:00 PM
  const interval = 60; // 60 minutes
  
  const timeSlots: TimeSlot[] = [];
  let id = 1;
  
  days.forEach(day => {
    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
      
      timeSlots.push({
        id: id.toString(),
        day,
        startTime,
        endTime,
      });
      
      id++;
    }
  });
  
  return timeSlots;
};

// Simple algorithm to generate a conflict-free schedule
export const generateSchedule = (
  subjects: Subject[],
  faculty: Faculty[],
  classrooms: Classroom[],
  timeSlots: TimeSlot[]
): { schedule: ScheduleEntry[], conflicts: ConflictInfo[] } => {
  const schedule: ScheduleEntry[] = [];
  const allConflicts: ConflictInfo[] = [];
  
  // Sort subjects by some priority if needed
  const sortedSubjects = [...subjects];
  
  // Try to assign each subject
  sortedSubjects.forEach(subject => {
    const facultyMember = faculty.find(f => f.id === subject.facultyId);
    if (!facultyMember) return;
    
    // Get available time slots for this faculty
    const availableSlots = facultyMember.availableTimeSlots.length > 0 
      ? facultyMember.availableTimeSlots 
      : timeSlots;
    
    // Preferred slots have priority if they exist
    const preferredSlots = facultyMember.preferredTimeSlots || [];
    const prioritizedSlots = [...preferredSlots, ...availableSlots.filter(
      slot => !preferredSlots.some(ps => ps.id === slot.id)
    )];
    
    // Find suitable classroom
    const suitableClassrooms = subject.requiredRoomType 
      ? classrooms.filter(room => room.type === subject.requiredRoomType)
      : classrooms;
    
    let scheduled = false;
    
    // Try each time slot and classroom combination
    for (const slot of prioritizedSlots) {
      if (scheduled) break;
      
      for (const classroom of suitableClassrooms) {
        const newEntry: ScheduleEntry = {
          id: `${subject.id}-${classroom.id}-${slot.id}`,
          subjectId: subject.id,
          facultyId: facultyMember.id,
          classroomId: classroom.id,
          timeSlotId: slot.id,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
        
        const conflicts = checkForConflicts(newEntry, schedule);
        
        if (conflicts.length === 0) {
          schedule.push(newEntry);
          scheduled = true;
          break;
        } else {
          // If this is the last possible slot/classroom, add to conflicts
          allConflicts.push(...conflicts);
        }
      }
    }
  });
  
  return { schedule, conflicts: allConflicts };
};

// Get sample data for demo
export const getSampleData = () => {
  const faculty: Faculty[] = [
    { 
      id: "1", 
      name: "Dr. Jane Smith", 
      department: "Computer Science",
      availableTimeSlots: generateTimeSlots().filter(ts => 
        ts.day !== "Friday" || convertTimeToMinutes(ts.startTime) < 15 * 60
      ),
    },
    { 
      id: "2", 
      name: "Prof. John Davis", 
      department: "Mathematics",
      availableTimeSlots: generateTimeSlots(),
      preferredTimeSlots: generateTimeSlots().filter(ts => 
        ts.day === "Monday" || ts.day === "Wednesday"
      ),
    },
    { 
      id: "3", 
      name: "Dr. Emily Brown", 
      department: "Physics",
      availableTimeSlots: generateTimeSlots().filter(ts => 
        convertTimeToMinutes(ts.startTime) >= 10 * 60
      ),
    },
  ];
  
  const subjects: Subject[] = [
    { 
      id: "1", 
      name: "Introduction to Programming", 
      code: "CS101", 
      facultyId: "1", 
      duration: 60,
      requiredRoomType: "computer-lab",
    },
    { 
      id: "2", 
      name: "Data Structures", 
      code: "CS201", 
      facultyId: "1", 
      duration: 90,
    },
    { 
      id: "3", 
      name: "Calculus I", 
      code: "MTH101", 
      facultyId: "2", 
      duration: 60,
    },
    { 
      id: "4", 
      name: "Linear Algebra", 
      code: "MTH202", 
      facultyId: "2", 
      duration: 60,
    },
    { 
      id: "5", 
      name: "Classical Mechanics", 
      code: "PHY201", 
      facultyId: "3", 
      duration: 90,
      requiredRoomType: "lab",
    },
  ];
  
  const classrooms: Classroom[] = [
    { 
      id: "1", 
      name: "Room 101", 
      capacity: 30, 
      building: "Engineering", 
      floor: 1,
    },
    { 
      id: "2", 
      name: "Room 205", 
      capacity: 45, 
      building: "Science", 
      floor: 2,
    },
    { 
      id: "3", 
      name: "Computer Lab 1", 
      capacity: 25, 
      type: "computer-lab", 
      building: "Engineering", 
      floor: 1,
    },
    { 
      id: "4", 
      name: "Physics Lab", 
      capacity: 20, 
      type: "lab", 
      building: "Science", 
      floor: 1,
    },
  ];
  
  return { faculty, subjects, classrooms, timeSlots: generateTimeSlots() };
};

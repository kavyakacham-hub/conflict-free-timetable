
import React from 'react';
import { 
  ScheduleEntry, 
  Faculty, 
  Subject, 
  Classroom, 
  Day 
} from '@/types/scheduler';
import { cn } from '@/lib/utils';

interface TimetableViewProps {
  schedule: ScheduleEntry[];
  faculty: Faculty[];
  subjects: Subject[];
  classrooms: Classroom[];
  onEntryClick?: (entry: ScheduleEntry) => void;
  className?: string;
}

const TimetableView: React.FC<TimetableViewProps> = ({ 
  schedule, 
  faculty, 
  subjects, 
  classrooms,
  onEntryClick,
  className
}) => {
  const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
  
  // Get subject, faculty and classroom information for a schedule entry
  const getEntryInfo = (entry: ScheduleEntry) => {
    const subject = subjects.find(s => s.id === entry.subjectId);
    const facultyMember = faculty.find(f => f.id === entry.facultyId);
    const classroom = classrooms.find(c => c.id === entry.classroomId);
    
    return { subject, facultyMember, classroom };
  };
  
  // Check if there's a schedule entry for this day and hour
  const getEntryForTimeSlot = (day: Day, hour: number) => {
    return schedule.find(entry => {
      const startHour = parseInt(entry.startTime.split(':')[0]);
      return entry.day === day && startHour === hour;
    });
  };
  
  // Get a background color based on the faculty
  const getBackgroundColor = (facultyId: string) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-pink-100 border-pink-300 text-pink-800',
    ];
    
    const index = faculty.findIndex(f => f.id === facultyId);
    return colors[index % colors.length];
  };
  
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b">
          <div className="p-2 font-medium text-muted-foreground text-sm">Time / Day</div>
          {days.map(day => (
            <div key={day} className="p-2 font-medium text-center">{day}</div>
          ))}
        </div>
        
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-[100px_repeat(5,1fr)] border-b">
            <div className="p-2 font-medium text-muted-foreground text-sm border-r">
              {hour}:00 - {hour + 1}:00
            </div>
            
            {days.map(day => {
              const entry = getEntryForTimeSlot(day, hour);
              
              if (!entry) {
                return (
                  <div key={`${day}-${hour}`} className="p-2 border-r min-h-[80px]" />
                );
              }
              
              const { subject, facultyMember, classroom } = getEntryInfo(entry);
              
              return (
                <div 
                  key={`${day}-${hour}`} 
                  className={cn(
                    "p-2 border-r min-h-[80px] cursor-pointer transition-all duration-200",
                    "hover:opacity-90 hover:shadow-sm border rounded-md m-1",
                    getBackgroundColor(entry.facultyId)
                  )}
                  onClick={() => onEntryClick && onEntryClick(entry)}
                >
                  <div className="font-medium text-sm">{subject?.code}: {subject?.name}</div>
                  <div className="text-xs mt-1">{facultyMember?.name}</div>
                  <div className="text-xs mt-1">Room: {classroom?.name}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableView;

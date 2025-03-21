
import React from 'react';
import { ConflictInfo, Faculty, Subject, Classroom } from '@/types/scheduler';
import { AlertTriangle } from 'lucide-react';

interface ConflictsListProps {
  conflicts: ConflictInfo[];
  faculty: Faculty[];
  subjects: Subject[];
  classrooms: Classroom[];
}

const ConflictsList: React.FC<ConflictsListProps> = ({ 
  conflicts, 
  faculty, 
  subjects, 
  classrooms 
}) => {
  if (conflicts.length === 0) {
    return null;
  }
  
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.code}: ${subject.name}` : 'Unknown Subject';
  };
  
  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember ? facultyMember.name : 'Unknown Faculty';
  };
  
  const getClassroomName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : 'Unknown Classroom';
  };
  
  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-lg font-medium flex items-center gap-2 text-destructive">
        <AlertTriangle size={18} />
        Scheduling Conflicts
      </h3>
      
      <div className="space-y-3">
        {conflicts.map((conflict, index) => (
          <div 
            key={index} 
            className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
          >
            <p className="font-medium text-sm">{conflict.message}</p>
            
            <div className="mt-2 space-y-2">
              {conflict.relatedEntries.map((entry, entryIndex) => (
                <div key={entryIndex} className="text-xs border-l-2 border-destructive/50 pl-2">
                  <div>{getSubjectName(entry.subjectId)}</div>
                  <div>Faculty: {getFacultyName(entry.facultyId)}</div>
                  <div>Room: {getClassroomName(entry.classroomId)}</div>
                  <div>
                    Time: {entry.day}, {entry.startTime} - {entry.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictsList;

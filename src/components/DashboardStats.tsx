
import React from 'react';
import { Faculty, Subject, Classroom, ScheduleEntry } from '@/types/scheduler';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  faculty: Faculty[];
  subjects: Subject[];
  classrooms: Classroom[];
  schedule: ScheduleEntry[];
  className?: string;
}

const StatCard: React.FC<{ 
  title: string; 
  value: number | string;
  subtitle?: string;
  className?: string;
}> = ({ title, value, subtitle, className }) => (
  <div className={cn(
    "p-6 glass rounded-lg transition-all duration-300 hover-lift", 
    className
  )}>
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className="text-3xl font-semibold mt-1">{value}</p>
    {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
  </div>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  faculty, 
  subjects, 
  classrooms, 
  schedule,
  className
}) => {
  const scheduledSubjectsCount = new Set(schedule.map(entry => entry.subjectId)).size;
  const scheduledFacultyCount = new Set(schedule.map(entry => entry.facultyId)).size;
  const scheduledClassroomsCount = new Set(schedule.map(entry => entry.classroomId)).size;
  
  const scheduleUtilization = subjects.length > 0 
    ? Math.round((scheduledSubjectsCount / subjects.length) * 100) 
    : 0;
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <StatCard 
        title="Faculty" 
        value={faculty.length} 
        subtitle={`${scheduledFacultyCount} scheduled`} 
      />
      <StatCard 
        title="Subjects" 
        value={subjects.length} 
        subtitle={`${scheduledSubjectsCount} scheduled`} 
      />
      <StatCard 
        title="Classrooms" 
        value={classrooms.length} 
        subtitle={`${scheduledClassroomsCount} in use`} 
      />
      <StatCard 
        title="Schedule Utilization" 
        value={`${scheduleUtilization}%`} 
        subtitle={`${scheduledSubjectsCount}/${subjects.length} subjects scheduled`} 
      />
    </div>
  );
};

export default DashboardStats;

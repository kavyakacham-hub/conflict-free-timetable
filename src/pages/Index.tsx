
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Faculty, 
  Subject, 
  Classroom, 
  TimeSlot, 
  ScheduleEntry, 
  ConflictInfo 
} from '@/types/scheduler';
import { generateTimeSlots, getSampleData } from '@/utils/schedulerUtils';
import { 
  saveFaculty, 
  loadFaculty, 
  saveSubjects, 
  loadSubjects, 
  saveClassrooms, 
  loadClassrooms, 
  saveSchedule, 
  loadSchedule, 
  saveConflicts, 
  loadConflicts,
  clearAllData 
} from '@/utils/storageUtils';
import Header from '@/components/Header';
import FacultyForm from '@/components/FacultyForm';
import SubjectForm from '@/components/SubjectForm';
import ClassroomForm from '@/components/ClassroomForm';
import TimetableView from '@/components/TimetableView';
import ConflictsList from '@/components/ConflictsList';
import DashboardStats from '@/components/DashboardStats';
import ScheduleGeneration from '@/components/ScheduleGeneration';
import { toast } from 'sonner';

const Index = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [useSampleData, setUseSampleData] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize time slots
  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const facultyData = loadFaculty();
    const subjectsData = loadSubjects();
    const classroomsData = loadClassrooms();
    const scheduleData = loadSchedule();
    const conflictsData = loadConflicts();
    
    setFaculty(facultyData);
    setSubjects(subjectsData);
    setClassrooms(classroomsData);
    setSchedule(scheduleData);
    setConflicts(conflictsData);
    
    setIsInitialized(true);
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveFaculty(faculty);
      saveSubjects(subjects);
      saveClassrooms(classrooms);
      saveSchedule(schedule);
      saveConflicts(conflicts);
    }
  }, [faculty, subjects, classrooms, schedule, conflicts, isInitialized]);
  
  // Load sample data if requested
  useEffect(() => {
    if (useSampleData) {
      const { faculty, subjects, classrooms } = getSampleData();
      setFaculty(faculty);
      setSubjects(subjects);
      setClassrooms(classrooms);
      toast.success('Sample data loaded successfully');
      setUseSampleData(false);
    }
  }, [useSampleData]);
  
  const handleAddFaculty = (newFaculty: Faculty) => {
    setFaculty([...faculty, newFaculty]);
  };
  
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects([...subjects, newSubject]);
  };
  
  const handleAddClassroom = (newClassroom: Classroom) => {
    setClassrooms([...classrooms, newClassroom]);
  };
  
  const handleScheduleGenerated = (result: { 
    schedule: ScheduleEntry[]; 
    conflicts: ConflictInfo[] 
  }) => {
    setSchedule(result.schedule);
    setConflicts(result.conflicts);
  };
  
  const handleResetData = () => {
    setFaculty([]);
    setSubjects([]);
    setClassrooms([]);
    setSchedule([]);
    setConflicts([]);
    clearAllData();
  };
  
  const handleEntryClick = (entry: ScheduleEntry) => {
    const subject = subjects.find(s => s.id === entry.subjectId);
    const facultyMember = faculty.find(f => f.id === entry.facultyId);
    const classroom = classrooms.find(c => c.id === entry.classroomId);
    
    toast.info(
      <div className="space-y-1">
        <p className="font-medium">{subject?.name} ({subject?.code})</p>
        <p>Faculty: {facultyMember?.name}</p>
        <p>Room: {classroom?.name}</p>
        <p>
          Time: {entry.day}, {entry.startTime} - {entry.endTime}
        </p>
      </div>,
      {
        duration: 5000,
      }
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Timetable Scheduler</h1>
          <p className="text-muted-foreground mt-2">
            Generate conflict-free timetables with intelligent scheduling
          </p>
        </div>
        
        <DashboardStats 
          faculty={faculty}
          subjects={subjects}
          classrooms={classrooms}
          schedule={schedule}
          className="mb-8"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="glass rounded-lg p-6 h-full">
              <h2 className="text-lg font-medium mb-6">Current Schedule</h2>
              {schedule.length > 0 ? (
                <TimetableView 
                  schedule={schedule}
                  faculty={faculty}
                  subjects={subjects}
                  classrooms={classrooms}
                  onEntryClick={handleEntryClick}
                />
              ) : (
                <div className="flex items-center justify-center h-60 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    No schedule generated yet. Add input data and generate a schedule.
                  </p>
                </div>
              )}
              
              <ConflictsList 
                conflicts={conflicts}
                faculty={faculty}
                subjects={subjects}
                classrooms={classrooms}
              />
            </div>
          </div>
          
          <div>
            <ScheduleGeneration
              faculty={faculty}
              subjects={subjects}
              classrooms={classrooms}
              timeSlots={timeSlots}
              onScheduleGenerated={handleScheduleGenerated}
              onResetData={handleResetData}
            />
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setUseSampleData(true)}
                className="text-sm text-primary hover:underline"
              >
                Load sample data for testing
              </button>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Input Data</h2>
          
          <Tabs defaultValue="faculty" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faculty" className="animate-slide-in">
              <FacultyForm onAddFaculty={handleAddFaculty} />
              
              {faculty.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Added Faculty ({faculty.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {faculty.map(f => (
                      <div key={f.id} className="border rounded-md p-4 hover-scale">
                        <p className="font-medium">{f.name}</p>
                        <p className="text-sm text-muted-foreground">{f.department}</p>
                        <p className="text-xs mt-2">
                          Available slots: {f.availableTimeSlots.length}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="subjects" className="animate-slide-in">
              <SubjectForm 
                onAddSubject={handleAddSubject} 
                facultyList={faculty} 
              />
              
              {subjects.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Added Subjects ({subjects.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map(s => (
                      <div key={s.id} className="border rounded-md p-4 hover-scale">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm">{s.code}</p>
                        <p className="text-xs mt-2">
                          Faculty: {faculty.find(f => f.id === s.facultyId)?.name || "Unknown"}
                        </p>
                        <p className="text-xs">Duration: {s.duration} minutes</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="classrooms" className="animate-slide-in">
              <ClassroomForm onAddClassroom={handleAddClassroom} />
              
              {classrooms.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Added Classrooms ({classrooms.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms.map(c => (
                      <div key={c.id} className="border rounded-md p-4 hover-scale">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm">Capacity: {c.capacity}</p>
                        {c.type && (
                          <p className="text-xs mt-2">
                            Type: {c.type.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </p>
                        )}
                        {c.building && (
                          <p className="text-xs">
                            Location: {c.building}{c.floor !== undefined ? `, Floor ${c.floor}` : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;


import React from 'react';
import Header from '@/components/Header';
import { loadSchedule } from '@/utils/storageUtils';
import TimetableView from '@/components/TimetableView';
import { loadFaculty, loadSubjects, loadClassrooms } from '@/utils/storageUtils';

const Schedules = () => {
  const schedule = loadSchedule();
  const faculty = loadFaculty();
  const subjects = loadSubjects();
  const classrooms = loadClassrooms();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Schedules</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your generated timetables
          </p>
        </div>
        
        <div className="glass rounded-lg p-6">
          {schedule.length > 0 ? (
            <TimetableView 
              schedule={schedule}
              faculty={faculty}
              subjects={subjects}
              classrooms={classrooms}
              onEntryClick={() => {}}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No schedules have been generated yet</p>
              <p className="text-sm text-muted-foreground">
                Go to the dashboard to generate your first schedule
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Schedules;

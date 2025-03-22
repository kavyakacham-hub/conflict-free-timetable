
import React, { useState } from 'react';
import Header from '@/components/Header';
import { loadSchedule } from '@/utils/storageUtils';
import TimetableView from '@/components/TimetableView';
import AvailableResources from '@/components/AvailableResources';
import { loadFaculty, loadSubjects, loadClassrooms } from '@/utils/storageUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ClipboardList } from 'lucide-react';

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
            <Tabs defaultValue="timetable" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                <TabsTrigger value="timetable" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Timetable</span>
                </TabsTrigger>
                <TabsTrigger value="available" className="flex items-center gap-2">
                  <ClipboardList size={16} />
                  <span>Available Resources</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="timetable" className="animate-slide-in">
                <TimetableView 
                  schedule={schedule}
                  faculty={faculty}
                  subjects={subjects}
                  classrooms={classrooms}
                  onEntryClick={() => {}}
                />
              </TabsContent>
              
              <TabsContent value="available" className="animate-slide-in">
                <AvailableResources
                  faculty={faculty}
                  classrooms={classrooms}
                  schedule={schedule}
                />
              </TabsContent>
            </Tabs>
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

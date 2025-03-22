
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Faculty, Classroom, ScheduleEntry, Day } from '@/types/scheduler';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AvailableResourcesProps {
  faculty: Faculty[];
  classrooms: Classroom[];
  schedule: ScheduleEntry[];
}

const AvailableResources: React.FC<AvailableResourcesProps> = ({
  faculty,
  classrooms,
  schedule
}) => {
  // Get unique days from the schedule
  const days = Array.from(new Set(schedule.map(entry => entry.day)));
  const weekdays: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const activeDays = weekdays.filter(day => days.includes(day));
  
  // Get unique time slots from the schedule (sorted by start time)
  const timeSlots = Array.from(
    new Set(schedule.map(entry => `${entry.startTime}-${entry.endTime}`))
  ).sort((a, b) => {
    const [aStart] = a.split('-');
    const [bStart] = b.split('-');
    return aStart.localeCompare(bStart);
  });

  // Find faculty with no classes
  const facultyWithClasses = new Set(schedule.map(entry => entry.facultyId));
  const availableFaculty = faculty.filter(f => !facultyWithClasses.has(f.id));
  
  // Find faculty who have classes on some days but not others
  const partiallyAvailableFaculty = faculty.filter(f => 
    facultyWithClasses.has(f.id) && 
    !isFullyScheduled(f.id, activeDays, timeSlots)
  );

  // Find empty classrooms on each day and time slot
  const emptyClassroomsByDayAndTime = activeDays.map(day => {
    const emptiesByTime = timeSlots.map(timeSlot => {
      const [startTime, endTime] = timeSlot.split('-');
      const busyClassrooms = new Set(
        schedule
          .filter(entry => 
            entry.day === day && 
            entry.startTime === startTime && 
            entry.endTime === endTime
          )
          .map(entry => entry.classroomId)
      );
      
      return {
        timeSlot,
        emptyClassrooms: classrooms.filter(c => !busyClassrooms.has(c.id))
      };
    });
    
    return { day, emptiesByTime };
  });

  // Helper function to check if a faculty member is fully scheduled
  function isFullyScheduled(facultyId: string, days: Day[], timeSlots: string[]): boolean {
    let totalSlots = days.length * timeSlots.length;
    let scheduledSlots = schedule.filter(entry => entry.facultyId === facultyId).length;
    return scheduledSlots === totalSlots;
  }

  // Helper function to get availability by day for a faculty member
  function getFacultyAvailabilityByDay(facultyId: string) {
    return activeDays.map(day => {
      const scheduledTimeSlots = new Set(
        schedule
          .filter(entry => entry.facultyId === facultyId && entry.day === day)
          .map(entry => `${entry.startTime}-${entry.endTime}`)
      );
      
      const availableTimeSlots = timeSlots.filter(
        timeSlot => !scheduledTimeSlots.has(timeSlot)
      );
      
      return { day, availableTimeSlots };
    }).filter(info => info.availableTimeSlots.length > 0);
  }

  return (
    <div className="space-y-8">
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-950/50 rounded-t-lg border-b border-indigo-100 dark:border-indigo-900">
          <CardTitle className="text-indigo-700 dark:text-indigo-300">
            Faculty Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {(availableFaculty.length > 0 || partiallyAvailableFaculty.length > 0) ? (
            <div className="space-y-6">
              {availableFaculty.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-indigo-600 dark:text-indigo-400">
                    Faculty with No Classes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableFaculty.map(f => (
                      <div key={f.id} className="p-3 border rounded-md bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-medium">{f.name}</p>
                        <p className="text-sm text-muted-foreground">{f.department}</p>
                        <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Fully Available
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {partiallyAvailableFaculty.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-indigo-600 dark:text-indigo-400">
                    Faculty with Partial Availability
                  </h3>
                  <div className="space-y-4">
                    {partiallyAvailableFaculty.map(f => {
                      const availability = getFacultyAvailabilityByDay(f.id);
                      
                      return (
                        <div key={f.id} className="p-4 border rounded-md bg-white dark:bg-gray-800 shadow-sm">
                          <p className="font-medium">{f.name}</p>
                          <p className="text-sm text-muted-foreground mb-3">{f.department}</p>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {availability.map(({ day, availableTimeSlots }) => (
                              <div key={day} className="border rounded p-2 bg-gray-50 dark:bg-gray-900">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{day}</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {availableTimeSlots.map(slot => (
                                    <Badge key={slot} variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                                      {slot}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-6 text-muted-foreground">All faculty members are fully scheduled.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50 dark:bg-purple-950/50 rounded-t-lg border-b border-purple-100 dark:border-purple-900">
          <CardTitle className="text-purple-700 dark:text-purple-300">
            Empty Classrooms by Day & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {emptyClassroomsByDayAndTime.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Day</TableHead>
                    <TableHead className="min-w-[100px]">Time Slot</TableHead>
                    <TableHead>Empty Classrooms</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emptyClassroomsByDayAndTime.flatMap(({ day, emptiesByTime }) =>
                    emptiesByTime.map(({ timeSlot, emptyClassrooms }) => (
                      <TableRow key={`${day}-${timeSlot}`}>
                        <TableCell className="font-medium">{day}</TableCell>
                        <TableCell>{timeSlot}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xl">
                            {emptyClassrooms.length > 0 ? (
                              emptyClassrooms.map(classroom => (
                                <Badge 
                                  key={classroom.id} 
                                  variant="outline"
                                  className="bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                                >
                                  {classroom.name}
                                  {classroom.type && ` (${classroom.type})`}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No empty classrooms</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-6 text-muted-foreground">No empty classrooms found in the schedule.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableResources;

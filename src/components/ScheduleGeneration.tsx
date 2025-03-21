
import React from 'react';
import { Faculty, Subject, Classroom, TimeSlot } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateSchedule } from '@/utils/schedulerUtils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ScheduleGenerationProps {
  faculty: Faculty[];
  subjects: Subject[];
  classrooms: Classroom[];
  timeSlots: TimeSlot[];
  onScheduleGenerated: (result: ReturnType<typeof generateSchedule>) => void;
  className?: string;
}

const ScheduleGeneration: React.FC<ScheduleGenerationProps> = ({
  faculty,
  subjects,
  classrooms,
  timeSlots,
  onScheduleGenerated,
  className,
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateSchedule = async () => {
    if (faculty.length === 0 || subjects.length === 0 || classrooms.length === 0) {
      toast.error('Please add faculty, subjects, and classrooms first');
      return;
    }

    setIsGenerating(true);

    // Simulate a longer process with setTimeout
    setTimeout(() => {
      try {
        const result = generateSchedule(subjects, faculty, classrooms, timeSlots);
        onScheduleGenerated(result);

        if (result.conflicts.length > 0) {
          toast.warning(`Schedule generated with ${result.conflicts.length} conflicts`);
        } else {
          toast.success('Schedule generated successfully without conflicts');
        }
      } catch (error) {
        console.error('Error generating schedule:', error);
        toast.error('Error generating schedule. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 1500); // Simulate processing time for better UX
  };

  return (
    <div className={`${className} p-6 glass rounded-lg`}>
      <h2 className="text-lg font-medium mb-4">Generate Schedule</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="px-3 py-1">
          {faculty.length} Faculty
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          {subjects.length} Subjects
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          {classrooms.length} Classrooms
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          {timeSlots.length} Time Slots
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Generate a conflict-free timetable based on your input data. The system will attempt to
        optimize the schedule to minimize conflicts and maximize faculty preferences.
      </p>

      <Button
        onClick={handleGenerateSchedule}
        className="w-full py-6 relative overflow-hidden group transition-all duration-300 hover:opacity-90 hover:shadow-md"
        disabled={isGenerating}
      >
        <span className={`${isGenerating ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          Generate Timetable
        </span>
        {isGenerating && (
          <Loader2 className="animate-spin absolute" size={24} />
        )}
        
        <span className="absolute inset-0 rounded-md overflow-hidden">
          <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 bg-primary/10 transition-transform origin-left"></span>
        </span>
      </Button>
    </div>
  );
};

export default ScheduleGeneration;

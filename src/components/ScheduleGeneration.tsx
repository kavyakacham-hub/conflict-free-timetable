
import React from 'react';
import { Faculty, Subject, Classroom, TimeSlot } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateSchedule } from '@/utils/schedulerUtils';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Trash2, Sparkles } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ScheduleGenerationProps {
  faculty: Faculty[];
  subjects: Subject[];
  classrooms: Classroom[];
  timeSlots: TimeSlot[];
  onScheduleGenerated: (result: ReturnType<typeof generateSchedule>) => void;
  onResetData: () => void;
  className?: string;
}

const ScheduleGeneration: React.FC<ScheduleGenerationProps> = ({
  faculty,
  subjects,
  classrooms,
  timeSlots,
  onScheduleGenerated,
  onResetData,
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
          toast.warning(`Schedule generated with ${result.conflicts.length} conflicts`, {
            icon: <Sparkles className="text-yellow-500" size={18} />,
          });
        } else {
          toast.success('Schedule generated successfully without conflicts', {
            icon: <Sparkles className="text-emerald-500" size={18} />,
          });
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
    <div className={`${className} p-6 glass rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition-all duration-300`}>
      <div className="absolute top-2 right-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 w-16 rounded-full opacity-70"></div>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Sparkles className="text-purple-400" size={18} />
        Generate Schedule
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="px-3 py-1 bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
          {faculty.length} Faculty
        </Badge>
        <Badge variant="outline" className="px-3 py-1 bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300">
          {subjects.length} Subjects
        </Badge>
        <Badge variant="outline" className="px-3 py-1 bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
          {classrooms.length} Classrooms
        </Badge>
        <Badge variant="outline" className="px-3 py-1 bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300">
          {timeSlots.length} Time Slots
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Generate a conflict-free timetable based on your input data. The system will attempt to
        optimize the schedule to minimize conflicts and maximize faculty preferences.
      </p>

      <div className="space-y-3">
        <Button
          onClick={handleGenerateSchedule}
          className="w-full py-6 relative overflow-hidden group transition-all duration-300 hover:opacity-90 hover:shadow-md bg-gradient-to-r from-blue-500 to-indigo-600"
          disabled={isGenerating}
        >
          <span className={`${isGenerating ? 'opacity-0' : 'opacity-100'} transition-opacity flex items-center gap-2`}>
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Generate Timetable
          </span>
          {isGenerating && (
            <Loader2 className="animate-spin absolute" size={24} />
          )}
          
          <span className="absolute inset-0 rounded-md overflow-hidden">
            <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 bg-white/10 transition-transform origin-left duration-500"></span>
          </span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={16} />
              Reset All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will clear all faculty, subjects, classrooms, and the current schedule.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onResetData}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reset All Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ScheduleGeneration;

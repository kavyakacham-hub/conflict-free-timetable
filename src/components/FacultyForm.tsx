
import React, { useState } from 'react';
import { Faculty, TimeSlot, Day } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { generateTimeSlots } from '@/utils/schedulerUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FacultyFormProps {
  onAddFaculty: (faculty: Faculty) => void;
  className?: string;
}

const FacultyForm: React.FC<FacultyFormProps> = ({ onAddFaculty, className }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [currentDay, setCurrentDay] = useState<Day>('Monday');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [preferredTimeSlots, setPreferredTimeSlots] = useState<TimeSlot[]>([]);
  
  const allTimeSlots = generateTimeSlots();
  const daysOfWeek: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const handleDaySelect = (day: Day) => {
    setCurrentDay(day);
    if (!selectedDays.includes(day)) {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleRemoveDay = (day: Day) => {
    setSelectedDays(selectedDays.filter(d => d !== day));
    // Remove all time slots for that day
    setAvailableTimeSlots(availableTimeSlots.filter(slot => slot.day !== day));
    setPreferredTimeSlots(preferredTimeSlots.filter(slot => slot.day !== day));
  };
  
  const timeSlotsForDay = allTimeSlots.filter(slot => slot.day === currentDay);
  
  const handleAddTimeSlot = (slot: TimeSlot, isPreferred: boolean) => {
    if (isPreferred) {
      if (!preferredTimeSlots.some(s => s.id === slot.id)) {
        setPreferredTimeSlots([...preferredTimeSlots, slot]);
      }
    } else {
      if (!availableTimeSlots.some(s => s.id === slot.id)) {
        setAvailableTimeSlots([...availableTimeSlots, slot]);
      }
    }
  };
  
  const handleRemoveTimeSlot = (slotId: string, isPreferred: boolean) => {
    if (isPreferred) {
      setPreferredTimeSlots(preferredTimeSlots.filter(s => s.id !== slotId));
    } else {
      setAvailableTimeSlots(availableTimeSlots.filter(s => s.id !== slotId));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !department || availableTimeSlots.length === 0) {
      toast.error('Please fill all required fields and select available time slots');
      return;
    }
    
    const newFaculty: Faculty = {
      id: Date.now().toString(),
      name,
      department,
      availableTimeSlots,
      preferredTimeSlots: preferredTimeSlots.length > 0 ? preferredTimeSlots : undefined,
    };
    
    onAddFaculty(newFaculty);
    toast.success('Faculty added successfully');
    
    // Reset form
    setName('');
    setDepartment('');
    setSelectedDays([]);
    setAvailableTimeSlots([]);
    setPreferredTimeSlots([]);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Faculty Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jane Smith"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Computer Science"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Availability</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Select value={currentDay} onValueChange={(value) => handleDaySelect(value as Day)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {selectedDays.map(day => (
                  <Badge 
                    key={day} 
                    variant="outline" 
                    className="bg-primary/10 hover:bg-primary/20 cursor-pointer px-2 py-1"
                    onClick={() => handleDaySelect(day)}
                  >
                    {day}
                    <button 
                      className="ml-2 text-muted-foreground hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDay(day);
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
              {currentDay && selectedDays.includes(currentDay) && (
                <>
                  <p className="text-sm font-medium mb-2">Time slots for {currentDay}</p>
                  {timeSlotsForDay.map(slot => (
                    <div key={slot.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id={`available-${slot.id}`}
                        checked={availableTimeSlots.some(s => s.id === slot.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddTimeSlot(slot, false);
                          } else {
                            handleRemoveTimeSlot(slot.id, false);
                          }
                        }}
                      />
                      <Label htmlFor={`available-${slot.id}`} className="text-sm cursor-pointer flex-1">
                        {slot.startTime} - {slot.endTime}
                      </Label>
                      <Checkbox 
                        id={`preferred-${slot.id}`}
                        checked={preferredTimeSlots.some(s => s.id === slot.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddTimeSlot(slot, true);
                          } else {
                            handleRemoveTimeSlot(slot.id, true);
                          }
                        }}
                      />
                      <Label htmlFor={`preferred-${slot.id}`} className="text-sm cursor-pointer text-primary">
                        Preferred
                      </Label>
                    </div>
                  ))}
                </>
              )}
              {(!currentDay || !selectedDays.includes(currentDay)) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Select a day to view available time slots
                </p>
              )}
            </div>
          </div>

          {selectedDays.length > 0 && availableTimeSlots.length > 0 && (
            <div className="mt-4 border rounded-md p-3">
              <p className="text-sm font-medium mb-2">Selected Availability:</p>
              {selectedDays.map(day => {
                const daySlots = availableTimeSlots.filter(slot => slot.day === day);
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-2">
                    <p className="text-sm font-medium">{day}:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {daySlots.map(slot => (
                        <Badge key={slot.id} variant="outline" className="text-xs">
                          {slot.startTime} - {slot.endTime}
                          {preferredTimeSlots.some(s => s.id === slot.id) && " (Preferred)"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          Add Faculty
        </Button>
      </div>
    </form>
  );
};

export default FacultyForm;

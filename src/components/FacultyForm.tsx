
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
import { toast } from 'sonner';

interface FacultyFormProps {
  onAddFaculty: (faculty: Faculty) => void;
  className?: string;
}

const FacultyForm: React.FC<FacultyFormProps> = ({ onAddFaculty, className }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedDay, setSelectedDay] = useState<Day>('Monday');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [preferredTimeSlots, setPreferredTimeSlots] = useState<TimeSlot[]>([]);
  
  const allTimeSlots = generateTimeSlots();
  const daysOfWeek: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const timeSlotsForDay = allTimeSlots.filter(slot => slot.day === selectedDay);
  
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
            <div>
              <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as Day)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
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
            </div>
          </div>
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


import React, { useState } from 'react';
import { Classroom } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ClassroomFormProps {
  onAddClassroom: (classroom: Classroom) => void;
  className?: string;
}

const ClassroomForm: React.FC<ClassroomFormProps> = ({ onAddClassroom, className }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('regular');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  
  const roomTypes = ['regular', 'computer-lab', 'lab', 'lecture-hall', 'seminar-room'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !capacity) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name,
      capacity: parseInt(capacity),
      type: type === 'regular' ? undefined : type,
      building: building || undefined,
      floor: floor ? parseInt(floor) : undefined,
    };
    
    onAddClassroom(newClassroom);
    toast.success('Classroom added successfully');
    
    // Reset form
    setName('');
    setCapacity('');
    setType('regular');
    setBuilding('');
    setFloor('');
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Room 101"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="30"
              min="1"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="type">Room Type (Optional)</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map(roomType => (
                  <SelectItem key={roomType} value={roomType}>
                    {roomType === 'regular' ? 'Regular Classroom' : 
                      roomType.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="building">Building (Optional)</Label>
            <Input
              id="building"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="Engineering"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="floor">Floor (Optional)</Label>
            <Input
              id="floor"
              type="number"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="1"
              min="0"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          Add Classroom
        </Button>
      </div>
    </form>
  );
};

export default ClassroomForm;

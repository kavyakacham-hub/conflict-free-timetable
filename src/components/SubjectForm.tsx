
import React, { useState } from 'react';
import { Subject, Faculty } from '@/types/scheduler';
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

interface SubjectFormProps {
  onAddSubject: (subject: Subject) => void;
  facultyList: Faculty[];
  className?: string;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ 
  onAddSubject, 
  facultyList,
  className 
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [duration, setDuration] = useState('60');
  const [requiredRoomType, setRequiredRoomType] = useState('none');
  
  const roomTypes = ['none', 'computer-lab', 'lab', 'lecture-hall', 'seminar-room'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !code || !facultyId || !duration) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      code,
      facultyId,
      duration: parseInt(duration),
      requiredRoomType: requiredRoomType === 'none' ? undefined : requiredRoomType,
    };
    
    onAddSubject(newSubject);
    toast.success('Subject added successfully');
    
    // Reset form
    setName('');
    setCode('');
    setFacultyId('');
    setDuration('60');
    setRequiredRoomType('none');
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduction to Programming"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="CS101"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Select value={facultyId} onValueChange={setFacultyId}>
              <SelectTrigger id="faculty" className="w-full">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {facultyList.length > 0 ? (
                  facultyList.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name} ({faculty.department})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-faculty">No faculty available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {facultyList.length === 0 && (
              <p className="text-xs text-amber-500 mt-1">
                Please add faculty members first
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration" className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roomType">Required Room Type (Optional)</Label>
          <Select value={requiredRoomType} onValueChange={setRequiredRoomType}>
            <SelectTrigger id="roomType" className="w-full">
              <SelectValue placeholder="Select room type (optional)" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'none' ? 'Any Room Type' : 
                    type.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          Add Subject
        </Button>
      </div>
    </form>
  );
};

export default SubjectForm;

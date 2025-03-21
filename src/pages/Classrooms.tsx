
import React from 'react';
import Header from '@/components/Header';
import ClassroomForm from '@/components/ClassroomForm';
import { Classroom as ClassroomType } from '@/types/scheduler';
import { loadClassrooms, saveClassrooms } from '@/utils/storageUtils';
import { toast } from 'sonner';

const Classrooms = () => {
  const [classrooms, setClassrooms] = React.useState<ClassroomType[]>(loadClassrooms());
  
  const handleAddClassroom = (newClassroom: ClassroomType) => {
    const updatedClassrooms = [...classrooms, newClassroom];
    setClassrooms(updatedClassrooms);
    saveClassrooms(updatedClassrooms);
    toast.success("Classroom added successfully");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Classroom Management</h1>
          <p className="text-muted-foreground mt-2">
            Add and manage classrooms for scheduling
          </p>
        </div>
        
        <div className="glass rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Add New Classroom</h2>
          <ClassroomForm onAddClassroom={handleAddClassroom} />
        </div>
        
        {classrooms.length > 0 && (
          <div className="glass rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Classroom List ({classrooms.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.map(c => (
                <div key={c.id} className="border rounded-md p-4 hover-scale bg-card">
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
      </main>
    </div>
  );
};

export default Classrooms;

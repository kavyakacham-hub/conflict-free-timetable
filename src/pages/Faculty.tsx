
import React from 'react';
import Header from '@/components/Header';
import FacultyForm from '@/components/FacultyForm';
import { Faculty as FacultyType } from '@/types/scheduler';
import { loadFaculty, saveFaculty } from '@/utils/storageUtils';
import { toast } from 'sonner';

const Faculty = () => {
  const [faculty, setFaculty] = React.useState<FacultyType[]>(loadFaculty());
  
  const handleAddFaculty = (newFaculty: FacultyType) => {
    const updatedFaculty = [...faculty, newFaculty];
    setFaculty(updatedFaculty);
    saveFaculty(updatedFaculty);
    toast.success("Faculty member added successfully");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Faculty Management</h1>
          <p className="text-muted-foreground mt-2">
            Add and manage faculty members for scheduling
          </p>
        </div>
        
        <div className="glass rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Add New Faculty</h2>
          <FacultyForm onAddFaculty={handleAddFaculty} />
        </div>
        
        {faculty.length > 0 && (
          <div className="glass rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Faculty List ({faculty.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faculty.map(f => (
                <div key={f.id} className="border rounded-md p-4 hover-scale bg-card">
                  <p className="font-medium">{f.name}</p>
                  <p className="text-sm text-muted-foreground">{f.department}</p>
                  <p className="text-xs mt-2">
                    Available slots: {f.availableTimeSlots.length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Faculty;

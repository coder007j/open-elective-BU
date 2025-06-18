"use client";

import React, { useState, useEffect } from 'react';
import type { Department, AuthenticatedUser } from '@/types';
import type { AssignElectivesInput, AssignElectivesOutput } from '@/ai/flows/assign-electives';
import { assignElectives } from '@/ai/flows/assign-electives';
import { DepartmentCard } from './DepartmentCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DEPARTMENTS_DATA, MAX_PREFERENCES } from '@/lib/constants';
import { AssignmentResultDisplay } from './AssignmentResultDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, Send } from 'lucide-react';

export function ElectiveSelectionClient() {
  const { currentUser, updateUserAssignment } = useAuth();
  const { toast } = useToast();

  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(currentUser?.preferences || []);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize preferences from currentUser if available
  useEffect(() => {
    if (currentUser?.preferences) {
      setSelectedPreferences(currentUser.preferences);
    }
  }, [currentUser?.preferences]);

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(departmentId)) {
        return prev.filter(id => id !== departmentId);
      }
      if (prev.length < MAX_PREFERENCES) {
        return [...prev, departmentId];
      }
      toast({
        title: "Selection Limit Reached",
        description: `You can only select up to ${MAX_PREFERENCES} departments.`,
        variant: "default",
      });
      return prev;
    });
  };

  const handleSubmitPreferences = async () => {
    if (!currentUser) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    if (selectedPreferences.length === 0) {
      toast({ title: "No Preferences Selected", description: "Please select at least one department.", variant: "default" });
      return;
    }

    setIsLoading(true);

    const studentPreferencesNames = selectedPreferences.map(id => {
      const dept = departments.find(d => d.id === id);
      return dept ? dept.name : id; // Fallback to ID if name not found, though unlikely
    });

    const assignmentInput: AssignElectivesInput = {
      students: [{
        rollNumber: currentUser.rollNumber,
        preferences: studentPreferencesNames,
      }],
      departments: departments.map(dept => ({
        name: dept.name,
        capacity: dept.capacity,
        // Provide current state of assigned students for accurate AI decision
        assignedStudents: dept.assignedStudents.filter(rollNum => rollNum !== currentUser.rollNumber), // Exclude current student if already in a list by mistake
      })),
    };

    try {
      const result: AssignElectivesOutput = await assignElectives(assignmentInput);
      const studentAssignment = result.assignments.find(a => a.rollNumber === currentUser.rollNumber);

      if (studentAssignment) {
        const assignedDeptObj = departments.find(d => d.name === studentAssignment.assignedDepartment);
        updateUserAssignment(assignedDeptObj ? assignedDeptObj.id : null, studentAssignment.reason || null);
        toast({
          title: "Preferences Submitted",
          description: studentAssignment.assignedDepartment 
            ? `You have been assigned to ${studentAssignment.assignedDepartment}.` 
            : "Assignment could not be made based on current preferences and availability.",
          variant: studentAssignment.assignedDepartment ? "default" : "default", // Using accent would require theme update
        });
      } else {
        toast({ title: "Assignment Error", description: "Could not retrieve assignment result.", variant: "destructive" });
         updateUserAssignment(null, "Could not retrieve assignment result from AI.");
      }
    } catch (error) {
      console.error("Error assigning electives:", error);
      toast({ title: "Submission Failed", description: "An error occurred while submitting your preferences.", variant: "destructive" });
      updateUserAssignment(null, "An error occurred during AI assignment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />;

  if (currentUser.assignedElective) {
    return <AssignmentResultDisplay student={currentUser} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-semibold mb-2 text-primary">Select Your Electives</h2>
        <p className="text-muted-foreground mb-6">
          Choose up to {MAX_PREFERENCES} departments in your order of preference. The first selections will be prioritized.
        </p>
        <Alert className="mb-6 bg-primary/10 border-primary/30">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary">Important Note</AlertTitle>
          <AlertDescription>
            Selected preferences are submitted in order. Your first choice is highest priority.
            You have selected {selectedPreferences.length} out of {MAX_PREFERENCES} departments.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            isSelected={selectedPreferences.includes(dept.id)}
            onSelect={handleSelectDepartment}
            isDisabled={selectedPreferences.length >= MAX_PREFERENCES && !selectedPreferences.includes(dept.id)}
          />
        ))}
      </div>

      {selectedPreferences.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-semibold mb-3 font-headline">Your Current Selection Order:</h3>
          {selectedPreferences.length === 0 ? (
            <p className="text-muted-foreground">No departments selected yet.</p>
          ) : (
            <ol className="list-decimal list-inside space-y-1 mb-6">
              {selectedPreferences.map((id, index) => {
                const dept = departments.find(d => d.id === id);
                return <li key={id} className="text-foreground">{index + 1}. {dept?.name || 'Unknown Department'}</li>;
              })}
            </ol>
          )}
          <Button 
            onClick={handleSubmitPreferences} 
            disabled={isLoading || selectedPreferences.length === 0}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Preferences
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

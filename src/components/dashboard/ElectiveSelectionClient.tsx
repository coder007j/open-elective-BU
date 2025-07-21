
"use client";

import React, { useState, useEffect } from 'react';
import type { Department } from '@/types';
import { DepartmentCard } from './DepartmentCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MAX_PREFERENCES } from '@/lib/constants';
import { useStudentData } from '@/hooks/useStudentData';
import { AssignmentResultDisplay } from './AssignmentResultDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, Send, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ElectiveSelectionClient() {
  const { currentUser, savePreferences } = useAuth();
  const { departments } = useStudentData(); // Get departments from the central hook
  const { toast } = useToast();

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
      toast({ title: "No Preferences Selected", description: "Please select at least one department." });
      return;
    }

    setIsLoading(true);
    savePreferences(selectedPreferences);
    toast({
      title: "Preferences Submitted",
      description: "Your choices have been saved and are awaiting final allocation.",
    });
    setIsLoading(false);
  };

  if (!currentUser) return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />;

  // Case 1: Student has a final, assigned assignment
  if (currentUser.assignedElective) {
    return <AssignmentResultDisplay student={currentUser} />;
  }

  // Case 2: Student has submitted preferences, awaiting final allocation
  if (currentUser.preferences.length > 0 && !currentUser.assignedElective) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg bg-card">
        <CardHeader className="items-center text-center">
          <Clock className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline text-primary">Preferences Submitted</CardTitle>
          <CardDescription>
            Your elective choices have been saved and are now pending final allocation by the admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Your current preferences in order of priority:</p>
          <ol className="list-decimal list-inside space-y-1 text-left w-fit mx-auto">
              {currentUser.preferences.map((id) => {
                const dept = departments.find(d => d.id === id);
                return <li key={id}>{dept?.name || 'Unknown Department'}</li>;
              })}
            </ol>
          <p className="mt-6 text-sm text-muted-foreground">You can edit your preferences until the allocation process is run by the administrator.</p>
           <Button onClick={() => savePreferences([])} variant="outline" className="mt-4">
            Edit Preferences
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Case 3: Student has not yet submitted any preferences
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
              {selectedPreferences.map((id) => {
                const dept = departments.find(d => d.id === id);
                return <li key={id} className="text-foreground">{dept?.name || 'Unknown Department'}</li>;
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


"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { CustomAcademicCapIcon } from "@/components/icons/CustomAcademicCapIcon";
import { LogOut } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  const { logout, currentUser } = useAuth();

  const homeLink = currentUser?.rollNumber === 'department' ? "/admin/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href={homeLink} className="flex items-center gap-2">
           <CustomAcademicCapIcon size={32} className="text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Open Elective</h1>
        </Link>
        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {currentUser.name} ({currentUser.rollNumber})
            </span>
          )}
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

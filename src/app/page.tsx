
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginTabs } from '@/components/auth/LoginTabs';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      if (currentUser.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (currentUser.role === 'department') {
        router.replace('/department/dashboard');
      }
      else {
        router.replace('/dashboard');
      }
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || (!isLoading && currentUser)) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main 
      className="flex flex-1 flex-col items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/seed/students/1920/1080')" }}
      data-ai-hint="university students"
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="z-10 w-full">
        <LoginTabs />
      </div>
    </main>
  );
}

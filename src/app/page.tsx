
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginTabs } from '@/components/auth/LoginTabs';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  // This effect now ONLY handles the case where a user is already logged in
  // when they visit the page. The login form itself now triggers the redirect.
  useEffect(() => {
    if (!isLoading && currentUser) {
      if (currentUser.rollNumber === 'department') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [currentUser, isLoading, router]);

  // This loader handles both the initial page load and the brief moment
  // after a successful login before the redirect is complete.
  if (isLoading || (!isLoading && currentUser)) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-secondary">
      <LoginTabs />
    </main>
  );
}

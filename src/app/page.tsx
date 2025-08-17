
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function RootPage() {
  const router = useRouter();
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace('/home');
    }
  }, [loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}

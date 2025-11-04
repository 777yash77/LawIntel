'use client';

import { useAuth } from '@/hooks/use-auth';
import LawGptClient from '@/components/law-gpt-client';
import Header from '@/components/header';

export default function LawGptPage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <LawGptClient />
    </div>
  );
}

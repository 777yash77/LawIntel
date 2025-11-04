'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LawGptPage from '../page';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { chatId } = params;

  useEffect(() => {
    if (!chatId) {
      router.push('/law-gpt');
    }
  }, [chatId, router]);
  
  // The LawGptPage is reused, and it will handle the activeChatId logic internally.
  // The key is to make sure LawGptClient receives the activeChatId
  return <LawGptPage />;
}

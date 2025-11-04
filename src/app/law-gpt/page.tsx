'use client';
import LawGptPage from '@/components/law-gpt-layout';

export default function NewChatPage() {
  // This page is specifically for starting a new chat.
  // The layout component handles the UI and sidebar.
  return <LawGptPage activeChatId={null} />;
}

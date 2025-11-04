'use client';
import LawGptPage from '@/components/law-gpt-layout';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  // This page is for displaying a specific, existing chat.
  // It passes the active chat ID from the URL to the layout component.
  return <LawGptPage activeChatId={params.chatId} />;
}

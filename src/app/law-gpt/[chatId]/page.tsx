'use client';
import { useParams } from 'next/navigation';
import LawGptPage from '../page';

export default function ChatPage() {
  const params = useParams();
  const { chatId } = params;
  
  // The LawGptPage component can be rendered here, but we need to find a way to pass the chatId
  // One option is to modify LawGptPage to accept it, or use a shared context.
  // For now, let's just show that we have the chatId.
  // In a real app, you would fetch the chat specific to this ID.

  // Re-using LawGptPage is a good idea to avoid duplicating the layout.
  // We'll need to adjust LawGptPage and LawGptClient to handle the active chat ID.
  return <LawGptPage />;
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import LawGptClient from '@/components/law-gpt-client';
import Header from '@/components/header';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useUser, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type LawGptPageProps = {
  activeChatId: string | null;
};

export default function LawGptPage({ activeChatId: activeChatIdFromProps }: LawGptPageProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [activeChatId, setActiveChatId] = useState<string | null>(activeChatIdFromProps);

  useEffect(() => {
    setActiveChatId(activeChatIdFromProps);
  }, [activeChatIdFromProps]);


  const chatHistoryQuery = useMemo(() => {
    // IMPORTANT: Wait for user to be loaded and not be anonymous before querying.
    if (isUserLoading || !user || user.isAnonymous || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'chat_history'), orderBy('timestamp', 'desc'));
  }, [user, firestore, isUserLoading]);

  const { data: chatHistory, isLoading: isHistoryLoading } = useCollection<{ userMessage: string; id: string }>(chatHistoryQuery);

  const handleNewChat = () => {
    setActiveChatId(null);
    router.push('/law-gpt');
  };
  
  // Don't render the chat interface if the user is not logged in properly.
  // This can be replaced with a more elegant loading or sign-in prompt.
  if (isUserLoading) {
     return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <p>Loading user...</p>
        </div>
      </div>
     )
  }
  
  if (!user || user.isAnonymous) {
     return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <p>Please log in to view your chat history.</p>
        </div>
      </div>
     )
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarHeader>
              <Button onClick={handleNewChat} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {isHistoryLoading && <div className="p-2 text-sidebar-foreground">Loading history...</div>}
                {chatHistory &&
                  chatHistory.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild isActive={chat.id === activeChatId}>
                        <Link href={`/law-gpt/${chat.id}`}>
                          <MessageSquare />
                          <span>{chat.userMessage.substring(0, 20)}...</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b p-2 shrink-0">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">{activeChatId ? 'Chat History' : 'New Chat'}</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <LawGptClient activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

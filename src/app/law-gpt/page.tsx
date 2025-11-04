'use client';

import LawGptClient from '@/components/law-gpt-client';
import Header from '@/components/header';
import { Sidebar, SidebarProvider, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';


export default function LawGptPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const chatHistoryQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'chat_history'), orderBy('timestamp', 'desc'));
  }, [user, firestore]);

  const { data: chatHistory, isLoading } = useCollection<{ userMessage: string }>(chatHistoryQuery);

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarHeader>
              <Button onClick={handleNewChat}>New Chat</Button>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {isLoading && <p>Loading history...</p>}
                {chatHistory && chatHistory.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild isActive={chat.id === activeChatId}>
                      <Link href={`/law-gpt/${chat.id}`} onClick={() => setActiveChatId(chat.id)}>
                        <MessageSquare />
                        <span>{chat.userMessage.substring(0, 20)}...</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 flex flex-col">
             <div className="flex items-center gap-2 border-b p-2">
                <SidebarTrigger />
                <h2 className="text-lg font-semibold">LawBot</h2>
              </div>
            <LawGptClient activeChatId={activeChatId} setActiveChatId={setActiveChatId}/>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

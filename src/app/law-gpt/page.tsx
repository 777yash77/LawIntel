'use client';

import LawGptClient from '@/components/law-gpt-client';
import Header from '@/components/header';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import Link from 'next/link';
import { MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';

export default function LawGptPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const [activeChatId, setActiveChatId] = useState<string | null>(typeof params.chatId === 'string' ? params.chatId : null);

  const chatHistoryQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'chat_history'), orderBy('timestamp', 'desc'));
  }, [user, firestore]);

  const { data: chatHistory, isLoading } = useCollection<{ userMessage: string, id: string }>(chatHistoryQuery);

  const handleNewChat = () => {
    setActiveChatId(null);
    router.push('/law-gpt');
  };

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
                {isLoading && <div className="p-2">Loading history...</div>}
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

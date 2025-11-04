'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getArticleDefinitionAndHistory,
  type ArticleDefinitionAndHistoryOutput,
} from '@/ai/flows/article-definition-and-history';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { Loader2, Scale, Send } from 'lucide-react';
import { Separator } from './ui/separator';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { articles } from '@/lib/placeholder-data';
import Image from 'next/image';

const formSchema = z.object({
  articleName: z.string().min(2, {
    message: 'Please enter a legal article name.',
  }),
});

type ChatMessage = {
  isUser: boolean;
  text?: string;
  isLoading?: boolean;
  data?: ArticleDefinitionAndHistoryOutput;
};

type LawGptClientProps = {
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
};


export default function LawGptClient({ activeChatId, setActiveChatId }: LawGptClientProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleName: '',
    },
  });

  const chatDocRef = user && activeChatId ? doc(firestore, 'users', user.uid, 'chat_history', activeChatId) : null;
  const { data: activeChat } = useDoc(chatDocRef);


  useEffect(() => {
    if (activeChat) {
      setChatHistory([
        { isUser: true, text: activeChat.userMessage },
        { isUser: false, data: activeChat.geminiResponse },
      ]);
    } else {
      setChatHistory([]);
    }
  }, [activeChat]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      // User should be anonymously authenticated by this point via useUser hook.
      // If not, there's a problem with Firebase setup.
      console.error("User is not authenticated. Cannot send message.");
      return;
    }

    setIsResponding(true);
    // When starting a new chat from a view with an old chat, clear the old messages.
    if (!activeChatId) {
      setChatHistory([]);
    }

    setChatHistory((prev) => [
      ...prev,
      { isUser: true, text: values.articleName },
      { isUser: false, isLoading: true },
    ]);
    form.reset();

    try {
      const result = await getArticleDefinitionAndHistory({
        articleName: values.articleName,
      });

      const chatEntry = {
        userId: user.uid,
        timestamp: serverTimestamp(),
        userMessage: values.articleName,
        geminiResponse: result,
      };
      
      let newChatId = activeChatId;

      if (activeChatId) {
        const docRef = doc(firestore, 'users', user.uid, 'chat_history', activeChatId);
        setDocumentNonBlocking(docRef, chatEntry, { merge: true });
      } else {
        const colRef = collection(firestore, 'users', user.uid, 'chat_history');
        const newDoc = await addDocumentNonBlocking(colRef, chatEntry);
        if(newDoc) {
            newChatId = newDoc.id;
            setActiveChatId(newDoc.id);
            router.push(`/law-gpt/${newDoc.id}`);
        }
      }

      setChatHistory((prev) => {
        const newHistory = [...prev];
        const lastMessage = newHistory[newHistory.length - 1];
        if (lastMessage && !lastMessage.isUser && lastMessage.isLoading) {
          lastMessage.isLoading = false;
          lastMessage.data = result;
        }
        return newHistory;
      });
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => {
        const newHistory = [...prev];
        const lastMessage = newHistory[newHistory.length - 1];
        if (lastMessage && !lastMessage.isUser && lastMessage.isLoading) {
          lastMessage.isLoading = false;
          lastMessage.text = 'Sorry, I encountered an error. Please try again.';
        }
        return newHistory;
      });
    } finally {
      setIsResponding(false);
    }
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
      {/* Chat Column */}
      <div className="lg:col-span-2 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {chatHistory.length === 0 ? (
               <div className="text-center py-16">
                <Scale className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold font-headline">LawBot</h2>
                <p className="mt-2 text-muted-foreground">
                  Ask about any legal article to get its definition and history.
                </p>
               </div>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${message.isUser ? 'justify-end' : ''}`}
                >
                  {!message.isUser && (
                    <Avatar>
                      <AvatarFallback><Scale /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-3xl w-full rounded-lg px-4 py-3 shadow-sm ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                      </div>
                    ) : message.data ? (
                      <div className="space-y-6 prose prose-sm max-w-none">
                          <div>
                              <h3 className="font-bold font-headline text-lg mb-2">Definition</h3>
                              <p>{message.data.definition}</p>
                          </div>
                          <Separator />
                          <div>
                              <h3 className="font-bold font-headline text-lg mb-2">History</h3>
                              <p>{message.data.history}</p>
                          </div>
                          <Separator />
                           <div>
                              <h3 className="font-bold font-headline text-lg mb-2">Past Cases</h3>
                              <ul className="list-disc pl-5 space-y-2">
                                 {message.data.pastCases.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                          </div>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                   {message.isUser && user && (
                    <Avatar>
                      <AvatarFallback>{user.isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="border-t bg-background/80">
          <div className="max-w-4xl mx-auto p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name="articleName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="e.g., 'Article 370 of the Constitution of India'"
                          {...field}
                          disabled={isResponding}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isResponding} size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      {/* Articles Column */}
      <div className="hidden lg:flex flex-col border-l bg-muted/20 p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline mb-4">Latest Articles</h3>
            {articles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-4">
                   {article.image && (
                        <div className="mb-2 rounded-t-lg overflow-hidden aspect-video relative">
                          <Image
                            src={article.image.imageUrl}
                            alt={article.image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={article.image.imageHint}
                          />
                        </div>
                      )}
                  <CardTitle className="font-headline text-base">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">{article.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

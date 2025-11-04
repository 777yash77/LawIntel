'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { jsPDF } from 'jspdf';
import {
  getLegalInformation,
  type LegalQuestionOutput,
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
import { useUser, useFirestore, useDoc } from '@/firebase';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, Scale, Send, Paperclip, Download, X } from 'lucide-react';
import { Separator } from './ui/separator';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { articles } from '@/lib/placeholder-data';
import Image from 'next/image';

const formSchema = z.object({
  question: z.string().min(2, {
    message: 'Please enter a legal topic.',
  }),
});

type ChatMessage = {
  isUser: boolean;
  text?: string;
  isLoading?: boolean;
  data?: LegalQuestionOutput;
};

type LawGptClientProps = {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
};


export default function LawGptClient({ activeChatId, setActiveChatId }: LawGptClientProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  const chatDocRef = useMemo(() => {
    if (!user || !activeChatId || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'chat_history', activeChatId);
  }, [user, activeChatId, firestore]);
  
  const { data: activeChat, isLoading: isChatLoading } = useDoc(chatDocRef);


  useEffect(() => {
    if (activeChatId && activeChat) {
        const newHistory = [];
        if(activeChat.userMessage) {
            newHistory.push({ isUser: true, text: activeChat.userMessage });
        }
        if(activeChat.geminiResponse) {
            newHistory.push({ isUser: false, data: activeChat.geminiResponse });
        }
        setChatHistory(newHistory);
        setIsResponding(false); 
    } else if (!activeChatId) {
        setChatHistory([]);
    }
  }, [activeChat, activeChatId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadAsPdf = (data: LegalQuestionOutput) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(data.topic, 10, 20);

    doc.setFontSize(12);
    const summaryLines = doc.splitTextToSize(data.summary, 180);
    doc.text(summaryLines, 10, 30);
    
    let yPos = 30 + (summaryLines.length * 7) + 10;
    
    if(data.relatedCases && data.relatedCases.length > 0) {
      doc.setFontSize(14);
      doc.text("Related Cases / Examples", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      data.relatedCases.forEach(caseText => {
        const caseLines = doc.splitTextToSize(`- ${caseText}`, 180);
        doc.text(caseLines, 10, yPos);
        yPos += (caseLines.length * 7);
      });
    }

    doc.save(`${data.topic.replace(/\s+/g, '_')}.pdf`);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      console.error("User is not authenticated. Cannot send message.");
      return;
    }
  
    const userMessage = values.question;
    form.reset();
    removeAttachedImage();
  
    let newChatId = activeChatId;

    setChatHistory((prev) => [
      ...prev,
      { isUser: true, text: userMessage },
      { isUser: false, isLoading: true },
    ]);
    
    setIsResponding(true);

    if (!newChatId) {
      const colRef = collection(firestore, 'users', user.uid, 'chat_history');
      const newDoc = await addDocumentNonBlocking(colRef, {
        userId: user.uid,
        timestamp: serverTimestamp(),
        userMessage: "New Chat",
        geminiResponse: {},
      });
      if (newDoc) {
        newChatId = newDoc.id;
        router.push(`/law-gpt/${newDoc.id}`); 
        setActiveChatId(newDoc.id);
      } else {
        console.error("Failed to create new chat document.");
        setIsResponding(false);
        return;
      }
    }
  
    try {
      const result = await getLegalInformation({
        question: userMessage,
        photoDataUri: attachedImage || undefined,
      });
  
      const chatEntry = {
        userId: user.uid,
        timestamp: serverTimestamp(),
        userMessage: userMessage,
        geminiResponse: result,
      };
      
      if (newChatId) {
        const docRef = doc(firestore, 'users', user.uid, 'chat_history', newChatId);
        await setDocumentNonBlocking(docRef, chatEntry, { merge: true });
      }
  
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => {
        const newHistory = prev.filter(m => m.isUser);
        newHistory.push({ isUser: false, text: 'Sorry, I encountered an error. Please try again.' });
        return newHistory;
      });
      setIsResponding(false);
    }
  }

  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex-1 flex flex-col h-full">
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
          {(isChatLoading && activeChatId) ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : chatHistory.length === 0 && !isResponding ? (
              <div className="text-center py-16">
              <Scale className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-semibold font-headline">lawIntel</h2>
              <p className="mt-2 text-muted-foreground">
                  Ask about any legal article, upload a document, and get its definition and history.
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
                      <div className="space-y-4 prose prose-sm max-w-none text-card-foreground">
                          <div>
                              <h3 className="font-bold font-headline text-lg mb-2">{message.data.topic}</h3>
                              <p>{message.data.summary}</p>
                          </div>
                          <Separator />
                          {message.data.relatedCases && message.data.relatedCases.length > 0 && (
                            <div>
                                <h3 className="font-bold font-headline text-lg mb-2">Related Cases / Examples</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    {message.data.relatedCases.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                          )}
                           <div className="flex justify-end pt-2">
                              <Button variant="ghost" size="sm" onClick={() => downloadAsPdf(message.data!)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download as PDF
                              </Button>
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
        <div className="shrink-0 border-t bg-background">
          <div className="max-w-4xl mx-auto p-4 space-y-2">
            {imagePreview && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                    <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={removeAttachedImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                 <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isResponding}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach image</span>
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Ask about a case, a law, or a legal mystery..."
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
      <div className="hidden md:flex w-[320px] shrink-0 flex-col border-l bg-muted/20 p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline mb-4">Latest Articles</h3>
            {articles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 bg-card">
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

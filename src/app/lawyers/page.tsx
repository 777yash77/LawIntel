import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LawyersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 container">
          <h1 className="text-4xl font-bold font-headline">Connect with Legal Experts</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our platform for connecting with professional lawyers is coming soon. We are working hard to bring you a curated list of verified legal professionals.
          </p>
          <Button asChild>
            <Link href="/">Go back to Homepage</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { articles } from '@/lib/placeholder-data';
import Header from '@/components/header';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-black/50 z-10" />
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="container relative z-20 px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl">
                lawIntel: Your AI Legal Companion
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Instant definitions, historical context, and insights for legal articles. Powered by cutting-edge AI.
              </p>
              <Button asChild size="lg" variant="accent">
                <Link href="/law-gpt">
                  Explore lawIntel <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 font-headline">
              Latest Articles & Legal News
            </h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
                {articles.map((article, index) => (
                  <Card key={index} className="flex-shrink-0 w-[300px] hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      {article.image && (
                        <div className="mb-4 rounded-t-lg overflow-hidden">
                          <Image
                            src={article.image.imageUrl}
                            alt={article.image.description}
                            width={400}
                            height={300}
                            className="object-cover w-full h-auto"
                             data-ai-hint={article.image.imageHint}
                          />
                        </div>
                      )}
                      <CardTitle className="font-headline text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{article.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-secondary text-secondary-foreground">
        <div className="container text-center text-sm">
          &copy; {new Date().getFullYear()} lawIntel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

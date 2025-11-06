'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MapPin, Phone, Mail } from 'lucide-react';
import { lawyers } from '@/lib/placeholder-data';

type Lawyer = {
  id: number;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
};

export default function LawyersPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundLawyers, setFoundLawyers] = useState<Lawyer[]>([]);

  const handleFindLawyers = () => {
    setIsSearching(true);
    setError(null);
    setFoundLawyers([]);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would use position.coords.latitude and position.coords.longitude
        // to query a backend API for nearby lawyers.
        // For this demo, we'll just show the placeholder data after a short delay.
        setTimeout(() => {
          setFoundLawyers(lawyers);
          setIsSearching(false);
        }, 1500);
      },
      (err) => {
        setError(`Could not get your location: ${err.message}`);
        setIsSearching(false);
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold font-headline">Connect with Legal Experts</h1>
            <p className="text-muted-foreground mt-2">
              Find qualified lawyers near you. Click the button below to allow location access and see a list of legal professionals in your area.
            </p>
          </div>

          <Button onClick={handleFindLawyers} disabled={isSearching} size="lg">
            {isSearching ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-5 w-5" />
            )}
            {isSearching ? 'Searching...' : 'Find Lawyers Near Me'}
          </Button>

          {error && <p className="text-destructive mt-4">{error}</p>}

          {foundLawyers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left mt-8">
              {foundLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline">{lawyer.name}</CardTitle>
                    <CardDescription>{lawyer.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <span>{lawyer.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${lawyer.phone}`} className="hover:underline text-primary">
                        {lawyer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${lawyer.email}`} className="hover:underline text-primary">
                        {lawyer.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
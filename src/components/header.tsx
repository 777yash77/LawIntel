'use client';

import Link from 'next/link';
import {
  Phone,
  Scale,
  LogOut,
  Bot,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { emergencyNumbers } from '@/lib/placeholder-data';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">LexiGen</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <Phone className="mr-2 h-4 w-4" />
                Emergency Numbers
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Emergency Contacts</h4>
                  <p className="text-sm text-muted-foreground">
                    Quick access to important numbers.
                  </p>
                </div>
                <div className="grid gap-2">
                  {emergencyNumbers.map((item) => (
                    <div
                      key={item.service}
                      className="grid grid-cols-2 items-center"
                    >
                      <span className="font-semibold">{item.service}</span>
                      <a
                        href={`tel:${item.number}`}
                        className="text-right text-sm text-primary hover:underline"
                      >
                        {item.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Link
            href="/lawyers"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Connect with Lawyers
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/law-gpt')}>
                  <Bot className="mr-2 h-4 w-4" />
                  <span>LawBot</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { use, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

function UserMenu() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Pricing
        </Link>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground ml-4"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  // If user is logged in, show a dashboard button
  return (
    <Button
      asChild
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 sm:px-8 gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-md">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="font-bold">MYFC</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 
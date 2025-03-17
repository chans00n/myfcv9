'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CircleIcon, 
  Home, 
  LogOut, 
  Menu,
  Search,
  Settings,
  Users,
  Palette,
  X,
  LayoutDashboard,
  Dumbbell,
  Library,
  CalendarDays
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

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
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.name || ''} />
          ) : (
            <AvatarFallback>
              {user.email
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/team" className="flex w-full items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarLink({ href, icon: Icon, label, isMobile = false }: { href: string; icon: any; label: string; isMobile?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isMobile) {
    return (
      <Link
        href={href}
        className={`flex items-center px-4 py-3 gap-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={`flex items-center justify-center w-10 h-9 rounded-lg transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="w-4 h-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-10">
        <SheetHeader className="px-6 py-2 mb-2 text-left">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="px-6 py-2 mb-2">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2" 
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-md">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <span className="font-bold">MYFC</span>
            </Link>
          </div>
          <nav className="flex flex-col px-2 space-y-1">
            <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" isMobile={true} />
            <SidebarLink href="/lift" icon={Dumbbell} label="Today's Lift" isMobile={true} />
            <SidebarLink href="/lifts" icon={CalendarDays} label="Lift Library" isMobile={true} />
            <SidebarLink href="/movements" icon={Library} label="Movement Library" isMobile={true} />
            <SidebarLink href="/dashboard/team" icon={Users} label="Team" isMobile={true} />
            <SidebarLink href="/dashboard/general" icon={Settings} label="General" isMobile={true} />
            <SidebarLink href="/dashboard/styles" icon={Palette} label="Styles" isMobile={true} />
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Sidebar() {
  return (
    <div className="hidden md:fixed md:left-0 md:top-0 md:z-40 md:h-screen md:w-14 md:flex md:flex-col md:items-center md:border-r md:bg-background md:py-4 md:gap-2">
      <Link 
        href="/dashboard" 
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-6 h-6 object-contain"
        />
      </Link>
      <nav className="flex flex-col items-center gap-1">
        <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink href="/lift" icon={Dumbbell} label="Today's Lift" />
        <SidebarLink href="/lifts" icon={CalendarDays} label="Lift Library" />
        <SidebarLink href="/movements" icon={Library} label="Movement Library" />
        <SidebarLink href="/dashboard/team" icon={Users} label="Team" />
        <SidebarLink href="/dashboard/general" icon={Settings} label="General" />
        <SidebarLink href="/dashboard/styles" icon={Palette} label="Styles" />
      </nav>
    </div>
  );
}

function Header() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 sm:px-8 gap-4">
        <MobileSidebar />
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          {paths.map((path, index) => (
            <div key={path} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <span className="capitalize">{path === 'dashboard' ? 'MYFC' : path}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-1 sm:flex-initial items-center gap-4 ml-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 w-full bg-muted/50"
            />
          </div>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Sidebar />
      <div className="md:ml-14 flex-1">
        <Header />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

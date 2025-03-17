import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Dumbbell, 
  SlidersHorizontal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DifficultyScale } from '@/components/ui/difficulty-scale';

// This would come from your database in a real implementation
const lifts = [
  {
    id: "monday-morning-flow",
    title: "Morning Flow & Lift",
    date: "Monday, March 18, 2023",
    day: "Monday",
    duration: "15 minutes",
    intensity: "Moderate",
    difficulty: "Beginner" as const,
    category: "Morning",
    description: "Start your week with this energizing session that begins with lymphatic drainage to reduce morning puffiness, includes three core lifting sequences, and ends with circulation-boosting movements. Perfect pre-makeup routine to set the tone for your week.",
    thumbnailUrl: "/images/tom-barrett-2t60-JYQ5pk-unsplash.jpg",
    coach: "Zionna",
    featured: true,
    time: "8:00 AM"
  },
  {
    id: "tuesday-express-power",
    title: "Express Power Lift",
    date: "Tuesday, March 19, 2023",
    day: "Tuesday",
    duration: "10 minutes",
    intensity: "High",
    difficulty: "Intermediate" as const,
    category: "Express",
    description: "This intensive workout includes four targeted lifting sequences focusing on major muscle groups with quick-result techniques. Ideal for your busy Tuesday when you need efficient results.",
    thumbnailUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg",
    coach: "Zionna",
    featured: false,
    time: "7:30 AM"
  },
  {
    id: "wednesday-midweek-power",
    title: "Midweek Power Boost",
    date: "Wednesday, March 20, 2023",
    day: "Wednesday",
    duration: "20 minutes",
    intensity: "High",
    difficulty: "Advanced" as const,
    category: "Power",
    description: "Energizing workout with motivation-building exercises and quick-result techniques. These energy-boosting movements provide the midweek motivation you need to keep your facial fitness on track.",
    thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg",
    coach: "Zionna",
    featured: true,
    time: "7:00 AM"
  },
  {
    id: "thursday-deep-core",
    title: "Deep Core Focus",
    date: "Thursday, March 21, 2023",
    day: "Thursday",
    duration: "25 minutes",
    intensity: "Moderate",
    difficulty: "Intermediate" as const,
    category: "Core",
    description: "This specialized session concentrates on center face work with advanced resistance techniques and stability-building exercises for enhanced muscle engagement. Perfect for building your facial foundation.",
    thumbnailUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg",
    coach: "Zionna",
    featured: false,
    time: "8:00 AM"
  },
  {
    id: "friday-fresh-face",
    title: "Fresh Face Friday",
    date: "Friday, March 22, 2023",
    day: "Friday",
    duration: "25 minutes",
    intensity: "Moderate",
    difficulty: "Beginner" as const,
    category: "Rejuvenation",
    description: "Rejuvenating session with weekend preparation focus and glow-enhancing movements. Get social-ready results with quick-lift techniques and radiance-boosting exercises to shine all weekend.",
    thumbnailUrl: "/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg",
    coach: "Zionna",
    featured: true,
    time: "7:30 AM"
  },
  {
    id: "saturday-neck-jawline",
    title: "Neck & Jawline Define",
    date: "Saturday, March 23, 2023",
    day: "Saturday",
    duration: "20 minutes",
    intensity: "Medium",
    difficulty: "Expert" as const,
    category: "Targeted",
    description: "This targeted session focuses on lower face strengthening and neck muscle activation with definition-building exercises for contour enhancement. Perfect for weekend self-care.",
    thumbnailUrl: "/images/brut-carniollus-jGEsapFCLgw-unsplash.jpg",
    coach: "Zionna",
    featured: false,
    time: "8:00 AM"
  },
  {
    id: "sunday-reset-glow",
    title: "Sunday Reset & Glow",
    date: "Sunday, March 24, 2023",
    day: "Sunday",
    duration: "35 minutes",
    intensity: "Low",
    difficulty: "Beginner" as const,
    category: "Recovery",
    description: "Comprehensive session with deep tissue work and full facial detox to prepare for the week ahead. Enhanced circulation focus with relaxation elements to reset your face and mind.",
    thumbnailUrl: "/images/yusuf-evli-DjQx057gBC0-unsplash.jpg",
    coach: "Zionna",
    featured: true,
    time: "8:00 AM"
  }
];

// Helper function to get intensity badge color
function getIntensityColor(intensity: string) {
  switch (intensity.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'moderate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

export default async function LiftsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Group lifts by day for the list view
  const liftsByDay = lifts.reduce((acc, lift) => {
    if (!acc[lift.day]) {
      acc[lift.day] = [];
    }
    acc[lift.day].push(lift);
    return acc;
  }, {} as Record<string, typeof lifts>);

  // Order days of the week
  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Weekly Lift Plan</h2>
      </div>
      
      <p className="text-muted-foreground">Follow your personalized facial fitness routine</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lifts..."
            className="pl-8 w-full"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem className="font-medium text-sm text-muted-foreground" disabled>
                Duration
              </DropdownMenuItem>
              <DropdownMenuItem>Under 15 minutes</DropdownMenuItem>
              <DropdownMenuItem>15-25 minutes</DropdownMenuItem>
              <DropdownMenuItem>Over 25 minutes</DropdownMenuItem>
              <DropdownMenuItem className="font-medium text-sm text-muted-foreground mt-2" disabled>
                Intensity
              </DropdownMenuItem>
              <DropdownMenuItem>Low</DropdownMenuItem>
              <DropdownMenuItem>Medium</DropdownMenuItem>
              <DropdownMenuItem>High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
              <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
              <SelectItem value="intensity-asc">Intensity (Low to High)</SelectItem>
              <SelectItem value="intensity-desc">Intensity (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">March 9, 2023 - March 15, 2023</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid grid-cols-2 w-[260px]">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            {orderedDays.map(day => (
              <div key={day} className="space-y-4">
                {liftsByDay[day]?.map(lift => (
                  <div key={lift.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <Link href={`/lifts/${lift.id}`} className="relative w-full sm:w-48 h-48 sm:h-auto rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={lift.thumbnailUrl} 
                        alt={lift.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <Link href={`/lifts/${lift.id}`} className="hover:underline">
                            <h3 className="text-xl font-bold">{lift.title}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{lift.day} {lift.category}</p>
                          <p className="text-sm">Coach: {lift.coach}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{lift.description}</p>
                        <div className="mt-3">
                          <DifficultyScale level={lift.difficulty} size="sm" />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-4">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm">{lift.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4 text-primary" />
                            <span className="text-sm">{lift.duration}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="sm:w-auto" asChild>
                          <Link href={`/lifts/${lift.id}`}>
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lifts.map((lift) => (
              <Card key={lift.id} className="overflow-hidden flex flex-col">
                <Link href={`/lifts/${lift.id}`} className="relative h-48">
                  <Image 
                    src={lift.thumbnailUrl} 
                    alt={lift.title}
                    fill
                    className="object-cover"
                  />
                  {lift.featured && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </Link>
                <CardHeader className="pb-2">
                  <Link href={`/lifts/${lift.id}`} className="hover:underline">
                    <CardTitle>{lift.title}</CardTitle>
                  </Link>
                  <CardDescription>
                    {lift.day} • {lift.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span>{lift.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{lift.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Dumbbell className="h-3 w-3 text-primary" />
                      <span>{lift.intensity}</span>
                    </div>
                  </div>
                  <DifficultyScale level={lift.difficulty} size="sm" showLabel={false} className="mb-3" />
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {lift.description}
                  </p>
                  <Button className="w-full mt-auto" asChild>
                    <Link href={`/lifts/${lift.id}`}>
                      View Workout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
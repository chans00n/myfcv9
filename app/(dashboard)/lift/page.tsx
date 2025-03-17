import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Play, Calendar, Clock, Dumbbell, Info, Library } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DifficultyScale } from '@/components/ui/difficulty-scale';
import { Badge } from '@/components/ui/badge';

export default async function LiftPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  // This would be fetched from your database in a real implementation
  const currentLift = {
    id: "lift-2023-03-17",
    title: "Full Body Power",
    date: "March 17, 2023",
    duration: "45 minutes",
    intensity: "Moderate",
    difficulty: "Beginner" as const,
    description: "This full-body workout focuses on building power through compound movements. You'll engage multiple muscle groups simultaneously, improving overall strength and coordination while maximizing calorie burn.",
    videoUrl: "https://example.com/videos/full-body-power",
    thumbnailUrl: "/images/tom-barrett-2t60-JYQ5pk-unsplash.jpg",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "Focus on form over speed today. I want you to really feel each movement and connect with your muscles. Remember to breathe deeply and stay present throughout the workout."
    },
    movements: [
      {
        id: "squat-press",
        name: "Squat Press",
        description: "A compound movement that works your lower body and shoulders",
        duration: "45 seconds",
        thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg"
      },
      {
        id: "renegade-rows",
        name: "Renegade Rows",
        description: "Works your back, core, and arms in one powerful movement",
        duration: "40 seconds",
        thumbnailUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg"
      },
      {
        id: "plyo-lunges",
        name: "Plyo Lunges",
        description: "Explosive movement to build lower body power",
        duration: "30 seconds per side",
        thumbnailUrl: "/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg"
      },
      {
        id: "push-up-rotation",
        name: "Push-up Rotation",
        description: "Engages chest, shoulders, and core with a rotational element",
        duration: "45 seconds",
        thumbnailUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg"
      }
    ]
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Today's Lift</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <Image 
                  src={currentLift.thumbnailUrl} 
                  alt={currentLift.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16 flex items-center justify-center">
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              </AspectRatio>
            </div>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">{currentLift.title}</CardTitle>
                </div>
              </div>
              <CardDescription>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{currentLift.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{currentLift.duration}</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{currentLift.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Movements</CardTitle>
                <CardDescription>Key exercises in today's workout</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/movements" className="flex items-center gap-1">
                  <Library className="h-4 w-4" />
                  <span>View Library</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {currentLift.movements.map((movement, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg border">
                    <Link href={`/movements/${movement.id}`} className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={movement.thumbnailUrl} 
                        alt={movement.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/movements/${movement.id}`} className="hover:underline">
                        <h4 className="font-medium">{movement.name}</h4>
                      </Link>
                      <p className="text-xs text-muted-foreground">{movement.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-primary font-medium">{movement.duration}</p>
                        <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                          <Link href={`/movements/${movement.id}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Difficulty</CardTitle>
              <CardDescription>How challenging this workout is</CardDescription>
            </CardHeader>
            <CardContent>
              <DifficultyScale level={currentLift.difficulty} size="lg" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coach's Note</CardTitle>
              <CardDescription>A message from your coach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image 
                    src={currentLift.coach.avatarUrl} 
                    alt={currentLift.coach.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{currentLift.coach.name}</h4>
                  <p className="text-xs text-muted-foreground">MYFC Face Coach</p>
                </div>
              </div>
              <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
                "{currentLift.coach.note}"
              </blockquote>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Lift?</CardTitle>
              <CardDescription>Start your workout when you're ready</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Start Workout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Make sure you have:</p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>A clear space to move</li>
                  <li>Water nearby</li>
                  <li>Any equipment mentioned in the workout</li>
                  <li>Proper workout attire</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Keep track of your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Workouts Completed</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-bold">3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Best Streak</span>
                  <span className="font-bold">7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Time</span>
                  <span className="font-bold">8.5 hours</span>
                </div>
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View Full Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
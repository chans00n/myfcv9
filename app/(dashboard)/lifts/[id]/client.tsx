'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowRight, Play, Calendar, Clock, Dumbbell, Library, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { VideoModal } from '@/components/ui/video-modal';
import { DifficultyScale } from '@/components/ui/difficulty-scale';

// Define the types based on the data structure
type Movement = {
  id: string;
  name: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
};

type Coach = {
  name: string;
  avatarUrl: string;
  note: string;
};

export type Lift = {
  id: string;
  title: string;
  date: string;
  day: string;
  duration: string;
  intensity: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  coach: Coach;
  movements: Movement[];
  benefits: string[];
};

export interface LiftDetailClientProps {
  lift: Lift;
  nextLift: Lift | undefined;
}

export function LiftDetailClient({ lift, nextLift }: LiftDetailClientProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // For demo purposes, we'll use different video sources based on the day
  const getVideoSource = () => {
    switch (lift.day) {
      case 'Monday':
        return {
          type: 'youtube' as const,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Demo YouTube URL
        };
      case 'Tuesday':
        return {
          type: 'vimeo' as const,
          url: 'https://vimeo.com/148751763' // Demo Vimeo URL
        };
      default:
        return {
          type: 'self-hosted' as const,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Demo self-hosted video
        };
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/lifts">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{lift.title}</h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <Image 
                  src={lift.thumbnailUrl} 
                  alt={lift.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button 
                    size="lg" 
                    className="rounded-full w-16 h-16 flex items-center justify-center"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              </AspectRatio>
            </div>
            <CardHeader>
              <CardDescription>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{lift.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{lift.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span>{lift.intensity}</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{lift.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Movements</CardTitle>
                <CardDescription>Key exercises in this workout</CardDescription>
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
                {lift.movements.map((movement, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg border">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={movement.thumbnailUrl} 
                        alt={movement.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{movement.name}</h4>
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

          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>What you'll gain from this workout</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lift.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
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
              <DifficultyScale level={lift.difficulty} size="lg" />
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
                    src={lift.coach.avatarUrl} 
                    alt={lift.coach.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{lift.coach.name}</h4>
                  <p className="text-xs text-muted-foreground">MYFC Face Coach</p>
                </div>
              </div>
              <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
                "{lift.coach.note}"
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

          {nextLift && (
            <Card>
              <CardHeader>
                <CardTitle>Next Workout</CardTitle>
                <CardDescription>Coming up next in your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image 
                      src={nextLift.thumbnailUrl} 
                      alt={nextLift.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{nextLift.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{nextLift.day} • {nextLift.duration}</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/lifts/${nextLift.id}`}>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={lift.title}
        videoSource={getVideoSource()}
      />
    </div>
  );
} 
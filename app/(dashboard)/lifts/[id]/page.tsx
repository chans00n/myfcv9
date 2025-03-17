import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowRight, Play, Calendar, Clock, Dumbbell, Library, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
    videoUrl: "https://example.com/videos/morning-flow",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "Monday mornings can be tough, but this quick routine will energize your face and mind. Focus on the lymphatic drainage at the beginning to reduce any weekend puffiness, and really engage with each movement. Remember that consistency is key - starting your week with facial fitness sets a positive tone for the days ahead!"
    },
    movements: [
      {
        id: "lymphatic-drainage",
        name: "Lymphatic Drainage",
        description: "Gentle massage techniques to reduce puffiness and improve circulation",
        duration: "3 minutes",
        thumbnailUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
      },
      {
        id: "cheek-lift",
        name: "Cheek Lift Sequence",
        description: "Targeted movements to lift and tone the cheek muscles",
        duration: "4 minutes",
        thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg"
      },
      {
        id: "jawline-sculpt",
        name: "Jawline Sculpt",
        description: "Defining exercises for a sharper jawline",
        duration: "4 minutes",
        thumbnailUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg"
      },
      {
        id: "circulation-boost",
        name: "Circulation Boost",
        description: "Quick movements to enhance blood flow and create a natural glow",
        duration: "4 minutes",
        thumbnailUrl: "/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg"
      }
    ],
    benefits: [
      "Reduces morning puffiness",
      "Energizes facial muscles",
      "Creates a natural glow",
      "Prepares skin for makeup application",
      "Sets a positive tone for the week"
    ]
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
    videoUrl: "https://example.com/videos/express-power",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "This express workout is all about efficiency! I've designed these movements to target multiple muscle groups simultaneously, giving you maximum results in minimum time. Focus on quality over quantity - each movement should be performed with full engagement and intention."
    },
    movements: [
      {
        id: "power-cheek-lift",
        name: "Power Cheek Lift",
        description: "Intensive cheek muscle activation for quick lifting results",
        duration: "2.5 minutes",
        thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg"
      },
      {
        id: "forehead-smooth",
        name: "Forehead Smooth & Lift",
        description: "Targeted movements to tone the forehead and brow area",
        duration: "2.5 minutes",
        thumbnailUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg"
      },
      {
        id: "eye-area-firm",
        name: "Eye Area Firming",
        description: "Gentle yet effective techniques to firm the delicate eye area",
        duration: "2.5 minutes",
        thumbnailUrl: "/images/brut-carniollus-jGEsapFCLgw-unsplash.jpg"
      },
      {
        id: "neck-jawline-define",
        name: "Neck & Jawline Definition",
        description: "Quick sculpting movements for the lower face and neck",
        duration: "2.5 minutes",
        thumbnailUrl: "/images/yusuf-evli-DjQx057gBC0-unsplash.jpg"
      }
    ],
    benefits: [
      "Maximum results in minimum time",
      "Targets all major facial muscle groups",
      "Boosts circulation quickly",
      "Provides visible lifting effect",
      "Perfect for busy days"
    ]
  },
  // Add more lifts as needed
];

// Add a type for the props
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function Page(props: Props) {
  // Await the params
  const params = await props.params;
  const id = params.id;
  
  const lift = lifts.find(l => l.id === id);
  
  if (!lift) {
    notFound();
  }

  // Find the next day's lift for the "Next Workout" button
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const currentDayIndex = days.indexOf(lift.day);
  const nextDayIndex = (currentDayIndex + 1) % 7;
  const nextDay = days[nextDayIndex];
  const nextLift = lifts.find(l => l.day === nextDay);

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
    </div>
  );
} 
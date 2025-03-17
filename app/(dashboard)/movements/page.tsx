import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DifficultyScale } from '@/components/ui/difficulty-scale';

export default async function MovementsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  // This would be fetched from your database in a real implementation
  const movements = [
    {
      id: "squat",
      name: "Squat",
      category: "lower-body",
      difficulty: "Beginner" as const,
      description: "A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.",
      thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg",
    },
    {
      id: "push-up",
      name: "Push-up",
      category: "upper-body",
      difficulty: "Beginner" as const,
      description: "A classic upper body exercise that works the chest, shoulders, and triceps.",
      thumbnailUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg",
    },
    {
      id: "lunge",
      name: "Lunge",
      category: "lower-body",
      difficulty: "Beginner" as const,
      description: "A unilateral exercise that targets the quadriceps, hamstrings, and glutes while improving balance.",
      thumbnailUrl: "/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg",
    },
    {
      id: "plank",
      name: "Plank",
      category: "core",
      difficulty: "Beginner" as const,
      description: "An isometric core exercise that strengthens the abdominals, back, and shoulders.",
      thumbnailUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg",
    },
    {
      id: "deadlift",
      name: "Deadlift",
      category: "full-body",
      difficulty: "Intermediate" as const,
      description: "A compound movement that works the entire posterior chain, including the back, glutes, and hamstrings.",
      thumbnailUrl: "/images/tom-barrett-2t60-JYQ5pk-unsplash.jpg",
    },
    {
      id: "burpee",
      name: "Burpee",
      category: "full-body",
      difficulty: "Advanced" as const,
      description: "A high-intensity full-body exercise that combines a squat, push-up, and jump.",
      thumbnailUrl: "/images/brut-carniollus-jGEsapFCLgw-unsplash.jpg",
    },
    {
      id: "mountain-climber",
      name: "Mountain Climber",
      category: "core",
      difficulty: "Intermediate" as const,
      description: "A dynamic core exercise that also elevates your heart rate for cardiovascular benefits.",
      thumbnailUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg",
    },
    {
      id: "kettlebell-swing",
      name: "Kettlebell Swing",
      category: "full-body",
      difficulty: "Intermediate" as const,
      description: "A dynamic exercise that targets the hips, glutes, and shoulders while improving power and conditioning.",
      thumbnailUrl: "/images/yusuf-evli-DjQx057gBC0-unsplash.jpg",
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Movement Library</h2>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movements..."
            className="pl-8 w-full"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upper-body">Upper Body</TabsTrigger>
          <TabsTrigger value="lower-body">Lower Body</TabsTrigger>
          <TabsTrigger value="core">Core</TabsTrigger>
          <TabsTrigger value="full-body">Full Body</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movements.map((movement) => (
              <Card key={movement.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <Image 
                    src={movement.thumbnailUrl} 
                    alt={movement.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{movement.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {movement.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1 flex flex-col">
                  <DifficultyScale level={movement.difficulty} size="sm" className="mb-3" />
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {movement.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                    <Link href={`/movements/${movement.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upper-body" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movements
              .filter(m => m.category === 'upper-body')
              .map((movement) => (
                <Card key={movement.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <Image 
                      src={movement.thumbnailUrl} 
                      alt={movement.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{movement.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {movement.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1 flex flex-col">
                    <DifficultyScale level={movement.difficulty} size="sm" className="mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {movement.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                      <Link href={`/movements/${movement.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="lower-body" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movements
              .filter(m => m.category === 'lower-body')
              .map((movement) => (
                <Card key={movement.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <Image 
                      src={movement.thumbnailUrl} 
                      alt={movement.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{movement.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {movement.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1 flex flex-col">
                    <DifficultyScale level={movement.difficulty} size="sm" className="mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {movement.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                      <Link href={`/movements/${movement.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="core" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movements
              .filter(m => m.category === 'core')
              .map((movement) => (
                <Card key={movement.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <Image 
                      src={movement.thumbnailUrl} 
                      alt={movement.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{movement.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {movement.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1 flex flex-col">
                    <DifficultyScale level={movement.difficulty} size="sm" className="mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {movement.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                      <Link href={`/movements/${movement.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="full-body" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movements
              .filter(m => m.category === 'full-body')
              .map((movement) => (
                <Card key={movement.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <Image 
                      src={movement.thumbnailUrl} 
                      alt={movement.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{movement.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {movement.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1 flex flex-col">
                    <DifficultyScale level={movement.difficulty} size="sm" className="mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {movement.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                      <Link href={`/movements/${movement.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
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
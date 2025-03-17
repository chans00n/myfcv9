import { redirect, notFound } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Play, Calendar, Clock, Dumbbell, Info, Library, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LiftDetailClient } from "./client";

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
    videoUrl: "https://example.com/videos/midweek-power",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "Wednesday is the perfect day to recommit to your facial fitness journey! This power boost session is designed to reinvigorate both your face and your motivation. Pay special attention to the resistance techniques - they're key to building that facial strength we're looking for."
    },
    movements: [
      {
        id: "warm-up-massage",
        name: "Energizing Warm-Up Massage",
        description: "Circulation-boosting massage techniques to prepare the facial muscles",
        duration: "4 minutes",
        thumbnailUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
      },
      {
        id: "resistance-training",
        name: "Facial Resistance Training",
        description: "Advanced resistance techniques for deeper muscle engagement",
        duration: "6 minutes",
        thumbnailUrl: "/images/tom-barrett-2t60-JYQ5pk-unsplash.jpg"
      },
      {
        id: "midface-lift",
        name: "Midface Lift Sequence",
        description: "Targeted movements for cheekbone definition and midface lifting",
        duration: "5 minutes",
        thumbnailUrl: "/images/reza-shayestehpour-Nw_D8v79PM4-unsplash.jpg"
      },
      {
        id: "power-finish",
        name: "Power Finish Circuit",
        description: "High-intensity movements to maximize results and boost circulation",
        duration: "5 minutes",
        thumbnailUrl: "/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg"
      }
    ],
    benefits: [
      "Reinvigorates midweek motivation",
      "Builds facial strength and endurance",
      "Enhances muscle definition",
      "Boosts circulation and glow",
      "Creates visible lifting effects"
    ]
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
    videoUrl: "https://example.com/videos/deep-core",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "Today we're focusing on your facial core - the foundation of all facial fitness. These movements might feel subtle, but they're incredibly powerful for long-term results. Take your time with each exercise and really focus on the engagement. This is where the magic happens!"
    },
    movements: [
      {
        id: "core-warm-up",
        name: "Core Activation Warm-Up",
        description: "Gentle movements to activate the central facial muscles",
        duration: "5 minutes",
        thumbnailUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
      },
      {
        id: "nasolabial-smooth",
        name: "Nasolabial Fold Smoothing",
        description: "Targeted techniques to address the nasolabial area",
        duration: "7 minutes",
        thumbnailUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg"
      },
      {
        id: "mouth-area-tone",
        name: "Mouth Area Toning",
        description: "Precision movements for the area around the mouth",
        duration: "7 minutes",
        thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg"
      },
      {
        id: "core-integration",
        name: "Core Integration Sequence",
        description: "Connecting movements that integrate all facial core muscles",
        duration: "6 minutes",
        thumbnailUrl: "/images/brut-carniollus-jGEsapFCLgw-unsplash.jpg"
      }
    ],
    benefits: [
      "Builds facial foundation strength",
      "Addresses nasolabial folds",
      "Improves overall facial stability",
      "Creates lasting structural support",
      "Enhances effectiveness of other facial exercises"
    ]
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
    videoUrl: "https://example.com/videos/fresh-face",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "It's Friday! This session is all about getting you glowing and lifted for the weekend ahead. The circulation-boosting techniques are especially important today - they'll give you that immediate radiance we all want for weekend activities. Enjoy the process and celebrate your week of facial fitness!"
    },
    movements: [
      {
        id: "glow-massage",
        name: "Radiance-Boosting Massage",
        description: "Special massage techniques to enhance circulation and create an immediate glow",
        duration: "6 minutes",
        thumbnailUrl: "/images/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg"
      },
      {
        id: "quick-lift",
        name: "Weekend Quick Lift",
        description: "Fast-acting lifting movements for immediate results",
        duration: "7 minutes",
        thumbnailUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
      },
      {
        id: "eye-brighten",
        name: "Eye Area Brightening",
        description: "Techniques to reduce under-eye puffiness and brighten the eye area",
        duration: "6 minutes",
        thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg"
      },
      {
        id: "contour-enhance",
        name: "Contour Enhancement",
        description: "Definition-building movements for photo-ready facial contours",
        duration: "6 minutes",
        thumbnailUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg"
      }
    ],
    benefits: [
      "Creates immediate radiance and glow",
      "Provides visible lifting effects",
      "Reduces under-eye puffiness",
      "Enhances natural contours",
      "Prepares face for weekend activities and photos"
    ]
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
    videoUrl: "https://example.com/videos/neck-jawline",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "The neck and jawline are areas that show aging quickly, but respond amazingly well to targeted exercise! This session focuses on creating that sculpted look we all love. Take your time with the neck movements especially - proper form is crucial for safety and results."
    },
    movements: [
      {
        id: "neck-warm-up",
        name: "Neck & Décolletage Warm-Up",
        description: "Gentle preparation movements for the neck and upper chest area",
        duration: "4 minutes",
        thumbnailUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
      },
      {
        id: "jawline-sculpt",
        name: "Jawline Sculpting Series",
        description: "Intensive movements to define and sharpen the jawline",
        duration: "6 minutes",
        thumbnailUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg"
      },
      {
        id: "neck-firm",
        name: "Neck Firming Sequence",
        description: "Targeted exercises to strengthen and tone the neck muscles",
        duration: "6 minutes",
        thumbnailUrl: "/images/chad-madden-1z6JYPafvII-unsplash.jpg"
      },
      {
        id: "contour-enhance",
        name: "Contour Enhancement",
        description: "Final movements to refine and enhance facial contours",
        duration: "4 minutes",
        thumbnailUrl: "/images/alexander-krivitskiy-29iRkbuiOfo-unsplash.jpg"
      }
    ],
    benefits: [
      "Creates defined jawline",
      "Reduces appearance of double chin",
      "Strengthens neck muscles",
      "Improves posture awareness",
      "Enhances profile appearance"
    ]
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
    videoUrl: "https://example.com/videos/sunday-reset",
    coach: {
      name: "Zionna",
      avatarUrl: "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      note: "Sunday is all about resetting and preparing for the week ahead. This session is intentionally longer and more gentle - think of it as a facial spa day at home. The lymphatic drainage is especially important today to clear any weekend bloat and set you up for a fresh start on Monday."
    },
    movements: [
      {
        id: "full-detox",
        name: "Full Facial Detox",
        description: "Comprehensive lymphatic drainage to reduce puffiness and toxins",
        duration: "10 minutes",
        thumbnailUrl: "/images/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg"
      },
      {
        id: "deep-tissue",
        name: "Deep Tissue Release",
        description: "Tension-releasing techniques for facial muscles and fascia",
        duration: "10 minutes",
        thumbnailUrl: "/images/reza-shayestehpour-Nw_D8v79PM4-unsplash.jpg"
      },
      {
        id: "circulation-boost",
        name: "Circulation Enhancement",
        description: "Gentle movements to boost blood flow and create a healthy glow",
        duration: "8 minutes",
        thumbnailUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg"
      },
      {
        id: "relaxation-sequence",
        name: "Relaxation Sequence",
        description: "Calming movements to reduce stress and prepare for the week",
        duration: "7 minutes",
        thumbnailUrl: "/images/tom-barrett-2t60-JYQ5pk-unsplash.jpg"
      }
    ],
    benefits: [
      "Reduces facial bloating and puffiness",
      "Releases accumulated tension",
      "Enhances natural glow",
      "Prepares face for the week ahead",
      "Promotes relaxation and stress reduction"
    ]
  }
];

export default async function LiftDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  const lift = lifts.find(l => l.id === params.id);
  
  if (!lift) {
    notFound();
  }

  // Find the next day's lift for the "Next Workout" button
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const currentDayIndex = days.indexOf(lift.day);
  const nextDayIndex = (currentDayIndex + 1) % 7;
  const nextDay = days[nextDayIndex];
  const nextLift = lifts.find(l => l.day === nextDay);

  return <LiftDetailClient lift={lift} nextLift={nextLift} />;
} 
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

interface DifficultyScaleProps {
  level: DifficultyLevel;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DifficultyScale({ 
  level, 
  className,
  showLabel = true,
  size = 'md'
}: DifficultyScaleProps) {
  const levels: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
  const currentIndex = levels.indexOf(level);
  
  // Determine color based on difficulty level
  const getColor = (level: DifficultyLevel) => {
    switch(level) {
      case 'Beginner':
        return 'text-green-500';
      case 'Intermediate':
        return 'text-blue-500';
      case 'Advanced':
        return 'text-yellow-500';
      case 'Expert':
        return 'text-orange-500';
      case 'Master':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  // Size classes
  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return {
          container: 'gap-1',
          circle: 'w-4 h-4',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'gap-3',
          circle: 'w-8 h-8',
          text: 'text-lg'
        };
      case 'md':
      default:
        return {
          container: 'gap-2',
          circle: 'w-6 h-6',
          text: 'text-sm'
        };
    }
  };

  // Get appropriate text for the difficulty level
  const getDifficultyText = (level: DifficultyLevel) => {
    switch(level) {
      case 'Beginner':
        return 'newcomers';
      case 'Intermediate':
        return 'intermediates';
      case 'Advanced':
        return 'advanced users';
      case 'Expert':
        return 'experts';
      case 'Master':
        return 'masters';
      default:
        return 'users';
    }
  };

  const sizeClasses = getSizeClasses();
  const color = getColor(level);
  const difficultyText = getDifficultyText(level);

  return (
    <div className={cn("flex flex-col", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className={cn("font-medium", sizeClasses.text)}>Difficulty Level</span>
          <span className={cn("font-medium", color, sizeClasses.text)}>{level}</span>
        </div>
      )}
      <div className={cn("flex items-center", sizeClasses.container)}>
        {levels.map((lvl, index) => {
          const isActive = index <= currentIndex;
          const isCurrentLevel = index === currentIndex;
          
          return (
            <div 
              key={lvl} 
              className={cn(
                "relative rounded-full flex items-center justify-center transition-colors",
                isActive ? getColor(level) : "text-gray-300 dark:text-gray-700",
                sizeClasses.circle
              )}
            >
              {isCurrentLevel ? (
                <CheckCircle2 className="w-full h-full" />
              ) : (
                <div 
                  className={cn(
                    "rounded-full border-2",
                    isActive ? `border-current` : "border-current",
                    "w-full h-full"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {showLabel && (
        <div className={cn("text-muted-foreground mt-1", sizeClasses.text)}>
          Perfect for {difficultyText} to facial fitness
        </div>
      )}
    </div>
  );
} 
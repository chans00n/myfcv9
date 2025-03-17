'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SubmitButton } from '../pricing/submit-button';
import { checkoutAction } from '@/lib/payments/actions';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prices: {
    monthly: {
      id?: string;
      amount: number;
    };
    yearly: {
      id?: string;
      amount: number;
    };
  };
}

export function PricingModal({ open, onOpenChange, prices }: PricingModalProps) {
  const features = [
    'Daily Structured Workouts',
    'Full-Face Lifting System',
    'Specialized Workout Library',
    'Anytime, Anywhere Access',
  ];

  const descriptions = [
    'Complete 3-step facial fitness routines with warm-ups, targeted lifts, and cool-downs in under 10 minutes daily.',
    'Access our science-based methodology that targets all facial muscle groups for balanced, natural lifting.',
    'Explore our comprehensive collection of lifts, massages, and stretches including popular "Cardio" sessions.',
    'Workout on your schedule with our mobile-friendly platform – at home, work, or on the go.',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose your membership</DialogTitle>
          <DialogDescription className="text-center">
            Select the perfect plan for your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-foreground">{feature}</h3>
                <p className="text-sm text-muted-foreground">{descriptions[index]}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PricingOption
            name="Monthly"
            price={prices.monthly.amount}
            interval="mo"
            description="Billed monthly, cancel anytime"
            priceId={prices.monthly.id}
          />
          
          <PricingOption
            name="Yearly"
            price={prices.yearly.amount}
            interval="mo"
            yearlyPrice={179.99}
            savePercent={25}
            description="Billed $179.99 annually"
            priceId={prices.yearly.id}
            featured={true}
          />
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Terms of Service • Restore Purchases • Privacy Policy</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PricingOption({
  name,
  price,
  interval,
  yearlyPrice,
  savePercent,
  description,
  priceId,
  featured = false,
}: {
  name: string;
  price: number;
  interval: string;
  yearlyPrice?: number;
  savePercent?: number;
  description: string;
  priceId?: string;
  featured?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 ${featured ? 'border-primary bg-primary/5' : 'border-border'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold">${price}</span>
            <span className="text-sm text-muted-foreground ml-1">/{interval}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {savePercent && (
          <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            Save {savePercent}%
          </div>
        )}
      </div>
      
      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton featured={featured} />
      </form>
    </div>
  );
} 
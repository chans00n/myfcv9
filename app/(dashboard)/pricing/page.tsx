import { checkoutAction } from '@/lib/payments/actions';
import { Check, ArrowRight } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  // Debug logs
  console.log('Pricing page - Products fetched:', products.map(p => ({
    id: p.id,
    name: p.name,
    metadata: p.metadata,
  })));

  // Hardcoded IDs from the screenshots
  const monthlyProductId = 'prod_RrinBR6zvKESjS'; // MYFC Monthly Membership
  const yearlyProductId = 'prod_Rrio7EIc5nRCoA'; // MYFC Annual Membership
  
  // Find products by ID first, then fall back to name
  const basePlan = products.find(
    (product) => product.id === monthlyProductId
  ) || products.find(
    (product) => product.name === 'MYFC Monthly Membership' || product.name === 'Base'
  );
  
  const plusPlan = products.find(
    (product) => product.id === yearlyProductId
  ) || products.find(
    (product) => product.name === 'MYFC Annual Membership' || product.name === 'Plus'
  );

  // If the new products aren't found, look for "MYFC Membership Access" as a fallback
  const membershipAccess = products.find(
    (product) => product.name === 'MYFC Membership Access'
  );

  // Use the first product if none of the specific ones are found
  const finalBasePlan = basePlan || membershipAccess || products[0];
  const finalPlusPlan = plusPlan || membershipAccess || products[0];

  console.log('Pricing page - Selected products:', {
    monthly: finalBasePlan ? { id: finalBasePlan.id, name: finalBasePlan.name } : null,
    yearly: finalPlusPlan ? { id: finalPlusPlan.id, name: finalPlusPlan.name } : null
  });

  const basePrice = prices.find((price) => price.productId === finalBasePlan?.id);
  const plusPrice = prices.find((price) => price.productId === finalPlusPlan?.id);

  console.log('Pricing page - Selected prices:', {
    monthly: basePrice ? { id: basePrice.id, amount: basePrice.unitAmount } : null,
    yearly: plusPrice ? { id: plusPrice.id, amount: plusPrice.unitAmount } : null
  });

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
    <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Membership Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your daily routine with our science-based facial fitness program
        </p>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Features column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-2xl font-bold mb-6">All Plans Include</h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-primary/10 rounded-full p-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-foreground">{feature}</h3>
                    <p className="text-sm text-muted-foreground">{descriptions[index]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-medium mb-2">Why Choose MYFC?</h3>
              <p className="text-sm text-muted-foreground">
                Our science-based approach brings the proven principles of body fitness to facial exercise, 
                helping you achieve and maintain a naturally lifted, toned, and rejuvenated appearance.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly plan */}
            <PricingCard
              name="Monthly"
              price={(basePrice?.unitAmount || 1999) / 100}
              interval="mo"
              description="Billed monthly, cancel anytime"
              priceId={basePrice?.id}
              features={[
                "7-day free trial",
                "Full access to all workouts",
                "Mobile-friendly platform",
                "Cancel anytime"
              ]}
            />
            
            {/* Yearly plan */}
            <PricingCard
              name="Yearly"
              price={14.99}
              interval="mo"
              yearlyPrice={(plusPrice?.unitAmount || 17999) / 100}
              savePercent={25}
              description={`Billed $${((plusPrice?.unitAmount || 17999) / 100).toFixed(2)} annually`}
              priceId={plusPrice?.id}
              featured={true}
              features={[
                "7-day free trial",
                "Full access to all workouts",
                "Mobile-friendly platform",
                "Save 25% vs monthly plan"
              ]}
            />
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-sm">
            <p className="text-center text-muted-foreground">
              All plans include a 7-day free trial. You won't be charged until your trial ends.
              <br />
              <span className="text-xs">
                By subscribing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Testimonials or additional info */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Join thousands of satisfied members</h2>
        <p className="text-muted-foreground mb-8">
          Start your transformation today with our 7-day free trial
        </p>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  interval,
  yearlyPrice,
  savePercent,
  description,
  priceId,
  features,
  featured = false,
}: {
  name: string;
  price: number;
  interval: string;
  yearlyPrice?: number;
  savePercent?: number;
  description: string;
  priceId?: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div className={`rounded-xl overflow-hidden border ${featured ? 'border-primary shadow-lg' : 'border-border'}`}>
      {featured && (
        <div className="bg-primary text-primary-foreground text-center text-sm font-medium py-1.5">
          MOST POPULAR
        </div>
      )}
      
      <div className={`p-6 ${featured ? 'bg-primary/5' : 'bg-card'}`}>
        <h3 className="text-xl font-bold">{name} Plan</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          <span className="text-muted-foreground ml-1">/{interval}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          <form action={checkoutAction}>
            <input type="hidden" name="priceId" value={priceId} />
            <button 
              type="submit" 
              className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center ${
                featured 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

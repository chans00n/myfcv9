'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { customerPortalAction, getPricingData, getSubscriptionDetailsAction } from '@/lib/payments/actions';
import { TeamDataWithMembers } from '@/lib/db/schema';
import { Check, CreditCard, User as UserIcon } from 'lucide-react';
import { PricingModal } from './pricing-modal';

type SubscriptionDetails = {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    price: {
      id: string;
      unitAmount: number | null;
      currency: string;
      interval: string;
      intervalCount: number;
    };
    product: {
      id: string;
      name: string;
      features: string[];
    };
  };
  paymentMethod: {
    id: string;
    brand: string | undefined;
    last4: string | undefined;
    expMonth: number | undefined;
    expYear: number | undefined;
  } | null;
  invoices: {
    id: string;
    number: string | null;
    amount: number;
    currency: string;
    date: Date;
    url: string | null;
  }[];
} | null;

export function Settings({ teamData }: { teamData: TeamDataWithMembers }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [prices, setPrices] = useState<{
    monthly: { id?: string; amount: number };
    yearly: { id?: string; amount: number };
  }>({
    monthly: { amount: 19.99 },
    yearly: { amount: 14.99 },
  });
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (teamData.subscriptionStatus === 'active' || teamData.subscriptionStatus === 'trialing') {
        setIsLoading(true);
        try {
          const details = await getSubscriptionDetailsAction(new FormData());
          setSubscriptionDetails(details as SubscriptionDetails);
        } catch (error) {
          console.error('Error fetching subscription details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSubscriptionDetails();
  }, [teamData.subscriptionStatus]);

  const handleManageSubscription = async () => {
    if (teamData.subscriptionStatus === 'active' || teamData.subscriptionStatus === 'trialing') {
      // Use requestSubmit instead of submit for React forms
      const form = document.getElementById('subscription-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    } else {
      // For non-active subscriptions, show the pricing modal
      try {
        const pricingData = await getPricingData();
        setPrices(pricingData);
        setIsPricingModalOpen(true);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: number | null | undefined, currency: string = 'usd') => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Team Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Subscription Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Team Subscription</CardTitle>
            <CardDescription>Manage your team's subscription and billing</CardDescription>
          </CardHeader>
          <CardContent>
            {(teamData.subscriptionStatus === 'active' || teamData.subscriptionStatus === 'trialing') && subscriptionDetails ? (
              <div className="space-y-6">
                {/* Subscription Plan */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Subscription Plan</h3>
                  <p className="text-muted-foreground">
                    You are currently on the {subscriptionDetails.subscription.product.name}
                  </p>
                  
                  <div className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg bg-muted/20">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-3 md:gap-0">
                        <div>
                          <h4 className="font-medium">{subscriptionDetails.subscription.product.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatCurrency(subscriptionDetails.subscription.price.unitAmount)}/
                            {subscriptionDetails.subscription.price.interval}, billed {subscriptionDetails.subscription.price.interval}ly
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleManageSubscription}
                          className="w-full md:w-auto"
                        >
                          Change plan
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mt-4">Plan includes:</h4>
                  <ul className="space-y-2">
                    {subscriptionDetails.subscription.product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="text-sm text-muted-foreground">
                    Your next billing date is {formatDate(subscriptionDetails.subscription.currentPeriodEnd)}
                  </p>
                </div>
                
                {/* Payment Method */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-xl font-semibold">Payment Method</h3>
                  <p className="text-muted-foreground">Manage your payment methods</p>
                  
                  {subscriptionDetails.paymentMethod ? (
                    <div className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg bg-muted/20">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-3 md:gap-0">
                          <div>
                            <h4 className="font-medium capitalize">
                              {subscriptionDetails.paymentMethod.brand} ending in {subscriptionDetails.paymentMethod.last4}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Expires {subscriptionDetails.paymentMethod.expMonth}/{subscriptionDetails.paymentMethod.expYear}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleManageSubscription}
                              className="w-full sm:w-auto"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleManageSubscription}
                              className="w-full sm:w-auto"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground">No payment method on file</p>
                    </div>
                  )}
                  
                  {subscriptionDetails.paymentMethod && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleManageSubscription}
                    >
                      Add payment method
                    </Button>
                  )}
                </div>
                
                {/* Billing History */}
                {subscriptionDetails.invoices.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-xl font-semibold">Billing History</h3>
                    <p className="text-muted-foreground">View your billing history and download invoices</p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Date</th>
                            <th className="text-left py-2 font-medium">Amount</th>
                            <th className="text-left py-2 font-medium">Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptionDetails.invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b">
                              <td className="py-3">{formatDate(invoice.date)}</td>
                              <td className="py-3">{formatCurrency(invoice.amount, invoice.currency)}</td>
                              <td className="py-3">
                                {invoice.url ? (
                                  <a 
                                    href={invoice.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {invoice.number || 'View invoice'}
                                  </a>
                                ) : (
                                  invoice.number || 'N/A'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col justify-between items-start w-full">
                  <div className="mb-4 w-full">
                    <p className="font-medium">
                      Current Plan: {teamData.planName || 'Free'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {teamData.subscriptionStatus === 'active'
                        ? 'Billed monthly'
                        : teamData.subscriptionStatus === 'trialing'
                          ? 'Trial period'
                          : 'No active subscription'}
                    </p>
                  </div>
                  <form id="subscription-form" action={customerPortalAction} className="w-full">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full h-11"
                      onClick={handleManageSubscription}
                    >
                      Manage Subscription
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PricingModal 
        open={isPricingModalOpen} 
        onOpenChange={setIsPricingModalOpen} 
        prices={prices}
      />
    </div>
  );
}

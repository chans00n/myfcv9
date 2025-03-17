'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { customerPortalAction, getPricingData } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { removeTeamMember } from '@/app/(login)/actions';
import { InviteTeamMember } from './invite-team';
import { PricingModal } from './pricing-modal';

type ActionState = {
  error?: string;
  success?: string;
};

export function Settings({ teamData }: { teamData: TeamDataWithMembers }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [prices, setPrices] = useState<{
    monthly: { id?: string; amount: number };
    yearly: { id?: string; amount: number };
  }>({
    monthly: { amount: 19.99 },
    yearly: { amount: 14.99 },
  });

  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, { error: '', success: '' });

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  const handleManageSubscription = async () => {
    if (teamData.subscriptionStatus === 'active') {
      // Use the existing form submission for active subscriptions
      const form = document.getElementById('subscription-form') as HTMLFormElement;
      if (form) form.submit();
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

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Team Settings</h2>
      </div>

      <div className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Team Subscription</CardTitle>
            <CardDescription>Manage your team's subscription and billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                <div className="mb-4 sm:mb-0">
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
                <form id="subscription-form" action={customerPortalAction} className="w-full sm:w-auto">
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
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>View and manage your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-5">
              {teamData.teamMembers.map((member, index) => (
                <li key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                        alt={getUserDisplayName(member.user)}
                      />
                      <AvatarFallback>
                        {getUserDisplayName(member.user)
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {getUserDisplayName(member.user)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  {index > 1 ? (
                    <form action={removeAction}>
                      <input type="hidden" name="memberId" value={member.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={isRemovePending}
                      >
                        Remove
                      </Button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
            {removeState?.error && (
              <p className="text-destructive text-sm mt-4">{removeState.error}</p>
            )}
          </CardContent>
        </Card>

        <InviteTeamMember teamId={teamData.id} />
      </div>

      <PricingModal 
        open={isPricingModalOpen} 
        onOpenChange={setIsPricingModalOpen} 
        prices={prices}
      />
    </div>
  );
}

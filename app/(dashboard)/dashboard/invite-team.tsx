'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { use, useActionState } from 'react';
import { inviteTeamMember } from '@/app/(login)/actions';
import { useUser } from '@/lib/auth';

type ActionState = {
  error?: string;
  success?: string;
};

interface InviteTeamMemberProps {
  teamId?: number;
}

export function InviteTeamMember({ teamId }: InviteTeamMemberProps) {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const isOwner = user?.role === 'owner';
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, { error: '', success: '' });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
        <CardDescription>Add new members to your team</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-5">
          <div className="grid gap-3">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
              disabled={!isOwner}
              className="p-3 h-11"
            />
          </div>
          <div className="grid gap-3">
            <Label className="text-base">Role</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" className="h-5 w-5" />
                <Label htmlFor="member" className="text-base">Member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" className="h-5 w-5" />
                <Label htmlFor="owner" className="text-base">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-destructive text-sm">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-green-500 text-sm">{inviteState.success}</p>
          )}
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto h-11"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

import { redirect } from 'next/navigation';
import { getUser, getActivityLogs } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Settings as SettingsIcon, 
  AlertCircle,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  UserMinus,
  Mail,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { ActivityType } from '@/lib/db/schema';

// Helper functions for activity feed
function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  switch (action) {
    case ActivityType.SIGN_UP:
      return 'You signed up';
    case ActivityType.SIGN_IN:
      return 'You signed in';
    case ActivityType.SIGN_OUT:
      return 'You signed out';
    case ActivityType.UPDATE_PASSWORD:
      return 'You changed your password';
    case ActivityType.DELETE_ACCOUNT:
      return 'You deleted your account';
    case ActivityType.UPDATE_ACCOUNT:
      return 'You updated your account';
    case ActivityType.CREATE_TEAM:
      return 'You created a new team';
    case ActivityType.REMOVE_TEAM_MEMBER:
      return 'You removed a team member';
    case ActivityType.INVITE_TEAM_MEMBER:
      return 'You invited a team member';
    case ActivityType.ACCEPT_INVITATION:
      return 'You accepted an invitation';
    default:
      return 'Unknown action occurred';
  }
}

const iconMap: Record<ActivityType, any> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: SettingsIcon,
  [ActivityType.CREATE_TEAM]: UserPlus,
  [ActivityType.REMOVE_TEAM_MEMBER]: UserMinus,
  [ActivityType.INVITE_TEAM_MEMBER]: Mail,
  [ActivityType.ACCEPT_INVITATION]: CheckCircle,
};

// Function to get a random welcome message
function getRandomWelcomeMessage(name: string): string {
  const messages = [
    `Welcome back, ${name}! Ready to conquer the day?`,
    `Hey ${name}! Great to see you again!`,
    `${name}'s back in action! Let's make today count.`,
    `The one and only ${name} has arrived! Dashboard at your service.`,
    `Look who's here - it's ${name}! What's on the agenda today?`,
    `${name} has entered the building! Your dashboard awaits.`,
    `Greetings, ${name}! Your digital command center is ready.`,
    `Welcome aboard, Captain ${name}! Your dashboard is shipshape.`,
    `${name} is in the house! Let's get things done.`,
    `Hello there, ${name}! Your dashboard missed you.`
  ];
  
  // Get a random index based on the current date to ensure it changes daily but remains consistent throughout the day
  const today = new Date().toDateString();
  const seed = today + (name || ''); // Use name as part of the seed for personalization
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Get a positive index
  const positiveHash = Math.abs(hash);
  const index = positiveHash % messages.length;
  
  return messages[index];
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  const logs = await getActivityLogs();
  const welcomeMessage = getRandomWelcomeMessage(user.name || 'there');

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{welcomeMessage}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/team">
              Manage Team
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild className="justify-between">
                <Link href="/dashboard/team">
                  Team Settings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-between">
                <Link href="/dashboard/general">
                  Account Settings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent account activity</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length > 0 ? (
              <ul className="space-y-5">
                {logs.map((log) => {
                  const Icon = iconMap[log.action as ActivityType] || SettingsIcon;
                  const formattedAction = formatAction(
                    log.action as ActivityType
                  );

                  return (
                    <li key={log.id} className="flex items-center space-x-4">
                      <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {formattedAction}
                          {log.ipAddress && ` from IP ${log.ipAddress}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(new Date(log.timestamp))}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No activity yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  When you perform actions like signing in or updating your
                  account, they'll appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Tips to help you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                <span>Complete your profile in Account Settings</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                <span>Invite team members to collaborate</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                <span>Explore the dashboard features</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

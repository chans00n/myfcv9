import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your MYFC dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Team</CardTitle>
            <CardDescription>Manage your team settings and members</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and manage your team settings, invite new members, and handle subscriptions.</p>
            <div className="mt-4">
              <a href="/dashboard/team" className="text-primary hover:underline">
                Go to Team Settings →
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your personal account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Update your profile information, change your password, and manage your account preferences.</p>
            <div className="mt-4">
              <a href="/dashboard/general" className="text-primary hover:underline">
                Go to Account Settings →
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Styles</CardTitle>
            <CardDescription>View available UI components and styles</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore the available UI components, styles, and design patterns for your application.</p>
            <div className="mt-4">
              <a href="/dashboard/styles" className="text-primary hover:underline">
                View Styles →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

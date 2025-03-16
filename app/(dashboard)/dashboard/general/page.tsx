import { Suspense } from 'react';
import { getActivityLogs } from '@/lib/db/queries';
import { AccountSettings } from './account-settings';

export default async function GeneralPage() {
  const logs = await getActivityLogs();

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
      </div>
      
      <div className="space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AccountSettings logs={logs} />
        </Suspense>
      </div>
    </div>
  );
}

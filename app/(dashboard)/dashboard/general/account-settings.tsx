'use client';

import { startTransition, use, useActionState, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Loader2,
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  Trash2,
  Upload,
  type LucideIcon 
} from 'lucide-react';
import { useUser } from '@/lib/auth';
import { updateAccount, updatePassword, deleteAccount } from '@/app/(login)/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { ActivityType } from '@/lib/db/schema';
import { FileInput } from '@/components/ui/file-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadAvatar } from '@/lib/supabase/client';
import { updateUserAvatar } from './actions';
import { toast } from 'sonner';

type ActionState = {
  error?: string;
  success?: string;
};

type ActivityLog = {
  id: string | number;
  action: string;
  timestamp: string | Date;
  ipAddress?: string | null;
  userName?: string | null;
};

type AccountSettingsProps = {
  logs: ActivityLog[];
};

const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: Settings,
  [ActivityType.CREATE_TEAM]: UserPlus,
  [ActivityType.REMOVE_TEAM_MEMBER]: UserMinus,
  [ActivityType.INVITE_TEAM_MEMBER]: Mail,
  [ActivityType.ACCEPT_INVITATION]: CheckCircle,
};

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

export function AccountSettings({ logs }: AccountSettingsProps) {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Use a ref to store the initial avatar URL to prevent re-renders
  const initialAvatarUrlRef = useRef<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [accountState, accountAction, isAccountPending] = useActionState<ActionState, FormData>(
    updateAccount,
    { error: '', success: '' }
  );

  const [passwordState, passwordAction, isPasswordPending] = useActionState<ActionState, FormData>(
    updatePassword,
    { error: '', success: '' }
  );

  const [deleteState, deleteAction, isDeletePending] = useActionState<ActionState, FormData>(
    deleteAccount,
    { error: '', success: '' }
  );

  // Initialize once on mount
  useEffect(() => {
    setMounted(true);
    
    // Only set the avatar URL once from the user data
    if (initialAvatarUrlRef.current === null && user?.avatarUrl) {
      initialAvatarUrlRef.current = user.avatarUrl;
      setAvatarPreview(user.avatarUrl);
    }
  }, []);

  const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      accountAction(new FormData(event.currentTarget));
    });
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      passwordAction(new FormData(event.currentTarget));
    });
  };

  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      deleteAction(new FormData(event.currentTarget));
    });
  };

  const handleAvatarChange = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setAvatarFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;
    
    setIsUploading(true);
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        toast.error('Supabase is not properly configured. Please check your environment variables.');
        return;
      }
      
      // Upload to Supabase
      const avatarUrl = await uploadAvatar(avatarFile, user.id);
      
      if (!avatarUrl) {
        toast.error('Failed to upload avatar. Please check your network connection and try again.');
        return;
      }
      
      // Update user record in database
      const result = await updateUserAvatar(avatarUrl);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Avatar updated successfully');
        // Update the ref to prevent re-renders
        initialAvatarUrlRef.current = avatarUrl;
        // Update the preview
        setAvatarPreview(avatarUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('An error occurred while uploading your avatar. Please try again later.');
    } finally {
      setIsUploading(false);
      setAvatarFile(null);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a profile picture for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarPreview || undefined} alt={user?.name || 'User'} />
              <AvatarFallback className="text-lg">
                {user?.name
                  ? user.name.split(' ').map((n) => n[0]).join('')
                  : user?.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <FileInput 
                onChange={handleAvatarChange}
                maxFiles={1}
                maxSize={2 * 1024 * 1024} // 2MB
                accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
                preview={false}
                dropzoneClassName="h-32"
              />
              
              {avatarFile && (
                <Button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={isUploading}
                  className="w-full sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Avatar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleAccountSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-base">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                defaultValue={user?.name || ''}
                required
                className="bg-background p-3 h-11"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={user?.email || ''}
                required
                className="bg-background p-3 h-11"
              />
            </div>
            {accountState.error && (
              <p className="text-destructive text-sm">{accountState.error}</p>
            )}
            {accountState.success && (
              <p className="text-primary text-sm">{accountState.success}</p>
            )}
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto h-11"
              disabled={isAccountPending}
            >
              {isAccountPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handlePasswordSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="current-password" className="text-base">Current Password</Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                maxLength={100}
                className="bg-background p-3 h-11"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="new-password" className="text-base">New Password</Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
                className="bg-background p-3 h-11"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirm-password" className="text-base">Confirm New Password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                className="bg-background p-3 h-11"
              />
            </div>
            {passwordState.error && (
              <p className="text-destructive text-sm">{passwordState.error}</p>
            )}
            {passwordState.success && (
              <p className="text-green-500 text-sm">{passwordState.success}</p>
            )}
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto h-11"
              disabled={isPasswordPending}
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Track your recent account and team activities</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-5">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
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
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the dashboard looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="theme" className="text-base">Theme</Label>
            {mounted ? (
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger 
                  id="theme" 
                  className="w-full bg-background p-3 h-11"
                >
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="w-full h-11 rounded-md border bg-background" />
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Select your preferred theme for the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all associated data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-5">
            Account deletion is non-reversable. Please proceed with caution.
          </p>
          <form onSubmit={handleDeleteSubmit} className="space-y-5">
            <div className="grid gap-3">
              <Label htmlFor="delete-password" className="text-base">Confirm Password</Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={100}
                className="bg-background p-3 h-11"
              />
            </div>
            {deleteState.error && (
              <p className="text-destructive text-sm">{deleteState.error}</p>
            )}
            <Button
              type="submit"
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto h-11"
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

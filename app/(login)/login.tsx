'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { useCallback } from 'react';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' },
  );

  const handleFormAction = useCallback(async (formData: FormData) => {
    try {
      await formAction(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [formAction]);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
          {mode === 'signin'
            ? 'Sign in to your account'
            : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your email below to {mode === 'signin' ? 'sign in to' : 'create'} your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card p-8 shadow-sm rounded-lg border border-border">
          <form className="space-y-6" action={handleFormAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  defaultValue={state.name}
                  required
                  maxLength={50}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                placeholder="Enter your password"
              />
            </div>

            {state?.error && (
              <div className="text-destructive text-sm">{state.error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                type="button"
                onClick={() => {
                  try {
                    // This will be implemented later
                    console.log('Google sign-in clicked');
                  } catch (error) {
                    console.error('Error with Google sign-in:', error);
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.4001 8.116C15.4001 7.48636 15.3478 7.02688 15.2346 6.5504H8.00012V9.39229H12.2616C12.1789 10.0985 11.7654 11.1621 10.8001 11.8768L10.7846 11.9762L13.0924 13.7237L13.2539 13.7392C14.7231 12.4157 15.4001 10.4297 15.4001 8.116Z" fill="#4285F4"/>
                  <path d="M8.00012 15.9999C10.1001 15.9999 11.8578 15.2999 13.2539 13.7392L10.8001 11.8768C10.1463 12.3353 9.24628 12.6665 8.00012 12.6665C5.99628 12.6665 4.2732 11.3578 3.6347 9.5186L3.54013 9.52699L1.13864 11.3375L1.10779 11.4272C2.4924 14.1334 5.01397 15.9999 8.00012 15.9999Z" fill="#34A853"/>
                  <path d="M3.63465 9.5186C3.47773 9.04226 3.38773 8.53129 3.38773 8.00002C3.38773 7.46876 3.47773 6.95778 3.62696 6.48144L3.62234 6.37595L1.19312 4.5332L1.10773 4.57285C0.557734 5.61168 0.243652 6.77478 0.243652 8.00002C0.243652 9.22526 0.557734 10.3884 1.10773 11.4272L3.63465 9.5186Z" fill="#FBBC05"/>
                  <path d="M8.00012 3.33338C9.41935 3.33338 10.3732 4.01242 10.9078 4.51242L13.1001 2.42891C11.8501 1.28224 10.1001 0.666687 8.00012 0.666687C5.01397 0.666687 2.4924 2.53324 1.10779 5.23942L3.62702 7.14801C4.2732 5.30881 5.99628 3.33338 8.00012 3.33338Z" fill="#EB4335"/>
                </svg>
                Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'signin'
                ? 'Don\'t have an account?'
                : 'Already have an account?'}
            </span>{' '}
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="font-medium text-primary hover:text-primary/90"
            >
              {mode === 'signin'
                ? 'Sign up'
                : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

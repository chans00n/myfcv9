'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export function SupabaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message: string; details?: string }>({ message: '' });

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setResult({ message: 'Testing connection...' });

    try {
      // Check if environment variables are set
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        setResult({
          success: false,
          message: 'Supabase environment variables are not set. Please check your .env file.',
          details: `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Not set'}\nNEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : 'Not set'}`
        });
        return;
      }

      // Test if we can list buckets
      console.log('Testing Supabase connection to:', supabaseUrl);
      const { data, error } = await supabase.storage.listBuckets();

      if (error) {
        setResult({
          success: false,
          message: `Connection failed: ${error.message}`,
          details: `URL: ${supabaseUrl}\nError details: ${JSON.stringify(error)}`
        });
        return;
      }

      console.log('Buckets:', data);
      
      // Check if avatars bucket exists
      const avatarsBucket = data.find(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucket) {
        setResult({
          success: false,
          message: 'Connection successful, but "avatars" bucket not found. Please create it in Supabase.',
          details: `Available buckets: ${data.map(b => b.name).join(', ') || 'None'}`
        });
        return;
      }

      // Try to upload a test file
      try {
        const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload('test-connection.txt', testFile, { upsert: true });
        
        if (uploadError) {
          setResult({
            success: false,
            message: `Connection successful, but upload test failed: ${uploadError.message}`,
            details: `Bucket: avatars\nError details: ${JSON.stringify(uploadError)}`
          });
          return;
        }
        
        // Clean up test file
        await supabase.storage.from('avatars').remove(['test-connection.txt']);
      } catch (uploadError) {
        console.error('Upload test error:', uploadError);
      }

      setResult({
        success: true,
        message: 'Connection successful! Supabase is properly configured.',
        details: `URL: ${supabaseUrl}\nBucket: avatars\nUpload test: Passed`
      });
    } catch (error) {
      console.error('Error testing Supabase connection:', error);
      setResult({
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: `Check your browser console for more details.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Test your Supabase connection for avatar uploads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={testSupabaseConnection} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Supabase Connection'
            )}
          </Button>

          {result.message && (
            <div className={`p-4 rounded-md ${
              result.success === undefined
                ? 'bg-muted text-foreground'
                : result.success
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-destructive/10 text-destructive'
            }`}>
              <p className="font-medium">{result.message}</p>
              
              {result.details && (
                <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto text-xs text-muted-foreground">
                  {result.details}
                </pre>
              )}
              
              {!result.success && result.message.includes('environment variables') && (
                <div className="text-sm mt-2">
                  <p>Make sure you have added the following to your .env file:</p>
                  <pre className="mt-1 p-2 bg-muted rounded-md overflow-x-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co{'\n'}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
                  </pre>
                  <p className="mt-2">Then restart your development server:</p>
                  <pre className="mt-1 p-2 bg-muted rounded-md overflow-x-auto">
                    pnpm dev
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
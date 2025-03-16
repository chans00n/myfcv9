'use client'

import { createClient } from '@supabase/supabase-js'

// These environment variables are set in the .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log the actual values for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Anon Key:', supabaseAnonKey ? '[REDACTED]' : 'undefined')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your environment variables.')
}

// Create the Supabase client with retries and timeout options
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

export async function uploadAvatar(file: File, userId: number): Promise<string | null> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials are missing')
      return null
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${fileName}`  // Remove the 'avatars/' prefix

    console.log('Uploading file to path:', filePath)
    
    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return null
    }

    console.log('Upload successful, getting public URL')
    
    // Get the public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    console.log('Public URL:', urlData.publicUrl)
    
    return urlData.publicUrl
  } catch (error) {
    console.error('Error in uploadAvatar:', error)
    return null
  }
}

export async function deleteAvatar(url: string): Promise<boolean> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials are missing')
      return false
    }

    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    // Get just the filename without any path prefix
    const fileName = pathParts[pathParts.length - 1]

    console.log('Deleting file:', fileName)
    
    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from('avatars').remove([fileName])

    if (error) {
      console.error('Error deleting avatar:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteAvatar:', error)
    return false
  }
} 
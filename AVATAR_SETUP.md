# Avatar Upload Setup

This document provides instructions for setting up avatar uploads with Supabase Storage.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project

## Setup Steps

### 1. Create a Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to "Storage" in the left sidebar
3. Click "Create a new bucket"
4. Name the bucket "avatars"
5. Set the bucket privacy to "Public"

### 2. Set Up Bucket Policies

1. Click on the "avatars" bucket
2. Go to the "Policies" tab
3. Add the following policies:

#### For Insert (Upload)

- Policy name: "Allow authenticated uploads"
- Policy definition: `(auth.role() = 'authenticated')`

#### For Select (View)

- Policy name: "Allow public viewing"
- Policy definition: `(bucket_id = 'avatars')`

#### For Update

- Policy name: "Allow authenticated updates"
- Policy definition: `(auth.role() = 'authenticated')`

#### For Delete

- Policy name: "Allow authenticated deletes"
- Policy definition: `(auth.role() = 'authenticated')`

### 3. Configure Environment Variables

Add the following variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings under "API".

### 4. Run Database Migration

Run the database migration to add the `avatarUrl` field to the users table:

```bash
pnpm db:migrate
```

## Usage

The avatar upload functionality is now available on the Account Settings page. Users can:

1. Upload an image by dragging and dropping or clicking to select
2. Preview the image before uploading
3. Click "Upload Avatar" to save the image

The avatar will be displayed in the user menu and on the account settings page.

## Troubleshooting

- If uploads fail, check your Supabase credentials and bucket policies
- Ensure the "avatars" bucket is set to public
- Check browser console for any errors during upload
- Verify that the database migration has been applied correctly 
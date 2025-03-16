'use server'

import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUser } from '@/lib/db/queries'
import { revalidatePath } from 'next/cache'

export async function updateUserAvatar(avatarUrl: string) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { error: 'User not authenticated' }
    }

    await db
      .update(users)
      .set({ 
        avatarUrl,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))

    revalidatePath('/dashboard/general')
    revalidatePath('/dashboard')
    
    return { success: 'Avatar updated successfully' }
  } catch (error) {
    console.error('Error updating avatar:', error)
    return { error: 'Failed to update avatar' }
  }
} 
import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { App, UserFeedback } from 'types'

export async function getApp(client: SupabaseClient, id: string, userID: string) {
  const { data, error } = await client
    .from<App>('apps')
    .select('*')
    .eq('id', id)
    // Check if the user is the owner of a code snippet.
    .eq('creator_id', userID)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function createApp(
  client: SupabaseClient,
  app: Pick<App, 'title' | 'serialized'>,
) {
  const { body, error } = await client.from<App>('apps').insert(app).limit(1).single()

  if (error) throw error
  return body
}

export async function deleteApp(client: SupabaseClient, id: string) {
  const { error } = await client.from<App>('apps').delete().eq('id', id)

  if (error) throw error
}

export async function upsertUserFeedback(
  client: SupabaseClient,
  userID: string,
  feedback: string,
) {
  const { body, error } = await client.from<UserFeedback>('user_feedback').upsert({
    user_id: userID,
    feedback,
  })

  if (error) throw error
  return body[0]
}

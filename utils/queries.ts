import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { UserFeedback, App } from 'types'

export async function getApp(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from<App>('apps')
    .select('*')
    .eq('id', id)

  if (error) throw error
  return data && data.length ? data[0] : null
}

export async function createApp(client: SupabaseClient, app: Pick<App, 'title' | 'serialized'>) {
  const { body, error } = await client
    .from<App>('apps')
    .insert(app)

  if (error) throw error
  return body[0]
}

export async function deleteApp(client: SupabaseClient, id: string) {
  const { body, error } = await client
    .from<App>('apps')
    .delete()
    .eq('id', id)

  if (error) throw error
  return body[0]
}

export async function upsertUserFeedback(client: SupabaseClient, userID: string, feedback: string) {
  const { body, error } = await client
    .from<UserFeedback>('user_feedback')
    .upsert({ user_id: userID, feedback })
  if (error) throw error
  return body[0]
}

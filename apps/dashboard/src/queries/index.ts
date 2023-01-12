import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { App, AppTemplate, UserFeedback } from './types'

const appsTable = 'apps'
const userFeedbackTable = 'user_feedback'

export async function getApps(client: SupabaseClient, userID: string) {
  const { data, error } = await client
    .from<App>(appsTable)
    .select('*')
    .eq('creator_id', userID)

  if (error) throw error
  return data || []
}

export async function getApp(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from<App>(appsTable)
    .select('*')
    .eq('id', id)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function createApp(client: SupabaseClient, app: AppTemplate) {
  const { error } = await client.from<App>(appsTable).insert(app)

  if (error) throw error
}

export async function updateApp(
  client: SupabaseClient,
  app: Pick<App, 'id'> & Partial<Pick<App, 'state' | 'deployed_state'>>,
) {
  const { error, body } = await client.from<App>(appsTable).update(app).eq('id', app.id)

  if (error) throw error
}

export async function deleteApp(client: SupabaseClient, id: string) {
  const { error } = await client.from<App>(appsTable).delete().eq('id', id)

  if (error) throw error
}

export async function upsertUserFeedback(
  client: SupabaseClient,
  userID: string,
  feedback: string,
) {
  const { body, error } = await client.from<UserFeedback>(userFeedbackTable).upsert({
    user_id: userID,
    feedback,
  })

  if (error) throw error
  return body[0]
}

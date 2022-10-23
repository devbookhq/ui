import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { App, DeployedApp, UserFeedback } from './types'

export async function getApps(client: SupabaseClient, userID: string) {
  const { data, error } = await client
    .from<Required<App>>('apps')
    .select('*')
    .eq('creator_id', userID)

  if (error) throw error
  return data || []
}

export async function getApp(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from<Required<App>>('apps')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function getDeployedApp(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from<Required<DeployedApp>>('deployed_apps')
    .select('*')
    .eq('app_id', id)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function createApp(
  client: SupabaseClient,
  app: Required<Pick<App, 'title' | 'id' | 'state' | 'creator_id'>>,
) {
  const { body, error } = await client.from<App>('apps').insert(app)

  if (error) throw error
  return body
}

export async function upsertDeployedApp(client: SupabaseClient, app: DeployedApp) {
  const { body, error } = await client.from<DeployedApp>('deployed_apps').upsert(app)

  if (error) throw error
  return body
}

export async function updateApp(
  client: SupabaseClient,
  app: Required<Pick<App, 'id' | 'state'>>,
) {
  const { error } = await client.from<App>('apps').update(app).eq('id', app.id)

  if (error) throw error
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

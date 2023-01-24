import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { App, UserFeedback, Env, AppFeedback, appsFeedbackTable } from './types'

const appsTable = 'apps'
const userFeedbackTable = 'user_feedback'
const envsTable = 'code_snippets'

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

export async function getEnvs(client: SupabaseClient, userID: string) {
  const { data, error } = await client
    .from<Env>(envsTable)
    .select('*')
    .eq('creator_id', userID)

  if (error) throw error
  return data || []
}

export async function insertUserFeedback(
  client: SupabaseClient,
  userID: string,
  feedback: string,
) {
  const { body, error } = await client.from<UserFeedback>(userFeedbackTable).insert({
    user_id: userID,
    feedback,
  })

  if (error) throw error
  return body[0]
}

export async function listAppFeedback(
  client: SupabaseClient,
  appID: string
) {
  const { error, data } = await client
    .from<Required<AppFeedback>>(appsFeedbackTable)
    .select('*')
    .eq('appId', appID)

  if (error) throw error
  return data
}

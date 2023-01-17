import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Installation } from '@slack/oauth'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

export interface AppFeedback {
  appId: string
  feedback?: string
  properties: {
    userId?: string
    anonymousId?: string
  }
}

const appsFeedbackTable = 'apps_feedback'
const slackInstallationsTable = 'slack_installations'

export async function saveAppFeedback(
  client: SupabaseClient,
  feedback: AppFeedback,
) {
  const { error } = await client
    .from(appsFeedbackTable)
    .insert(feedback)

  if (error) throw error
}

export async function setInstallation(
  client: SupabaseClient,
  installationID: string,
  installation: Installation,
) {
  const { error } = await client
    .from(slackInstallationsTable)
    .insert(installation)

  if (error) throw error
}

export async function getInstallation(
  client: SupabaseClient,
  installationID: string,
): Promise<Installation> {
  const { error, data } = await client
    .from(slackInstallationsTable)
    .select('*')
    .eq('installation_id', installationID)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function deleteInstallation(
  client: SupabaseClient,
  installationID: string,
) {
  const { error } = await client
    .from(slackInstallationsTable)
    .delete()
    .eq('installation_id', installationID)

  if (error) throw error
}

// Importing from this file in frontend code will throw runtime error.

import type { Installation } from '@slack/oauth'
import {
  createClient,
  SupabaseClient as SupabaseAdmin,
} from '@supabase/supabase-js'

import {
  AppFeedback,
  appsFeedbackTable,
  InstallationDBEntry,
  slackInstallationsTable
} from './db'

import { Database } from './supabase'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

export async function saveAppFeedback(
  admin: SupabaseAdmin,
  feedback: AppFeedback,
) {
  const { error } = await admin
    .from(appsFeedbackTable)
    .insert(feedback)

  if (error) throw error
}

export async function setInstallation(
  admin: SupabaseAdmin,
  installationID: string,
  devbookAppID: string | undefined,
  installation: Installation,
) {
  const { error } = await admin
    .from(slackInstallationsTable)
    .upsert<InstallationDBEntry>({
      id: installationID,
      devbook_app_id: devbookAppID,
      installation_data: installation,
    })

  if (error) throw error
}

export async function getInstallation(
  admin: SupabaseAdmin,
  installationID: string,
) {
  const { error, data } = await admin
    .from(slackInstallationsTable)
    .select<'*', InstallationDBEntry>('*')
    .eq('id', installationID)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function getInstallationsByAppID(
  admin: SupabaseAdmin,
  devbookAppID: string,
) {
  const { error, data } = await admin
    .from(slackInstallationsTable)
    .select<'*', InstallationDBEntry>('*')
    .eq('devbook_app_id', devbookAppID)

  if (error) throw error
  return data
}

export async function deleteInstallation(
  admin: SupabaseAdmin,
  installationID: string,
) {
  const { error } = await admin
    .from(slackInstallationsTable)
    .delete()
    .eq('id', installationID)

  if (error) throw error
}

import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { UserFeedback } from 'types'

export async function upsertUserFeedback(userID: string, feedback: string) {
  const { body, error } = await supabaseClient
    .from<UserFeedback>('user_feedback')
    .upsert({ user_id: userID, feedback })
  if (error) throw error
  return body[0]
}

import {
  withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs'

export default withAuthRequired(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
   res.status(405).end('Method Not Allowed')
   return
  }


})

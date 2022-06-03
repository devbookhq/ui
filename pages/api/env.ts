import {
  withPageAuth,
} from '@supabase/supabase-auth-helpers/nextjs'

export default withPageAuth(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end('Method Not Allowed')
    return
  }


})


const params = new URLSearchParams({
  api_key: 'aaa',
})
const body = {
  base: 'nodejs',
  deps: [
    {
      name: ''
    },
  ],
}
fetch(process.env.NEXT_API_SERVER + '/env' + params.toString(), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    // TODO: Fetch code item from DB
    res.status(200).json({
      item: 'item'
    })
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

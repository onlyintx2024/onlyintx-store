import { checkAuth } from '../../../utils/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (checkAuth(req, res)) {
    return res.status(200).json({ authenticated: true })
  } else {
    return res.status(401).json({ authenticated: false })
  }
}
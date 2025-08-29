import { verifyPassword } from '../../../utils/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  if (verifyPassword(password)) {
    // Set secure cookie for authentication
    res.setHeader('Set-Cookie', [
      `adminAuth=${password}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/`
    ])
    
    return res.status(200).json({ message: 'Login successful' })
  } else {
    return res.status(401).json({ message: 'Invalid password' })
  }
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Clear the authentication cookie
  res.setHeader('Set-Cookie', [
    `adminAuth=; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=0; Path=/`
  ])
  
  return res.status(200).json({ message: 'Logout successful' })
}
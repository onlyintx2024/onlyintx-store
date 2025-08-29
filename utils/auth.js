// Simple admin authentication system
// In production, use proper authentication with hashed passwords

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'onlyintx2024'

export function checkAuth(req, res) {
  // Check for auth cookie or session
  const authToken = req.cookies?.adminAuth || req.headers.authorization
  
  if (!authToken || authToken !== ADMIN_PASSWORD) {
    return false
  }
  
  return true
}

export function requireAuth(handler) {
  return async (req, res) => {
    if (!checkAuth(req, res)) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Admin authentication required'
      })
    }
    
    return handler(req, res)
  }
}

// Simple password verification for login
export function verifyPassword(password) {
  return password === ADMIN_PASSWORD
}
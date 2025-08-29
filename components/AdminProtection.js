import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminProtection({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated by calling a protected endpoint
        const response = await fetch('/api/admin/check-auth')
        
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          // Redirect to login if not authenticated
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Don't check auth on login page
    if (router.pathname === '/admin/login') {
      setIsLoading(false)
      setIsAuthenticated(true) // Allow login page to render
      return
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-texas-red mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && router.pathname !== '/admin/login') {
    return null // Router will redirect to login
  }

  return children
}
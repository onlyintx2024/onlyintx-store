import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    visitors: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real order data
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        const orders = data.orders || []
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0)
        const todayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt).toDateString()
          const today = new Date().toDateString()
          return orderDate === today
        }).length
        
        setStats({
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          activeProducts: 4, // You can fetch from Printify API if needed
          todayOrders: todayOrders
        })
        setLoading(false) // ✅ FIX: Set loading to false on success
      })
      .catch(err => {
        console.error('Error fetching stats:', err)
        setLoading(false) // ✅ FIX: Also set loading to false on error
      })
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to your OnlyInTX admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Products
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">O</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Orders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Today's Orders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.todayOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/products"
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
              >
                <h4 className="font-semibold text-blue-900">Manage Products</h4>
                <p className="text-sm text-blue-700">Add, edit, or remove products from your store</p>
              </Link>
              
              <Link
                href="/admin/orders"
                className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors"
              >
                <h4 className="font-semibold text-green-900">View Orders</h4>
                <p className="text-sm text-green-700">Monitor and manage customer orders</p>
              </Link>
              
              <Link
                href="/admin/settings"
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors"
              >
                <h4 className="font-semibold text-purple-900">Settings</h4>
                <p className="text-sm text-purple-700">Configure your store settings</p>
              </Link>

              <Link
                href="/admin/mockup-guide"
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors"
              >
                <h4 className="font-semibold text-orange-900">Mockup Guide</h4>
                <p className="text-sm text-orange-700">Visual guide for organizing product mockups</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-gray-600">New order #{stats.totalOrders > 0 ? stats.totalOrders : '1001'} received</span>
                <span className="ml-auto text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Product "Austin Tee" updated</span>
                <span className="ml-auto text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Settings updated</span>
                <span className="ml-auto text-gray-400">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
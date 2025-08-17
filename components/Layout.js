import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { state } = useCart()
  
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Austin', href: '/austin' },
    { name: 'Dallas', href: '/dallas' },
    { name: 'Houston', href: '/houston' },
    { name: 'San Antonio', href: '/san-antonio' },
    { name: 'All Cities', href: '/cities' },
  ]
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-texas-blue shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                OnlyInTX
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-texas-gold transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Cart and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative text-white hover:text-texas-gold">
                <ShoppingBagIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-texas-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-texas-gold/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-white hover:text-texas-gold transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>
      
      {/* Main Content */}
      <main>{children}</main>
      
      {/* Footer */}

      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-texas-gold mb-4">OnlyInTX</h3>
              <p className="text-gray-300 mb-4">
                Celebrating the Lone Star State with authentic Texas pride apparel and gifts. 
                From Austin to El Paso, we've got your Texas city covered.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-texas-gold">About Us</Link></li>
                <li><Link href="/shipping" className="hover:text-texas-gold">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-texas-gold">Returns</Link></li>
                <li><Link href="/contact" className="hover:text-texas-gold">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Popular Cities</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/austin" className="hover:text-texas-gold">Austin</Link></li>
                <li><Link href="/dallas" className="hover:text-texas-gold">Dallas</Link></li>
                <li><Link href="/houston" className="hover:text-texas-gold">Houston</Link></li>
                <li><Link href="/san-antonio" className="hover:text-texas-gold">San Antonio</Link></li>
              </ul>

            </div>

            <div>  
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/privacy" className="hover:text-texas-gold">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-texas-gold">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OnlyInTX. All rights reserved. Made with Texas-sized love.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
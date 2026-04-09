'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux'
import { logout } from '@/store/authSlice'
import { Button } from '../ui/button'   
import { 
  Home, 
  Compass, 
  User, 
  LogOut, 
  List, 
  BookOpen,
  Users,
  Menu,
  X
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Home className="h-6 w-6" />
            LocalGuide
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`flex items-center gap-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            
            <Link 
              href="/explore" 
              className={`flex items-center gap-2 ${isActive('/explore') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Compass className="h-5 w-5" />
              Explore Tours
            </Link>

            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                {/* Tourist Links */}
                {user?.role === 'tourist' && (
                  <Link 
                    href="/tourist/dashboard/bookings" 
                    className={`flex items-center gap-2 ${isActive('/tourist/dashboard/bookings') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    <BookOpen className="h-5 w-5" />
                    My Bookings
                  </Link>
                )}

                {/* Guide Links */}
                {user?.role === 'guide' && (
                  <>
                    <Link 
                      href="/guide/dashboard/listings" 
                      className={`flex items-center gap-2 ${isActive('/guide/dashboard/listings') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <List className="h-5 w-5" />
                      My Listings
                    </Link>
                    <Link 
                      href="/guide/dashboard/bookings" 
                      className={`flex items-center gap-2 ${isActive('/guide/dashboard/bookings') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <BookOpen className="h-5 w-5" />
                      Bookings
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {user?.role === 'admin' && (
                  <>
                    <Link 
                      href="/admin/dashboard/users-management" 
                      className={`flex items-center gap-2 ${isActive('/admin/dashboard/users-management') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <Users className="h-5 w-5" />
                      Users
                    </Link>
                    <Link 
                      href="/admin/dashboard/listings-management" 
                      className={`flex items-center gap-2 ${isActive('/admin/dashboard/listings-management') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <List className="h-5 w-5" />
                      Listings
                    </Link>
                  </>
                )}

                {/* Common Links */}
                <Link 
                  href={`/${user?.role}/dashboard`} 
                  className={`flex items-center gap-2 ${isActive(`/${user?.role}/dashboard`) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`px-4 py-2 ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/explore" 
                className={`px-4 py-2 ${isActive('/explore') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                Explore Tours
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="px-4 py-2" onClick={() => setIsOpen(false)}>
                    Sign in
                  </Link>
                  <Link href="/register" className="px-4 py-2" onClick={() => setIsOpen(false)}>
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href={`/${user?.role}/dashboard`} 
                    className={`px-4 py-2 ${isActive(`/${user?.role}/dashboard`) ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {user?.role === 'tourist' && (
                    <Link 
                      href="/tourist/dashboard/bookings" 
                      className={`px-4 py-2 ${isActive('/tourist/dashboard/bookings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                  )}

                  {user?.role === 'guide' && (
                    <>
                      <Link 
                        href="/guide/dashboard/listings" 
                        className={`px-4 py-2 ${isActive('/guide/dashboard/listings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        My Listings
                      </Link>
                      <Link 
                        href="/guide/dashboard/bookings" 
                        className={`px-4 py-2 ${isActive('/guide/dashboard/bookings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Bookings
                      </Link>
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <Link 
                        href="/admin/dashboard/users-management" 
                        className={`px-4 py-2 ${isActive('/admin/dashboard/users-management') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Users
                      </Link>
                      <Link 
                        href="/admin/dashboard/listings-management" 
                        className={`px-4 py-2 ${isActive('/admin/dashboard/listings-management') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Listings
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
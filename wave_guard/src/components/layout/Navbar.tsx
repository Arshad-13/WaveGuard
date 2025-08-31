'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Waves, MessageCircle, FileText, Bell, BarChart3, LogIn, UserPlus, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/lib/auth-context';
import { logOut } from '@/lib/firebase';

const navigation = [
  { name: 'Chatbot', href: '/chatbot', icon: MessageCircle },
  { name: 'Reports', href: '/report', icon: FileText },
  { name: 'Alerts', href: '/alert', icon: Bell },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'FundMe', href: '/fundme', icon: DollarSign },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, userProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between h-24 px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
            <Waves className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-white">
              WaveGuard
            </span>
            <div className="text-xs text-blue-300 font-medium -mt-1">Coastal Protection</div>
          </div>
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href === '/dashboard' && pathname.startsWith('/dashboard'));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white bg-blue-600'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons - Right Side */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-700 rounded-md animate-pulse"></div>
              <div className="w-16 h-8 bg-slate-700 rounded-md animate-pulse"></div>
            </div>
          ) : user && userProfile ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {userProfile.first_name?.[0] || userProfile.last_name?.[0] || 'U'}
                  </span>
                </div>
                <span className="hidden sm:block font-medium text-white">
                  {userProfile.first_name || userProfile.last_name || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-all duration-200 border border-gray-600 hover:border-gray-500"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth?mode=signin"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-all duration-200 border border-gray-600 hover:border-gray-500"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth?mode=signup"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href === '/dashboard' && pathname.startsWith('/dashboard'));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-all duration-200',
                    isActive
                      ? 'text-white bg-blue-600'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Auth Section */}
            {!user && (
              <div className="pt-4 border-t border-slate-700 space-y-2">
                <Link
                  href="/auth?mode=signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-all duration-200"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Waves, Shield, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Chatbot', href: '/chatbot', icon: Shield },
  { name: 'Report', href: '/report', icon: AlertTriangle },
  { name: 'Alerts', href: '/alerts', icon: Shield },
  { name: 'Dashboard', href: '/dashboard', icon: Shield },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Waves className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-black text-2xl bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  WaveGuard
                </span>
                <div className="text-xs font-semibold text-cyan-600 -mt-1">Coastal Protection AI</div>
              </div>
            </Link>
          </div>

          {/* Centered Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-2">
              <Link
                href="/"
                className={clsx(
                  'flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300',
                  isHome
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600'
                )}
              >
                <Waves className="h-5 w-5" />
                <span>Home</span>
              </Link>
              
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href === '/dashboard' && pathname.startsWith('/dashboard'));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Status Indicator - Right Side (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-700">System Online</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <span className={clsx(
                  'absolute block h-0.5 w-6 bg-current transform transition-all duration-300',
                  isOpen ? 'rotate-45 top-2.5' : 'top-1'
                )}></span>
                <span className={clsx(
                  'absolute block h-0.5 w-6 bg-current transition-all duration-300',
                  isOpen ? 'opacity-0 top-2.5' : 'top-2.5'
                )}></span>
                <span className={clsx(
                  'absolute block h-0.5 w-6 bg-current transform transition-all duration-300',
                  isOpen ? '-rotate-45 top-2.5' : 'top-4'
                )}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={clsx(
        'lg:hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      )}>
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
          <div className="px-6 py-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold text-lg transition-all duration-300',
                isHome
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white'
              )}
            >
              <Waves className="h-6 w-6" />
              <span>Home</span>
              {isHome && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
            </Link>
            
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
                    'flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold text-lg transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </Link>
              );
            })}
            
            {/* Mobile Status */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 bg-green-100 px-4 py-3 rounded-2xl">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-green-700">All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Waves, Sun, Moon, Shield, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Home', href: '/', icon: Waves },
  { name: 'Chatbot', href: '/chatbot', icon: Shield },
  { name: 'Report', href: '/report', icon: AlertTriangle },
  { name: 'Dashboard', href: '/dashboard', icon: Shield },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-dark dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Waves className="h-8 w-8" />
              <span className="font-bold text-xl">WaveGuard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href === '/dashboard' && pathname.startsWith('/dashboard')) ||
                (item.href === '/admin' && pathname.startsWith('/admin'));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-300'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 dark:text-gray-300 dark:hover:text-ocean-400 dark:hover:bg-ocean-900/30'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 dark:text-gray-300 dark:hover:text-ocean-400 dark:hover:bg-ocean-900/30 transition-all duration-200"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 dark:text-gray-300 dark:hover:text-ocean-400 dark:hover:bg-ocean-900/30"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 dark:bg-dark dark:border-gray-700">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href === '/dashboard' && pathname.startsWith('/dashboard')) ||
                (item.href === '/admin' && pathname.startsWith('/admin'));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200',
                    isActive
                      ? 'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-300'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 dark:text-gray-300 dark:hover:text-ocean-400 dark:hover:bg-ocean-900/30'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

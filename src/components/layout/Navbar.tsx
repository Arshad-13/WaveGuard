'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Waves, Shield, AlertTriangle } from 'lucide-react';
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

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-primary">
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
                      ? 'bg-ocean-100 text-ocean-800'
                      : 'text-gray-600 hover:text-primary hover:bg-ocean-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-ocean-50 transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
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
                      ? 'bg-ocean-100 text-ocean-800'
                      : 'text-gray-600 hover:text-primary hover:bg-ocean-50'
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

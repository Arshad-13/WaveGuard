import Link from 'next/link';
import { Waves, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 text-white mb-4 group">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <span className="font-black text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                WaveGuard
              </span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md leading-relaxed text-base font-medium">
              Advanced AI-powered coastal threat detection and alert system <span className="text-cyan-300 font-semibold">protecting communities 
              worldwide</span> from tsunamis, cyclones, and other marine hazards.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 p-3 bg-white/5 rounded-xl hover:bg-white/10">
                <Github className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 p-3 bg-white/5 rounded-xl hover:bg-white/10">
                <Twitter className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 p-3 bg-white/5 rounded-xl hover:bg-white/10">
                <Linkedin className="h-7 w-7" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:translate-x-1 transform inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:translate-x-1 transform inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:translate-x-1 transform inline-block">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:translate-x-1 transform inline-block">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300 hover:text-cyan-300 transition-colors">
                <div className="p-2 bg-cyan-500/20 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="font-medium">contact@waveguard.com</span>
              </li>
              <li className="flex items-center text-gray-300 hover:text-cyan-300 transition-colors">
                <div className="p-2 bg-cyan-500/20 rounded-lg mr-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="font-medium">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start text-gray-300 hover:text-cyan-300 transition-colors">
                <div className="p-2 bg-cyan-500/20 rounded-lg mr-3 mt-1">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="font-medium leading-relaxed">
                  Marine Research Center<br />
                  123 Ocean Drive<br />
                  Coastal City, CA 90210
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700/50 mt-6 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <div className="text-gray-300 font-medium mb-1">
                © 2024 <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">WaveGuard</span>. All rights reserved.
              </div>
              <div className="text-cyan-300 font-medium">
                Built for coastal protection and community safety.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-105 transform text-center">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-105 transform text-center">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-105 transform text-center">
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { Waves, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-white mb-4">
              <Waves className="h-8 w-8 text-ocean-400" />
              <span className="font-bold text-2xl">WaveGuard</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Advanced AI-powered coastal threat detection and alert system protecting communities 
              worldwide from tsunamis, cyclones, and other marine hazards.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ocean-400 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ocean-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ocean-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-ocean-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-ocean-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-300 hover:text-ocean-400 transition-colors">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-gray-300 hover:text-ocean-400 transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-ocean-400" />
                contact@waveguard.com
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-ocean-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-ocean-400 mt-1" />
                <span>
                  Marine Research Center<br />
                  123 Ocean Drive<br />
                  Coastal City, CA 90210
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 WaveGuard. All rights reserved. Built for coastal protection and community safety.
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-ocean-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-ocean-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-ocean-400 transition-colors text-sm">
                API Documentation
              </Link>
            </div>
          </div>
          
          {/* Credits */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Powered by advanced machine learning • Real-time satellite data • 
              Global seismic monitoring network • Community reporting system
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

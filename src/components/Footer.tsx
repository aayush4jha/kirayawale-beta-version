import React from 'react';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/WhatsApp Image 2025-06-27 at 12.04.33_bf8c5835.jpg" 
                  alt="KirayaWale Logo - Peer-to-Peer Rental Platform" 
                  className="h-10 w-auto brightness-0 invert"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-2xl font-bold">
                    <span className="text-blue-400">Kiraya</span>
                    <span className="text-orange-400">Wale</span>
                  </h3>
                  <p className="text-orange-400 text-xs font-medium">Peer-to-peer rental platform</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Making peer-to-peer rental simple, safe, and rewarding across India. Connect with your community 
                and discover the power of collaborative consumption for electronics, bikes, furniture, and tools.
              </p>
              <div className="bg-gradient-to-r from-blue-900/50 to-orange-900/50 p-4 rounded-xl border border-blue-800">
                <h4 className="text-sm font-semibold text-gray-200 mb-1">Founded by</h4>
                <p className="text-orange-400 font-bold text-xl mb-1">Aryan Jha</p>
                <p className="text-gray-300 text-xs mb-2">Visionary Entrepreneur & Founder</p>
                <p className="text-orange-600 text-xs font-medium">Building India's sharing economy revolution</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('listings')}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                    aria-label="Browse rental items - electronics, bikes, furniture, tools"
                  >
                    Browse Rental Items
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('form')}
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                    aria-label="List your item for rent on P2P platform"
                  >
                    List Your Item
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                    aria-label="About KirayaWale - Founded by Aryan Jha"
                  >
                    About KirayaWale
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact KirayaWale</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <a href="tel:+916207797744" className="text-gray-300 hover:text-white transition-colors">
                    +91 6207797744
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-orange-400" />
                  <a href="mailto:kirayawale01@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                    kirayawale01@gmail.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Available across India</span>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With the Rental Platform</h4>
              <p className="text-gray-300 mb-4">
                Have questions about renting electronics, bikes, furniture, or tools? Reach out to KirayaWale on WhatsApp!
              </p>
              <a
                href="https://wa.me/916207797744?text=Hello! I'd like to know more about KirayaWale - peer-to-peer rental platform."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2 inline-flex"
                aria-label="Chat with KirayaWale on WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-center md:text-left">
                © 2024 KirayaWale - Peer-to-Peer Rental Platform. All rights reserved.
              </p>
              <p className="text-gray-400 text-center md:text-right mt-4 md:mt-0">
                Built with ❤️ for India's sharing community by Aryan Jha
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
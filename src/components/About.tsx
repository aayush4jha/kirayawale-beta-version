import React from 'react';
import { Shield, Users, Zap, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">KirayaWale</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A peer-to-peer rental platform revolutionizing the sharing economy. 
              Connecting people across India who have items with those who need them. Why buy when you can rent?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Rental Platform</h3>
              <p className="text-gray-600">
                Safe and secure online rental transactions with verified users across India and detailed item descriptions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growing Rental Community</h3>
              <p className="text-gray-600">
                Join India's growing community of sharers and renters who believe in sustainable living and peer-to-peer sharing.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Online Connections</h3>
              <p className="text-gray-600">
                Quick rental connections through WhatsApp integration. Rent electronics, bikes, furniture & tools instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable India</h3>
              <p className="text-gray-600">
                Reduce waste and save money by sharing resources within India's rental community ecosystem.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission: Transforming India's Rental Economy</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  At KirayaWale, we believe that sharing is the future of consumption in India. 
                  Our online rental platform connects neighbors across India, helping them monetize their unused electronics, bikes, 
                  furniture, tools, and cameras while providing affordable access to items people need temporarily.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Whether you're a photographer in Mumbai who needs a camera lens for one shoot, a student in Delhi looking 
                  for furniture rental, or someone in Bangalore with tools gathering dust - KirayaWale is here to make 
                  peer-to-peer sharing simple, safe, and rewarding across India.
                </p>
              </div>
              
              {/* Founder Section */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                  <div className="mb-4">
                    <img 
                      src="/WhatsApp Image 2025-06-20 at 20.48.42_3c5d3e97.jpg" 
                      alt="Aryan Jha - Founder of KirayaWale, peer-to-peer rental platform"
                      className="w-24 h-32 object-cover object-center rounded-xl shadow-md mx-auto border-4 border-white"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200 mb-1">Founded by</h4>
                    <p className="text-blue-600 font-bold text-xl mb-1">Aryan Jha</p>
                    <p className="text-gray-600 text-sm mb-2">Visionary Entrepreneur & Founder</p>
                    <p className="text-orange-600 text-xs font-medium">Building India's sharing economy revolution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
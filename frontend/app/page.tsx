"use client";

import React, { useState, useEffect } from 'react';
import { Video, Users, Zap, Globe, ArrowRight, Play } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Real-Time Video",
      description: "Stream high-quality video instantly with minimal latency"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Powered by WebRTC for the fastest peer-to-peer connections"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Universal Access",
      description: "Works seamlessly across all modern web browsers"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4">
        {/* Hero Section */}
        <div className={`text-center mt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          

          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
            WebRTC Stream
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl">
            Experience the future of real-time video streaming with cutting-edge WebRTC technology. 
            Connect instantly, stream seamlessly.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              className="group relative bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
              onClick={() => window.location.href = '/sender'}
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Streaming
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button 
              className="group relative bg-gray-900 border border-gray-700 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:border-gray-600"
              onClick={() => window.location.href = '/receiver'}
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join Stream
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className={`grid md:grid-cols-3 gap-8 max-w-4xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:border-gray-700 cursor-pointer ${activeCard === index ? 'scale-105 bg-gray-800 border-gray-700' : ''}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="text-white mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        

        {/* Routes Info */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 max-w-md">
            <p className="text-gray-400 text-sm mb-2">Available Routes:</p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-white font-mono">/sender</span>
              <span className="text-gray-600">•</span>
              <span className="text-white font-mono">/receiver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
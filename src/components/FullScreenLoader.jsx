import React from 'react';
import { Shield } from 'lucide-react';

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Glow background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-purple-500 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-pink-500 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center space-y-6 text-center">
        {/* Logo + spinner */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-[6px] border-purple-300/40 border-t-purple-100 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-xl">
            <Shield className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Loading</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            SafeCampus <span className="text-pink-200">KE</span>
          </h1>
          <p className="max-w-md text-sm md:text-base text-purple-100/80">
            Securing your anonymous connection and preparing a safe space to
            share your experience.
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-2 mt-2">
          <span className="h-2 w-2 rounded-full bg-pink-200 animate-bounce [animation-delay:-0.2s]" />
          <span className="h-2 w-2 rounded-full bg-pink-200 animate-bounce [animation-delay:-0.1s]" />
          <span className="h-2 w-2 rounded-full bg-pink-200 animate-bounce" />
        </div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-purple-200/80 mt-4">
          UNiTE to End GBV
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;

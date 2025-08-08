"use client";

import dynamic from 'next/dynamic';

// Dynamically import the main page to prevent server-side rendering issues with PDF.js
const HomePage = dynamic(() => import('./home-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 text-sm">Loading NoirKit...</p>
      </div>
    </div>
  ),
});

export default HomePage;

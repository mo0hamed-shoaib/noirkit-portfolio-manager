"use client";

import { Coffee, Moon, Gamepad2 } from "lucide-react";

export function ServicesFactsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Services & Expertise */}
      <div className="border border-white/20 rounded-xl p-6 bg-black/20 group hover:border-white/30 transition-all duration-300">
        <h3 className="text-2xl font-mono font-bold mb-6 text-white group-hover:text-white/90 transition-colors duration-200">
          Services & Expertise
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200 font-medium">Full-Stack Development</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200 font-medium">UI/UX Design</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200 font-medium">Consulting</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200 font-medium">Branding & Strategy</span>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="border border-white/20 rounded-xl p-6 bg-black/20 group hover:border-white/30 transition-all duration-300">
        <h3 className="text-2xl font-mono font-bold mb-6 text-white group-hover:text-white/90 transition-colors duration-200">
          Fun Facts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <Coffee className="w-5 h-5 text-orange-400 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">Powered by 2+ cups of coffee daily</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <Moon className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">Best code written after 4 AM</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/item">
            <Gamepad2 className="w-5 h-5 text-purple-400 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">Gaming taught me problem-solving</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { Coffee, Moon, Gamepad2 } from "lucide-react";

export function ServicesFactsSection() {
  return (
    <div className="space-y-6">
      {/* Services & Expertise */}
      <div className="space-y-3">
        <h3 className="text-lg font-mono font-semibold mb-4">Services & Expertise</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-400">Full-Stack Development</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-400">UI/UX Design</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-400">Consulting</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-400">Branding & Strategy</span>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="space-y-3">
        <h3 className="text-lg font-mono font-semibold mb-4">Fun Facts</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Coffee className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>Powered by 2+ cups of coffee daily</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Moon className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Best code written after 4 AM</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Gamepad2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>Gaming taught me problem-solving</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
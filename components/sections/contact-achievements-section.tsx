"use client";

import { useState, useEffect } from "react";
import {
  Star,
  GraduationCap,
  Award,
  Mail,
  ArrowRight,
  Clock,
  Calendar,
  MessageSquare,
  ExternalLink,
  Coffee,
  Moon,
  Gamepad2,
  Trophy,
  MessageCircle,
} from "lucide-react";
import type { Achievement } from "@/lib/types";
import { CustomButton } from "@/components/ui/custom-button";

interface ContactAchievementsSectionProps {
  achievements: Achievement[];
  onContactClick: () => void;
}

// Helper to extract the comparable end date from a date string
function getComparableDate(dateStr: string): Date | null {
  // Handles ranges like "Oct 2017 – Jun 2021" or "Oct 2017 - Jun 2021"
  const rangeMatch = dateStr.match(/[–-]/);
  let dateToParse = dateStr;
  if (rangeMatch) {
    // Take the part after the dash (end date)
    dateToParse = dateStr.split(/[–-]/).pop()?.trim() || dateStr;
  }
  // Try to parse the date
  const parsed = Date.parse(dateToParse);
  return isNaN(parsed) ? null : new Date(parsed);
}

export function ContactAchievementsSection({
  achievements,
  onContactClick,
}: ContactAchievementsSectionProps) {
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const maxVisibleAchievements = 2;

  // Auto-switch achievements every 4 seconds with smooth transition
  useEffect(() => {
    if (achievements.length > maxVisibleAchievements) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentAchievementIndex((prev) =>
            prev + maxVisibleAchievements >= achievements.length ? 0 : prev + 1
          );
          setIsTransitioning(false);
        }, 150); // Half of the transition duration
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [achievements.length, maxVisibleAchievements]);

  const visibleAchievements = achievements.slice(
    currentAchievementIndex,
    currentAchievementIndex + maxVisibleAchievements
  );

  // Handle manual navigation with smooth transition
  const handlePageChange = (index: number) => {
    if (index * maxVisibleAchievements !== currentAchievementIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAchievementIndex(index * maxVisibleAchievements);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Find the achievement with the latest end date
  const latestAchievement = achievements
    .map((a) => ({ ...a, _parsedDate: getComparableDate(a.date) }))
    .sort((a, b) => {
      if (!a._parsedDate && !b._parsedDate) return 0;
      if (!a._parsedDate) return 1;
      if (!b._parsedDate) return -1;
      return b._parsedDate.getTime() - a._parsedDate.getTime();
    })[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Section */}
      <section className="border border-white/20 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm group hover:border-white/30 transition-all duration-300 relative overflow-hidden min-h-[400px] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-mono text-white font-bold mb-2">
              Let's Connect
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <MessageCircle className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-gray-400">
                Ready to bring your ideas to life
              </span>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-all duration-300 flex-shrink-0 ml-3">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
          {/* Status & Availability */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="truncate">Available for new challenges</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Response time: Usually within 1 hour</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Available for freelance & full-time</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Open to collaboration & mentorship</span>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              Services & Expertise
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-400 truncate">
                  Full-Stack Development
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-400 truncate">UI/UX Design</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-400 truncate">Consulting</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-400 truncate">
                  Branding & Strategy
                </span>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              Fun Facts
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                <span>Powered by 2+ cups of coffee daily</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span>Best code written after 4 AM</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                <span>Gaming taught me problem-solving</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={onContactClick}
            className="w-full sm:w-auto px-4 sm:px-6 group/button justify-center sm:justify-start transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
          </CustomButton>
        </div>
      </section>

      {/* Achievements/Education Section */}
      <section className="border border-white/20 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm relative overflow-hidden min-h-[400px] flex flex-col group hover:border-white/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-mono text-white font-bold">
              Achievements & Education
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">
                Professional milestones & academic excellence
              </span>
            </div>
          </div>
        </div>

        {achievements.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                No achievements added yet
              </p>
              <p className="text-gray-500 text-xs">
                Your accomplishments will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Achievement Counter & Stats */}
            <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {achievements.length} Achievement
                    {achievements.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {achievements.filter((a) => a.type === "education").length}{" "}
                    Education •{" "}
                    {
                      achievements.filter((a) => a.type === "achievement")
                        .length
                    }{" "}
                    Awards
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Latest</div>
                <div className="text-xs text-gray-400">
                  {latestAchievement ? latestAchievement.date : "N/A"}
                </div>
              </div>
            </div>

            {/* Achievements List - Dynamic Height Container with Smooth Transitions */}
            <div className="flex-1 min-h-0 relative">
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isTransitioning
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <div className="space-y-3">
                  {visibleAchievements.map((achievement, index) => (
                    <div
                      key={`${achievement.id}-${currentAchievementIndex}`}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 group/item"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-white/20 transition-colors">
                        {achievement.type === "education" ? (
                          <GraduationCap className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Award className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm text-white line-clamp-1">
                            {achievement.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">
                          {achievement.description.length > 140
                            ? `${achievement.description.substring(0, 140)}...`
                            : achievement.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
                            {achievement.date}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded border ${
                              achievement.type === "education"
                                ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                                : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                            }`}
                          >
                            {achievement.type === "education"
                              ? "Education"
                              : "Achievement"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Navigation Area - Always 60px height */}
            {achievements.length > maxVisibleAchievements && (
              <div className="h-[60px] flex items-center justify-between mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                <div className="flex justify-center flex-1 gap-1">
                  {Array.from(
                    {
                      length: Math.ceil(
                        achievements.length / maxVisibleAchievements
                      ),
                    },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        title={`Go to page ${index + 1}`}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          Math.floor(
                            currentAchievementIndex / maxVisibleAchievements
                          ) === index
                            ? "bg-white w-4"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      />
                    )
                  )}
                </div>
                <div className="text-xs text-gray-500 ml-4">
                  {currentAchievementIndex + 1}-
                  {Math.min(
                    currentAchievementIndex + maxVisibleAchievements,
                    achievements.length
                  )}{" "}
                  of {achievements.length}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

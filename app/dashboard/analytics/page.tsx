"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Eye,
  Mail,
  Download,
  Share2,
  Filter,
  TrendingUp,
  Users,
  Clock,
  RefreshCw,
} from "lucide-react";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { analytics } from "@/lib/analytics";

interface AnalyticsData {
  events: any[];
  pageViews: any[];
  contactSubmissions: any[];
  sessionId: string;
}

interface AnalyticsSummary {
  totalEvents: number;
  totalPageViews: number;
  totalContactSubmissions: number;
  successfulContacts: number;
  sessionDuration: number;
}

export default function AnalyticsPage() {
  const { showToast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    try {
      setLoading(true);
      const data = analytics.getAnalytics();
      setAnalyticsData(data);

      // Calculate summary
      const summaryData = {
        totalEvents: data.events.length,
        totalPageViews: data.pageViews.length,
        totalContactSubmissions: data.contactSubmissions.length,
        successfulContacts: data.contactSubmissions.filter(
          (s: any) => s.success
        ).length,
        sessionDuration: calculateSessionDuration(data.pageViews),
      };
      setSummary(summaryData);
    } catch (error) {
      showToast("Failed to load analytics data", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateSessionDuration = (pageViews: any[]): number => {
    if (pageViews.length < 2) return 0;

    const sortedViews = pageViews.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const firstView = new Date(sortedViews[0].timestamp);
    const lastView = new Date(sortedViews[sortedViews.length - 1].timestamp);

    return Math.round((lastView.getTime() - firstView.getTime()) / 1000 / 60); // minutes
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case "page_view":
        return <Eye className="w-4 h-4" />;
      case "contact_submission":
        return <Mail className="w-4 h-4" />;
      case "cv_download":
        return <Download className="w-4 h-4" />;
      case "social_link_click":
        return <Share2 className="w-4 h-4" />;
      case "project_view":
        return <BarChart3 className="w-4 h-4" />;
      case "filter_usage":
        return <Filter className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
              Analytics
            </h1>
            <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
              Loading analytics data...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            Analytics
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Track your portfolio performance and visitor interactions
          </p>
        </div>
        <DashboardButton onClick={loadAnalytics}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </DashboardButton>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white font-mono tracking-wide flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {summary.totalPageViews}
              </p>
              <p className="text-gray-400 text-sm font-mono">Total views</p>
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white font-mono tracking-wide flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {summary.totalEvents}
              </p>
              <p className="text-gray-400 text-sm font-mono">Total events</p>
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white font-mono tracking-wide flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {summary.totalContactSubmissions}
              </p>
              <p className="text-gray-400 text-sm font-mono">
                {summary.successfulContacts} successful
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white font-mono tracking-wide flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Session Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {summary.sessionDuration}
              </p>
              <p className="text-gray-400 text-sm font-mono">minutes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Events */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-mono tracking-wide">
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.events
                  .slice(-10)
                  .reverse()
                  .map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.event)}
                        <div>
                          <p className="text-white font-mono text-sm">
                            {event.event
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                      </div>
                      {event.data && (
                        <Badge
                          variant="outline"
                          className="bg-white/10 text-white border-white/20 font-mono"
                        >
                          {Object.keys(event.data).length} data
                        </Badge>
                      )}
                    </div>
                  ))}
                {analyticsData.events.length === 0 && (
                  <p className="text-gray-400 text-center py-8 font-mono">
                    No events recorded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-mono tracking-wide">
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.pageViews
                  .slice(-10)
                  .reverse()
                  .map((view, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-white font-mono text-sm">
                            {view.page}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {formatDate(view.timestamp)}
                          </p>
                        </div>
                      </div>
                      {view.referrer && (
                        <Badge
                          variant="outline"
                          className="bg-white/10 text-white border-white/20 font-mono text-xs"
                        >
                          Referrer
                        </Badge>
                      )}
                    </div>
                  ))}
                {analyticsData.pageViews.length === 0 && (
                  <p className="text-gray-400 text-center py-8 font-mono">
                    No page views recorded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Submissions */}
      {analyticsData && analyticsData.contactSubmissions.length > 0 && (
        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-mono tracking-wide">
              Contact Form Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.contactSubmissions
                .slice(-10)
                .reverse()
                .map((submission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-white font-mono text-sm">
                          {submission.formType}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatDate(submission.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-mono ${
                        submission.success
                          ? "bg-green-500/10 text-green-400 border-green-400/20"
                          : "bg-red-500/10 text-red-400 border-red-400/20"
                      }`}
                    >
                      {submission.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Info */}
      {analyticsData && (
        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-mono tracking-wide">
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm font-mono">Session ID</p>
                <p className="text-white font-mono text-sm break-all">
                  {analyticsData.sessionId}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-mono">Data Points</p>
                <p className="text-white font-mono text-sm">
                  {analyticsData.events.length +
                    analyticsData.pageViews.length +
                    analyticsData.contactSubmissions.length}{" "}
                  total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

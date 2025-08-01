// Basic analytics implementation for portfolio tracking
export interface AnalyticsEvent {
  event: string
  timestamp: string
  userId?: string
  sessionId: string
  data?: Record<string, any>
}

export interface PageView {
  page: string
  timestamp: string
  sessionId: string
  referrer?: string
  userAgent?: string
}

export interface ContactSubmission {
  timestamp: string
  sessionId: string
  formType: string
  success: boolean
  errorMessage?: string
}

class Analytics {
  private sessionId: string
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []
  private contactSubmissions: ContactSubmission[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeAnalytics()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private initializeAnalytics(): void {
    // Track page views
    this.trackPageView(window.location.pathname)
    
    // Track navigation
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname)
    })

    // Track contact form submissions
    this.trackContactSubmission('portfolio_contact', true)
  }

  trackEvent(event: string, data?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      data
    }

    this.events.push(analyticsEvent)
    this.saveToStorage()
    
    // Send to analytics endpoint if available
    this.sendToServer(analyticsEvent)
  }

  trackPageView(page: string): void {
    const pageView: PageView = {
      page,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    }

    this.pageViews.push(pageView)
    this.saveToStorage()
    
    // Send to analytics endpoint if available
    this.sendToServer({ event: 'page_view', ...pageView })
  }

  trackContactSubmission(formType: string, success: boolean, errorMessage?: string): void {
    const submission: ContactSubmission = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      formType,
      success,
      errorMessage
    }

    this.contactSubmissions.push(submission)
    this.saveToStorage()
    
    // Send to analytics endpoint if available
    this.sendToServer({ event: 'contact_submission', ...submission })
  }

  trackProjectView(projectId: string, projectName: string): void {
    this.trackEvent('project_view', {
      projectId,
      projectName
    })
  }

  trackCVDownload(): void {
    this.trackEvent('cv_download')
  }

  trackSocialLinkClick(platform: string, url: string): void {
    this.trackEvent('social_link_click', {
      platform,
      url
    })
  }

  trackFilterUsage(filterType: string, value: string): void {
    this.trackEvent('filter_usage', {
      filterType,
      value
    })
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('noirkit_analytics', JSON.stringify({
        events: this.events.slice(-100), // Keep last 100 events
        pageViews: this.pageViews.slice(-50), // Keep last 50 page views
        contactSubmissions: this.contactSubmissions.slice(-20) // Keep last 20 submissions
      }))
    } catch (error) {
      console.warn('Failed to save analytics to localStorage:', error)
    }
  }

  private async sendToServer(data: any): Promise<void> {
    try {
      // Only send if analytics endpoint is configured
      const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
      if (!analyticsEndpoint) return

      await fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.warn('Failed to send analytics to server:', error)
    }
  }

  getAnalytics(): {
    events: AnalyticsEvent[]
    pageViews: PageView[]
    contactSubmissions: ContactSubmission[]
    sessionId: string
  } {
    return {
      events: this.events,
      pageViews: this.pageViews,
      contactSubmissions: this.contactSubmissions,
      sessionId: this.sessionId
    }
  }

  getSummary(): {
    totalEvents: number
    totalPageViews: number
    totalContactSubmissions: number
    successfulContacts: number
    sessionDuration: number
  } {
    const now = new Date()
    const sessionStart = new Date(this.events[0]?.timestamp || now)
    const sessionDuration = now.getTime() - sessionStart.getTime()

    return {
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      totalContactSubmissions: this.contactSubmissions.length,
      successfulContacts: this.contactSubmissions.filter(s => s.success).length,
      sessionDuration
    }
  }

  exportData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      analytics: this.getAnalytics(),
      summary: this.getSummary()
    }, null, 2)
  }
}

// Create singleton instance
export const analytics = new Analytics()

// Export convenience functions
export const trackEvent = (event: string, data?: Record<string, any>) => analytics.trackEvent(event, data)
export const trackPageView = (page: string) => analytics.trackPageView(page)
export const trackContactSubmission = (formType: string, success: boolean, errorMessage?: string) => 
  analytics.trackContactSubmission(formType, success, errorMessage)
export const trackProjectView = (projectId: string, projectName: string) => 
  analytics.trackProjectView(projectId, projectName)
export const trackCVDownload = () => analytics.trackCVDownload()
export const trackSocialLinkClick = (platform: string, url: string) => 
  analytics.trackSocialLinkClick(platform, url)
export const trackFilterUsage = (filterType: string, value: string) => 
  analytics.trackFilterUsage(filterType, value) 
export function generatePageTitle(title: string, options?: {
  prefix?: string
  suffix?: string
  separator?: string
}) {
  const { prefix = '', suffix = '', separator = ' - ' } = options || {}
  const parts = [prefix, title, suffix].filter(Boolean)
  return parts.join(separator)
}

export function getDashboardTitle(pageName: string) {
  return generatePageTitle(pageName, { prefix: 'Dashboard' })
}

export function getPortfolioTitle(name?: string, jobTitle?: string) {
  if (name && jobTitle) {
    return generatePageTitle(name, { suffix: jobTitle })
  }
  if (name) {
    return generatePageTitle(name, { suffix: 'Portfolio' })
  }
  return 'Portfolio'
} 
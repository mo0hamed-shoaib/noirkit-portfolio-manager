import { useEffect } from 'react'
import { generatePageTitle } from '@/lib/utils/title'

interface UsePageTitleOptions {
  title: string
  prefix?: string
  suffix?: string
}

export function usePageTitle({ title, prefix = '', suffix = '' }: UsePageTitleOptions) {
  useEffect(() => {
    const fullTitle = generatePageTitle(title, { prefix, suffix })
    document.title = fullTitle

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Portfolio Dashboard'
    }
  }, [title, prefix, suffix])
} 
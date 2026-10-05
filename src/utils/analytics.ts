export type AnalyticsEvent =
  | 'whatsapp_click'
  | 'phone_click'
  | 'directions_click'
  | 'daily_catering_enquiry'
  | 'event_catering_enquiry'
  | 'product_enquiry'
  | 'language_change'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function initializeAnalytics(measurementId: string | undefined) {
  if (!measurementId) {
    return
  }

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    console.error('Google Analytics is disabled: VITE_GA_MEASUREMENT_ID is invalid.')
    return
  }

  if (document.getElementById('google-analytics-script')) {
    return
  }

  window.dataLayer ??= []
  const gtag = function (..._args: unknown[]) {
    window.dataLayer?.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId, { anonymize_ip: true, send_page_view: true })

  const script = document.createElement('script')
  script.id = 'google-analytics-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.onerror = () => {
    console.error('Google Analytics failed to load its tracking script.')
  }
  document.head.append(script)
}

export function trackEvent(event: AnalyticsEvent) {
  window.gtag?.('event', event)
}

export type MenuLanguage = 'en' | 'kn'

export const todayInIndia = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export const upcomingMenuDates = (startDate = todayInIndia(), count = 7) => {
  const start = new Date(`${startDate}T12:00:00Z`)
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + index)
    return date.toISOString().slice(0, 10)
  })
}

export const formatMenuDate = (date: string, language: MenuLanguage) =>
  new Intl.DateTimeFormat(language === 'kn' ? 'kn-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${date}T12:00:00Z`))

export const formatMenuTab = (date: string, language: MenuLanguage) => {
  const formatted = new Intl.DateTimeFormat(language === 'kn' ? 'kn-IN' : 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).formatToParts(new Date(`${date}T12:00:00Z`))
  return {
    day: formatted.find((part) => part.type === 'weekday')?.value ?? '',
    date: formatted.filter((part) => part.type === 'day' || part.type === 'month').map((part) => part.value).join(' '),
  }
}

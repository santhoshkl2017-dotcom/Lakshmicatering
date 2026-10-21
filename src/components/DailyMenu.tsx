import { useEffect, useMemo, useState } from 'react'
import { business } from '../data/business'
import { formatMenuDate, formatMenuTab, todayInIndia, upcomingMenuDates } from '../utils/menuDates'
import { trackEvent } from '../utils/analytics'
import { supabase, supabaseIsConfigured } from '../lib/supabase'

export type Language = 'en' | 'kn'

type MenuItem = {
  id: string
  menu_date: string
  name: string
  category: string | null
  name_en: string | null
  name_kn: string | null
  category_en: string | null
  category_kn: string | null
  price: number | null
  image_url: string | null
}

const copy = {
  en: {
    eyebrow: 'WEEKLY MENU',
    heading: 'Fresh meals planned for the week.',
    description: 'Choose a day, see the available breakfast, lunch and dinner options, and order directly on WhatsApp.',
    loading: 'Loading this week\'s menu...',
    emptyDay: 'No menu published for this day yet.',
    emptyDaySecondary: 'Please check another day or contact us on WhatsApp.',
    emptyWeek: "This week's menu will be updated soon.",
    error: "Unable to load this week's menu right now.",
    errorSecondary: 'Please contact us on WhatsApp.',
    contact: 'Contact on WhatsApp',
    available: 'Available today',
    order: 'Order this item',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    other: 'Other',
    placeholder: 'Freshly prepared with care',
  },
  kn: {
    eyebrow: '\u0cb5\u0cbe\u0cb0\u0ca6 \u0cae\u0cc6\u0ca8\u0cc1',
    heading: '\u0c88 \u0cb5\u0cbe\u0cb0\u0ca6 \u0ca4\u0cbe\u0c9c\u0cbe \u0cae\u0ca8\u0cc6\u0caf\u0cc2\u0c9f.',
    description: '\u0ca6\u0cbf\u0ca8\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0c86\u0caf\u0ccd\u0c95\u0cc6 \u0cae\u0cbe\u0ca1\u0cbf, \u0cb2\u0cad\u0ccd\u0caf\u0cb5\u0cbf\u0cb0\u0cc1\u0cb5 \u0c89\u0caa\u0cbe\u0cb9\u0cbe\u0cb0, \u0cae\u0ca7\u0ccd\u0caf\u0cbe\u0cb9\u0ccd\u0ca8\u0ca6 \u0c8a\u0c9f \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb0\u0cbe\u0ca4\u0ccd\u0cb0\u0cbf \u0c8a\u0c9f\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0ca8\u0ccb\u0ca1\u0cbf \u0cb9\u0cbe\u0c97\u0cc2 \u0cb5\u0cbe\u0c9f\u0ccd\u0cb8\u0cbe\u0caa\u0ccd \u0cae\u0cc2\u0cb2\u0c95 \u0c86\u0cb0\u0ccd\u0ca1\u0cb0\u0ccd \u0cae\u0cbe\u0ca1\u0cbf.',
    loading: '\u0c88 \u0cb5\u0cbe\u0cb0\u0ca6 \u0cae\u0cc6\u0ca8\u0cc1 \u0cb2\u0ccb\u0ca1\u0ccd \u0c86\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0cbf\u0ca6\u0cc6...',
    emptyDay: '\u0c88 \u0ca6\u0cbf\u0ca8\u0ca6 \u0cae\u0cc6\u0ca8\u0cc1 \u0c87\u0ca8\u0ccd\u0ca8\u0cc2 \u0caa\u0ccd\u0cb0\u0c95\u0c9f\u0cbf\u0cb8\u0cb2\u0cbe\u0c97\u0cbf\u0cb2\u0ccd\u0cb2.',
    emptyDaySecondary: '\u0cac\u0cc7\u0cb0\u0cc6 \u0ca6\u0cbf\u0ca8\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0ca8\u0ccb\u0ca1\u0cbf \u0c85\u0ca5\u0cb5\u0cbe \u0cb5\u0cbe\u0c9f\u0ccd\u0cb8\u0cbe\u0caa\u0ccd \u0cae\u0cc2\u0cb2\u0c95 \u0cb8\u0c82\u0caa\u0cb0\u0ccd\u0c95\u0cbf\u0cb8\u0cbf.',
    emptyWeek: '\u0c88 \u0cb5\u0cbe\u0cb0\u0ca6 \u0cae\u0cc6\u0ca8\u0cc1 \u0cb6\u0cc0\u0c98\u0ccd\u0cb0\u0ca6\u0cb2\u0ccd\u0cb2\u0cc7 \u0ca8\u0cb5\u0cc0\u0c95\u0cb0\u0cbf\u0cb8\u0cb2\u0cbe\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0ca6\u0cc6.',
    error: '\u0c88\u0cbf \u0cb5\u0cbe\u0cb0\u0ca6 \u0cae\u0cc6\u0ca8\u0cc1\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb2\u0ccb\u0ca1\u0ccd \u0cae\u0cbe\u0ca1\u0cb2\u0cc1 \u0cb8\u0cbe\u0ca7\u0ccd\u0caf\u0cb5\u0cbe\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0cbf\u0cb2\u0ccd\u0cb2.',
    errorSecondary: '\u0ca6\u0caf\u0cb5\u0cbf\u0c9f\u0ccd\u0c9f\u0cc1 \u0cb5\u0cbe\u0c9f\u0ccd\u0cb8\u0cbe\u0caa\u0ccd \u0cae\u0cc2\u0cb2\u0c95 \u0cb8\u0c82\u0caa\u0cb0\u0ccd\u0c95\u0cbf\u0cb8\u0cbf.',
    contact: '\u0cb5\u0cbe\u0c9f\u0ccd\u0cb8\u0cbe\u0caa\u0ccd \u0cae\u0cc2\u0cb2\u0c95 \u0cb8\u0c82\u0caa\u0cb0\u0ccd\u0c95\u0cbf\u0cb8\u0cbf',
    available: '\u0c87\u0c82\u0ca6\u0cc1 \u0cb2\u0cad\u0ccd\u0caf',
    order: '\u0c88 \u0ca4\u0cbf\u0ca8\u0cbf\u0cb8\u0ca8\u0ccd\u0ca8\u0cc1 \u0c86\u0cb0\u0ccd\u0ca1\u0cb0\u0ccd \u0cae\u0cbe\u0ca1\u0cbf',
    breakfast: '\u0c89\u0caa\u0cbe\u0cb9\u0cbe\u0cb0',
    lunch: '\u0cae\u0ca7\u0ccd\u0caf\u0cbe\u0cb9\u0ccd\u0ca8\u0ca6 \u0c8a\u0c9f',
    dinner: '\u0cb0\u0cbe\u0ca4\u0ccd\u0cb0\u0cbf \u0c8a\u0c9f',
    other: '\u0c87\u0ca4\u0cb0\u0cc6',
    placeholder: '\u0caa\u0ccd\u0cb0\u0cc0\u0ca4\u0cbf\u0caf\u0cbf\u0c82\u0ca6 \u0ca4\u0caf\u0cbe\u0cb0\u0cbf\u0cb8\u0cbf\u0ca6\u0cc1',
  },
} as const

const getGroup = (category: string | null) => {
  const normalized = category?.trim().toLowerCase()
  if (normalized === 'breakfast') return 'breakfast'
  if (normalized === 'lunch') return 'lunch'
  if (normalized === 'dinner') return 'dinner'
  return 'other'
}

export function DailyMenu({ language }: { language: Language }) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(supabaseIsConfigured)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(todayInIndia())
  const t = copy[language]
  const weekDates = useMemo(() => upcomingMenuDates(), [])

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('daily_menu_items')
      .select('id, menu_date, name, category, name_en, name_kn, category_en, category_kn, price, image_url, is_available, sort_order')
      .gte('menu_date', weekDates[0])
      .lte('menu_date', weekDates[6])
      .eq('is_available', true)
      .order('menu_date')
      .order('sort_order')
      .then(({ data, error: queryError }) => {
        const nextItems = data ?? []
        const availableDates = [...new Set(nextItems.map((item) => item.menu_date))]
        setItems(nextItems)
        setError(queryError?.message ?? '')
        if (!queryError) {
          // oxlint-disable-next-line react-hooks/set-state-in-effect
          setSelectedDate(availableDates.includes(todayInIndia()) ? todayInIndia() : availableDates[0] ?? weekDates[0])
        }
        setLoading(false)
      })
  }, [weekDates])

  const selectedItems = items.filter((item) => item.menu_date === selectedDate)
  const groups = ['breakfast', 'lunch', 'dinner', 'other'].map((key) => ({
    key,
    label: t[key as keyof typeof t] as string,
    items: selectedItems.filter((item) => getGroup(item.category_en ?? item.category) === key),
  })).filter((group) => group.items.length > 0)
  const contactUrl = `https://wa.me/${business.whatsapp}`
  const orderUrl = (item: MenuItem, groupKey: string) => {
    const name = language === 'kn' ? item.name_kn ?? item.name_en ?? item.name : item.name_en ?? item.name
    const category = language === 'kn' ? item.category_kn ?? item.category_en ?? item.category ?? groupKey : item.category_en ?? item.category ?? groupKey
    const price = item.price === null ? '' : `₹${item.price}`
    const message = language === 'kn'
      ? `\u0ca8\u0cae\u0cb8\u0ccd\u0c95\u0cbe\u0cb0 \u0cb2\u0c95\u0ccd\u0cb7\u0ccd\u0cae\u0cbf \u0c95\u0ccd\u0caf\u0cbe\u0c9f\u0cb0\u0cbf\u0c82\u0c97\u0ccd \u0cb8\u0cb0\u0ccd\u0cb5\u0cc0\u0cb8\u0cb8\u0ccd 🙏\n\n\u0cb5\u0cbe\u0cb0\u0ca6 \u0cae\u0cc6\u0ca8\u0cc1\u0cb5\u0cbf\u0ca8\u0cbf\u0c82\u0ca6 \u0c86\u0cb0\u0ccd\u0ca1\u0cb0\u0ccd \u0cae\u0cbe\u0ca1\u0cb2\u0cc1 \u0cac\u0caf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0cc7\u0ca8\u0cc6.\n\n\u0ca6\u0cbf\u0ca8\u0cbe\u0c82\u0c95: ${formatMenuDate(selectedDate, language)}\n\u0c8a\u0c9f: ${category}\n\u0ca4\u0cbf\u0ca8\u0cbf\u0cb8\u0cc1: ${name}\n\u0cac\u0cc6\u0cb2\u0cc6: ${price}\n\n\u0caa\u0ccd\u0cb0\u0cae\u0cbe\u0ca3 / \u0caa\u0ccd\u0cb2\u0cc7\u0c9f\u0ccd\u200c\u0c97\u0cb3 \u0cb8\u0c82\u0c96\u0ccd\u0caf\u0cc6:\n\u0ca1\u0cc6\u0cb2\u0cbf\u0cb5\u0cb0\u0cbf / \u0caa\u0cbf\u0c95\u0caa\u0ccd:\n\u0cb8\u0ccd\u0ca5\u0cb3:\n\n\u0cb2\u0cad\u0ccd\u0caf\u0ca4\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c92\u0c9f\u0ccd\u0c9f\u0cc1 \u0cae\u0cca\u0ca4\u0ccd\u0ca4\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0ca6\u0cc3\u0ca2\u0caa\u0ca1\u0cbf\u0cb8\u0cbf.`
      : `Namaste Lakshmi Catering Services 🙏\n\nI would like to order from your weekly menu.\n\nDate: ${formatMenuDate(selectedDate, language)}\nMeal: ${category}\nDish: ${name}\nPrice: ${price}\n\nQuantity / Number of plates:\nDelivery / Pickup:\nLocation:\n\nPlease confirm availability and total amount.`
    return `${contactUrl}?text=${encodeURIComponent(message)}`
  }

  return (
    <section className="today-menu-section section-wrap" id="today-menu">
      <div className="section-heading"><div><div className="section-kicker"><span>04</span>{t.eyebrow}</div><h2>{t.heading}</h2></div><p>{t.description}</p></div>
      {loading && <p className="menu-status">{t.loading}</p>}
      {!loading && error && <div className="menu-status"><p>{t.error}</p><p>{t.errorSecondary}</p><a className="button" href={contactUrl} target="_blank" rel="noreferrer">{t.contact}</a></div>}
      {!loading && !error && <div className="menu-date-tabs" aria-label={language === 'kn' ? t.eyebrow : 'Choose a menu date'}>{weekDates.map((date) => { const tab = formatMenuTab(date, language); return <button className={date === selectedDate ? 'active' : ''} type="button" key={date} onClick={() => setSelectedDate(date)} aria-pressed={date === selectedDate}><span>{tab.day}</span><strong>{tab.date}</strong></button> })}</div>}
      {!loading && !error && items.length === 0 && <p className="menu-status">{t.emptyWeek}</p>}
      {!loading && !error && items.length > 0 && selectedItems.length === 0 && <div className="menu-status"><p>{t.emptyDay}</p><p>{t.emptyDaySecondary}</p><a className="button" href={contactUrl} target="_blank" rel="noreferrer">{t.contact}</a></div>}
      {!loading && !error && groups.length > 0 && <div className="today-menu-groups">{groups.map((group) => <section className="today-menu-group" key={group.key} aria-labelledby={`menu-group-${group.key}`}><div className="today-menu-group-heading" id={`menu-group-${group.key}`}><span>{group.label}</span><span className="today-menu-group-line" /></div><div className="today-menu-grid">{group.items.map((item) => { const name = language === 'kn' ? item.name_kn ?? item.name_en ?? item.name : item.name_en ?? item.name; const category = language === 'kn' ? item.category_kn ?? item.category_en ?? item.category : item.category_en ?? item.category; return <article className="today-menu-card" key={item.id}>{item.image_url ? <img src={item.image_url} alt={name} loading="lazy" /> : <div className="today-menu-placeholder" aria-hidden="true"><span>✦</span><small>{t.placeholder}</small></div>}<div><div className="today-menu-card-meta"><span>{category ?? group.label}</span><em>{t.available}</em></div><h3>{name}</h3>{item.price !== null && <strong>&#x20b9;{item.price}</strong>}<a className="button today-menu-order" href={orderUrl(item, group.label)} target="_blank" rel="noreferrer" onClick={() => trackEvent('today_menu_order', { menu_date: selectedDate, meal_type: group.key, dish_name: name })}>{t.order}<span aria-hidden="true">→</span></a></div></article> })}</div></section>)}</div>}
    </section>
  )
}

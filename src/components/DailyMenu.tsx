import { useEffect, useState } from 'react'
import { business } from '../data/business'
import { trackEvent } from '../utils/analytics'
import { supabase, supabaseIsConfigured } from '../lib/supabase'

export type Language = 'en' | 'kn'

type MenuItem = {
  id: string
  name: string
  category: string | null
  name_en: string | null
  name_kn: string | null
  category_en: string | null
  category_kn: string | null
  price: number | null
  image_url: string | null
}

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
const formatDate = (date: string, language: Language) => new Intl.DateTimeFormat(language === 'kn' ? 'kn-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(`${date}T00:00:00+05:30`))

const copy = {
  en: {
    eyebrow: "TODAY'S MENU",
    heading: 'Freshly made for today.',
    description: 'Check today\'s homemade vegetarian dishes and order on WhatsApp while they are available.',
    loading: "Loading today's menu...",
    empty: "Today's menu will be updated soon.",
    emptySecondary: "Please contact us on WhatsApp for today's available dishes.",
    error: "Unable to load today's menu right now.",
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
    eyebrow: '\u0c87\u0c82\u0ca6\u0cbf\u0ca8 \u0cae\u0cc6\u0ca8\u0cc1',
    heading: '\u0c87\u0c82\u0ca6\u0cc7 \u0ca4\u0cbe\u0c9c\u0cbe\u0c97\u0cbf \u0ca4\u0caf\u0cbe\u0cb0\u0cbf\u0cb8\u0cbf\u0ca6 \u0c86\u0cb9\u0cbe\u0cb0.',
    description: '\u0c87\u0c82\u0ca6\u0cc1 \u0cb2\u0cad\u0ccd\u0caf\u0cb5\u0cbf\u0cb0\u0cc1\u0cb5 \u0cae\u0ca8\u0cc6\u0caf \u0cb8\u0cb8\u0ccd\u0caf\u0cbe\u0cb9\u0cbe\u0cb0\u0cbf \u0ca4\u0cbf\u0ca8\u0cbf\u0cb8\u0cc1\u0c97\u0cb3\u0ca8\u0ccd\u0ca8\u0cc1 \u0ca8\u0ccb\u0ca1\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb5\u0cbe\u0c9f\u0ccd\u0cb8\u0cbe\u0caa\u0ccd \u0cae\u0cc2\u0cb2\u0c95 \u0c86\u0cb0\u0ccd\u0ca1\u0cb0\u0ccd \u0cae\u0cbe\u0ca1\u0cbf.',
    loading: '\u0c87\u0c82\u0ca6\u0cbf\u0ca8 \u0cae\u0cc6\u0ca8\u0cc1 \u0cb2\u0ccb\u0ca1\u0ccd \u0c86\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0cbf\u0ca6\u0cc6...',
    empty: '\u0c87\u0c82\u0ca6\u0cbf\u0ca8 \u0cae\u0cc6\u0ca8\u0cc1 \u0cb6\u0cc0\u0c98\u0ccd\u0cb0\u0ca6\u0cb2\u0ccd\u0cb2\u0cc7 \u0ca8\u0cb5\u0cc0\u0c95\u0cb0\u0cbf\u0cb8\u0cb2\u0cbe\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0ca6\u0cc6.',
    emptySecondary: '\u0c87\u0c82\u0ca6\u0cc1 \u0cb2\u0cad\u0ccd\u0caf\u0cb5\u0cbf\u0cb0\u0cc1\u0cb5 \u0ca4\u0cbf\u0ca8\u0cbf\u0cb8\u0cc1\u0c97\u0cb3\u0cbf\u0c97\u0cbe\u0c97\u0cbf \u0cb5\u0cbe\u0c9f\u0ccd\u0cb8\u0cbe\u0caa\u0ccd \u0cae\u0cc2\u0cb2\u0c95 \u0cb8\u0c82\u0caa\u0cb0\u0ccd\u0c95\u0cbf\u0cb8\u0cbf.',
    error: '\u0c88\u0c97 \u0c87\u0c82\u0ca6\u0cbf\u0ca8 \u0cae\u0cc6\u0ca8\u0cc1\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb2\u0ccb\u0ca1\u0ccd \u0cae\u0cbe\u0ca1\u0cb2\u0cc1 \u0cb8\u0cbe\u0ca7\u0ccd\u0caf\u0cb5\u0cbe\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0cbf\u0cb2\u0ccd\u0cb2.',
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
  const t = copy[language]
  const menuDate = today()

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('daily_menu_items')
      .select('id, name, category, name_en, name_kn, category_en, category_kn, price, image_url')
      .eq('menu_date', menuDate)
      .eq('is_available', true)
      .order('sort_order')
      .then(({ data, error: queryError }) => {
        setItems(data ?? [])
        setError(queryError?.message ?? '')
        setLoading(false)
      })
  }, [menuDate])

  const groups = ['breakfast', 'lunch', 'dinner', 'other'].map((key) => ({
    key,
    label: t[key as keyof typeof t] as string,
    items: items.filter((item) => getGroup(item.category_en ?? item.category) === key),
  })).filter((group) => group.items.length > 0)

  const contactUrl = `https://wa.me/${business.whatsapp}`
  const orderUrl = (item: MenuItem, groupKey: string) => {
    const name = language === 'kn' ? item.name_kn ?? item.name_en ?? item.name : item.name_en ?? item.name
    const category = language === 'kn' ? item.category_kn ?? item.category_en ?? item.category ?? groupKey : item.category_en ?? item.category ?? groupKey
    const price = item.price === null ? '' : `₹${item.price}`
    const message = language === 'kn'
      ? `\u0ca8\u0cae\u0cb8\u0ccd\u0c95\u0cbe\u0cb0 \u0cb2\u0c95\u0ccd\u0cb7\u0ccd\u0cae\u0cbf \u0c95\u0ccd\u0caf\u0cbe\u0c9f\u0cb0\u0cbf\u0c82\u0c97\u0ccd \u0cb8\u0cb0\u0ccd\u0cb5\u0cc0\u0cb8\u0cb8\u0ccd 🙏\n\n\u0c87\u0c82\u0ca6\u0cbf\u0ca8 \u0cae\u0cc6\u0ca8\u0cc1\u0cb5\u0cbf\u0ca8\u0cbf\u0c82\u0ca6 \u0c86\u0cb0\u0ccd\u0ca1\u0cb0\u0ccd \u0cae\u0cbe\u0ca1\u0cb2\u0cc1 \u0cac\u0caf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0cc7\u0ca8\u0cc6.\n\n\u0c8a\u0c9f: ${category}\n\u0ca4\u0cbf\u0ca8\u0cbf\u0cb8\u0cc1: ${name}\n\u0cac\u0cc6\u0cb2\u0cc6: ${price}\n\u0ca6\u0cbf\u0ca8\u0cbe\u0c82\u0c95: ${formatDate(menuDate, language)}\n\n\u0caa\u0ccd\u0cb0\u0cae\u0cbe\u0ca3 / \u0caa\u0ccd\u0cb2\u0cc7\u0c9f\u0ccd\u200c\u0c97\u0cb3 \u0cb8\u0c82\u0c96\u0ccd\u0caf\u0cc6:\n\u0ca1\u0cc6\u0cb2\u0cbf\u0cb5\u0cb0\u0cbf / \u0caa\u0cbf\u0c95\u0caa\u0ccd:\n\u0cb8\u0ccd\u0ca5\u0cb3:\n\n\u0cb2\u0cad\u0ccd\u0caf\u0ca4\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c92\u0c9f\u0ccd\u0c9f\u0cc1 \u0cae\u0cca\u0ca4\u0ccd\u0ca4\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0ca6\u0cc3\u0ca2\u0caa\u0ca1\u0cbf\u0cb8\u0cbf.`
      : `Namaste Lakshmi Catering Services 🙏\n\nI would like to order from today's menu.\n\nMeal: ${category}\nDish: ${name}\nPrice: ${price}\nDate: ${formatDate(menuDate, language)}\n\nQuantity / Number of plates:\nDelivery / Pickup:\nLocation:\n\nPlease confirm availability and total amount.`
    return `${contactUrl}?text=${encodeURIComponent(message)}`
  }

  return (
    <section className="today-menu-section section-wrap" id="today-menu">
      <div className="section-heading">
        <div><div className="section-kicker"><span>04</span>{t.eyebrow}</div><h2>{t.heading}</h2></div>
        <p>{t.description}</p>
      </div>
      {loading && <p className="menu-status">{t.loading}</p>}
      {!loading && error && <div className="menu-status"><p>{t.error}</p><p>{t.errorSecondary}</p><a className="button" href={contactUrl} target="_blank" rel="noreferrer">{t.contact}</a></div>}
      {!loading && !error && items.length === 0 && <div className="menu-status"><p>{t.empty}</p><p>{t.emptySecondary}</p><a className="button" href={contactUrl} target="_blank" rel="noreferrer">{t.contact}</a></div>}
      {!loading && !error && groups.length > 0 && <div className="today-menu-groups">{groups.map((group) => <section className="today-menu-group" key={group.key} aria-labelledby={`menu-group-${group.key}`}><div className="today-menu-group-heading" id={`menu-group-${group.key}`}><span>{group.label}</span><span className="today-menu-group-line" /></div><div className="today-menu-grid">{group.items.map((item) => {
        const name = language === 'kn' ? item.name_kn ?? item.name_en ?? item.name : item.name_en ?? item.name
        const category = language === 'kn' ? item.category_kn ?? item.category_en ?? item.category : item.category_en ?? item.category
        return <article className="today-menu-card" key={item.id}>
          {item.image_url ? <img src={item.image_url} alt={name} loading="lazy" /> : <div className="today-menu-placeholder" aria-hidden="true"><span>✦</span><small>{t.placeholder}</small></div>}
          <div><div className="today-menu-card-meta"><span>{category ?? group.label}</span><em>{t.available}</em></div><h3>{name}</h3>{item.price !== null && <strong>&#x20b9;{item.price}</strong>}<a className="button today-menu-order" href={orderUrl(item, group.label)} target="_blank" rel="noreferrer" onClick={() => trackEvent('today_menu_order', { meal_type: group.key, dish_name: name })}>{t.order}<span aria-hidden="true">→</span></a></div>
        </article>
      })}</div></section>)}</div>}
    </section>
  )
}

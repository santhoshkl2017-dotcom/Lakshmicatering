import { useEffect, useState } from 'react'
import { supabase, supabaseIsConfigured } from '../lib/supabase'

type MenuItem = {
  id: string
  name: string
  category: string | null
  price: number | null
  image_url: string | null
}

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export function DailyMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(supabaseIsConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('daily_menu_items')
      .select('id, name, category, price, image_url')
      .eq('menu_date', today())
      .eq('is_available', true)
      .order('sort_order')
      .then(({ data, error: queryError }) => {
        setItems(data ?? [])
        setError(queryError?.message ?? '')
        setLoading(false)
      })
  }, [])

  return (
    <section className="today-menu-section section-wrap" id="today-menu">
      <div className="section-heading">
        <div>
          <div className="section-kicker"><span>04</span>TODAY'S MENU</div>
          <h2>Freshly made for today.</h2>
        </div>
        <p>Check today’s homemade vegetarian dishes and order on WhatsApp while they are available.</p>
      </div>
      {loading && <p className="menu-status">Loading today’s menu…</p>}
      {!loading && error && <p className="menu-status">Today&rsquo;s menu is temporarily unavailable. Please contact us for availability.</p>}
      {!loading && !error && items.length === 0 && (
        <p className="menu-status">Today’s menu will be updated soon. Please contact us for availability.</p>
      )}
      {items.length > 0 && (
        <div className="today-menu-grid">
          {items.map((item) => (
            <article className="today-menu-card" key={item.id}>
              {item.image_url && <img src={item.image_url} alt={item.name} loading="lazy" />}
              <div>
                {item.category && <span>{item.category}</span>}
                <h3>{item.name}</h3>
                {item.price !== null && <strong>₹{item.price}</strong>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

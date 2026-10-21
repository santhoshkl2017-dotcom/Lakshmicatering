import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, supabaseIsConfigured } from '../lib/supabase'

type Item = { id: string; name: string; category: string | null; price: number | null; is_available: boolean }
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export function Admin() {
  const client = supabase!
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [date, setDate] = useState(today())
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState('')

  const load = async () => {
    if (!supabase) return
    const { data } = await client.from('daily_menu_items').select('id,name,category,price,is_available').eq('menu_date', date).order('sort_order')
    setItems(data ?? [])
  }

  useEffect(() => {
    if (!supabase) return
    client.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)))
  }, [])

  useEffect(() => { if (signedIn) void load() }, [signedIn, date])

  if (!supabaseIsConfigured || !supabase) {
    return <main className="admin-page"><h1>Daily menu setup needed</h1><p>Add the Supabase environment variables in Cloudflare Pages before using this screen.</p></main>
  }

  const signIn = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await client.auth.signInWithPassword({ email, password })
    setMessage(error?.message ?? 'Signed in successfully.')
    if (!error) setSignedIn(true)
  }

  const addItem = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('Saving…')
    let imageUrl: string | null = null
    if (image) {
      const extension = image.name.split('.').pop() || 'jpg'
      const path = `${date}/${crypto.randomUUID()}.${extension}`
      const { error } = await client.storage.from('daily-menu-images').upload(path, image, { upsert: false })
      if (error) return setMessage(error.message)
      imageUrl = client.storage.from('daily-menu-images').getPublicUrl(path).data.publicUrl
    }
    const { error } = await client.from('daily_menu_items').insert({
      menu_date: date, name, category: category || null, price: price ? Number(price) : null,
      image_url: imageUrl, is_available: true,
    })
    if (error) return setMessage(error.message)
    setName(''); setCategory(''); setPrice(''); setImage(null); setMessage('Menu item published.')
    await load()
  }

  const toggle = async (item: Item) => {
    await client.from('daily_menu_items').update({ is_available: !item.is_available }).eq('id', item.id)
    await load()
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this menu item?')) return
    await client.from('daily_menu_items').delete().eq('id', id)
    await load()
  }

  if (!signedIn) return <main className="admin-page"><h1>Owner sign in</h1><p>Use the owner email and password created in Supabase.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button className="button" type="submit">Sign in</button></form><p>{message}</p></main>

  return <main className="admin-page"><div className="admin-heading"><div><p className="section-kicker"><span>OWNER</span>DAILY MENU</p><h1>Publish today’s food</h1></div><button className="text-button" onClick={() => client.auth.signOut().then(() => setSignedIn(false))}>Sign out</button></div><label>Menu date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><form onSubmit={addItem} className="menu-form"><label>Dish name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Veg pulao" /></label><label>Category<input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Lunch" /></label><label>Price (₹)<input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></label><label>Photo (optional)<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} /></label><button className="button" type="submit">Publish item</button></form><p>{message}</p><div className="admin-items">{items.map((item) => <article key={item.id}><div><strong>{item.name}</strong><span>{item.category}{item.price !== null ? ` · ₹${item.price}` : ''}</span></div><div><button onClick={() => toggle(item)}>{item.is_available ? 'Available' : 'Hidden'}</button><button className="danger-button" onClick={() => remove(item.id)}>Delete</button></div></article>)}</div></main>
}

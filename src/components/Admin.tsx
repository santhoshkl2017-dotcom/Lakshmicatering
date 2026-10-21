import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, supabaseIsConfigured } from '../lib/supabase'

type Item = { id: string; name: string; category: string | null; price: number | null; is_available: boolean }
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export function Admin() {
  const client = supabase
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [date, setDate] = useState(today())
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    if (!client) return
    const { data, error } = await client.from('daily_menu_items').select('id,name,category,price,is_available').eq('menu_date', date).order('sort_order')
    setItems(data ?? [])
    if (error) setMessage(`Could not load menu items: ${error.message}`)
  }, [client, date])

  const verifyOwner = useCallback(async (userId: string) => {
    if (!client) return false
    const { data, error } = await client.from('owner_profiles').select('id').eq('id', userId).maybeSingle()
    if (error) setMessage(`Could not verify owner access: ${error.message}`)
    if (!data && !error) setMessage('This account is not authorized to manage the daily menu.')
    return Boolean(data) && !error
  }, [client])

  useEffect(() => {
    if (!client) return
    let active = true
    const checkSession = async () => {
      const { data, error } = await client.auth.getSession()
      if (!active) return
      if (error) setMessage(`Could not check sign-in: ${error.message}`)
      if (data.session && await verifyOwner(data.session.user.id)) {
        // oxlint-disable-next-line react-hooks/set-state-in-effect
        setSignedIn(true)
      }
      // oxlint-disable-next-line react-hooks/set-state-in-effect
      setAuthChecked(true)
    }
    void checkSession()
    return () => { active = false }
  }, [client, verifyOwner])

  useEffect(() => {
    // oxlint-disable-next-line react-hooks/set-state-in-effect
    if (signedIn) void load()
  }, [signedIn, load])

  if (!supabaseIsConfigured || !client) {
    return <main className="admin-page"><h1>Daily menu setup needed</h1><p>Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Cloudflare Pages before using this screen.</p></main>
  }

  const signIn = async (event: FormEvent) => {
    event.preventDefault()
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) return setMessage(error.message)
    if (!data.user || !(await verifyOwner(data.user.id))) {
      await client.auth.signOut()
      setSignedIn(false)
      return
    }
    setSignedIn(true)
    setMessage('Signed in successfully.')
  }

  const addItem = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('Saving\u2026')
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
    const { error } = await client.from('daily_menu_items').update({ is_available: !item.is_available }).eq('id', item.id)
    if (error) return setMessage(`Could not update item: ${error.message}`)
    await load()
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this menu item?')) return
    const { error } = await client.from('daily_menu_items').delete().eq('id', id)
    if (error) return setMessage(`Could not delete item: ${error.message}`)
    await load()
  }

  if (!authChecked) return <main className="admin-page"><h1>Checking owner access&hellip;</h1><p>Please wait while we verify your sign-in.</p></main>
  if (!signedIn) return <main className="admin-page"><h1>Owner sign in</h1><p>Use the owner email and password created in Supabase.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button className="button" type="submit">Sign in</button></form><p>{message}</p></main>

  return <main className="admin-page"><div className="admin-heading"><div><p className="section-kicker"><span>OWNER</span>DAILY MENU</p><h1>Publish today&rsquo;s food</h1></div><button className="text-button" onClick={() => client.auth.signOut().then(() => setSignedIn(false))}>Sign out</button></div><label>Menu date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><form onSubmit={addItem} className="menu-form"><label>Dish name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Veg pulao" /></label><label>Category<input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Lunch" /></label><label>Price (&#x20b9;)<input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></label><label>Photo (optional)<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} /></label><button className="button" type="submit">Publish item</button></form><p>{message}</p><div className="admin-items">{items.map((item) => <article key={item.id}><div><strong>{item.name}</strong><span>{item.category}{item.price !== null ? ` \u00b7 \u20b9${item.price}` : ''}</span></div><div><button onClick={() => toggle(item)}>{item.is_available ? 'Available' : 'Hidden'}</button><button className="danger-button" onClick={() => remove(item.id)}>Delete</button></div></article>)}</div></main>
}

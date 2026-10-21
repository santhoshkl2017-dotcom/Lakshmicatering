import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, supabaseIsConfigured } from '../lib/supabase'

type Item = { id: string; name: string; category: string | null; price: number | null; is_available: boolean }
type DraftItem = { id: string; name: string; nameKn: string; category: string; categoryKn: string; price: string; image: File | null }

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
const newDraft = (): DraftItem => ({ id: crypto.randomUUID(), name: '', nameKn: '', category: '', categoryKn: '', price: '', image: null })

export function Admin() {
  const client = supabase
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [date, setDate] = useState(today())
  const [drafts, setDrafts] = useState<DraftItem[]>([newDraft()])
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

  const updateDraft = (id: string, field: keyof Omit<DraftItem, 'id'>, value: string | File | null) => {
    setDrafts((current) => current.map((draft) => draft.id === id ? { ...draft, [field]: value } : draft))
  }

  const publishItems = async (event: FormEvent) => {
    event.preventDefault()
    if (drafts.some((draft) => !draft.name.trim())) return setMessage('Enter a dish name for every row, or remove the empty rows.')
    setMessage(`Saving ${drafts.length} menu item${drafts.length === 1 ? '' : 's'}\u2026`)

    const payloads: Array<Record<string, unknown>> = []
    for (const draft of drafts) {
      let imageUrl: string | null = null
      if (draft.image) {
        const extension = draft.image.name.split('.').pop() || 'jpg'
        const path = `${date}/${crypto.randomUUID()}.${extension}`
        const { error } = await client.storage.from('daily-menu-images').upload(path, draft.image, { upsert: false })
        if (error) return setMessage(`Could not upload ${draft.name}: ${error.message}`)
        imageUrl = client.storage.from('daily-menu-images').getPublicUrl(path).data.publicUrl
      }
      payloads.push({
        menu_date: date,
        name: draft.name.trim(),
        category: draft.category.trim() || null,
        name_en: draft.name.trim(),
        name_kn: draft.nameKn.trim() || null,
        category_en: draft.category.trim() || null,
        category_kn: draft.categoryKn.trim() || null,
        price: draft.price ? Number(draft.price) : null,
        image_url: imageUrl,
        is_available: true,
      })
    }

    const { error } = await client.from('daily_menu_items').insert(payloads)
    if (error) return setMessage(error.message)
    setDrafts([newDraft()])
    setMessage(`${drafts.length} menu item${drafts.length === 1 ? '' : 's'} published.`)
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

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div><p className="section-kicker"><span>OWNER</span>DAILY MENU</p><h1>Publish today&rsquo;s food</h1></div>
        <button className="text-button" onClick={() => client.auth.signOut().then(() => setSignedIn(false))}>Sign out</button>
      </div>
      <label>Menu date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <form onSubmit={publishItems} className="menu-form">
        <div className="menu-form-heading">
          <div><h2>Add menu items</h2><p>Add several dishes for the selected date, then publish them together.</p></div>
          <button className="text-button" type="button" onClick={() => setDrafts((current) => [...current, newDraft()])}>+ Add another item</button>
        </div>
        {drafts.map((draft, index) => (
          <div className="menu-form-row" key={draft.id}>
            <div className="menu-form-row-heading"><strong>Item {index + 1}</strong>{drafts.length > 1 && <button className="text-button danger-button" type="button" onClick={() => setDrafts((current) => current.filter((item) => item.id !== draft.id))}>Remove</button>}</div>
            <label>Dish name — English<input value={draft.name} onChange={(e) => updateDraft(draft.id, 'name', e.target.value)} required placeholder="e.g. Veg pulao" /></label>
            <label>Dish name — Kannada<input value={draft.nameKn} onChange={(e) => updateDraft(draft.id, 'nameKn', e.target.value)} placeholder="Optional Kannada name" /></label>
            <label>Category — English<input value={draft.category} onChange={(e) => updateDraft(draft.id, 'category', e.target.value)} placeholder="Lunch" /></label>
            <label>Category — Kannada<input value={draft.categoryKn} onChange={(e) => updateDraft(draft.id, 'categoryKn', e.target.value)} placeholder="Optional Kannada category" /></label>
            <label>Price (&#x20b9;)<input type="number" min="0" value={draft.price} onChange={(e) => updateDraft(draft.id, 'price', e.target.value)} /></label>
            <label>Photo (optional)<input type="file" accept="image/*" onChange={(e) => updateDraft(draft.id, 'image', e.target.files?.[0] ?? null)} /></label>
          </div>
        ))}
        <div className="menu-form-actions"><button className="button" type="submit">Publish {drafts.length} item{drafts.length === 1 ? '' : 's'}</button></div>
      </form>
      <p>{message}</p>
      <div className="admin-items">{items.map((item) => <article key={item.id}><div><strong>{item.name}</strong><span>{item.category}{item.price !== null ? ` \u00b7 \u20b9${item.price}` : ''}</span></div><div><button onClick={() => toggle(item)}>{item.is_available ? 'Available' : 'Hidden'}</button><button className="danger-button" onClick={() => remove(item.id)}>Delete</button></div></article>)}</div>
    </main>
  )
}

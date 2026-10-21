import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const fallbackPath = new URLSearchParams(window.location.search).get('__gh_pages_path')
if (fallbackPath?.startsWith('/')) {
  window.history.replaceState(null, '', fallbackPath)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

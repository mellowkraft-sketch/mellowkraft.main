import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx'

const isAdminRoute = window.location.pathname.startsWith('/admin')

const rootEl = document.getElementById('root')
const app = (
  <StrictMode>
    {isAdminRoute ? <AdminApp /> : <App />}
  </StrictMode>
)

if (rootEl.hasAttribute('data-server-rendered')) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}

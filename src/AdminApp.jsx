import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth, db, firebaseReady } from './lib/firebaseClient'

const statusOptions = ['new', 'contacted', 'qualified', 'proposal-sent', 'won', 'lost']

function formatDate(timestamp) {
  if (!timestamp?.toDate) {
    return '—'
  }

  return timestamp.toDate().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatSales(value) {
  const numeric = Number(value || 0)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric)
}

function AdminApp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(Boolean(auth))
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [leads, setLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [pipelineStatus, setPipelineStatus] = useState('new')
  const [adminNotes, setAdminNotes] = useState('')
  const [saveState, setSaveState] = useState('idle')

  function applyLeadSelection(lead) {
    if (!lead) {
      return
    }

    setSelectedLeadId(lead.id)
    setPipelineStatus(lead.pipelineStatus || 'new')
    setAdminNotes(lead.adminNotes || '')
  }

  useEffect(() => {
    if (!auth) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
      setLoginError('')

      if (!currentUser) {
        setIsAdmin(false)
        setLeads([])
        setSelectedLeadId(null)
        setPipelineStatus('new')
        setAdminNotes('')
        setLeadsLoading(false)
        return
      }

      const adminAllowList = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)

      const token = await currentUser.getIdTokenResult()
      const emailMatch = adminAllowList.includes((currentUser.email || '').toLowerCase())
      const claimMatch = token.claims.admin === true

      const hasAdminAccess = emailMatch || claimMatch
      setIsAdmin(hasAdminAccess)

      if (!hasAdminAccess) {
        setLeads([])
        setSelectedLeadId(null)
        setPipelineStatus('new')
        setAdminNotes('')
        setLeadsLoading(false)
      } else {
        setLeadsLoading(true)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!db || !user || !isAdmin) {
      return undefined
    }

    const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      leadsQuery,
      (snapshot) => {
        const nextLeads = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        setLeads(nextLeads)
        setLeadsLoading(false)

        if (!selectedLeadId && nextLeads.length) {
          applyLeadSelection(nextLeads[0])
        }
      },
      () => {
        setLeadsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user, isAdmin, selectedLeadId])

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || null,
    [leads, selectedLeadId],
  )

  async function handleLogin(event) {
    event.preventDefault()
    setLoginError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setLoginError('Login failed. Check credentials and try again.')
    }
  }

  async function handleSave() {
    if (!selectedLead) {
      return
    }

    setSaveState('saving')

    try {
      await updateDoc(doc(db, 'leads', selectedLead.id), {
        pipelineStatus,
        adminNotes,
        updatedAt: serverTimestamp(),
      })
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 1200)
    } catch {
      setSaveState('error')
    }
  }

  async function handleLogout() {
    await signOut(auth)
  }

  if (authLoading) {
    return <main className="admin-root">Loading admin panel…</main>
  }

  if (!firebaseReady || !auth || !db) {
    return (
      <main className="admin-root">
        <section className="admin-auth-card">
          <h1>Firebase Setup Required</h1>
          <p>
            Admin panel is disabled because Firebase environment variables are missing. Add all `VITE_FIREBASE_*` values and reload.
          </p>
        </section>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="admin-root">
        <section className="admin-auth-card">
          <h1>Admin Login</h1>
          <p>Sign in to review and qualify incoming leads.</p>
          <form onSubmit={handleLogin}>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button type="submit" className="btn btn-primary">Login</button>
            {loginError && <p className="status error">{loginError}</p>}
          </form>
        </section>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="admin-root">
        <section className="admin-auth-card">
          <h1>Access Restricted</h1>
          <p>Your account is authenticated but does not have admin access.</p>
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-root">
      <header className="admin-header">
        <div>
          <p className="eyebrow">MellowKraft CRM</p>
          <h1>Leads Dashboard</h1>
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </header>

      <section className="admin-layout">
        <aside className="admin-leads-list card">
          <h2>Incoming Leads</h2>
          {leadsLoading ? (
            <p className="muted-note">Loading leads...</p>
          ) : (
            <div className="lead-list-items">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  className={`lead-list-item ${selectedLeadId === lead.id ? 'active' : ''}`}
                  onClick={() => applyLeadSelection(lead)}
                >
                  <strong>{lead.name || 'Unknown lead'}</strong>
                  <span>{lead.email || 'No email'}</span>
                  <span>{lead.leadTier || 'Unclassified'} · {lead.pipelineStatus || 'new'}</span>
                </button>
              ))}
              {!leads.length && <p className="muted-note">No leads captured yet.</p>}
            </div>
          )}
        </aside>

        <article className="admin-lead-detail card">
          {!selectedLead ? (
            <p className="muted-note">Select a lead to inspect and update.</p>
          ) : (
            <>
              <h2>{selectedLead.name}</h2>
              <div className="lead-meta-grid">
                <p><strong>Email:</strong> {selectedLead.email}</p>
                <p><strong>Phone:</strong> <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a></p>
                <p><strong>Monthly Sales:</strong> {formatSales(selectedLead.monthlySales)}</p>
                <p><strong>Lead Tier:</strong> {selectedLead.leadTier || '—'} ({selectedLead.leadScore || 0})</p>
                <p><strong>Submitted:</strong> {formatDate(selectedLead.createdAt)}</p>
                <p><strong>UTM:</strong> {selectedLead?.utm?.source || 'direct'} / {selectedLead?.utm?.campaign || 'none'}</p>
              </div>

              <div className="lead-block">
                <h3>Requirements</h3>
                <p>{selectedLead.requirements || '—'}</p>
              </div>

              {selectedLead.whyUs && (
                <div className="lead-block">
                  <h3>Why us</h3>
                  <p>{selectedLead.whyUs}</p>
                </div>
              )}

              <div className="lead-actions">
                <label>
                  Pipeline Status
                  <select value={pipelineStatus} onChange={(event) => setPipelineStatus(event.target.value)}>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Admin Notes
                  <textarea
                    rows={5}
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    placeholder="Call notes, objections, next steps..."
                  />
                </label>

                <div className="admin-actions-row">
                  <a className="btn btn-secondary" href={`tel:${selectedLead.phone}`}>Call Lead</a>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    {saveState === 'saving' ? 'Saving...' : 'Save Update'}
                  </button>
                </div>

                {saveState === 'saved' && <p className="status success">Update saved.</p>}
                {saveState === 'error' && <p className="status error">Update failed. Check permissions.</p>}
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  )
}

export default AdminApp

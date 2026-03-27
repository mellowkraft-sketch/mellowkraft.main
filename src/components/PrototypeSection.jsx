import { useState, useRef } from 'react'
import {
  ShoppingBag,
  Package,
  ClipboardList,
  Users,
  CreditCard,
  Truck,
  Megaphone,
  Zap,
  X,
  ExternalLink,
} from 'lucide-react'

const TILES = [
  {
    name: 'Storefront',
    desc: 'Customer-facing store',
    icon: ShoppingBag,
    url: 'https://prototype.mellowkraft.com/storefront',
  },
  {
    name: 'Inventory',
    desc: 'Stock management',
    icon: Package,
    url: 'https://prototype.mellowkraft.com/inventory',
  },
  {
    name: 'Orders',
    desc: 'Order management',
    icon: ClipboardList,
    url: 'https://prototype.mellowkraft.com/oms',
  },
  {
    name: 'CRM',
    desc: 'Customer relationships',
    icon: Users,
    url: 'https://prototype.mellowkraft.com/crm',
  },
  {
    name: 'Payments',
    desc: 'Payment processing',
    icon: CreditCard,
    url: 'https://prototype.mellowkraft.com/payments',
  },
  {
    name: 'Logistics',
    desc: 'Fulfillment & shipping',
    icon: Truck,
    url: 'https://prototype.mellowkraft.com/logistics',
  },
  {
    name: 'Marketing',
    desc: 'Campaigns & growth',
    icon: Megaphone,
    url: 'https://prototype.mellowkraft.com/marketing',
  },
  {
    name: 'Automations',
    desc: 'Workflow automation',
    icon: Zap,
    url: 'https://prototype.mellowkraft.com/automation',
  },
]

export default function PrototypeSection() {
  const [active, setActive] = useState(null)
  const hoverTimer = useRef(null)

  function handleMouseEnter(tile) {
    hoverTimer.current = setTimeout(() => setActive(tile), 500)
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimer.current)
  }

  function closeModal() {
    setActive(null)
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeModal()
  }

  return (
    <section id="prototype" className="section">
      <h2>The Prototype</h2>
      <p className="section-intro">
        Explore every layer of the MellowKraft commerce stack — live, interactive, and built to scale.
      </p>

      <div className="prototype-grid">
        {TILES.map((tile) => {
          const Icon = tile.icon
          return (
            <div
              key={tile.name}
              className="prototype-tile"
              onMouseEnter={() => handleMouseEnter(tile)}
              onMouseLeave={handleMouseLeave}
              onClick={() => setActive(tile)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActive(tile)}
              aria-label={`Preview ${tile.name} module`}
            >
              <div className="prototype-tile-icon-wrap">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="prototype-tile-name">{tile.name}</h3>
              <p className="prototype-tile-desc">{tile.desc}</p>
              <span className="prototype-tile-cta">Hover to preview</span>
            </div>
          )
        })}
      </div>

      {active && (
        <div
          className="prototype-backdrop"
          onClick={closeModal}
          onKeyDown={handleBackdropKey}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} preview`}
          tabIndex={-1}
        >
          <div
            className="prototype-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prototype-modal-header">
              <div className="prototype-modal-title">
                <span>{active.name}</span>
                <span className="prototype-modal-badge">Live Preview</span>
              </div>
              <div className="prototype-modal-actions">
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer"
                  className="prototype-modal-external"
                  aria-label={`Open ${active.name} in new tab`}
                  title="Open in new tab"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  className="prototype-modal-close"
                  onClick={closeModal}
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <iframe
              src={active.url}
              title={`${active.name} prototype`}
              className="prototype-modal-iframe"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  )
}

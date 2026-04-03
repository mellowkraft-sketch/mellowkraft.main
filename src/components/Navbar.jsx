import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../content'
import logo from '../assets/logo.jpeg'

function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth <= 960) {
        setIsVisible(true)
        return
      }

      const currentY = window.scrollY
      if (Math.abs(currentY - lastY.current) < 6) {
        return
      }

      if (currentY > lastY.current && currentY > 70) {
        setIsVisible(false)
        setIsMenuOpen(false)
      } else {
        setIsVisible(true)
      }

      lastY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', onEscape)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.removeEventListener('keydown', onEscape)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
        <a href="#hero" className="logo logo-img">
          <img src={logo} alt="MellowKraft" />
        </a>
        <nav>
          {navLinks.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a href="https://store.mellowkraft.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Store</a>
        <a href="#contact" className="btn btn-primary">Start a Project</a>
        <button
          type="button"
          className="navbar-menu-btn"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className={`hamburger ${isMenuOpen ? 'is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      {isMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-backdrop" onClick={closeMenu} />
          <nav className="mobile-nav-panel" id="mobile-nav-panel">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
            ))}
            <a href="https://store.mellowkraft.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary mobile-nav-cta" onClick={closeMenu}>
              Store
            </a>
            <a href="#contact" className="btn btn-primary mobile-nav-cta" onClick={closeMenu}>
              Start a Project
            </a>
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar

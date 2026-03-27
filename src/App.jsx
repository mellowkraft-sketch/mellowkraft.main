import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import {
  chooseUs,
  heroWords,
  idealClients,
  painPoints,
  processSteps,
  services,
  solutionPoints,
  testimonials,
} from './content'
import { useScrollAnimations } from './animations/useScrollAnimations'
import { trackEvent } from './lib/analytics'
import { Instagram, Twitter } from 'lucide-react'
import logo from './assets/logo.jpeg'

const SolutionStackedCarousel = lazy(() => import('./components/SolutionStackedCarousel'))
const ContactForm = lazy(() => import('./components/ContactForm'))
const ComparisonScrollSection = lazy(() => import('./components/ComparisonScrollSection'))
const TeamSectionBlock = lazy(() => import('./components/ui/team-section-block-shadcnui').then((module) => ({ default: module.TeamSectionBlock })))
const PrototypeSection = lazy(() => import('./components/PrototypeSection'))


function highlightStats(text) {
  const pattern = /(\d+(?:[.,]\d+)?\s*(?:\+|%|apps?)?)/gi
  const parts = String(text).split(pattern)

  return parts.map((part, index) => (
    /\d/.test(part)
      ? <span key={`${part}-${index}`} className="stat-highlight">{part}</span>
      : <span key={`${part}-${index}`}>{part}</span>
  ))
}

function App() {
  const [isMobileView, setIsMobileView] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [typedWord, setTypedWord] = useState('')
  const [typingPhase, setTypingPhase] = useState('typing')

  useScrollAnimations()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 960px)')
    const syncViewport = () => setIsMobileView(mediaQuery.matches)
    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)

    return () => {
      mediaQuery.removeEventListener('change', syncViewport)
    }
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (isMobileView) {
      setTypedWord(heroWords[0])
      setTypingPhase('typing')
      setWordIndex(0)
      return undefined
    }

    const currentWord = heroWords[wordIndex]
    let timer

    if (typingPhase === 'typing') {
      if (typedWord.length < currentWord.length) {
        timer = setTimeout(() => {
          setTypedWord(currentWord.slice(0, typedWord.length + 1))
        }, 90)
      } else {
        timer = setTimeout(() => {
          setTypingPhase('deleting')
        }, 2000)
      }
    }

    if (typingPhase === 'deleting') {
      if (typedWord.length > 0) {
        timer = setTimeout(() => {
          setTypedWord(currentWord.slice(0, typedWord.length - 1))
        }, 55)
      } else {
        setWordIndex((current) => (current + 1) % heroWords.length)
        setTypingPhase('typing')
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isMobileView, typedWord, typingPhase, wordIndex])


  return (
    <>
      <Navbar />

      <main>
        <section id="hero" className="section hero-section">
          <div className="hero-ambient" aria-hidden="true" />
          <p className="eyebrow">Strategic Commerce Engineering</p>
          <h1>
            Built for brands that have outgrown
            <span className="cycle-word"> {typedWord}{!isMobileView && <span className="cycle-cursor" aria-hidden="true">|</span>}</span>
          </h1>
          <p className="subhead">
            MellowKraft designs and builds custom commerce infrastructure for modern D2C brands ready to scale without platform constraints.
          </p>
          <div className="hero-ctas">
            <a
              href="#contact"
              className="btn btn-primary"
              onClick={() => trackEvent('cta_click', { cta_name: 'hero_start_project' })}
            >
              Start Your Project
            </a>
            <a
              href="#why"
              className="btn btn-secondary"
              onClick={() => trackEvent('cta_click', { cta_name: 'hero_read_growth_wall' })}
            >
              Why Brands Outgrow Platforms
            </a>
          </div>
        </section>

        <section id="why" className="section">
          <h2>Why Brands Outgrow Managed Platforms</h2>
          <p className="section-intro">You are not failing. Your systems are hitting structural limits.</p>
          <div className="grid grid-2">
            {painPoints.map((item) => (
              <article className="card" key={item.title}>
                <h3>{highlightStats(item.title)}</h3>
                <p>{highlightStats(item.body)}</p>
              </article>
            ))}
          </div>
        </section>

        <Suspense fallback={<section id="comparison" className="section comparison-scroll-wrap" aria-hidden="true" />}>
          <ComparisonScrollSection />
        </Suspense>

        <section id="solution" className="section">
          <h2>The Solution</h2>
          <p className="section-intro">
            A custom commerce stack that progressively improves speed, control, and scalability without platform dependency.
          </p>
          <div className="solution-layout">
            <div className="solution-copy card">
              <p className="solution-lead">
                We do not hand over a theme. We build a complete <span className="solution-keyword">operating system</span> for your commerce journey.
              </p>
              <ul className="solution-points">
                {solutionPoints.map((point) => (
                  <li key={point.title}>
                    <strong>{point.title}</strong>
                    <p>{point.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <Suspense fallback={<div className="solution-carousel" aria-hidden="true" />}>
              <SolutionStackedCarousel />
            </Suspense>
          </div>
        </section>

        <section id="services" className="section">
          <div className="services-header">
            <h2>What We Build</h2>
            <p className="section-intro">
              Every layer is built as part of one connected system, so growth, operations, and customer experience stay aligned.
            </p>
          </div>
          <div className="services-figures" aria-hidden="true">
            <div className="figure-chip">
              <strong>6</strong>
              <span>Core systems</span>
            </div>
            <div className="figure-chip">
              <strong>1 Stack</strong>
              <span>Unified architecture</span>
            </div>
            <div className="figure-chip">
              <strong>Built to scale</strong>
              <span>No template ceiling</span>
            </div>
          </div>
          <div className="grid grid-3 services-grid">
            {services.map((service) => (
              <article className="card service-card" key={service.title}>
                <div>
                  <h3>{service.title}</h3>
                  <p className="service-summary">{service.summary}</p>
                </div>
                <div className="service-footer">
                  <span className={`service-outcome ${service.comingSoon ? 'coming-soon' : ''}`}>
                    {service.outcome}
                  </span>
                  {service.comingSoon && <span className="badge">Coming Soon</span>}
                </div>
              </article>
            ))}
          </div>
          <p className="muted-note">Trusted integrations for payments and fulfillment: Razorpay and Shiprocket.</p>
        </section>

        <Suspense fallback={<section id="prototype" className="section" aria-hidden="true" />}>
          <PrototypeSection />
        </Suspense>

        <section id="process" className="section process">
          <div className="process-header">
            <h2>The Process</h2>
            <p className="section-intro">
              A high-rigor delivery framework engineered to de-risk transformation, enforce architectural clarity, and accelerate execution velocity.
            </p>
          </div>
          <div className="process-figures" aria-hidden="true">
            <div className="figure-chip">
              <strong>3</strong>
              <span>Strategic execution phases</span>
            </div>
            <div className="figure-chip">
              <strong>4–6 weeks</strong>
              <span>Transformation window</span>
            </div>
            <div className="figure-chip">
              <strong>100%</strong>
              <span>Architectural ownership</span>
            </div>
          </div>
          <div className="process-stack">
            {processSteps.map((step, index) => (
              <article key={step.title} className="card process-card">
                <div className="process-step-id">0{index + 1}</div>
                <div className="process-card-content">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="timeframe">Estimated timeframe: {step.timeframe}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="ideal" className="section two-col">
          <div>
            <h2>Ideal Clients</h2>
            <ul>
              {idealClients.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2>Why Choose Us</h2>
            <ul>
              {chooseUs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section id="testimonials" className="section">
          <h2>Testimonials</h2>
          <div className="grid grid-3">
            {testimonials.map((quote) => (
              <blockquote key={quote} className="card quote">
                <span className="quote-mark" aria-hidden="true">“</span>
                <p className="quote-text">{quote.replace(/[“”]/g, '')}</p>
                <cite className="quote-meta">Founder · D2C Brand</cite>
              </blockquote>
            ))}
          </div>
        </section>

        <div id="team">
          <Suspense fallback={<section className="section" aria-hidden="true" />}>
            <TeamSectionBlock />
          </Suspense>
        </div>

        <section id="contact" className="section two-col contact">
          <div>
            <h2>Contact Us</h2>
            <Suspense fallback={<div className="card" aria-hidden="true" style={{ minHeight: '420px' }} />}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="contact-details card">
            <p>Prefer to reach out directly? We are here.</p>
            <a href="mailto:mellowkraft@protonmail.com">mellowkraft@protonmail.com</a>
            <a href="tel:+919695996753">+91 96959 96753</a>
            <div className="social-links contact-social-links">
              <a href="https://www.instagram.com/mellow_kraft/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={16} aria-hidden />
                <span>Instagram</span>
              </a>
              <a href="https://x.com/mellowkraft" target="_blank" rel="noreferrer" aria-label="X">
                <Twitter size={16} aria-hidden />
                <span>X</span>
              </a>
            </div>
          </aside>
        </section>
      </main>

      <footer className="footer section">
        <a href="#hero" className="logo logo-img footer-logo">
          <img src={logo} alt="MellowKraft" />
        </a>
        <nav>
          <a href="#why">Why</a>
          <a href="#solution">Solution</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="social-links">
          <a href="https://www.instagram.com/mellow_kraft/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram size={16} aria-hidden />
            <span>Instagram</span>
          </a>
          <a href="https://x.com/mellowkraft" target="_blank" rel="noreferrer" aria-label="X">
            <Twitter size={16} aria-hidden />
            <span>X</span>
          </a>
        </div>
        <small>© 2024 MellowKraft. All rights reserved.</small>
      </footer>
    </>
  )
}

export default App

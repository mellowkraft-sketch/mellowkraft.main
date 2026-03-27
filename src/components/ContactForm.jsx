import { useMemo, useRef, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'
import { leadSchema } from '../lib/leadSchema'
import { classifyLead } from '../lib/leadClassifier'
import { getUtmParams } from '../lib/utm'
import { trackEvent } from '../lib/analytics'
import SlideButton from './ui/slide-button'

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [startedAt] = useState(Date.now())
  const formRef = useRef(null)

  const utm = useMemo(() => getUtmParams(), [])

  async function onSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setFieldErrors({})
    const formElement = event.currentTarget

    const formData = new FormData(formElement)
    const payload = {
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      email: String(formData.get('email') || ''),
      requirements: String(formData.get('requirements') || ''),
      monthlySales: Number(formData.get('monthlySales') || 0),
      whyUs: String(formData.get('whyUs') || ''),
      honey: String(formData.get('website') || ''),
      formStartedAt: startedAt,
    }

    const parsed = leadSchema.safeParse(payload)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      const fieldName = firstIssue?.path?.[0] || 'form'
      const readableField = String(fieldName)
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())

      const nextFieldErrors = {}
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path?.[0] || 'form')
        if (!nextFieldErrors[key]) {
          nextFieldErrors[key] = issue.message || 'Invalid value'
        }
      })

      setStatus('error')
      setError(`Please check ${readableField.toLowerCase()} and try again.`)
      setFieldErrors(nextFieldErrors)
      await trackEvent('lead_form_validation_failed')
      return
    }

    try {
      if (!db) {
        throw new Error('Firebase not configured')
      }

      const classifyResponse = await fetch('/api/lead-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      let classification

      if (!classifyResponse.ok) {
        const responseBody = await classifyResponse.json().catch(() => ({}))

        if (classifyResponse.status === 404) {
          classification = classifyLead(parsed.data)
        } else if (classifyResponse.status === 403 && responseBody?.error === 'Blocked') {
          setStatus('error')
          setError('Please wait 2–3 seconds before submitting and try again.')
          await trackEvent('lead_form_submit_blocked')
          return
        } else {
          throw new Error(responseBody?.error || 'Lead classification failed')
        }
      }

      if (!classification) {
        classification = await classifyResponse.json()
      }

      await addDoc(collection(db, 'leads'), {
        ...parsed.data,
        monthlySalesBand: classification.monthlySalesBand,
        leadTier: classification.leadTier,
        leadScore: classification.leadScore,
        urgencySignals: classification.urgencySignals,
        utm,
        source: 'mellowkraft.com',
        createdAt: serverTimestamp(),
      })

      setStatus('success')
      setFieldErrors({})
      formElement.reset()

      trackEvent('lead_form_submit_success', {
        lead_tier: classification.leadTier,
      }).catch(() => {})
    } catch (submitError) {
      setStatus('error')
      setError('Submission failed. Please retry or contact us directly.')
      await trackEvent('lead_form_submit_failed')
      console.error(submitError)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="contact-form" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honey" aria-hidden="true" />

      <label>
        Name *
        <input
          required
          type="text"
          name="name"
          placeholder="Your full name"
          autoComplete="name"
          aria-invalid={fieldErrors.name ? 'true' : 'false'}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
        {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
      </label>

      <label>
        Phone Number *
        <input
          required
          type="tel"
          name="phone"
          placeholder="+91"
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={fieldErrors.phone ? 'true' : 'false'}
          aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
        />
        {fieldErrors.phone && <span id="phone-error" className="field-error">{fieldErrors.phone}</span>}
      </label>

      <label>
        Email *
        <input
          required
          type="email"
          name="email"
          placeholder="you@brand.com"
          autoComplete="email"
          inputMode="email"
          aria-invalid={fieldErrors.email ? 'true' : 'false'}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email && <span id="email-error" className="field-error">{fieldErrors.email}</span>}
      </label>

      <label>
        Requirements *
        <textarea
          required
          name="requirements"
          rows={4}
          placeholder="What are you looking to build?"
          aria-invalid={fieldErrors.requirements ? 'true' : 'false'}
          aria-describedby={fieldErrors.requirements ? 'requirements-error' : undefined}
        />
        {fieldErrors.requirements && <span id="requirements-error" className="field-error">{fieldErrors.requirements}</span>}
      </label>

      <label>
        Monthly Sales (INR) *
        <input
          required
          type="number"
          name="monthlySales"
          min={0}
          step={10000}
          placeholder="500000"
          inputMode="numeric"
          aria-invalid={fieldErrors.monthlySales ? 'true' : 'false'}
          aria-describedby={fieldErrors.monthlySales ? 'monthly-sales-error' : undefined}
        />
        {fieldErrors.monthlySales && <span id="monthly-sales-error" className="field-error">{fieldErrors.monthlySales}</span>}
      </label>

      <label>
        Why do you need us?
        <textarea name="whyUs" rows={3} placeholder="Optional context" />
      </label>

      <button className="visually-hidden" type="submit" disabled={status === 'loading'}>
        Submit
      </button>

      <div className="slide-submit-wrap">
        <SlideButton
          status={status}
          className="bg-[var(--mars)] text-white hover:bg-[var(--forest)]"
          aria-label="Slide to submit"
          onSlideComplete={() => {
            formRef.current?.requestSubmit()
          }}
        />
      </div>

      {status === 'success' && <p className="status success" role="status" aria-live="polite">Thanks, we will reach out soon.</p>}
      {status === 'error' && <p className="status error" role="alert">{error}</p>}
    </form>
  )
}

export default ContactForm

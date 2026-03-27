import { useMemo, useState } from 'react'

const solutionCards = [
  {
    id: '01',
    title: 'Headless Storefront',
    description: 'Customer-facing experience layer built for conversion speed and brand control.',
  },
  {
    id: '02',
    title: 'Commerce APIs',
    description: 'Pricing, catalog, checkout, and business logic exposed as flexible service contracts.',
  },
  {
    id: '03',
    title: 'OMS · IMS · CRM',
    description: 'Operations and customer systems connected into one coordinated workflow engine.',
  },
  {
    id: '04',
    title: 'Database + Cloud Infrastructure',
    description: 'Core data and compute layer designed for resilience, performance, and ownership.',
  },
  {
    id: '05',
    title: 'Out Source Integration',
    description: 'Razorpay and Shiprocket integrated as trusted payment and fulfillment partners.',
  },
]

function highlightIntegrationTouchpoints(text) {
  return String(text)
    .split(/(Razorpay|Shiprocket)/g)
    .map((chunk, index) => (
      chunk === 'Razorpay' || chunk === 'Shiprocket'
        ? <span key={`${chunk}-${index}`} className="integration-touchpoint">{chunk}</span>
        : <span key={`${chunk}-${index}`}>{chunk}</span>
    ))
}

function SolutionStackedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const orderedCards = useMemo(() => {
    return solutionCards.map((_, index) => solutionCards[(activeIndex + index) % solutionCards.length])
  }, [activeIndex])

  const nextCard = () => {
    setActiveIndex((current) => (current + 1) % solutionCards.length)
  }

  return (
    <div className="solution-carousel">
      <div className="solution-carousel-stack" aria-live="polite">
        {orderedCards.map((card, stackIndex) => (
          <article
            key={card.id}
            className={`solution-carousel-card ${stackIndex === 0 ? 'is-front' : ''}`}
            style={{
              transform: `translate(${stackIndex * 14}px, ${stackIndex * -14}px) scale(${1 - stackIndex * 0.04})`,
              zIndex: solutionCards.length - stackIndex,
              opacity: stackIndex > 3 ? 0 : 1,
            }}
          >
            <span className="solution-card-id">{card.id}</span>
            <h3>{card.title}</h3>
            <p>{highlightIntegrationTouchpoints(card.description)}</p>
            <div className="solution-card-pitch">
              <p>
                Most brands reach us when growth starts feeling expensive, fragmented, and slow. This layer fixes that at the root.
              </p>
              <ul>
                <li>You stop paying hidden platform complexity costs.</li>
                <li>Your team operates on one system, not scattered tools.</li>
                <li>You gain full control over data, margins, and scale decisions.</li>
              </ul>
              <a href="tel:+919695996753" className="solution-convince-cta">Talk to MellowKraft →</a>
            </div>
          </article>
        ))}
      </div>

      <div className="solution-carousel-controls">
        <button type="button" className="solution-carousel-next" onClick={nextCard} aria-label="Next architecture card">
          Next →
        </button>
        <div className="solution-carousel-dots" role="tablist" aria-label="Solution progression">
          {solutionCards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`solution-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${card.title}`}
              aria-selected={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SolutionStackedCarousel

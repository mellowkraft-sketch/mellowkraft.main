export function classifyLead(input) {
  const requirementsText = `${input.requirements} ${input.whyUs || ''}`.toLowerCase()
  const urgencySignals = ['urgent', 'asap', 'immediately', 'scale', 'migration', 'replatform']
  const urgencyHits = urgencySignals.filter((word) => requirementsText.includes(word))

  let score = 0
  if (input.monthlySales >= 1500000) score += 60
  else if (input.monthlySales >= 500000) score += 40
  else if (input.monthlySales >= 200000) score += 20
  else score += 10

  score += Math.min(urgencyHits.length * 10, 30)

  let leadTier = 'Cold'
  if (score >= 70) leadTier = 'Hot'
  else if (score >= 40) leadTier = 'Warm'

  let monthlySalesBand = '<₹2L'
  if (input.monthlySales >= 1500000) monthlySalesBand = '₹15L+'
  else if (input.monthlySales >= 500000) monthlySalesBand = '₹5L-₹15L'
  else if (input.monthlySales >= 200000) monthlySalesBand = '₹2L-₹5L'

  return {
    leadTier,
    leadScore: score,
    monthlySalesBand,
    urgencySignals: urgencyHits,
  }
}

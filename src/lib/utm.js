export function getUtmParams() {
  if (typeof window === 'undefined') {
    return { source: 'direct', medium: 'none', campaign: 'none', term: '', content: '' }
  }

  const params = new URLSearchParams(window.location.search)

  return {
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'none',
    campaign: params.get('utm_campaign') || 'none',
    term: params.get('utm_term') || '',
    content: params.get('utm_content') || '',
  }
}

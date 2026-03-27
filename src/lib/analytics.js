import { logEvent } from 'firebase/analytics'
import { getFirebaseAnalytics } from './firebaseClient'

let analyticsRef = null

async function resolveAnalytics() {
  if (!analyticsRef) {
    analyticsRef = await getFirebaseAnalytics()
  }

  return analyticsRef
}

export async function trackEvent(name, params = {}) {
  const analytics = await resolveAnalytics()

  if (!analytics) {
    return
  }

  logEvent(analytics, name, params)
}

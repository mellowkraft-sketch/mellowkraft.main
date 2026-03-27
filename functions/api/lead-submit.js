import { z } from 'zod'
import { classifyLead } from '../../src/lib/leadClassifier'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(160),
  requirements: z.string().trim().min(5).max(2400),
  monthlySales: z.coerce.number().min(0),
  whyUs: z.string().trim().max(2400).optional().or(z.literal('')),
  honey: z.string().max(0).optional().or(z.literal('')),
  formStartedAt: z.number().min(0),
})

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json()
    const parsed = schema.safeParse(payload)

    if (!parsed.success) {
      return Response.json({ error: 'Validation failed' }, { status: 422 })
    }

    if (parsed.data.honey) {
      return Response.json({ error: 'Blocked' }, { status: 403 })
    }

    const result = classifyLead(parsed.data)

    return Response.json(result, { status: 200 })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}

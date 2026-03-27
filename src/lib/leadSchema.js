import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(160),
  requirements: z.string().trim().min(5).max(2400),
  monthlySales: z.coerce.number().min(0),
  whyUs: z.string().trim().max(2400).optional().or(z.literal('')),
  honey: z.string().max(0).optional().or(z.literal('')),
  formStartedAt: z.number().min(0),
})

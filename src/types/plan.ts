import { z } from "zod"

/**
 * One tariff/plan row. Mirrors the admin Plan object (GET /admin/plans).
 * Limit fields are `null` when the plan is unlimited for that area; a number is a hard cap.
 */
export const planSchema = z.object({
  id: z.string(),
  /** Unique slug: ^[a-z0-9-]{1,30}$. */
  name: z.string(),
  /** Category cap, or null for unlimited. */
  maxCategories: z.number().nullable(),
  /** Monthly transaction cap, or null for unlimited. */
  maxTransactionsPerMonth: z.number().nullable(),
  /** Monthly price as a number (not a string). */
  price: z.number(),
  investingAccess: z.boolean(),
  /** How many users are currently on this plan. */
  subscribers: z.number(),
})

export const plansSchema = z.array(planSchema)

export type Plan = z.infer<typeof planSchema>

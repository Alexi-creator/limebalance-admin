import { roleSchema } from "@appTypes/user"
import { z } from "zod"

/** Per-area activity counts the admin table shows. Mirrors AdminUserCountsDto on the backend. */
export const adminUserCountsSchema = z.object({
  expenseCategories: z.number(),
  incomeCategories: z.number(),
  categories: z.number(),
  expenses: z.number(),
  incomes: z.number(),
  transactions: z.number(),
  goals: z.number(),
})

/** One row of the admin users table. Mirrors AdminUserDto (GET /admin/users). */
export const adminUserSchema = z.object({
  id: z.string(),
  email: z.email().nullable(),
  name: z.string(),
  role: roleSchema,
  currency: z.string(),
  timezone: z.string(),
  emailVerified: z.boolean(),
  /** ISO date-time the account was blocked, or null if active. */
  blockedAt: z.string().nullable(),
  isBlocked: z.boolean(),
  createdAt: z.string(),
  hasTelegram: z.boolean(),
  hasGoogle: z.boolean(),
  hasPassword: z.boolean(),
  /** Current plan name (free / pro / ultra) or null if no subscription. */
  plan: z.string().nullable(),
  /** Subscription end date or null (perpetual / no subscription). */
  planExpiresAt: z.string().nullable(),
  counts: adminUserCountsSchema,
})

export const adminUsersSchema = z.array(adminUserSchema)

export type AdminUser = z.infer<typeof adminUserSchema>

import { z } from "zod"

/** Default page size. */
export const PAGE_LIMIT = 20

/** Available page sizes for the table selector. */
export const PAGE_SIZE_OPTIONS = [20, 50, 100]

export const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
]

export const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
]

export const VERIFIED_OPTIONS = [
  { value: "all", label: "Email: any" },
  { value: "yes", label: "Email: verified" },
  { value: "no", label: "Email: unverified" },
]

/** Plan names used for the filter. `none` matches users without a subscription. */
export const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "ultra", label: "Ultra" },
  { value: "none", label: "No plan" },
]

/** Login methods used for the filter (a user matches if they have all selected methods). */
export const METHOD_OPTIONS = [
  { value: "password", label: "Password" },
  { value: "google", label: "Google" },
  { value: "telegram", label: "Telegram" },
]

/**
 * URL params schema for the users table. `.catch()`/`.default()` guarantee that
 * `useUrlParams` never crashes on malformed values in the link. All filtering, sorting and
 * pagination are client-side (the list endpoint returns every user at once).
 */
export const usersParamsSchema = z.object({
  /** Free-text search over email and name. */
  search: z.string().optional().catch(undefined),
  role: z.enum(["all", "ADMIN", "USER"]).catch("all").default("all"),
  status: z.enum(["all", "active", "blocked"]).catch("all").default("all"),
  verified: z.enum(["all", "yes", "no"]).catch("all").default("all"),
  // Multi-selects: serialized as repeated params (?plan=free&plan=pro).
  plan: z
    .preprocess((v) => (v == null ? [] : Array.isArray(v) ? v : [v]), z.array(z.string()))
    .catch([])
    .default([]),
  method: z
    .preprocess((v) => (v == null ? [] : Array.isArray(v) ? v : [v]), z.array(z.string()))
    .catch([])
    .default([]),
  sortColumn: z.string().catch("createdAt").default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).catch("desc").default("desc"),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce
    .number()
    .refine((v) => PAGE_SIZE_OPTIONS.includes(v))
    .catch(PAGE_LIMIT)
    .default(PAGE_LIMIT),
})

export type UsersParams = z.infer<typeof usersParamsSchema>

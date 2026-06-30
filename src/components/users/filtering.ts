import type { AdminUser } from "@appTypes/adminUser"
import type { UsersParams } from "./config"

/** Value used to sort a row by the active column. Keeps types comparable per column. */
function sortValue(user: AdminUser, column: string): string | number {
  switch (column) {
    case "email":
      return user.email?.toLowerCase() ?? ""
    case "name":
      return user.name.toLowerCase()
    case "role":
      return user.role
    case "plan":
      return user.plan ?? ""
    case "currency":
      return user.currency
    case "transactions":
      return user.counts.transactions
    case "categories":
      return user.counts.categories
    case "goals":
      return user.counts.goals
    case "createdAt":
      return new Date(user.createdAt).getTime()
    default:
      return new Date(user.createdAt).getTime()
  }
}

/** Apply the filter params, then sort. Pagination is applied by the caller on the result. */
export function filterAndSortUsers(users: AdminUser[], params: UsersParams): AdminUser[] {
  const search = params.search?.trim().toLowerCase()

  const filtered = users.filter((u) => {
    if (search) {
      const haystack = `${u.email ?? ""} ${u.name}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (params.role !== "all" && u.role !== params.role) return false
    if (params.status === "active" && u.isBlocked) return false
    if (params.status === "blocked" && !u.isBlocked) return false
    if (params.verified === "yes" && !u.emailVerified) return false
    if (params.verified === "no" && u.emailVerified) return false

    if (params.plan.length > 0) {
      const planKey = u.plan ?? "none"
      if (!params.plan.includes(planKey)) return false
    }

    // A user must have every selected login method.
    if (params.method.includes("password") && !u.hasPassword) return false
    if (params.method.includes("google") && !u.hasGoogle) return false
    if (params.method.includes("telegram") && !u.hasTelegram) return false

    return true
  })

  const dir = params.sortDirection === "asc" ? 1 : -1
  return filtered.sort((a, b) => {
    const av = sortValue(a, params.sortColumn)
    const bv = sortValue(b, params.sortColumn)
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
}

/** Whether any filter (not counting sort/pagination) is active — drives the "reset" affordance. */
export function hasActiveFilters(params: UsersParams): boolean {
  return (
    !!params.search?.trim() ||
    params.role !== "all" ||
    params.status !== "all" ||
    params.verified !== "all" ||
    params.plan.length > 0 ||
    params.method.length > 0
  )
}

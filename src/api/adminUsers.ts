import { request } from "@api/request"
import type { AdminUser } from "@appTypes/adminUser"
import { adminUserSchema, adminUsersSchema } from "@appTypes/adminUser"
import { API_URLS } from "@constants/apiUrls"
import { HttpMethods } from "@constants/httpMethods"

/**
 * Full admin users table: one row per user with account fields, login methods, plan and
 * per-area activity counts. The backend returns the whole list (newest first) in one shot —
 * filtering, sorting and pagination happen client-side.
 */
export function getUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>(API_URLS.admin.users, { schema: adminUsersSchema })
}

/** Block a user (sets blockedAt). They are rejected on their next request, on every route. */
export function blockUser(id: string): Promise<AdminUser> {
  return request<AdminUser>(API_URLS.admin.block(id), {
    method: HttpMethods.PATCH,
    schema: adminUserSchema,
  })
}

/** Unblock a user (clears blockedAt), restoring access. */
export function unblockUser(id: string): Promise<AdminUser> {
  return request<AdminUser>(API_URLS.admin.unblock(id), {
    method: HttpMethods.PATCH,
    schema: adminUserSchema,
  })
}

export interface ChangePlanPayload {
  /** Plan name: free / pro / ultra. */
  planName: string
  /** ISO date-time the subscription expires, or null for a lifetime grant. */
  expiresAt?: string | null
}

/** Upsert the user's subscription to the given plan with an optional expiry. */
export function changePlan(id: string, payload: ChangePlanPayload): Promise<AdminUser> {
  return request<AdminUser>(API_URLS.admin.plan(id), {
    method: HttpMethods.PATCH,
    body: JSON.stringify(payload),
    schema: adminUserSchema,
  })
}

/** Delete a user. All their data is cascade-deleted. Returns the deleted row. */
export function deleteUser(id: string): Promise<AdminUser> {
  return request<AdminUser>(API_URLS.admin.user(id), {
    method: HttpMethods.DELETE,
    schema: adminUserSchema,
  })
}

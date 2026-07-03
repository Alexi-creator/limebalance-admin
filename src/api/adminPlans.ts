import { request } from "@api/request"
import type { Plan } from "@appTypes/plan"
import { planSchema, plansSchema } from "@appTypes/plan"
import { API_URLS } from "@constants/apiUrls"
import { HttpMethods } from "@constants/httpMethods"

/** All tariffs, cheapest first. The backend returns the whole list in one shot. */
export function getPlans(): Promise<Plan[]> {
  return request<Plan[]>(API_URLS.admin.plans, { schema: plansSchema })
}

export interface CreatePlanPayload {
  /** Unique slug: ^[a-z0-9-]{1,30}$. */
  name: string
  /** Category cap, or null for unlimited. */
  maxCategories?: number | null
  /** Monthly transaction cap, or null for unlimited. */
  maxTransactionsPerMonth?: number | null
  /** Monthly price, number >= 0. */
  price: number
  investingAccess?: boolean
}

/** Create a new tariff variant. */
export function createPlan(payload: CreatePlanPayload): Promise<Plan> {
  return request<Plan>(API_URLS.admin.plans, {
    method: HttpMethods.POST,
    body: JSON.stringify(payload),
    schema: planSchema,
  })
}

/**
 * Update a tariff's limits / price / name / access. All fields optional: an omitted field is
 * left unchanged, a limit sent as `null` makes that area unlimited.
 */
export type UpdatePlanPayload = Partial<CreatePlanPayload>

export function updatePlan(id: string, payload: UpdatePlanPayload): Promise<Plan> {
  return request<Plan>(API_URLS.admin.planItem(id), {
    method: HttpMethods.PATCH,
    body: JSON.stringify(payload),
    schema: planSchema,
  })
}

/** Delete a tariff. Returns the deleted row. Rejected by the backend if it still has subscribers. */
export function deletePlan(id: string): Promise<Plan> {
  return request<Plan>(API_URLS.admin.planItem(id), {
    method: HttpMethods.DELETE,
    schema: planSchema,
  })
}

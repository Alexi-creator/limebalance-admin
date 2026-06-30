import type { ChipGroup } from "./ActiveFilterChips"
import type { UsersParams } from "./config"
import { METHOD_OPTIONS, PLAN_OPTIONS } from "./config"

interface Args {
  params: UsersParams
  setParams: (updates: Partial<UsersParams>) => void
}

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value

/** Build the removable-chip groups for the active multi-select filters (plan, login method). */
export function buildFilterChipGroups({ params, setParams }: Args): ChipGroup[] {
  return [
    {
      label: "Plan",
      items: params.plan.map((v) => ({ value: v, label: labelOf(PLAN_OPTIONS, v) })),
      onRemove: (v) => setParams({ plan: params.plan.filter((p) => p !== v), page: 1 }),
    },
    {
      label: "Login method",
      items: params.method.map((v) => ({ value: v, label: labelOf(METHOD_OPTIONS, v) })),
      onRemove: (v) => setParams({ method: params.method.filter((m) => m !== v), page: 1 }),
    },
  ]
}

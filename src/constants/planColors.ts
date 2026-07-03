/** Badge color per plan name, shared by the users and plans tables so they stay in sync. */
export const PLAN_COLOR: Record<string, string> = { free: "gray", pro: "blue", ultra: "green" }

/** Badge color for a plan name, falling back to gray for unknown/custom plans. */
export function planColor(name: string): string {
  return PLAN_COLOR[name] ?? "gray"
}

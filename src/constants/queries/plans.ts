/** react-query cache settings for the admin plans list. */
export const PLANS_STALE_TIME = 30_000

export const planKeys = {
  all: ["admin", "plans"] as const,
  list: () => [...planKeys.all, "list"] as const,
}

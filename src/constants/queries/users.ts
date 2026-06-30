/** react-query cache settings for the admin users list. */
export const USERS_STALE_TIME = 30_000

export const userKeys = {
  all: ["admin", "users"] as const,
  list: () => [...userKeys.all, "list"] as const,
}

export const RouteNames = {
  Home: "/",
  Plans: "/plans",
  Auth: "/auth",
} as const

export type RouteName = (typeof RouteNames)[keyof typeof RouteNames]

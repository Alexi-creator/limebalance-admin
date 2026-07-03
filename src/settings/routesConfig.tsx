import type { RouteConfig } from "@appTypes/route"
import { RouteNames } from "@constants/routeNames"
import { lazy } from "react"

const UsersPage = lazy(() => import("@pages/UsersPage").then((m) => ({ default: m.UsersPage })))
const PlansPage = lazy(() => import("@pages/PlansPage").then((m) => ({ default: m.PlansPage })))
const AuthPage = lazy(() => import("@pages/AuthPage").then((m) => ({ default: m.AuthPage })))
const NotFoundPage = lazy(() =>
  import("@pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
)

export const appRoutes: RouteConfig[] = [
  { path: RouteNames.Home, element: <UsersPage /> },
  { path: RouteNames.Plans, element: <PlansPage /> },
  // Catch-all: unknown paths render the 404 inside the authenticated shell.
  { path: "*", element: <NotFoundPage /> },
]

export const publicRoutes: RouteConfig[] = [{ path: RouteNames.Auth, element: <AuthPage /> }]

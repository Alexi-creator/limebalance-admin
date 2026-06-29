import type { RouteConfig } from "@appTypes/route"
import { RouteNames } from "@constants/routeNames"
import { lazy } from "react"

const HomePage = lazy(() => import("@pages/HomePage").then((m) => ({ default: m.HomePage })))
const AuthPage = lazy(() => import("@pages/AuthPage").then((m) => ({ default: m.AuthPage })))

export const appRoutes: RouteConfig[] = [{ path: RouteNames.Home, element: <HomePage /> }]

export const publicRoutes: RouteConfig[] = [{ path: RouteNames.Auth, element: <AuthPage /> }]

import { RouteNames } from "@constants/routeNames"
import { AppShell, Box, LoadingOverlay } from "@mantine/core"
import { useLoaderStore } from "@store/loaderStore"
import { Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"

import classes from "./classes.module.css"

// Pages that own a full-height, internally-scrolling table (instead of scrolling Main).
const FILL_HEIGHT_ROUTES = new Set<string>([RouteNames.Home])

/**
 * Main content area of the app (AppShell.Main).
 * Shows the global LoadingOverlay and renders child routes via `<Outlet />`.
 * On fill-height routes (the users table) it switches Main to a flex column so the page can
 * stretch the table to the full viewport height and the table scrolls, not the page.
 */
export function Main() {
  const { pathname } = useLocation()
  const { isLoading } = useLoaderStore()
  const isFillHeight = FILL_HEIGHT_ROUTES.has(pathname)

  return (
    <AppShell.Main
      classNames={{ main: [classes.root, isFillHeight && classes.fill].filter(Boolean).join(" ") }}
    >
      <LoadingOverlay visible={isLoading} />

      <Suspense fallback={<LoadingOverlay visible />}>
        {isFillHeight ? (
          <Box style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <Outlet />
          </Box>
        ) : (
          <Outlet />
        )}
      </Suspense>
    </AppShell.Main>
  )
}

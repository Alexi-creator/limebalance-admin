import { AppShell, LoadingOverlay } from "@mantine/core"
import { useLoaderStore } from "@store/loaderStore"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"

import classes from "./classes.module.css"

/**
 * Main content area of the app (AppShell.Main).
 * Shows the global LoadingOverlay and renders child routes via `<Outlet />`.
 * Takes no props.
 */
export function Main() {
  const { isLoading } = useLoaderStore()

  return (
    <AppShell.Main classNames={{ main: classes.root }}>
      <LoadingOverlay visible={isLoading} />

      <Suspense fallback={<LoadingOverlay visible />}>
        <Outlet />
      </Suspense>
    </AppShell.Main>
  )
}

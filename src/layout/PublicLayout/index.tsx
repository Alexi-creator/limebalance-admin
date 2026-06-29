import { ThemeToggle } from "@components/ThemeToggle"
import { usePageTracking } from "@hooks/usePageTracking"
import { AppShell, Box, Group, LoadingOverlay, Text } from "@mantine/core"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"

/**
 * Layout for public pages (login).
 * Shows a minimalist header with the app name and the theme toggle.
 * Takes no props.
 */
export function PublicLayout() {
  usePageTracking()

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Box
              w={26}
              h={26}
              bg="lime.4"
              c="var(--app-logo-ink)"
              ff="monospace"
              fw={600}
              fz={14}
              style={{ borderRadius: 8, display: "grid", placeItems: "center" }}
            >
              L
            </Box>
            <Text fw={700} size="lg">
              LimeBalance Admin
            </Text>
          </Group>
          <Group>
            <ThemeToggle />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Suspense fallback={<LoadingOverlay visible />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  )
}

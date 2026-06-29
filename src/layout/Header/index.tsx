import { ThemeToggle } from "@components/ThemeToggle"
import { AppShell, Box, Burger, Group } from "@mantine/core"
import { useSidebarStore } from "@store/sidebarStore"
import classes from "./classes.module.css"

/**
 * Top app bar (AppShell.Header).
 * Contains the burger for the mobile menu and the theme toggle.
 * Reads the mobile menu state from `sidebarStore`. Takes no props.
 */
export function Header() {
  const opened = useSidebarStore((s) => s.opened)
  const toggle = useSidebarStore((s) => s.toggle)

  return (
    <AppShell.Header className={classes.root}>
      <Group h="100%" px="md" gap="md" wrap="nowrap">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <Group gap="xs" ml="auto" wrap="nowrap">
          <Box visibleFrom="sm">
            <ThemeToggle />
          </Box>
        </Group>
      </Group>
    </AppShell.Header>
  )
}

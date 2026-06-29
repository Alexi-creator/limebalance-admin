import { ThemeToggle } from "@components/ThemeToggle"
import { Box, Divider, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconMoonStars } from "@tabler/icons-react"
import type { ReactNode } from "react"

/** A single labeled row: leading icon + caption on the left, control on the right. */
function ExtrasRow({
  icon,
  label,
  control,
}: {
  icon: ReactNode
  label: string
  control: ReactNode
}) {
  return (
    <Group justify="space-between" wrap="nowrap" px="xs" py={4} gap="sm">
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        <ThemeIcon variant="default" size={30} radius="md">
          {icon}
        </ThemeIcon>
        <Text size="sm" fw={500} truncate>
          {label}
        </Text>
      </Group>
      <Box style={{ flexShrink: 0 }}>{control}</Box>
    </Group>
  )
}

/**
 * Mobile-only extras block surfaced inside the left drawer (the header hides these on `sm`).
 * Laid out as a titled section that matches the sidebar's nav styling.
 */
export function SidebarMobileExtras() {
  return (
    <Box hiddenFrom="sm">
      <Divider my="xs" />

      <Text
        ff="monospace"
        size="xs"
        c="dimmed"
        tt="uppercase"
        px="xs"
        pb={6}
        style={{ letterSpacing: "0.06em" }}
      >
        Preferences
      </Text>

      <Stack gap={2}>
        <ExtrasRow icon={<IconMoonStars size={16} />} label="Theme" control={<ThemeToggle />} />
      </Stack>
    </Box>
  )
}

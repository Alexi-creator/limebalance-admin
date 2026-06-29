import { Stack, Text, Title } from "@mantine/core"

/**
 * Placeholder landing page for the authenticated admin area. Real admin pages are
 * built on top of this shell in the next stage.
 */
export function HomePage() {
  return (
    <Stack gap="xs">
      <Title order={2}>Overview</Title>
      <Text c="dimmed">Admin panel shell is ready. Pages come next.</Text>
    </Stack>
  )
}

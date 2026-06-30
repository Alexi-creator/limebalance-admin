import { RouteNames } from "@constants/routeNames"
import { Button, Stack, Text, Title } from "@mantine/core"
import { Link } from "react-router-dom"

/** Catch-all 404 for unknown paths. Rendered inside the authenticated shell. */
export function NotFoundPage() {
  return (
    <Stack align="center" justify="center" gap="xs" style={{ flex: 1, minHeight: 320 }}>
      <Title order={1} size={72} c="dimmed">
        404
      </Title>
      <Text c="dimmed">This page does not exist.</Text>
      <Button component={Link} to={RouteNames.Home} mt="md">
        Back to users
      </Button>
    </Stack>
  )
}

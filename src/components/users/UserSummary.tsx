import type { AdminUser } from "@appTypes/adminUser"
import { Badge, Group, Paper, Stack, Text } from "@mantine/core"

/** Compact card identifying the user a modal acts on: email/name + role badge. */
export function UserSummary({ user }: { user: AdminUser }) {
  return (
    <Paper withBorder p="sm" bg="var(--mantine-color-default)">
      <Group justify="space-between" wrap="nowrap" gap="sm">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} truncate="end">
            {user.email ?? "—"}
          </Text>
          {user.name && (
            <Text size="xs" c="dimmed" truncate="end">
              {user.name}
            </Text>
          )}
        </Stack>
        <Badge variant="light" color={user.role === "ADMIN" ? "violet" : "gray"} size="sm">
          {user.role}
        </Badge>
      </Group>
    </Paper>
  )
}

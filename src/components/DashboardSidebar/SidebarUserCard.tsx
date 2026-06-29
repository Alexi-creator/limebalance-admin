import { logout } from "@api/auth"
import { ActionIcon, Avatar, Box, Group, Paper, Text, Tooltip } from "@mantine/core"
import { useAuthStore } from "@store/authStore"
import { IconLogout } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"

/**
 * Current user card with a logout button. Locally subscribed to authStore
 * via selectors, so it re-renders only when the user changes, not on navigation.
 */
export function SidebarUserCard() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
    // drop the entire cache of the previous user so a new login does not see someone else's data
    queryClient.clear()
  }

  const initials = (user?.name || user?.email)?.[0]?.toUpperCase() ?? "A"
  const displayName = user?.name || user?.email || "Admin"

  return (
    <Paper p="xs" mt={6} withBorder>
      <Group gap="xs" wrap="nowrap">
        <Avatar size="md" radius="xl" color="lime">
          {initials}
        </Avatar>
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Text size="sm" truncate>
            {displayName}
          </Text>
        </Box>
        <Tooltip label="Sign out" position="right">
          <ActionIcon variant="subtle" color="gray" size="sm" onClick={handleLogout}>
            <IconLogout size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  )
}

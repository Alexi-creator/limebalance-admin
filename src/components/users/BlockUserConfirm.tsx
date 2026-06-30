import { blockUser, unblockUser } from "@api/adminUsers"
import type { AdminUser } from "@appTypes/adminUser"
import { userKeys } from "@constants/queries/users"
import { Button, Group, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useModalStore } from "@store/modalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UserSummary } from "./UserSummary"

/** Confirm blocking / unblocking a user. The action mirrors the user's current block state. */
export function BlockUserConfirm({ user }: { user: AdminUser }) {
  const close = useModalStore((s) => s.close)
  const queryClient = useQueryClient()
  const blocking = !user.isBlocked

  const mutation = useMutation({
    mutationFn: () => (blocking ? blockUser(user.id) : unblockUser(user.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      notifications.show({
        color: "green",
        message: blocking ? "User blocked" : "User unblocked",
      })
      close()
    },
    onError: () => notifications.show({ color: "red", message: "Action failed" }),
  })

  return (
    <Stack gap="md">
      <Text size="sm">
        {blocking
          ? "Block this user? They will be rejected on their next request, on every route."
          : "Unblock this user and restore their access?"}
      </Text>

      <UserSummary user={user} />

      <Group justify="flex-end">
        <Button variant="default" onClick={close} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          color={blocking ? "red" : "green"}
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {blocking ? "Block" : "Unblock"}
        </Button>
      </Group>
    </Stack>
  )
}

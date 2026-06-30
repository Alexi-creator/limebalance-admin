import { deleteUser } from "@api/adminUsers"
import type { AdminUser } from "@appTypes/adminUser"
import { userKeys } from "@constants/queries/users"
import { Button, Group, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useModalStore } from "@store/modalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UserSummary } from "./UserSummary"

/** Confirm permanently deleting a user. All their data is cascade-deleted on the backend. */
export function DeleteUserConfirm({ user }: { user: AdminUser }) {
  const close = useModalStore((s) => s.close)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      notifications.show({ color: "green", message: "User deleted" })
      close()
    },
    onError: () => notifications.show({ color: "red", message: "Delete failed" }),
  })

  return (
    <Stack gap="md">
      <Text size="sm">
        Delete this user permanently? All their data (transactions, categories, goals, tokens) is
        deleted too. This cannot be undone.
      </Text>

      <UserSummary user={user} />

      <Group justify="flex-end">
        <Button variant="default" onClick={close} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button color="red" loading={mutation.isPending} onClick={() => mutation.mutate()}>
          Delete
        </Button>
      </Group>
    </Stack>
  )
}

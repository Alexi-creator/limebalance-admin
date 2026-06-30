import { changePlan } from "@api/adminUsers"
import type { AdminUser } from "@appTypes/adminUser"
import { userKeys } from "@constants/queries/users"
import { Button, Group, Select, Stack, Text } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { notifications } from "@mantine/notifications"
import { useModalStore } from "@store/modalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { UserSummary } from "./UserSummary"

const PLAN_DATA = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "ultra", label: "Ultra" },
]

/** Change a user's plan: pick a plan and an optional expiry (empty = lifetime). */
export function ChangePlanModal({ user }: { user: AdminUser }) {
  const close = useModalStore((s) => s.close)
  const queryClient = useQueryClient()

  const [planName, setPlanName] = useState<string>(user.plan ?? "free")
  // DatePickerInput uses a "YYYY-MM-DD" string value; seed from the current expiry.
  const [expiresAt, setExpiresAt] = useState<string | null>(
    user.planExpiresAt ? user.planExpiresAt.slice(0, 10) : null,
  )

  const mutation = useMutation({
    mutationFn: () =>
      changePlan(user.id, {
        planName,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      notifications.show({ color: "green", message: "Plan updated" })
      close()
    },
    onError: () => notifications.show({ color: "red", message: "Failed to change plan" }),
  })

  return (
    <Stack gap="md">
      <UserSummary user={user} />

      <Select
        label="Plan"
        data={PLAN_DATA}
        value={planName}
        onChange={(v) => setPlanName(v ?? "free")}
        allowDeselect={false}
      />

      <Stack gap={4}>
        <DatePickerInput
          label="Expires at"
          placeholder="No expiry"
          value={expiresAt}
          onChange={setExpiresAt}
          clearable
          valueFormat="DD MMM YYYY"
        />
        <Text size="xs" c="dimmed">
          Leave empty for a lifetime grant
        </Text>
      </Stack>

      <Group justify="flex-end">
        <Button variant="default" onClick={close} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button loading={mutation.isPending} onClick={() => mutation.mutate()}>
          Save
        </Button>
      </Group>
    </Stack>
  )
}

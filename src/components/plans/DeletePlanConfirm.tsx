import { deletePlan } from "@api/adminPlans"
import { ApiError } from "@api/apiError"
import type { Plan } from "@appTypes/plan"
import { planKeys } from "@constants/queries/plans"
import { Button, Group, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useModalStore } from "@store/modalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlanSummary } from "./PlanSummary"

/**
 * Confirm deleting a tariff. The backend rejects deleting the `free` fallback plan or any plan
 * that still has subscribers — those come back as a 409 whose message is shown to the admin.
 */
export function DeletePlanConfirm({ plan }: { plan: Plan }) {
  const close = useModalStore((s) => s.close)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deletePlan(plan.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all })
      notifications.show({ color: "green", message: "Plan deleted" })
      close()
    },
    onError: (err) =>
      notifications.show({
        color: "red",
        message: err instanceof ApiError ? err.message : "Delete failed",
      }),
  })

  return (
    <Stack gap="md">
      <Text size="sm">Delete this tariff permanently? This cannot be undone.</Text>

      <PlanSummary plan={plan} />

      {plan.subscribers > 0 && (
        <Text size="sm" c="red">
          {plan.subscribers} user{plan.subscribers === 1 ? "" : "s"} still on this plan — move them
          to another plan first.
        </Text>
      )}

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

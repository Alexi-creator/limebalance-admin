import { archivePlan, unarchivePlan } from "@api/adminPlans"
import { ApiError } from "@api/apiError"
import type { Plan } from "@appTypes/plan"
import { HttpStatus } from "@constants/httpStatus"
import { planKeys } from "@constants/queries/plans"
import { Button, Group, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useModalStore } from "@store/modalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlanSummary } from "./PlanSummary"

/**
 * Confirm taking a plan off sale (archive) or putting it back (unarchive). Archiving hides the
 * plan from new subscriptions while current subscribers keep their paid term — it's reversible.
 */
export function ArchivePlanConfirm({ plan }: { plan: Plan }) {
  const close = useModalStore((s) => s.close)
  const queryClient = useQueryClient()
  const archiving = !plan.isArchived

  const mutation = useMutation({
    mutationFn: () => (archiving ? archivePlan(plan.id) : unarchivePlan(plan.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all })
      notifications.show({
        color: "green",
        message: archiving ? "Plan archived" : "Plan back on sale",
      })
      close()
    },
    onError: (err) => {
      // the plan vanished under us — refresh the list so the stale row disappears
      if (err instanceof ApiError && err.status === HttpStatus.NOT_FOUND) {
        queryClient.invalidateQueries({ queryKey: planKeys.all })
        notifications.show({ color: "red", message: "Plan not found" })
        close()
        return
      }
      notifications.show({
        color: "red",
        message: err instanceof ApiError ? err.message : "Action failed",
      })
    },
  })

  return (
    <Stack gap="md">
      <Text size="sm">
        {archiving
          ? "The plan will be hidden from new subscriptions. Current subscribers keep their paid term on the old limits and features. You can put it back on sale at any time."
          : "The plan will be available for new subscriptions again."}
      </Text>

      <PlanSummary plan={plan} />

      <Group justify="flex-end">
        <Button variant="default" onClick={close} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          color={archiving ? "orange" : "green"}
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {archiving ? "Archive" : "Return to sale"}
        </Button>
      </Group>
    </Stack>
  )
}

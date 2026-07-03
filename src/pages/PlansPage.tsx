import { getPlans } from "@api/adminPlans"
import { PlanFormModal } from "@components/plans/PlanFormModal"
import { PlansTable } from "@components/plans/PlansTable"
import { PLANS_STALE_TIME, planKeys } from "@constants/queries/plans"
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useModalStore } from "@store/modalStore"
import { IconPlus } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

export function PlansPage() {
  const open = useModalStore((s) => s.open)

  const { data, isLoading, isError } = useQuery({
    queryKey: planKeys.list(),
    queryFn: getPlans,
    staleTime: PLANS_STALE_TIME,
  })

  const plans = data ?? []
  const total = plans.length

  const openCreate = () => open({ centered: true, title: "New plan", children: <PlanFormModal /> })

  return (
    <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Stack gap={4}>
          <Title order={2} size="h3">
            Plans
          </Title>
          <Text size="sm" c="dimmed">
            {total} {total === 1 ? "plan" : "plans"}
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          New plan
        </Button>
      </Group>

      <Paper
        withBorder
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
        }}
      >
        <PlansTable records={plans} fetching={isLoading} isError={isError} />
      </Paper>
    </Stack>
  )
}

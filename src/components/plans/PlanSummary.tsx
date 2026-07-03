import type { Plan } from "@appTypes/plan"
import { planColor } from "@constants/planColors"
import { Badge, Group, Paper, Stack, Text } from "@mantine/core"

/** Compact card identifying the plan a modal acts on: name badge + price and subscriber count. */
export function PlanSummary({ plan }: { plan: Plan }) {
  return (
    <Paper withBorder p="sm" bg="var(--mantine-color-default)">
      <Group justify="space-between" wrap="nowrap" gap="sm">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Badge
            color={planColor(plan.name)}
            variant="light"
            size="sm"
            style={{ alignSelf: "flex-start" }}
          >
            {plan.name}
          </Badge>
          <Text size="xs" c="dimmed">
            ${plan.price.toFixed(2)} · {plan.subscribers}{" "}
            {plan.subscribers === 1 ? "subscriber" : "subscribers"}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}

import type { Plan } from "@appTypes/plan"
import { planColor } from "@constants/planColors"
import { Badge, Group, Text, Tooltip } from "@mantine/core"
import { IconCircleCheckFilled, IconCircleX } from "@tabler/icons-react"
import type { DataTableColumn } from "mantine-datatable"
import { RowActions } from "./RowActions"

/** null limit renders as an infinity glyph — the semantics agreed with the backend (null = unlimited). */
function fmtLimit(value: number | null): string {
  return value === null ? "∞" : String(value)
}

function fmtPrice(value: number): string {
  return `$${value.toFixed(2)}`
}

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <Text component="span" c="green.5" lh={1}>
      <IconCircleCheckFilled size={18} />
    </Text>
  ) : (
    <Text component="span" c="dimmed" lh={1}>
      <IconCircleX size={18} />
    </Text>
  )
}

export function getPlanColumns(): DataTableColumn<Plan>[] {
  return [
    {
      accessor: "name",
      title: "Name",
      width: 180,
      render: (p) => (
        <Group gap={6} wrap="nowrap">
          <Badge color={planColor(p.name)} variant="light" size="sm">
            {p.name}
          </Badge>
          {p.isArchived && (
            <Badge color="gray" variant="outline" size="sm">
              Archived
            </Badge>
          )}
        </Group>
      ),
    },
    {
      accessor: "price",
      title: "Price",
      width: 100,
      textAlign: "right",
      render: (p) => (
        <Text size="sm" ff="monospace">
          {fmtPrice(p.price)}
        </Text>
      ),
    },
    {
      accessor: "maxCategories",
      title: "Categories",
      width: 120,
      textAlign: "right",
      render: (p) => (
        <Text size="sm" ff="monospace" c={p.maxCategories === null ? "dimmed" : undefined}>
          {fmtLimit(p.maxCategories)}
        </Text>
      ),
    },
    {
      accessor: "maxTransactionsPerMonth",
      title: "Transactions / mo",
      width: 150,
      textAlign: "right",
      render: (p) => (
        <Text
          size="sm"
          ff="monospace"
          c={p.maxTransactionsPerMonth === null ? "dimmed" : undefined}
        >
          {fmtLimit(p.maxTransactionsPerMonth)}
        </Text>
      ),
    },
    {
      accessor: "investingAccess",
      title: "Investing",
      width: 100,
      textAlign: "center",
      render: (p) => <BoolIcon value={p.investingAccess} />,
    },
    {
      accessor: "activeSubscribers",
      title: "Subscribers",
      width: 120,
      textAlign: "right",
      render: (p) => (
        <Tooltip withArrow label={`${p.subscribers} total, incl. expired`}>
          <Text size="sm" ff="monospace">
            {p.activeSubscribers}
          </Text>
        </Tooltip>
      ),
    },
    {
      accessor: "actions",
      title: "",
      width: 120,
      textAlign: "center",
      render: (p) => <RowActions plan={p} />,
    },
  ]
}

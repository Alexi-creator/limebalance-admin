import type { AdminUser } from "@appTypes/adminUser"
import { Badge, Group, Text, Tooltip } from "@mantine/core"
import {
  IconBrandGoogleFilled,
  IconBrandTelegram,
  IconCircleCheckFilled,
  IconCircleX,
  IconKey,
} from "@tabler/icons-react"
import { format } from "date-fns"
import type { DataTableColumn } from "mantine-datatable"
import type { ReactNode } from "react"
import { RowActions } from "./RowActions"

const ROLE_COLOR: Record<string, string> = { ADMIN: "violet", USER: "gray" }
const PLAN_COLOR: Record<string, string> = { free: "gray", pro: "blue", ultra: "yellow" }

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  return format(new Date(iso), "dd MMM yyyy")
}

/** Login-method icon: full color when present, dimmed when not. */
function MethodIcon({ active, label, icon }: { active: boolean; label: string; icon: ReactNode }) {
  return (
    <Tooltip label={`${label}: ${active ? "yes" : "no"}`} withArrow>
      <Text component="span" c={active ? undefined : "dimmed"} opacity={active ? 1 : 0.3} lh={1}>
        {icon}
      </Text>
    </Tooltip>
  )
}

export function getUserColumns(): DataTableColumn<AdminUser>[] {
  return [
    {
      accessor: "email",
      title: "Email",
      sortable: true,
      ellipsis: true,
      width: 230,
      render: (u) =>
        u.email ? (
          <Text size="sm">{u.email}</Text>
        ) : (
          <Text size="sm" c="dimmed">
            —
          </Text>
        ),
    },
    {
      accessor: "name",
      title: "Name",
      sortable: true,
      width: 150,
      render: (u) =>
        u.name ? (
          <Text size="sm">{u.name}</Text>
        ) : (
          <Text size="sm" c="dimmed">
            —
          </Text>
        ),
    },
    {
      accessor: "role",
      title: "Role",
      sortable: true,
      width: 90,
      render: (u) => (
        <Badge color={ROLE_COLOR[u.role] ?? "gray"} variant="light" size="sm">
          {u.role}
        </Badge>
      ),
    },
    {
      accessor: "plan",
      title: "Plan",
      sortable: true,
      width: 150,
      render: (u) =>
        u.plan ? (
          <Group gap={6} wrap="nowrap">
            <Badge color={PLAN_COLOR[u.plan] ?? "gray"} variant="light" size="sm">
              {u.plan}
            </Badge>
            {u.planExpiresAt && (
              <Text size="xs" c="dimmed">
                till {fmtDate(u.planExpiresAt)}
              </Text>
            )}
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            —
          </Text>
        ),
    },
    {
      accessor: "status",
      title: "Status",
      width: 90,
      render: (u) =>
        u.isBlocked ? (
          <Badge color="red" variant="light" size="sm">
            Blocked
          </Badge>
        ) : (
          <Badge color="green" variant="light" size="sm">
            Active
          </Badge>
        ),
    },
    {
      accessor: "emailVerified",
      title: "Verified",
      width: 90,
      textAlign: "center",
      render: (u) =>
        u.emailVerified ? (
          <Text component="span" c="green.5" lh={1}>
            <IconCircleCheckFilled size={18} />
          </Text>
        ) : (
          <Text component="span" c="dimmed" lh={1}>
            <IconCircleX size={18} />
          </Text>
        ),
    },
    {
      accessor: "methods",
      title: "Login",
      width: 110,
      render: (u) => (
        <Group gap={8} wrap="nowrap">
          <MethodIcon active={u.hasPassword} label="Password" icon={<IconKey size={17} />} />
          <MethodIcon
            active={u.hasGoogle}
            label="Google"
            icon={<IconBrandGoogleFilled size={17} />}
          />
          <MethodIcon
            active={u.hasTelegram}
            label="Telegram"
            icon={<IconBrandTelegram size={17} />}
          />
        </Group>
      ),
    },
    {
      accessor: "currency",
      title: "Currency",
      sortable: true,
      width: 90,
      render: (u) => <Text size="sm">{u.currency}</Text>,
    },
    {
      accessor: "timezone",
      title: "Timezone",
      width: 150,
      ellipsis: true,
      render: (u) => (
        <Text size="sm" c="dimmed">
          {u.timezone}
        </Text>
      ),
    },
    {
      accessor: "categories",
      title: "Categories",
      sortable: true,
      width: 110,
      textAlign: "right",
      render: (u) => (
        <Tooltip
          withArrow
          label={`${u.counts.expenseCategories} expense / ${u.counts.incomeCategories} income`}
        >
          <Text size="sm" ff="monospace">
            {u.counts.categories}
          </Text>
        </Tooltip>
      ),
    },
    {
      accessor: "transactions",
      title: "Transactions",
      sortable: true,
      width: 120,
      textAlign: "right",
      render: (u) => (
        <Tooltip withArrow label={`${u.counts.expenses} expenses / ${u.counts.incomes} incomes`}>
          <Text size="sm" ff="monospace">
            {u.counts.transactions}
          </Text>
        </Tooltip>
      ),
    },
    {
      accessor: "goals",
      title: "Goals",
      sortable: true,
      width: 80,
      textAlign: "right",
      render: (u) => (
        <Text size="sm" ff="monospace">
          {u.counts.goals}
        </Text>
      ),
    },
    {
      accessor: "createdAt",
      title: "Registered",
      sortable: true,
      width: 130,
      render: (u) => (
        <Text size="sm" c="dimmed">
          {fmtDate(u.createdAt)}
        </Text>
      ),
    },
    {
      accessor: "actions",
      title: "",
      width: 120,
      textAlign: "center",
      render: (u) => <RowActions user={u} />,
    },
  ]
}

import type { AdminUser } from "@appTypes/adminUser"
import { BlockUserConfirm } from "@components/users/BlockUserConfirm"
import { ChangePlanModal } from "@components/users/ChangePlanModal"
import { DeleteUserConfirm } from "@components/users/DeleteUserConfirm"
import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { useModalStore } from "@store/modalStore"
import { IconCreditCard, IconLock, IconLockOpen, IconTrash } from "@tabler/icons-react"

/** Inline action icons for a user row: change plan, block/unblock, delete — each via a modal. */
export function RowActions({ user }: { user: AdminUser }) {
  const open = useModalStore((s) => s.open)

  const openPlan = () =>
    open({ centered: true, title: "Change plan", children: <ChangePlanModal user={user} /> })

  const openBlock = () =>
    open({
      centered: true,
      title: user.isBlocked ? "Unblock user" : "Block user",
      children: <BlockUserConfirm user={user} />,
    })

  const openDelete = () =>
    open({ centered: true, title: "Delete user", children: <DeleteUserConfirm user={user} /> })

  return (
    <Group gap={4} justify="center" wrap="nowrap">
      <Tooltip label="Change plan" withinPortal>
        <ActionIcon
          variant="subtle"
          size="sm"
          color="gray"
          aria-label="Change plan"
          onClick={openPlan}
        >
          <IconCreditCard size={16} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={user.isBlocked ? "Unblock" : "Block"} withinPortal>
        <ActionIcon
          variant="subtle"
          size="sm"
          color={user.isBlocked ? "green" : "orange"}
          aria-label={user.isBlocked ? "Unblock" : "Block"}
          onClick={openBlock}
        >
          {user.isBlocked ? <IconLockOpen size={16} /> : <IconLock size={16} />}
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Delete" withinPortal>
        <ActionIcon variant="subtle" size="sm" color="red" aria-label="Delete" onClick={openDelete}>
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

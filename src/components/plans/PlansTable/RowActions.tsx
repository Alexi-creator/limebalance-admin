import type { Plan } from "@appTypes/plan"
import { DeletePlanConfirm } from "@components/plans/DeletePlanConfirm"
import { PlanFormModal } from "@components/plans/PlanFormModal"
import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { useModalStore } from "@store/modalStore"
import { IconPencil, IconTrash } from "@tabler/icons-react"

/** Inline action icons for a plan row: edit and delete — each via a modal. */
export function RowActions({ plan }: { plan: Plan }) {
  const open = useModalStore((s) => s.open)

  const openEdit = () =>
    open({ centered: true, title: "Edit plan", children: <PlanFormModal plan={plan} /> })

  const openDelete = () =>
    open({ centered: true, title: "Delete plan", children: <DeletePlanConfirm plan={plan} /> })

  return (
    <Group gap={4} justify="center" wrap="nowrap">
      <Tooltip label="Edit" withinPortal>
        <ActionIcon variant="subtle" size="sm" color="gray" aria-label="Edit" onClick={openEdit}>
          <IconPencil size={16} />
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

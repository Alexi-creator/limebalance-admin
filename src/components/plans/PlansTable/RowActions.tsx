import type { Plan } from "@appTypes/plan"
import { ArchivePlanConfirm } from "@components/plans/ArchivePlanConfirm"
import { DeletePlanConfirm } from "@components/plans/DeletePlanConfirm"
import { PlanFormModal } from "@components/plans/PlanFormModal"
import { FREE_PLAN } from "@constants/planColors"
import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { useModalStore } from "@store/modalStore"
import { IconArchive, IconArchiveOff, IconPencil, IconTrash } from "@tabler/icons-react"

/**
 * Inline action icons for a plan row: edit, archive/unarchive and delete.
 * Every action keeps its own slot — unavailable ones are disabled (with a reason in the tooltip),
 * not removed, so the icons line up by type across every row.
 *
 * The `free` fallback plan can only be edited. Delete stays blocked while any subscription row
 * points at the plan (even expired ones) — archiving is how you retire a plan people are on.
 */
export function RowActions({ plan }: { plan: Plan }) {
  const open = useModalStore((s) => s.open)

  const isFree = plan.name === FREE_PLAN

  const openEdit = () =>
    open({ centered: true, title: "Edit plan", children: <PlanFormModal plan={plan} /> })

  const openArchive = () =>
    open({
      centered: true,
      title: plan.isArchived ? "Return plan to sale" : "Archive plan",
      children: <ArchivePlanConfirm plan={plan} />,
    })

  const openDelete = () =>
    open({ centered: true, title: "Delete plan", children: <DeletePlanConfirm plan={plan} /> })

  const archiveLabel = isFree
    ? "The free plan can't be archived"
    : plan.isArchived
      ? "Return to sale"
      : "Archive"

  const deleteDisabled = isFree || plan.subscribers > 0
  const deleteLabel = isFree
    ? "The free plan can't be deleted"
    : plan.activeSubscribers > 0
      ? "Plan has active subscribers — archive it instead"
      : plan.subscribers > 0
        ? "No active subscribers, but expired records remain — use archive for now"
        : "Delete"

  return (
    <Group gap={4} justify="center" wrap="nowrap">
      <Tooltip label="Edit" withinPortal>
        <ActionIcon variant="subtle" size="sm" color="gray" aria-label="Edit" onClick={openEdit}>
          <IconPencil size={16} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={archiveLabel} withinPortal>
        {/* span keeps the tooltip working while the button is disabled */}
        <span>
          <ActionIcon
            variant="subtle"
            size="sm"
            color={plan.isArchived ? "green" : "orange"}
            aria-label={archiveLabel}
            disabled={isFree}
            onClick={openArchive}
          >
            {plan.isArchived ? <IconArchiveOff size={16} /> : <IconArchive size={16} />}
          </ActionIcon>
        </span>
      </Tooltip>

      <Tooltip label={deleteLabel} withinPortal>
        <span>
          <ActionIcon
            variant="subtle"
            size="sm"
            color="red"
            aria-label="Delete"
            disabled={deleteDisabled}
            onClick={openDelete}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </span>
      </Tooltip>
    </Group>
  )
}

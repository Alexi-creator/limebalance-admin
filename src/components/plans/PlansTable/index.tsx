import type { Plan } from "@appTypes/plan"
import { DataTable } from "mantine-datatable"
import { getPlanColumns } from "./settings"

interface Props {
  /** Full plan list (already ordered cheapest-first by the backend). */
  records: Plan[]
  fetching: boolean
  isError: boolean
}

/** Admin tariffs table on `mantine-datatable`: loading/empty states, no pagination (short list). */
export function PlansTable({ records, fetching, isError }: Props) {
  return (
    <DataTable<Plan>
      records={isError ? [] : records}
      columns={getPlanColumns()}
      pinLastColumn
      idAccessor="id"
      fetching={fetching}
      noRecordsText={isError ? "Failed to load plans" : "Nothing found"}
      striped
      highlightOnHover
      verticalSpacing="sm"
      minHeight={160}
      style={{ flex: 1, minHeight: 0 }}
    />
  )
}

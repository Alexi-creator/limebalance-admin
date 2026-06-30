import type { AdminUser } from "@appTypes/adminUser"
import { DataTable, type DataTableSortStatus } from "mantine-datatable"
import { PAGE_SIZE_OPTIONS } from "../config"
import { getUserColumns } from "./settings"

interface Props {
  /** Rows for the current page (already filtered, sorted and sliced by the page). */
  records: AdminUser[]
  /** Total records under the active filters (for pagination). */
  total: number
  page: number
  onPageChange: (page: number) => void
  recordsPerPage: number
  onRecordsPerPageChange: (limit: number) => void
  sortStatus: DataTableSortStatus<AdminUser>
  onSortStatusChange: (status: DataTableSortStatus<AdminUser>) => void
  fetching: boolean
  isError: boolean
}

/** Admin users table on `mantine-datatable`: client-side sort/pagination, loading/empty states. */
export function UsersTable({
  records,
  total,
  page,
  onPageChange,
  recordsPerPage,
  onRecordsPerPageChange,
  sortStatus,
  onSortStatusChange,
  fetching,
  isError,
}: Props) {
  return (
    <DataTable<AdminUser>
      records={isError ? [] : records}
      columns={getUserColumns()}
      pinLastColumn
      idAccessor="id"
      fetching={fetching}
      page={page}
      onPageChange={onPageChange}
      totalRecords={total}
      recordsPerPage={recordsPerPage}
      recordsPerPageOptions={PAGE_SIZE_OPTIONS}
      onRecordsPerPageChange={onRecordsPerPageChange}
      recordsPerPageLabel="Rows per page"
      sortStatus={sortStatus}
      onSortStatusChange={onSortStatusChange}
      noRecordsText={isError ? "Failed to load users" : "Nothing found"}
      striped
      highlightOnHover
      verticalSpacing="sm"
      minHeight={160}
      style={{ flex: 1, minHeight: 0 }}
    />
  )
}

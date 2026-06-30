import { getUsers } from "@api/adminUsers"
import type { AdminUser } from "@appTypes/adminUser"
import { ActiveFilterChips } from "@components/users/ActiveFilterChips"
import { usersParamsSchema } from "@components/users/config"
import { buildFilterChipGroups } from "@components/users/filterChips"
import { filterAndSortUsers } from "@components/users/filtering"
import { UsersFilters } from "@components/users/UsersFilters"
import { UsersTable } from "@components/users/UsersTable"
import { USERS_STALE_TIME, userKeys } from "@constants/queries/users"
import { useUrlParams } from "@hooks/useUrlParams"
import { Group, Paper, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import type { DataTableSortStatus } from "mantine-datatable"
import { useMemo } from "react"

export function UsersPage() {
  const theme = useMantineTheme()
  // below `md` the filters live in a bottom drawer whose handle is fixed to the viewport edge —
  // reserve space so it never covers the table footer/pagination.
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`, true, {
    getInitialValueInEffect: false,
  })
  const [params, setParams] = useUrlParams(usersParamsSchema)

  const { data, isLoading, isError } = useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
    staleTime: USERS_STALE_TIME,
  })

  const users = data ?? []

  // Filter + sort the full list client-side (the endpoint returns every user at once),
  // then slice the current page.
  const filtered = useMemo(() => filterAndSortUsers(users, params), [users, params])
  const total = filtered.length

  const pageRecords = useMemo(() => {
    const start = (params.page - 1) * params.limit
    return filtered.slice(start, start + params.limit)
  }, [filtered, params.page, params.limit])

  const sortStatus: DataTableSortStatus<AdminUser> = {
    columnAccessor: params.sortColumn,
    direction: params.sortDirection,
  }

  return (
    <Stack gap="md" style={{ flex: 1, minHeight: 0, paddingBottom: isDesktop ? 0 : 64 }}>
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Stack gap={4}>
          <Title order={2} size="h3">
            Users
          </Title>
          <Text size="sm" c="dimmed">
            {total} {total === 1 ? "user" : "users"}
          </Text>
        </Stack>
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
        <UsersFilters params={params} setParams={setParams} />

        <ActiveFilterChips groups={buildFilterChipGroups({ params, setParams })} />

        <UsersTable
          records={pageRecords}
          total={total}
          page={params.page}
          onPageChange={(page) => setParams({ page })}
          recordsPerPage={params.limit}
          onRecordsPerPageChange={(limit) => setParams({ limit, page: 1 })}
          sortStatus={sortStatus}
          onSortStatusChange={(status) =>
            setParams({
              sortColumn: String(status.columnAccessor),
              sortDirection: status.direction,
              page: 1,
            })
          }
          fetching={isLoading}
          isError={isError}
        />
      </Paper>
    </Stack>
  )
}

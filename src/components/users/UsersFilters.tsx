import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Overlay,
  Portal,
  Select,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useSidebarStore } from "@store/sidebarStore"
import { IconChevronUp, IconFilter, IconSearch, IconX } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { ActiveFilterChips } from "./ActiveFilterChips"
import type { UsersParams } from "./config"
import {
  METHOD_OPTIONS,
  PLAN_OPTIONS,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  VERIFIED_OPTIONS,
} from "./config"
import { buildFilterChipGroups } from "./filterChips"
import { MultiSelectFilter } from "./MultiSelectFilter"

interface Props {
  params: UsersParams
  setParams: (updates: Partial<UsersParams>) => void
}

/**
 * Filter bar for the users table. Multi-selects (plan, login method) stay compact and surface
 * their picks as removable chips above the table (see ActiveFilterChips). Every change resets
 * pagination back to page 1.
 *
 * Below the `md` breakpoint the controls don't fit in a row, so they move into a bottom drawer:
 * a fixed handle peeks at the bottom edge and slides the panel up on tap.
 */
export function UsersFilters({ params, setParams }: Props) {
  const theme = useMantineTheme()
  // when the mobile nav menu is open, its sheet covers the screen — keep our fixed filter
  // handle/sheet hidden so it doesn't paint over the menu's content
  const menuOpened = useSidebarStore((s) => s.opened)

  // resolve synchronously on first render (no SSR here) to avoid a layout flash
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`, true, {
    getInitialValueInEffect: false,
  })
  const [drawerOpened, drawer] = useDisclosure(false)

  // The handle/sheet should span the content area edge-to-edge — i.e. the `Main` box
  // (sidebar edge → viewport right), not the table card, which is inset by Main's padding.
  // We drop a zero-height anchor, walk up to its <main>, and mirror its left/right gaps onto
  // the fixed handle/sheet — re-measuring on resize and sidebar toggles.
  const anchorRef = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState<{ left: number; right: number } | null>(null)
  useEffect(() => {
    if (isDesktop) return
    const el = anchorRef.current
    if (!el) return
    const target = el.closest("main") ?? el
    const update = () => {
      const r = target.getBoundingClientRect()
      setBounds({ left: r.left, right: window.innerWidth - r.right })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(target)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [isDesktop])

  const reset = () =>
    setParams({
      search: undefined,
      role: "all",
      status: "all",
      verified: "all",
      plan: [],
      method: [],
      page: 1,
    })

  // count of active filters — shown on the mobile handle
  const activeCount =
    (params.search ? 1 : 0) +
    (params.role !== "all" ? 1 : 0) +
    (params.status !== "all" ? 1 : 0) +
    (params.verified !== "all" ? 1 : 0) +
    (params.plan.length > 0 ? 1 : 0) +
    (params.method.length > 0 ? 1 : 0)

  const chipGroups = buildFilterChipGroups({ params, setParams })

  // `vertical` stacks the controls full-width inside the drawer; the row layout keeps the
  // fixed widths used on desktop.
  const controls = (vertical: boolean) => (
    <>
      <TextInput
        label="Search"
        placeholder="Email or name"
        leftSection={<IconSearch size={16} />}
        value={params.search ?? ""}
        onChange={(e) => setParams({ search: e.currentTarget.value, page: 1 })}
        style={vertical ? { width: "100%" } : { width: 220 }}
      />

      <Select
        label="Role"
        data={ROLE_OPTIONS}
        value={params.role}
        onChange={(v) => setParams({ role: (v as UsersParams["role"]) ?? "all", page: 1 })}
        w={vertical ? "100%" : 140}
        allowDeselect={false}
      />

      <Select
        label="Status"
        data={STATUS_OPTIONS}
        value={params.status}
        onChange={(v) => setParams({ status: (v as UsersParams["status"]) ?? "all", page: 1 })}
        w={vertical ? "100%" : 140}
        allowDeselect={false}
      />

      <Select
        label="Email"
        data={VERIFIED_OPTIONS}
        value={params.verified}
        onChange={(v) => setParams({ verified: (v as UsersParams["verified"]) ?? "all", page: 1 })}
        w={vertical ? "100%" : 160}
        allowDeselect={false}
      />

      <MultiSelectFilter
        label="Plan"
        placeholder="Any"
        data={PLAN_OPTIONS}
        value={params.plan}
        onChange={(v) => setParams({ plan: v, page: 1 })}
        summary={(count) => `${count} selected`}
        w={vertical ? "100%" : 180}
      />

      <MultiSelectFilter
        label="Login method"
        placeholder="Any"
        data={METHOD_OPTIONS}
        value={params.method}
        onChange={(v) => setParams({ method: v, page: 1 })}
        summary={(count) => `${count} selected`}
        w={vertical ? "100%" : 180}
      />

      <Button
        variant="light"
        color="red"
        size="sm"
        fullWidth={vertical}
        leftSection={<IconX size={14} />}
        onClick={reset}
      >
        Reset
      </Button>
    </>
  )

  if (isDesktop) {
    return (
      <Group
        p="md"
        gap="sm"
        wrap="wrap"
        align="flex-end"
        style={{ borderBottom: "1px solid var(--mantine-color-default-border)", flexShrink: 0 }}
      >
        {controls(false)}
      </Group>
    )
  }

  return (
    <>
      {/* zero-height marker measured to align the handle/drawer with the table block */}
      <div ref={anchorRef} style={{ height: 0 }} />

      {/* While the mobile nav menu is open it covers the screen — hiding the fixed handle and
          sheet keeps them from painting over the menu's content. */}
      {!menuOpened && (
        <>
          {/* peeking handle pinned to the bottom edge, spanning the table block width */}
          <Portal>
            <UnstyledButton
              onClick={drawer.open}
              aria-label="Filters"
              style={{
                position: "fixed",
                bottom: 0,
                left: bounds?.left ?? 0,
                right: bounds?.right ?? 0,
                zIndex: 190,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                backgroundColor: "var(--mantine-color-body)",
                borderTop: "1px solid var(--mantine-color-default-border)",
                borderTopLeftRadius: "var(--mantine-radius-md)",
                borderTopRightRadius: "var(--mantine-radius-md)",
                boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <IconFilter size={16} />
              <Text size="sm" fw={500}>
                Filters
              </Text>
              {activeCount > 0 && (
                <Badge size="sm" variant="filled" circle>
                  {activeCount}
                </Badge>
              )}
              <IconChevronUp size={16} />
            </UnstyledButton>
          </Portal>

          {/* Slide-up sheet: a plain fixed box pinned to the content-area edges. translateY
              drives the slide; it sits below the viewport when closed, so the peeking handle
              stays visible underneath. */}
          <Portal>
            {drawerOpened && (
              <Overlay onClick={drawer.close} zIndex={195} backgroundOpacity={0.55} />
            )}
            <Box
              style={{
                position: "fixed",
                bottom: 0,
                left: bounds?.left ?? 0,
                right: bounds?.right ?? 0,
                zIndex: 200,
                maxHeight: "80vh",
                overflowY: "auto",
                padding: "var(--mantine-spacing-md)",
                backgroundColor: "var(--mantine-color-body)",
                borderTop: "1px solid var(--mantine-color-default-border)",
                borderTopLeftRadius: "var(--mantine-radius-md)",
                borderTopRightRadius: "var(--mantine-radius-md)",
                boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.25)",
                transform: drawerOpened ? "translateY(0)" : "translateY(101%)",
                transition: "transform 200ms ease",
              }}
            >
              <Group justify="space-between" mb="sm">
                <Text fw={600}>Filters</Text>
                <ActionIcon variant="subtle" color="gray" onClick={drawer.close} aria-label="Close">
                  <IconX size={18} />
                </ActionIcon>
              </Group>
              <Stack gap="sm">
                {/* selected-filter chips, mirrored from the table so the picks are visible here */}
                <ActiveFilterChips groups={chipGroups} px={0} withBorder={false} />
                {controls(true)}
              </Stack>
            </Box>
          </Portal>
        </>
      )}
    </>
  )
}

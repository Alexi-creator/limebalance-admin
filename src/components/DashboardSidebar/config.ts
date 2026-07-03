import { RouteNames } from "@constants/routeNames"
import type { Icon } from "@tabler/icons-react"
import { IconReceipt2, IconUsers } from "@tabler/icons-react"

interface NavItem {
  to: string
  label: string
  icon: Icon
}

interface NavGroup {
  title: string
  items: NavItem[]
}

/**
 * Sidebar navigation groups: section title + items with a route, label, and icon.
 * Placeholder for the admin shell — real sections are added together with their pages.
 */
export const navGroups: NavGroup[] = [
  {
    title: "Menu",
    items: [
      { to: RouteNames.Home, label: "Users", icon: IconUsers },
      { to: RouteNames.Plans, label: "Plans", icon: IconReceipt2 },
    ],
  },
]

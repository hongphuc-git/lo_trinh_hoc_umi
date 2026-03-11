import type { SidebarItem } from '~~/types/common'
import {
  Home,
  LayoutDashboardIcon,
} from 'lucide-vue-next'

export const SIDEBAR_LINKS: { navMain: SidebarItem[], navSecondary: SidebarItem[], navAdmin: SidebarItem[] } = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
  ],
  navSecondary: [],
  navAdmin: [
    {
      title: 'Admin Dashboard',
      url: '/admin',
      icon: LayoutDashboardIcon,
    },
  ],
}

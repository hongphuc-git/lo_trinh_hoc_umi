import type { SidebarItem } from '~~/types/common'
import {
  BookOpenIcon,
  Home,
  LayoutDashboardIcon,
} from 'lucide-vue-next'
import { CURRICULUM } from './curriculum'

export const SIDEBAR_LINKS: { navMain: SidebarItem[], navSecondary: SidebarItem[], navAdmin: SidebarItem[] } = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Learning Roadmap',
      url: '/roadmap',
      icon: BookOpenIcon,
      items: CURRICULUM.map(m => ({
        title: `${m.title} – ${m.subtitle}`,
        url: `/roadmap/${m.slug}`,
      })),
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

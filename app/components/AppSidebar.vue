<script setup lang="ts">
import NavMain from '@/components/nav/NavMain.vue'
import NavSecondary from '@/components/nav/NavSecondary.vue'
import NavUser from '@/components/nav/NavUser.vue'
import type { SidebarProps } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar/utils'
import { SIDEBAR_LINKS } from '@/constants/sidebar'

import { Separator } from './ui/separator'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
})

const { open } = useSidebar()
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <NavUser />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="SIDEBAR_LINKS.navMain" />
      <AuthState v-slot="{ user }">
        <NavMain
          v-if="user?.isAdmin"
          title="Admin"
          :items="SIDEBAR_LINKS.navAdmin"
        />
      </AuthState>
      <NavSecondary
        :items="SIDEBAR_LINKS.navSecondary"
        class="mt-auto"
      />
    </SidebarContent>
    <Separator />
    <SidebarFooter>
      <span
        v-show="open"
        class="text-sm text-muted-foreground"
      >
        © {{ new Date().getFullYear() }} {{ useConfig().value.footer.credits }}
      </span>
    </SidebarFooter>
  </Sidebar>
</template>

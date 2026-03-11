<template>
  <div>
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <slot />
      </SidebarInset>
    </SidebarProvider>
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import BackToTop from '@/components/BackToTop.vue'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

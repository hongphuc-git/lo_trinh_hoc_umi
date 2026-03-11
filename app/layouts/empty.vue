<template>
  <SidebarProvider>
    <SidebarInset>
      <AuroraBackground>
        <Motion
          as="div"
          :initial="{ opacity: 0, filter: 'blur(10px)' }"
          :while-in-view="{
            opacity: 1,
            filter: 'blur(0px)',
          }"
          class="w-full relative"
        >
          <slot />
        </Motion>
      </AuroraBackground>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import 'vue-sonner/style.css'
import { Motion } from 'motion-v'
</script>

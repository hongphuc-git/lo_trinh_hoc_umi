<script setup lang="ts">
import type { VueElement } from 'vue'

import { APP_MANIFEST } from '@/constants/manifest'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import MaxWidthWrapper from './MaxWidthWrapper.vue'
import { HomeIcon } from 'lucide-vue-next'

withDefaults(defineProps<{
  title: string
  titleBackButtonLink?: string
  titleControls?: VueElement
  className?: string
  hideSidebarTrigger?: boolean
  centerContent?: boolean
  fullWidth?: boolean
}>(), {
  hideSidebarTrigger: false,
  centerContent: false,
  fullWidth: false,
})
</script>

<template>
  <div :class="cn('flex flex-col min-h-screen', className)">
    <header
      class="sticky top-0 z-10 border-b md:rounded-t-xl flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div class="flex items-center gap-2 px-4">
        <SidebarTrigger
          v-if="!hideSidebarTrigger"
          class="-ml-1"
        />
        <Button
          v-else
          variant="ghost"
          size="icon"
          class="h-7 w-7 -ml-1"
          @click="navigateTo('/')"
        >
          <HomeIcon />
          <span class="sr-only">Toggle Sidebar</span>
        </Button>
        <Separator
          orientation="vertical"
          class="mr-2 h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="/">
                {{ APP_MANIFEST.short_name }}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{{ title }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div
          v-if="titleControls"
          class="ml-auto"
        >
          <component :is="titleControls" />
        </div>
      </div>
    </header>

    <div :class="cn('flex-1', centerContent ? 'flex items-center justify-center' : '')">
      <MaxWidthWrapper
        v-if="!fullWidth"
        :class-name="centerContent ? 'flex items-center justify-center min-h-full' : ''"
      >
        <slot />
      </MaxWidthWrapper>
      <div
        v-else
        :class="cn('w-full h-full', centerContent ? 'flex items-center justify-center min-h-full px-4' : 'px-4')"
      >
        <slot />
      </div>
    </div>

    <footer class="border-t">
      <div class="px-4 py-6">
        <p class="text-center text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} Developed by <strong>No Name Studio</strong> All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

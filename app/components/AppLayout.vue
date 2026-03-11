<script setup lang="ts">
import type { VueElement } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
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
import type { BreadcrumbItemType } from '@/composables/useBreadcrumb'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed<BreadcrumbItemType[]>(() => {
  const path = route.path
  const crumbs: BreadcrumbItemType[] = [{ title: 'Home', href: '/' }]

  if (path === '/') return crumbs

  const segments = path.split('/').filter(Boolean)
  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Try to find a matching route record to get meta
    const match = router.resolve(currentPath)

    let title = segment
    if (match && match.meta && (match.meta.breadcrumb || match.meta.title)) {
      title = (match.meta.breadcrumb as string) || (match.meta.title as string)
    }
    else {
      // Capitalize
      title = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    // If it's the last segment, it matches the current route
    // We can check if the current route has specific meta that overrides the segment name
    if (index === segments.length - 1) {
      if (route.meta.breadcrumb || route.meta.title) {
        title = (route.meta.breadcrumb as string) || (route.meta.title as string)
      }
    }

    crumbs.push({
      title,
      href: currentPath,
    })
  })

  return crumbs
})

withDefaults(defineProps<{
  titleControls?: VueElement
  className?: string
  hideSidebarTrigger?: boolean
}>(), {
  hideSidebarTrigger: false,
})
</script>

<template>
  <div>
    <header
      class="sticky top-0 z-10 bg-background border-b md:rounded-t-xl flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
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
          class="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList class="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink :href="breadcrumbs[0]?.href">
                {{ breadcrumbs[0]?.title }}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="breadcrumbs.length > 1" />
            <template v-if="breadcrumbs.length > 2">
              <BreadcrumbItem class="md:hidden">
                <BreadcrumbEllipsis class="h-4 w-4" />
              </BreadcrumbItem>
              <BreadcrumbSeparator class="md:hidden" />
            </template>
            <template
              v-for="crumb in breadcrumbs.slice(1, -1)"
              :key="crumb.href"
            >
              <BreadcrumbItem class="hidden md:inline-flex">
                <BreadcrumbLink :href="crumb.href">
                  {{ crumb.title }}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
            </template>
            <BreadcrumbItem v-if="breadcrumbs.length > 1">
              <BreadcrumbPage class="max-w-20 truncate md:max-w-none">
                {{ breadcrumbs[breadcrumbs.length - 1]?.title }}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto flex items-center gap-2">
          <component
            :is="titleControls"
            v-if="titleControls"
          />
        </div>
      </div>
    </header>
    <div class="flex flex-1 flex-col">
      <div class="@container/main flex flex-1 flex-col gap-2 min-h-screen">
        <MaxWidthWrapper
          :class="cn(
            'flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6',
            className,
          )"
        >
          <slot />
        </MaxWidthWrapper>
      </div>
    </div>
  </div>
</template>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        :class="cn(
          'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
          isDisabled && 'opacity-75 cursor-not-allowed',
        )
        "
        :disabled="isDisabled"
        @click="onInstallClick"
      >
        <span :class="cn(isDialogOpen ? 'mr-4' : '')">
          <Check
            v-if="isPWA"
            :size="18"
          />
          <Download
            v-else
            :size="18"
          />
        </span>
        <p :class="cn('whitespace-nowrap', !sidebarOpen ? 'opacity-0 hidden' : 'opacity-100')">
          {{ isPWA ? 'Installed' : 'Install App' }}
        </p>
        <span
          v-if="isPWA"
          class="ml-2 text-xs text-muted-foreground"
        >
          {{ version || 'Beta' }}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>

  <Dialog
    :open="isDialogOpen"
    @update:open="onDialogClose"
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader class="text-center pb-4">
        <div class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Smartphone class="h-6 w-6 text-primary" />
        </div>
        <DialogTitle class="text-xl font-semibold">
          Install App
        </DialogTitle>
        <DialogDescription class="text-muted-foreground">
          Get the best experience with our progressive web app
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="grid gap-3">
          <div
            v-for="i in INSTALL_PROMPTER_FEATURES"
            :key="i.title"
            class="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
          >
            <div :class="`w-8 h-8 bg-${i.colorClass}-500/10 rounded-full flex items-center justify-center shrink-0`">
              <component
                :is="i.icon"
                :class="`h-4 w-4 text-${i.colorClass}-600`"
              />
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium">
                {{ i.title }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ i.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="border-t pt-4">
          <p class="text-xs text-muted-foreground text-center">
            Takes up minimal storage space on your device
          </p>
        </div>
      </div>

      <DialogFooter class="flex-col sm:flex-row gap-2 pt-4">
        <Button
          variant="ghost"
          class="w-full sm:w-auto"
          @click="onDialogClose"
        >
          Not Now
        </Button>
        <Button
          class="w-full sm:w-auto group"
          @click="onInstallPWA"
        >
          Install App
          <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ArrowRight, Check, Download, Smartphone } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { INSTALL_PROMPTER_FEATURES } from '@/constants/homedata'

const { $pwa } = useNuxtApp()

const config = useRuntimeConfig()
const version = config.public.NUXT_APP_VERSION

const isPWA = computed(() => $pwa?.isPWAInstalled ?? false)
const isInstallable = ref(true)
const isDialogOpen = ref(false)

const isDisabled = computed(() => !isInstallable.value || isPWA.value)

function onInstallClick() {
  if (isDisabled.value) return
  isDialogOpen.value = true
}

async function onInstallPWA() {
  isDialogOpen.value = false
  if (isPWA.value) return
  try {
    const outcome = await $pwa?.install()
    if (outcome?.outcome === 'accepted') {
      isInstallable.value = false
    }
  }
  catch {
    // ignore
  }
}

function onDialogClose() {
  isDialogOpen.value = false
}

withDefaults(defineProps<{
  sidebarOpen?: boolean
}>(), {
  sidebarOpen: true,
})
</script>

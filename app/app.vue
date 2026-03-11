<template>
  <NuxtLoadingIndicator
    :color="false"
    class="z-100 bg-primary/80"
  />
  <TooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </TooltipProvider>
  <Toaster class="pointer-events-auto" />
</template>

<script lang="ts" setup>
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'

const { $pwa } = useNuxtApp()

onMounted(() => {
  if ($pwa?.needRefresh)
    toast.warning('New update available! Update will be applied on next reload.', {
      action: {
        label: 'Reload',
        onClick: () => $pwa.updateServiceWorker(),
      },
    })
})
</script>

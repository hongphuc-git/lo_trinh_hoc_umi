<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Drawer, DrawerContent } from '@/components/ui/drawer'

const isDesktop = useMediaQuery('(min-width: 768px)')

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog
    v-if="isDesktop"
    v-bind="forwarded"
  >
    <DialogContent
      class="p-0 md:max-w-[900px] lg:max-w-[1000px] sm:max-w-[550px] max-w-[95vw] h-[80vh] max-h-[80vh] flex flex-col"
    >
      <div class="flex-1 min-h-0 overflow-hidden">
        <slot />
      </div>
    </DialogContent>
  </Dialog>

  <Drawer
    v-else
    v-bind="forwarded"
  >
    <DrawerContent class="h-[85vh] max-h-[85vh] flex flex-col">
      <div class="flex-1 min-h-0">
        <slot />
      </div>
    </DrawerContent>
  </Drawer>
</template>

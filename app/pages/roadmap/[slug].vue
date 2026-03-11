<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CURRICULUM } from '@/constants/curriculum'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  TargetIcon,
  WrenchIcon,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const moduleIndex = computed(() =>
  CURRICULUM.findIndex(m => m.slug === slug.value),
)

const mod = computed(() => CURRICULUM[moduleIndex.value])

const prevModule = computed(() =>
  moduleIndex.value > 0 ? CURRICULUM[moduleIndex.value - 1] : null,
)

const nextModule = computed(() =>
  moduleIndex.value < CURRICULUM.length - 1 ? CURRICULUM[moduleIndex.value + 1] : null,
)

// Set page meta dynamically
useHead({
  title: computed(() => mod.value ? `${mod.value.title} – ${mod.value.subtitle}` : 'Not Found'),
})

useSeo({
  title: mod.value ? `${mod.value.title} – ${mod.value.subtitle}` : 'Module Not Found',
  description: mod.value?.objective ?? '',
})

const categoryLabel = (cat: string) => {
  switch (cat) {
    case 'physics': return 'Physics'
    case 'ai': return 'AI'
    case 'tools': return 'Tools'
    default: return cat
  }
}

const categoryBadgeVariant = (cat: string) => {
  switch (cat) {
    case 'physics': return 'default' as const
    case 'ai': return 'secondary' as const
    case 'tools': return 'outline' as const
    default: return 'default' as const
  }
}
</script>

<template>
  <AppLayout>
    <template v-if="mod">
      <!-- Module Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <component :is="mod.icon" class="h-7 w-7" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold tracking-tight md:text-3xl">
                {{ mod.title }}
              </h1>
              <Badge :variant="categoryBadgeVariant(mod.category)">
                {{ categoryLabel(mod.category) }}
              </Badge>
            </div>
            <p class="text-lg text-muted-foreground">
              {{ mod.subtitle }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-muted-foreground">{{ mod.progress }}%</span>
          <Progress :model-value="mod.progress" class="h-3 w-32" />
        </div>
      </div>

      <Separator />

      <!-- Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Objective -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2 text-base">
              <TargetIcon class="h-5 w-5 text-primary" />
              Mục tiêu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground leading-relaxed">
              {{ mod.objective }}
            </p>
          </CardContent>
        </Card>

        <!-- Exercise -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2 text-base">
              <WrenchIcon class="h-5 w-5 text-primary" />
              Bài tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground leading-relaxed">
              {{ mod.exercise }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Content List -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-2 text-base">
            <BookOpenIcon class="h-5 w-5 text-primary" />
            Nội dung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3">
            <li
              v-for="item in mod.content"
              :key="item"
              class="flex items-start gap-3 text-muted-foreground"
            >
              <CheckCircle2Icon class="mt-0.5 h-5 w-5 shrink-0 text-primary/60" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Previous / Next Navigation -->
      <div class="flex items-center justify-between pt-2">
        <Button
          v-if="prevModule"
          variant="outline"
          as-child
        >
          <NuxtLink :to="`/roadmap/${prevModule.slug}`" class="flex items-center gap-2">
            <ArrowLeftIcon class="h-4 w-4" />
            {{ prevModule.title }}
          </NuxtLink>
        </Button>
        <div v-else />

        <Button
          v-if="nextModule"
          as-child
        >
          <NuxtLink :to="`/roadmap/${nextModule.slug}`" class="flex items-center gap-2">
            {{ nextModule.title }}
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </Button>
      </div>
    </template>

    <!-- Not found state -->
    <template v-else>
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <h2 class="text-2xl font-bold">
          Module không tồn tại
        </h2>
        <p class="mt-2 text-muted-foreground">
          Không tìm thấy module với slug "{{ slug }}"
        </p>
        <Button as-child class="mt-6">
          <NuxtLink to="/roadmap">
            Quay về Roadmap
          </NuxtLink>
        </Button>
      </div>
    </template>
  </AppLayout>
</template>

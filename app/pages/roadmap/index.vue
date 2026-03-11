<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import RoadmapRadarChart from '@/components/RoadmapRadarChart.vue'
import { CURRICULUM, RADAR_DATA, CATEGORIES } from '@/constants/curriculum'
import { ArrowRightIcon } from 'lucide-vue-next'

definePageMeta({
  title: 'Learning Roadmap',
  breadcrumb: 'Learning Roadmap',
  layout: 'dashboard',
})

useSeo({
  title: 'UMI LAB Learning Roadmap',
  description: 'Lộ trình nghiên cứu Ultrasonic AI 6 tháng tại UMI LAB',
})

const categoryBadgeVariant = (cat: string) => {
  switch (cat) {
    case 'physics': return 'default'
    case 'ai': return 'secondary'
    case 'tools': return 'outline'
    default: return 'default'
  }
}
</script>

<template>
  <AppLayout>
    <!-- Hero Header -->
    <div class="mb-2">
      <h1 class="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
        UMI LAB Learning Roadmap
      </h1>
      <p class="mt-2 text-muted-foreground text-lg">
        Lộ trình nghiên cứu Ultrasonic AI — từ sóng Lamb đến Physics-Informed Neural Networks
      </p>
    </div>

    <!-- Main grid: Timeline Cards + Radar Chart -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Timeline Cards (2/3 width) -->
      <div class="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="mod in CURRICULUM"
          :key="mod.slug"
          :to="`/roadmap/${mod.slug}`"
          class="group block"
        >
          <Card class="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <Badge :variant="categoryBadgeVariant(mod.category)">
                  {{ mod.category }}
                </Badge>
                <span class="text-xs text-muted-foreground">{{ mod.progress }}%</span>
              </div>
              <CardTitle class="mt-2 text-lg">
                <component
                  :is="mod.icon"
                  class="inline-block mr-2 h-5 w-5 text-primary"
                />
                {{ mod.title }}
              </CardTitle>
              <CardDescription>{{ mod.subtitle }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress :model-value="mod.progress" class="h-2" />
              <p class="mt-3 text-sm text-muted-foreground line-clamp-2">
                {{ mod.objective }}
              </p>
              <div class="mt-3 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Xem chi tiết
                <ArrowRightIcon class="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </NuxtLink>
      </div>

      <!-- Radar Chart (1/3 width) -->
      <div>
        <Card class="sticky top-24">
          <CardHeader>
            <CardTitle>Research Progress</CardTitle>
            <CardDescription>Tiến độ nghiên cứu theo lĩnh vực</CardDescription>
          </CardHeader>
          <CardContent>
            <RoadmapRadarChart
              :labels="RADAR_DATA.labels"
              :values="RADAR_DATA.values"
            />
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Category Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        v-for="cat in CATEGORIES"
        :key="cat.name"
      >
        <CardHeader class="pb-2">
          <CardTitle class="text-base">
            <span :class="cat.color">●</span>
            {{ cat.name }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ cat.description }}
          </p>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

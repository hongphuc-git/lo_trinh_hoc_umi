<script setup lang="ts">
/**
 * RoadmapRadarChart — Pure SVG radar chart component.
 * No external dependencies (replaces original Chart.js).
 */

const props = withDefaults(defineProps<{
  labels: string[]
  values: number[]
  size?: number
}>(), {
  size: 260,
})

const center = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - 30)
const count = computed(() => props.labels.length)

// Convert polar to cartesian (0° = top)
function polarToXY(angle: number, r: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: center.value + r * Math.cos(rad),
    y: center.value + r * Math.sin(rad),
  }
}

// Grid rings at 25%, 50%, 75%, 100%
const rings = [0.25, 0.5, 0.75, 1]

const gridRings = computed(() =>
  rings.map((pct) => {
    const r = radius.value * pct
    const points = Array.from({ length: count.value }, (_, i) => {
      const angle = (360 / count.value) * i
      const { x, y } = polarToXY(angle, r)
      return `${x},${y}`
    })
    return points.join(' ')
  }),
)

// Axis lines from center to each vertex
const axes = computed(() =>
  Array.from({ length: count.value }, (_, i) => {
    const angle = (360 / count.value) * i
    return polarToXY(angle, radius.value)
  }),
)

// Data polygon
const dataPolygon = computed(() => {
  const points = props.values.map((val, i) => {
    const r = (val / 100) * radius.value
    const angle = (360 / count.value) * i
    const { x, y } = polarToXY(angle, r)
    return `${x},${y}`
  })
  return points.join(' ')
})

// Label positions (slightly outside the outer ring)
const labelPositions = computed(() =>
  props.labels.map((label, i) => {
    const angle = (360 / count.value) * i
    const { x, y } = polarToXY(angle, radius.value + 18)
    return { label, x, y }
  }),
)
</script>

<template>
  <div class="flex items-center justify-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="overflow-visible"
    >
      <!-- Grid rings -->
      <polygon
        v-for="(ring, idx) in gridRings"
        :key="'ring-' + idx"
        :points="ring"
        fill="none"
        class="stroke-border"
        stroke-width="1"
      />

      <!-- Axis lines -->
      <line
        v-for="(axis, idx) in axes"
        :key="'axis-' + idx"
        :x1="center"
        :y1="center"
        :x2="axis.x"
        :y2="axis.y"
        class="stroke-border"
        stroke-width="1"
      />

      <!-- Data polygon -->
      <polygon
        :points="dataPolygon"
        class="fill-primary/20 stroke-primary"
        stroke-width="2"
      />

      <!-- Data points -->
      <circle
        v-for="(val, i) in values"
        :key="'dot-' + i"
        :cx="polarToXY((360 / count) * i, (val / 100) * radius).x"
        :cy="polarToXY((360 / count) * i, (val / 100) * radius).y"
        r="4"
        class="fill-primary stroke-background"
        stroke-width="2"
      />

      <!-- Labels -->
      <text
        v-for="lp in labelPositions"
        :key="lp.label"
        :x="lp.x"
        :y="lp.y"
        text-anchor="middle"
        dominant-baseline="central"
        class="fill-muted-foreground text-[11px] font-medium"
      >
        {{ lp.label }}
      </text>
    </svg>
  </div>
</template>

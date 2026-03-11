<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'

definePageMeta({
  title: 'Dashboard',
  breadcrumb: 'Dashboard',
  layout: 'dashboard',
  middleware: ['auth'],
})
</script>

<template>
  <AppLayout>
    <span>
      This is a placeholder dashboard page. You can customize this page to display relevant information, statistics, or quick links for your admin users. Consider adding widgets, charts, or summaries that provide insights into your application's data and performance.
    </span>
  </AppLayout>
</template>

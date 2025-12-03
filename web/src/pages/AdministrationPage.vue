<template>
  <QuickMetricsCard />
</template>

<script setup lang="ts">
import QuickMetricsCard from "@/components/administration-layout/QuickMetricsCard.vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Administration", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
])
</script>

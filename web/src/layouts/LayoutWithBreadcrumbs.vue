<template>
  <ExactingBreadcrumbs
    class="pl-4 mb-4 mb-2 mt-n3 mx-n4 text-body-1 font-weight-bold"
    bg-color="yg-moss"
    color="white"
    active-color="#fff"
    :items="breadcrumbs"
  />

  <h2 class="text-h4 mb-4">{{ title }}</h2>

  <router-view />
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import ExactingBreadcrumbs from "@/components/layouts/ExactingBreadcrumbs.vue"

const { title, breadcrumbs } = useBreadcrumbs()
</script>

<style scoped>
/* Breadcrumb disabled state styling */
:deep(.v-breadcrumbs-item--disabled) {
  opacity: 0.7 !important;
}
</style>

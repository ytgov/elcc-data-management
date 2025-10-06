<template>
  <div>
    <ExactingBreadcrumbs
      class="pl-4 mt-n4 mx-n4 mb-3"
      bg-color="yg-moss"
      color="white"
      :items="breadcrumbs"
    />

    <h2 class="text-h4 mb-4">{{ title }}</h2>

    <router-view />
  </div>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import ExactingBreadcrumbs from "@/components/layouts/ExactingBreadcrumbs.vue"

const { title, breadcrumbs } = useBreadcrumbs()
</script>

<style scoped></style>

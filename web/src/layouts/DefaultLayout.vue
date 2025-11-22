<template>
  <DefaultAppBar />

  <v-main>
    <!-- Provides the application the proper gutter -->
    <!-- fill-height causes the main content to fill the entire page -->
    <v-container
      fluid
      class="page-wrapper"
    >
      <PageLoader v-if="isLoading" />

      <ExactingBreadcrumbs
        class="pl-4 mb-4 mb-2 mt-n3 mx-n4 text-body-1 font-weight-bold"
        bg-color="yg-moss"
        color="white"
        active-color="#fff"
        :items="breadcrumbs"
      />
      <h2 class="text-h4 mb-4">{{ title }}</h2>

      <router-view></router-view>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import { useCentreStore } from "@/modules/centre/store"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import PageLoader from "@/components/common/PageLoader.vue"
import DefaultAppBar from "@/components/layouts/DefaultAppBar.vue"
import ExactingBreadcrumbs from "@/components/layouts/ExactingBreadcrumbs.vue"

const centreStore = useCentreStore()
const submissionLinesStore = useSubmissionLinesStore()

const isLoading = ref(true)

onMounted(async () => {
  await Promise.all([
    centreStore.initialize(),
    submissionLinesStore.initialize(),
  ])

  isLoading.value = false
})

const { title, breadcrumbs } = useBreadcrumbs()
</script>

<style scoped>
/* Breadcrumb disabled state styling */
:deep(.v-breadcrumbs-item--disabled) {
  opacity: 0.7 !important;
}
</style>

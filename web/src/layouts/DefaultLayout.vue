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
      <router-view></router-view>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import { useUserStore } from "@/store/UserStore"
import { useCentreStore } from "@/modules/centre/store"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"

import PageLoader from "@/components/common/PageLoader.vue"
import DefaultAppBar from "@/components/layouts/DefaultAppBar.vue"

const userStore = useUserStore()
const centreStore = useCentreStore()
const submissionLinesStore = useSubmissionLinesStore()

const isLoading = ref(true)

onMounted(async () => {
  await Promise.all([
    userStore.initialize(),
    centreStore.initialize(),
    submissionLinesStore.initialize(),
  ])

  isLoading.value = false
})
</script>

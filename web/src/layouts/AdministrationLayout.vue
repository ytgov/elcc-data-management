<template>
  <v-layout>
    <DefaultAppBar />

    <AdministrationSidebarNavigationDrawer />

    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container
        fluid
        class="h-100"
      >
        <h2 class="text-h3 mt-3">{{ title }}</h2>
        <ExactingBreadcrumbs
          class="pl-0 pt-2 mb-1"
          :items="breadcrumbs"
        />

        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import useBreadcrumbs from "@/use/use-breadcrumbs"

import DefaultAppBar from "@/components/layouts/DefaultAppBar.vue"
import ExactingBreadcrumbs from "@/components/layouts/ExactingBreadcrumbs.vue"
import AdministrationSidebarNavigationDrawer from "@/components/administration-layout/AdministrationSidebarNavigationDrawer.vue"

const { title, breadcrumbs } = useBreadcrumbs(undefined, undefined)
</script>

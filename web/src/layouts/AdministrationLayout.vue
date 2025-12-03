<template>
  <v-layout>
    <DefaultAppBar />

    <AdministrationSidebarNavigationDrawer v-model="showNavigationDrawer" />

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

        <!-- Show menu button visible on smaller screens -->
        <v-btn
          v-if="mdAndDown"
          class="mb-6"
          block
          color="primary"
          variant="tonal"
          @click="showNavigationDrawer = !showNavigationDrawer"
        >
          <v-icon
            :size="20"
            start
            >mdi-menu</v-icon
          >
          Menu
        </v-btn>

        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useDisplay } from "vuetify"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import DefaultAppBar from "@/components/layouts/DefaultAppBar.vue"
import ExactingBreadcrumbs from "@/components/layouts/ExactingBreadcrumbs.vue"
import AdministrationSidebarNavigationDrawer from "@/components/administration-layout/AdministrationSidebarNavigationDrawer.vue"

const { mdAndDown } = useDisplay()

const showNavigationDrawer = ref(false)

watchEffect(() => {
  showNavigationDrawer.value = !mdAndDown.value
})

const { title, breadcrumbs } = useBreadcrumbs(undefined, undefined)
</script>

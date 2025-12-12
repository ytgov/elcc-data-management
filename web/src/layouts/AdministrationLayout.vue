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
        <ExactingBreadcrumbs
          class="pl-4 mb-2 mt-n3 mx-n4 text-body-1 font-weight-bold"
          bg-color="yg-moss"
          color="white"
          :items="breadcrumbs"
        />
        <h2 class="text-h3 mb-4">{{ title }}</h2>

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

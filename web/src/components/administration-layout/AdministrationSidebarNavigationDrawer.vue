<template>
  <v-navigation-drawer
    v-model="showDrawer"
    v-bind="$attrs"
    class="leftSidebar"
  >
    <v-list class="py-6 px-4">
      <v-list-subheader
        class="pb-1 text-uppercase text-subtitle-1 font-weight-medium"
        style="padding-inline-start: 4px !important"
      >
        Administration
      </v-list-subheader>
      <v-list-item
        :to="{
          name: 'AdministrationPage',
        }"
        prepend-icon="mdi-view-dashboard"
        exact
      >
        Dashboard
      </v-list-item>
      <v-list-item
        :to="{
          name: 'administration/UsersPage',
        }"
        prepend-icon="mdi-account-group"
        exact
        :active="isActiveByRoutePathStartsWith('/administration/users')"
      >
        Users
      </v-list-item>
      <v-list-item
        :to="{
          name: 'administration/FundingPeriodsPage',
        }"
        prepend-icon="mdi-calendar-clock"
        exact
        :active="isActiveByRoutePathStartsWith('/administration/funding-periods')"
      >
        Funding Periods
      </v-list-item>
      <v-list-item
        :to="{
          name: 'administration/FundingRegionsPage',
        }"
        prepend-icon="mdi-map-marker-radius"
        exact
        :active="isActiveByRoutePathStartsWith('/administration/funding-regions')"
      >
        Funding Regions
      </v-list-item>
      <v-list-item
        :to="{
          name: 'administration/BuildingExpenseCategoriesPage',
        }"
        prepend-icon="mdi-office-building"
        exact
        :active="isActiveByRoutePathStartsWith('/administration/building-expense-categories')"
      >
        Building Expense Categories
      </v-list-item>
      <v-list-item
        :to="{
          name: 'administration/AdministrationSubmissionLinesPage',
        }"
        prepend-icon="mdi-format-list-bulleted"
        exact
        :active="isActiveByRoutePathStartsWith('/administration/submission-lines')"
      >
        Submission Lines
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

const showDrawer = defineModel<boolean>({
  default: true,
})

const route = useRoute()

function isActiveByRoutePathStartsWith(path: string) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
:deep(.v-list-item) {
  margin-bottom: 4px;
  border-radius: 4px;
}

:deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}

:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}
</style>

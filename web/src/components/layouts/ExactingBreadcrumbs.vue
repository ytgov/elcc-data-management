<template>
  <v-breadcrumbs
    class="flex-wrap"
    :items="breadcrumbsWithExactTrueByDefault"
    large
  >
    <template #prepend>
      <v-icon color="white">mdi-home</v-icon>
    </template>
    <template #title="{ item }">
      <transition
        name="breadcrumb-title-fade"
        mode="out-in"
      >
        <v-progress-circular
          v-if="isEmpty(item.title)"
          key="title-loader"
          size="16"
          color="secondary"
          width="1"
          indeterminate
        />
        <span
          v-else
          key="title-text"
        >
          {{ item.title }}
        </span>
      </transition>
    </template>
    <template #divider>
      <v-icon color="white">mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
export { type Breadcrumb } from "@/use/use-breadcrumbs"
</script>

<script lang="ts" setup>
import { computed } from "vue"
import { isEmpty } from "lodash"

import { type Breadcrumb } from "@/use/use-breadcrumbs"

const props = defineProps<{
  items: Breadcrumb[]
}>()

// Changes https://vuetifyjs.com/en/components/breadcrumbs/ default behavior.
// By default v-breadcrumbs will disable all crumbs up to the current page in a nested paths.
// You can prevent this behavior by using exact: true on each applicable breadcrumb in the items array.
const breadcrumbsWithExactTrueByDefault = computed(() =>
  props.items.map((item) => ({
    ...item,
    title: item.title ?? "",
    exact: item.exact ?? true,
  }))
)
</script>

<style scoped>
.breadcrumb-title-fade-enter-active,
.breadcrumb-title-fade-leave-active {
  transition: opacity 0.18s ease;
}
.breadcrumb-title-fade-enter-from,
.breadcrumb-title-fade-leave-to {
  opacity: 0;
}
</style>

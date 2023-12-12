<template>
  <div
    v-if="isLoading || isEmpty(fiscalPeriods)"
    class="d-flex justify-center mt-10"
  >
    <v-progress-circular indeterminate />
  </div>
  <div v-else>
    <v-toolbar
      color="#0097a966"
      density="compact"
    >
      <v-tabs>
        <v-tab
          v-for="{ id, month } in fiscalPeriods"
          :key="id"
          :to="{
            name: 'CentreDashboardEmployeesMonthlyWorksheetPage',
            params: {
              centreId,
              fiscalYearSlug,
              month,
            },
          }"
        >
          {{ month }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <router-view v-if="!isEmpty(defaultMonth)"></router-view>
  </div>
</template>

<script lang="ts" setup>
import { isEmpty } from "lodash"
import { ref, watch, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import { useNotificationStore } from "@/store/NotificationStore"

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const props = defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalYearSlug: {
    type: String,
    required: true,
  },
})

const isLoading = ref(true)
const fiscalPeriods = ref<FiscalPeriod[]>([])
const firstPeriod = computed(() => fiscalPeriods.value[0])
const defaultMonth = computed(() => firstPeriod.value?.month)

async function fetchFiscalPeriods(fiscalYear: string) {
  isLoading.value = true
  try {
    const { fiscalPeriods: newFiscalPeriods } = await fiscalPeriodsApi.list({
      where: {
        fiscalYear,
      },
    })
    fiscalPeriods.value = newFiscalPeriods
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to fetch fiscal periods: ${error}`,
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}

watch<string, true>(
  () => props.fiscalYearSlug,
  async (newSlug) => {
    await fetchFiscalPeriods(newSlug)
  },
  {
    immediate: true,
  }
)

watchEffect(async () => {
  if (route.name !== "CentreDashboardEmployeesPage") {
    return
  }

  if (isEmpty(defaultMonth.value)) {
    return
  }

  await router.push({
    name: "CentreDashboardEmployeesMonthlyWorksheetPage",
    params: {
      centreId: props.centreId,
      fiscalYearSlug: props.fiscalYearSlug,
      month: defaultMonth.value,
    },
  })
})
</script>

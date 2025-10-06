<template>
  <div
    v-if="isLoading || isEmpty(fiscalPeriods)"
    class="d-flex justify-center mt-10"
  >
    <v-progress-circular indeterminate />
  </div>
  <div v-else>
    <v-toolbar
      color="yg-blue-light"
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
import { watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import useFiscalPeriods from "@/use/use-fiscal-periods"

const route = useRoute()
const router = useRouter()

const props = defineProps<{
  centreId: number
  fiscalYearSlug: string
}>()

const fiscalPeriodsQuery = computed(() => ({
  where: {
    fiscalYear: props.fiscalYearSlug,
  },
}))
const { fiscalPeriods, isLoading } = useFiscalPeriods(fiscalPeriodsQuery)

const firstPeriod = computed(() => fiscalPeriods.value[0])
const defaultMonth = computed(() => firstPeriod.value?.month)

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

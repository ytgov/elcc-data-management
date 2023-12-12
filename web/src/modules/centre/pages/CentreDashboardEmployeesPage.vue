<template>
  <div
    v-if="isLoading"
    class="d-flex justify-center mt-10"
  >
    <v-progress-circular indeterminate />
  </div>

  <div
    v-else-if="!isLoading && isEmpty(fiscalPeriods)"
    class="ma-5"
  >
    <p>There are currently no worksheets for {{ fiscalYear }}.</p>
    <v-btn
      color="primary"
      size="small"
      class="mt-3"
      @click="initializeBenefitsForFiscalYear"
      >Add worksheets for {{ fiscalYear }}</v-btn
    >
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
              month: month.toLowerCase(),
            },
          }"
        >
          {{ month }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <router-view v-if="!isEmpty(fiscalPeriods)"> </router-view>
  </div>
</template>

<script lang="ts" setup>
import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import { isEmpty } from "lodash"
import { computed, ref, watchEffect } from "vue"

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

const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))
const isLoading = ref(true)
const fiscalPeriods = ref<FiscalPeriod[]>([])

watchEffect(async () => {
  isLoading.value = true
  try {
    const { fiscalPeriods: newFiscalPeriods } = await fiscalPeriodsApi.list({
      where: {
        fiscalYear: fiscalYear.value,
      },
    })
    fiscalPeriods.value = newFiscalPeriods
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

async function initializeBenefitsForFiscalYear() {
  alert("TODO: initializeBenefitsForFiscalYear")
}
</script>

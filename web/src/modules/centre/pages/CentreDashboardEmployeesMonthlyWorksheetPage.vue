<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ fiscalPeriodFormattedDate }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="section-header">Employee Benefits</h3>

        <EditEmployeeBenefitWidget
          v-if="fiscalPeriodId !== undefined"
          :centre-id="props.centreId"
          :fiscal-period-id="fiscalPeriodId"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="section-header">Wage Enhancements</h3>

        <EditWageEnhancementsWidget
          v-if="fiscalPeriodId !== undefined"
          :centre-id="props.centreId"
          :fiscal-period-id="fiscalPeriodId"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import { useNotificationStore } from "@/store/NotificationStore"
import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import { isEmpty } from "lodash"

import EditEmployeeBenefitWidget from "@/modules/centre/components/EditEmployeeBenefitWidget.vue"
import EditWageEnhancementsWidget from "@/modules/centre/components/EditWageEnhancementsWidget.vue"

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
  month: {
    type: String,
    required: true,
  },
})

const isLoading = ref(true)
const fiscalPeriod = ref<FiscalPeriod>()
const fiscalPeriodId = computed(() => fiscalPeriod.value?.id)
const fiscalPeriodFormattedDate = computed(() => {
  if (isEmpty(fiscalPeriod.value)) return ""

  const { dateStart } = fiscalPeriod.value
  const formattedDate = dateStart.toFormat("MMMM yyyy")
  return formattedDate
})

async function fetchFiscalPeriods(fiscalYear: string, month: string) {
  isLoading.value = true
  try {
    const { fiscalPeriods: newFiscalPeriods } = await fiscalPeriodsApi.list({
      where: {
        fiscalYear,
        month,
      },
    })

    if (isEmpty(newFiscalPeriods)) {
      throw new Error(`No fiscal periods found for ${fiscalYear} ${month}`)
    } else if (newFiscalPeriods.length > 1) {
      throw new Error(`Multiple fiscal periods found for ${fiscalYear} ${month}`)
    }

    fiscalPeriod.value = newFiscalPeriods[0]
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

watch(
  () => [props.fiscalYearSlug, props.month],
  async ([newFiscalYearSlug, newMonth], _) => {
    await fetchFiscalPeriods(newFiscalYearSlug, newMonth)
  },
  { immediate: true }
)
</script>

<style scoped>
.section-header {
  margin-bottom: 10px;
  font-weight: 400;
  background-color: #55b6c2;
  margin-left: -8px;
  padding: 8px;
  border-radius: 4px;
  margin-top: 13px;
}
</style>

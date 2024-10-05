<template>
  <div
    v-if="isLoadingFundingSubmissionLineJsons"
    class="d-flex justify-center mt-10"
  >
    <v-progress-circular indeterminate />
  </div>
  <div
    v-else-if="!isLoadingFundingSubmissionLineJsons && isEmpty(fundingSubmissionLineJsons)"
    class="ma-5"
  >
    <p>There are currently no worksheets for {{ fiscalYear }}.</p>
    <v-btn
      color="primary"
      size="small"
      class="mt-3"
      :loading="isInitializing"
      @click="initializeWorksheetsForFiscalYear"
      >Add worksheets for {{ fiscalYear }}</v-btn
    >
  </div>
  <FundingSubmissionLineJsonEditSheet
    v-else
    :funding-submission-line-json-id="fundingSubmissionLineJsonId"
    class="ma-4"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, upperFirst } from "lodash"

import centresApi from "@/api/centres-api"
import { FiscalPeriodMonths } from "@/api/fiscal-periods-api"
import { useNotificationStore } from "@/store/NotificationStore"
import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"

import FundingSubmissionLineJsonEditSheet from "@/components/funding-submission-line-jsons/FundingSubmissionLineJsonEditSheet.vue"

const notificationStore = useNotificationStore()

const props = defineProps<{
  centreId: number
  fiscalYearSlug: string
  month: FiscalPeriodMonths
}>()

const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))
const monthAsDateName = computed(() => upperFirst(props.month))
const fundingSubmissionLineJsonsQuery = computed(() => ({
  where: {
    centreId: props.centreId,
    fiscalYear: fiscalYear.value,
    dateName: monthAsDateName.value,
  },
  perPage: 1,
}))
const {
  fundingSubmissionLineJsons,
  isLoading: isLoadingFundingSubmissionLineJsons,
  refresh: refreshFundingSubmissionLineJsons,
} = useFundingSubmissionLineJsons(fundingSubmissionLineJsonsQuery)

const fundingSubmissionLineJson = computed(() => fundingSubmissionLineJsons.value[0])
const fundingSubmissionLineJsonId = computed(() => fundingSubmissionLineJson.value?.id)

const isInitializing = ref(false)

async function initializeWorksheetsForFiscalYear() {
  isInitializing.value = true
  try {
    await centresApi.fiscalYear.create(props.centreId, fiscalYear.value)
    notificationStore.notify({
      text: "Fiscal year added",
      variant: "success",
    })
    await refreshFundingSubmissionLineJsons()
  } finally {
    isInitializing.value = false
  }
}
</script>

<style scoped></style>

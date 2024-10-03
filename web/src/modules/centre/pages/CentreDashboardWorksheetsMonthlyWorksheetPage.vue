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
      @click="initializeWorksheetsForFiscalYear"
      >Add worksheets for {{ fiscalYear }}</v-btn
    >
  </div>
  <div
    v-else
    class="ma-4"
  >
    <v-btn
      color="primary"
      class="float-right"
      @click="saveFundingSubmissionLineJson"
      :loading="isSaving"
      >Save</v-btn
    >

    <h2 class="mb-3">{{ dateName }} {{ calendarYear }}</h2>
    <v-btn
      v-if="dateName == FIRST_FISCAL_MONTH_NAME"
      :loading="isReplicatingEstimates"
      color="yg_sun"
      class="float-right mb-3"
      size="small"
      @click="replicateEstimatesForward"
    >
      <v-icon>mdi-content-copy</v-icon> Replicate Estimates
    </v-btn>

    <div
      v-for="({ sectionName, lines }, sectionIndex) in sections"
      :key="`${sectionName}-${sectionIndex}`"
      style="clear: both"
    >
      <h4>{{ sectionName }}</h4>

      <SectionTable
        ref="sectionTables"
        :lines="lines"
        @line-changed="propagateUpdatesAsNeeded(sectionIndex, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { groupBy, isEmpty, upperFirst } from "lodash"
import { DateTime } from "luxon"

import centresApi from "@/api/centres-api"
import { FiscalPeriodMonths } from "@/api/fiscal-periods-api"
import fundingSubmissionLineJsonsApi from "@/api/funding-submission-line-jsons-api"
import { useNotificationStore } from "@/store/NotificationStore"
import useFundingSubmissionLineJsons, {
  type FundingLineValue,
} from "@/use/use-funding-submission-line-jsons"

import SectionTable from "@/modules/centre/components/centre-dashboard-worksheets-tab-monthly-worksheet-tab/SectionTable.vue"

const FIRST_FISCAL_MONTH_NAME = "April"

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
const { fundingSubmissionLineJsons, isLoading: isLoadingFundingSubmissionLineJsons } =
  useFundingSubmissionLineJsons(fundingSubmissionLineJsonsQuery)

const fundingSubmissionLineJson = computed(() => fundingSubmissionLineJsons.value[0])
const fundingSubmissionLineJsonId = computed(() => fundingSubmissionLineJson.value?.id)
const dateName = computed(() => fundingSubmissionLineJson.value?.dateName)

const isSaving = ref(false)
const isReplicatingEstimates = ref(false)
const calendarYear = computed(() =>
  DateTime.fromISO(fundingSubmissionLineJson.value?.dateStart).toFormat("yyyy")
)
const sections = computed<{ sectionName: string; lines: FundingLineValue[] }[]>(() => {
  if (isEmpty(fundingSubmissionLineJson.value)) {
    return []
  }

  const lines = fundingSubmissionLineJson.value.lines
  const sectionGroups = groupBy(lines, "sectionName")
  return Object.entries(sectionGroups).map(([sectionName, lines]) => {
    return { sectionName, lines }
  })
})
const sectionTables = ref<InstanceType<typeof SectionTable>[]>([])

async function initializeWorksheetsForFiscalYear() {
  isSaving.value = true
  try {
    await centresApi.fiscalYear.create(props.centreId, fiscalYear.value)
    notificationStore.notify({
      text: "Fiscal year added",
      variant: "success",
    })
  } finally {
    isSaving.value = false
  }
}

async function saveFundingSubmissionLineJson() {
  isSaving.value = true
  try {
    const lines = sections.value.flatMap((section) => section.lines)
    await fundingSubmissionLineJsonsApi.update(fundingSubmissionLineJsonId.value, { lines })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to save worksheet: ${error}`,
      variant: "error",
    })
  } finally {
    isSaving.value = false
  }
}

async function replicateEstimatesForward() {
  isReplicatingEstimates.value = true
  try {
    await saveFundingSubmissionLineJson()
    await fundingSubmissionLineJsonsApi.replicateEstimates(fundingSubmissionLineJsonId.value)
  } catch (error) {
    notificationStore.notify({
      text: `Failed to replicate estimates: ${error}`,
      variant: "error",
    })
  } finally {
    isReplicatingEstimates.value = false
  }
}

function propagateUpdatesAsNeeded(
  sectionIndex: number,
  { line, lineIndex }: { line: FundingLineValue; lineIndex: number }
) {
  // Bind section 1 to sections 2 and 3
  // When you update the values in section 1, it will propagated the values to section 2 and 3
  if (sectionIndex === 0) {
    const section1Line = sections.value[1].lines[lineIndex]
    section1Line.estimatedChildOccupancyRate = line.estimatedChildOccupancyRate
    section1Line.actualChildOccupancyRate = line.actualChildOccupancyRate

    sectionTables.value[1].refreshLineTotals(section1Line)

    const section2Line = sections.value[2].lines[lineIndex]
    section2Line.estimatedChildOccupancyRate = line.estimatedChildOccupancyRate
    section2Line.actualChildOccupancyRate = line.actualChildOccupancyRate
    sectionTables.value[2].refreshLineTotals(section2Line)
  }
}
</script>

<style scoped>
h4 {
  margin-bottom: 10px;
  font-weight: 400;
  background-color: #55b6c2;
  margin-left: -8px;
  padding: 8px;
  border-radius: 4px;
  margin-top: 13px;
}
</style>

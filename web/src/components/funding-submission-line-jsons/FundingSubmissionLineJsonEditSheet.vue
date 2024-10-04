<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="table"
  />
  <v-sheet v-else>
    <v-btn
      color="primary"
      class="float-right"
      :loading="isSaving"
      @click="saveFundingSubmissionLineJson"
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
        @focus-on-next-in-column="goToNextSection(sectionIndex, $event)"
        @focus-on-previous-in-column="goToPreviousSection(sectionIndex, $event)"
        @line-changed="propagateUpdatesAsNeeded(sectionIndex, $event)"
      />
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { DateTime } from "luxon"
import { computed, ref, toRefs } from "vue"
import { groupBy, isEmpty, isNil } from "lodash"

import fundingSubmissionLineJsonsApi, {
  type FundingLineValue,
} from "@/api/funding-submission-line-jsons-api"
import { useNotificationStore } from "@/store/NotificationStore"
import useFundingSubmissionLineJson from "@/use/use-funding-submission-line-json"

import SectionTable, {
  ColumnNames,
} from "@/modules/centre/components/centre-dashboard-worksheets-tab-monthly-worksheet-tab/SectionTable.vue"

const FIRST_FISCAL_MONTH_NAME = "April"
const notificationStore = useNotificationStore()

const props = defineProps<{
  fundingSubmissionLineJsonId: number
}>()

const { fundingSubmissionLineJsonId } = toRefs(props)
const { fundingSubmissionLineJson, isLoading } = useFundingSubmissionLineJson(
  fundingSubmissionLineJsonId
)

const isSaving = ref(false)
const isReplicatingEstimates = ref(false)
const dateName = computed(() => fundingSubmissionLineJson.value?.dateName)
const calendarYear = computed(() => {
  if (isNil(fundingSubmissionLineJson.value)) {
    return "..."
  }

  const { dateStart } = fundingSubmissionLineJson.value
  return DateTime.fromISO(dateStart).toFormat("yyyy")
})

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

function goToNextSection(sectionIndex: number, columnName: ColumnNames) {
  if (sectionIndex < sections.value.length - 1) {
    const nextIndex = sectionIndex + 1
    const nextSection = sectionTables.value[nextIndex]
    if (isNil(nextSection)) return

    nextSection.focusOnFirstInColumn(columnName)
  }
}

function goToPreviousSection(sectionIndex: number, columnName: ColumnNames) {
  if (sectionIndex > 0) {
    const previousIndex = sectionIndex - 1
    const previousSection = sectionTables.value[previousIndex]
    if (isNil(previousSection)) return

    previousSection.focusOnLastInColumn(columnName)
  }
}
</script>

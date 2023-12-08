<template>
  <div class="ma-4">
    <v-btn
      color="primary"
      class="float-right"
      @click="save"
      >Save</v-btn
    >

    <h2 class="mb-3">{{ dateName }} {{ year }}</h2>
    <v-btn
      v-if="dateName == 'April'"
      color="yg_sun"
      class="float-right mb-3"
      size="small"
      @click="duplicateEstimates"
    >
      <v-icon>mdi-content-copy</v-icon> Replicate Estimates
    </v-btn>

    <v-skeleton-loader
      type="table"
      v-if="isLoading"
    ></v-skeleton-loader>

    <div
      v-for="(lines, sectionName, sectionIndex) in sections"
      style="clear: both"
    >
      <h4>{{ sectionName }}</h4>

      <SectionTable
        :lines="lines"
        @update="propagateUpdatesAsNeeded(sectionIndex, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, computed, ref, Ref } from "vue"
import { groupBy, isEmpty, isEqual, upperFirst } from "lodash"
import moment from "moment"

import useFundingSubmissionLineJsonsStore, {
  FundingLineValue,
} from "@/store/funding-submission-line-jsons"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"

import SectionTable from "./centre-dashboard-worksheets-tab-monthly-worksheet-tab/SectionTable.vue"

const fundingSubmissionLineJsonsStore = useFundingSubmissionLineJsonsStore()

const props = defineProps({
  centreId: {
    type: String,
    required: true,
  },
  // TODO: add support for this prop
  // fiscalYear: {
  //   type: String,
  //   required: true,
  // },
  month: {
    type: String,
    required: true,
  },
})

const centreIdNumber = computed(() => parseInt(props.centreId))
const submissionLinesStore = useSubmissionLinesStore()
const fiscalYear = computed(() => submissionLinesStore.currentFiscalYear)
const dateName = computed(() => upperFirst(props.month))

const isLoading = ref(true)
const year = ref("")
const sections: Ref<{ [key: string]: FundingLineValue[] }> = ref({})

watch<[number, string, string], true>(
  () => [centreIdNumber.value, fiscalYear.value, dateName.value],
  async (newValues, oldValues) => {
    if (isEqual(newValues, oldValues)) {
      return
    }

    const [newCentreId, newFiscalYear, newDateName] = newValues
    // TODO: remove once fiscal year is a prop
    if (isEmpty(newFiscalYear)) {
      return
    }

    isLoading.value = true
    // TODO: swap this to using a direct lookup? It should only every return a single result.
    // I'd prefer an id based lookup, I don't have the id mapped to the fiscal year and date name.
    const fundingSubmissionLineJsons = await fundingSubmissionLineJsonsStore.fetch({
      where: {
        centreId: newCentreId,
        fiscalYear: newFiscalYear,
        dateName: newDateName,
      },
    })
    const fundingSubmissionLineJson = fundingSubmissionLineJsons[0]
    year.value = moment.utc(fundingSubmissionLineJson.dateStart).format("YYYY")
    const lines = fundingSubmissionLineJson.lines
    sections.value = groupBy(lines, "sectionName")
    isLoading.value = false
  },
  {
    immediate: true,
  }
)

function save() {
  // ...mapActions(useCentreStore, ["saveWorksheet",]),
  // await this.saveWorksheet(this.month)
}

function duplicateEstimates() {
  // ...mapActions(useCentreStore, ["duplicateAprilEstimates"]),
  // await this.duplicateAprilEstimates(this.month)
}

function propagateUpdatesAsNeeded(
  sectionIndex: number,
  { line, lineIndex }: { line: FundingLineValue; lineIndex: number }
) {
  console.log("sectionIndex:", JSON.stringify(sectionIndex, null, 2))
  console.log("line:", JSON.stringify(line, null, 2))
  console.log("lineIndex:", JSON.stringify(lineIndex, null, 2))
  // Bind section 1 to sections 2 and 3
  // When you update the values in section 1, it will propagated the values to section 2 and 3
  // if (sectionIndex === 0) {
  //   const section1Line = this.sections[1].lines[lineIndex]
  //   section1Line.estimatedChildOccupancyRate = line.estimatedChildOccupancyRate
  //   section1Line.actualChildOccupancyRate = line.actualChildOccupancyRate
  //   refreshLineTotals(section1Line)
  //   const section2Line = this.sections[2].lines[lineIndex]
  //   section2Line.estimatedChildOccupancyRate = line.estimatedChildOccupancyRate
  //   section2Line.actualChildOccupancyRate = line.actualChildOccupancyRate
  //   refreshLineTotals(section2Line)
  // }
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

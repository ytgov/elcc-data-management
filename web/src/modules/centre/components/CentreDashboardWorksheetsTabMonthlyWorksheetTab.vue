<template>
  <div class="ma-4">
    <v-btn
      color="primary"
      class="float-right"
      >Save</v-btn
    >

    <h2 class="mb-3">{{ dateName }} {{ year }}</h2>
    <v-btn
      v-if="dateName == 'April'"
      color="yg_sun"
      class="float-right mb-3"
      size="small"
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

      <table
        style="width: 100%"
        cellpadding="0"
        cellspacing="0"
        border="0px"
      >
        <tr class="text-left">
          <td style="width: 180px"></td>
          <td
            class="pl-4"
            style="width: 120px"
          >
            Per child
          </td>
          <td
            class="pl-4"
            style="width: 120px"
          >
            Est
          </td>
          <td class="pl-4">Est Total</td>
          <td
            class="pl-4"
            style="width: 120px"
          >
            Act
          </td>
          <td class="pl-4">Act Total</td>
        </tr>
        <tr
          v-for="(line, lineIndex) in lines"
          class="monospace"
        >
          <td>{{ line.lineName }}</td>
          <td>
            <v-text-field
              :value="line.monthlyAmount"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="line.estimatedChildOccupancyRate"
              density="compact"
              hide-details
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :value="line.estimatedComputedTotal"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="line.actualChildOccupancyRate"
              density="compact"
              hide-details
            ></v-text-field>
          </td>

          <td>
            <v-text-field
              :value="line.actualComputedTotal"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
        </tr>
      </table>
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
</script>

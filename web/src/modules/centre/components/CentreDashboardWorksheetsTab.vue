<template>
  <div
    v-if="isEmpty(fundingSubmissionLineJsons)"
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
  <div v-else>
    <v-toolbar
      color="#0097a966"
      density="compact"
    >
      <v-tabs>
        <v-tab
          v-for="month in months"
          :key="month"
          :to="{
            name: 'CentreDashboard-WorksheetsTab-MonthlyWorksheetTab',
            params: {
              centreId,
              month: month.toLowerCase(),
            },
          }"
        >
          {{ month }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <router-view
      v-if="!isEmpty(selectedFundingSubmissionLineJson)"
      v-slot="{ Component }"
    >
      <component
        :is="Component"
        :funding-submission-line-json-id="selectedFundingSubmissionLineJson.id"
      />
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { isEmpty, isEqual, keyBy, upperFirst } from "lodash"
import { computed, ref, watch, watchEffect } from "vue"
import { useRouter, useRoute } from "vue-router"

import centresApi from "@/api/centres-api"

import { useNotificationStore } from "@/store/NotificationStore"
import useFundingSubmissionLineJsonsStore, {
  FundingSubmissionLineJson,
} from "@/store/funding-submission-line-jsons"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"

const notificationStore = useNotificationStore()
const fundingSubmissionLineJsonsStore = useFundingSubmissionLineJsonsStore()
const submissionLinesStore = useSubmissionLinesStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  centreId: {
    type: Number,
    required: true,
  },
})

const months = ref([
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
])

const fiscalYear = computed(() => submissionLinesStore.currentFiscalYear)

const fundingSubmissionLineJsons = ref<FundingSubmissionLineJson[]>()
const fundingSubmissionLineJsonsByMonth = computed(() =>
  keyBy(fundingSubmissionLineJsons.value, "dateName")
)
const orderedFundingSubmissionLineJsons = computed(() => {
  if (isEmpty(fundingSubmissionLineJsonsByMonth.value)) {
    return []
  }

  return months.value.map((month) => fundingSubmissionLineJsonsByMonth.value[month])
})
const selectedFundingSubmissionLineJson = computed(() => {
  if (isEmpty(fundingSubmissionLineJsonsByMonth.value)) {
    return
  }

  const dateName = upperFirst(route.params.month as string)
  if (isEmpty(dateName)) {
    return orderedFundingSubmissionLineJsons.value[0]
  }

  return fundingSubmissionLineJsonsByMonth.value[dateName]
})
const isLoading = ref(true)

async function fetchFundingSubmissionLineJsons(centreId: number, fiscalYear: string) {
  isLoading.value = true
  try {
    fundingSubmissionLineJsons.value = await fundingSubmissionLineJsonsStore.fetch({
      where: {
        centreId,
        fiscalYear,
      },
    })
  } catch (error) {
    notificationStore.notify({
      text: "Failed to load worksheets",
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}

watch<[number, string], true>(
  () => [props.centreId, fiscalYear.value],
  async (newValues, oldValues) => {
    if (isEqual(newValues, oldValues)) {
      return
    }

    const [newCentreId, newFiscalYear] = newValues
    // TODO: remove once fiscal year is a prop
    if (isEmpty(newFiscalYear)) {
      return
    }

    await fetchFundingSubmissionLineJsons(newCentreId, newFiscalYear)
  },
  {
    immediate: true,
  }
)

async function initializeWorksheetsForFiscalYear() {
  isLoading.value = true
  try {
    fundingSubmissionLineJsons.value = await centresApi.fiscalYear.create(
      props.centreId,
      fiscalYear.value
    )
    notificationStore.notify({
      text: "Fiscal year added",
      variant: "success",
    })
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  if (route.name !== "CentreDashboard-WorksheetsTab") {
    return
  }

  if (isEmpty(orderedFundingSubmissionLineJsons.value)) {
    return
  }

  const firstFundingSubmissionLineJson = orderedFundingSubmissionLineJsons.value[0]
  router.push({
    name: "CentreDashboard-WorksheetsTab-MonthlyWorksheetTab",
    params: {
      centreId: props.centreId,
      month: firstFundingSubmissionLineJson.dateName.toLowerCase(),
    },
  })
})
</script>

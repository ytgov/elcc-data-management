<template>
  <!-- TODO: add loader to this section as it shows empty for a few seconds before loading completes -->
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
          v-for="{ id, dateName } in fundingSubmissionLineJsons"
          :key="id"
          :to="{
            name: 'CentreDashboardWorksheetsMonthlyWorksheetPage',
            params: {
              centreId,
              fiscalYearSlug,
              month: dateName.toLowerCase(),
            },
          }"
        >
          {{ dateName }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <router-view
      v-if="!isEmpty(selectedFundingSubmissionLineJson)"
      v-slot="{ Component }"
    >
      <!--
        TODO: push funding-submission-line-json-id down to the CentreDashboardWorksheetsMonthlyWorksheetPage level
        and make a child component of CentreDashboardWorksheetsMonthlyWorksheetPage that renders with _only_ the id.
      -->
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

const notificationStore = useNotificationStore()
const fundingSubmissionLineJsonsStore = useFundingSubmissionLineJsonsStore()
const router = useRouter()
const route = useRoute()

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
    default: "",
  },
})

const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))

const fundingSubmissionLineJsons = ref<FundingSubmissionLineJson[]>()
const fundingSubmissionLineJsonsByMonth = computed(() =>
  keyBy(fundingSubmissionLineJsons.value, "dateName")
)
const selectedFundingSubmissionLineJson = computed(() => {
  if (fundingSubmissionLineJsons.value === undefined || isEmpty(fundingSubmissionLineJsons.value)) {
    return
  }

  const dateName = upperFirst(route.params.month as string)
  if (isEmpty(dateName)) {
    return fundingSubmissionLineJsons.value[0]
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
  if (route.name !== "CentreDashboardWorksheetsPage") {
    return
  }

  if (fundingSubmissionLineJsons.value === undefined || isEmpty(fundingSubmissionLineJsons.value)) {
    return
  }

  const firstFundingSubmissionLineJson = fundingSubmissionLineJsons.value[0]
  router.push({
    name: "CentreDashboardWorksheetsMonthlyWorksheetPage",
    params: {
      centreId: props.centreId,
      fiscalYearSlug: props.fiscalYearSlug,
      month: firstFundingSubmissionLineJson.dateName.toLowerCase(),
    },
  })
})
</script>

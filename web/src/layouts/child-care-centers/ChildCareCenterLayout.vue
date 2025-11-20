<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    class="pl-4 mt-n4 mx-n4 mb-3 text-body-1 font-weight-bold"
    color="white"
    active-color="#fff"
  >
    <template #prepend>
      <v-icon
        color="white"
        icon="mdi-home"
      ></v-icon>
    </template>
    <template #divider>
      <v-icon
        color="white"
        icon="mdi-chevron-right"
      ></v-icon>
    </template>
  </v-breadcrumbs>

  <div class="float-right">
    <FiscalPeriodFiscalYearSelect
      :model-value="fiscalYear"
      label="Fiscal year"
      class="float-right"
      style="width: 200px"
      variant="outlined"
      density="compact"
      @update:model-value="updateFiscalYearAndRedirect"
    />
  </div>
  <h1 class="mb-4">{{ selectedCentre?.name }}</h1>

  <v-row style="clear: both">
    <v-col
      cols="12"
      md="4"
    >
      <CentreDetailsCard :centre-id="centreIdAsNumber" />
      <v-card
        elevation="3"
        color="yg-blue-light"
      >
        <v-card-title style="background-color: #0097a968">Latest Enrollment</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <FundingLineValuesEnrollmentChart
            ref="fundingLineValuesEnrollmentChartRef"
            :centre-id="centreIdAsNumber"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <v-card
        class="mb-5 fill-height"
        elevation="3"
      >
        <template v-if="!isEmpty(fiscalYearSlug)">
          <v-tabs grow>
            <v-tab
              :to="{
                name: 'child-care-centers/ChildCareCenterSummaryRedirect',
                params: {
                  centreId,
                  fiscalYearSlug,
                },
              }"
            >
              Summary
            </v-tab>
            <v-tab
              :to="{
                name: 'CentreDashboardWorksheetsPage',
                params: {
                  centreId,
                  fiscalYearSlug,
                },
              }"
            >
              Worksheets
            </v-tab>
            <v-tab
              :to="{
                name: 'CentreDashboardEmployeesPage',
                params: {
                  centreId,
                  fiscalYearSlug,
                },
              }"
            >
              Employees
            </v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <router-view v-slot="{ Component }">
            <component
              :is="Component"
              @update:funding-submission-line-json="refreshFundingLineValuesEnrollmentChart"
            />
          </router-view>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { isNil, isEmpty } from "lodash"
import { useRoute, useRouter } from "vue-router"
import { computed, onMounted, onUnmounted, useTemplateRef } from "vue"
import { storeToRefs } from "pinia"

import getCurrentFiscalYearSlug from "@/utils/get-current-fiscal-year-slug"
import { useCentreStore } from "@/modules/centre/store"

import FiscalPeriodFiscalYearSelect from "@/components/fiscal-periods/FiscalPeriodFiscalYearSelect.vue"
import FundingLineValuesEnrollmentChart from "@/components/funding-line-values/FundingLineValuesEnrollmentChart.vue"
import CentreDetailsCard from "@/modules/centre/components/CentreDetailsCard.vue"

const props = withDefaults(
  defineProps<{
    centreId: string
    fiscalYearSlug?: string
  }>(),
  {
    fiscalYearSlug: "",
  }
)

const centreIdAsNumber = computed(() => parseInt(props.centreId))

const store = useCentreStore()
const route = useRoute()
const router = useRouter()
const { selectedCentre } = storeToRefs(store)

const fiscalYear = computed(() => {
  return props.fiscalYearSlug.replace("-", "/")
})

function updateFiscalYearAndRedirect(value: string) {
  router.push({
    name: route.name || "child-care-centers/ChildCareCenterRedirect",
    params: { ...route.params, fiscalYearSlug: value.replace("/", "-") },
    query: route.query,
  })
}

onMounted(async () => {
  if (isEmpty(props.fiscalYearSlug)) {
    const currentFiscalYearSlug = getCurrentFiscalYearSlug()
    updateFiscalYearAndRedirect(currentFiscalYearSlug)
  }

  const centre = await store.selectCentreById(centreIdAsNumber.value)
  if (isNil(centre)) {
    throw new Error(`Could not load centre from id=${centreIdAsNumber.value}`)
  }
})

onUnmounted(() => {
  store.unselectCentre()
})

const fundingLineValuesEnrollmentChartRef = useTemplateRef("fundingLineValuesEnrollmentChartRef")

function refreshFundingLineValuesEnrollmentChart() {
  fundingLineValuesEnrollmentChartRef.value?.refresh()
}

const breadcrumbs = computed(() => {
  return [
    { to: "/dashboard", title: "Home" },
    { to: "/child-care-centres", title: "Child Care Centres" },
    { title: selectedCentre.value?.name || "loading ..." },
  ]
})
</script>

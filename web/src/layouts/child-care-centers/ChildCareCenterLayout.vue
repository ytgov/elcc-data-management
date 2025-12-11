<template>
  <div>
    <FiscalPeriodFiscalYearSelect
      :model-value="fiscalYearLegacy"
      label="Fiscal year"
      class="float-right mt-n10"
      style="width: 200px"
      variant="outlined"
      density="compact"
      hide-details
      @update:model-value="updateFiscalYearAndRedirect"
    />

    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <CentreDetailsCard
          :centre-id="centreIdAsNumber"
          @saved="refresh"
        />
        <v-card
          elevation="3"
          color="yg-blue-light"
          class="mt-4"
        >
          <v-card-title>Latest Enrollment</v-card-title>
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
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash"
import { useRoute, useRouter } from "vue-router"
import { computed, onMounted, useTemplateRef } from "vue"

import { getCurrentFiscalYearSlug } from "@/utils/fiscal-year"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCentre from "@/use/use-centre"

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
const { centre, refresh } = useCentre(centreIdAsNumber)

const fiscalYearLegacy = computed(() => props.fiscalYearSlug?.replace("-", "/"))

onMounted(async () => {
  if (isEmpty(props.fiscalYearSlug)) {
    const currentFiscalYearSlug = getCurrentFiscalYearSlug()
    updateFiscalYearAndRedirect(currentFiscalYearSlug, "replace")
  }
})

const route = useRoute()
const router = useRouter()

function updateFiscalYearAndRedirect(value: string, redirectType: "replace" | "push" = "push") {
  router[redirectType]({
    name: route.name || "child-care-centers/ChildCareCenterRedirect",
    params: {
      ...route.params,
      fiscalYearSlug: value.replace("/", "-"),
    },
    query: route.query,
  })
}

const fundingLineValuesEnrollmentChartRef = useTemplateRef("fundingLineValuesEnrollmentChartRef")

function refreshFundingLineValuesEnrollmentChart() {
  fundingLineValuesEnrollmentChartRef.value?.refresh()
}

const title = computed(() => centre.value?.name || "loading ...")
const breadcrumbs = computed(() => {
  return [
    {
      title: "Child Care Centres",
      to: {
        name: "ChildCareCentresPage",
      },
    },
    {
      title: centre.value?.name || "loading ...",
      to: {
        name: "child-care-centers/ChildCareCenterRedirect",
        params: {
          centreId: props.centreId,
        },
      },
    },
  ]
})

useBreadcrumbs(title, breadcrumbs)
</script>

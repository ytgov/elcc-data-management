<template>
  <div>
    <FiscalPeriodFiscalYearSelect
      :model-value="fiscalYearLegacy"
      label="Fiscal year"
      :class="mdAndUp ? 'float-right mt-n10' : ''"
      :style="mdAndUp ? 'width: 200px' : ''"
      variant="outlined"
      density="compact"
      hide-details
      @update:model-value="updateFiscalYearAndRedirect"
    />

    <PageLoader
      v-if="isLoadingFundingPeriod || isLoadingInitialization"
      message="Loading fiscal year data..."
      style="height: calc(100dvh - 14em) !important"
    />
    <template v-else-if="!isInitialized">
      <v-empty-state
        headline="Fiscal Year Not Initialized"
        title="This fiscal year has not been set up for this centre yet."
        text="The required data records (employee benefits, building expenses, worksheets, and reconciliation) need to be created before you can view or edit data for this fiscal year."
        icon="mdi-calendar-alert"
      >
        <template #actions>
          <v-btn
            color="primary"
            :loading="isInitializing"
            @click="initializeFiscalYear"
          >
            Initialize Fiscal Year
          </v-btn>
        </template>
      </v-empty-state>
    </template>
    <v-row v-else>
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
              v-if="!isNil(fiscalYearLegacy) && !isEmpty(fiscalYearLegacy)"
              ref="fundingLineValuesEnrollmentChartRef"
              :centre-id="centreIdAsNumber"
              :fiscal-year-legacy="fiscalYearLegacy"
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
import { isEmpty, isNil } from "lodash"
import { useRoute, useRouter } from "vue-router"
import { computed, onMounted, useTemplateRef } from "vue"
import { useDisplay } from "vuetify"

import { getCurrentFiscalYearSlug, normalizeFiscalYearToLongForm } from "@/utils/fiscal-year"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCentre from "@/use/use-centre"
import useFundingPeriods from "@/use/use-funding-periods"
import useCentreFundingPeriodInitialization from "@/use/use-centre-funding-period-initialization"

import PageLoader from "@/components/common/PageLoader.vue"
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

const fiscalYearLegacy = computed<string | undefined>(() => props.fiscalYearSlug?.replace("-", "/"))
const fiscalYearLong = computed<string | undefined>(() => {
  if (isEmpty(props.fiscalYearSlug)) return undefined

  return normalizeFiscalYearToLongForm(props.fiscalYearSlug)
})

const fundingPeriodsQuery = computed(() => ({
  where: {
    fiscalYear: fiscalYearLong.value,
  },
  perPage: 1,
}))
const { fundingPeriods, isLoading: isLoadingFundingPeriod } = useFundingPeriods(
  fundingPeriodsQuery,
  {
    skipWatchIf: () => isNil(fiscalYearLong.value),
  }
)
const fundingPeriodId = computed<number | null>(() => {
  const fundingPeriod = fundingPeriods.value[0]
  if (isNil(fundingPeriod)) return null

  return fundingPeriod.id
})

const {
  initializationStatus,
  isLoading: isLoadingInitialization,
  isInitializing,
  initialize,
} = useCentreFundingPeriodInitialization(centreIdAsNumber, fundingPeriodId)

const isInitialized = computed(() => initializationStatus.value?.isInitialized ?? false)

async function initializeFiscalYear() {
  await initialize()
}

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

const { mdAndUp } = useDisplay()

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

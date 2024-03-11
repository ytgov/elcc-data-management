<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
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
    <FiscalYearSelect
      :model-value="fiscalYear"
      label="Fiscal year"
      class="float-right"
      style="width: 200px"
      variant="outlined"
      density="compact"
      @update:modelValue="updateFiscalYearAndRedirect"
    />
  </div>
  <h1 class="mb-4">{{ selectedCentre?.name }}</h1>

  <v-row
    v-if="selectedCentre && selectedCentre.id"
    style="clear: both"
  >
    <v-col
      cols="12"
      md="4"
    >
      <CentreDetailsCard :centreId="selectedCentre.id" />
      <v-card
        elevation="3"
        color="#0097a966"
      >
        <v-card-title style="background-color: #0097a968">Latest Enrollment</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <EnrollmentChart :centre-id="centreId.toString()" />
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
                name: 'CentreDashboardSummaryPage',
                params: { centreId, fiscalYearSlug },
              }"
            >
              Summary
            </v-tab>
            <v-tab
              :to="{
                name: 'CentreDashboardWorksheetsPage',
                params: { centreId, fiscalYearSlug },
              }"
            >
              Worksheets
            </v-tab>
            <v-tab
              :to="{
                name: 'CentreDashboardEmployeesPage',
                params: { centreId, fiscalYearSlug },
              }"
            >
              Employees
            </v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <router-view></router-view>
        </template>
      </v-card>
    </v-col>
  </v-row>

  <CentreCreateOrEditDialog />
</template>

<script setup lang="ts">
import { isNil, isEmpty } from "lodash"
import { useRoute, useRouter } from "vue-router"
import { computed, onMounted, onUnmounted } from "vue"
import { storeToRefs } from "pinia"

import { getCurrentFiscalYearSlug } from "@/api/fiscal-periods-api"
import { useCentreStore } from "@/modules/centre/store"

import EnrollmentChart from "@/modules/centre/components/EnrollmentChart.vue"
import CentreCreateOrEditDialog from "@/modules/centre/components/CentreCreateOrEditDialog.vue"
import CentreDetailsCard from "@/modules/centre/components/CentreDetailsCard.vue"

const props = defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalYearSlug: {
    type: String,
    default: "",
  },
})

const store = useCentreStore()
const { selectedCentre } = storeToRefs(store)

const fiscalYear = computed(() => {
  return props.fiscalYearSlug.replace("-", "/")
})

const route = useRoute()
const router = useRouter()

function updateFiscalYearAndRedirect(value: string) {
  router.push({
    name: route.name || "CentreDashboardPage",
    params: {
      ...route.params,
      fiscalYearSlug: value.replace("/", "-"),
    },
    query: route.query,
  })
}

onMounted(async () => {
  if (isEmpty(props.fiscalYearSlug)) {
    const currentFiscalYearSlug = getCurrentFiscalYearSlug()
    updateFiscalYearAndRedirect(currentFiscalYearSlug)
  }

  const centre = await store.selectCentreById(props.centreId)
  if (isNil(centre)) {
    throw new Error(`Could not load centre from id=${props.centreId}`)
  }
})

onUnmounted(() => {
  store.unselectCentre()
})

const breadcrumbs = computed(() => {
  return [
    { to: "/dashboard", title: "Home" },
    { to: "/child-care-centres", title: "Child Care Centres" },
    { title: selectedCentre.value?.name || "loading ..." },
  ]
})
</script>

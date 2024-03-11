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

  <v-btn
    class="float-right"
    color="primary"
    @click="openCentreCreateDialog"
    >Add Centre</v-btn
  >

  <h1 class="mb-4">Child Care Centres</h1>

  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <v-card elevation="3">
        <v-text-field
          v-model="search"
          label="Search"
        ></v-text-field>
        <v-data-table
          density="comfortable"
          :headers="[
            { title: 'Name', value: 'name', sortable: true },
            { title: 'Community', value: 'community', sortable: true },
            { title: 'Status', value: 'status', sortable: true },
          ]"
          :items="centres"
          :search="search"
          class="row-clickable"
          @click:row="(_event: any, { item }: any) => tableRowClick(item)"
          @dblclick:row="(_event: any, { item }: any) => goToCentre(item.id)"
        ></v-data-table>
      </v-card>
    </v-col>
    <v-col>
      <!-- TODO: use the CentreDetailsCard here -->
      <v-card
        v-if="!isEmpty(selectedItem)"
        color="#F2A90066"
        elevation="3"
      >
        <v-card-title style="background-color: #f2a90068">Child Care Centre Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="!selectedItem.name">Select an item for more information</div>
          <div v-else>
            <h2 class="mb-3">
              {{ selectedItem.name }}
            </h2>

            <v-list
              lines="one"
              density="comfortable"
              style="background-color: inherit"
            >
              <v-list-item
                title="License"
                :subtitle="selectedItem.license || ''"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-file-certificate"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Hot Meal"
                :subtitle="formatYesNo(selectedItem.hotMeal || false)"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-silverware"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Licensed For"
                :subtitle="selectedItem.licensedFor ?? undefined"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-account-group"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Community"
                :subtitle="selectedItem.community"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-map"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Last Submission"
                :subtitle="lastSubmission"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-calendar"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
            </v-list>

            <v-btn
              variant="flat"
              class="mt-5 float-right"
              size="small"
              color="primary"
              :to="{ name: 'CentreDashboardPage', params: { centreId: selectedItem.id } }"
              >View Details</v-btn
            >
            <div style="clear: both"></div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <CentreCreateDialog
    ref="centreCreateDialog"
    @saved="goToCentre"
  />
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { FormatDate as formatDate, FormatYesNo as formatYesNo } from "@/utils"
import { useCentreStore, Centre, CentreRegions, CentreStatuses } from "@/modules/centre/store"

import CentreCreateDialog from "@/modules/centre/components/CentreCreateDialog.vue"

const centreStore = useCentreStore()
const router = useRouter()
const route = useRoute()

const { centres } = storeToRefs(centreStore)
const search = ref("")
const selectedItem = ref<Centre | null>(null)
const centreCreateDialog = ref<InstanceType<typeof CentreCreateDialog> | null>(null)

const breadcrumbs = [
  { to: "/dashboard", title: "Home" },
  { to: "/child-care-centres", title: "Child Care Centres" },
]

const lastSubmission = computed(() => {
  if (isNil(selectedItem.value?.lastSubmission)) {
    return "No submisions"
  }

  return formatDate(selectedItem.value.lastSubmission)
})

function tableRowClick(centre: Centre) {
  selectedItem.value = centre
}

function goToCentre(centreId: string | number) {
  router.push({
    name: "CentreDashboardPage",
    params: { centreId },
  })
}

function openCentreCreateDialog() {
  if (isNil(centreCreateDialog.value)) {
    throw new Error("Centre create dialog is not ready")
  }

  centreCreateDialog.value.show({
    community: "Whitehorse",
    hotMeal: true,
    isFirstNationProgram: false,
    license: "",
    licensedFor: 10,
    name: "",
    region: CentreRegions.WHITEHORSE,
    status: CentreStatuses.ACTIVE,
  })
}

watch(
  () => [centreCreateDialog.value],
  ([newCentreCreateDialog]) => {
    if (!isNil(newCentreCreateDialog) && route.query.showCentreCreate === "true") {
      openCentreCreateDialog()
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div>
    <v-btn
      class="float-right"
      color="primary"
      @click="openCentreCreateDialog"
      >Add Centre</v-btn
    >

    <v-row style="clear: both">
      <v-col
        cols="12"
        md="8"
      >
        <v-card elevation="3">
          <v-text-field
            v-model="search"
            label="Search"
            class="ma-3"
            hide-details
          />

          <CentresDataTableServer
            :filters="centreFilters"
            @click:row="selectCentre"
          />
        </v-card>
      </v-col>
      <v-col>
        <!-- TODO: use the CentreDetailsCard here -->
        <v-card
          v-if="!isNil(selectedCentre)"
          color="#F2A90066"
          elevation="3"
        >
          <v-card-title style="background-color: #f2a90068">Child Care Centre Details</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div v-if="!selectedCentre.name">Select an item for more information</div>
            <div v-else>
              <h2 class="mb-3">
                {{ selectedCentre.name }}
              </h2>

              <v-list
                lines="one"
                density="comfortable"
                style="background-color: inherit"
              >
                <v-list-item
                  title="License"
                  :subtitle="selectedCentre.license || ''"
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
                  :subtitle="formatYesNo(selectedCentre.hotMeal || false)"
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
                  :subtitle="selectedCentre.licensedFor ?? undefined"
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
                  :subtitle="selectedCentre.community"
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
                :to="{
                  name: 'child-care-centers/ChildCareCenterRedirect',
                  params: {
                    centreId: selectedCentreId,
                  },
                }"
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
      @created="goToCentre"
    />
  </div>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import { integerTransformer } from "@/utils/use-route-query-transformers"
import { FormatDate as formatDate, FormatYesNo as formatYesNo } from "@/utils"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCentre from "@/use/use-centre"

import CentreCreateDialog from "@/modules/centre/components/CentreCreateDialog.vue"
import CentresDataTableServer from "@/components/centres/CentresDataTableServer.vue"

const selectedCentreId = useRouteQuery<string | null, number | null>("centreId", null, {
  transform: integerTransformer,
})

function selectCentre(centreId: number) {
  selectedCentreId.value = centreId
}

const { centre: selectedCentre } = useCentre(selectedCentreId)

const lastSubmission = computed(() => {
  if (isNil(selectedCentre.value)) return "No submision"

  const { lastSubmission } = selectedCentre.value
  if (isNil(lastSubmission)) return "No submision"

  return formatDate(lastSubmission)
})

const search = ref("")

const centreFilters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

const router = useRouter()

function goToCentre(centreId: string | number) {
  return router.push({
    name: "child-care-centers/ChildCareCenterRedirect",
    params: {
      centreId,
    },
  })
}

const centreCreateDialog = useTemplateRef("centreCreateDialog")

function openCentreCreateDialog() {
  if (isNil(centreCreateDialog.value)) {
    throw new Error("Centre create dialog is not ready")
  }

  centreCreateDialog.value.open()
}

const breadcrumbs = [
  {
    title: "Child Care Centres",
    to: "/child-care-centres",
  },
]
useBreadcrumbs("Child Care Centres", breadcrumbs)
</script>

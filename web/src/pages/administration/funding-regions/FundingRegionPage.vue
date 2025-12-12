<template>
  <v-skeleton-loader
    v-if="isNil(fundingRegion)"
    type="card"
  />
  <HeaderActionsCard
    v-else
    title="Funding Region Details"
  >
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/funding-regions/FundingRegionEditPage',
          params: {
            fundingRegionId,
          },
        }"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="policy?.destroy"
        class="mt-2 mt-md-0 ml-md-2"
        color="error"
        :loading="isDeleting"
        @click="deleteFundingRegion(fundingRegionIdAsNumber)"
      >
        Delete
      </v-btn>
    </template>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Region"
          :model-value="startCase(fundingRegion.region)"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Subsidy Rate"
          vertical
        >
          {{ Big(fundingRegion.subsidyRate).mul(100).toFixed(0) }} cents / $
        </DescriptionElement>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Created At"
          :model-value="formatDate(fundingRegion.createdAt)"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Updated At"
          :model-value="formatDate(fundingRegion.updatedAt)"
          vertical
        />
      </v-col>
    </v-row>
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { isNil, startCase } from "lodash"
import Big from "big.js"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import { formatDate } from "@/utils/formatters"

import fundingRegionsApi from "@/api/funding-regions-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingRegion from "@/use/use-funding-region"
import useSnack from "@/use/use-snack"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"

const props = defineProps<{
  fundingRegionId: string
}>()

const fundingRegionIdAsNumber = computed(() => parseInt(props.fundingRegionId))

const { fundingRegion, policy } = useFundingRegion(fundingRegionIdAsNumber)

const isDeleting = ref(false)
const snack = useSnack()
const router = useRouter()

async function deleteFundingRegion(fundingRegionId: number) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this funding region?")) return

  isDeleting.value = true
  try {
    await fundingRegionsApi.delete(fundingRegionId)
    snack.success("Funding region deleted.")
    return router.push({
      name: "administration/FundingRegionsPage",
    })
  } catch (error) {
    console.error(`Failed to delete funding region: ${error}`, { error })
    snack.error(`Failed to delete funding region: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

const title = computed(() => startCase(fundingRegion.value?.region || "Funding Region"))
const fundingRegionTitle = computed(() => startCase(fundingRegion.value?.region || "Details"))
const breadcrumbs = computed(() => [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Funding Regions",
    to: {
      name: "administration/FundingRegionsPage",
    },
  },
  {
    title: fundingRegionTitle.value,
    to: {
      name: "administration/funding-regions/FundingRegionPage",
      params: {
        fundingRegionId: props.fundingRegionId,
      },
    },
  },
])

useBreadcrumbs(title, breadcrumbs)
</script>

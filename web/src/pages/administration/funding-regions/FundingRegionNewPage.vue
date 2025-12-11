<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    title="New Funding Region"
    @submit.prevent="createFundingRegion"
  >
    <v-row>
      <v-col cols="12">
        <FundingRegionRegionUniqueTextField
          v-model="fundingRegionAttributes.region"
          label="Region *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- TODO: make currency/money input -->
        <CurrencyInput
          v-model="fundingRegionAttributes.subsidyRate"
          label="Subsidy Rate *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <template #actions>
      <v-btn
        :loading="isLoading"
        color="primary"
        variant="flat"
        type="submit"
      >
        Create Funding Region
      </v-btn>
      <v-spacer />
      <v-btn
        color="warning"
        variant="outlined"
        :loading="isLoading"
        :to="{
          name: 'administration/FundingRegionsPage',
        }"
      >
        Cancel
      </v-btn>
    </template>
  </HeaderActionsFormCard>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import fundingRegionsApi, { type FundingRegion } from "@/api/funding-regions-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"

import CurrencyInput from "@/components/CurrencyInput.vue"
import FundingRegionRegionUniqueTextField from "@/components/funding-regions/FundingRegionRegionUniqueTextField.vue"
import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"

const fundingRegionAttributes = ref<Partial<FundingRegion>>({
  region: "",
  subsidyRate: "",
})

const headerActionsFormCard = ref<InstanceType<typeof HeaderActionsFormCard> | null>(null)
const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()

async function createFundingRegion() {
  if (isNil(headerActionsFormCard.value)) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    const { fundingRegion } = await fundingRegionsApi.create(fundingRegionAttributes.value)
    snack.success("Funding region created successfully!")
    return router.push({
      name: "administration/funding-regions/FundingRegionPage",
      params: {
        fundingRegionId: fundingRegion.id,
      },
    })
  } catch (error) {
    console.error(`Failed to create funding region: ${error}`, { error })
    snack.error(`Failed to create funding region: ${error}`)
  } finally {
    isLoading.value = false
  }
}

useBreadcrumbs("Funding Region Creation", [
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
    title: "New Funding Region",
    to: {
      name: "administration/funding-regions/FundingRegionNewPage",
    },
  },
])
</script>

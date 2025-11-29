<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    title="New Funding Period"
    @submit.prevent="createFundingPeriod"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="fundingPeriodAttributes.title"
          label="Title *"
          required
          :rules="[required]"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="fundingPeriodAttributes.fiscalYear"
          label="Fiscal Year *"
          placeholder="YYYY-YYYY (e.g., 2024-2025)"
          required
          :rules="[required, fiscalYearFormat]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-date-input
          v-model="fundingPeriodAttributes.fromDate"
          label="From Date *"
          required
          :rules="[required]"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-date-input
          v-model="fundingPeriodAttributes.toDate"
          label="To Date *"
          required
          :rules="[required]"
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
        Create Funding Period
      </v-btn>
      <v-spacer />
      <v-btn
        color="warning"
        variant="outlined"
        :loading="isLoading"
        :to="{
          name: 'administration/FundingPeriodsPage',
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

import { required } from "@/utils/validators"
import fundingPeriodsApi, { type FundingPeriod } from "@/api/funding-periods-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"

import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"

const fundingPeriodAttributes = ref<Partial<FundingPeriod>>({
  title: "",
  fiscalYear: "",
  fromDate: "",
  toDate: "",
})

const fiscalYearFormat = (value: string) => {
  const pattern = /^\d{4}-\d{4}$/
  return pattern.test(value) || "Fiscal year must be in format YYYY-YYYY (e.g., 2024-2025)"
}

const headerActionsFormCard = ref<InstanceType<typeof HeaderActionsFormCard> | null>(null)
const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()

async function createFundingPeriod() {
  if (headerActionsFormCard.value === null) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    const { fundingPeriod } = await fundingPeriodsApi.create(fundingPeriodAttributes.value)
    snack("Funding period created successfully!", { color: "success" })
    return router.push({
      name: "administration/funding-periods/FundingPeriodPage",
      params: {
        fundingPeriodId: fundingPeriod.id,
      },
    })
  } catch (error) {
    console.error(error)
    snack(`Failed to create funding period: ${error}`, { color: "error" })
  } finally {
    isLoading.value = false
  }
}

useBreadcrumbs("Funding Period Creation", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Funding Periods",
    to: {
      name: "administration/FundingPeriodsPage",
    },
  },
  {
    title: "New Funding Period",
    to: {
      name: "administration/funding-periods/FundingPeriodNewPage",
    },
  },
])
</script>

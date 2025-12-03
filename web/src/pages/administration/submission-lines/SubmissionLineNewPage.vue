<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    title="New Funding Submission Line"
    @submit.prevent="createFundingSubmissionLine"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <FundingPeriodFiscalYearSelect
          v-model="fiscalYear"
          label="Fiscal Year *"
          :rules="[required]"
          clearable
          clear-icon="mdi-restore"
          @click:clear="fiscalYear = CURRENT_FISCAL_YEAR"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <FundingSubmissionLineSectionCombobox
          v-model="fundingSubmissionLineAttributes.sectionName"
          :where="fundingSubmissionLineSectionWhereOptions"
          label="Section *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <FundingSubmissionLineLineNameUniqueTextField
          v-model="fundingSubmissionLineAttributes.lineName"
          :fiscal-year="fundingSubmissionLineAttributes.fiscalYear"
          :section-name="fundingSubmissionLineAttributes.sectionName"
          label="Line *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="fundingSubmissionLineAttributes.monthlyAmount"
          label="Monthly Amount *"
          type="number"
          step="0.01"
          required
          :rules="[required, greaterThanOrEqualTo(0)]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-checkbox
          v-model="showAgeRange"
          label="Specify From Age - To Age"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row v-if="showAgeRange">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model.number="fundingSubmissionLineAttributes.fromAge"
          label="From Age *"
          type="number"
          :rules="[required, greaterThanOrEqualTo(0)]"
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model.number="fundingSubmissionLineAttributes.toAge"
          label="To Age *"
          type="number"
          :rules="[
            required,
            greaterThan(fromAge, {
              referenceFieldLabel: `From Age of ${fromAge}`,
            }),
          ]"
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
        Create Submission Line
      </v-btn>
      <v-spacer />
      <v-btn
        color="warning"
        variant="outlined"
        :loading="isLoading"
        :to="{
          name: 'administration/AdministrationSubmissionLinesPage',
          query: returnToQuery,
        }"
      >
        Cancel
      </v-btn>
    </template>
  </HeaderActionsFormCard>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"
import { isNil } from "lodash"

import { greaterThan, greaterThanOrEqualTo, required } from "@/utils/validators"
import {
  getCurrentFiscalYearSlug,
  normalizeFiscalYearToLegacyForm,
  normalizeFiscalYearToLongForm,
} from "@/utils/fiscal-year"

import fundingSubmissionLinesApi, {
  type FundingSubmissionLine,
} from "@/api/funding-submission-lines-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"

import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"
import FundingPeriodFiscalYearSelect from "@/components/funding-periods/FundingPeriodFiscalYearSelect.vue"
import FundingSubmissionLineSectionCombobox from "@/components/funding-submission-lines/FundingSubmissionLineSectionCombobox.vue"
import FundingSubmissionLineLineNameUniqueTextField from "@/components/funding-submission-lines/FundingSubmissionLineLineNameUniqueTextField.vue"

const CURRENT_FISCAL_YEAR = normalizeFiscalYearToLongForm(getCurrentFiscalYearSlug())

const fiscalYear = useRouteQuery<string>("fiscalYear", CURRENT_FISCAL_YEAR)

const fundingSubmissionLineSectionWhereOptions = computed(() => {
  return {
    fiscalYear: normalizeFiscalYearToLegacyForm(fiscalYear.value),
  }
})

const fundingSubmissionLineAttributes = ref<Partial<FundingSubmissionLine>>({
  fiscalYear: "",
  sectionName: undefined,
  lineName: "",
  fromAge: null,
  toAge: null,
  monthlyAmount: "0",
})

watchEffect(() => {
  if (fiscalYear.value) {
    fundingSubmissionLineAttributes.value.fiscalYear = normalizeFiscalYearToLegacyForm(
      fiscalYear.value
    )
  }
})

const showAgeRange = ref(false)

watchEffect(() => {
  if (showAgeRange.value === false) {
    fundingSubmissionLineAttributes.value.fromAge = null
    fundingSubmissionLineAttributes.value.toAge = null
  }
})

const fromAge = computed(() => fundingSubmissionLineAttributes.value.fromAge)

const returnToQuery = computed(() => {
  if (isNil(fiscalYear.value) || fiscalYear.value === CURRENT_FISCAL_YEAR) {
    return {}
  }

  return {
    fiscalYear: fiscalYear.value,
  }
})

const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()
const headerActionsFormCard = useTemplateRef("headerActionsFormCard")

async function createFundingSubmissionLine() {
  if (headerActionsFormCard.value === null) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    await fundingSubmissionLinesApi.create(fundingSubmissionLineAttributes.value)
    snack.success("Submission line created successfully!")
    return router.push({
      name: "administration/AdministrationSubmissionLinesPage",
    })
  } catch (error) {
    console.error(error)
    snack.error(`Failed to create submission line: ${error}`)
  } finally {
    isLoading.value = false
  }
}

useBreadcrumbs("Submission Line Creation", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Submission Lines",
    to: {
      name: "administration/AdministrationSubmissionLinesPage",
    },
  },
  {
    title: "New Submission Line",
    to: {
      name: "administration/submission-lines/SubmissionLineNewPage",
    },
  },
])
</script>

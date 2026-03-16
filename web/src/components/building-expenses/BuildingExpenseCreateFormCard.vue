<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    @submit.prevent="createBuildingExpense"
  >
    <template #header>
      <h4>Add Building Expense</h4>
    </template>

    <v-row>
      <v-col cols="12">
        <BuildingExpenseCategoryAutocomplete
          v-model="buildingExpenseAttributes.categoryId"
          :where="buildingExpenseCategoryWhere"
          :filters="buildingExpenseCategoryFilters"
          :rules="[required]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CurrencyInput
          v-model="buildingExpenseAttributes.estimatedCost"
          label="Estimated Cost"
          :rules="[required, greaterThanOrEqualTo(0)]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CurrencyInput
          v-model="buildingExpenseAttributes.actualCost"
          label="Actual Cost"
          :rules="[required, greaterThanOrEqualTo(0)]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="buildingExpenseAttributes.notes"
          label="Notes"
          rows="3"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-checkbox
          v-model="buildingExpenseAttributes.applyToCurrentAndFutureFiscalPeriods"
          color="primary"
          hide-details
          label="Apply to current and future fiscal periods for this centre"
        />
      </v-col>
    </v-row>

    <template #actions>
      <v-btn
        color="primary"
        type="submit"
        :loading="isCreating"
      >
        Create
      </v-btn>
      <v-btn
        variant="text"
        color="warning"
        @click="emit('cancel')"
      >
        Cancel
      </v-btn>
    </template>
  </HeaderActionsFormCard>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"

import { greaterThanOrEqualTo, required } from "@/utils/validators"

import buildingExpensesApi, {
  type BuildingExpenseCreationAttributes,
} from "@/api/building-expenses-api"

import useCentre from "@/use/use-centre"
import useSnack from "@/use/use-snack"

import CurrencyInput from "@/components/CurrencyInput.vue"
import BuildingExpenseCategoryAutocomplete from "@/components/building-expense-categories/BuildingExpenseCategoryAutocomplete.vue"
import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"

const props = defineProps<{
  centreId: number
  fiscalPeriodId: number
}>()

const emit = defineEmits<{
  created: [buildingExpenseId: number]
  cancel: [void]
}>()

const buildingExpenseAttributes = ref<BuildingExpenseCreationAttributes>({
  centreId: props.centreId,
  fiscalPeriodId: props.fiscalPeriodId,
  categoryId: undefined,
  estimatedCost: "0",
  actualCost: "0",
  totalCost: "0",
  notes: null,
  applyToCurrentAndFutureFiscalPeriods: false,
})

const centreId = computed(() => props.centreId)
const { centre } = useCentre(centreId)

const buildingExpenseCategoryWhere = computed(() => ({
  fundingRegionId: centre.value?.fundingRegionId,
}))

const buildingExpenseCategoryFilters = computed(() => ({
  excludingUsedByCentreFiscalPeriod: {
    centreId: props.centreId,
    fiscalPeriodId: props.fiscalPeriodId,
  },
}))

const isCreating = ref(false)
const snack = useSnack()
const headerActionsFormCard = useTemplateRef("headerActionsFormCard")

async function createBuildingExpense() {
  if (headerActionsFormCard.value === null) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isCreating.value = true
  try {
    const { buildingExpense } = await buildingExpensesApi.create(buildingExpenseAttributes.value)
    emit("created", buildingExpense.id)
    snack.success("Building expense created successfully")
  } catch (error) {
    console.error(`Failed to create building expense: ${error}`, { error })
    snack.error(`Failed to create building expense: ${error}`)
  } finally {
    isCreating.value = false
  }
}
</script>

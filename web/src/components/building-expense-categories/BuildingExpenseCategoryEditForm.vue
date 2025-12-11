<template>
  <v-skeleton-loader
    v-if="isNil(buildingExpenseCategory)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="validateSaveAndNotify"
  >
    <v-row>
      <v-col cols="12">
        <BuildingExpenseCategoryCategoryNameUniqueTextField
          v-model="buildingExpenseCategory.categoryName"
          :excluding-ids="[buildingExpenseCategoryId]"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CurrencyInput
          v-model="buildingExpenseCategory.subsidyRate"
          label="Subsidy Rate *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          color="primary"
          :loading="isSaving"
          type="submit"
        >
          Save Changes
        </v-btn>
        <v-spacer />
        <v-btn
          color="warning"
          variant="outlined"
          :to="{
            name: 'administration/building-expense-categories/BuildingExpenseCategoryPage',
            params: {
              buildingExpenseCategoryId,
            },
          }"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import useBuildingExpenseCategory from "@/use/use-building-expense-category"
import useSnack from "@/use/use-snack"

import CurrencyInput from "@/components/CurrencyInput.vue"
import BuildingExpenseCategoryCategoryNameUniqueTextField from "@/components/building-expense-categories/BuildingExpenseCategoryCategoryNameUniqueTextField.vue"

const props = defineProps<{
  buildingExpenseCategoryId: number
}>()

const emit = defineEmits<{
  saved: [buildingExpenseCategoryId: number]
}>()

const { buildingExpenseCategoryId } = toRefs(props)
const { buildingExpenseCategory, save } = useBuildingExpenseCategory(buildingExpenseCategoryId)

const isSaving = ref(false)
const snack = useSnack()
const form = useTemplateRef("form")

async function validateSaveAndNotify() {
  if (isNil(buildingExpenseCategory.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  isSaving.value = true
  try {
    await save()
    emit("saved", props.buildingExpenseCategoryId)
    snack.success("Building expense category saved!")
  } catch (error) {
    console.error(`Failed to update building expense category: ${error}`, { error })
    snack.error(`Failed to update building expense category: ${error}`)
  } finally {
    isSaving.value = false
  }
}
</script>

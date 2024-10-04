<template>
  <table
    style="width: 100%"
    cellpadding="0"
    cellspacing="0"
    border="0px"
  >
    <tr class="text-left">
      <td style="width: 180px"></td>
      <td
        class="pl-4"
        style="width: 120px"
      >
        Per child
      </td>
      <td
        class="pl-4"
        style="width: 120px"
      >
        Est
      </td>
      <td class="pl-4">Est Total</td>
      <td
        class="pl-4"
        style="width: 120px"
      >
        Act
      </td>
      <td class="pl-4">Act Total</td>
    </tr>
    <tr
      v-for="(line, lineIndex) in lines"
      class="monospace"
    >
      <td>{{ line.lineName }}</td>
      <td class="read-only-td-that-matches-v-text-input">
        <span class="pl-4">
          {{ formatMoney(line.monthlyAmount) }}
        </span>
      </td>
      <td>
        <v-text-field
          ref="estimatesFields"
          v-model.number="line.estimatedChildOccupancyRate"
          density="compact"
          hide-details
          @keydown.enter="goToLowerEstimatesField(lineIndex)"
          @keydown.shift.enter="goToHigherEstimatesField(lineIndex)"
          @change="changeLineAndPropagate(line, lineIndex)"
        ></v-text-field>
      </td>
      <td class="read-only-td-that-matches-v-text-input">
        <span class="pl-4">
          {{ formatMoney(line.estimatedComputedTotal) }}
        </span>
      </td>
      <td>
        <v-text-field
          ref="actualsFields"
          v-model.number="line.actualChildOccupancyRate"
          density="compact"
          hide-details
          @keydown.enter="goToLowerActualsField(lineIndex)"
          @keydown.shift.enter="goToHigherActualsField(lineIndex)"
          @change="changeLineAndPropagate(line, lineIndex)"
        ></v-text-field>
      </td>

      <td class="read-only-td-that-matches-v-text-input">
        <span class="pl-4">
          {{ formatMoney(line.actualComputedTotal) }}
        </span>
      </td>
    </tr>
    <tr class="monospace total">
      <td>SECTION TOTAL</td>
      <td></td>
      <td class="read-only-td-that-matches-v-text-input py-2">
        <span class="pl-4">
          {{
            lines.reduce(
              (a: number, v: any) => a + parseFloat(v.estimatedChildOccupancyRate || 0),
              0
            )
          }}
        </span>
      </td>
      <td class="read-only-td-that-matches-v-text-input">
        <span class="pl-4">
          {{
            formatMoney(
              lines.reduce((a: number, v: any) => a + parseFloat(v.estimatedComputedTotal || 0), 0)
            )
          }}
        </span>
      </td>
      <td class="read-only-td-that-matches-v-text-input">
        <span class="pl-4">
          {{
            lines.reduce((a: number, v: any) => a + parseFloat(v.actualChildOccupancyRate || 0), 0)
          }}
        </span>
      </td>
      <td class="read-only-td-that-matches-v-text-input">
        <span class="pl-4">
          {{
            formatMoney(
              lines.reduce((a: number, v: any) => a + parseFloat(v.actualComputedTotal || 0), 0)
            )
          }}
        </span>
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isNil } from "lodash"

import { formatMoney } from "@/utils"
import { FundingLineValue } from "@/api/funding-submission-line-jsons-api"

const props = defineProps<{
  lines: FundingLineValue[]
}>()

const emit = defineEmits<{
  lineChanged: [{ line: FundingLineValue; lineIndex: number }]
}>()

const estimatesFields = ref<HTMLInputElement[]>([])
const actualsFields = ref<HTMLInputElement[]>([])

function refreshLineTotals(line: FundingLineValue) {
  line.estimatedComputedTotal = line.monthlyAmount * line.estimatedChildOccupancyRate
  line.actualComputedTotal = line.monthlyAmount * line.actualChildOccupancyRate
}

function changeLineAndPropagate(line: FundingLineValue, lineIndex: number) {
  line.estimatedChildOccupancyRate = line.estimatedChildOccupancyRate || 0
  line.actualChildOccupancyRate = line.actualChildOccupancyRate || 0
  refreshLineTotals(line)

  emit("lineChanged", { line, lineIndex })
}

// TODO: figure out why I can't pass the template refs directly to the function.
// Why I can't pass a string, and then look up the template ref from a computed property,
// and have to make a custom fuction instead, I have no idea.
function goToLowerEstimatesField(lineIndex: number) {
  goToLowerField(estimatesFields.value, lineIndex)
}

function goToLowerActualsField(lineIndex: number) {
  goToLowerField(actualsFields.value, lineIndex)
}

function goToHigherEstimatesField(lineIndex: number) {
  goToHigherField(estimatesFields.value, lineIndex)
}

function goToHigherActualsField(lineIndex: number) {
  goToHigherField(actualsFields.value, lineIndex)
}

function goToLowerField(fields: HTMLInputElement[], lineIndex: number) {
  if (lineIndex < props.lines.length - 1) {
    const nextIndex = lineIndex + 1
    const nextField = fields[nextIndex]
    if (isNil(nextField)) return

    nextField.focus()
  }
}

function goToHigherField(fields: HTMLInputElement[], lineIndex: number) {
  if (lineIndex > 0) {
    const previousIndex = lineIndex - 1
    const previousField = fields[previousIndex]
    if (isNil(previousField)) return

    previousField.focus()
  }
}

defineExpose({
  refreshLineTotals,
})
</script>

<style scoped>
.read-only-td-that-matches-v-text-input {
  background-color: #eee;
  border-bottom: 1px solid rgba(0, 0, 0, 0.38);
}

.monospace .v-text-field .v-field input.v-field__input {
  font-family: "Courier Prime", monospace !important;
}
.monospace.total .v-text-field .v-field input.v-field__input {
  font-weight: 700;
}
</style>

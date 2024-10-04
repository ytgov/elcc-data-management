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
      :key="`${line.lineName}-${lineIndex}`"
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
          @keydown="changeFocusInColumn($event, 'estimates', lineIndex)"
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
          @keydown="changeFocusInColumn($event, 'actuals', lineIndex)"
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
import { reactive, Ref, ref } from "vue"
import { isNil } from "lodash"

import { formatMoney } from "@/utils"
import { FundingLineValue } from "@/api/funding-submission-line-jsons-api"

export type ColumnNames = "estimates" | "actuals"

const props = defineProps<{
  lines: FundingLineValue[]
}>()

const emit = defineEmits<{
  lineChanged: [{ line: FundingLineValue; lineIndex: number }]
  focusBeyondLastInColumn: [column: ColumnNames]
  focusBeyondFirstInColumn: [column: ColumnNames]
}>()

const estimatesFields = ref<HTMLInputElement[]>([])
const actualsFields = ref<HTMLInputElement[]>([])
const fieldsMap = reactive<{
  [key in ColumnNames]: Ref<HTMLInputElement[]>
}>({
  estimates: estimatesFields,
  actuals: actualsFields,
})

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

function changeFocusInColumn(event: KeyboardEvent, columnName: ColumnNames, lineIndex: number) {
  const input = event.target as HTMLInputElement | null
  const isTextFullySelected =
    input?.selectionStart === 0 && input.selectionEnd === input.value.length

  if (event.key === "Enter" && !event.shiftKey) {
    focusOnNextInColumn(columnName, lineIndex)
  } else if (event.key === "Enter" && event.shiftKey) {
    focusOnPreviousInColumn(columnName, lineIndex)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    focusOnPreviousInColumn(columnName, lineIndex)
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    focusOnNextInColumn(columnName, lineIndex)
  } else if (event.key === "ArrowLeft" && isTextFullySelected) {
    event.preventDefault()
    input.setSelectionRange(0, 0)
  } else if (event.key === "ArrowLeft" && input?.selectionStart === 0) {
    event.preventDefault()
    focusOnPreviousColumn(columnName, lineIndex)
  } else if (event.key === "ArrowRight" && isTextFullySelected) {
    event.preventDefault()
    input.setSelectionRange(input.value.length, input.value.length)
  } else if (event.key === "ArrowRight" && input?.selectionEnd === input?.value.length) {
    event.preventDefault()
    focusOnNextColumn(columnName, lineIndex)
  }
}

function focusOnNextInColumn(columnName: ColumnNames, lineIndex: number) {
  const fields = fieldsMap[columnName]

  if (lineIndex < props.lines.length - 1) {
    const nextIndex = lineIndex + 1
    const nextField = fields[nextIndex]
    if (isNil(nextField)) return

    focusOnField(nextField)
  } else {
    emit("focusBeyondLastInColumn", columnName)
  }
}

function focusOnPreviousInColumn(columnName: ColumnNames, lineIndex: number) {
  const fields = fieldsMap[columnName]

  if (lineIndex > 0) {
    const previousIndex = lineIndex - 1
    const previousField = fields[previousIndex]
    if (isNil(previousField)) return

    focusOnField(previousField)
  } else {
    emit("focusBeyondFirstInColumn", columnName)
  }
}

function focusOnNextColumn(columnName: ColumnNames, lineIndex: number) {
  if (columnName === "actuals") return

  focusOnNextInColumn("actuals", lineIndex - 1)
}

function focusOnPreviousColumn(columnName: ColumnNames, lineIndex: number) {
  if (columnName === "estimates") return

  focusOnNextInColumn("estimates", lineIndex - 1)
}

function focusOnFirstInColumn(columnName: ColumnNames) {
  const fields = fieldsMap[columnName]
  const field = fields[0]
  if (isNil(field)) return

  focusOnField(field)
}

function focusOnLastInColumn(columnName: ColumnNames) {
  const fields = fieldsMap[columnName]
  const field = fields[fields.length - 1]
  if (isNil(field)) return

  focusOnField(field)
}

function focusOnField(field: HTMLInputElement) {
  field.focus()
  field.select()
  field.scrollIntoView({
    behavior: "smooth", // Scroll smoothly
    block: "center", // Center vertically in the viewport
    inline: "center", // Center horizontally if needed
  })
}

defineExpose({
  refreshLineTotals,
  focusOnFirstInColumn,
  focusOnLastInColumn,
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

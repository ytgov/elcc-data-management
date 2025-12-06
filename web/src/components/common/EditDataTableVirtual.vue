<template>
  <v-data-table-virtual
    :items="items"
    :headers="headers"
  >
    <template #item="{ index, item, itemRef }">
      <tr
        v-if="!isEditingRow(index)"
        :ref="itemRef"
        class="cursor-pointer"
        @click="startEditingRow(index, editableColumns[0])"
      >
        <template
          v-for="{ key: headerKey } in headers"
          :key="headerKey"
        >
          <td
            v-if="isEditableColumn(headerKey)"
            @click.capture.stop="startEditingRow(index, headerKey)"
          >
            <slot
              :name="`item.${headerKey}`"
              :item="item"
              :index="index"
            >
              {{ item[headerKey] }}
            </slot>
          </td>
          <td v-else>
            <slot
              :name="`item.${headerKey}`"
              :item="item"
              :index="index"
            >
              {{ item[headerKey] }}
            </slot>
          </td>
        </template>
      </tr>
      <tr
        v-else
        :ref="itemRef"
        @focusout="exitEditMode(index)"
      >
        <template
          v-for="{ key: headerKey } in headers"
          :key="headerKey"
        >
          <td
            v-if="isEditableColumn(headerKey)"
            :ref="(element: unknown) => registerInputElement(headerKey, index, element)"
            @keydown="navigateOnKeydown($event, headerKey, index)"
          >
            <slot
              :name="`item.${headerKey}.edit`"
              :item="cloneDeep(item)"
              :index="index"
            >
              <v-text-field
                :model-value="item[headerKey]"
                hide-details
              />
            </slot>
          </td>
          <td v-else>
            <slot
              :name="`item.${headerKey}`"
              :item="item"
              :index="index"
            >
              {{ item[headerKey] }}
            </slot>
          </td>
        </template>
      </tr>
    </template>
    <template
      v-for="(_, name) in $slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      ></slot>
    </template>
  </v-data-table-virtual>
</template>

<script
  setup
  lang="ts"
  generic="
    Header extends Record<string, unknown> & {
      key: string
    },
    Item extends Record<string, unknown>,
    ColumnKey extends string
  "
>
import { computed, nextTick, ref } from "vue"
import cloneDeep from "lodash/cloneDeep"
import { isNil } from "lodash"

import convertIndexToAlphaIndex from "@/utils/convert-index-to-alpha-index"

type InputComponents = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const INPUT_COMPONENTS = Object.freeze(["input", "textarea", "select"])

const props = defineProps<{
  headers: Header[]
  items: Item[]
  editableColumns: ColumnKey[]
}>()

const emit = defineEmits<{
  "update:cell": [item: Item]
  cancel: [item: Item]
}>()

function isEditableColumn(columnKey: string | undefined): columnKey is ColumnKey {
  return props.editableColumns.includes(columnKey as ColumnKey)
}

const columnsAsAlphaIndexMap = computed(() => {
  const initialMap: Record<string, string> = {}
  return props.editableColumns.reduce<Record<ColumnKey, string>>(
    (labelsByColumnKey, columnKey, index) => {
      labelsByColumnKey[columnKey] = convertIndexToAlphaIndex(index)
      return labelsByColumnKey
    },
    initialMap
  )
})

const editingRowIndex = ref<number | null>(null)

const inputElementRefsByAlphaNumericIndex = ref<Record<string, InputComponents | null>>({})

function isEditingRow(rowIndex: number): boolean {
  return editingRowIndex.value === rowIndex
}

function getInputElementBy(columnKey: ColumnKey, rowIndex: number): InputComponents | null {
  const columnAlphaIndex = columnsAsAlphaIndexMap.value[columnKey]
  const cellKey = `${columnAlphaIndex}${rowIndex}`

  const inputElement = inputElementRefsByAlphaNumericIndex.value[cellKey]
  if (isNil(inputElement)) return null

  return inputElement
}

async function startEditingRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  if (isEditingRow(rowIndex)) return

  editingRowIndex.value = rowIndex

  await nextTick()

  focusOnField(columnKey, rowIndex)
}

function cancelEditingRow(rowIndex: number): void {
  const row = props.items[rowIndex]
  if (row) {
    emit("cancel", row)
  }

  editingRowIndex.value = null
}

function exitEditMode(rowIndex: number): void {
  window.setTimeout(() => {
    if (!isEditingRow(rowIndex)) return
    if (isRowFocused(rowIndex)) return

    editingRowIndex.value = null
  }, 0)
}

function isRowFocused(rowIndex: number): boolean {
  const activeElement = document.activeElement
  if (isNil(activeElement)) return false

  for (const columnKey of props.editableColumns) {
    const fieldElement = getInputElementBy(columnKey, rowIndex)
    if (isNil(fieldElement)) return false

    if (fieldElement.contains(activeElement)) {
      return true
    }
  }

  return false
}

function registerInputElement(columnKey: ColumnKey, rowIndex: number, element: unknown): void {
  if (!(element instanceof HTMLElement)) return

  const input = element.querySelector<HTMLInputElement>(INPUT_COMPONENTS.join(", "))
  if (isNil(input)) return

  const columnAlphaIndex = columnsAsAlphaIndexMap.value[columnKey]
  const cellKey = `${columnAlphaIndex}${rowIndex}`

  inputElementRefsByAlphaNumericIndex.value[cellKey] = input
}

function focusOnField(columnKey: ColumnKey, rowIndex: number): void {
  const inputElement = getInputElementBy(columnKey, rowIndex)
  if (isNil(inputElement)) return

  inputElement.focus()

  if (inputElement instanceof HTMLSelectElement) return

  inputElement.select()
}

function navigateOnKeydown(event: KeyboardEvent, columnKey: ColumnKey, rowIndex: number): void {
  const input = event.target as HTMLInputElement | null
  const isTextFullySelected =
    input?.selectionStart === 0 && input?.selectionEnd === input?.value.length

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    goToNextRow(rowIndex, columnKey)
  } else if (event.key === "Enter" && event.shiftKey) {
    event.preventDefault()
    goToPreviousRow(rowIndex, columnKey)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    goToPreviousRow(rowIndex, columnKey)
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    goToNextRow(rowIndex, columnKey)
  } else if (event.key === "ArrowLeft" && isTextFullySelected) {
    event.preventDefault()
    input?.setSelectionRange(0, 0)
  } else if (event.key === "ArrowLeft" && input?.selectionStart === 0) {
    event.preventDefault()
    goToPreviousColumn(rowIndex, columnKey)
  } else if (event.key === "ArrowRight" && isTextFullySelected) {
    event.preventDefault()
    input?.setSelectionRange(input.value.length, input.value.length)
  } else if (event.key === "ArrowRight" && input?.selectionEnd === input?.value.length) {
    event.preventDefault()
    goToNextColumn(rowIndex, columnKey)
  } else if (event.key === "Tab") {
    event.preventDefault()
    if (event.shiftKey) {
      goToPreviousColumn(rowIndex, columnKey)
    } else {
      goToNextColumn(rowIndex, columnKey)
    }
  } else if (event.key === "Escape") {
    event.preventDefault()
    cancelEditingRow(rowIndex)
  }
}

async function goToNextRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  emitItemUpdates(columnKey, rowIndex)

  const nextRowIndex = rowIndex + 1
  if (nextRowIndex >= props.items.length) {
    editingRowIndex.value = null
    return
  }

  await startEditingRow(nextRowIndex, columnKey)
}

async function goToPreviousRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  emitItemUpdates(columnKey, rowIndex)

  if (rowIndex <= 0) {
    editingRowIndex.value = null
    return
  }

  await startEditingRow(rowIndex - 1, columnKey)
}

function goToNextColumn(rowIndex: number, columnKey: ColumnKey): void {
  emitItemUpdates(columnKey, rowIndex)

  const columnIndex = props.editableColumns.indexOf(columnKey)
  const nextColumnIndex = columnIndex + 1

  if (nextColumnIndex >= props.editableColumns.length) {
    goToNextRow(rowIndex, props.editableColumns[0])
    return
  }

  const nextColumnKey = props.editableColumns[nextColumnIndex]
  if (nextColumnKey) {
    focusOnField(nextColumnKey, rowIndex)
  }
}

function goToPreviousColumn(rowIndex: number, columnKey: ColumnKey): void {
  emitItemUpdates(columnKey, rowIndex)

  const columnIndex = props.editableColumns.indexOf(columnKey)
  const previousColumnIndex = columnIndex - 1

  if (previousColumnIndex < 0) {
    const lastColumnKey = props.editableColumns[props.editableColumns.length - 1]
    if (lastColumnKey) {
      goToPreviousRow(rowIndex, lastColumnKey)
    }
    return
  }

  const previousColumnKey = props.editableColumns[previousColumnIndex]
  if (previousColumnKey) {
    focusOnField(previousColumnKey, rowIndex)
  }
}

function emitItemUpdates(columnKey: ColumnKey, rowIndex: number): void {
  const item = props.items[rowIndex]
  if (isNil(item)) return

  const inputElement = getInputElementBy(columnKey, rowIndex)
  if (isNil(inputElement)) return

  const updatedItem = {
    ...item,
    [columnKey]: inputElement.value,
  }
  emit("update:cell", updatedItem)
}
</script>

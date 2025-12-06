<template>
  <v-data-table-virtual
    v-click-outside="emitInputAndCancel"
    :items="itemClones"
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
      >
        <template
          v-for="{ key: headerKey } in headers"
          :key="headerKey"
        >
          <td
            v-if="isEditableColumn(headerKey)"
            :ref="(element: unknown) => registerInputElement(headerKey, index, element)"
            @focusin="setActiveCell(headerKey, index)"
            @keydown="navigateOnKeydown($event, headerKey, index)"
          >
            <slot
              :name="`item.${headerKey}.edit`"
              :item="item"
              :index="index"
            >
              <v-text-field
                v-model="item[headerKey]"
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
import { nextTick, ref, watchEffect } from "vue"
import { cloneDeep, isNil } from "lodash"

type InputComponents = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const INPUT_COMPONENTS = Object.freeze(["input", "textarea", "select"])

const props = defineProps<{
  headers: Header[]
  items: Item[]
  editableColumns: ColumnKey[]
}>()

const emit = defineEmits<{
  "update:cell": [item: Item]
  cancel: [void]
}>()

const itemClones = ref<Item[]>([])

watchEffect(() => {
  itemClones.value = cloneDeep(props.items)
})

const activeColumnIndex = ref<ColumnKey | null>(null)
const activeRowIndex = ref<number | null>(null)

const inputElementRefsByAlphaNumericIndex = ref<Record<string, InputComponents | null>>({})

function isEditableColumn(columnKey: string | undefined): columnKey is ColumnKey {
  return props.editableColumns.includes(columnKey as ColumnKey)
}

function isEditingRow(rowIndex: number): boolean {
  return activeRowIndex.value === rowIndex
}

function setActiveCell(columnKey: ColumnKey, rowIndex: number): void {
  activeColumnIndex.value = columnKey
  activeRowIndex.value = rowIndex
}

function getInputElementBy(columnKey: ColumnKey, rowIndex: number): InputComponents | null {
  const cellKey = `${columnKey}:${rowIndex}`
  const inputElement = inputElementRefsByAlphaNumericIndex.value[cellKey]
  if (isNil(inputElement)) return null

  return inputElement
}

async function startEditingRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  if (isEditingRow(rowIndex)) return

  activeColumnIndex.value = columnKey
  activeRowIndex.value = rowIndex

  await nextTick()

  focusOnField(columnKey, rowIndex)
}

function emitInputAndCancel() {
  if (isNil(activeRowIndex.value)) return

  emitUpdateCell(activeRowIndex.value)

  resetActiveCell()
}

function resetAndCancel(): void {
  itemClones.value = cloneDeep(props.items)

  resetActiveCell()

  emit("cancel")
}

function registerInputElement(columnKey: ColumnKey, rowIndex: number, element: unknown): void {
  if (!(element instanceof HTMLElement)) return

  const input = element.querySelector<HTMLInputElement>(INPUT_COMPONENTS.join(", "))
  if (isNil(input)) return

  const cellKey = `${columnKey}:${rowIndex}`
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
    resetAndCancel()
  }
}

async function goToNextRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  emitUpdateCell(rowIndex)

  const nextRowIndex = rowIndex + 1
  if (nextRowIndex >= props.items.length) {
    activeRowIndex.value = null
    return
  }

  await startEditingRow(nextRowIndex, columnKey)
}

async function goToPreviousRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  emitUpdateCell(rowIndex)

  if (rowIndex <= 0) {
    activeRowIndex.value = null
    return
  }

  await startEditingRow(rowIndex - 1, columnKey)
}

function goToNextColumn(rowIndex: number, columnKey: ColumnKey): void {
  emitUpdateCell(rowIndex)

  const columnIndex = props.editableColumns.indexOf(columnKey)
  const nextColumnIndex = columnIndex + 1

  if (nextColumnIndex >= props.editableColumns.length) {
    goToNextRow(rowIndex, props.editableColumns[0])
    return
  }

  const nextColumnKey = props.editableColumns[nextColumnIndex]
  if (nextColumnKey) {
    activeColumnIndex.value = nextColumnKey
    focusOnField(nextColumnKey, rowIndex)
  }
}

function goToPreviousColumn(rowIndex: number, columnKey: ColumnKey): void {
  emitUpdateCell(rowIndex)

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
    activeColumnIndex.value = previousColumnKey
    focusOnField(previousColumnKey, rowIndex)
  }
}

function emitUpdateCell(rowIndex: number): void {
  const item = itemClones.value[rowIndex]
  if (isNil(item)) return

  emit("update:cell", item as Item)
}

function resetActiveCell() {
  activeColumnIndex.value = null
  activeRowIndex.value = null
}
</script>

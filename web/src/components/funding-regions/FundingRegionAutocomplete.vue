<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="allFundingRegions"
    label="Funding Region"
    hint="Search for a funding region."
    item-value="id"
    auto-select-first
    chips
    clearable
    hide-no-data
    hide-selected
    no-filter
    persistent-hint
    @update:model-value="emit('update:modelValue', $event)"
    @update:search="debouncedUpdateSearchToken"
    @click:clear="reset"
  >
    <template #chip="{ props: chipProps, item: { raw: result } }">
      <FundingRegionAttributesChip
        v-if="!isNil(result) && !isNumber(result)"
        v-bind="chipProps"
        :funding-region="result"
      />
      <v-chip
        v-else
        v-bind="chipProps"
        :text="'Unknown#' + JSON.stringify(result)"
      />
    </template>
    <template #item="{ props: itemProps, item: { raw: result } }">
      <v-list-item
        v-if="!isNil(result.id)"
        v-bind="safeItemProps(itemProps)"
        :title="startCase(result.region)"
      />
      <v-list-item
        v-else
        v-bind="safeItemProps(itemProps)"
        :title="'Unknown#' + (result.id || JSON.stringify(result))"
      />
    </template>
    <template
      v-if="hasMore"
      #append-item
    >
      <v-divider />
      <v-list-item
        class="text-primary text-center"
        title="Show More"
        @click="nextPage"
      />
    </template>
  </v-autocomplete>
</template>

<!-- Special module scope (non-setup) required for exports -->
<script lang="ts">
export {
  type FundingRegionAsIndex,
  type FundingRegionWhereOptions,
  type FundingRegionFiltersOptions,
  type FundingRegionQueryOptions,
} from "@/use/use-funding-regions"
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { debounce, isEmpty, isNil, isNumber, omit, startCase, uniqBy } from "lodash"

import useFundingRegion from "@/use/use-funding-region"
import useFundingRegions, {
  type FundingRegionAsIndex,
  type FundingRegionWhereOptions,
  type FundingRegionFiltersOptions,
  type FundingRegionQueryOptions,
} from "@/use/use-funding-regions"

import FundingRegionAttributesChip from "@/components/funding-regions/FundingRegionAttributesChip.vue"

const props = defineProps<{
  modelValue: number | null | undefined
  where?: FundingRegionWhereOptions
  filters?: Omit<FundingRegionFiltersOptions, "search">
}>()

const emit = defineEmits<{
  "update:modelValue": [fundingRegionId: number | null | undefined]
}>()

const fundingRegionId = computed(() => props.modelValue)
const { fundingRegion } = useFundingRegion(fundingRegionId)

const searchToken = ref("")

function updateSearchToken(value: string) {
  searchToken.value = value
  page.value = 1
}

const debouncedUpdateSearchToken = debounce(updateSearchToken, 500)

const searchFilter = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return {}

  return {
    search: searchToken.value.trim().split(" "),
  }
})

const perPage = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return 100

  return 20
})

const page = ref(1)

const fundingRegionsQuery = computed<FundingRegionQueryOptions>(() => {
  return {
    where: props.where,
    filters: {
      ...props.filters,
      ...searchFilter.value,
    },
    perPage: perPage.value,
    page: page.value,
  }
})
const { fundingRegions, totalCount, isLoading, refresh } = useFundingRegions(fundingRegionsQuery)

const allFundingRegions = computed<FundingRegionAsIndex[]>(() => {
  if (isNil(fundingRegion.value)) {
    return fundingRegions.value
  }

  return uniqBy([...fundingRegions.value, fundingRegion.value], "id")
})

/**
 * If title is an attribute of the item object, it overrides the title in the list item, so title must be removed.
 */
function safeItemProps(itemProps: Record<string, unknown>) {
  return omit(itemProps, ["title"])
}

async function reset() {
  searchToken.value = ""
  fundingRegion.value = null
  await refresh()
}

watch(
  () => props.modelValue,
  async (newModelValue) => {
    if (isEmpty(newModelValue)) {
      await reset()
    }
  }
)

const hasMore = computed(() => page.value * perPage.value < totalCount.value)

function nextPage() {
  page.value += 1
}

defineExpose({
  reset,
})
</script>

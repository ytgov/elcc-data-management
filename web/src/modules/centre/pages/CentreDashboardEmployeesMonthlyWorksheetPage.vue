<template>
  <v-skeleton-loader v-if="isNil(fiscalPeriodId)">
    <template #default>
      <v-container>
        <v-row>
          <v-col>
            <v-skeleton-loader type="heading" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader
              type="card"
              height="200px"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader
              type="card"
              height="200px"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-skeleton-loader>
  <v-container v-else>
    <v-row>
      <v-col>
        <h2>{{ fiscalPeriodFormattedDate }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="section-header">Employee Benefits</h3>

        <v-skeleton-loader
          v-if="isNil(employeeBenefitId)"
          type="table"
        />
        <EmployeeBenefitEditTable
          v-else
          :employee-benefit-id="employeeBenefitId"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="section-header d-flex justify-space-between">
          Wage Enhancements

          <ReplicateEstimatesButton
            :centre-id="props.centreId"
            :fiscal-period-id="fiscalPeriodId"
            :loading="isLoading"
          />
        </h3>

        <EditWageEnhancementsWidget
          :centre-id="props.centreId"
          :fiscal-period-id="fiscalPeriodId"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { isEmpty, isNil } from "lodash"

import DateTimeUtils from "@/utils/date-time-utils"
import useFiscalPeriods, { FiscalPeriodMonths } from "@/use/use-fiscal-periods"
import useEmployeeBenefits from "@/use/use-employee-benefits"

import EmployeeBenefitEditTable from "@/components/employee-benefits/EmployeeBenefitEditTable.vue"
import EditWageEnhancementsWidget from "@/modules/centre/components/EditWageEnhancementsWidget.vue"
import ReplicateEstimatesButton from "@/components/wage-enhancements/ReplicateEstimatesButton.vue"

const props = defineProps<{
  centreId: number
  fiscalYearSlug: string
  month: FiscalPeriodMonths
}>()

const fiscalPeriodsQuery = computed(() => ({
  where: {
    fiscalYear: props.fiscalYearSlug,
    month: props.month,
  },
  perPage: 1,
}))
const { fiscalPeriods, isLoading } = useFiscalPeriods(fiscalPeriodsQuery)
const fiscalPeriod = computed(() => fiscalPeriods.value[0])
const fiscalPeriodId = computed(() => fiscalPeriod.value?.id)
const fiscalPeriodFormattedDate = computed(() => {
  if (isEmpty(fiscalPeriod.value)) return ""

  const { dateStart } = fiscalPeriod.value
  const formattedDate = DateTimeUtils.fromISO(dateStart).toUTC().toFormat("MMMM yyyy")
  return formattedDate
})

const employeeBenefitsQuery = computed(() => ({
  where: {
    centreId: props.centreId,
    fiscalPeriodId: fiscalPeriodId.value,
  },
}))
const { employeeBenefits } = useEmployeeBenefits(employeeBenefitsQuery, {
  skipWatchIf: () => isNil(fiscalPeriodId.value),
})
const employeeBenefitId = computed(() => employeeBenefits.value[0]?.id)
</script>

<style scoped>
.section-header {
  margin-bottom: 10px;
  font-weight: 400;
  background-color: #55b6c2;
  margin-left: -8px;
  padding: 8px;
  border-radius: 4px;
  margin-top: 13px;
}
</style>

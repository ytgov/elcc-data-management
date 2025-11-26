import { Factory } from "fishery"

import { FundingReconciliationAdjustment } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

import fundingReconciliationFactory from "@/factories/funding-reconciliation-factory"
import fiscalPeriodFactory from "@/factories/fiscal-period-factory"

export const fundingReconciliationAdjustmentFactory =
  Factory.define<FundingReconciliationAdjustment>(({ associations, params, onCreate,  }) => {
    onCreate(async (adjustment) => {
      try {
        await nestedSaveAndAssociateIfNew(adjustment)
        return adjustment
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create FundingReconciliationAdjustment with attributes: ${JSON.stringify(adjustment.dataValues, null, 2)}`
        )
      }
    })

    const fundingReconciliation =
      associations.fundingReconciliation ?? fundingReconciliationFactory.build({
        id: params.fundingReconciliationId,
      })

    const fiscalPeriod =
      associations.fiscalPeriod ?? fiscalPeriodFactory.build({
        id: params.fiscalPeriodId,
      })

    return FundingReconciliationAdjustment.build({
      fundingReconciliationId: fundingReconciliation.id,
      fiscalPeriodId: fiscalPeriod.id,
      fundingReceivedPeriodAmount: "0.0000",
      eligibleExpensesPeriodAmount: "0.0000",
      payrollAdjustmentsPeriodAmount: "0.0000",
      cumulativeBalanceAmount: "0.0000",
    })
  })

export default fundingReconciliationAdjustmentFactory

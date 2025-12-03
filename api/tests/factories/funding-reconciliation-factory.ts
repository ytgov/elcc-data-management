import { Factory } from "fishery"

import { FundingReconciliation } from "@/models"

import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import centreFactory from "@/factories/centre-factory"
import fundingPeriodFactory from "@/factories/funding-period-factory"

export const fundingReconciliationFactory = Factory.define<FundingReconciliation>(
  ({ associations, params, onCreate }) => {
    onCreate(async (fundingReconciliation) => {
      try {
        await nestedSaveAndAssociateIfNew(fundingReconciliation)
        return fundingReconciliation
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create FundingReconciliation with attributes: ${JSON.stringify(fundingReconciliation.dataValues, null, 2)}`
        )
      }
    })

    const centre =
      associations.centre ??
      centreFactory.build({
        id: params.centreId,
      })

    const fundingPeriod =
      associations.fundingPeriod ??
      fundingPeriodFactory.build({
        id: params.fundingPeriodId,
      })

    return FundingReconciliation.build({
      centreId: centre.id,
      fundingPeriodId: fundingPeriod.id,
      status: FundingReconciliation.Statuses.DRAFT,
      fundingReceivedTotalAmount: "0.0000",
      eligibleExpensesTotalAmount: "0.0000",
      payrollAdjustmentsTotalAmount: "0.0000",
      finalBalanceAmount: "0.0000",
    })
  }
)

export default fundingReconciliationFactory

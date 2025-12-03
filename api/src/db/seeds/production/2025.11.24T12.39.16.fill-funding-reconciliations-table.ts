import { isNil } from "lodash"

import { Centre, FundingPeriod, FundingReconciliation } from "@/models"

export async function up() {
  await Centre.findEach(async (centre) => {
    await FundingPeriod.findEach(async (fundingPeriod) => {
      const existingReconciliation = await FundingReconciliation.findOne({
        where: {
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        },
      })

      if (isNil(existingReconciliation)) {
        await FundingReconciliation.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
          status: FundingReconciliation.Statuses.DRAFT,
          fundingReceivedTotalAmount: "0",
          eligibleExpensesTotalAmount: "0",
          payrollAdjustmentsTotalAmount: "0",
          finalBalanceAmount: "0",
          notes: null,
          finalizedAt: null,
          finalizedById: null,
        })
      }
    })
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}

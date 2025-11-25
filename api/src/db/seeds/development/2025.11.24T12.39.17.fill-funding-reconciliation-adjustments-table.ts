import { isNil, isUndefined } from "lodash"

import { FundingReconciliation, FundingReconciliationAdjustment } from "@/models"

export async function up() {
  await FundingReconciliation.findEach(
    {
      include: [
        {
          association: "fundingPeriod",
          include: ["fiscalPeriods"],
        },
      ],
    },
    async (fundingReconciliation) => {
      const { fundingPeriod } = fundingReconciliation
      if (isUndefined(fundingPeriod)) {
        throw new Error("Expected fundingPeriod association to be pre-loaded.")
      }

      const { fiscalPeriods } = fundingPeriod
      if (isUndefined(fiscalPeriods)) {
        throw new Error("Expected fiscalPeriods association to be pre-loaded.")
      }

      for (const fiscalPeriod of fiscalPeriods) {
        const existingAdjustment = await FundingReconciliationAdjustment.findOne({
          where: {
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod.id,
          },
        })

        if (isNil(existingAdjustment)) {
          await FundingReconciliationAdjustment.create({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          })
        }
      }
    }
  )
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}

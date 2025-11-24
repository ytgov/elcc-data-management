import { isNil } from "lodash"

import { FiscalPeriod, FundingReconciliation, FundingReconciliationAdjustment } from "@/models"

export async function up() {
  await FundingReconciliation.findEach(async (fundingReconciliation) => {
    await FiscalPeriod.findEach(async (fiscalPeriod) => {
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
    })
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}

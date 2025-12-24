import { type CreationAttributes } from "@sequelize/core"
import { isEmpty } from "lodash"

import {
  FiscalPeriod,
  FundingPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(
    private fundingReconciliation: FundingReconciliation,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<FundingReconciliationAdjustment[]> {
    const fiscalPeriods = await FiscalPeriod.findAll({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (isEmpty(fiscalPeriods)) {
      throw new Error("No fiscal periods found for the funding period.")
    }

    const fundingReconciliationAdjustmentsAttributes: CreationAttributes<FundingReconciliationAdjustment>[] =
      fiscalPeriods.map((fiscalPeriod) => ({
        fundingReconciliationId: this.fundingReconciliation.id,
        fiscalPeriodId: fiscalPeriod.id,
        fundingReceivedPeriodAmount: "0",
        eligibleExpensesPeriodAmount: "0",
        payrollAdjustmentsPeriodAmount: "0",
        cumulativeBalanceAmount: "0",
      }))

    return FundingReconciliationAdjustment.bulkCreate(fundingReconciliationAdjustmentsAttributes)
  }
}

export default BulkCreateService

import { type CreationAttributes } from "@sequelize/core"

import db, { Centre, FundingPeriod, FundingReconciliation } from "@/models"
import BaseService from "@/services/base-service"
import { FundingReconciliations } from "@/services"

export class CreateService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    const fundingReconciliationAttributes: CreationAttributes<FundingReconciliation> = {
      centreId: this.centre.id,
      fundingPeriodId: this.fundingPeriod.id,
      status: FundingReconciliation.Statuses.DRAFT,
      fundingReceivedTotalAmount: "0",
      eligibleExpensesTotalAmount: "0",
      payrollAdjustmentsTotalAmount: "0",
      finalBalanceAmount: "0",
    }

    return db.transaction(async () => {
      const fundingReconciliation = await FundingReconciliation.create(
        fundingReconciliationAttributes
      )

      await this.ensureChildren(fundingReconciliation, this.fundingPeriod)

      return fundingReconciliation
    })
  }

  private async ensureChildren(
    fundingReconciliation: FundingReconciliation,
    fundingPeriod: FundingPeriod
  ): Promise<void> {
    await FundingReconciliations.FundingPeriods.FundingReconciliationAdjustments.BulkEnsureService.perform(
      fundingReconciliation,
      fundingPeriod
    )
  }
}

export default CreateService

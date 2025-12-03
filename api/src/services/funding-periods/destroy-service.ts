import { FiscalPeriod, FundingPeriod, FundingReconciliation } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertNoDependentEntitiesExist()

    await this.fundingPeriod.destroy()
  }

  private async assertNoDependentEntitiesExist() {
    await this.assertNoDependentFiscalPeriodsExist()
    await this.assertNoDependentFundingReconciliationsExist()
  }

  private async assertNoDependentFiscalPeriodsExist() {
    const fiscalPeriodCount = await FiscalPeriod.count({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })

    if (fiscalPeriodCount > 0) {
      throw new Error("Funding period with fiscal periods cannot be deleted")
    }
  }

  private async assertNoDependentFundingReconciliationsExist() {
    const fundingReconciliationCount = await FundingReconciliation.count({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })

    if (fundingReconciliationCount > 0) {
      throw new Error("Funding period with funding reconciliations cannot be deleted")
    }
  }
}

export default DestroyService

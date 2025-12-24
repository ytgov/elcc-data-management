import db, {
  BuildingExpense,
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
  FundingPeriod,
  FundingReconciliation,
  FundingSubmissionLine,
  FundingSubmissionLineJson,
  Payment,
  WageEnhancement,
} from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const fundingPeriodId = this.fundingPeriod.id

    await db.transaction(async () => {
      await this.destroyDependentEntities(fundingPeriodId)

      await this.fundingPeriod.destroy()
    })
  }

  private async destroyDependentEntities(fundingPeriodId: number) {
    await this.destroyDependentWageEnhancements(fundingPeriodId)
    await this.destroyDependentEmployeeWageTiers(fundingPeriodId)
    await this.destroyDependentEmployeeBenefits(fundingPeriodId)
    await this.destroyDependentBuildingExpenses(fundingPeriodId)
    await this.destroyDependentPayments(fundingPeriodId)
    await this.destroyDependentFundingReconciliations(fundingPeriodId)
    await this.destroyDependentFundingSubmissionLines(fundingPeriodId)
    await this.destroyDependentFundingSubmissionLineJsons(fundingPeriodId)
    await this.destroyDependentFiscalPeriods(fundingPeriodId)
  }

  private async destroyDependentWageEnhancements(fundingPeriodId: number) {
    await WageEnhancement.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentEmployeeWageTiers(fundingPeriodId: number) {
    await EmployeeWageTier.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentEmployeeBenefits(fundingPeriodId: number) {
    await EmployeeBenefit.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentBuildingExpenses(fundingPeriodId: number) {
    await BuildingExpense.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentPayments(fundingPeriodId: number) {
    await Payment.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentFundingReconciliations(fundingPeriodId: number) {
    await FundingReconciliation.destroy({
      where: {
        fundingPeriodId,
      },
    })
  }

  private async destroyDependentFundingSubmissionLines(fundingPeriodId: number) {
    await FundingSubmissionLine.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentFundingSubmissionLineJsons(fundingPeriodId: number) {
    await FundingSubmissionLineJson.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).destroy({ where: {} })
  }

  private async destroyDependentFiscalPeriods(fundingPeriodId: number) {
    await FiscalPeriod.destroy({
      where: {
        fundingPeriodId,
      },
    })
  }
}

import {
  BuildingExpense,
  Centre,
  EmployeeBenefit,
  FundingPeriod,
  FundingReconciliation,
  FundingSubmissionLineJson,
} from "@/models"
import BaseService from "@/services/base-service"

export type InitializationStatus = {
  hasEmployeeBenefits: boolean
  hasBuildingExpenses: boolean
  hasFundingSubmissionLineJsons: boolean
  hasFundingReconciliation: boolean
  isInitialized: boolean
}

export class IsInitializedService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<InitializationStatus> {
    const hasEmployeeBenefits = await this.checkEmployeeBenefits()
    const hasBuildingExpenses = await this.checkBuildingExpenses()
    const hasFundingSubmissionLineJsons = await this.checkFundingSubmissionLineJsons()
    const hasFundingReconciliation = await this.checkFundingReconciliation()

    const isInitialized =
      hasEmployeeBenefits &&
      hasBuildingExpenses &&
      hasFundingSubmissionLineJsons &&
      hasFundingReconciliation

    return {
      hasEmployeeBenefits,
      hasBuildingExpenses,
      hasFundingSubmissionLineJsons,
      hasFundingReconciliation,
      isInitialized,
    }
  }

  private async checkEmployeeBenefits(): Promise<boolean> {
    const count = await EmployeeBenefit.withScope({
      method: ["byFundingPeriod", this.fundingPeriod.id],
    }).count({
      where: {
        centreId: this.centre.id,
      },
    })
    return count > 0
  }

  private async checkBuildingExpenses(): Promise<boolean> {
    const count = await BuildingExpense.withScope({
      method: ["byFundingPeriod", this.fundingPeriod.id],
    }).count({
      where: {
        centreId: this.centre.id,
      },
    })
    return count > 0
  }

  private async checkFundingSubmissionLineJsons(): Promise<boolean> {
    const count = await FundingSubmissionLineJson.withScope({
      method: ["byFundingPeriodId", this.fundingPeriod.id],
    }).count({
      where: {
        centreId: this.centre.id,
      },
    })
    return count > 0
  }

  private async checkFundingReconciliation(): Promise<boolean> {
    const count = await FundingReconciliation.count({
      where: {
        centreId: this.centre.id,
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    return count > 0
  }
}

export default IsInitializedService

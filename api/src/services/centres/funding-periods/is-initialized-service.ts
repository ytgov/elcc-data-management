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
    const { id: centreId } = this.centre
    const { id: fundingPeriodId } = this.fundingPeriod
    const hasEmployeeBenefits = await this.checkEmployeeBenefits(centreId, fundingPeriodId)
    const hasBuildingExpenses = await this.checkBuildingExpenses(centreId, fundingPeriodId)
    const hasFundingSubmissionLineJsons = await this.checkFundingSubmissionLineJsons(
      centreId,
      fundingPeriodId
    )
    const hasFundingReconciliation = await this.checkFundingReconciliation(
      centreId,
      fundingPeriodId
    )

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

  private async checkEmployeeBenefits(centreId: number, fundingPeriodId: number): Promise<boolean> {
    const count = await EmployeeBenefit.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).count({
      where: {
        centreId,
      },
    })
    return count > 0
  }

  private async checkBuildingExpenses(centreId: number, fundingPeriodId: number): Promise<boolean> {
    const count = await BuildingExpense.withScope({
      method: ["byFundingPeriod", fundingPeriodId],
    }).count({
      where: {
        centreId,
      },
    })
    return count > 0
  }

  private async checkFundingSubmissionLineJsons(
    centreId: number,
    fundingPeriodId: number
  ): Promise<boolean> {
    const count = await FundingSubmissionLineJson.withScope({
      method: ["byFundingPeriodId", fundingPeriodId],
    }).count({
      where: {
        centreId,
      },
    })
    return count > 0
  }

  private async checkFundingReconciliation(
    centreId: number,
    fundingPeriodId: number
  ): Promise<boolean> {
    const count = await FundingReconciliation.count({
      where: {
        centreId,
        fundingPeriodId,
      },
    })
    return count > 0
  }
}

export default IsInitializedService

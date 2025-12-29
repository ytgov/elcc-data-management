import { Centre, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import { Centres } from "@/services"

export class EnsureChildrenService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<void> {
    await Centres.FundingPeriods.EmployeeBenefits.BulkEnsureService.perform(
      this.centre,
      this.fundingPeriod
    )
    await Centres.FundingPeriods.BuildingExpenses.BulkEnsureService.perform(
      this.centre,
      this.fundingPeriod
    )
    await Centres.FundingPeriods.FundingSubmissionLineJsons.BulkEnsureService.perform(
      this.centre,
      this.fundingPeriod
    )
    await Centres.FundingPeriods.FundingReconciliations.EnsureService.perform(
      this.centre,
      this.fundingPeriod
    )
  }
}

export default EnsureChildrenService

import { Centre, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import {
  Centres,
  FundingReconciliationAdjustments,
  FundingReconciliations,
  FundingSubmissionLineJsons,
} from "@/services"

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
    await FundingSubmissionLineJsons.BulkEnsureForCentreService.perform(this.centre)
    await FundingReconciliations.BulkEnsureForCentreService.perform(this.centre)
    await FundingReconciliationAdjustments.BulkEnsureForCentreService.perform(this.centre)
  }
}

export default EnsureChildrenService

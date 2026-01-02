import { Centre, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import { Centres } from "@/services"

export class InitializeService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<Centres.FundingPeriods.InitializationStatus> {
    await Centres.FundingPeriods.EnsureChildrenService.perform(this.centre, this.fundingPeriod)
    return Centres.FundingPeriods.IsInitializedService.perform(this.centre, this.fundingPeriod)
  }
}

export default InitializeService

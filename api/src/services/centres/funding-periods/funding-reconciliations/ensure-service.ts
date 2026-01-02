import { isNil } from "lodash"

import { Centre, FundingPeriod, FundingReconciliation } from "@/models"
import BaseService from "@/services/base-service"
import CreateService from "./create-service"

export class EnsureService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    const fundingReconciliation = await FundingReconciliation.findOne({
      where: {
        centreId: this.centre.id,
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (!isNil(fundingReconciliation)) return fundingReconciliation

    return CreateService.perform(this.centre, this.fundingPeriod)
  }
}

export default EnsureService

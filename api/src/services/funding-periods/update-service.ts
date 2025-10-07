import { Attributes } from "@sequelize/core"

import { FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"

export type FundingPeriodUpdateAttributes = Partial<Attributes<FundingPeriod>>

export class UpdateService extends BaseService {
  constructor(
    private fundingPeriod: FundingPeriod,
    private attributes: FundingPeriodUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<FundingPeriod> {
    await this.fundingPeriod.update(this.attributes)

    return this.fundingPeriod
  }
}

export default UpdateService

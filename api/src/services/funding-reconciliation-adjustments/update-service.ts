import { type Attributes } from "@sequelize/core"

import { FundingReconciliationAdjustment } from "@/models"
import BaseService from "@/services/base-service"

export type FundingReconciliationAdjustmentUpdateAttributes = Partial<
  Attributes<FundingReconciliationAdjustment>
>

export class UpdateService extends BaseService {
  constructor(
    private fundingReconciliationAdjustment: FundingReconciliationAdjustment,
    private attributes: FundingReconciliationAdjustmentUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<FundingReconciliationAdjustment> {
    await this.fundingReconciliationAdjustment.update(this.attributes)
    return this.fundingReconciliationAdjustment
  }
}

export default UpdateService

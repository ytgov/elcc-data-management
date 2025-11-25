import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingReconciliationAdjustment } from "@/models"
import BaseService from "@/services/base-service"

export type FundingReconciliationAdjustmentCreationAttributes = Partial<
  CreationAttributes<FundingReconciliationAdjustment>
>

export class CreateService extends BaseService {
  constructor(private attributes: FundingReconciliationAdjustmentCreationAttributes) {
    super()
  }

  async perform(): Promise<FundingReconciliationAdjustment> {
    const { fundingReconciliationId, fiscalPeriodId, ...optionalAttributes } = this.attributes

    if (isNil(fundingReconciliationId)) {
      throw new Error("Funding reconciliation ID is required")
    }

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    const fundingReconciliationAdjustment = await FundingReconciliationAdjustment.create({
      fundingReconciliationId,
      fiscalPeriodId,
      ...optionalAttributes,
    })
    return fundingReconciliationAdjustment
  }
}

export default CreateService

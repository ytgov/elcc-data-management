import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingReconciliation } from "@/models"
import { FundingReconciliationStatuses } from "@/models/funding-reconciliation"
import BaseService from "@/services/base-service"

export type FundingReconciliationCreationAttributes = Partial<
  CreationAttributes<FundingReconciliation>
>

export class CreateService extends BaseService {
  constructor(private attributes: FundingReconciliationCreationAttributes) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    const { centreId, fundingPeriodId } = this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(fundingPeriodId)) {
      throw new Error("Funding period ID is required")
    }

    const fundingReconciliation = await FundingReconciliation.create({
      centreId,
      fundingPeriodId,
      status: FundingReconciliationStatuses.DRAFT,
    })
    return fundingReconciliation.reload({
      include: [
        {
          association: "adjustments",
        },
      ],
    })
  }
}

export default CreateService

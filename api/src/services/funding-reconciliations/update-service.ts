import { Attributes } from "@sequelize/core"

import { FundingReconciliation } from "@/models"
import { FundingReconciliationStatuses } from "@/models/funding-reconciliation"
import BaseService from "@/services/base-service"

export type FundingReconciliationUpdateAttributes = Partial<
  Pick<Attributes<FundingReconciliation>, "status" | "notes" | "finalizedAt" | "finalizedById">
>

export class UpdateService extends BaseService {
  constructor(
    private fundingReconciliation: FundingReconciliation,
    private attributes: FundingReconciliationUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    if (this.fundingReconciliation.status !== FundingReconciliationStatuses.DRAFT) {
      throw new Error("Can only update funding reconciliations in DRAFT status")
    }

    await this.fundingReconciliation.update(this.attributes)

    return this.fundingReconciliation.reload({
      include: [
        {
          association: "adjustments",
        },
      ],
    })
  }
}

export default UpdateService

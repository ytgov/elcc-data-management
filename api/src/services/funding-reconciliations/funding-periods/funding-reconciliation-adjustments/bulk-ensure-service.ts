import { isEmpty } from "lodash"

import { FundingPeriod, FundingReconciliation, FundingReconciliationAdjustment } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "./bulk-create-service"

export class BulkEnsureService extends BaseService {
  constructor(
    private fundingReconciliation: FundingReconciliation,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<FundingReconciliationAdjustment[]> {
    const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll({
      where: {
        fundingReconciliationId: this.fundingReconciliation.id,
      },
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId: this.fundingPeriod.id,
          },
        },
      ],
    })

    if (!isEmpty(fundingReconciliationAdjustments)) return fundingReconciliationAdjustments

    return BulkCreateService.perform(this.fundingReconciliation, this.fundingPeriod)
  }
}

export default BulkEnsureService

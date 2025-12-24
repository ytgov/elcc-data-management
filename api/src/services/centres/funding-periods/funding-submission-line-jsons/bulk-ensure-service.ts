import { isEmpty } from "lodash"

import { Centre, FundingPeriod, FundingSubmissionLineJson } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/centres/funding-periods/funding-submission-line-jsons/bulk-create-service"

export class BulkEnsureService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<FundingSubmissionLineJson[]> {
    const fundingSubmissionLineJsons = await FundingSubmissionLineJson.withScope({
      method: ["byFundingPeriod", this.fundingPeriod.id],
    }).findAll({
      where: {
        centreId: this.centre.id,
      },
    })
    if (!isEmpty(fundingSubmissionLineJsons)) return fundingSubmissionLineJsons

    return BulkCreateService.perform(this.centre, this.fundingPeriod)
  }
}

export default BulkEnsureService

import { Attributes } from "@sequelize/core"

import { FundingSubmissionLine } from "@/models"
import BaseService from "@/services/base-service"

export type FundingSubmissionLineUpdateAttributes = Partial<Attributes<FundingSubmissionLine>>

export class UpdateService extends BaseService {
  constructor(
    private fundingSubmissionLine: FundingSubmissionLine,
    private attributes: FundingSubmissionLineUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<FundingSubmissionLine> {
    await this.fundingSubmissionLine.update(this.attributes)

    return this.fundingSubmissionLine
  }
}

export default UpdateService

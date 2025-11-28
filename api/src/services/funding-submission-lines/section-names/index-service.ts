import { Attributes, ModelStatic, Order, WhereOptions } from "@sequelize/core"

import { FundingSubmissionLine, User } from "@/models"
import BaseService from "@/services/base-service"

export class IndexService extends BaseService {
  constructor(
    private scopedModel: ModelStatic<FundingSubmissionLine>,
    private where: WhereOptions<Attributes<FundingSubmissionLine>>,
    private order: Order | undefined,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<string[]> {
    const fundingSubmissionLines = await this.scopedModel.findAll({
      attributes: ["sectionName"],
      where: this.where,
      group: ["section_name"],
      order: this.order,
    })
    const sectionNames = fundingSubmissionLines.map(({ sectionName }) => sectionName)
    return sectionNames
  }
}

export default IndexService

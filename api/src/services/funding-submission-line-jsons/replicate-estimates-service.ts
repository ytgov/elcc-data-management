import { Op } from "sequelize"

import { FundingSubmissionLineJson } from "@/models"
import BaseService from "@/services/base-service"

export class ReplicateEstimatesService extends BaseService {
  constructor(private fundingSubmissionLineJson: FundingSubmissionLineJson) {
    super()
  }

  async perform() {
    const futureSubmissions = await FundingSubmissionLineJson.findAll({
      attributes: ["id"],
      where: {
        centreId: this.fundingSubmissionLineJson.centreId,
        fiscalYear: this.fundingSubmissionLineJson.fiscalYear,
        dateStart: { [Op.gt]: this.fundingSubmissionLineJson.dateEnd },
      },
    })
    const futureSubmissionsIds = futureSubmissions.map((submission) => submission.id)

    await FundingSubmissionLineJson.update(
      {
        lines: this.fundingSubmissionLineJson.lines,
      },
      {
        where: {
          id: futureSubmissionsIds,
        },
      }
    )

    return
  }
}

export default ReplicateEstimatesService

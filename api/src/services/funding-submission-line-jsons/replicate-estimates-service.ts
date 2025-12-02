import { Op } from "@sequelize/core"

import { FundingSubmissionLineJson } from "@/models"
import BaseService from "@/services/base-service"

export class ReplicateEstimatesService extends BaseService {
  constructor(private fundingSubmissionLineJson: FundingSubmissionLineJson) {
    super()
  }

  /**
   * Replicates the estimates to future submissions.
   *
   * NOTE: this function assumes that all future submissions have the same lines as the current submission.
   */
  async perform() {
    const cleanLines = this.fundingSubmissionLineJson.lines.map((line) => {
      return {
        ...line,
        actualChildOccupancyRate: "0",
        actualComputedTotal: "0",
      }
    })
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
        lines: cleanLines,
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

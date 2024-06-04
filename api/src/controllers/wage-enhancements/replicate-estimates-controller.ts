import { isNaN } from "lodash"

import { ReplicateEstimatesService } from "@/services/wage-enhancements"
import BaseController from "@/controllers/base-controller"

export class ReplicateEstimatesController extends BaseController {
  async create() {
    try {
      const centreId = parseInt((this.query.centreId as string) ?? this.request.body.centreId)
      const fiscalPeriodId = parseInt(
        (this.query.fiscalPeriodId as string) ?? this.request.body.fiscalPeriodId
      )
      if (isNaN(centreId)) {
        return this.response.status(422).json({
          message: "centreId not provided or invalid",
        })
      }

      if (isNaN(fiscalPeriodId)) {
        return this.response.status(422).json({
          message: "fiscalPeriodId not provided or invalid",
        })
      }

      await ReplicateEstimatesService.perform(centreId, fiscalPeriodId)
    } catch (error) {
      return this.response.status(422).json({
        message: `Error replicating wage enhancement estimates: ${error}`,
      })
    }
  }
}

export default ReplicateEstimatesController

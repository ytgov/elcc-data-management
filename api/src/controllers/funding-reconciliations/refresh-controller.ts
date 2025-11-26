import { isNil } from "lodash"

import logger from "@/utils/logger"

import { FundingReconciliation } from "@/models"
import { FundingReconciliationPolicy } from "@/policies"
import { RefreshService } from "@/services/funding-reconciliations"
import { ShowSerializer } from "@/serializers/funding-reconciliations"
import BaseController from "@/controllers/base-controller"

export class RefreshController extends BaseController<FundingReconciliation> {
  async create() {
    try {
      const fundingReconciliation = await this.loadFundingReconciliation()
      if (isNil(fundingReconciliation)) {
        return this.response.status(404).json({
          message: "Funding reconciliation not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliation)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to refresh this funding reconciliation",
        })
      }

      const updatedReconciliation = await RefreshService.perform(fundingReconciliation)
      const serializedReconciliation = ShowSerializer.perform(updatedReconciliation)
      return this.response.json({
        fundingReconciliation: serializedReconciliation,
        policy,
      })
    } catch (error) {
      logger.error(`Error refreshing funding reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error refreshing funding reconciliation: ${error}`,
      })
    }
  }

  private loadFundingReconciliation() {
    return FundingReconciliation.findByPk(this.params.fundingReconciliationId, {
      include: ["adjustments"],
    })
  }

  private buildPolicy(
    fundingReconciliation: FundingReconciliation = FundingReconciliation.build()
  ) {
    return new FundingReconciliationPolicy(this.currentUser, fundingReconciliation)
  }
}

export default RefreshController

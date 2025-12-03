import { FundingReconciliation, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(private user: User) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertNoDependentEntitiesExist()

    await this.user.destroy()
  }

  private async assertNoDependentEntitiesExist() {
    await this.assertNoDependentFinalizedReconciliationsExist()
  }

  private async assertNoDependentFinalizedReconciliationsExist() {
    const finalizedReconciliationCount = await FundingReconciliation.count({
      where: {
        finalizedById: this.user.id,
      },
    })

    if (finalizedReconciliationCount > 0) {
      throw new Error("User who has finalized funding reconciliations cannot be deleted")
    }
  }
}

export default DestroyService

import db, { FundingReconciliation, FundingReconciliationAdjustment, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private fundingReconciliation: FundingReconciliation,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    return db.transaction(async () => {
      await this.destroyChildEntities()

      await this.fundingReconciliation.destroy()
    })
  }

  private async destroyChildEntities() {
    await FundingReconciliationAdjustment.destroy({
      where: {
        fundingReconciliationId: this.fundingReconciliation.id,
      },
    })
  }
}

export default DestroyService

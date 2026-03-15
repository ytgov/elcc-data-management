import { BuildingExpense, FiscalPeriod, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private buildingExpense: BuildingExpense,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertCurrentOrFutureFiscalPeriod(this.buildingExpense.fiscalPeriodId)

    await this.buildingExpense.destroy()
  }

  private async assertCurrentOrFutureFiscalPeriod(fiscalPeriodId: number): Promise<void> {
    const fiscalPeriod = await FiscalPeriod.findByPk(fiscalPeriodId, {
      attributes: ["dateEnd"],
      rejectOnEmpty: true,
    })

    if (fiscalPeriod.dateEnd < new Date()) {
      throw new Error("Cannot delete building expense for a past fiscal period")
    }
  }
}

export default DestroyService

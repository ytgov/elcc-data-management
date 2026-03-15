import { Attributes } from "@sequelize/core"

import { BuildingExpense, FiscalPeriod, User } from "@/models"
import BaseService from "@/services/base-service"

export type BuildingExpenseUpdateAttributes = Partial<Attributes<BuildingExpense>>

export class UpdateService extends BaseService {
  constructor(
    private buildingExpense: BuildingExpense,
    private attributes: BuildingExpenseUpdateAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpense> {
    await this.assertCurrentOrFutureFiscalPeriod(this.buildingExpense.fiscalPeriodId)

    await this.buildingExpense.update(this.attributes)

    return this.buildingExpense
  }

  private async assertCurrentOrFutureFiscalPeriod(fiscalPeriodId: number): Promise<void> {
    const fiscalPeriod = await FiscalPeriod.findByPk(fiscalPeriodId, {
      attributes: ["dateEnd"],
      rejectOnEmpty: true,
    })

    if (fiscalPeriod.dateEnd < new Date()) {
      throw new Error("Cannot update building expense for a past fiscal period")
    }
  }
}

export default UpdateService

import BaseController from "./base-controller"

import { FiscalPeriod } from "@/models"

export class FiscalPeriodsController extends BaseController<FiscalPeriod> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const fiscalPeriods = await FiscalPeriod.scope(scopes).findAll({
        where,
        order: [
          ["dateStart", "ASC"],
          ["dateEnd", "ASC"],
        ],
      })
      return this.response.json({
        fiscalPeriods,
      })
    } catch (error) {
      return this.response
        .status(400)
        .json({ message: `Invalid query for fiscalPeriods: ${error}` })
    }
  }
}

export default FiscalPeriodsController

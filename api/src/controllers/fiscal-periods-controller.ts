import BaseController from "./base-controller"

import { FiscalPeriod } from "@/models"

export class FiscalPeriodsController extends BaseController<FiscalPeriod> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedFiscalPeriods = FiscalPeriod.scope(scopes)

      const totalCount = await scopedFiscalPeriods.count({ where })
      const fiscalPeriods = await scopedFiscalPeriods.findAll({
        where,
        order: [
          ["dateStart", "ASC"],
          ["dateEnd", "ASC"],
        ],
      })
      return this.response.json({
        fiscalPeriods,
        totalCount,
      })
    } catch (error) {
      return this.response
        .status(400)
        .json({ message: `Invalid query for fiscalPeriods: ${error}` })
    }
  }
}

export default FiscalPeriodsController

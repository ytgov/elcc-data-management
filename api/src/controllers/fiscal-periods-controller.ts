import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { FiscalPeriod } from "@/models"

export class FiscalPeriodsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<FiscalPeriod>
    try {
      const fiscalPeriods = await FiscalPeriod.findAll({
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

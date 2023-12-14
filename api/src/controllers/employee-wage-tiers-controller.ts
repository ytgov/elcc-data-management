import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { EmployeeWageTier } from "@/models"

export class EmployeeWageTiersController extends BaseController {
  async index() {
    try {
      const where = this.query.where as WhereOptions<EmployeeWageTier>
      const employeeWageTiers = await EmployeeWageTier.findAll({
        where,
        order: [["tierLevel", "ASC"]],
      })
      return this.response.json({
        employeeWageTiers,
      })
    } catch (error) {
      return this.response
        .status(400)
        .json({ message: `Invalid query for employe wage tiers: ${error}` })
    }
  }
}

export default EmployeeWageTiersController

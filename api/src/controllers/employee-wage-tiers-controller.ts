import { isNil } from "lodash"

import logger from "@/utils/logger"
import { EmployeeWageTier } from "@/models"
import { EmployeeWageTierPolicy } from "@/policies"
import { IndexSerializer, ShowSerializer } from "@/serializers/employee-wage-tiers"
import BaseController from "@/controllers/base-controller"

export class EmployeeWageTiersController extends BaseController<EmployeeWageTier> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["tierLevel", "ASC"]])
      const scopedEmployeeWageTiers = EmployeeWageTierPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedEmployeeWageTiers.count({ where })
      const employeeWageTiers = await scopedEmployeeWageTiers.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedEmployeeWageTiers = IndexSerializer.perform(employeeWageTiers)
      return this.response.json({
        employeeWageTiers: serializedEmployeeWageTiers,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching employee wage tiers: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching employee wage tiers: ${error}`,
      })
    }
  }

  async show() {
    try {
      const employeeWageTier = await this.loadEmployeeWageTier()
      if (isNil(employeeWageTier)) {
        return this.response.status(404).json({
          message: "Employee wage tier not found",
        })
      }

      const policy = this.buildPolicy(employeeWageTier)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this employee wage tier",
        })
      }

      const serializedEmployeeWageTier = ShowSerializer.perform(employeeWageTier)
      return this.response.json({
        employeeWageTier: serializedEmployeeWageTier,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching employee wage tier: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching employee wage tier: ${error}`,
      })
    }
  }

  private loadEmployeeWageTier(): Promise<EmployeeWageTier | null> {
    return EmployeeWageTier.findByPk(this.params.employeeWageTierId)
  }

  private buildPolicy(employeeWageTier: EmployeeWageTier = EmployeeWageTier.build()) {
    return new EmployeeWageTierPolicy(this.currentUser, employeeWageTier)
  }
}

export default EmployeeWageTiersController

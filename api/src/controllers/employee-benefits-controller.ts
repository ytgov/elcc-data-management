import { isNil } from "lodash"

import logger from "@/utils/logger"
import { EmployeeBenefit } from "@/models"
import { EmployeeBenefitPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/employee-benefits"
import { IndexSerializer, ShowSerializer } from "@/serializers/employee-benefits"
import BaseController from "@/controllers/base-controller"

export class EmployeeBenefitsController extends BaseController<EmployeeBenefit> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()
      const scopedEmployeeBenefits = EmployeeBenefitPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedEmployeeBenefits.count({ where })
      const employeeBenefits = await scopedEmployeeBenefits.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedEmployeeBenefits = IndexSerializer.perform(employeeBenefits)
      return this.response.json({
        employeeBenefits: serializedEmployeeBenefits,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching employee benefits: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching employee benefits: ${error}`,
      })
    }
  }

  async show() {
    try {
      const employeeBenefit = await this.loadEmployeeBenefit()
      if (isNil(employeeBenefit)) {
        return this.response.status(404).json({
          message: "Employee benefit not found",
        })
      }

      const policy = this.buildPolicy(employeeBenefit)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this employee benefit",
        })
      }

      const serializedEmployeeBenefit = ShowSerializer.perform(employeeBenefit)
      return this.response.json({
        employeeBenefit: serializedEmployeeBenefit,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching employee benefit: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching employee benefit: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create employee benefits",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const employeeBenefit = await CreateService.perform(permittedAttributes)
      const serializedEmployeeBenefit = ShowSerializer.perform(employeeBenefit)
      return this.response.status(201).json({
        employeeBenefit: serializedEmployeeBenefit,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating employee benefit: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating employee benefit: ${error}`,
      })
    }
  }

  async update() {
    try {
      const employeeBenefit = await this.loadEmployeeBenefit()
      if (isNil(employeeBenefit)) {
        return this.response.status(404).json({
          message: "Employee benefit not found",
        })
      }

      const policy = this.buildPolicy(employeeBenefit)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this employee benefit",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedEmployeeBenefit = await UpdateService.perform(
        employeeBenefit,
        permittedAttributes
      )
      const serializedEmployeeBenefit = ShowSerializer.perform(updatedEmployeeBenefit)
      return this.response.json({
        employeeBenefit: serializedEmployeeBenefit,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating employee benefit: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating employee benefit: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const employeeBenefit = await this.loadEmployeeBenefit()
      if (isNil(employeeBenefit)) {
        return this.response.status(404).json({
          message: "Employee benefit not found",
        })
      }

      const policy = this.buildPolicy(employeeBenefit)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this employee benefit",
        })
      }

      await employeeBenefit.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting employee benefit: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting employee benefit: ${error}`,
      })
    }
  }

  private loadEmployeeBenefit() {
    return EmployeeBenefit.findByPk(this.params.employeeBenefitId)
  }

  private buildPolicy(employeeBenefit: EmployeeBenefit = EmployeeBenefit.build()) {
    return new EmployeeBenefitPolicy(this.currentUser, employeeBenefit)
  }
}

export default EmployeeBenefitsController

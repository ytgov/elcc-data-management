import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { EmployeeBenefit } from "@/models"
import { EmployeeBenefitSerializer } from "@/serializers"

export class EmployeeBenefitsController extends BaseController {
  index() {
    const where = this.query.where as WhereOptions<EmployeeBenefit>
    return EmployeeBenefit.findAll({
      where,
      order: ["dateStart"],
    })
      .then((employeeBenefits) => {
        const serializedEmployeeBenefits = EmployeeBenefitSerializer.asTable(employeeBenefits)
        return this.response.json({
          employeeBenefits: serializedEmployeeBenefits,
        })
      })
      .catch((error) => {
        return this.response
          .status(400)
          .json({ message: `Invalid query for employee benefits: ${error}` })
      })
  }

  async show() {
    const employeeBenefit = await this.loadEmployeeBenefit()
    if (isNil(employeeBenefit))
      return this.response.status(404).json({ message: "employee benefit not found." })

    const serializedemployeeBenefit = EmployeeBenefitSerializer.asDetailed(employeeBenefit)
    return this.response.json({
      employeeBenefit: serializedemployeeBenefit,
    })
  }

  async create() {
    return EmployeeBenefit.create(this.request.body)
      .then((employeeBenefit) => {
        return this.response.status(201).json({ employeeBenefit })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `employee benefit creation failed: ${error}` })
      })
  }

  async update() {
    const employeeBenefit = await this.loadEmployeeBenefit()
    if (isNil(employeeBenefit))
      return this.response.status(404).json({ message: "employee benefit not found." })

    return employeeBenefit
      .update(this.request.body)
      .then((employeeBenefit) => {
        const serializedemployeeBenefit = EmployeeBenefitSerializer.asDetailed(employeeBenefit)
        return this.response.json({
          employeeBenefit: serializedemployeeBenefit,
        })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `employee benefit update failed: ${error}` })
      })
  }

  async destroy() {
    const employeeBenefit = await this.loadEmployeeBenefit()
    if (isNil(employeeBenefit))
      return this.response.status(404).json({ message: "employee benefit not found." })

    return employeeBenefit
      .destroy()
      .then(() => {
        return this.response.status(204).end()
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `employee benefit deletion failed: ${error}` })
      })
  }

  private loadEmployeeBenefit(): Promise<EmployeeBenefit | null> {
    return EmployeeBenefit.findByPk(this.params.employeeBenefitId)
  }
}

export default EmployeeBenefitsController

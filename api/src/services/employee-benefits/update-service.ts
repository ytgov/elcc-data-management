import { Attributes } from "@sequelize/core"

import { EmployeeBenefit } from "@/models"
import BaseService from "@/services/base-service"

export type EmployeeBenefitUpdateAttributes = Partial<Attributes<EmployeeBenefit>>

export class UpdateService extends BaseService {
  constructor(
    private employeeBenefit: EmployeeBenefit,
    private attributes: EmployeeBenefitUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<EmployeeBenefit> {
    await this.employeeBenefit.update(this.attributes)
    return this.employeeBenefit
  }
}

export default UpdateService

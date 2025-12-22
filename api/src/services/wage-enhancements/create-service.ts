import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { WageEnhancement, User } from "@/models"
import BaseService from "@/services/base-service"

export type WageEnhancementCreationAttributes = Partial<CreationAttributes<WageEnhancement>>

export class CreateService extends BaseService {
  constructor(
    private attributes: WageEnhancementCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<WageEnhancement> {
    const {
      centreId,
      employeeWageTierId,
      employeeName,
      hoursEstimated,
      hoursActual,
      ...optionalAttributes
    } = this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(employeeWageTierId)) {
      throw new Error("Employee wage tier ID is required")
    }

    if (isNil(employeeName)) {
      throw new Error("Employee name is required")
    }

    if (isNil(hoursEstimated)) {
      throw new Error("Hours estimated is required")
    }

    if (isNil(hoursActual)) {
      throw new Error("Hours actual is required")
    }

    const wageEnhancement = await WageEnhancement.create({
      centreId,
      employeeWageTierId,
      employeeName,
      hoursEstimated,
      hoursActual,
      ...optionalAttributes,
    })
    return wageEnhancement.reload({
      include: ["employeeWageTier"],
    })
  }
}

export default CreateService

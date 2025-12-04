import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Centre, User } from "@/models"
import BaseService from "@/services/base-service"

export type CentreCreationAttributes = Partial<CreationAttributes<Centre>>

export class CreateService extends BaseService {
  constructor(
    private attributes: CentreCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<Centre> {
    const {
      name,
      license,
      community,
      region,
      status,
      isFirstNationProgram,
      ...optionalAttributes
    } = this.attributes

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    if (isNil(license)) {
      throw new Error("License is required")
    }

    if (isNil(community)) {
      throw new Error("Community is required")
    }

    if (isNil(region)) {
      throw new Error("Region is required")
    }

    if (isNil(isFirstNationProgram)) {
      throw new Error("Is First Nation Program is required")
    }

    const statusOrFallback = status || Centre.Statuses.ACTIVE

    const centre = await Centre.create({
      ...optionalAttributes,
      name,
      license,
      community,
      region,
      isFirstNationProgram,
      status: statusOrFallback,
    })

    return centre
  }
}

export default CreateService

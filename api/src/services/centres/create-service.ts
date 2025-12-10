import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { Centre, Log, User } from "@/models"
import BaseService from "@/services/base-service"
import LogServices from "@/services/log-services"

export type CentreCreationAttributes = Partial<CreationAttributes<Centre>>

export class CreateService extends BaseService {
  constructor(
    private attributes: CentreCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<Centre> {
    const {
      fundingRegionId,
      name,
      license,
      community,
      status,
      isFirstNationProgram,
      ...optionalAttributes
    } = this.attributes

    if (isNil(fundingRegionId)) {
      throw new Error("Region is required")
    }

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    if (isNil(license)) {
      throw new Error("License is required")
    }

    if (isNil(community)) {
      throw new Error("Community is required")
    }

    if (isNil(isFirstNationProgram)) {
      throw new Error("Is First Nation Program is required")
    }

    const statusOrFallback = status || Centre.Statuses.ACTIVE

    return db.transaction(async () => {
      const centre = await Centre.create({
        ...optionalAttributes,
        fundingRegionId,
        name,
        license,
        community,
        isFirstNationProgram,
        status: statusOrFallback,
      })

      await this.logCentreCreation(centre, this.currentUser)

      return centre
    })
  }

  private async logCentreCreation(centre: Centre, currentUser: User) {
    // TODO: update log services to newer service pattern.
    await LogServices.create({
      model: centre,
      currentUser,
      operation: Log.OperationTypes.CREATE,
    })
  }
}

export default CreateService

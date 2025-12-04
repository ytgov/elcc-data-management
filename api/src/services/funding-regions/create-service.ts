import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"

export type FundingRegionCreationAttributes = Partial<CreationAttributes<FundingRegion>>

export class CreateService extends BaseService {
  constructor(
    private attributes: FundingRegionCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<FundingRegion> {
    const { region, subsidyRate } = this.attributes

    if (isNil(region)) {
      throw new Error("Region is required")
    }

    if (isNil(subsidyRate)) {
      throw new Error("Subsidy rate is required")
    }

    const fundingRegion = await FundingRegion.create({
      region,
      subsidyRate,
    })

    return fundingRegion
  }
}

export default CreateService

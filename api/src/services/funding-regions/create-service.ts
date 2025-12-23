import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"
import { FundingRegions } from "@/services"

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

    return db.transaction(async () => {
      const fundingRegion = await FundingRegion.create({
        region,
        subsidyRate,
      })

      await this.ensureChildren(fundingRegion)

      return fundingRegion
    })
  }

  private async ensureChildren(
    newFundingRegion: FundingRegion
  ): Promise<void> {
    await FundingRegions.EnsureChildrenService.perform(newFundingRegion)
  }
}

export default CreateService

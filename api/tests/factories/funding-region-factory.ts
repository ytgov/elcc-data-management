import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { FundingRegion } from "@/models"

import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

export const fundingRegionFactory = Factory.define<FundingRegion>(({ sequence, onCreate }) => {
  onCreate(async (fundingRegion) => {
    try {
      await nestedSaveAndAssociateIfNew(fundingRegion)
      return fundingRegion
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create FundingRegion with attributes: ${JSON.stringify(fundingRegion.dataValues, null, 2)}`
      )
    }
  })

  const randomCityLowerCase = faker.location.city().toLowerCase()
  const region = `${randomCityLowerCase}-${sequence}`
  const subsidyRate = faker.finance.amount({ min: 0.01, max: 0.5, dec: 4 })

  const fundingRegion = FundingRegion.build({
    region,
    subsidyRate,
  })

  return fundingRegion
})

export default fundingRegionFactory

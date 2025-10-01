import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { Centre } from "@/models"
import { CentreStatuses } from "@/models/centre"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

const yukonCommunities = [
  "Carmacks",
  "Dawson",
  "Faro",
  "Haines Junction",
  "Mayo",
  "Teslin",
  "Watson Lake",
  "Whitehorse",
  "Ibex Valley",
  "Mount Lorne",
  "Carcross",
  "Beaver Creek",
  "Burwash Landing",
  "Destruction Bay",
  "Champagne",
]

export const centreFactory = Factory.define<Centre>(({ sequence, onCreate }) => {
  onCreate(async (centre) => {
    try {
      await nestedSaveAndAssociateIfNew(centre)
      return centre
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create Centre with attributes: ${JSON.stringify(centre.dataValues, null, 2)}`
      )
    }
  })

  const name = `${faker.company.name()} Centre ${sequence}`
  const community = faker.helpers.arrayElement(yukonCommunities)
  const region = faker.helpers.enumValue(Centre.Regions)
  const isFirstNationProgram = faker.datatype.boolean({ probability: 0.3 })
  const status = faker.helpers.objectValue(CentreStatuses)

  return Centre.build({
    name,
    community,
    region,
    isFirstNationProgram,
    status,
  })
})

export default centreFactory

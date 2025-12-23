import { Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { type Includeable } from "@sequelize/core"

import { Centre } from "@/models"
import { CentreStatuses } from "@/models/centre"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import fundingRegionFactory from "@/factories/funding-region-factory"

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

type TransientParam = {
  include?: Includeable | Includeable[]
}

export const centreFactory = Factory.define<Centre, TransientParam>(
  ({ sequence, params, associations, transientParams, onCreate }) => {
    onCreate(async (centre) => {
      try {
        await nestedSaveAndAssociateIfNew(centre)

        if (transientParams.include === undefined) {
          return centre
        }

        return centre.reload({
          include: transientParams.include,
        })
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create Centre with attributes: ${JSON.stringify(centre.dataValues, null, 2)}`
        )
      }
    })

    const fundingRegion =
      associations.fundingRegion ??
      fundingRegionFactory.build({
        id: params.fundingRegionId,
      })

    const name = `${faker.company.name()} Centre ${sequence}`
    const community = faker.helpers.arrayElement(yukonCommunities)
    const isFirstNationProgram = faker.datatype.boolean({ probability: 0.3 })
    const status = faker.helpers.objectValue(CentreStatuses)

    const centre = Centre.build({
      fundingRegionId: fundingRegion.id,
      name,
      community,
      isFirstNationProgram,
      status,
    })

    centre.fundingRegion = fundingRegion

    return centre
  }
)

export default centreFactory

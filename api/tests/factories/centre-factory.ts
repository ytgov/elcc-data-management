import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { Centre } from "@/models"
import { CentreStatuses } from "@/models/centre"

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
  onCreate((centre) => centre.save())

  return Centre.build({
    id: sequence,
    name: faker.person.firstName(),
    license: faker.helpers.arrayElement([
      `ECLC-${faker.number.int({ min: 100000, max: 999999 })}`,
      null,
    ]),
    community: faker.helpers.arrayElement(yukonCommunities),
    region: faker.helpers.enumValue(Centre.Regions),
    isFirstNationProgram: faker.datatype.boolean({ probability: 0.3 }),
    status: faker.helpers.objectValue(CentreStatuses),
    hotMeal: faker.helpers.arrayElement([true, false, null]),
    licensedFor: faker.helpers.arrayElement([faker.number.int({ min: 1, max: 100 }), null]),
    lastSubmission: faker.helpers.arrayElement([faker.date.recent(), null]),
    createdAt: faker.date.past(),
  })
})

export default centreFactory

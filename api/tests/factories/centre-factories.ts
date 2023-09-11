import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { Centre, CentreStatus } from "@/models"

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
  onCreate((attribues) => Centre.create(attribues))

  return Centre.build({
    id: sequence,
    name: faker.person.firstName(),
    license: faker.helpers.arrayElement([
      `ECLC-${faker.number.int({ min: 100000, max: 999999 })}`,
      null,
    ]),
    community: faker.helpers.arrayElement(yukonCommunities),
    status: faker.helpers.objectValue(CentreStatus),
    hotMeal: faker.helpers.arrayElement([true, false, null]),
    licensedFor: faker.helpers.arrayElement([faker.number.int({ min: 1, max: 100 }), null]),
    lastSubmission: faker.helpers.arrayElement([faker.date.recent(), null]),
    createDate: faker.date.past(),
  })
})

export default centreFactory

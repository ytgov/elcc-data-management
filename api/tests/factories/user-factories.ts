import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { User, UserStatus } from "@/models"

export const userFactory = Factory.define<User>(({ sequence, onCreate }) => {
  onCreate((user) => user.save())

  return User.build({
    email: `${faker.internet.email()}-${sequence}`,
    sub: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    status: faker.helpers.objectValue(UserStatus),
    isAdmin: faker.datatype.boolean(0.2),
    ynetId: faker.helpers.arrayElement([`YNET-${faker.number.int({ min: 1, max: 1000 })}`, null]),
    directoryId: faker.helpers.arrayElement([
      `Directory-${faker.number.int({ min: 1, max: 1000 })}`,
      null,
    ]),
    createdAt: faker.date.past(),
  })
})

export default userFactory

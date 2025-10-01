import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { User } from "@/models"
import { UserStatus } from "@/models/user"

export const userFactory = Factory.define<User>(({ sequence, onCreate }) => {
  onCreate(async (user) => {
    try {
      await user.save()
      return user
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create User with attributes: ${JSON.stringify(user.dataValues, null, 2)}`
      )
    }
  })

  const email = `${faker.internet.email()}-${sequence}`
  const sub = faker.string.uuid()
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const status = faker.helpers.objectValue(UserStatus)

  return User.build({
    email,
    sub,
    firstName,
    lastName,
    status,
  })
})

export default userFactory

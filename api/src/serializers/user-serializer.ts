import { pick } from "lodash"

import { User } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class UserSerializer extends BaseSerializer<User> {
  static asDetailedTable(users: User[]) {
    return users.map((user) => ({
      ...pick(user.dataValues, [
        "id",
        "email",
        "firstName",
        "lastName",
        "status",
        "isAdmin",
        "createdAt",
        "updatedAt",
      ]),
      displayName: `${user.firstName} ${user.lastName}`,
      roles: user.roles,
    }))
  }
}

export default UserSerializer

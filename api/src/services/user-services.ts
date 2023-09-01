import { isNil } from "lodash"

import db from "@/db/db-client"

import { User, UserRole } from "@/models"

export class UserServices {
  static async update(
    user: User,
    newAttributes: { roles?: string[] } & Partial<User>
  ): Promise<User> {
    const { roles, ...newAttributesWithoutRoles } = newAttributes

    return db.transaction(async (transaction) => {
      await user.update(newAttributesWithoutRoles, { transaction })
      if (isNil(roles)) return user

      await UserRole.destroy({ where: { email: user.email }, transaction })
      const userRolesAttributes = roles.map((role) => ({
        email: user.email,
        role,
      }))
      await UserRole.bulkCreate(userRolesAttributes, { transaction })

      return user.reload({ transaction }) // need to reload to get updated roles
    })
  }
}

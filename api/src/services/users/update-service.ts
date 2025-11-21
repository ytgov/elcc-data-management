import { Attributes, CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { User, UserRole } from "@/models"
import BaseService from "@/services/base-service"

export type UserRoleCreationAttributes = CreationAttributes<UserRole>
export type UserUpdateAttributes = Partial<Attributes<User>> & {
  rolesAttributes?: UserRoleCreationAttributes[]
}

export class UpdateService extends BaseService {
  constructor(
    private user: User,
    private attributes: UserUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<User> {
    const { rolesAttributes, ...userAttributes } = this.attributes

    return db.transaction(async () => {
      await this.user.update(userAttributes)

      console.log(`rolesAttributes:`, JSON.stringify(rolesAttributes, null, 2))
      if (!isNil(rolesAttributes)) {
        await this.bulkReplaceRoles(this.user.id, rolesAttributes)
      }

      return this.user.reload({
        include: ["roles"],
      })
    })
  }

  private async bulkReplaceRoles(userId: number, rolesAttributes: UserRoleCreationAttributes[]) {
    await UserRole.destroy({
      where: {
        userId,
      },
    })
    const userRolesAttributes: CreationAttributes<UserRole>[] = rolesAttributes.map((role) => ({
      ...role,
      userId,
    }))
    await UserRole.bulkCreate(userRolesAttributes)
  }
}

export default UpdateService

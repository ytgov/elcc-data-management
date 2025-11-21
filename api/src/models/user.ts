import {
  DataTypes,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"
import { isEmpty, isNil } from "lodash"

import BaseModel from "@/models/base-model"

// TODO: standardize to snake_case
export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

// TODO: standardize to snake_case
export enum UserRoles {
  ADMIN = "Admin",
  EDITOR = "Editor",
  USER = "User",
  SUPER_ADMIN = "Super Admin",
  SYSTEM_ADMINISTRATOR = "System Administrator",
}

export const USER_ROLES = Object.values<string>(UserRoles)

@Table({
  paranoid: false,
})
export class User extends BaseModel<InferAttributes<User>, InferCreationAttributes<User>> {
  static readonly Status = UserStatus
  static readonly Roles = UserRoles

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(200))
  @NotNull
  @Unique
  declare email: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare sub: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare firstName: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare lastName: string

  @Attribute(DataTypes.STRING(50))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(UserStatus)],
      msg: `Status must be one of: ${Object.values(UserStatus).join(", ")}`,
    },
  })
  declare status: UserStatus

  @Attribute({
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: UserRoles.USER,
    get() {
      const roles = this.getDataValue("roles")
      if (isEmpty(roles)) return []

      return roles.split(",")
    },
    set(value: string[]) {
      this.setDataValue("roles", value.join(","))
    },
    validate: {
      isValidRole(roles: string) {
        if (isNil(roles) || isEmpty(roles)) return

        const rolesArray = roles.split(",")
        rolesArray.forEach((role: string) => {
          if (USER_ROLES.includes(role)) return

          throw new Error(`Invalid role: ${role}. Allowed roles are: ${USER_ROLES.join(", ")}`)
        })
      },
    },
  })
  declare roles: CreationOptional<string[]>

  @Attribute(DataTypes.STRING(50))
  declare ynetId: string | null

  @Attribute(DataTypes.STRING(50))
  declare directoryId: string | null

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Magic Attributes
  get displayName(): NonAttribute<string> {
    return [this.firstName, this.lastName].filter(Boolean).join(" ")
  }

  get isSystemAdministrator(): NonAttribute<boolean> {
    return this.roles.includes(UserRoles.SYSTEM_ADMINISTRATOR)
  }

  static establishScopes() {
    this.addSearchScope(["firstName", "lastName", "email"])
  }
}

export default User

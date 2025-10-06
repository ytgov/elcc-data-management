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
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import UserRole from "@/models/user-role"

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

@Table({
  paranoid: false,
})
export class User extends BaseModel<InferAttributes<User>, InferCreationAttributes<User>> {
  static readonly Status = UserStatus

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

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isAdmin: CreationOptional<boolean>

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

  // Associations
  @HasMany(() => UserRole, {
    foreignKey: "userId",
    inverse: {
      as: "user",
    },
  })
  declare roles?: NonAttribute<UserRole[]>

  static establishScopes() {
    this.addSearchScope(["firstName", "lastName", "email"])
  }
}

export default User

import {
  DataTypes,
  Model,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import User from "@/models/user"

// Keep in sync with web/src/api/user-roles-api.ts
// TODO: normalize to snake_case
export enum RoleTypes {
  EDITOR = "Editor",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin",
  SYSTEM_ADMINISTRATOR = "System Administrator",
}

@Table({
  paranoid: false,
})
export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  static readonly Types = RoleTypes

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(RoleTypes)],
      msg: `Role must be one of: ${Object.values(RoleTypes).join(", ")}`,
    },
  })
  declare role: RoleTypes

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Associations
  @BelongsTo(() => User, {
    foreignKey: "userId",
    inverse: {
      as: "roles",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>

  static establishScopes() {
    // add as needed
  }
}

export default UserRole

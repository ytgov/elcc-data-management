import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"

import User from "@/models/user"

export enum RoleTypes {
  EDITOR = "Editor",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin",
  SYSTEM_ADMINISTRATOR = "System Administrator",
}

export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  declare id: CreationOptional<number>
  declare userId: ForeignKey<User["id"]>
  declare role: string

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getUser: BelongsToGetAssociationMixin<User>
  declare setUser: BelongsToSetAssociationMixin<User, User["id"]>
  declare createUser: BelongsToCreateAssociationMixin<User>

  declare user?: NonAttribute<User>

  declare static associations: {
    user: Association<UserRole, User>
  }

  static establishAssociations() {
    this.belongsTo(User)
  }
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [Object.values(RoleTypes)],
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  }
)

export default UserRole

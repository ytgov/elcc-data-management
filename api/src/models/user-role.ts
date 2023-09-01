import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Association,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
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
  declare email: ForeignKey<User["email"]>
  declare role: string

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getUser: BelongsToGetAssociationMixin<User>
  declare setUser: BelongsToSetAssociationMixin<User, User["email"]>
  declare createUser: BelongsToCreateAssociationMixin<User>

  declare user?: NonAttribute<User>

  declare static associations: {
    user: Association<UserRole, User>
  }

  static establishasAssociations() {
    this.belongsTo(User, {
      foreignKey: "email",
    })
  }
}

UserRole.init(
  {
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [Object.values(RoleTypes)],
      }
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  }
)

// supress creation of primary key id column
// currently this table does not have a primary key column
// TODO: add primary key column
UserRole.removeAttribute("id")

export default UserRole

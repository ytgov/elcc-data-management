import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
} from "sequelize"

import sequelize from "@/db/db-client"

import UserRole from "@/models/user-role"

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare email: string
  declare sub: string
  declare firstName: string
  declare lastName: string
  declare status: UserStatus
  declare isAdmin: CreationOptional<boolean>
  declare ynetId: string | null
  declare directoryId: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#foohasmanybar
  // https://sequelize.org/api/v7/types/_sequelize_core.index.hasmanyaddassociationmixin
  declare getRoles: HasManyGetAssociationsMixin<UserRole>
  declare setRoles: HasManySetAssociationsMixin<UserRole, UserRole["userId"]>
  declare hasRole: HasManyHasAssociationMixin<UserRole, UserRole["userId"]>
  declare hasRoles: HasManyHasAssociationsMixin<UserRole, UserRole["userId"]>
  declare addRole: HasManyAddAssociationMixin<UserRole, UserRole["userId"]>
  declare addRoles: HasManyAddAssociationsMixin<UserRole, UserRole["userId"]>
  declare removeRole: HasManyRemoveAssociationMixin<UserRole, UserRole["userId"]>
  declare removeRoles: HasManyRemoveAssociationsMixin<UserRole, UserRole["userId"]>
  declare countRoles: HasManyCountAssociationsMixin
  declare createRole: HasManyCreateAssociationMixin<UserRole>

  declare roles?: NonAttribute<UserRole[]> // where user roles assocation gets loaded into

  declare static associations: {
    roles: Association<User, UserRole>
  }

  static establishAssociations() {
    this.hasMany(UserRole, {
      sourceKey: "id",
      foreignKey: "userId",
      as: "roles",
    })
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(200),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    sub: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ynetId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    directoryId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
  }
)

export default User

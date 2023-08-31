import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"

import sequelize from "@/db/db-client"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare email: string
  declare sub: string
  declare firstName: string
  declare lastName: string
  declare status: string
  declare isAdmin: CreationOptional<boolean>
  declare ynetId: string | null
  declare directoryId: string | null
  declare createDate: CreationOptional<Date>
}

User.init(
  {
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: true,
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
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  }
)
export default User

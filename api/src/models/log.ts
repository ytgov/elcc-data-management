import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export enum LogOperationTypes {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  declare id: CreationOptional<number>
  declare tableName: string
  declare operation: string
  declare userEmail: string
  declare data: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tableName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    operation: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(2000),
      allowNull: false,
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

export default Log

import {
  DataTypes,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"

export enum LogOperationTypes {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export class Log extends BaseModel<InferAttributes<Log>, InferCreationAttributes<Log>> {
  static readonly OperationTypes = LogOperationTypes

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare tableName: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(LogOperationTypes)],
      msg: `Operation must be one of: ${Object.values(LogOperationTypes).join(", ")}`,
    },
  })
  declare operation: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare userEmail: string

  @Attribute(DataTypes.STRING(2000))
  @NotNull
  declare data: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  declare deletedAt: Date | null

  static establishScopes() {
    // add as needed
  }
}

export default Log

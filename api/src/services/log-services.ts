import { Model, ModelStatic, Transaction } from "@sequelize/core"

import { Log, User } from "@/models"
import { LogOperationTypes } from "@/models/log"

export class LogServices {
  static async create({
    model,
    currentUser,
    operation,
    transaction,
  }: {
    model: Model
    currentUser: User
    operation: LogOperationTypes
    transaction: Transaction
  }): Promise<Log> {
    const ModelClass = model.constructor as ModelStatic<Model>
    const { tableName, primaryKeyAttribute } = ModelClass

    const modelColumnsAttributes = ModelClass.getAttributes()
    const firstColumnName = Object.keys(modelColumnsAttributes)[0]
    const primaryKeyName = primaryKeyAttribute || firstColumnName
    const primaryKeyValue = model.get(primaryKeyName)

    return Log.create(
      {
        userEmail: currentUser.email,
        operation: `${operation} record with ${primaryKeyName}=${primaryKeyValue}`,
        tableName,
        data: JSON.stringify(model),
      },
      { transaction }
    )
  }
}

export default LogServices

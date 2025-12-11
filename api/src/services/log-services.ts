import { Model, ModelStatic } from "@sequelize/core"

import { Log, User } from "@/models"
import { LogOperationTypes } from "@/models/log"

export class LogServices {
  static async create({
    model,
    currentUser,
    operation,
  }: {
    model: Model
    currentUser: User
    operation: LogOperationTypes
  }): Promise<Log> {
    const ModelClass = model.constructor as ModelStatic<Model>
    const { tableName } = ModelClass.modelDefinition.table

    return Log.create({
      userEmail: currentUser.email,
      operation,
      tableName,
      data: JSON.stringify(model),
    })
  }
}

export default LogServices

import { CreationAttributes } from "sequelize"

import db from "@/db/db-client"
import { Centre, User } from "@/models"
import { LogOperationTypes } from "@/models/log"

import BaseService from "@/services/base-service"
import LogServices from "@/services/log-services"

export class CentreServices implements BaseService {
  static async create(
    attributes: CreationAttributes<Centre>,
    { currentUser }: { currentUser: User }
  ): Promise<Centre> {
    return db.transaction(async (transaction) => {
      const centre = await Centre.create(attributes, { transaction })

      await LogServices.create({
        model: centre,
        currentUser,
        operation: LogOperationTypes.CREATE,
        transaction,
      })

      return centre
    })
  }

  static async update(
    centre: Centre,
    newAttributes: Partial<Centre>,
    { currentUser }: { currentUser: User }
  ): Promise<Centre> {
    return db.transaction(async (transaction) => {
      await centre.update(newAttributes, { transaction })

      await LogServices.create({
        model: centre,
        currentUser,
        operation: LogOperationTypes.UPDATE,
        transaction,
      })

      return centre
    })
  }
}

export default CentreServices

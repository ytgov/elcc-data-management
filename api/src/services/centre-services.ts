import { InferCreationAttributes } from "sequelize"

import db from "@/db/db-client"
import { Centre, User } from "@/models"

import BaseService from "@/services/base-service"
import { LogService } from "@/services/log-service"

export class CentreServices implements BaseService {
  static async create(
    attributes: InferCreationAttributes<Centre>,
    { currentUser }: { currentUser: User }
  ) {
    return db.transaction(async (transaction) => {
      const centre = await Centre.create(attributes, { transaction })

      // TODO: pass transaction once log service supports it.
      const logService = new LogService()
      await logService.create({
        user_email: currentUser.email,
        operation: `Create record ${centre.id}`,
        table_name: "Centre",
        data: JSON.stringify(centre),
      })
    })
  }

  static async update(
    centre: Centre,
    newAttributes: Partial<Centre>,
    { currentUser }: { currentUser: User }
  ): Promise<Centre> {
    return db.transaction(async (transaction) => {
      await centre.update(newAttributes, { transaction })

      // TODO: pass transaction once log service supports it.
      const logService = new LogService()
      await logService.create({
        user_email: currentUser.email,
        operation: `Update record ${centre.id}`,
        table_name: "Centre",
        data: JSON.stringify(centre),
      })

      return centre
    })
  }
}

export default CentreServices

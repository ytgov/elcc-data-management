import db, { Centre, Log, User } from "@/models"
import BaseService from "@/services/base-service"
import LogServices from "@/services/log-services"

export class UpdateService extends BaseService {
  constructor(
    private centre: Centre,
    private attributes: Partial<Centre>,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<Centre> {
    return db.transaction(async () => {
      await this.centre.update(this.attributes)

      await this.logCentreCreation(this.centre, this.currentUser)

      return this.centre
    })
  }

  private async logCentreCreation(centre: Centre, currentUser: User) {
    // TODO: update log services to newer service pattern.
    await LogServices.create({
      model: centre,
      currentUser,
      operation: Log.OperationTypes.UPDATE,
    })
  }
}

export default UpdateService

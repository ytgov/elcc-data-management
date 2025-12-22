import db, {
  BuildingExpense,
  Centre,
  EmployeeBenefit,
  FundingReconciliation,
  FundingSubmissionLineJson,
  Log,
  Payment,
  User,
  WageEnhancement,
} from "@/models"
import BaseService from "@/services/base-service"
import LogServices from "@/services/log-services"

export class DestroyService extends BaseService {
  constructor(
    private centre: Centre,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await db.transaction(async () => {
      await this.destroyDependentEntities()

      await this.centre.destroy()

      await this.logCentreDestruction(this.centre, this.currentUser)
    })
  }

  private async destroyDependentEntities() {
    await this.destroyDependentBuildingExpenses()
    await this.destroyDependentEmployeeBenefits()
    await this.destroyDependentFundingSubmissionLineJsons()
    await this.destroyDependentPayments()
    await this.destroyDependentWageEnhancements()
    await this.destroyDependentFundingReconciliations()
  }

  private async destroyDependentBuildingExpenses() {
    await BuildingExpense.destroy({
      where: {
        centreId: this.centre.id,
      },
    })
  }

  private async destroyDependentEmployeeBenefits() {
    await EmployeeBenefit.destroy({
      where: {
        centreId: this.centre.id,
      },
    })
  }

  private async destroyDependentFundingSubmissionLineJsons() {
    await FundingSubmissionLineJson.destroy({
      where: {
        centreId: this.centre.id,
      },
    })
  }

  private async destroyDependentPayments() {
    await Payment.destroy({
      where: {
        centreId: this.centre.id,
      },
    })
  }

  private async destroyDependentWageEnhancements() {
    await WageEnhancement.destroy({
      where: {
        centreId: this.centre.id,
      },
    })
  }

  private async destroyDependentFundingReconciliations() {
    await FundingReconciliation.destroy({
      where: {
        centreId: this.centre.id,
      },
    })
  }

  private async logCentreDestruction(centre: Centre, currentUser: User) {
    // TODO: update log services to newer service pattern.
    await LogServices.create({
      model: centre,
      currentUser,
      operation: Log.OperationTypes.DELETE,
    })
  }
}

export default DestroyService

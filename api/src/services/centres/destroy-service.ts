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
      await this.assertNoDependentEntitiesExist()

      await this.centre.destroy()

      await this.logCentreDestruction(this.centre, this.currentUser)
    })
  }

  private async assertNoDependentEntitiesExist() {
    await this.assertNoDependentBuildingExpensesExist()
    await this.assertNoDependentEmployeeBenefitsExist()
    await this.assertNoDependentFundingSubmissionLineJsonsExist()
    await this.assertNoDependentPaymentsExist()
    await this.assertNoDependentWageEnhancementsExist()
    await this.assertNoDependentFundingReconciliationsExist()
  }

  private async assertNoDependentBuildingExpensesExist() {
    const buildingExpenseCount = await BuildingExpense.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (buildingExpenseCount > 0) {
      throw new Error("Centre with building expenses cannot be deleted")
    }
  }

  private async assertNoDependentEmployeeBenefitsExist() {
    const employeeBenefitCount = await EmployeeBenefit.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (employeeBenefitCount > 0) {
      throw new Error("Centre with employee benefits cannot be deleted")
    }
  }

  private async assertNoDependentFundingSubmissionLineJsonsExist() {
    const fundingSubmissionLineJsonCount = await FundingSubmissionLineJson.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (fundingSubmissionLineJsonCount > 0) {
      throw new Error("Centre with funding submission line jsons cannot be deleted")
    }
  }

  private async assertNoDependentPaymentsExist() {
    const paymentCount = await Payment.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (paymentCount > 0) {
      throw new Error("Centre with payments cannot be deleted")
    }
  }

  private async assertNoDependentWageEnhancementsExist() {
    const wageEnhancementCount = await WageEnhancement.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (wageEnhancementCount > 0) {
      throw new Error("Centre with wage enhancements cannot be deleted")
    }
  }

  private async assertNoDependentFundingReconciliationsExist() {
    const fundingReconciliationCount = await FundingReconciliation.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (fundingReconciliationCount > 0) {
      throw new Error("Centre with funding reconciliations cannot be deleted")
    }
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

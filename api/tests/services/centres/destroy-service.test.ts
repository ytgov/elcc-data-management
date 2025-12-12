import {
  BuildingExpense,
  Centre,
  EmployeeBenefit,
  FundingReconciliation,
  FundingReconciliationAdjustment,
  FundingSubmissionLineJson,
  Log,
  Payment,
  WageEnhancement,
} from "@/models"

import {
  buildingExpenseFactory,
  centreFactory,
  employeeBenefitFactory,
  employeeWageTierFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationAdjustmentFactory,
  fundingReconciliationFactory,
  fundingSubmissionLineJsonFactory,
  paymentFactory,
  userFactory,
  wageEnhancementFactory,
} from "@/factories"

import DestroyService from "@/services/centres/destroy-service"

describe("api/src/services/centres/destroy-service.ts", () => {
  describe("DestroyService", () => {
    describe("#perform", () => {
      test("when centre has no dependents, destroys the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const reloadedCentre = await Centre.findByPk(centre.id)
        expect(reloadedCentre).toBeNull()
      })

      test("when centre destroyed, logs delete event", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const logs = await Log.findAll()
        expect(logs).toEqual([
          expect.objectContaining({
            operation: Log.OperationTypes.DELETE,
            tableName: "centres",
            userEmail: currentUser.email,
            data: JSON.stringify(centre),
          }),
        ])
      })

      test("when centre has building expenses, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const buildingExpenseCount = await BuildingExpense.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(buildingExpenseCount).toEqual(0)
      })

      test("when centre has employee benefits, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const employeeBenefitCount = await EmployeeBenefit.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(employeeBenefitCount).toEqual(0)
      })

      test("when centre has funding submission line jsons, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const fundingSubmissionLineJsonCount = await FundingSubmissionLineJson.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(fundingSubmissionLineJsonCount).toEqual(0)
      })

      test("when centre has payments, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
          dateEnd: new Date("2024-04-30"),
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          paidOn: new Date("2024-04-15").toDateString(),
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const paymentCount = await Payment.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(paymentCount).toEqual(0)
      })

      test("when centre has wage enhancements, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        const employeeWageTier = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
        })
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier.id,
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const wageEnhancementCount = await WageEnhancement.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(wageEnhancementCount).toEqual(0)
      })

      test("when centre has funding reconciliations, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const fundingReconciliationCount = await FundingReconciliation.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(fundingReconciliationCount).toEqual(0)
      })

      test("when centre has funding reconciliation adjustments, destroys them with the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const fundingReconciliationAdjustmentCount = await FundingReconciliationAdjustment.count()
        expect(fundingReconciliationAdjustmentCount).toEqual(0)
      })
    })
  })
})

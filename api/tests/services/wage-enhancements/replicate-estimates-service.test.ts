import { FiscalPeriod, WageEnhancement } from "@/models"
import { ReplicateEstimatesService } from "@/services/wage-enhancements"
import {
  centreFactory,
  employeeWageTierFactory,
  fiscalPeriodFactory,
  wageEnhancementFactory,
} from "@/factories"

describe("api/src/services/wage-enhancements/replicate-estimates-service.ts", () => {
  describe("ReplicateEstimatesService", () => {
    describe("#perform", () => {
      test("when provide a centreId and fiscalPeriodId, replicates wage enhancement estimates forward", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fiscalYear: "2024-25",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2024-04-01T00:00:00Z"),
          dateEnd: new Date("2024-04-30T23:59:59Z"),
        })
        await fiscalPeriodFactory.create({
          fiscalYear: "2024-25",
          month: FiscalPeriod.Months.MAY,
          dateStart: new Date("2024-05-01T00:00:00Z"),
          dateEnd: new Date("2024-05-31T23:59:59Z"),
        })
        await fiscalPeriodFactory.create({
          fiscalYear: "2024-25",
          month: FiscalPeriod.Months.JUNE,
          dateStart: new Date("2024-06-01T00:00:00Z"),
          dateEnd: new Date("2024-06-30T23:59:59Z"),
        })

        const employeeWageTier1 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod1.id,
          tierLevel: 1,
          tierLabel: "Level 1",
          wageRatePerHour: 4.12,
        })
        const employeeWageTier2 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod1.id,
          tierLevel: 2,
          tierLabel: "Level 2",
          wageRatePerHour: 7.44,
        })
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier1.id,
          employeeName: "John Doe",
          hoursEstimated: 35,
          hoursActual: 38,
        })
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier2.id,
          employeeName: "Jane Smith",
          hoursEstimated: 40,
          hoursActual: 45,
        })

        // Act
        await ReplicateEstimatesService.perform(centre.id, fiscalPeriod1.id)

        // Assert
        const wageEnhancements = await WageEnhancement.findAll({
          where: {
            centreId: centre.id,
          },
        })
        expect(wageEnhancements.length).toBe(6)
        expect(wageEnhancements.map((r) => r.dataValues)).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: employeeWageTier1.id,
            employeeName: "John Doe",
            hoursEstimated: 35,
            hoursActual: 38,
          }),
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: employeeWageTier2.id,
            employeeName: "Jane Smith",
            hoursEstimated: 40,
            hoursActual: 45,
          }),
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: expect.not.stringMatching(employeeWageTier1.id.toString()),
            employeeName: "John Doe",
            hoursEstimated: 35,
            hoursActual: 0,
          }),
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: expect.not.stringMatching(employeeWageTier1.id.toString()),
            employeeName: "John Doe",
            hoursEstimated: 35,
            hoursActual: 0,
          }),
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: expect.not.stringMatching(employeeWageTier2.id.toString()),
            employeeName: "Jane Smith",
            hoursEstimated: 40,
            hoursActual: 0,
          }),
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: expect.not.stringMatching(employeeWageTier2.id.toString()),
            employeeName: "Jane Smith",
            hoursEstimated: 40,
            hoursActual: 0,
          }),
        ])
      })

      test("when future wage enhancements exist, with matching user, updates the hours estimated, and does not create a new enhancement", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fiscalYear: "2024-25",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2024-04-01T00:00:00Z"),
          dateEnd: new Date("2024-04-30T23:59:59Z"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fiscalYear: "2024-25",
          month: FiscalPeriod.Months.MAY,
          dateStart: new Date("2024-05-01T00:00:00Z"),
          dateEnd: new Date("2024-05-31T23:59:59Z"),
        })
        const employeeWageTier1 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod1.id,
          tierLevel: 1,
          tierLabel: "Level 1",
          wageRatePerHour: 4.12,
        })
        const employeeWageTier2 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod2.id,
          tierLevel: 1,
          tierLabel: "Level 1",
          wageRatePerHour: 4.12,
        })
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier1.id,
          employeeName: "John Doe",
          hoursEstimated: 35,
          hoursActual: 38,
        })
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier2.id,
          employeeName: "John Doe",
          hoursEstimated: 40,
          hoursActual: 45,
        })

        // Act
        await ReplicateEstimatesService.perform(centre.id, fiscalPeriod1.id)

        // Assert
        const wageEnhancements = await WageEnhancement.findAll({
          where: {
            centreId: centre.id,
          },
        })
        expect(wageEnhancements.length).to.eq(2)
        expect(wageEnhancements.map((r) => r.dataValues)).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: employeeWageTier1.id,
            employeeName: "John Doe",
            hoursEstimated: 35,
            hoursActual: 38,
          }),
          expect.objectContaining({
            centreId: centre.id,
            employeeWageTierId: employeeWageTier2.id,
            employeeName: "John Doe",
            hoursEstimated: 35,
            hoursActual: 45,
          }),
        ])
      })
    })
  })
})

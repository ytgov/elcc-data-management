import { Op } from "sequelize"
import { isNil, isUndefined } from "lodash"

import db, { EmployeeWageTier, FiscalPeriod, WageEnhancement } from "@/models"
import BaseService from "@/services/base-service"

export class ReplicateEstimatesService extends BaseService {
  constructor(
    private centreId: number,
    private fiscalPeriodId: number
  ) {
    super()
  }

  async perform() {
    const sourceFiscalPeriod = await FiscalPeriod.findByPk(this.fiscalPeriodId)
    if (isNil(sourceFiscalPeriod)) {
      throw new Error(`Fiscal Period with id ${this.fiscalPeriodId} not found`)
    }

    const futureFiscalPeriods = await FiscalPeriod.findAll({
      where: {
        fiscalYear: sourceFiscalPeriod.fiscalYear,
        dateStart: {
          [Op.gt]: sourceFiscalPeriod.dateEnd,
        },
      },
    })

    const sourceWageEnhancements = await WageEnhancement.findAll({
      where: {
        centreId: this.centreId,
      },
      include: [
        {
          association: "employeeWageTier",
          where: {
            fiscalPeriodId: sourceFiscalPeriod.id,
          },
        },
      ],
    })

    return db.transaction(async () => {
      for (const sourceWageEnhancement of sourceWageEnhancements) {
        const { employeeWageTier } = sourceWageEnhancement
        if (isUndefined(employeeWageTier)) {
          throw new Error(
            `employeeWageTier association is missing for WageEnhancement#${sourceWageEnhancement.id}`
          )
        }

        for (const futureFiscalPeriod of futureFiscalPeriods) {
          const [futureEmployeeWageTier] = await EmployeeWageTier.findOrCreate({
            where: {
              fiscalPeriodId: futureFiscalPeriod.id,
              tierLevel: employeeWageTier.tierLevel,
            },
            defaults: {
              fiscalPeriodId: futureFiscalPeriod.id,
              tierLevel: employeeWageTier.tierLevel,
              tierLabel: employeeWageTier.tierLabel,
              wageRatePerHour: employeeWageTier.wageRatePerHour,
            },
          })

          const futureWageEnhancement = await WageEnhancement.findOne({
            where: {
              centreId: this.centreId,
              employeeWageTierId: futureEmployeeWageTier.id,
              employeeName: sourceWageEnhancement.employeeName,
            },
          })
          if (!isNil(futureWageEnhancement)) {
            await futureWageEnhancement.update({
              hoursEstimated: sourceWageEnhancement.hoursEstimated,
            })
            continue
          }

          await WageEnhancement.create({
            centreId: this.centreId,
            employeeWageTierId: futureEmployeeWageTier.id,
            employeeName: sourceWageEnhancement.employeeName,
            hoursEstimated: sourceWageEnhancement.hoursEstimated,
            hoursActual: 0,
          })
        }
      }
    })
  }
}

export default ReplicateEstimatesService

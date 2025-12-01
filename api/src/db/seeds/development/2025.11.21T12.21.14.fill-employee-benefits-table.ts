import { isNil } from "lodash"

import { Centre, EmployeeBenefit, FiscalPeriod } from "@/models"

export async function up() {
  const fiscalPeriods = await FiscalPeriod.findAll()

  await Centre.findEach(async (centre) => {
    for (const fiscalPeriod of fiscalPeriods) {
      const employeeBenefit = await EmployeeBenefit.findOne({
        where: {
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
        },
      })

      if (isNil(employeeBenefit)) {
        await EmployeeBenefit.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: "0",
          grossPayrollMonthlyEstimated: "0",
          costCapPercentage: "0",
          employeeCostActual: "0",
          employeeCostEstimated: "0",
          employerCostActual: "0",
          employerCostEstimated: "0",
        })
      }
    }
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}

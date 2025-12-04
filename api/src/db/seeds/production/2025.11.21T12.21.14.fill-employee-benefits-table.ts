import { Centre, EmployeeBenefit, FiscalPeriod } from "@/models"
import { isNil } from "lodash"

export async function up() {
  await FiscalPeriod.findEach(async (fiscalPeriod) => {
    await Centre.findEach(async (centre) => {
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
          costCapPercentage: EmployeeBenefit.DEFAULT_COST_CAP_PERCENTAGE,
          employeeCostActual: "0",
          employeeCostEstimated: "0",
          employerCostActual: "0",
          employerCostEstimated: "0",
        })
      }
    })
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}

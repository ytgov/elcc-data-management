import { DeepPartial, Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { WageEnhancement } from "@/models"

export const wageEnhancementFactory = Factory.define<WageEnhancement>(
  ({ sequence, params, onCreate }) => {
    onCreate((wageEnhancement) => wageEnhancement.save())

    assertParamsHasCentreId(params)
    assertParamsHasEmployeeWageTierId(params)

    return WageEnhancement.build({
      id: sequence,
      centreId: params.centreId,
      employeeWageTierId: params.employeeWageTierId,
      employeeName: faker.person.fullName(),
      hoursEstimated: faker.number.int({ min: 0, max: 100 }),
      hoursActual: faker.number.int({ min: 0, max: 100 }),
    })
  }
)

function assertParamsHasCentreId(
  params: DeepPartial<WageEnhancement>
): asserts params is DeepPartial<WageEnhancement> & { centreId: number } {
  if (typeof params.centreId !== "number") {
    throw new Error("centreId is must be a number")
  }
}

function assertParamsHasEmployeeWageTierId(
  params: DeepPartial<WageEnhancement>
): asserts params is DeepPartial<WageEnhancement> & { employeeWageTierId: number } {
  if (typeof params.employeeWageTierId !== "number") {
    throw new Error("employeeWageTierId is must be a number")
  }
}

export default wageEnhancementFactory

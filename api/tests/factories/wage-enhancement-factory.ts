import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { WageEnhancement } from "@/models"
import centreFactory from "@/factories/centre-factory"
import employeeWageTierFactory from "@/factories/employee-wage-tier-factory"

export const wageEnhancementFactory = Factory.define<WageEnhancement>(
  ({ associations, params, onCreate }) => {
    onCreate(async (wageEnhancement) => {
      try {
        await wageEnhancement.save()
        return wageEnhancement
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create WageEnhancement with attributes: ${JSON.stringify(wageEnhancement.dataValues, null, 2)}`
        )
      }
    })

    const centre = associations.centre ?? centreFactory.build({ id: params.centreId })
    const employeeWageTier =
      associations.employeeWageTier ??
      employeeWageTierFactory.build({
        id: params.employeeWageTierId,
      })

    const wageEnhancement = WageEnhancement.build({
      centreId: centre.id,
      employeeWageTierId: employeeWageTier.id,
      employeeName: faker.person.fullName(),
      hoursEstimated: faker.number.int({ min: 0, max: 100 }),
      hoursActual: faker.number.int({ min: 0, max: 100 }),
    })

    wageEnhancement.centre = centre
    wageEnhancement.employeeWageTier = employeeWageTier

    return wageEnhancement
  }
)

export default wageEnhancementFactory

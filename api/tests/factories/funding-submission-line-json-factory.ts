import { Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { DateTime } from "luxon"

import { FundingSubmissionLineJson } from "@/models"
import { formatAsFiscalYear } from "@/factories/helpers"
import centreFactory from "@/factories/centre-factory"

export const fundingSubmissionLineJsonFactory = Factory.define<FundingSubmissionLineJson>(
  ({ associations, params, onCreate }) => {
    onCreate(async (fundingSubmissionLineJson) => {
      try {
        await fundingSubmissionLineJson.save()
        return fundingSubmissionLineJson
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create FundingSubmissionLineJson with attributes: ${JSON.stringify(fundingSubmissionLineJson.dataValues, null, 2)}`
        )
      }
    })

    const centre =
      associations.centre ??
      centreFactory.build({
        id: params.centreId,
      })

    const year = faker.number.int({ min: 2022, max: 2027 })
    const month = faker.number.int({ min: 1, max: 12 })
    const dateStart = DateTime.local(year, month, 1).startOf("month")
    const dateEnd = dateStart.endOf("month")
    const dateName = dateStart.toFormat("MMMM")

    const APRIL = 4 // Luxon uses 1-indexed months
    const fiscalYearStartYear = month >= APRIL ? year : year - 1
    const fiscalYear = formatAsFiscalYear(fiscalYearStartYear)

    const fundingSubmissionLineJson = FundingSubmissionLineJson.build({
      centreId: centre.id,
      fiscalYear,
      dateName,
      dateStart: dateStart.toJSDate(),
      dateEnd: dateEnd.toJSDate(),
      values: JSON.stringify([]),
    })

    fundingSubmissionLineJson.centre = centre

    return fundingSubmissionLineJson
  }
)

export default fundingSubmissionLineJsonFactory

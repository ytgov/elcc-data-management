import { DeepPartial, Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { DateTime } from "luxon"

import { FundingSubmissionLineJson } from "@/models"

function assertParamsHasCentreId(
  params: DeepPartial<FundingSubmissionLineJson>
): asserts params is DeepPartial<FundingSubmissionLineJson> & { centreId: number } {
  if (typeof params.centreId !== "number") {
    throw new Error("centreId is must be a number")
  }
}

function formatAsFiscalYear(startYear: number) {
  const endYear = (startYear + 1).toString().slice(-2)
  return `${startYear}/${endYear}`
}

export const fundingSubmissionLineJsonFactory = Factory.define<FundingSubmissionLineJson>(
  ({ sequence, params, onCreate }) => {
    onCreate((fundingSubmissionLineJson) => fundingSubmissionLineJson.save())

    assertParamsHasCentreId(params)

    const year = faker.number.int({ min: 2022, max: 2027 })
    const month = faker.number.int({ min: 1, max: 12 })
    const dateStart = DateTime.local(year, month, 1).startOf("month")
    const dateEnd = dateStart.endOf("month")
    const dateName = dateStart.toFormat("MMMM")

    const APRIL = 4 // Luxon uses 1-indexed months
    const fiscalYearStartYear = month >= APRIL ? year : year - 1
    const fiscalYear = formatAsFiscalYear(fiscalYearStartYear)

    return FundingSubmissionLineJson.build({
      id: sequence,
      centreId: params.centreId,
      fiscalYear: fiscalYear,
      dateName: dateName,
      dateStart: dateStart.toJSDate(),
      dateEnd: dateEnd.toJSDate(),
      values: JSON.stringify([]),
    })
  }
)

export default fundingSubmissionLineJsonFactory

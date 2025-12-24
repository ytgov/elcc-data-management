import { Factory } from "fishery"
import { DateTime } from "luxon"

import { FundingPeriod } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

export const fundingPeriodFactory = Factory.define<FundingPeriod>(
  ({ params, sequence, onCreate }) => {
    onCreate(async (fundingPeriod) => {
      try {
        await nestedSaveAndAssociateIfNew(fundingPeriod)
        return fundingPeriod
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create FundingPeriod with attributes: ${JSON.stringify(fundingPeriod.dataValues, null, 2)}`
        )
      }
    })

    let currentYear = DateTime.now().year
    if (params.fiscalYear) {
      currentYear = parseInt(params.fiscalYear.split("-")[0])
    }

    const nextYear = currentYear + 1
    const fiscalYear = [currentYear, nextYear].join("-")
    const fromDate = DateTime.fromObject({
      year: currentYear,
      month: 4,
      day: 1,
    }).toJSDate()
    const toDate = DateTime.fromObject({
      year: nextYear,
      month: 3,
    })
      .endOf("month")
      .set({ millisecond: 0 })
      .toJSDate()
    const title = `Funding Period ${sequence}`

    return FundingPeriod.build({
      fiscalYear,
      fromDate,
      toDate,
      title,
    })
  }
)

export default fundingPeriodFactory

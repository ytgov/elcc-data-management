import { cloneDeep } from "lodash"
import moment from "moment"

import { FundingLineValue, FundingSubmissionLine, FundingSubmissionLineJson } from "@/models"
import { FundingSubmissionLineJsonMonths } from "@/models/funding-submission-line-json"

export class FundingSubmissionLineJsonServices {
  static async bulkCreate(centreId: number, fiscalYear: string) {
    const worksheets = await FundingSubmissionLineJson.findAll({
      where: { centreId, fiscalYear },
      order: ["dateStart"],
    })
    if (worksheets.length > 0) {
      throw new Error("Fiscal year already exists for this centre")
    }

    const templateLines = await FundingSubmissionLine.findAll({ where: { fiscalYear } })
    const year = fiscalYear.split("/")[0]
    let date = moment.utc(`${year}-04-01`)
    const lines: FundingLineValue[] = []

    templateLines.forEach((templateLine) => {
      lines.push({
        submissionLineId: templateLine.id,
        sectionName: templateLine.sectionName,
        lineName: templateLine.lineName,
        monthlyAmount: templateLine.monthlyAmount,
        estimatedChildOccupancyRate: 0,
        actualChildOccupancyRate: 0,
        estimatedComputedTotal: 0,
        actualComputedTotal: 0,
      })
    })

    const bulkAttributes = []
    for (let i = 0; i < 12; i++) {
      const dateStart = cloneDeep(date).startOf("month")
      const dateEnd = cloneDeep(dateStart).endOf("month")
      dateEnd.set("milliseconds", 0)
      const dateName = dateStart.format("MMMM")

      bulkAttributes.push({
        centreId,
        fiscalYear,
        dateName: dateName as FundingSubmissionLineJsonMonths,
        dateStart: dateStart.toDate(),
        dateEnd: dateEnd.toDate(),
        values: JSON.stringify(lines),
      })

      date = date.add(1, "month")
    }

    await FundingSubmissionLineJson.bulkCreate(bulkAttributes)

    // Ensure consistent ordering, as bulk create does not guarantee order
    return FundingSubmissionLineJson.findAll({
      where: { fiscalYear },
      order: ["dateStart"],
    })
  }
}

export default FundingSubmissionLineJsonServices

import { cloneDeep } from "lodash"
import moment from "moment"

import { FundingSubmissionLine, FundingSubmissionLineJson } from "@/models"
import { FundingLineValue } from "@/models"

import BaseService from "@/services/base-service"

export class FundingSubmissionLineJsonServices implements BaseService {
  static async bulkCreate(centreId: number, fiscalYear: string) {
    const worksheets = await FundingSubmissionLineJson.findAll({
      where: { centreId, fiscalYear },
    })
    if (worksheets.length > 0) {
      throw new Error("Fiscal year already exists for this centre")
    }

    const basis = await FundingSubmissionLine.findAll({ where: { fiscalYear } })
    const year = fiscalYear.split("/")[0]
    let date = moment.utc(`${year}-04-01`)
    const lines = new Array<FundingLineValue>()

    for (const line of basis) {
      // TODO: Write a migration for existing data, and swap this to camel case.
      lines.push({
        submissionLineId: line.id as number,
        sectionName: line.sectionName,
        lineName: line.lineName,
        monthlyAmount: line.monthlyAmount,
        estChildCount: 0,
        actChildCount: 0,
        estComputedTotal: 0,
        actComputedTotal: 0,
      })
    }

    const bulkAttributes = []
    for (let i = 0; i < 12; i++) {
      const dateStart = cloneDeep(date).startOf("month")
      const dateEnd = cloneDeep(dateStart).endOf("month")
      dateEnd.set("milliseconds", 0)
      const dateName = dateStart.format("MMMM")

      bulkAttributes.push({
        centreId,
        fiscalYear,
        dateName,
        dateStart: dateStart.toDate(),
        dateEnd: dateEnd.toDate(),
        values: JSON.stringify(lines),
      })

      date = date.add(1, "month")
    }

    return FundingSubmissionLineJson.bulkCreate(bulkAttributes)
  }
}

export default FundingSubmissionLineJsonServices

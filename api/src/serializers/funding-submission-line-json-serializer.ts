import { sortBy, uniq, pick, omit } from "lodash"
import moment from "moment"
import { FundingLineValue, FundingSubmissionLineJson } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class FundingSubmissionLineJsonSerializer extends BaseSerializer<FundingSubmissionLineJson> {
  static asTable(fundingSubmissionLineJsons: FundingSubmissionLineJson[]) {
    return fundingSubmissionLineJsons.map((fundingSubmissionLineJson) => {
      return {
        ...pick(fundingSubmissionLineJson, [
          "id",
          "centreId",
          "fiscalYear",
          "dateName",
          "dateStart",
          "dateEnd",
          "createdAt",
          "updatedAt",
        ]),
        lines: fundingSubmissionLineJson.lines,
      }
    })
  }

  static asDetailed(fundingSubmissionLineJson: FundingSubmissionLineJson) {
    return {
      ...omit(fundingSubmissionLineJson.dataValues, "values"),
      lines: fundingSubmissionLineJson.lines,
    }
  }

  // I have no clue what this code is trying to accomplish.
  // I hope to be able to fully rebuild this code, until it fits into a standard view -> fields paradigm.
  // It looks like we might be missing a database model for a worksheet?
  // Or maybe a model for a line entry?
  static asWorksheet(worksheets: FundingSubmissionLineJson[]) {
    const groups = []
    const years = uniq(worksheets.map((m) => m.fiscalYear))

    for (const fiscalYear of years) {
      const yearSheets = sortBy(
        worksheets.filter((w) => w.fiscalYear == fiscalYear),
        (o) => o.dateStart
      )

      const months = uniq(yearSheets.map((y) => y.dateName))

      for (const month of months) {
        const monthSheets = yearSheets.filter((m) => month == m.dateName)[0]

        const sections = uniq(monthSheets.lines.map((w) => w.sectionName))
        const monthRow: {
          id: number
          fiscalYear: string
          month: string
          year: string
          sections: { sectionName: string; lines: FundingLineValue[] }[]
        } = {
          id: monthSheets.id,
          fiscalYear,
          month,
          year: moment.utc(monthSheets.dateStart).format("YYYY"),
          sections: [],
        }

        for (const section of sections) {
          const lines = monthSheets.lines.filter((w) => section == w.sectionName)
          monthRow.sections.push({ sectionName: section, lines })
        }

        groups.push(monthRow)
      }
    }

    return groups
  }
}

export default FundingSubmissionLineJsonSerializer

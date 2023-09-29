import { sortBy, uniq } from "lodash"
import moment from "moment"
import { FundingSubmissionLineJson } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class FundingSubmissionLineJsonSerializer extends BaseSerializer<FundingSubmissionLineJson> {
  constructor(modelOrModels: FundingSubmissionLineJson | FundingSubmissionLineJson[]) {
    super(modelOrModels)
  }

  protected registerDefaultView() {
    const view = this.addView("default")
    view.addFields("id", "centreId", "fiscalYear", "dateName", "dateStart", "dateEnd")
    return view
  }

  // I have no clue what this code is trying to accomplish.
  // I hope to be able to fully rebuild this code, until it fits into a standard view -> fields paradigm.
  // It looks like we might be missing a database model for a worksheet?
  // Or maybe a model for a line entry?
  static serializeWorksheetsView(worksheets: FundingSubmissionLineJson[]) {
    const groups = new Array<any>()
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
        const monthRow = {
          id: monthSheets.id,
          fiscalYear,
          month,
          year: moment.utc(monthSheets.dateStart).format("YYYY"),
          sections: new Array<any>(),
        }

        for (const section of sections) {
          const lines = monthSheets.lines.filter((w) => section == w.sectionName)
          // TODO: investigate what would be required to permit this to be camel cased.
          monthRow.sections.push({ sectionName: section, lines })
        }

        groups.push(monthRow)
      }
    }

    return groups
  }
}

export default FundingSubmissionLineJsonSerializer

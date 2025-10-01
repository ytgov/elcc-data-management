import { CreationAttributes, Op } from "@sequelize/core"
import { merge, omit } from "lodash"

import { FundingSubmissionLine } from "@/models"

export class FundingSubmissionLineServices {
  static async bulkCreateFrom(
    attributes: Partial<CreationAttributes<FundingSubmissionLine>>,
    fiscalYearsToFilterOn: string[]
  ) {
    const linesToCreateFrom = await FundingSubmissionLine.findAll({
      where: { fiscalYear: { [Op.in]: fiscalYearsToFilterOn } },
    })
    const newLinesCreationAttributes = linesToCreateFrom.map((line) => {
      const originalAttributes = line.get()
      const creationAttributes = omit(originalAttributes, ["id"])
      const mergedAttributes = merge(creationAttributes, attributes)
      return mergedAttributes
    })
    return FundingSubmissionLine.bulkCreate(newLinesCreationAttributes)
  }
}

export default FundingSubmissionLineServices

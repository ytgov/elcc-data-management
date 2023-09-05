import { InferCreationAttributes, Op } from "sequelize"
import { merge, omit } from "lodash"

import { FundingSubmissionLine } from "@/models"

import BaseService from "@/services/base-service"

export class FundingSubmissionLineServices implements BaseService {
  static async bulkCreateFrom(
    attributes: Partial<InferCreationAttributes<FundingSubmissionLine>>,
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

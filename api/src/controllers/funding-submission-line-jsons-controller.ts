import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { FundingSubmissionLineJson } from "@/models"

export class FundingSubmissionLineJsonsController extends BaseController {
  index() {
    const where = this.query.where as WhereOptions<FundingSubmissionLineJson>
    return FundingSubmissionLineJson.findAll({
      where,
      order: ["dateStart"],
    })
      .then((fundingSubmissionLineJsons) => {
        return this.response.json({ fundingSubmissionLineJsons })
      })
      .catch((error) => {
        return this.response
          .status(400)
          .json({ message: `Invalid query for fundingSubmissionLineJsons: ${error}` })
      })
  }

  async create() {
    return FundingSubmissionLineJson.create(this.request.body)
      .then((fundingSubmissionLineJson) => {
        return this.response.status(201).json({ fundingSubmissionLineJson })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `FundingSubmissionLineJson creation failed: ${error}` })
      })
  }

  async update() {
    const fundingSubmissionLineJson = await this.loadFundingSubmissionLineJson()
    if (isNil(fundingSubmissionLineJson))
      return this.response.status(404).json({ message: "FundingSubmissionLineJson not found." })

    return fundingSubmissionLineJson
      .update(this.request.body)
      .then((fundingSubmissionLineJson) => {
        return this.response.json({ fundingSubmissionLineJson })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `FundingSubmissionLineJson update failed: ${error}` })
      })
  }

  async destroy() {
    const fundingSubmissionLineJson = await this.loadFundingSubmissionLineJson()
    if (isNil(fundingSubmissionLineJson))
      return this.response.status(404).json({ message: "FundingSubmissionLineJson not found." })

    return fundingSubmissionLineJson
      .destroy()
      .then(() => {
        return this.response.status(204).end()
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `FundingSubmissionLineJson deletion failed: ${error}` })
      })
  }

  private loadFundingSubmissionLineJson(): Promise<FundingSubmissionLineJson | null> {
    return FundingSubmissionLineJson.findByPk(this.params.fundingSubmissionLineJsonId)
  }
}

export default FundingSubmissionLineJsonsController

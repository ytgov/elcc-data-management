import { isNil } from "lodash"

import { FundingSubmissionLineJson } from "@/models"
import { FundingSubmissionLineJsonSerializer } from "@/serializers"
import BaseController from "@/controllers/base-controller"

export class FundingSubmissionLineJsonsController extends BaseController<FundingSubmissionLineJson> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["dateStart", "ASC"]])
      const scopedFundingSubmissionLineJsons = FundingSubmissionLineJson.scope(scopes)

      const totalCount = await scopedFundingSubmissionLineJsons.count({ where })
      const fundingSubmissionLineJsons = await scopedFundingSubmissionLineJsons.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedfundingSubmissionLineJsons = FundingSubmissionLineJsonSerializer.asTable(
        fundingSubmissionLineJsons
      )
      return this.response.json({
        fundingSubmissionLineJsons: serializedfundingSubmissionLineJsons,
        totalCount,
      })
    } catch (error) {
      return this.response.status(400).json({
        message: `Invalid query for fundingSubmissionLineJsons: ${error}`,
      })
    }
  }

  async show() {
    try {
      const fundingSubmissionLineJson = await this.loadFundingSubmissionLineJson()
      if (isNil(fundingSubmissionLineJson)) {
        return this.response.status(404).json({
          message: "FundingSubmissionLineJson not found.",
        })
      }

      const serializedfundingSubmissionLineJson =
        FundingSubmissionLineJsonSerializer.asDetailed(fundingSubmissionLineJson)
      return this.response.json({
        fundingSubmissionLineJson: serializedfundingSubmissionLineJson,
      })
    } catch (error) {
      return this.response.status(400).json({
        message: `Error fetching fundingSubmissionLineJson: ${error}`,
      })
    }
  }

  async create() {
    try {
      const fundingSubmissionLineJson = await FundingSubmissionLineJson.create(this.request.body)
      const serializedfundingSubmissionLineJson =
        FundingSubmissionLineJsonSerializer.asDetailed(fundingSubmissionLineJson)
      return this.response.status(201).json({
        fundingSubmissionLineJson: serializedfundingSubmissionLineJson,
      })
    } catch (error) {
      return this.response.status(422).json({
        message: `FundingSubmissionLineJson creation failed: ${error}`,
      })
    }
  }

  async update() {
    try {
      const fundingSubmissionLineJson = await this.loadFundingSubmissionLineJson()
      if (isNil(fundingSubmissionLineJson)) {
        return this.response.status(404).json({
          message: "FundingSubmissionLineJson not found.",
        })
      }

      await fundingSubmissionLineJson.update(this.request.body)
      const serializedfundingSubmissionLineJson =
        FundingSubmissionLineJsonSerializer.asDetailed(fundingSubmissionLineJson)
      return this.response.json({
        fundingSubmissionLineJson: serializedfundingSubmissionLineJson,
      })
    } catch (error) {
      return this.response.status(422).json({
        message: `FundingSubmissionLineJson update failed: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const fundingSubmissionLineJson = await this.loadFundingSubmissionLineJson()
      if (isNil(fundingSubmissionLineJson)) {
        return this.response.status(404).json({
          message: "FundingSubmissionLineJson not found.",
        })
      }

      await fundingSubmissionLineJson.destroy()
      return this.response.status(204).end()
    } catch (error) {
      return this.response.status(422).json({
        message: `FundingSubmissionLineJson deletion failed: ${error}`,
      })
    }
  }

  private loadFundingSubmissionLineJson(): Promise<FundingSubmissionLineJson | null> {
    return FundingSubmissionLineJson.findByPk(this.params.fundingSubmissionLineJsonId)
  }
}

export default FundingSubmissionLineJsonsController

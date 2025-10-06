import { isNil } from "lodash"

import logger from "@/utils/logger"
import { FundingSubmissionLine } from "@/models"
import { FundingSubmissionLinePolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/funding-submission-lines"
import { IndexSerializer, ShowSerializer } from "@/serializers/funding-submission-lines"
import BaseController from "@/controllers/base-controller"

export class FundingSubmissionLinesController extends BaseController<FundingSubmissionLine> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([
        ["fiscalYear", "ASC"],
        ["sectionName", "ASC"],
        ["lineName", "ASC"],
      ])
      const scopedFundingSubmissionLines = FundingSubmissionLinePolicy.applyScope(
        scopes,
        this.currentUser
      )

      const totalCount = await scopedFundingSubmissionLines.count({ where })
      const fundingSubmissionLines = await scopedFundingSubmissionLines.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedFundingSubmissionLines = IndexSerializer.perform(fundingSubmissionLines)
      return this.response.json({
        fundingSubmissionLines: serializedFundingSubmissionLines,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching funding submission lines: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding submission lines: ${error}`,
      })
    }
  }

  async show() {
    try {
      const fundingSubmissionLine = await this.loadFundingSubmissionLine()
      if (isNil(fundingSubmissionLine)) {
        return this.response.status(404).json({
          message: "Funding submission line not found",
        })
      }

      const policy = this.buildPolicy(fundingSubmissionLine)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this funding submission line",
        })
      }

      const serializedFundingSubmissionLine = ShowSerializer.perform(fundingSubmissionLine)
      return this.response.json({
        fundingSubmissionLine: serializedFundingSubmissionLine,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching funding submission line: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding submission line: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create funding submission lines",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const fundingSubmissionLine = await CreateService.perform(permittedAttributes)
      const serializedFundingSubmissionLine = ShowSerializer.perform(fundingSubmissionLine)
      return this.response.status(201).json({
        fundingSubmissionLine: serializedFundingSubmissionLine,
      })
    } catch (error) {
      logger.error(`Error creating funding submission line: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating funding submission line: ${error}`,
      })
    }
  }

  async update() {
    try {
      const fundingSubmissionLine = await this.loadFundingSubmissionLine()
      if (isNil(fundingSubmissionLine)) {
        return this.response.status(404).json({
          message: "Funding submission line not found",
        })
      }

      const policy = this.buildPolicy(fundingSubmissionLine)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this funding submission line",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedFundingSubmissionLine = await UpdateService.perform(
        fundingSubmissionLine,
        permittedAttributes
      )
      const serializedFundingSubmissionLine = ShowSerializer.perform(updatedFundingSubmissionLine)
      return this.response.json({
        fundingSubmissionLine: serializedFundingSubmissionLine,
      })
    } catch (error) {
      logger.error(`Error updating funding submission line: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating funding submission line: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const fundingSubmissionLine = await this.loadFundingSubmissionLine()
      if (isNil(fundingSubmissionLine)) {
        return this.response.status(404).json({
          message: "Funding submission line not found",
        })
      }

      const policy = this.buildPolicy(fundingSubmissionLine)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this funding submission line",
        })
      }

      await fundingSubmissionLine.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting funding submission line: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting funding submission line: ${error}`,
      })
    }
  }

  private loadFundingSubmissionLine() {
    return FundingSubmissionLine.findByPk(this.params.fundingSubmissionLineId)
  }

  private buildPolicy(
    fundingSubmissionLine: FundingSubmissionLine = FundingSubmissionLine.build()
  ) {
    return new FundingSubmissionLinePolicy(this.currentUser, fundingSubmissionLine)
  }
}

export default FundingSubmissionLinesController

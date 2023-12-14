import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { WageEnhancement } from "@/models"
import { WageEnhancementSerializer } from "@/serializers"

export class WageEnhancementsController extends BaseController {
  index() {
    const where = this.query.where as WhereOptions<WageEnhancement>
    return WageEnhancement.findAll({
      where,
    })
      .then((wageEnhancements) => {
        const serializedWageEnhancements = WageEnhancementSerializer.asTable(wageEnhancements)
        return this.response.json({
          wageEnhancements: serializedWageEnhancements,
        })
      })
      .catch((error) => {
        return this.response
          .status(400)
          .json({ message: `Invalid query for wage enhancments: ${error}` })
      })
  }

  async show() {
    const wageEnhancement = await this.loadWageEnhancement()
    if (isNil(wageEnhancement))
      return this.response.status(404).json({ message: "wage enhancment not found." })

    const serializedwageEnhancement = WageEnhancementSerializer.asDetailed(wageEnhancement)
    return this.response.json({
      wageEnhancement: serializedwageEnhancement,
    })
  }

  async create() {
    return WageEnhancement.create(this.request.body)
      .then((wageEnhancement) => {
        return this.response.status(201).json({ wageEnhancement })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `wage enhancment creation failed: ${error}` })
      })
  }

  async update() {
    const wageEnhancement = await this.loadWageEnhancement()
    if (isNil(wageEnhancement))
      return this.response.status(404).json({ message: "wage enhancment not found." })

    return wageEnhancement
      .update(this.request.body)
      .then((wageEnhancement) => {
        const serializedwageEnhancement = WageEnhancementSerializer.asDetailed(wageEnhancement)
        return this.response.json({
          wageEnhancement: serializedwageEnhancement,
        })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `wage enhancment update failed: ${error}` })
      })
  }

  async destroy() {
    const wageEnhancement = await this.loadWageEnhancement()
    if (isNil(wageEnhancement))
      return this.response.status(404).json({ message: "wage enhancment not found." })

    return wageEnhancement
      .destroy()
      .then(() => {
        return this.response.status(204).end()
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `wage enhancment deletion failed: ${error}` })
      })
  }

  private loadWageEnhancement(): Promise<WageEnhancement | null> {
    return WageEnhancement.findByPk(this.params.wageEnhancementId)
  }
}

export default WageEnhancementsController

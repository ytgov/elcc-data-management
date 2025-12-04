import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Centre } from "@/models"
import { CentrePolicy } from "@/policies/centre-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/centres"
import { IndexSerializer, ShowSerializer } from "@/serializers/centres"
import BaseController from "@/controllers/base-controller"

export class CentresController extends BaseController<Centre> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["name", "ASC"]])
      const scopedCentres = CentrePolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedCentres.count({ where })
      const centres = await scopedCentres.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedCentres = IndexSerializer.perform(centres)
      return this.response.json({
        centres: serializedCentres,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching centres: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching centres: ${error}`,
      })
    }
  }

  async show() {
    try {
      const centre = await this.loadCentre()
      if (isNil(centre)) {
        return this.response.status(404).json({
          message: "Centre not found",
        })
      }

      const policy = this.buildPolicy(centre)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this centre",
        })
      }

      const serializedCentre = ShowSerializer.perform(centre)
      return this.response.json({
        centre: serializedCentre,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching centre: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching centre: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create centres",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const centre = await CreateService.perform(permittedAttributes, this.currentUser)
      const serializedCentre = ShowSerializer.perform(centre)
      return this.response.status(201).json({
        centre: serializedCentre,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating centre: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating centre: ${error}`,
      })
    }
  }

  async update() {
    try {
      const centre = await this.loadCentre()
      if (isNil(centre)) {
        return this.response.status(404).json({
          message: "Centre not found",
        })
      }

      const policy = this.buildPolicy(centre)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this centre",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedCentre = await UpdateService.perform(
        centre,
        permittedAttributes,
        this.currentUser
      )
      const serializedCentre = ShowSerializer.perform(updatedCentre)
      return this.response.json({
        centre: serializedCentre,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating centre: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating centre: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const centre = await this.loadCentre()
      if (isNil(centre)) {
        return this.response.status(404).json({
          message: "Centre not found",
        })
      }

      const policy = this.buildPolicy(centre)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this centre",
        })
      }

      await DestroyService.perform(centre, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting centre: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting centre: ${error}`,
      })
    }
  }

  private loadCentre() {
    return Centre.findByPk(this.params.centreId)
  }

  private buildPolicy(centre: Centre = Centre.build()) {
    return new CentrePolicy(this.currentUser, centre)
  }
}

export default CentresController

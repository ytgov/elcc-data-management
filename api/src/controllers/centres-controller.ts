import { isNil } from "lodash"

import BaseController from "./base-controller"

import { Centre } from "@/models"
import { CentreServices } from "@/services"

export class CentresController extends BaseController {
  async create() {
    try {
      const centre = await CentreServices.create(this.request.body, {
        currentUser: this.currentUser,
      })
      return this.response.status(201).json({ centre })
    } catch (error) {
      return this.response.status(422).json({ message: `Centre creation failed: ${error}` })
    }
  }

  async update() {
    const centre = await this.loadCentre()
    if (isNil(centre)) {
      return this.response.status(404).json({ message: "Centre not found." })
    }

    try {
      const updatedCentre = await CentreServices.update(centre, this.request.body, {
        currentUser: this.currentUser,
      })
      return this.response.json({ centre: updatedCentre })
    } catch (error) {
      return this.response.status(422).json({ message: `Centre update failed: ${error}` })
    }
  }

  private loadCentre(): Promise<Centre | null> {
    return Centre.findByPk(this.params.centreId)
  }
}

export default CentresController

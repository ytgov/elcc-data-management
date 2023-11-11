import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { Payment } from "@/models"

export class PaymentsController extends BaseController {
  index() {
    const where = this.query.where as WhereOptions<Payment>
    return Payment.findAll({
      where,
      order: ["paidOn"],
    })
      .then((payments) => {
        return this.response.json({ payments })
      })
      .catch((error) => {
        return this.response.status(400).json({ message: `Invalid query for payments: ${error}` })
      })
  }

  async create() {
    return Payment.create(this.request.body)
      .then((payment) => {
        return this.response.status(201).json({ payment })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Payment creation failed: ${error}` })
      })
  }

  async update() {
    const payment = await this.loadPayment()
    if (isNil(payment)) return this.response.status(404).json({ message: "Payment not found." })

    return payment
      .update(this.request.body)
      .then((payment) => {
        return this.response.json({ payment })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Payment update failed: ${error}` })
      })
  }

  async destroy() {
    const payment = await this.loadPayment()
    if (isNil(payment)) return this.response.status(404).json({ message: "Payment not found." })

    return payment
      .destroy()
      .then(() => {
        return this.response.status(204).end()
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Payment deletion failed: ${error}` })
      })
  }

  private loadPayment(): Promise<Payment | null> {
    return Payment.findByPk(this.params.paymentId)
  }
}

export default PaymentsController

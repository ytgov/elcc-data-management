import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Payment } from "@/models"
import { PaymentPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/payments"
import { IndexSerializer, ShowSerializer } from "@/serializers/payments"
import BaseController from "@/controllers/base-controller"

export class PaymentsController extends BaseController<Payment> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["paidOn", "ASC"]])
      const scopedPayments = PaymentPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedPayments.count({ where })
      const payments = await scopedPayments.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedPayments = IndexSerializer.perform(payments)
      return this.response.json({
        payments: serializedPayments,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching payments: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching payments: ${error}`,
      })
    }
  }

  async show() {
    try {
      const payment = await this.loadPayment()
      if (isNil(payment)) {
        return this.response.status(404).json({
          message: "Payment not found",
        })
      }

      const policy = this.buildPolicy(payment)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this payment",
        })
      }

      const serializedPayment = ShowSerializer.perform(payment)
      return this.response.json({
        payment: serializedPayment,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching payment: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching payment: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create payments",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const payment = await CreateService.perform(permittedAttributes)
      const serializedPayment = ShowSerializer.perform(payment)
      return this.response.status(201).json({
        payment: serializedPayment,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating payment: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating payment: ${error}`,
      })
    }
  }

  async update() {
    try {
      const payment = await this.loadPayment()
      if (isNil(payment)) {
        return this.response.status(404).json({
          message: "Payment not found",
        })
      }

      const policy = this.buildPolicy(payment)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this payment",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedPayment = await UpdateService.perform(payment, permittedAttributes)
      const serializedPayment = ShowSerializer.perform(updatedPayment)
      return this.response.json({
        payment: serializedPayment,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating payment: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating payment: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const payment = await this.loadPayment()
      if (isNil(payment)) {
        return this.response.status(404).json({
          message: "Payment not found",
        })
      }

      const policy = this.buildPolicy(payment)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this payment",
        })
      }

      await payment.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting payment: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting payment: ${error}`,
      })
    }
  }

  private loadPayment() {
    return Payment.findByPk(this.params.paymentId)
  }

  private buildPolicy(payment: Payment = Payment.build()) {
    return new PaymentPolicy(this.currentUser, payment)
  }
}

export default PaymentsController

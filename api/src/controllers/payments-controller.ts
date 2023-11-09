import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { Payment } from "@/models"

export class PaymentsController extends BaseController {
  index() {
    const where = this.query.where as WhereOptions<Payment>
    return Payment.findAll({
      where,
      order: ["paidOn"],
    }).then((payments) => {})
  }
}

export default PaymentsController

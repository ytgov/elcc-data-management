import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { Payment } from "@/models"

import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

import centreFactory from "@/factories/centre-factory"
import fiscalPeriodFactory from "@/factories/fiscal-period-factory"

export const paymentFactory = Factory.define<Payment>(
  ({ associations, params, sequence, onCreate }) => {
    onCreate(async (payment) => {
      try {
        await nestedSaveAndAssociateIfNew(payment)
        return payment
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create Payment with attributes: ${JSON.stringify(payment.dataValues, null, 2)}`
        )
      }
    })

    const centre =
      associations.centre ??
      centreFactory.build({
        id: params.centreId,
      })

    let currentYear = new Date().getFullYear()
    if (params.fiscalYear) {
      currentYear = parseInt(params.fiscalYear.split("/")[0])
    } else if (associations.fiscalPeriod) {
      currentYear = parseInt(associations.fiscalPeriod.fiscalYear.split("-")[0])
    }

    const nextYear = currentYear + 1
    const nextYearSuffix = nextYear.toString().slice(-2)
    const fiscalYearShort = [currentYear, nextYearSuffix].join("-")
    const fiscalYearLegacy = [currentYear, nextYearSuffix].join("/")

    const fiscalPeriod =
      associations.fiscalPeriod ??
      fiscalPeriodFactory.build({
        id: params.fiscalPeriodId,
        fiscalYear: fiscalYearShort,
      })

    const name = `Payment ${sequence}`

    const { dateStart: fiscalPeriodStart, dateEnd: fiscalPeriodEnd } = fiscalPeriod
    const paidOn = faker.date
      .between({
        from: fiscalPeriodStart,
        to: fiscalPeriodEnd,
      })
      .toISOString()
      .split("T")[0]

    const amountInCents = faker.number.int({ min: 1000, max: 100000 })

    const payment = Payment.build({
      centreId: centre.id,
      fiscalPeriodId: fiscalPeriod.id,
      fiscalYear: fiscalYearLegacy,
      paidOn,
      name,
      amountInCents,
    })

    payment.centre = centre
    payment.fiscalPeriod = fiscalPeriod

    return payment
  }
)

export default paymentFactory

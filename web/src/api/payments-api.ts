import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"
import { type FiscalPeriodAsReference } from "@/api/fiscal-periods-api"

export const PAYMENT_NAMES = Object.freeze([
  "First Advance",
  "Second Advance",
  "Third Advance",
  "Fourth Advance",
  "Fifth Advance",
  "Sixth Advance",
  "Reconciliation",
])

// Keep in sync with api/src/models/payments.ts
export type Payment = {
  id: number
  centreId: number
  fiscalPeriodId: number
  fiscalYear: string
  name: string
  amount: string
  paidOn: string
  createdAt: string
  updatedAt: string
}

export type PaymentPolicy = Policy

export type PaymentAsShow = Payment & {
  fiscalPeriod: FiscalPeriodAsReference
}

export type PaymentAsIndex = Payment & {
  fiscalPeriod: FiscalPeriodAsReference
}

export type PaymentWhereOptions = WhereOptions<
  Payment,
  "id" | "centreId" | "fiscalPeriodId" | "fiscalYear" | "name" | "paidOn"
>

export type PaymentFiltersOptions = FiltersOptions

export type PaymentQueryOptions = QueryOptions<PaymentWhereOptions, PaymentFiltersOptions>

export const paymentsApi = {
  async list(params: PaymentQueryOptions = {}): Promise<{
    payments: PaymentAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/payments", { params })
    return data
  },
  async get(paymentId: number): Promise<{
    payment: PaymentAsShow
    policy: Policy
  }> {
    const { data } = await http.get(`/api/payments/${paymentId}`)
    return data
  },
  async create(attributes: Partial<Payment>): Promise<{
    payment: PaymentAsShow
    policy: Policy
  }> {
    const { data } = await http.post("/api/payments", attributes)
    return data
  },
  async update(
    paymentId: number,
    attributes: Partial<Payment>
  ): Promise<{
    payment: PaymentAsShow
    policy: Policy
  }> {
    const { data } = await http.patch(`/api/payments/${paymentId}`, attributes)
    return data
  },
  async delete(paymentId: number): Promise<void> {
    const { data } = await http.delete(`/api/payments/${paymentId}`)
    return data
  },
}

export default paymentsApi

import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type Payment = {
  id: number
  centreId: number
  fiscalPeriodId: number
  fiscalYear: string
  name: string
  amountInCents: number
  paidOn: string
  createdAt: string
  updatedAt: string
}

export type PaymentPolicy = Policy

export type PaymentAsShow = Payment

export type PaymentAsIndex = Payment

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

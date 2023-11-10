import { isNil } from "lodash"

import http from "@/api/http-client"

export type Payment = {
  id: number
  centreId: number
  fiscalYear: string
  name: string
  amountInCents: number
  paidOn: string
  createdAt: Date
  updatedAt: Date
}

export type NonPersistedPayment = Omit<Payment, "id" | "createdAt" | "updatedAt">

export type Params = {
  where?: {
    centreId?: number
    fiscalYear?: string
  }
  page?: number
  perPage?: number
  otherParams?: any
}

export function isPersistedPayment(payment: Payment | NonPersistedPayment): payment is Payment {
  return !isNil(payment) && typeof payment === "object" && "id" in payment && !isNil(payment.id)
}

export const paymentsApi = {
  list(params: Params = {}): Promise<{
    payments: Payment[]
  }> {
    return http.get("/api/payments", { params }).then(({ data }) => data)
  },
  create(attributes: Partial<Payment>): Promise<{ payment: Payment }> {
    return http.post("/api/payments", attributes).then(({ data }) => data)
  },
  update(paymentId: number, attributes: any): Promise<{ payment: Payment }> {
    return http.patch(`/api/payments/${paymentId}`, attributes).then(({ data }) => data)
  },
  delete(paymentId: number): Promise<void> {
    return http.delete(`/api/payments/${paymentId}`).then(({ data }) => data)
  },
}

export default paymentsApi

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

export const paymentsApi = {
  list({
    where,
    page,
    perPage,
    ...otherParams
  }: { where?: any; page?: number; perPage?: number; otherParams?: any } = {}): Promise<{
    payments: Payment[]
  }> {
    return http
      .get("/api/payments", { params: { where, page, perPage, ...otherParams } })
      .then(({ data }) => data)
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

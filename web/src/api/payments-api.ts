import http from "@/api/http-client"

export type Payment = {
  id: number
  centreId: number
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
  }: { where?: any; page?: number; perPage?: number; otherParams?: any } = {}) {
    return http
      .get("/api/payments", { params: { where, page, perPage, ...otherParams } })
      .then(({ data }) => data)
  },
  create(attributes: any) {
    return http.post("/api/payments", attributes).then(({ data }) => data)
  },
  update(paymentId: number, attributes: any) {
    return http.patch(`/api/payments/${paymentId}`, attributes).then(({ data }) => data)
  },
  delete(paymentId: number) {
    return http.delete(`/api/payments/${paymentId}`).then(({ data }) => data)
  },
}

export default paymentsApi

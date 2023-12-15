import http from "@/api/http-client"

import { FundingSubmissionLineJson } from "./funding-submission-line-jsons-api"

export type Centre = {
  id: number
  name: string
  license: string | null
  community: string
  status: string
  hotMeal: boolean | null
  licensedFor: number | null // licensed for xx number of children
  lastSubmission: Date | null
  createdAt: Date
  updatedAt: Date
}

export const centresApi = {
  fiscalYear: {
    // TODO: normalize this route return type and format
    create(centerId: number, fiscalYear: string): Promise<FundingSubmissionLineJson[]> {
      return http
        .post(`/api/centre/${centerId}/fiscal-year`, { fiscalYear })
        .then(({ data }) => data.data)
    },
  },
}

export default centresApi

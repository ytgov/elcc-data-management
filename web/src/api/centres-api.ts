import http from "@/api/http-client"

import { FundingSubmissionLineJson } from "./funding-submission-line-jsons-api"

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

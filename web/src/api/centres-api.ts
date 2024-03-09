import http from "@/api/http-client"

import { FundingSubmissionLineJson } from "./funding-submission-line-jsons-api"

// Keep in sync with api/src/models/centre.ts
export enum CentreRegions {
  WHITEHORSE = "whitehorse",
  COMMUNITIES = "communities",
}

// TODO: separate new Centre from existing Centre typing
export type Centre = {
  id?: number
  name: string
  community: string
  isFirstNationProgram: boolean
  region: string
  status: string
  license?: string | null
  hotMeal?: boolean | null
  licensedFor?: number | null // licensed for xx number of children
  licenseHolderName?: string | null
  contactName?: string | null
  physicalAddress?: string | null
  mailingAddress?: string | null
  email?: string | null
  altEmail?: string | null
  phoneNumber?: string | null
  altPhoneNumber?: string | null
  faxNumber?: string | null
  vendorIdentifier?: string | null
  inspectorName?: string | null
  neighborhood?: string | null
  lastSubmission?: string | null // stringified DateOnly
  createdAt?: string // stringified DateTime
  updatedAt?: string // stringified DateTime
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

import http from "@/api/http-client"

import { FundingSubmissionLineJson } from "./funding-submission-line-jsons-api"

// Keep in sync with api/src/models/centre.ts
export enum CentreRegions {
  WHITEHORSE = "whitehorse",
  COMMUNITIES = "communities",
}

export enum CentreStatuses {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  UP_TO_DATE = "Up to date",
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
  async create(attributes: Partial<Centre>): Promise<{ centre: Centre }> {
    const { data } = await http.post("/api/centres", attributes)
    return data
  },
  async update(centreId: number, attributes: Partial<Centre>): Promise<{ centre: Centre }> {
    const { data } = await http.patch(`/api/centres/${centreId}`, attributes)
    return data
  },
  fiscalYear: {
    // TODO: normalize this route return type and format
    async create(centerId: number, fiscalYear: string): Promise<FundingSubmissionLineJson[]> {
      const { data } = await http.post(`/api/centre/${centerId}/fiscal-year`, { fiscalYear })
      return data.data
    },
  },
}

export default centresApi

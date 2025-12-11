import { pick } from "lodash"

import { FundingRegion } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingRegionAsReference = Pick<
  FundingRegion,
  "id" | "region" | "subsidyRate" | "createdAt" | "updatedAt"
>

export class ReferenceSerializer extends BaseSerializer<FundingRegion> {
  perform(): FundingRegionAsReference {
    return pick(this.record, ["id", "region", "subsidyRate", "createdAt", "updatedAt"])
  }
}

export default ReferenceSerializer

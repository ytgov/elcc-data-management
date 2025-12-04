import { pick } from "lodash"

import { Centre } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type CentreAsIndex = Pick<
  Centre,
  | "id"
  | "name"
  | "license"
  | "community"
  | "region"
  | "isFirstNationProgram"
  | "status"
  | "hotMeal"
  | "licensedFor"
  | "buildingUsagePercent"
  | "lastSubmission"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<Centre> {
  perform(): CentreAsIndex {
    return pick(this.record, [
      "id",
      "name",
      "license",
      "community",
      "region",
      "isFirstNationProgram",
      "status",
      "hotMeal",
      "licensedFor",
      "buildingUsagePercent",
      "lastSubmission",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default IndexSerializer

import { pick } from "lodash"

import { Centre } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type CentreAsShow = Pick<
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

export class ShowSerializer extends BaseSerializer<Centre> {
  perform(): CentreAsShow {
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

export default ShowSerializer

import { pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserAsShow = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "status"
  | "ynetId"
  | "directoryId"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<User> {
  perform(): UserAsShow {
    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "roles",
        "status",
        "ynetId",
        "directoryId",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default ShowSerializer

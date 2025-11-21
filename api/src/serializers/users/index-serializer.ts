import { pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserIndexView = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "status"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<User> {
  perform(): UserIndexView {
    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "roles",
        "status",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default IndexSerializer

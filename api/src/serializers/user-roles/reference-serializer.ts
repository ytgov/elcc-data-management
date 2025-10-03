import { pick } from "lodash"

import { UserRole } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserRoleAsReference = Pick<
  UserRole,
  "id" | "userId" | "role" | "createdAt" | "updatedAt"
>

export class ReferenceSerializer extends BaseSerializer<UserRole> {
  perform(): UserRoleAsReference {
    return pick(this.record, ["id", "userId", "role", "createdAt", "updatedAt"])
  }
}

export default ReferenceSerializer

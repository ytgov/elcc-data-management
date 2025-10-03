import { isUndefined, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import UserRoleReferenceSerializer, {
  type UserRoleAsReference,
} from "@/serializers/user-roles/reference-serializer"

export type UserIndexView = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "status"
  | "isAdmin"
  | "createdAt"
  | "updatedAt"
> & {
  roles: UserRoleAsReference[]
}

export class IndexSerializer extends BaseSerializer<User> {
  perform(): UserIndexView {
    const { roles } = this.record
    if (isUndefined(roles)) {
      throw new Error("User roles must be eager loaded for detailed view")
    }
    const serializedRoles = UserRoleReferenceSerializer.perform(roles)

    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "status",
        "isAdmin",
        "createdAt",
        "updatedAt",
      ]),
      roles: serializedRoles,
    }
  }
}

export default IndexSerializer

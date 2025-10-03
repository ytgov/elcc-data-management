import { isUndefined, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import UserRoleReferenceSerializer, {
  type UserRoleAsReference,
} from "@/serializers/user-roles/reference-serializer"

export type UserAsShow = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "status"
  | "isAdmin"
  | "ynetId"
  | "directoryId"
  | "createdAt"
  | "updatedAt"
> & {
  roles: UserRoleAsReference[]
}

export class ShowSerializer extends BaseSerializer<User> {
  perform(): UserAsShow {
    const { roles } = this.record
    if (isUndefined(roles)) {
      throw new Error("Expected roles association to be eager loaded")
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
        "ynetId",
        "directoryId",
        "createdAt",
        "updatedAt",
      ]),
      roles: serializedRoles,
    }
  }
}

export default ShowSerializer

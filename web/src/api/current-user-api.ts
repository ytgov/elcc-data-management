import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { RoleTypes, type UserRole } from "@/api/user-roles-api"
import { type User } from "@/api/users-api"

export { RoleTypes, type UserRole, type User }

export type UserAsShow = User & {
  ynetId: string
  directoryId: string

  // Associations
  roles: UserRole[]
}

export const currentUserApi = {
  RoleTypes,

  async get(): Promise<{
    user: UserAsShow
    policy: Policy
  }> {
    const { data } = await http.get(`/api/current-user`)
    return data
  },
}

export default currentUserApi

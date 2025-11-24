import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { UserRoles, type User } from "@/api/users-api"

export { UserRoles }

export type UserAsShow = User & {
  ynetId: string
  directoryId: string
}

export const currentUserApi = {
  UserRoles,

  async get(): Promise<{
    user: UserAsShow
    policy: Policy
  }> {
    const { data } = await http.get(`/api/current-user`)
    return data
  },
}

export default currentUserApi

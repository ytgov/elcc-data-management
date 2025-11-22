import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

// Must match roles in api/src/models/user.ts
export enum UserRoles {
  EDITOR = "Editor",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin",
  SYSTEM_ADMINISTRATOR = "System Administrator",
}

export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  roles: UserRoles[]
  status: string
  createdAt: string
  updatedAt: string
} & {
  displayName: string
}

export type UserPolicy = Policy

export type UserAsShow = User

export type UserAsIndex = User

export type UserWhereOptions = WhereOptions<
  User,
  "id" | "email" | "firstName" | "lastName" | "status" | "roles"
>

export type UserFiltersOptions = FiltersOptions<{
  search: string | string[]
}>

export type UserQueryOptions = QueryOptions<UserWhereOptions, UserFiltersOptions>

export const usersApi = {
  UserRoles,

  async list(params: UserQueryOptions = {}): Promise<{
    users: UserAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/users", {
      params,
    })
    return data
  },
  async get(userId: number): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.get(`/api/users/${userId}`)
    return data
  },
  async create(attributes: Partial<User>): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.post("/api/users", attributes)
    return data
  },
  async update(
    userId: number,
    attributes: Partial<User>
  ): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.patch(`/api/users/${userId}`, attributes)
    return data
  },
  async delete(userId: number): Promise<void> {
    const { data } = await http.delete(`/api/users/${userId}`)
    return data
  },
}

export default usersApi

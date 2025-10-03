// Must match roles in api/src/models/user-role.ts
export enum RoleTypes {
  EDITOR = "Editor",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin",
  SYSTEM_ADMINISTRATOR = "System Administrator",
}

export type UserRole = {
  id: number
  userId: number
  role: RoleTypes
  createdAt: Date
  updatedAt: Date
}

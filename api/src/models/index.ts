import User, { UserStatus } from "@/models/user"
import UserRole from "@/models/user-role"

User.establishasAssociations()
UserRole.establishasAssociations()

export { User, UserStatus, UserRole }

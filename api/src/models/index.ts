import User from "@/models/user"
import UserRole from "@/models/user-role"

User.establishasAssociations()
UserRole.establishasAssociations()

export * from "@/models/centre"
export * from "@/models/user"
export * from "@/models/user-role"

// I want to keep default exports to encourage the "single thing per file" principle
// you can still access the model bundle via import * as models from "@/models"
// but import models from "@/models" will be undefined
// Its not ideal, but it's hopefully the best of both worlds?
// Avoids leaking random last default export from model files
export default undefined

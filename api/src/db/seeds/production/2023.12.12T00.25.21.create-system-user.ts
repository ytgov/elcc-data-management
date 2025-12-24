import { isNil } from "lodash"

import { User } from "@/models"

export async function up() {
  let systemUser = await User.findOne({
    where: {
      email: "system.user@elcc.com",
    },
  })
  if (isNil(systemUser)) {
    systemUser = await User.create({
      email: "system.user@elcc.com",
      sub: "NO_LOGIN_system.user@elcc.com",
      firstName: "System",
      lastName: "User",
      status: User.Status.ACTIVE,
      roles: [User.Roles.SYSTEM_ADMINISTRATOR],
    })
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}

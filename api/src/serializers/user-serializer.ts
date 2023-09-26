import { User } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class UserSerializer extends BaseSerializer<User> {
  constructor(userOrUsers: User | User[]) {
    super(userOrUsers)
    // this.#registerTableView()
  }

  protected registerDefaultView() {
    const defaultView = this.addView("default")
    defaultView.addFields(
      "email",
      "sub",
      "firstName",
      "lastName",
      "status",
      "isAdmin",
      "ynetId",
      "directoryId",
      "createDate"
    )

    defaultView.addField(
      "displayName",
      (user: User): string => `${user.firstName} ${user.lastName}`
    )
    return defaultView
  }

  // #registerTableView() {}
}

export default UserSerializer

// Until I get a test suite spun up, these are the tests :cry:
// import { User } from "@/models"
// import UserSerializer from "@/serializers/user-serializer"

// User.findAll().then((users) => {
//   const serializedUsers1 = UserSerializer.serialize(users)
//   const serializedUsers2 = UserSerializer.serialize(users, { view: "default" })
//   const userSerializerInstance = new UserSerializer(users)
//   const serializedUsers3 = userSerializerInstance.serialize()
//   const serializedUsers4 = userSerializerInstance.serialize({ view: "default" })
//   // const serializedUsers4 = usersSerializer.defaultView()
//   // const serializedUsers5 = UserSerializer.defaultView(users)

//   const serializedUser1 = UserSerializer.serialize(users[0])
//   const serializedUser2 = UserSerializer.serialize(users[0], { view: "default" })
//   const userSerializerInstance2 = new UserSerializer(users[0])
//   const serializedUser3 = userSerializerInstance2.serialize()
//   const serializedUser4 = userSerializerInstance2.serialize({ view: "default" })
//   // const serializedUser = userSerializerInstance2.defaultView()
//   // const serializedUser4 = UserSerializer.dufaultView(users[0])

//   console.log([
//     serializedUsers1,
//     serializedUsers2,
//     serializedUsers3,
//     serializedUsers4,
//     serializedUser1,
//     serializedUser2,
//     serializedUser3,
//     serializedUser4
//   ])
//   return true
// })

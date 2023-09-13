import axios from "axios"
import { isNil } from "lodash"

import { AUTH0_DOMAIN } from "@/config"

const auth0Api = axios.create({
  baseURL: AUTH0_DOMAIN,
})

interface Auth0UserInfo {
  email: string
  firstName: string
  lastName: string
  sub: string
}

function getUserInfo(token: string): Promise<Auth0UserInfo> {
  return auth0Api.get("/userinfo", { headers: { authorization: token } }).then(({ data }) => {
    // TODO: write a type for the auth0 response and assert that the payload conforms to it
    if (isNil(data.sub)) {
      // TODO: this might not even be possible?
      throw new Error("Payload from Auth0 is missing a subject.")
    }
    const firstName = data.given_name || "UNKNOWN"
    const lastName = data.family_name || "UNKNOWN"
    return {
      email: data.email || `${firstName}.${lastName}@yukon-no-email.ca`,
      firstName,
      lastName,
      sub: data.sub,
    }
  })
}

export default { getUserInfo }

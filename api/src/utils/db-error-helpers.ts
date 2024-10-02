import { has } from "lodash"

export function isCredentialFailure(error: unknown) {
  return (
    error instanceof Error &&
    ((has(error, "code") && error.code === "ELOGIN") ||
      error.message.includes("Login failed for user"))
  )
}

export function isSocketFailure(error: unknown) {
  return error instanceof Error && has(error, "code") && error.code === "ESOCKET"
}

export function isNetworkFailure(error: unknown) {
  return (
    error instanceof Error &&
    ((has(error, "code") && error.code === "EAI_AGAIN") ||
      error.message.includes("getaddrinfo EAI_AGAIN"))
  )
}

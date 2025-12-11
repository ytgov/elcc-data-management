import { merge } from "lodash"

import { type Policy } from "@/api/base-api"
import currentUserApi, { type UserAsShow, UserRoles } from "@/api/current-user-api"

export const DEFAULT_USER: UserAsShow = {
  id: 1,
  email: "default-mock-user@example.com",
  firstName: "Default",
  lastName: "User",
  displayName: "Default User",
  roles: [UserRoles.USER],
  status: "active",
  ynetId: "default-ynet-id",
  directoryId: "default-directory-id",
  createdAt: "1970-01-01T00:00:00.000Z",
  updatedAt: "1970-01-01T00:00:00.000Z",
}

export const DEFAULT_POLICY: Policy = {
  show: true,
  create: false,
  update: true,
  destroy: false,
}

/**
 * Usage:
 * At the top section of a test file import:
 *   import { mockCurrentUserApi } from "@/tests/support"
 *
 * Then where you want to set the current user:
 *   mockCurrentUserApi({ user, policy })
 *
 * Note that all values for user and policy are optional as minium safe defaults are provided.
 * Note that order of operations matters. This file must be imported before any file that imports currentUserApi.
 * As such this file has been imported and mocked in the pre-test run "web/tests/setup.ts" file.
 *
 * @param currentUserApiGetResponseWithDefaults - The response to set for the current user
 */
export function mockCurrentUserApi(
  currentUserApiGetResponseWithDefaults: { user?: UserAsShow; policy?: Policy } = {}
) {
  vi.mock("@/api/current-user-api")

  const userWithDefaults = merge({}, DEFAULT_USER, currentUserApiGetResponseWithDefaults.user)
  const policyWithDefaults = merge({}, DEFAULT_POLICY, currentUserApiGetResponseWithDefaults.policy)

  const mockedCurrentUserApi = vi.mocked(currentUserApi, true)
  mockedCurrentUserApi.get.mockResolvedValue({
    user: userWithDefaults,
    policy: policyWithDefaults,
  })
}

export default mockCurrentUserApi

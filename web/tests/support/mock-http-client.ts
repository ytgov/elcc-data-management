import httpClient from "@/api/http-client"

vi.mock("@/api/http-client")

/**
 * Usage:
 * At the top section of a test file import:
 *   import { mockHttpClient } from "@/tests/support"
 *
 * Then where you want to set the http client:
 *   mockHttpClient()
 *
 * Note that order of operations matters. This file must be imported before any file that imports httpClient.
 * As such this file has been imported and mocked in the pre-test run "web/tests/setup.ts" file.
 *
 * @returns The mocked http client
 */
export function mockHttpClient() {
  const httpClientMock = vi.mocked(httpClient, true)

  httpClientMock.get.mockResolvedValue({
    data: {},
  })
  httpClientMock.post.mockResolvedValue({
    data: {},
  })
  httpClientMock.put.mockResolvedValue({
    data: {},
  })
  httpClientMock.patch.mockResolvedValue({
    data: {},
  })
  httpClientMock.delete.mockResolvedValue({
    data: {},
  })

  return httpClientMock
}

export default mockHttpClient

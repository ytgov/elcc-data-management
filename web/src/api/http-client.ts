import qs from "qs"
import axios from "axios"

import { API_BASE_URL } from "@/config"
import { AuthHelper as auth0 } from "@/plugins/auth"

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: "brackets" })
    },
  },
})

httpClient.interceptors.request.use(async (config) => {
  console.log("auth0:", auth0)

  const accessToken = await auth0.getAccessTokenSilently()
  config.headers["Authorization"] = `Bearer ${accessToken}`
  return config
})

httpClient.interceptors.response.use(null, (error) => {
  // Any status codes that falls outside the range of 2xx causes this function to trigger
  if (error?.response?.data?.message) {
    throw new Error(error.response.data.message)
  } else if (error.message) {
    throw new Error(error.message)
  } else {
    throw new Error("An unknown error occurred")
  }
})

export default httpClient

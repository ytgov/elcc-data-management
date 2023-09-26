import * as config from "./config"

export const PROFILE_URL = `${config.API_BASE_URL}/api/user/me`
export const USERS_URL = `${config.API_BASE_URL}/api/user`
export const HEALTHCHECK_URL = `${config.API_BASE_URL}/api/healthcheck`

// App specific URLS
export const CENTRE_URL = `${config.API_BASE_URL}/api/centre`
export const FUNDING_PERIOD_URL = `${config.API_BASE_URL}/api/funding-period`
export const SUBMISSION_LINES_URL = `${config.API_BASE_URL}/api/submission-line`

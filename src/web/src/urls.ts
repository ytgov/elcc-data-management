import * as config from "./config";

export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;
export const USERS_URL = `${config.apiBaseUrl}/api/user`;
export const HEALTHCHECK_URL = `${config.apiBaseUrl}/api/healthcheck`;

// App specific URLS
export const CENTRE_URL = `${config.apiBaseUrl}/api/centre`;
export const FUNDING_PERIOD_URL = `${config.apiBaseUrl}/api/funding-period`;
export const SUBMISSION_LINES_URL = `${config.apiBaseUrl}/api/submission-line`;

import * as config from "./config";

export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;
export const USERS_URL = `${config.apiBaseUrl}/api/user`;
export const HEALTHCHECK_URL = `${config.apiBaseUrl}/api/healthcheck`;

// App specific URLS
export const SOME_ENDPOINT_URL = `${config.apiBaseUrl}/api/some-endpoint`;

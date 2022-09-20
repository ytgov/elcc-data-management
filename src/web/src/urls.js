
import * as config from "./config";

export const AUTH_CHECK_URL = `${config.apiBaseUrl}/api/auth/isAuthenticated`;
export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;
export const USER_URL = `${config.apiBaseUrl}/api/user`;

export const HEALTHCHECK_URL = `${config.apiBaseUrl}/api/healthcheck`;
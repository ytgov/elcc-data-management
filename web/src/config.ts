// TODO: replace this with pattern used in https://github.com/icefoganalytics/wrap/blob/22fa9f3837fc421199d72cdcc8944d3e3bfc4c01/web/src/config.ts
import {
  client_id as AUTH0_CLIENT_ID,
  audience as AUTH0_AUDIENCE,
  domain as AUTH0_DOMAIN,
} from "../auth-config.json"

export { AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_CLIENT_ID }

export const ENVIRONMENT = import.meta.env.MODE

// Generally we use window.location.origin for the redirect_uri but if
// you may want to use a different URL for the redirect_uri. Make sure you
// make the related changes in @/config.js and @/plugins/auth.js

// export const AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export const applicationName = "Vue 3 Template"
export const applicationIcon = "mdi-leaf"
export const hasSidebar = true
export const hasSidebarClosable = false

// @ts-expect-error
export const environment = process.env.NODE_ENV

// Generally we use window.location.origin for the redirect_uri but if
// you may want to use a different URL for the redirect_uri. Make sure you
// make the related changes in @/config.js and @/plugins/auth.js

// export const AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI;

// @ts-expect-error
const API_HOST_NAME = process.env.API_HOST_NAME || "localhost"
export const API_BASE_URL = environment == "production" ? "" : `http://${API_HOST_NAME}:3000`

export const applicationName = "Vue 3 Template"
export const applicationIcon = "mdi-leaf"
export const hasSidebar = true
export const hasSidebarClosable = false
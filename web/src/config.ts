// @ts-expect-error
export const environment = process.env.NODE_ENV

// Generally we use window.location.origin for the redirect_uri but if
// you may want to use a different URL for the redirect_uri. Make sure you
// make the related changes in @/config.js and @/plugins/auth.js

// export const AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI;

// @ts-expect-error
export const API_BASE_URL = process.env.API_BASE_URL || ""

export const applicationName = "Vue 3 Template"
export const applicationIcon = "mdi-leaf"
export const hasSidebar = true
export const hasSidebarClosable = false

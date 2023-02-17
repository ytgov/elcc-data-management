// @ts-ignore
export const environment = process.env.NODE_ENV;

// Generally we use window.location.origin for the redirect_uri but if
// you may want to use a different URL for the redirect_uri. Make sure you
// make the related changes in @/config.js and @/plugins/auth.js

//export const AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI;

export const apiBaseUrl = environment == "production" ? "" : "http://localhost:3000";

// @ts-ignore
export const applicationUrl = process.env.VUE_APP_FRONTEND_URL || "http://localhost:8080";

export const applicationName = "Vue 3 Template";
export const applicationIcon = "mdi-leaf";
export const hasSidebar = true;
export const hasSidebarClosable = false;

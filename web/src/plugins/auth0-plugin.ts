import { createAuth0 } from "@auth0/auth0-vue"

import { ENVIRONMENT, AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_CLIENT_ID } from "@/config"

// The "@auth0/auth0-vue" library composables to load and manage
// authentication information.  In components this information is available
// via this.$auth0.

// However the same auth information is not available to Pinia stores becuase
// of the way that composables work.  So, the authStore loads in @/App.vue to
// work around this issue.

export default createAuth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: AUTH0_AUDIENCE,
    redirect_uri: window.location.origin,
  },
  // Uncomment the following line to use the config from .env file
  // redirect_uri: REDIRECT_URI,
  cacheLocation: ENVIRONMENT === "development" ? "localstorage" : "memory",
})

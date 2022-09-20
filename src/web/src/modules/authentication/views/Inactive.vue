<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <h3>Please use your YNET credentials to sign in</h3>
    <p>
      The authentication for this application is managed by an authentication
      partner. When you click the button below, you will be redirected to their
      site and once authenticated, back here.
    </p>
    <p>
      If you have already authenticated and your session is still active, it may
      skip the sign in process and return you here immediately.
    </p>

    <v-btn
      v-if="!$auth.isAuthenticated"
      @click="$auth.loginWithRedirect()"
      color="primary"
    >
      Sign In
    </v-btn>
  </div>
</template>

<script>
import * as config from "@/config";
import { getInstance } from "@/auth/auth0-plugin";

export default {
  name: "Login",
  data: () => ({
    title: `Sign in to ${config.applicationName}`,
  }),
  async created() {
    const authService = getInstance();

    let i = window.setInterval(() => {
      if (authService.isLoading === false) {
        window.clearInterval(i);

        if (authService.isAuthenticated) {
          this.$router.push("/dashboard");
        }
      }
    }, 250);
  },
  methods: {},
};
</script>

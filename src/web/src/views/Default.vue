<template>
  <v-overlay>
    <div class="text-center">
      <v-progress-circular
        indeterminate
        size="64"
        class="mb-5"
      ></v-progress-circular>
      <h1 class="title">{{ title }}</h1>
    </div>
  </v-overlay>
</template>

<script>
import { applicationName } from "../config";
import { getInstance } from "@/auth/auth0-plugin";

export default {
  name: "Default",
  data: () => ({
    title: `Loading ${applicationName}`,
  }),
  methods: {},
  computed: {},
  watch: {},
  async mounted() {
    const authService = getInstance();

    let i = window.setInterval(() => {
      if (authService.isLoading === false) {
        window.clearInterval(i);

        // RA: I think this is forcing the user to always return to the dashboard
        if (authService.isAuthenticated) {
          this.$router.push("/dashboard");
        } else this.$router.push("/sign-in");
      }
    }, 1000);
  },
};
</script>

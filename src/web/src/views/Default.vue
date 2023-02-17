<template>
  <v-overlay>
    <div class="text-center">
      <v-progress-circular indeterminate size="64" class="mb-5"></v-progress-circular>
      <h1 class="title">Loading</h1>
    </div>
  </v-overlay>
</template>
<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "Default",
  components: {},
  mounted() {
    const auth = useAuth0();

    let i = window.setInterval(() => {
      if (auth.isLoading) {
        window.clearInterval(i);

        if (auth.isAuthenticated && auth.user.value) {
          console.log(auth.user.value);

          this.$router.push("/dashboard");
        } else this.$router.push("/sign-in");
      }
    }, 250);
  },
};
</script>

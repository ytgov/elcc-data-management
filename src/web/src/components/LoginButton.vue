<template>
  <div>
    <v-btn dark color="primary" @click="login">Sign In</v-btn>
  </div>
</template>

<script lang="ts">
export default {
  data: function () {
    return {};
  },
  methods: {
    login() {
      this.$auth0.loginWithRedirect({
        appState: { target: window.location.pathname },
      });
    },
  },
  computed: {},
};
</script>
r

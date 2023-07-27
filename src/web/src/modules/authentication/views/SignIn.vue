<template>
  <v-container
    tag="section"
    class="mt-10"
  >
    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        lg="11"
        sm="8"
        xl="7"
      >
        <v-card
          class="elevation-5"
          style="overflow: hidden"
        >
          <v-row>
            <v-col
              lg="7"
              style="background-color: #f9f4d4"
              class="d-none d-md-flex align-center justify-center"
            >
              <div class="d-none d-sm-block">
                <img
                  src="@/assets/logo.svg"
                  alt="Logo"
                  class="d-md-block pl-6"
                />
                <div class="align-center pa-6">
                  <h2
                    class="text-h5 mb-2"
                    style="line-height: 40px"
                  >
                    {{ applicationTitle }}
                  </h2>
                  <h6 class="text-subtitle-1 mt-0">{{ applicationSubtitle }}</h6>
                </div>
              </div>
            </v-col>
            <v-col lg="5">
              <div class="pa-7 pa-sm-12">
                <div
                  style="background-color: #f9f4d4"
                  class="pa-5 d-md-none"
                >
                  <img
                    src="@/assets/logo.svg"
                    alt="Logo"
                    class="d-md-inline"
                  />
                  <h2
                    class="display-1 font-weight-medium"
                    style="line-height: 40px"
                  >
                    {{ applicationTitle }}
                  </h2>
                  <h6 class="text-subtitle-1 mt-4 op-5 font-weight-regular">
                    {{ applicationSubtitle }}
                  </h6>
                </div>

                <h2 class="text-h5 mt-4">Sign in</h2>
                <h6 class="text-subtitle-2 mt-3 mb-5">
                  This application is only available to authorized users. If you have an account,
                  click the button below.
                </h6>

                <LoginButton />
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import LoginButton from "@/components/LoginButton.vue"

export default {
  name: "SignIn",
  components: { LoginButton },
  data: () => ({
    applicationTitle: "ELCC Data Management",
    applicationSubtitle: "Department of Education",
  }),
  mounted() {
    if (this.$auth0.isAuthenticated.value) this.$router.push("/dashboard")
  },
}
</script>

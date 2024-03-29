<template>
  <v-app-bar
    app
    color="#fff"
    flat
    height="70"
    style="left: 0; border-bottom: 3px #f3b228 solid"
  >
    <img
      src="/yukon.svg"
      style="margin: -10px 85px 0 14px"
      height="44"
    />
    <!-- <v-img class="ml-0m pl-0" src="src/assets/yukon.svg" height="44" /> -->
    <v-app-bar-title
      class="pt-0 font-weight-bold"
      style="margin-left: -20px"
      >{{ title }}</v-app-bar-title
    >

    <template #append>
      <div v-if="isAuthenticated">
        <v-btn
          color="primary"
          class="mr-1"
          to="/dashboard"
          icon="mdi-home"
        ></v-btn>

        <v-divider
          class="mr-5"
          vertical
          inset
        ></v-divider>
        <span style="font-size: 0.9rem"> {{ username }} </span>
        <span
          class="pl-3"
          @click="toggleAdmin()"
        >
          <v-chip
            v-if="isAdmin"
            color="yg_moss"
          >
            Admin
          </v-chip>
          <v-chip
            v-else
            color="yg_twilight"
          >
            User
          </v-chip>
        </span>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              color="primary"
              v-bind="props"
            ></v-btn>
          </template>

          <v-list density="compact">
            <v-list-item to="/profile">
              <template #prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <v-list-item-title style="font-size: 0.9rem !important">My profile</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="isAdmin"
              to="/administration"
            >
              <template #prepend>
                <v-icon>mdi-cogs</v-icon>
              </template>
              <v-list-item-title style="font-size: 0.9rem !important"
                >Administration</v-list-item-title
              >
            </v-list-item>
            <v-divider />
            <v-list-item :to="{ name: 'StatusPage' }">
              <template #prepend>
                <v-icon>mdi-clock</v-icon>
              </template>
              <v-list-item-title>{{ releaseTag }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logoutClick">
              <template #prepend>
                <v-icon>mdi-exit-run</v-icon>
              </template>
              <v-list-item-title style="font-size: 0.9rem !important">Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <login-button />
      </div>
    </template>
  </v-app-bar>

  <v-main>
    <!-- Provides the application the proper gutter -->
    <!-- fill-height causes the main content to fill the entire page -->
    <v-container
      fluid
      class="page-wrapper"
    >
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-overlay
    v-model="showOverlay"
    class="align-center justify-center"
  >
    <div class="text-center">
      <v-progress-circular
        indeterminate
        size="64"
        class="mb-5"
        color="#f3b228"
        width="6"
      ></v-progress-circular>
      <h2>Loading {{ title }}</h2>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { mapState, mapActions, mapWritableState } from "pinia"

import http from "@/api/http-client"

import { useUserStore } from "@/store/UserStore"
import { useNotificationStore } from "@/store/NotificationStore"

import { useCentreStore } from "@/modules/centre/store"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"

const UNSET_RELEASE_TAG = "2024.01.10.0"

export default {
  name: "Default",

  data() {
    return {
      isAuthenticated: this.$auth0.isAuthenticated,
      authUser: this.$auth0.user,
      showOverlay: true,
      releaseTag: UNSET_RELEASE_TAG,
    }
  },
  computed: {
    ...mapWritableState(useNotificationStore, ["showNotification"]),
    ...mapState(useUserStore, ["user", "isAdmin"]),

    title() {
      return "ELCC Data Management"
    },
    username() {
      return this.authUser.name
    },
  },

  async mounted() {
    await this.initialize()
    await this.initCentres()
    await this.initLines()
    await this.fetchVersion()
    this.showOverlay = false
  },
  methods: {
    ...mapActions(useUserStore, ["initialize", "toggleAdmin"]),
    ...mapActions(useCentreStore, { initCentres: "initialize" }),
    ...mapActions(useSubmissionLinesStore, { initLines: "initialize" }),

    logoutClick() {
      this.$auth.logout({ logoutParams: { returnTo: window.location.origin } })
    },
    fetchVersion() {
      http
        .get("/_status")
        .then(({ data }) => {
          this.releaseTag = data.RELEASE_TAG
        })
        .catch((error: unknown) => {
          console.error(`Error fetching version: ${error}`)
        })
    },
  },
}
</script>

<style scoped>
.v-list-item__prepend > .v-icon {
  margin-inline-end: 12px;
}
</style>

<template>
  <v-app-bar
    app
    color="#fff"
    flat
    height="70"
    style="left: 0; border-bottom: 3px #f3b228 solid"
  >
    <router-link
      :to="{
        name: 'DashboardPage',
      }"
      style="line-height: 0"
    >
      <img
        src="/yukon.svg"
        style="margin: -10px 85px 0 14px"
        height="44"
      />
    </router-link>
    <!-- <v-img class="ml-0m pl-0" src="src/assets/yukon.svg" height="44" /> -->
    <router-link
      :to="{
        name: 'DashboardPage',
      }"
      style="line-height: 0"
    >
      <v-app-bar-title
        class="pt-0 font-weight-bold"
        style="margin-left: -20px"
        >{{ title }}</v-app-bar-title
      >
    </router-link>

    <template #append>
      <v-btn
        color="primary"
        class="mr-1"
        :to="{
          name: 'DashboardPage',
        }"
        icon="mdi-home"
      ></v-btn>

      <v-divider
        class="mr-5"
        vertical
        inset
      ></v-divider>
      <router-link
        :to="{
          name: 'ProfilePage',
        }"
        style="font-size: 0.9rem"
        class="text-black"
      >
        {{ displayName }}
      </router-link>
      <span
        class="pl-3"
        @click="toggleAdmin"
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
          <v-list-item
            :to="{
              name: 'ProfilePage',
            }"
          >
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
          <v-list-item
            :to="{
              name: 'StatusPage',
            }"
          >
            <template #prepend>
              <v-icon>mdi-clock</v-icon>
            </template>
            <v-list-item-title>{{ releaseTag }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="signOut">
            <template #prepend>
              <v-icon>mdi-exit-run</v-icon>
            </template>
            <v-list-item-title style="font-size: 0.9rem !important">Sign out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"

import http from "@/api/http-client"

import useCurrentUser from "@/use/use-current-user"
import { useUserStore } from "@/store/UserStore"

const UNSET_RELEASE_TAG = "2024.01.10.0"

const { logout } = useAuth0()
const { currentUser, isAdmin, reset: resetCurrentUser } = useCurrentUser<true>()

const releaseTag = ref(UNSET_RELEASE_TAG)

const title = computed(() => "ELCC Data Management")
const displayName = computed(() => currentUser.value.displayName)

onMounted(async () => {
  await fetchVersion()
})

const userStore = useUserStore()

async function toggleAdmin() {
  userStore.toggleAdmin()
}

function signOut() {
  resetCurrentUser()

  // TODO: add support for redirect to /sign-in
  // const returnTo = encodeURI(window.location.origin + "/sign-in")
  const returnTo = window.location.origin

  return logout({
    logoutParams: {
      returnTo,
    },
  })
}

async function fetchVersion() {
  try {
    const { data } = await http.get("/_status")
    releaseTag.value = data.RELEASE_TAG
  } catch (error: unknown) {
    console.error(`Error fetching version: ${error}`, { error })
  }
}
</script>

<style scoped>
.v-list-item__prepend > .v-icon {
  margin-inline-end: 12px;
}
</style>

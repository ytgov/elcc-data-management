<template>
  <v-menu offset-y>
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-dots-vertical"
        color="primary"
        v-bind="activatorProps"
      />
    </template>

    <v-list>
      <v-list-item
        class="py-4 px-8"
        :to="{
          name: 'ProfilePage',
        }"
      >
        <template #prepend>
          <v-avatar color="primary">
            <v-icon color="white">mdi-account-circle-outline</v-icon>
          </v-avatar>
        </template>
        <h4 class="font-weight-semibold">My Profile</h4>
        <p class="font-weight-regular">Manage your information</p>
      </v-list-item>

      <v-list-item
        v-if="isSystemAdmin"
        class="py-4 px-8"
        :to="{
          name: 'AdministrationPage',
        }"
      >
        <template #prepend>
          <v-avatar color="accent">
            <v-icon color="white">mdi-cog-outline</v-icon>
          </v-avatar>
        </template>
        <h4 class="font-weight-semibold">Administration</h4>
        <p class="font-weight-regular">Manage this application</p>
      </v-list-item>

      <v-divider />

      <v-list-item
        class="py-4 px-8"
        :to="{
          name: 'StatusPage',
        }"
      >
        <template #prepend>
          <v-avatar color="secondary">
            <v-icon color="white">mdi-clock-outline</v-icon>
          </v-avatar>
        </template>
        <h4 class="font-weight-semibold">Version</h4>
        <p class="font-weight-regular">
          {{ releaseTag }}
        </p>
      </v-list-item>

      <v-list-item
        class="py-4 px-8"
        @click="signOut"
      >
        <template #prepend>
          <v-avatar color="error">
            <v-icon color="white">mdi-logout-variant</v-icon>
          </v-avatar>
        </template>
        <h4 class="font-weight-semibold">Sign Out</h4>
        <p class="font-weight-regular">End your session</p>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"

import http from "@/api/http-client"

import useCurrentUser from "@/use/use-current-user"

const UNSET_RELEASE_TAG = "2024.01.10.0"

const { logout } = useAuth0()
const { isSystemAdmin, reset: resetCurrentUser } = useCurrentUser<true>()

const releaseTag = ref(UNSET_RELEASE_TAG)

onMounted(async () => {
  await fetchVersion()
})

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

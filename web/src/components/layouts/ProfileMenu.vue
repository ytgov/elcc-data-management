<template>
  <v-menu offset-y>
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-dots-vertical"
        color="primary"
        v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-list>
      <v-list-item
        class="py-4 px-8"
        :to="{
          name: 'ProfilePage',
        }"
      >
        <template #prepend>
          <v-icon>mdi-account</v-icon>
        </template>
        <v-list-item-title>My profile</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-if="isSystemAdmin"
        class="py-4 px-8"
        :to="{
          name: 'AdministrationPage',
        }"
      >
        <template #prepend>
          <v-icon>mdi-cogs</v-icon>
        </template>
        <v-list-item-title>Administration</v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item
        class="py-4 px-8"
        :to="{
          name: 'StatusPage',
        }"
      >
        <template #prepend>
          <v-icon>mdi-clock</v-icon>
        </template>
        <v-list-item-title>{{ releaseTag }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        class="py-4 px-8"
        @click="signOut"
      >
        <template #prepend>
          <v-icon>mdi-exit-run</v-icon>
        </template>
        <v-list-item-title>Sign out</v-list-item-title>
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

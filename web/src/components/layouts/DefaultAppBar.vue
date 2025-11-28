<template>
  <v-app-bar
    app
    color="#fff"
    flat
    height="70"
    style="left: 0; border-bottom: 3px #f3b228 solid; padding-bottom: 3px"
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

      <UserRoleHighestChip
        class="ml-3"
        :roles="currentUser.roles"
      />

      <ProfileMenu />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue"

import ProfileMenu from "@/components/layouts/ProfileMenu.vue"
import UserRoleHighestChip from "@/components/users/UserRoleHighestChip.vue"

import useCurrentUser from "@/use/use-current-user"

const { currentUser } = useCurrentUser<true>()

const title = computed(() => "ELCC Data Management")
const displayName = computed(() => currentUser.value.displayName)
</script>

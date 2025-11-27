<template>
  <HeaderActionsCard
    title="My Profile"
    elevation="3"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="First name"
          :model-value="currentUser.firstName"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Last name"
          :model-value="currentUser.lastName"
          vertical
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Email"
          :model-value="currentUser.email"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <h3 class="mb-2">Roles</h3>
        <UserRoleChip
          v-for="role in currentUser.roles"
          :key="role"
          class="ma-1"
          :role="role"
        />
      </v-col>
    </v-row>
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import UserRoleChip from "@/components/users/UserRoleChip.vue"

const { currentUser } = useCurrentUser<true>()

const title = computed(() => currentUser.value?.displayName || "My Profile")
const breadcrumbs = [
  {
    title: "Dashboard",
    to: {
      name: "DashboardPage",
    },
  },
  {
    title: "My Profile",
    to: {
      name: "ProfilePage",
    },
  },
]

useBreadcrumbs(title, breadcrumbs)
</script>

<template>
  <PageLoader v-if="isNil(user)" />
  <HeaderActionsCard
    v-else
    title="User Details"
  >
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/users/UserEditPage',
          params: {
            userId: props.userId,
          },
        }"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="policy?.destroy"
        class="mt-2 mt-md-0 ml-md-2"
        color="error"
        :loading="isDeleting"
        @click="deleteUser(userIdAsNumber)"
      >
        Delete
      </v-btn>
    </template>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Display Name"
          :model-value="user.displayName"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Email"
          :model-value="user.email"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Status"
          :model-value="user.status"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="System Admin"
          :model-value="isSystemAdmin ? 'Yes' : 'No'"
          vertical
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h3 class="mb-4">Permissions</h3>
    <v-row>
      <v-col cols="12">
        <template v-if="!isEmpty(user.roles)">
          <UserRoleChip
            v-for="role in user.roles"
            :key="role"
            class="ma-1"
            :role="role"
          />
        </template>
        <p
          v-else
          class="text-body-2 text-medium-emphasis"
        >
          No roles assigned
        </p>
      </v-col>
    </v-row>
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { isEmpty, isNil } from "lodash"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"

import usersApi from "@/api/users-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useUser, { UserRoles } from "@/use/use-user"
import useSnack from "@/use/use-snack"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import PageLoader from "@/components/common/PageLoader.vue"
import UserRoleChip from "@/components/users/UserRoleChip.vue"

const props = defineProps<{
  userId: string
}>()

const userIdAsNumber = computed(() => parseInt(props.userId))

const { user, policy } = useUser(userIdAsNumber)
const isSystemAdmin = computed(() => user.value?.roles.includes(UserRoles.SYSTEM_ADMINISTRATOR))

const isDeleting = ref(false)
const snack = useSnack()
const router = useRouter()

async function deleteUser(userId: number) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this user?")) return

  isDeleting.value = true
  try {
    await usersApi.delete(userId)
    snack.success("User deleted.")
    return router.push({
      name: "administration/UsersPage",
    })
  } catch (error) {
    console.error(`Failed to delete user: ${error}`, { error })
    snack.error(`Failed to delete user: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

const title = computed(() => user.value?.displayName || "User")
const displayName = computed(() => user.value?.displayName || "Details")
const breadcrumbs = computed(() => [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Users",
    to: {
      name: "administration/UsersPage",
    },
  },
  {
    title: displayName.value,
    to: {
      name: "administration/users/UserPage",
      params: {
        userId: props.userId,
      },
    },
  },
])

useBreadcrumbs(title, breadcrumbs)
</script>

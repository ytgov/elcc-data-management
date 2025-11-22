<template>
  <HeaderActionsCard title="Edit User">
    <UserEditForm
      :user-id="userIdAsNumber"
      @updated="redirectToUserReadPage"
    />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import UserEditForm from "@/components/users/UserEditForm.vue"

const router = useRouter()

const props = defineProps<{
  userId: string
}>()

const userIdAsNumber = computed(() => parseInt(props.userId))

function redirectToUserReadPage(userId: number) {
  return router.push({
    name: "administration/users/UserPage",
    params: {
      userId,
    },
  })
}

const breadcrumbs = [
  {
    title: "Administration",
    to: {
      name: "administration/UsersPage",
    },
  },
  {
    title: "Users",
    to: {
      name: "administration/UsersPage",
    },
  },
  {
    title: "Edit User",
    to: {
      name: "administration/users/UserEditPage",
      params: {
        userId: props.userId,
      },
    },
  },
]

useBreadcrumbs("Edit User", breadcrumbs)
</script>

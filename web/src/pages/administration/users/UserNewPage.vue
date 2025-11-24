<template>
  <HeaderActionsCard title="New User">
    <UserForm @created="redirectToUserReadPage" />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import UserForm from "@/components/users/UserCreateForm.vue"

const router = useRouter()

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
    title: "New User",
    to: {
      name: "administration/users/UserNewPage",
    },
  },
]
useBreadcrumbs("New User", breadcrumbs)
</script>

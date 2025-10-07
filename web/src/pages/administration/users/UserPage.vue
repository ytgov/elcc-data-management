<template>
  <PageLoader v-if="isNil(user)" />
  <v-card v-else>
    <template #title>
      <h3 class="d-flex align-center text-h5">
        User Details
        <v-spacer />
        <v-btn
          color="primary"
          @click="openEditDialog"
        >
          Edit
        </v-btn>
      </h3>
    </template>

    <template #text>
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
            :model-value="user.isAdmin ? 'Yes' : 'No'"
            vertical
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <h3 class="mb-4">Permissions</h3>
      <v-row>
        <v-col cols="12">
          <p class="text-body-2 text-medium-emphasis">
            Role and permission management coming soon...
          </p>
        </v-col>
      </v-row>
    </template>

    <UserEditorDialog ref="userEditorRef" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useUser from "@/use/use-user"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import PageLoader from "@/components/common/PageLoader.vue"
import UserEditorDialog from "@/components/users/UserEditorDialog.vue"

const props = defineProps<{
  userId: string
}>()

const userIdAsNumber = computed(() => parseInt(props.userId))

const { user } = useUser(userIdAsNumber)

const userEditorRef = useTemplateRef("userEditorRef")

function openEditDialog() {
  userEditorRef.value?.open(userIdAsNumber.value)
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

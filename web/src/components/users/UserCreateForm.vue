<template>
  <v-form @submit.prevent="saveAndNotify">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="userAttributes.email"
          label="Email"
          variant="outlined"
          density="comfortable"
        />

        <v-text-field
          v-model="userAttributes.firstName"
          label="First name"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="userAttributes.lastName"
          label="Last name"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <v-divider vertical />

      <v-col
        cols="12"
        md="6"
      >
        <h3>Roles & Permissions</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Select the roles this user should have. Each role grants specific permissions within the
          system.
        </p>

        <UserRolesAutocomplete v-model="userAttributes.roles" />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          color="primary"
          :loading="isSaving"
          type="submit"
        >
          Create User
        </v-btn>
        <v-spacer />
        <v-btn
          color="warning"
          variant="outlined"
          :to="{
            name: 'administration/UsersPage',
          }"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue"

import usersApi, { type User } from "@/api/users-api"
import useSnack from "@/use/use-snack"

import UserRolesAutocomplete from "@/components/users/UserRolesAutocomplete.vue"

const emit = defineEmits<{
  created: [userId: number]
}>()

const userAttributes = ref<Partial<User>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  roles: [],
})

const isSaving = ref(false)
const snack = useSnack()

async function saveAndNotify() {
  isSaving.value = true
  try {
    const { user } = await usersApi.create(userAttributes.value)
    emit("created", user.id)
    snack.success("User created successfully!")
  } catch (error) {
    console.error(`Failed to create user: ${error}`, { error })
    snack.error(`Failed to create user: ${error}`)
  } finally {
    isSaving.value = false
  }
}
</script>

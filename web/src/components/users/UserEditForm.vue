<template>
  <v-skeleton-loader
    v-if="isNil(user)"
    type="card"
  />
  <v-form
    v-if="!isNil(user)"
    @submit.prevent="saveAndNotify"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.email"
          label="Email"
          variant="outlined"
          density="comfortable"
        />

        <v-text-field
          v-model="user.firstName"
          label="First name"
          variant="outlined"
          density="comfortable"
        />

        <v-text-field
          v-model="user.lastName"
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

        <UserRolesAutocomplete v-model="user.roles" />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          color="primary"
          :loading="isSaving"
          type="submit"
        >
          Save Changes
        </v-btn>
        <v-spacer />
        <v-btn
          color="warning"
          variant="outlined"
          :to="{
            name: 'administration/users/UserPage',
            params: {
              userId,
            },
          }"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { isNil } from "lodash"

import useUser from "@/use/use-user"
import useSnack from "@/use/use-snack"

import UserRolesAutocomplete from "@/components/users/UserRolesAutocomplete.vue"

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits<{
  updated: [userId: number]
}>()

const isSaving = ref(false)
const snack = useSnack()

const { userId } = toRefs(props)
const { user, save } = useUser(userId)

async function saveAndNotify() {
  if (isNil(user.value)) return

  isSaving.value = true
  try {
    const updatedUser = await save()
    emit("updated", updatedUser.id)
    snack.success("User updated successfully!")
  } catch (error) {
    console.error(`Failed to update user: ${error}`, { error })
    snack.error(`Failed to update user: ${error}`)
  } finally {
    isSaving.value = false
  }
}
</script>

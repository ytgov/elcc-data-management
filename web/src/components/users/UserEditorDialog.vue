<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="800"
  >
    <v-card v-if="!isNil(user)">
      <v-toolbar
        color="primary"
        variant="dark"
        title="Edit User"
      >
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="white"
          @click="close"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.displayName"
              label="Name"
              readonly
              variant="outlined"
              density="comfortable"
              append-inner-icon="mdi-lock"
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              label="Email"
              readonly
              variant="outlined"
              density="comfortable"
              append-inner-icon="mdi-lock"
            ></v-text-field>
            <v-select
              v-model="user.status"
              label="Status"
              :items="['Active', 'Inactive']"
              variant="outlined"
              density="comfortable"
            ></v-select>

            <v-checkbox
              v-model="user.isAdmin"
              label="System Admin"
              variant="outlined"
              density="comfortable"
            ></v-checkbox>
          </v-col>
          <v-divider
            vertical
            thickness="1"
          ></v-divider>
          <v-col
            cols="12"
            md="6"
          >
            <h3>Permissions</h3>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          :loading="isSaving"
          @click="saveNotifyAndClose"
          >Save</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="yg-sun"
          variant="outlined"
          :loading="isSaving"
          @click="close"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { isNil } from "lodash"
import { useRouteQuery } from "@vueuse/router"

import { integerTransformer } from "@/utils/use-route-query-transformers"

import useSnack from "@/use/use-snack"
import useUser from "@/use/use-user"

const userId = useRouteQuery<string | null, number | null>("showUserEditor", null, {
  transform: integerTransformer,
})
const { user, save } = useUser(userId)

const visible = ref(false)

function open(newUserId: number) {
  userId.value = newUserId
  visible.value = true
}

function close() {
  visible.value = false
  userId.value = null
}

const isSaving = ref(false)
const snack = useSnack()

async function saveNotifyAndClose() {
  try {
    await save()
    snack.success("User saved!")
    close()
  } catch (error) {
    snack.error(`Failed to save user: ${error}`)
  } finally {
    isSaving.value = false
  }
}

defineExpose({
  open,
  close,
})
</script>

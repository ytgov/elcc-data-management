<template>
  <div>
    <h1>My Profile</h1>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="user.firstName"
          label="First name"
          readonly
          hide-details
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="user.lastName"
          label="Last name"
          readonly
          hide-details
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="user.email"
          label="Email"
          readonly
          hide-details
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="user.roles"
          label="Roles"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
          hide-details
        >
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/store/UserStore"
import { mapState } from "pinia"
export default {
  name: "Profile",
  setup() {},
  data() {
    return {}
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
  },
  methods: {},
}
</script>

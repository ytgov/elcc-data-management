<template>
  <v-card class="mb-7"  elevation="3" color="white" >
    <v-toolbar flat v-if="showHeader" density="comfortable" color="white">
      <v-toolbar-title v-if="heading">
        {{ heading }}
      </v-toolbar-title>
      <slot name="left" />
      <v-spacer></v-spacer>
      <slot name="right" />
    </v-toolbar>
    <v-divider v-if="showHeader"></v-divider>
    <div class="pa-2">
      <slot />
    </div>
  </v-card>
</template>

<script>
export default {
  name: "BaseCard",

  props: {
    heading: {
      type: String,
      default: "",
    },
    showHeader: {
      type: String,
      default: "",
    },
  },
  data: () => ({}),

  methods: {},
};
</script>

<style scoped>
.v-card.basic {
/*   margin-left: -15px !important;
  margin-right: -15px !important; */
  /* max-width: none !important;
  border: 1px yg_moss solid !important */
}
</style>

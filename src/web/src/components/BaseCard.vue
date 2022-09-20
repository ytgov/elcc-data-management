<template>
  <v-card class="mb-7 basic">
    <v-toolbar flat v-if="showHeader">
      <v-toolbar-title>
        {{ heading }}
      </v-toolbar-title>
      <slot name="left" />
      <v-spacer></v-spacer>
      <slot name="right" />
    </v-toolbar>
    <v-divider v-if="showHeader"></v-divider>
    <div class="pa-4">
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
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),

  methods: {},
};
</script>

<style scoped>
.v-card.basic {
  margin-left: -25px !important;
  margin-right: -25px !important;
  max-width: none !important;
}
</style>
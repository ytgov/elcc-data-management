<template>
  <v-row class="page-breadcrumb">
    <v-col cols="12" sm="12" class="pa-0">
      <v-card class="px-2 custom-shadow" style="background-color: #efefef">
        <div class="mt-9" style="float: right"><slot name="right"> </slot></div>

        <v-toolbar dense flat class="transparent pa-0" height="40px">
          <v-toolbar-title class="pt-3">
            <span class="text--primary">{{ title }}</span>
          </v-toolbar-title>
          <v-toolbar-title
            class="toobar-extension transparent pb-3"
            slot="extension"
          >
            <v-breadcrumbs :items="breadcrumbs" class="pa-0">
              <template v-slot:divider v-if="breadcrumbs">
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "BaseBreadcrumb",
  props: {
    title: String,
    breadcrumbs: Array,
    icon: String,
  },
  data: () => ({}),
};
</script>
<style>
.row.page-breadcrumb {
  margin: -24px -50px 25px -50px;
}
</style>
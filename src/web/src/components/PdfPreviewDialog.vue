<template>
  <v-dialog v-model="dialog" persistent>
    <v-overlay absolute :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular
    ></v-overlay>
    <v-app-bar dark color="#0097A9">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-icon title="Close" @click="hide">mdi-close</v-icon>
    </v-app-bar>
    <v-card tile :height="previewHeight" style="overflow: scroll">
      <v-card-text>
        <pdf :src="pdfUrl" @loaded="doneLoading"></pdf>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import pdf from "vue-pdf";

export default {
  components: { pdf },
  data: () => ({
    dialog: false,
    pdfUrl: "",
    title: "",
    loading: false,
    previewHeight: "200px",
  }),
  methods: {
    show(title, url) {
      this.loading = true;
      this.title = title;
      this.pdfUrl = url;
      this.dialog = true;

      let windowHeight = window.innerHeight;

      if (windowHeight < 400) this.previewHeight = "";
      else this.previewHeight = `${windowHeight - 200}px`;
    },
    hide() {
      this.title = "";
      this.pdfUrl = "";
      this.dialog = false;
      this.loading = false;
    },
    doneLoading() {
      this.loading = false;
    },
  },
};
</script>

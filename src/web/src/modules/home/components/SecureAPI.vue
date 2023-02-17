<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field clearable label="Path" v-model="path"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-toolbar
            density="comfortable"
            title="Secure API Calls"
            color=""
          ></v-toolbar>

          <v-card-text>
            <v-btn class="d-block my-3" @click="get()">Get</v-btn>
            <v-btn class="d-block my-3" @click="put()">Put</v-btn>
            <v-btn class="d-block my-3" @click="post()">Post</v-btn>
            <v-btn class="d-block my-3" @click="del()">Delete</v-btn>
          </v-card-text>
        </v-col>
        <v-col cols="6">
          <v-toolbar density="comfortable" title="Result" color="">
            <v-spacer></v-spacer>
            <v-btn @click="result = ''" v-if="result != ''">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <span>{{ result }} </span>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { useApiStore } from "@/store/ApiStore";
export default {
  setup() {
    const api = useApiStore();
    return { api };
  },
  name: "SecureAPI",
  data() {
    return {
      path: "/some-path",
      result: "",
    };
  },
  methods: {
    get() {
      this.api.secureCall("get", this.path).then((res) => {
        this.result = res;
      });
      // this.secureApiCall("get", "/some-path");
    },
    del() {
      this.api.secureCall("del", this.path).then((res) => {
        this.result = res;
      });
    },
    post() {
      this.api.secureCall("post", this.path).then((res) => {
        this.result = res;
      });
    },
    put() {
      this.api.secureCall("put", this.path).then((res) => {
        this.result = res;
      });
    },
  },
  mounted() {
    // try {
    //   this.secureApiCall("put", "/some-path");
    // } catch (e) {
    //   console.log(e);
    // }
  },
};
</script>

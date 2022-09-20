<template>
  <div>
    <v-slide-x-reverse-transition>
      <v-chip
        v-show="working"
        class="my-0"
        color="gray"
        transition="v-slide-y-transition"
      >
        <v-progress-circular
          indeterminate
          color="#f3b228"
          size="20"
          width="2"
        ></v-progress-circular>
      </v-chip>
    </v-slide-x-reverse-transition>

    <v-slide-x-reverse-transition>
      <v-chip
        v-show="visible"
        class="my-0"
        :color="color"
        transition="v-slide-y-transition"
      >
        <v-icon class="mr-2">{{ icon }}</v-icon>
        {{ text }}
      </v-chip>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
export default {
  name: "TimedMessage",
  data: () => ({
    visible: false,
    color: "",
    text: "",
    icon: "",
    timeout: null,
    working: false,
  }),
  methods: {
    show(color, icon, message) {
      this.text = message;
      this.color = color;
      this.visible = true;
      this.icon = icon;

      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }

      this.timeout = window.setTimeout(() => {
        this.visible = false;
        this.timeout = null;
      }, 4000);
    },
    showError(message) {
      this.text = message;
      this.icon = "mdi-alert-circle-outline"
      this.color = "error";
      this.visible = true;

      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }

      this.timeout = window.setTimeout(() => {
        this.visible = false;
        this.timeout = null;
      }, 4000);
    },
    showWorking() {
      this.working = true;
    },
    hideWorking() {
      this.working = false;
    },
  },
};
</script>  
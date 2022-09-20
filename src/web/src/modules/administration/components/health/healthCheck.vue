<template>
    <div class="py-4 px-4">
        <h4>Health Check</h4>
        <v-card class="mt-5">
            <v-card-text>
                <health-object
                    v-for="(component, idx) in appHealth"
                    :key="idx"
                    :title="component.name"
                    :status="component.status"
                ></health-object>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import HealthObject from "./healthObject.vue";

export default {
    name: "healthCheck",
    components: { HealthObject },
    data: () => ({}),

    computed: {
        ...mapState("administration", ["appHealth"]),
    },
    methods: {
        ...mapActions("administration", ["doHealthCheck"]),
    },

    async mounted() {
        await this.doHealthCheck();
    },
};
</script>

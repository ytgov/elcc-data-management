
<template>
    <div class="py-4 px-4">
        <h4>Data Management</h4>
        <v-card class="mt-5">
            <v-card-text>
                <notifications ref="notifier"></notifications>
                <v-row>
                    <v-col>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="doIt()"
                                    dark
                                    color="yg_twilight"
                                    v-on="on"
                                    class="my-0"
                                >
                                    <v-icon class="mr-3">mdi-database</v-icon>
                                    Seed Data
                                </v-btn>
                            </template>
                            <span
                                >Delete everything in the database and start
                                fresh with seed data</span
                            >
                        </v-tooltip>
                    </v-col>
                    <v-spacer />
                    <v-col>
                        <v-btn
                            color="primary"
                            @click="doNothing()"
                            class="my-0"
                        >
                            Remove Seed Data
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn
                            color="secondary"
                            class="my-0"
                            @click="doNothing()"
                        >
                            Archive Data
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    name: "seedData",
    methods: {
        ...mapActions("administration", ["seedData"]),
        doIt: async function () {
            let m = await this.seedData();
            this.$refs.notifier.show("success", "mdi-check", m);
        },
        doNothing: function () {
            this.$refs.notifier.show(
                "error",
                "mdi-close",
                "Not implemented yet"
            );
        },
    },
};
</script>

<style>
</style>